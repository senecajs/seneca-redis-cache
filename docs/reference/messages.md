# Messages

All cache actions use `role:cache`. Values are stored as JSON strings.

## role:cache,cmd:set

Store a value.

* Parameters: `key` (string), `val` (any JSON value).
* Reply: `{ key }`.
* Redis: `SET key JSON(val) EX expire`.

## role:cache,cmd:get

Read a value.

* Parameters: `key`.
* Reply: `{ value }`. `value` is `null` when the key does not exist.
* Errors: [`not_json`](errors.md) when the stored string is not JSON.

## role:cache,cmd:add

Store a value only if the key does not exist.

* Parameters: `key`, `val`.
* Reply: `{ key }`.
* Errors: [`key_exists`](errors.md).

## role:cache,cmd:delete

Delete a key. No error if it does not exist.

* Parameters: `key`.
* Reply: `{ key }`.

## role:cache,cmd:incr

Increment a number.

* Parameters: `key`, `val` (optional integer). With `val` greater than 1 the
  plugin uses `INCRBY key val`, otherwise `INCR key`.
* Reply: `{ value }`, the new number. When `INCR` creates the key (result 1),
  the reply is `{ value: false }` and the key gets the `expire` time to live.
* Errors: the redis error `ERR value is not an integer or out of range` when the
  stored value is not an integer.

## role:cache,cmd:decr

Decrement a number. Same as `cmd:incr` with `DECRBY` and `DECR`; a result of -1
from `DECR` gives `{ value: false }`.

## role:cache,cmd:clear

Remove every key in every database of the redis server (`FLUSHALL ASYNC`).

* Parameters: none.
* Reply: empty, sent before the flush runs.

## role:cache,get:native

* Reply: the `redis` v3 `RedisClient` instance. Only useful in the same process.
  See [Use the native redis client](../how-to/use-the-native-client.md).

## init:redis-cache

Plugin init. Creates the client and replies on the first `connect` event, or
with the first `error` (for example `ECONNREFUSED`), which makes Seneca fail.

## Close hook

On Seneca 4 the plugin overrides `sys:seneca,cmd:close`; on Seneca 3,
`role:seneca,cmd:close`. It sends `QUIT` and then calls the prior close action.
