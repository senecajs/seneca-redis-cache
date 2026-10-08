![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js](http://senecajs.org) plugin

# @seneca/redis-cache

A [Seneca](https://senecajs.org) plugin that implements the Seneca cache API (`role:cache`) on a [redis](https://redis.io) server, using the `redis` v3 Node.js client. Works with Seneca 3 and the Seneca 4 prerelease (`4.0.0-rc5`) on Node 22 and 24.

[![npm version](https://img.shields.io/npm/v/@seneca/redis-cache.svg)](https://npmjs.com/package/@seneca/redis-cache)
[![build](https://github.com/senecajs/seneca-redis-cache/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-redis-cache/actions/workflows/build.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-redis-cache/badge.svg)](https://snyk.io/test/github/senecajs/seneca-redis-cache)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/12816/branches/203962/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=12816&bid=203962)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

## Install

```
npm install seneca @seneca/redis-cache
```

You also need a redis server (default `127.0.0.1:6379`).

## Quick Example

```js
const Seneca = require('seneca')

const seneca = Seneca().use('@seneca/redis-cache', {
  redis: { host: '127.0.0.1', port: 6379 },
})

seneca.ready(async function () {
  await seneca.post('role:cache,cmd:set', { key: 'k1', val: 'v1' })
  const out = await seneca.post('role:cache,cmd:get', { key: 'k1' })
  console.log(out) // { value: 'v1' }
  seneca.close()
})
```

## More Examples

* [Getting started](docs/tutorials/getting-started.md), with the runnable
  [example program](docs/examples/getting-started.js).
* [Configure the redis connection](docs/how-to/configure-the-redis-connection.md)
* [Use the native redis client](docs/how-to/use-the-native-client.md)
* [Run the tests locally](docs/how-to/run-the-tests-locally.md)

The full index is [docs/README.md](docs/README.md).

## Motivation

Seneca defines a common cache API so that services can swap cache back ends
without code changes. This plugin provides that API on redis. See
[How the plugin works](docs/explanation/how-it-works.md).

## Support

* Post a [GitHub issue](https://github.com/senecajs/seneca-redis-cache/issues).
* Read the [Seneca documentation](https://senecajs.org).
* This module is sponsored and supported by [Voxgig](https://www.voxgig.com).

## API

| Option | Default | Reference |
| ------ | ------- | --------- |
| `expire` | `3600` seconds | [Options](docs/reference/options.md#expire) |
| `redis` | `{ port: 6379, host: '127.0.0.1' }` | [Options](docs/reference/options.md#redis) |

| Pattern | Purpose |
| ------- | ------- |
| `role:cache,cmd:set` | Store a value. |
| `role:cache,cmd:get` | Read a value. |
| `role:cache,cmd:add` | Store a value if the key is new. |
| `role:cache,cmd:delete` | Delete a key. |
| `role:cache,cmd:incr` | Increment a number. |
| `role:cache,cmd:decr` | Decrement a number. |
| `role:cache,cmd:clear` | Flush the redis server. |
| `role:cache,get:native` | Get the redis client. |

Details: [Messages](docs/reference/messages.md) and [Errors](docs/reference/errors.md).

## Contributing

The [Senecajs org](https://github.com/senecajs/) encourages open participation.

To run the tests (Node 24 or 22, with the `seneca@4.0.0-rc5` devDependency):

```
npm install
npm run services:up
npm test
npm run services:down
```

See [Run the tests locally](docs/how-to/run-the-tests-locally.md) for the
environment variables. CI workflow changes are in `.patches/`; apply them with
`git am .patches/*.patch`.

## Background

Originally written by Seamus D'Arcy and Richard Rodger. See
[CHANGES.md](CHANGES.md) for history.

| Plugin | Seneca | Node | redis client |
| ------ | ------ | ---- | ------------ |
| 2.1.x | 3.x, 4.0.0-rc5 and later | 22, 24 | `redis` 3 |
| 2.0.x | 3.x | older | `redis` 3 |

Licensed under [MIT](LICENSE).
