# How the plugin works

## Lifecycle

`use` registers the actions. The `init:redis-cache` action creates one
`redis` v3 client and waits for its `connect` event, so the instance is not
ready until redis answers. On close, the plugin sends `QUIT` before passing
the close message on.

## Seneca 3 versus 4

Seneca 4 closes an instance through `sys:seneca,cmd:close`. In 4.0.0-rc5 a
hook on the Seneca 3 pattern `role:seneca,cmd:close` is never called, so the
redis connection stayed open and kept the process alive. The plugin therefore
checks `seneca.version` and registers on the pattern the running Seneca uses.

Other Seneca 4 differences seen by users: errors such as `key_exists` arrive
unwrapped (use `err.code` and `err.message`), and plugin options come only
from `use()` and `plugin.redis_cache`.

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
