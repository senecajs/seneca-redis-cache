const Redis = require('redis');

module.exports = function (options) {
    const seneca = this;

    options = seneca.util.deepextend({
        Redis: {
            port: 6379,
            host: '127.0.0.1'
        },
        autoExpire: 0
    }, options);

    const cmds = {}
    const name = 'redis-cache';
    const role = 'cache';

    let cache;

    cmds.set = function (args, cb) {
        var key = args.key;
        var val = JSON.stringify(args.value);

        let ex = options.autoExpire;
        if (ex > 0 || (args.expire && args.expire > 0)) {
            ex = args.expire > 0 ? args.expire : ex;

            cache.set(key, val, 'EX', parseInt(ex), function (err, reply) { // TODO: Add milliseconds support bc why not.
                cb(err, { key });
            });
        } else {
            cache.set(key, val, function (err, reply) {
                cb(err, { key });
            });
        }
    };

    cmds.get = function (args, cb) {
        var key = args.key;
        cache.get(key, function (err, value) {
            if (err) {
                cb(err, undefined);
            }
            else {
                try {
                    value = JSON.parse(value);
                }
                catch (err) {
                    seneca.log.error(err);

                    var error = new Error('Could not retrieve JSON data at key [' + key + ']:' + value);
                    return cb(error, value);
                }
                cb(undefined, { value });
            }
        })
    }

    cmds.add = function (args, cb) {
        var key = args.key
        var val = JSON.stringify(args.val)
        cache.exists(key, function (err, exists) {
            if (err) {
                cb(err)
            }
            if (exists) return cb(new Error('key exists: ' + key), key)
            cache.set(key, val, function (err, reply) {
                cb(err, { key })
            })
        })
    }

    cmds.delete = function (args, cb) {
        cache.del(args.key, function (err, reply) {
            cb(err, { key: args.key })
        })
    }

    function incrdecr(kind) {
        return function (args, cb) {
            var key = args.key
            var val = args.val

            cache.get(key, function (err, oldValue) {
                if (!oldValue) return cb(err, null);
                oldValue = parseInt(oldValue, 10);
                if (typeof oldValue !== 'number' || isNaN(oldValue)) {
                    return cb(new Error(kind + ' failed - value for key ' + key + ' is not a number'))
                }
                var newValue = kind === 'decr' ? oldValue - val : oldValue + val;
                cache.set(key, newValue, function (err, reply) {
                    cb(err, { value: newValue });
                })
            })
        }
    }

    cmds.incr = incrdecr('incr')
    cmds.decr = incrdecr('decr')

    // cache role
    seneca.add({ role: role, cmd: 'set' }, cmds.set)
    seneca.add({ role: role, cmd: 'get' }, cmds.get)
    seneca.add({ role: role, cmd: 'add' }, cmds.add)
    seneca.add({ role: role, cmd: 'delete' }, cmds.delete)
    seneca.add({ role: role, cmd: 'incr' }, cmds.incr)
    seneca.add({ role: role, cmd: 'decr' }, cmds.decr)


    seneca.add({ role: role, get: 'native' }, function (args, done) {
        done(null, cache)
    })


    seneca.add({ role: 'seneca', cmd: 'close' }, function (args, cb) {
        var closer = this;
        cache.quit(function (err) {
            closer.log.error('close-error', err)
            this.prior(args, cb)
        })
    })


    seneca.add({ init: name }, function (args, done) {
        const retry_strategy = function (options) {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                // End reconnecting on a specific error and flush all commands with a individual error
                return new Error('The server refused the connection');
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
                // End reconnecting after a specific timeout and flush all commands with a individual error
                return new Error('Retry time exhausted');
            }
            if (options.attempt > 10) {
                // End reconnecting with built in error
                return undefined;
            }
            // reconnect after
            return Math.min(options.attempt * 100, 3000);
        }

        cache = Redis.createClient(
            options.Redis.port,
            options.Redis.host,
            options.Redis,
            retry_strategy
        )
        cache.on('connect', done)
        cache.on('error', done)
    })


    return { name: name }
}
