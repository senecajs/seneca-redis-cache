# Configure the redis connection

Goal: connect the plugin to your redis server and choose how long values live.

1. Pass `redis.host` and `redis.port`:

   ```js
   seneca.use('@seneca/redis-cache', {
     redis: { host: 'cache.internal', port: 6380 },
   })
   ```

2. Add any other option of the [`redis` v3 client](https://github.com/redis/node-redis/tree/v3.1.2#options-object-properties)
   to the same `redis` object. The whole object is passed to
   `Redis.createClient(port, host, options)`. For example a password and a
   database number:

   ```js
   seneca.use('@seneca/redis-cache', {
     redis: { host: '127.0.0.1', port: 6379, password: 'secret', db: 2 },
   })
   ```

3. Set `expire` (seconds) to control the time to live of keys written by
   `cmd:set` and `cmd:add`:

   ```js
   seneca.use('@seneca/redis-cache', { expire: 300 })
   ```

   `expire: 0` is treated as unset and gives the default of 3600 seconds.

4. Alternatively set the options through the Seneca instance options, under
   `plugin.redis_cache` (the plugin registers under the name of its definition
   function, `redis_cache`):

   ```js
   const seneca = Seneca({
     plugin: { redis_cache: { redis: { port: 6380 } } },
   }).use('@seneca/redis-cache')
   ```

   On Seneca 4, a top level `redis_cache` options block is no longer read.

If redis cannot be reached, the plugin init fails and Seneca reports a fatal
error during `ready`.

See [Options](../reference/options.md) for the full list.
