# @seneca/redis-cache documentation

The documentation follows the [Diátaxis](https://diataxis.fr) structure.

## Tutorials

| Page | What you learn |
| ---- | -------------- |
| [Getting started](tutorials/getting-started.md) | Install the plugin, connect to redis, and set, get and count values. |

## How-to guides

| Page | Task |
| ---- | ---- |
| [Configure the redis connection](how-to/configure-the-redis-connection.md) | Point the plugin at a redis server and tune the expiry time. |
| [Use the native redis client](how-to/use-the-native-client.md) | Run redis commands the cache API does not cover. |
| [Run the tests locally](how-to/run-the-tests-locally.md) | Start redis with Docker and run the test suite. |
| [Create a release](how-to/create-a-release.md) | Maintainer release steps. |

## Reference

| Page | Contents |
| ---- | -------- |
| [Options](reference/options.md) | Every plugin option and the connection settings. |
| [Messages](reference/messages.md) | Every action pattern, its parameters and reply. |
| [Errors](reference/errors.md) | Error codes defined by the plugin. |

## Explanation

| Page | Topic |
| ---- | ----- |
| [How the plugin works](explanation/how-it-works.md) | Lifecycle, value encoding, expiry, and Seneca 3 versus 4. |

## Feature index

| Feature | Kind | Documented in |
| ------- | ---- | ------------- |
| `expire` | option | [Options](reference/options.md#expire) |
| `redis` | option | [Options](reference/options.md#redis) |
| `redis.host` | option | [Options](reference/options.md#redis) |
| `redis.port` | option | [Options](reference/options.md#redis) |
| `role:cache,cmd:set` | action | [Messages](reference/messages.md#rolecachecmdset) |
| `role:cache,cmd:get` | action | [Messages](reference/messages.md#rolecachecmdget) |
| `role:cache,cmd:add` | action | [Messages](reference/messages.md#rolecachecmdadd) |
| `role:cache,cmd:delete` | action | [Messages](reference/messages.md#rolecachecmddelete) |
| `role:cache,cmd:incr` | action | [Messages](reference/messages.md#rolecachecmdincr) |
| `role:cache,cmd:decr` | action | [Messages](reference/messages.md#rolecachecmddecr) |
| `role:cache,cmd:clear` | action | [Messages](reference/messages.md#rolecachecmdclear) |
| `role:cache,get:native` | action | [Messages](reference/messages.md#rolecachegetnative) |
| `init:redis-cache` | action | [Messages](reference/messages.md#initredis-cache) |
| `sys:seneca,cmd:close` / `role:seneca,cmd:close` | action (close hook) | [Messages](reference/messages.md#close-hook) |
| `key_exists` | error | [Errors](reference/errors.md) |
| `not_json` | error | [Errors](reference/errors.md) |
| `op_failed_nan` | error | [Errors](reference/errors.md) |
| `SENECA_TEST_REDIS_HOST`, `SENECA_TEST_REDIS_PORT` | test env variables | [Run the tests locally](how-to/run-the-tests-locally.md) |

The plugin has no exports and no command line interface.
