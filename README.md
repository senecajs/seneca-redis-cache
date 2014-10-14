# seneca-redis-cache

### Node.js Seneca redis caching module.

This module is a plugin for the [Seneca framework](http://senecajs.org). It provides a set of common caching actions (`get`, `set` etc.), backed by [redis](https://github.com/mranney/node_redis).

By moving cache operations into Seneca, you can change your cache implementation or business rules at a later point.
For example, you might decide to send certain kinds of keys to a different cache mechanism, such as redis.

### Quick example

This code snippet sets a value and then retrieves it.

```JavaScript
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

The full action argument pattern can be a bit tedious, so use a Seneca _pin_ to make things more convenient:

```JavaScript
var cache = seneca.pin({role:'cache', cmd:'*'});

cache.set({key: 'k1', val: 'v1'}, function(err) {
  cache.get({key:'k1'}, function(err, out) {
    console.log('value = ' + out);
  });
});
```
## Install

```sh
npm install seneca
npm install seneca-redis-cache
```

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

To access the underlying [redis](https://github.com/mranney/node_redis), use the action `plugin: 'redis-cache', cmd: 'native'`.

The plugin also registers with the action `role: 'seneca', cmd: 'close'`. This sends the `QUIT` command to the redis connection when you call the `seneca.close` method.

### Options

You can use any of the options from the node [redis](https://github.com/mranney/node_redis#rediscreateclientport-host-options) module directly as options to this plugin.

## Test

```bash
mocha test/cache.test.js
```

