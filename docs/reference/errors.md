# Errors

Error codes defined in `redis.js` (`module.exports.errors`). On Seneca 4 the
error reaches the `act` callback unwrapped: `err.code` is the code and
`err.message` starts with `seneca: `. Redis client errors (connection,
command) are passed through unchanged.

## key_exists

* Message: `Key <key> exists.`
* Raised by `role:cache,cmd:add` when the key already exists.

## not_json

* Message: `Value for key <key> is cannot be parsed as JSON: <val>.`
* Raised by `role:cache,cmd:get` when the stored string is not JSON.

## op_failed_nan

* Message: `Operation <op> failed for key <key> as value is not a number: <oldVal>.`
* Defined but not raised by any action. A non numeric value in `cmd:incr` or
  `cmd:decr` gives the redis error `ERR value is not an integer or out of range`.
