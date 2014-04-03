/* Copyright (c) 2014 Seamus D'Arcy */
/*global describe, it */
"use strict";

var seneca = require('seneca')();
seneca.use('..');

var assert = require('assert');
var uuid = require('uuid');

describe('cache', function() {

  var cache = seneca.pin({role: 'cache', cmd: '*'});
  var a = uuid.v4();
  var b = uuid.v4();

  it('set', function(cb) {
    cache.set({key: a, val: 'one'}, function(err, out) {
      assert.equal(err, null);
      assert(out, a);
      cb();
    });
  });

  it('get', function(cb) {
    cache.get({key: a}, function(err, out) {
      assert.equal(err, null);
      assert.equal(out, 'one');
      cb();
    });
  });

  it('add', function(cb) {
    cache.add({key: b, val: 1}, function(err, out) {
      assert.equal(err, null);
      assert.equal(out, b);
      cb();
    });
  });

  it('won\'t add exsting key', function(cb) {
    cache.add({key: b, val: 'something'}, function(err, out) {
      cache.get({key: b}, function(err, out) {
        assert.equal(out, 1);
        cb();
      });
    });
  });

  it('incr', function(cb) {
    cache.incr({key: b, val: 4}, function(err, out) {
      assert.equal(err, null);
      assert.equal(out, 5);
      cb();
    });
  });

  it('decr', function(cb) {
    cache.decr({key: b, val: 3}, function(err, out) {
      assert.equal(err, null);
      assert.equal(out, 2);
      cb();
    });
  });

  it('won\'t incr unless value is an integer', function(cb) {
    cache.incr({key: a, val: 1}, function(err, out) {
      assert(err);
      cb();
    });
  });

  it('won\'t decr if value is not an integer', function(cb) {
    cache.decr({key: a, val: 1}, function(err, out) {
      assert(err);
      cb();
    });
  });

  it('delete', function(cb) {
    cache.delete({key: a}, function(err, out) {
      assert.equal(err, null);
      assert(out, a);
      cache.get({key: a}, function(err, out) {
        assert.equal(err, null);
        assert.equal(out, undefined);
        cb();
      });
    });
  });

})
