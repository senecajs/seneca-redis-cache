/* Copyright (c) 2014 Seamus D'Arcy */
/*global describe, it */
'use strict'

var seneca = require('seneca')({log: 'silent'})
seneca.use('..')

var Assert = require('assert')
var Uuid = require('uuid')
var Lab = require('lab')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it

var Standard = require('seneca-cache-test')

describe('cache', function () {
  it('basic', function (done) {
    Standard.basictest(seneca, done)
  })


  var cache = seneca.pin({role: 'cache', cmd: '*'})
  var a = Uuid.v4()
  var b = Uuid.v4()

  it('set', function (cb) {
    cache.set({key: a, val: 'one'}, function (err, out) {
      Assert.equal(err, null)
      Assert(out, a)
      cb()
    })
  })

  it('get', function (cb) {
    cache.get({key: a}, function (err, out) {
      Assert.equal(err, null)
      Assert.equal(out, 'one')
      cb()
    })
  })

  it('add', function (cb) {
    cache.add({key: b, val: 1}, function (err, out) {
      Assert.equal(err, null)
      Assert.equal(out, b)
      cb()
    })
  })

  it('won\'t add exsting key', function (cb) {
    cache.add({key: b, val: 'something'}, function (err, out) {
      cache.get({key: b}, function (err, out) {
        Assert.equal(out, 1)
        cb()
      })
    })
  })

  it('incr', function (cb) {
    cache.incr({key: b, val: 4}, function (err, out) {
      Assert.equal(err, null)
      Assert.equal(out, 5)
      cb()
    })
  })

  it('decr', function (cb) {
    cache.decr({key: b, val: 3}, function (err, out) {
      Assert.equal(err, null)
      Assert.equal(out, 2)
      cb()
    })
  })

  it('won\'t incr unless value is an integer', function (cb) {
    cache.incr({key: a, val: 1}, function (err, out) {
      Assert(err)
      cb()
    })
  })

  it('won\'t decr if value is not an integer', function (cb) {
    cache.decr({key: a, val: 1}, function (err, out) {
      Assert(err)
      cb()
    })
  })

  it('delete', function (cb) {
    cache.delete({key: a}, function (err, out) {
      Assert.equal(err, null)
      Assert(out, a)
      cache.get({key: a}, function (err, out) {
        Assert.equal(err, null)
        Assert.equal(out, undefined)
        cb()
      })
    })
  })
})
