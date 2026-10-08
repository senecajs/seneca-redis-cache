/* Copyright (c) 2012-2026 Richard Rodger, Seamus D'Arcy, and other contributors, MIT License */
'use strict'

const { describe, it: node_it, after } = require('node:test')
const assert = require('node:assert')

const PluginValidator = require('seneca-plugin-validator')
const Plugin = require('..')

const Seneca = require('seneca')
const standard = require('@seneca/cache-test')
const Uuid = require('uuid')

// Connection settings; defaults match docker-compose.yml.
const redis = {
  host: process.env.SENECA_TEST_REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.SENECA_TEST_REDIS_PORT || '16381', 10),
}

const it = make_it()

const seneca = Seneca()
  .test()
  .quiet() // comment out to see error details
  .use(Plugin, { redis })

after(function (t, fin) {
  seneca.close(fin)
})

node_it('validate', PluginValidator(Plugin, module))

describe('cache', function () {
  it('basic', function (done) {
    standard.basictest(seneca, done)
  })

  const a = Uuid.v4()
  const b = Uuid.v4()

  it('set', function (cb) {
    seneca.act(
      { role: 'cache', cmd: 'set', key: a, val: 'one' },
      function (err, out) {
        assert.ok(!err)
        assert.strictEqual(out.key, a)
        cb()
      }
    )
  })

  it('get', function (cb) {
    seneca.act({ role: 'cache', cmd: 'get', key: a }, function (err, out) {
      assert.ok(!err)
      assert.strictEqual(out.value, 'one')
      cb()
    })
  })

  it('add', function (cb) {
    seneca.act(
      { role: 'cache', cmd: 'add', key: b, val: 1 },
      function (err, out) {
        assert.ok(!err)
        assert.strictEqual(out.key, b)
        cb()
      }
    )
  })

  it("won't add exsting key", function (cb) {
    seneca.act(
      { role: 'cache', cmd: 'add', key: b, val: 'something' },
      function (err, out) {
        assert.ok(err)
        seneca.act({ role: 'cache', cmd: 'get', key: b }, function (err, out) {
          assert.ok(!err)
          assert.strictEqual(out.value, 1)
          cb()
        })
      }
    )
  })

  it('incr-1', function (cb) {
    seneca.act({ role: 'cache', cmd: 'incr', key: b }, function (err, out) {
      assert.ok(!err)
      assert.strictEqual(out.value, 2)

      seneca.act({ role: 'cache', cmd: 'incr', key: b }, function (err, out) {
        assert.ok(!err)
        assert.strictEqual(out.value, 3)
        cb()
      })
    })
  })

  it('incr-jump', function (cb) {
    seneca.act(
      { role: 'cache', cmd: 'incr', key: b, val: 4 },
      function (err, out) {
        assert.ok(!err)
        assert.strictEqual(out.value, 7)
        cb()
      }
    )
  })

  it('decr', function (cb) {
    seneca.act(
      { role: 'cache', cmd: 'decr', key: b, val: 3 },
      function (err, out) {
        assert.ok(!err)
        assert.strictEqual(out.value, 4)
        cb()
      }
    )
  })

  it("won't incr unless value is an integer", function (cb) {
    seneca.act(
      { role: 'cache', cmd: 'incr', key: a, val: 1 },
      function (err, out) {
        assert.ok(err)
        cb()
      }
    )
  })

  it("won't decr if value is not an integer", function (cb) {
    seneca.act(
      { role: 'cache', cmd: 'decr', key: a, val: 1 },
      function (err, out) {
        assert.ok(err)
        cb()
      }
    )
  })

  it('delete', function (cb) {
    seneca.act({ role: 'cache', cmd: 'delete', key: a }, function (err, out) {
      assert.ok(!err)
      assert.strictEqual(out.key, a)
      seneca.act({ role: 'cache', cmd: 'get', key: a }, function (err, out) {
        assert.ok(!err)
        assert.strictEqual(out.value, null)
        cb()
      })
    })
  })

  it('close', async () => {
    const seneca = Seneca().test().quiet().use(Plugin, { redis })

    // Callback form: `await seneca.ready()` can hang on 4.0.0-rc5.
    await new Promise((resolve) => seneca.ready(resolve))
    await seneca.close()
  })
})

// Adapts lab style `it(name, function (fin) {...})` tests to node:test.
function make_it() {
  return function it(name, opts, func) {
    if ('function' === typeof opts) {
      func = opts
      opts = {}
    }
    const options = Object.assign({ timeout: 11111 }, opts)
    if ('AsyncFunction' === func.constructor.name || 0 === func.length) {
      return node_it(name, options, func)
    }
    return node_it(name, options, (t, fin) => {
      func(fin)
    })
  }
}
