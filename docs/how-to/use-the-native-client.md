# Use the native redis client

Goal: run a redis command that the cache actions do not provide.

1. Ask the plugin for its client with `role:cache,get:native`. The reply is
   the `redis` v3 `RedisClient` instance itself, so call it in the same
   process (it cannot be sent over a network transport):

   ```js
   seneca.act('role:cache,get:native', function (err, client) {
     client.ttl('k1', function (err, seconds) {
       console.log('ttl', seconds)
     })
   })
   ```

2. Do not call `quit` on the client yourself. The plugin quits it when the
   Seneca instance closes.

The client uses the callback API of the `redis` package version 3.
