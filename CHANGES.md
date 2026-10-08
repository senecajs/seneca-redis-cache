# Changes

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
