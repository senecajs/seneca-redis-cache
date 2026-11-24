# How the plugin works

## Lifecycle

`use` registers the actions. The `init:redis-cache` action creates one
`redis` v3 client and waits for its `connect` event, so the instance is not
ready until redis answers. On close, the plugin sends `QUIT` before passing
the close message on.

## Seneca 3 versus 4

Version 3 of the plugin supports Seneca 4 only; Seneca 3 users stay on
version 2. Seneca 4 closes an instance through `sys:seneca,cmd:close`, and the
plugin registers its close hook on that pattern.

Other Seneca 4 differences seen by users: errors such as `key_exists` arrive
unwrapped (use `err.code` and `err.message`), and plugin options come only
from `use()` and `plugin.redis_cache`. Seneca 4 also checks plugin options
against the defaults. The `redis` option is declared open, so any client
option is accepted, but `expire`, `redis.port` and `redis.host` must have the
types of their defaults (number, number, string).

## Values and expiry

Values are JSON encoded, so any JSON value round trips, and strings that were
written by other programs may fail with `not_json`. Every write sets the
`expire` time to live; there is no way to store a key without one.

## Limits

* One connection per plugin instance; no cluster or sentinel support beyond
  what the `redis` v3 client options give.
* `cmd:clear` flushes the whole redis server, not only keys written by this
  plugin. Use a dedicated redis server or database for the cache.
* The reply of `cmd:incr` and `cmd:decr` is `false` when the key is created.
