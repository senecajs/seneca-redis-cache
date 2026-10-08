// Run with redis available, for example after `npm run services:up`.
// In your own project use require('@seneca/redis-cache').
const Seneca = require('seneca')
const RedisCache = require('../../redis.js')

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
