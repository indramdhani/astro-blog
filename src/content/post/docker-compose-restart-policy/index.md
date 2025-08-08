---
title: "Docker Compose Restart Policy"
publishDate: "08 August 2025"
description: "A guide to Docker Compose restart policy options, their behaviors, and best practices for development and production."
tags:
  - "docker"
  - "compose"
  - "restart policy"
---

## Restart Policy Options

Docker Compose provides several restart policy options to control how containers are restarted when they exit or fail. These policies are set in your `docker-compose.yml` file under each service.

### 1. `restart: unless-stopped`

- The container will always restart unless it is explicitly stopped by the user.
- Useful for production environments where you want services to run continuously.

### 2. `restart: on-failure`

- The container will restart only if it exits with a non-zero exit code (i.e., on failure).
- You can optionally specify a maximum number of restart attempts.
- Good for jobs or tasks that should retry on error but not run forever.

### 3. `restart: always`

- The container will always restart, regardless of exit status.
- Even after a Docker daemon restart, the container will be started again.
- Suitable for critical services that must always be running.

### 4. `restart: no` (default)

- The container will not be restarted automatically.
- Best for development or one-off tasks.

---

## Comparison Table

| Policy           | Restarts on Failure | Restarts on Stop | Restarts on Docker Restart | Use Case                |
|------------------|--------------------|------------------|---------------------------|-------------------------|
| `no`             | No                 | No               | No                        | Development, one-off    |
| `always`         | Yes                | Yes              | Yes                       | Production, critical    |
| `unless-stopped` | Yes                | No (if stopped)  | Yes                       | Production, persistent  |
| `on-failure`     | Yes                | No               | No                        | Jobs, error recovery    |

---

## Development vs Production Comparison

| Environment   | Recommended Policy      | Reasoning                                         | Example Use Case         |
|---------------|------------------------|---------------------------------------------------|--------------------------|
| Development   | `no` or `on-failure`   | Avoids unwanted restarts, easier debugging         | Testing, local dev       |
| Production    | `always` or `unless-stopped` | Ensures services stay running, high availability | Web server, API backend  |

---

## Example Usage in `docker-compose.yml`

```yaml
services:
  web:
    image: nginx
    restart: always

  worker:
    image: my-worker
    restart: on-failure:5
```

---

## Best Practices

- Use `restart: always` or `restart: unless-stopped` for long-running production services.
- Use `restart: on-failure` for batch jobs or workers that should retry on error.
- Avoid restart policies for development containers unless you need automatic recovery.
- Explicitly stop containers when you want them to remain stopped with `unless-stopped`.

---

By understanding and configuring Docker Compose restart policies, you can ensure your containers behave reliably in both development and production environments.

_Source: [Notion Article](https://notes-at.notion.site/docker-compose-restart-policy-20f03be015b780298502d65cf1ab00ae)_