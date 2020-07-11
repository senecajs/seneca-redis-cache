/* Copyright (c) 2012-2020 Richard Rodger, Seamus D'Arcy, and other contributors, MIT License */
'use strict'

var Util = require('util')

var Lab = require('@hapi/lab')
var Code = require('@hapi/code')

const PluginValidator = require('seneca-plugin-validator')
const Plugin = require('..')

var Seneca = require('seneca')
var assert = require('assert')
var standard = require('@seneca/cache-test')

var lab = (exports.lab = Lab.script())
var describe = lab.describe
var it = make_it(lab)
var expect = Code.expect

var seneca = Seneca()
  .test()
  .quiet() // comment out to see error details
  .use(Plugin)

var Uuid = require('uuid')

lab.test('validate', PluginValidator(Plugin, module))

describe('cache', function () {
  it('basic', function (done) {
    standard.basictest(seneca, done)
  })

  //var cache = seneca.pin({role: 'cache', cmd: '*'})
  var a = Uuid.v4()
  var b = Uuid.v4()

  it('set', function (cb) {
    seneca.act({ role: 'cache', cmd: 'set', key: a, val: 'one' }, function (
      err,
      out
    ) {
      expect(err).to.not.exist()
      expect(out.key).to.equal(a)
      cb()
    })
  })

  it('get', function (cb) {
    seneca.act({ role: 'cache', cmd: 'get', key: a }, function (err, out) {
      expect(err).to.not.exist()
      expect(out.value).to.equal('one')
      cb()
    })
  })

  it('add', function (cb) {
    seneca.act({ role: 'cache', cmd: 'add', key: b, val: 1 }, function (
      err,
      out
    ) {
      expect(err).to.not.exist()
      expect(out.key).to.equal(b)
      cb()
    })
  })

  it("won't add exsting key", function (cb) {
    seneca.act(
      { role: 'cache', cmd: 'add', key: b, val: 'something' },
      function (err, out) {
        expect(err).to.exist()
        seneca.act({ role: 'cache', cmd: 'get', key: b }, function (err, out) {
          expect(err).to.not.exist()
          expect(out.value).to.equal(1)
          cb()
        })
      }
    )
  })

  it('incr-1', function (cb) {
    seneca.act({ role: 'cache', cmd: 'incr', key: b }, function (err, out) {
      expect(err).to.not.exist()
      expect(out.value).to.equal(2)

      seneca.act({ role: 'cache', cmd: 'incr', key: b }, function (err, out) {
        expect(err).to.not.exist()
        expect(out.value).to.equal(3)
        cb()
      })
    })
  })

  it('incr-jump', function (cb) {
    seneca.act({ role: 'cache', cmd: 'incr', key: b, val: 4 }, function (
      err,
      out
    ) {
      expect(err).to.not.exist()
      expect(out.value).to.equal(7)
      cb()
    })
  })

  it('decr', function (cb) {
    seneca.act({ role: 'cache', cmd: 'decr', key: b, val: 3 }, function (
      err,
      out
    ) {
      expect(err).to.not.exist()
      expect(out.value).to.equal(4)
      cb()
    })
  })

  it("won't incr unless value is an integer", function (cb) {
    seneca.act({ role: 'cache', cmd: 'incr', key: a, val: 1 }, function (
      err,
      out
    ) {
      expect(err)
      cb()
    })
  })

  it("won't decr if value is not an integer", function (cb) {
    seneca.act({ role: 'cache', cmd: 'decr', key: a, val: 1 }, function (
      err,
      out
    ) {
      expect(err)
      cb()
    })
  })

  it('delete', function (cb) {
    seneca.act({ role: 'cache', cmd: 'delete', key: a }, function (err, out) {
      expect(err).to.not.exist()
      expect(out.key).to.equal(a)
      seneca.act({ role: 'cache', cmd: 'get', key: a }, function (err, out) {
        expect(err).to.not.exist()
        expect(out.value).to.equal(null)
        cb()
      })
    })
  })

  lab.it('close', async () => {
    var seneca = Seneca().test().quiet().use(Plugin)

    await seneca.ready()
    await seneca.close()
  })
})

function make_it(lab) {
  return function it(name, opts, func) {
    if ('function' === typeof opts) {
      func = opts
      opts = {}
    }

    lab.it(
      name,
      opts,
      Util.promisify(function (x, fin) {
        func(fin)
      })
    )
  }
}
