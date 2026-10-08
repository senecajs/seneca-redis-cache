# Run the tests locally

Goal: run the test suite against a real redis server started by Docker.

1. Use Node 24 (22 also works) and install dependencies:

   ```
   npm install
   ```

2. Start redis. `docker-compose.yml` runs `redis:8.10-alpine` as container
   `seneca-redis-cache-redis` on host port 16381 and waits until it is healthy:

   ```
   npm run services:up
   ```

3. Run the tests:

   ```
   npm test
   ```

   `npm test` does not start Docker. It reads the connection settings from
   these environment variables:

   | Variable | Default |
   | -------- | ------- |
   | `SENECA_TEST_REDIS_HOST` | `127.0.0.1` |
   | `SENECA_TEST_REDIS_PORT` | `16381` |

   To use another server: `SENECA_TEST_REDIS_PORT=6379 npm test`.

4. Optionally test against another Seneca build, then restore the
   devDependency:

   ```
   npm install --no-save /path/to/seneca-4.0.0.tgz
   npm test
   npm install
   ```

5. Stop redis and remove its volume:

   ```
   npm run services:down
   ```

Warning: the suite calls `role:cache,cmd:clear`, which runs `FLUSHALL`. Do not
point it at a redis server that holds data you need.

In GitHub Actions the same redis image runs as a service container on the
same port (see `.patches/`).
