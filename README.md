![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js](http://senecajs.org) plugin

# @seneca/redis-cache

[![npm version](https://img.shields.io/npm/v/@seneca/redis-cache.svg)](https://npmjs.com/package/@seneca/redis-cache)
[![build](https://github.com/senecajs/seneca-redis-cache/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-redis-cache/actions/workflows/build.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-redis-cache/badge.svg)](https://snyk.io/test/github/senecajs/seneca-redis-cache)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-redis-cache/badge.svg?branch=master)](https://coveralls.io/github/senecajs/seneca-redis-cache?branch=master)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/12816/branches/203962/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=12816&bid=203962)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

## Install

```
npm install seneca
npm install seneca-redis-cache
```
## Quick Example

This code snippet sets a value and then retrieves it.

```
var seneca = require('seneca')();
seneca.use('redis-cache');

seneca.ready(function(err) {
  seneca.act({role: 'cache', cmd: 'set', key: 'k1', val: 'v1'}, function(err) {
    seneca.act({role: 'cache', cmd: 'get', key: 'k1'}, function(err, out) {
      console.log('value = ' + out)
    });
  });
});
```
## More Examples

See [test/](test/) for usage examples.

## Motivation

Redis caching plugin for the Seneca framework.

## Support

If you're using this module and need help, you can:

- Post a [github issue](https://github.com/senecajs/seneca-redis-cache/issues)
- Tweet to [@senecajs](http://twitter.com/senecajs)
- Ask on the [Gitter](https://gitter.im/senecajs/seneca)


## API

### Options

* `expire` : number <i><small>3600</small></i>
* `redis.port` : number <i><small>6379</small></i>
* `redis.host` : string <i><small>"127.0.0.1"</small></i>

Set plugin options when loading with:
```
seneca.use('redis-cache', { name: value, ... })
```
You can also use any of the options from the node [redis](https://github.com/NodeRedis/node_redis#options-object-properties) module directly as options to this plugin.

### Action Patterns

* [init:redis-cache](#-initrediscache-)
* [role:cache,cmd:add](#-rolecachecmdadd-)
* [role:cache,cmd:clear](#-rolecachecmdclear-)
* [role:cache,cmd:decr](#-rolecachecmddecr-)
* [role:cache,cmd:delete](#-rolecachecmddelete-)
* [role:cache,cmd:get](#-rolecachecmdget-)
* [role:cache,cmd:incr](#-rolecachecmdincr-)
* [role:cache,cmd:set](#-rolecachecmdset-)
* [role:cache,get:native](#-rolecachegetnative-)

### Action Descriptions

### &laquo; `init:redis-cache` &raquo;

No description provided.

----------
### &laquo; `role:cache,cmd:add` &raquo;

No description provided.

----------
### &laquo; `role:cache,cmd:clear` &raquo;

No description provided.

----------
### &laquo; `role:cache,cmd:decr` &raquo;

No description provided.

----------
### &laquo; `role:cache,cmd:delete` &raquo;

No description provided.

----------
### &laquo; `role:cache,cmd:get` &raquo;

No description provided.

----------
### &laquo; `role:cache,cmd:incr` &raquo;

No description provided.

----------
### &laquo; `role:cache,cmd:set` &raquo;

No description provided.

----------
### &laquo; `role:cache,get:native` &raquo;

No description provided.

----------

### Common Cache API

Seneca has a common caching API with the following actions:

   * `role:cache, cmd:set` store a value - _key_ and _val_ arguments required
   * `role:cache, cmd:get` retreive a value - _key_ argument is required
   * `role:cache, cmd:add` store a value, only if the key does not exist - _key_ and _val_ arguments required
   * `role:cache, cmd:delete` delete a value - _key_ argument is required, no error if key does not exist
   * `role:cache, cmd:incr` increment a value - _key_ and _val_ (integer) arguments required
   * `role:cache, cmd:decr` decrement a value - _key_ and _val_ (integer) arguments required

All caching plugins, including this one, implement this action API.

### Extended API

To access the underlying [redis](https://github.com/NodeRedis/node_redis), use the action `plugin: 'redis-cache', cmd: 'native'`.

The plugin also registers with the action `role: 'seneca', cmd: 'close'`. This sends the `QUIT` command to the redis connection when you call the `seneca.close` method.

## Contributing

The [Senecajs org][] encourage open participation. If you feel you can help in any way, be it with
documentation, examples, extra testing, or new features please get in touch.

### Running tests

```
npm run test
```
## Background

Uses [ioredis](https://github.com/luin/ioredis) as the Redis client.

[MIT]: ./LICENSE
[Senecajs org]: https://github.com/senecajs/
[Seneca.js]: https://www.npmjs.com/package/seneca
