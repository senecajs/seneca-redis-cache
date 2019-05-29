/* Copyright (c) 2014-2019 Richard Rodger, Seamus D'Arcy, and other contributors, MIT License. */
'use strict'

var Redis = require('redis')

module.exports = redis_cache
module.exports.defaults = {
  expire: 60 * 60, // 1 hour
  redis: {
    port: 6379,
    host: '127.0.0.1'
  }
}
module.exports.errors = {
  key_exists: 'Key <%=key%> exists.',
  not_json: 'Value for key <%=key%> is cannot be parsed as JSON: <%=val%>.',
  op_failed_nan:
    'Operation <%=op%> failed for key <%=key%> as value is not a number: <%=oldVal%>.'
}

function redis_cache(options) {
  var seneca = this

  options = seneca.util.deepextend(
    {
      redis: {
        port: 6379,
        host: '127.0.0.1'
      }
    },
    options
  )

  var cmds = {}
  var name = 'redis-cache'
  var role = 'cache'
  var expire = options.expire || 60 * 60

  var cache

  cmds.set = function(msg, reply) {
    var key = msg.key
    var val = JSON.stringify(msg.val)

    cache.set(key, val, 'EX', expire, function(err) {
      reply(err, { key: key })
    })
  }

  cmds.get = function(msg, reply) {
    var seneca = this
    var key = msg.key
    cache.get(key, function(err, val) {
      if (err) {
        reply(err)
      } else {
        try {
          val = JSON.parse(val)
        } catch (err) {
          return reply(
            seneca.error('not_json', { throw$: false, key: key, val: val })
          )
        }
        reply({ value: val })
      }
    })
  }

  cmds.add = function(msg, reply) {
    var seneca = this
    var key = msg.key
    var val = JSON.stringify(msg.val)
    cache.exists(key, function(err, exists) {
      if (err) {
        reply(err)
      }

      if (exists) {
        return reply(seneca.error('key_exists', { throw$: false, key: key }))
      }

      cache.set(key, val, 'EX', expire, function(err) {
        reply(err, { key: key })
      })
    })
  }

  cmds.delete = function(msg, reply) {
    cache.del(msg.key, function(err) {
      reply(err, { key: msg.key })
    })
  }

  function incrdecr(kind) {
    var dir = 'incr' === kind ? 1 : -1
    return function(msg, reply) {
      var seneca = this
      var key = msg.key
      var val = msg.val

      if (val && 1 < val) {
        cache[kind + 'by'](key, val, function(err, outval) {
          if (err) return reply(err)

          var result = 1 + val === dir * outval ? false : outval
          if (false === result) {
            cache.expire(key, expire)
          }
          reply({ value: result })
        })
      } else {
        cache[kind](key, function(err, outval) {
          if (err) return reply(err)

          var result = 1 === dir * outval ? false : outval
          if (false === result) {
            cache.expire(key, expire, function() {})
          }
          reply({ value: result })
        })
      }
    }
  }

  cmds.incr = incrdecr('incr')
  cmds.decr = incrdecr('decr')

  cmds.clear = function(msg, reply) {
    cache.flushall('async',function() {
      reply()
    })
  }
  
  // cache role
  seneca.add({ role: role, cmd: 'set' }, cmds.set)
  seneca.add({ role: role, cmd: 'get' }, cmds.get)
  seneca.add({ role: role, cmd: 'add' }, cmds.add)
  seneca.add({ role: role, cmd: 'delete' }, cmds.delete)
  seneca.add({ role: role, cmd: 'incr' }, cmds.incr)
  seneca.add({ role: role, cmd: 'decr' }, cmds.decr)
  seneca.add({ role: role, cmd: 'clear' }, cmds.clear)

  seneca.add({ role: role, get: 'native' }, function(msg, done) {
    done(null, cache)
  })

  seneca.add({ role: 'seneca', cmd: 'close' }, function(msg, reply) {
    var closer = this
    cache.quit(function(err) {
      closer.log.error('close-error', err)
      this.prior(msg, reply)
    })
  })

  seneca.add({ init: name }, function(msg, done) {
    cache = Redis.createClient(
      options.redis.port,
      options.redis.host,
      options.redis
    )
    cache.on('connect', done)
    cache.on('error', done)
  })

  return { name: name }
}
