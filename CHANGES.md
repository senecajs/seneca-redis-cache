# Changes

## 3.0.0 2026-11-21

* Seneca 4: the peer dependency is `seneca` `^4.0.0`. Seneca 3 users stay
  on `@seneca/redis-cache@2`.
* Node.js 24 or later (`engines.node` `>=24`).
* 2.1.0 was not published. Its changes, listed in the 2.1.0 entry below,
  are part of 3.0.0.
* The `redis` option is declared as an open object in the plugin
  defaults. Seneca 4 validates plugin options against the defaults, so
  documented client options such as `redis: { password, db }` failed with
  `invalid_plugin_option`. Any `redis` v3 client option is accepted again.
  `expire`, `redis.port` and `redis.host` must be a number, a number and a
  string.
* Options are merged by Seneca's option validation instead of the
  deprecated `seneca.util.deepextend` (`SENECA_DEP_UTIL_DEEPEXTEND`).
* The close hook is registered on `sys:seneca,cmd:close` only, and logs
  `close-error` only when `QUIT` fails. Before, it logged `close-error` at
  level error on every close.
* Development dependencies: `seneca` `^4.0.0` (was `^4.0.0-rc5`),
  `@seneca/cache-test` `^3.0.0`, `seneca-plugin-validator` `^0.7.0` and
  `@seneca/doc` `^9.0.0`. A test checks that a client option (`db`) is
  passed to the client. `package-lock.json` is no longer committed.
  `CHANGES.md` is published.
* Documentation: the Seneca 3, Node 22 and `4.0.0-rc5` notes are removed,
  and install lines name `seneca@^4`.

## 2.1.0

* Seneca 4 prerelease support (`seneca@4.0.0-rc5` and 4.0.0). The redis
  client is now closed on Seneca 4, which closes through
  `sys:seneca,cmd:close`; Seneca 3 still uses `role:seneca,cmd:close`.
* Peer dependency `seneca: >=3 || >=4.0.0-rc5`.
* Tested on Node 24 and 22 against redis 8.10.
* Tests run with `node:test` instead of `@hapi/lab`, read the redis host
  and port from `SENECA_TEST_REDIS_HOST` and `SENECA_TEST_REDIS_PORT`, and
  a `docker-compose.yml` (`npm run services:up`) starts redis locally.
* Documentation reorganized into `docs/` (tutorials, how-to guides,
  reference, explanation).
* Removed Travis and coveralls tooling.

## Earlier

* Updated Redis dependency to ^2.4.2 (PR #2).
