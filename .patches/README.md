# Patches

Changes to `.github/workflows/` cannot be pushed from the session that
prepared this branch, so they are delivered as patches.

Apply them on top of this branch with:

```
git am .patches/*.patch
```

* `0001-ci-redis-service.patch`: runs the build on `ubuntu-latest` with Node
  24.x and 22.x, triggers on `master` and `main`, and starts `redis:8.10-alpine`
  as a GitHub Actions service container on host port 16381 with a
  `redis-cli ping` health check (the same port as `docker-compose.yml`).
