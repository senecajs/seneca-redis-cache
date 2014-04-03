/* Copyright (c) 2014 Seamus D'Arcy */
"use strict";

var redis = require('redis');

module.exports = function(options, register) {
  var seneca = this;

  options = seneca.util.deepextend({
    redis: {
      port: 6379,
      host: '127.0.0.1'
    }
  }, options);

  var cmds = {};
  var name = 'redis-cache';
  var role = 'cache';

  var cache;

  cmds.set = function(args, cb) {
    var key = args.key;
    var val = args.val;
    cache.set(key, val, function(err, reply) {
      cb(err, key);
    });
  };

  cmds.get = function(args, cb) {
    var key = args.key;
    var val = cache.get(key, function(err, val) {
      cb(err, val);
    });
  };

  cmds.add = function(args, cb) {
    var key = args.key;
    var val = args.val;

    cache.exists(key, function(err, exists) {
      if (exists) {
        return cb(new Error('add failed - key ' + key + ' already exists'));
      }
      cache.set(key, val, function(err, reply) {
        cb(err, key);
      });
    });
  };

  cmds.delete = function(args, cb) {
    cache.del(args.key, function(err, reply) {
      cb(err, args.key);
    });
  };

  function incrdecr(kind) {
    return function(args, cb) {
      var key = args.key;
      var val = args.val;

      cache.get(key, function(err, oldVal) {
        if (!oldVal) return cb(err, null);
        oldVal = parseInt(oldVal, 10);
        if (typeof oldVal !== 'number' || isNaN(oldVal)) {
          return cb(new Error(kind + ' failed - value for key ' + key + ' is not a number'));
        }
        var newVal = kind === 'decr' ? oldVal - val : oldVal + val;
        cache.set(key, newVal, function(err, reply) {
          cb(err, newVal);
        });
      });
    }
  }

  cmds.incr = incrdecr('incr');
  cmds.decr = incrdecr('decr');

  // cache role
  seneca.add({role: role, cmd: 'set'}, cmds.set);
  seneca.add({role: role, cmd: 'get'}, cmds.get);
  seneca.add({role: role, cmd: 'add'}, cmds.add);
  seneca.add({role: role, cmd: 'delete'}, cmds.delete);
  seneca.add({role: role, cmd: 'incr'}, cmds.incr);
  seneca.add({role: role, cmd: 'decr'}, cmds.decr);

  seneca.add({role: 'seneca', cmd: 'close'}, function(args, cb) {
    cache.quit(cb);
  });

  seneca.add({init: name}, function(args, done) {
    cache = redis.createClient(options.redis.port, options.redis.host, options.redis);
    cache.on('connect', function() {
      done();
    });
  });

  register(null, {name: name});

};
