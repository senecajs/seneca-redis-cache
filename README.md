![Seneca](http://senecajs.org/files/assets/seneca-logo.png)

# seneca-redis-cache
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]
[![Dependency Status][david-badge]][david-url]
[![Gitter][gitter-badge]][gitter-url]

### Description

This module is a plugin for the [Seneca framework](http://senecajs.org). It provides a set of common caching actions (`get`, `set` etc.), backed by [redis](https://github.com/NodeRedis/node_redis).

By moving cache operations into Seneca, you can change your cache implementation or business rules at a later point.
For example, you might decide to send certain kinds of keys to a different cache mechanism, such as redis.

### Seneca compatibility
Supports Seneca versions **1.x**, **2.x** and **3.x**

## Install

```sh
npm install seneca
npm install seneca-redis-cache
```

### Quick example

This code snippet sets a value and then retrieves it.

```js
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


<!--START:action-list-->


## Action Patterns

* [cmd:get,role:cache](#-cmdgetrolecache-)
* [cmd:set,role:cache](#-cmdsetrolecache-)
* [cmd:add,role:cache](#-cmdaddrolecache-)
* [cmd:delete,role:cache](#-cmddeleterolecache-)
* [cmd:incr,role:cache](#-cmdincrrolecache-)
* [cmd:decr,role:cache](#-cmddecrrolecache-)
* [cmd:clear,role:cache](#-cmdclearrolecache-)
* [get:native,role:cache](#-getnativerolecache-)
* [init:redis-cache](#-initrediscache-)


<!--END:action-list-->

<!--START:action-desc-->


## Action Descriptions

### &laquo; `cmd:get,role:cache` &raquo;

No description provided.



----------
### &laquo; `cmd:set,role:cache` &raquo;

No description provided.



----------
### &laquo; `cmd:add,role:cache` &raquo;

No description provided.



----------
### &laquo; `cmd:delete,role:cache` &raquo;

No description provided.



----------
### &laquo; `cmd:incr,role:cache` &raquo;

No description provided.



----------
### &laquo; `cmd:decr,role:cache` &raquo;

No description provided.



----------
### &laquo; `cmd:clear,role:cache` &raquo;

No description provided.



----------
### &laquo; `get:native,role:cache` &raquo;

No description provided.



----------
### &laquo; `init:redis-cache` &raquo;

No description provided.



----------


<!--END:action-desc-->



## Common Cache API

Seneca has a common caching API with the following actions:

   * `role:cache, cmd:set` store a value - _key_ and _val_ arguments required
   * `role:cache, cmd:get` retreive a value - _key_ argument is required
   * `role:cache, cmd:add` store a value, only if the key does not exist - _key_ and _val_ arguments required
   * `role:cache, cmd:delete` delete a value - _key_ argument is required, no error if key does not exist
   * `role:cache, cmd:incr` increment a value - _key_ and _val_ (integer) arguments required
   * `role:cache, cmd:decr` decrement a value - _key_ and _val_ (integer) arguments required

All caching plugins, including this one, implement this action API.

## Extended API

To access the underlying [redis](https://github.com/NodeRedis/node_redis), use the action `plugin: 'redis-cache', cmd: 'native'`.

The plugin also registers with the action `role: 'seneca', cmd: 'close'`. This sends the `QUIT` command to the redis connection when you call the `seneca.close` method.

### Options

You can use any of the options from the node [redis](https://github.com/NodeRedis/node_redis#options-object-properties) module directly as options to this plugin.

## Contributing
The [Senecajs org][] encourage open participation. If you feel you can help in any way, be it with
documentation, examples, extra testing, or new features please get in touch.

## Test

```bash
npm run test
```

## License
Copyright (c) 2014-2016, Seamus D'Arcy and other contributors.
Licensed under [MIT][].

[npm-badge]: https://img.shields.io/npm/v/seneca-redis-cache.svg
[npm-url]: https://npmjs.com/package/seneca-redis-cache
[travis-badge]: https://travis-ci.org/senecajs/seneca-redis-cache.svg
[travis-url]: https://travis-ci.org/senecajs/seneca-redis-cache
[codeclimate-badge]: https://codeclimate.com/github/senecajs/seneca-redis-cache/badges/gpa.svg
[codeclimate-url]: https://codeclimate.com/github/senecajs/seneca-redis-cache
[Coveralls]: https://coveralls.io/github/senecajs/seneca-redis-cache?branch=master
[BadgeCoveralls]: https://coveralls.io/repos/github/senecajs/seneca-redis-cache/badge.svg?branch=master
[david-badge]: https://david-dm.org/senecajs/seneca-redis-cache.svg
[david-url]: https://david-dm.org/senecajs/seneca-redis-cache
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/senecajs/seneca
[MIT]: ./LICENSE
[Senecajs org]: https://github.com/senecajs/
[Seneca.js]: https://www.npmjs.com/package/seneca
