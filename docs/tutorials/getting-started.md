# Getting started

In this tutorial you load `@seneca/redis-cache` into a Seneca instance and use
the cache actions against a real redis server.

## 1. Install

```
npm install seneca @seneca/redis-cache
```

You need a redis server. Inside this repository, `npm run services:up` starts
one on port 16381 (see [Run the tests locally](../how-to/run-the-tests-locally.md)).
Anywhere else, a server on the default `127.0.0.1:6379` works without options.

## 2. Write the program

This is [`docs/examples/getting-started.js`](../examples/getting-started.js):

```js
const Seneca = require('seneca')
const RedisCache = require('@seneca/redis-cache')

const seneca = Seneca()
  .quiet()
  .use(RedisCache, {
    expire: 60,
    redis: {
      host: process.env.SENECA_TEST_REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.SENECA_TEST_REDIS_PORT || '16381', 10),
    },
  })

seneca.ready(async function () {
  const set = await seneca.post('role:cache,cmd:set', {
    key: 'k1',
    val: { a: 1 },
  })
  console.log('set', set)

  const get = await seneca.post('role:cache,cmd:get', { key: 'k1' })
  console.log('get', get)

  await seneca
    .post('role:cache,cmd:add', { key: 'k1', val: 2 })
    .catch((err) => {
      console.log('add error', err.code, err.message)
    })

  await seneca.post('role:cache,cmd:delete', { key: 'counter' })
  await seneca.post('role:cache,cmd:set', { key: 'counter', val: 10 })
  console.log(
    'incr',
    await seneca.post('role:cache,cmd:incr', { key: 'counter', val: 5 })
  )
  console.log(
    'decr',
    await seneca.post('role:cache,cmd:decr', { key: 'counter', val: 2 })
  )

  await seneca.post('role:cache,cmd:delete', { key: 'k1' })
  console.log(
    'after delete',
    await seneca.post('role:cache,cmd:get', { key: 'k1' })
  )

  seneca.close(function () {
    console.log('closed')
  })
})
```

## 3. Run it

```
$ node docs/examples/getting-started.js
set { key: 'k1' }
get { value: { a: 1 } }
add error key_exists seneca: Key k1 exists.
incr { value: 15 }
decr { value: 13 }
after delete { value: null }
closed
```

This output was produced with `seneca@4.0.0-rc5` and redis 8.10.

## What happened

* `use` registered the cache actions. During `ready`, the `init:redis-cache`
  action opened the redis connection.
* `cmd:set` stored the value as JSON with a 60 second expiry.
* `cmd:get` parsed the JSON back. A missing key gives `{ value: null }`.
* `cmd:add` refused to overwrite an existing key with the `key_exists` error.
* `cmd:incr` and `cmd:decr` changed the number with redis `INCRBY` and `DECRBY`.
* `seneca.close` sent `QUIT` to redis, so the process exits.

## Next steps

* [Configure the redis connection](../how-to/configure-the-redis-connection.md)
* [Messages reference](../reference/messages.md)
* [How the plugin works](../explanation/how-it-works.md)
