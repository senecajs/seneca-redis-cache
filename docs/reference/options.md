# Options

Set options with `seneca.use('@seneca/redis-cache', { ... })` or under
`plugin.redis_cache` in the Seneca instance options.

| Option | Type | Default | Effect |
| ------ | ---- | ------- | ------ |
| `expire` | number (seconds) | `3600` | Time to live of keys written by `cmd:set` and `cmd:add`, and set on new counters by `cmd:incr` and `cmd:decr`. A falsy value gives 3600. |
| `redis` | object | `{ port: 6379, host: '127.0.0.1' }` | Connection settings, passed as the options object to `Redis.createClient(port, host, options)` of the `redis` v3 package. |
| `redis.port` | number | `6379` | Redis server port. |
| `redis.host` | string | `'127.0.0.1'` | Redis server host. |

## expire

Applied with `SET key value EX <expire>`. Expiry is not refreshed by `cmd:get`.

## redis

Any [client option of `redis` v3](https://github.com/redis/node-redis/tree/v3.1.2#options-object-properties)
(for example `password`, `db`, `tls`) may be added. If you pass `redis`
without `port` or `host`, the defaults above fill them in.
