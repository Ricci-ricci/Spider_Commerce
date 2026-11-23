# Docker tour — SpiderSense

Personal notes on how this project is containerized. Kept locally; not committed.

## The big picture

Three pieces of infrastructure stand up with one command:

```
┌─ docker compose up -d ─┐
│                        │
│  ┌──────────┐          │
│  │ frontend │ :3000    │   Next.js (the site)
│  └────┬─────┘          │
│       │ /api/* proxy   │
│  ┌────▼─────┐          │
│  │ backend  │ :4000    │   Express + Prisma
│  └────┬─────┘          │
│       │                │
│       └──► Atlas (cloud MongoDB)
└────────────────────────┘
```

Two `Dockerfile`s (one per service), one `docker-compose.yml` to wire them
together, and an `.env` to keep secrets out of git.

---

## Frontend `Dockerfile` — the three-stage pattern

```dockerfile
# ─── STAGE 1: deps ───
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
```

**Why a separate stage?** Docker caches each layer. If a page changes but not a
package, Docker reuses the cached `npm ci` result (~30s saved per build).

```dockerfile
# ─── STAGE 2: builder ───
FROM node:22-alpine AS builder
WORKDIR /app
ARG BACKEND_INTERNAL_URL=http://backend:4000
ENV BACKEND_INTERNAL_URL=$BACKEND_INTERNAL_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
```

`COPY --from=deps` pulls the installed `node_modules` from stage 1 instead of
re-installing. The `ARG`/`ENV` pair feeds `BACKEND_INTERNAL_URL` into
`next build` — Next.js **bakes** rewrites into its output at build time, so
this URL has to be known here, not at runtime.

```dockerfile
# ─── STAGE 3: runner ───
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN mkdir -p ./.next/cache/images && chown -R node:node ./.next
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

**The key trick:** the final image **doesn't include** `node_modules` or source
code — only the three pieces Next.js's "standalone" output needs:

- `/public` — static assets
- `/.next/standalone` — a minimal self-contained server
- `/.next/static` — hashed JS/CSS bundles

That's why `next.config.ts` has `output: "standalone"`. Without it those paths
don't exist and this stage fails. **Result: final image ~150MB instead of ~1.5GB.**

Other things worth knowing:

- `USER node` drops out of root so a compromised process can't own the container.
- `mkdir ./.next/cache/images && chown` — Next.js writes optimized images at
  runtime; the `node` user needs write access, or `EACCES: permission denied`.

---

## Backend `Dockerfile` — same shape, two differences

```dockerfile
RUN npx prisma generate   # before compile — Prisma client is generated code
RUN npm run build         # compiles TS → dist/
```

And the runner needs more baggage than the frontend:

```dockerfile
COPY --from=builder /app/node_modules ./node_modules   # Prisma runtime, Express
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma               # schema for runtime queries
CMD ["node", "dist/src/index.js"]
```

Node backends usually can't shrink `node_modules` away because there's no
standalone bundler step like Next.js's.

---

## `.dockerignore` — the file nobody notices

Mirrors `.gitignore` for the Docker build context. Without it, `COPY . .` would
send `node_modules` and `.next/` to the Docker daemon on every build.

```
node_modules
.next
.git
.env*
```

**`.env*` here is important** — local secrets don't accidentally end up baked
into an image pushed to a registry.

---

## `docker-compose.yml` — the glue

Compose doesn't *do* anything Docker can't; it's just a readable way to
describe several containers + how they talk.

```yaml
services:
  backend:
    build: ./backend
    ports: ["4000:4000"]
    environment:
      DATABASE_URL: ${DATABASE_URL}        # ← read from .env, not hardcoded
      FRONTEND_ORIGIN: "http://localhost:3000"
    volumes:
      - ./backend/uploads:/app/uploads     # ← bind-mount: images persist
```

Three concepts worth internalizing:

**1. Service DNS.** Inside the compose network, services reach each other by
name — `backend` resolves to the backend container. That's why the frontend
proxies to `http://backend:4000`, not `localhost:4000`. (From the browser,
`localhost` is the host machine; from inside the frontend container,
`localhost` is the frontend container itself.)

**2. `ports: "4000:4000"`** means **host:container**. The container always
listens on 4000 internally; the left side is what gets exposed to the host.
`3001:4000` would let you hit the backend at `localhost:3001`.

**3. Volumes come in two flavors:**

```yaml
volumes:
  - ./backend/uploads:/app/uploads     # bind-mount: host dir ↔ container dir
  - mongo-data:/data/db                # named volume: Docker-managed, survives rebuilds
```

Bind-mount is used for uploads so existing product images on disk are visible
to the backend container.

**4. `${DATABASE_URL}`** is substituted from the `.env` next to
`docker-compose.yml`. That's how the Atlas URI gets injected without being
written into any file that git tracks.

---

## Everyday commands

```bash
docker compose up -d            # start everything in background
docker compose up -d --build    # rebuild images first (after code changes)
docker compose logs -f backend  # tail backend logs
docker compose ps               # see what's running
docker compose down             # stop (keeps volumes)
docker compose down -v          # stop AND wipe volumes (⚠️ deletes data)
docker compose exec backend sh  # shell into the backend container
```

---

## Debugging recap — three bugs hit, and what they teach

1. **Lowercase `dockerfile` filename.** Docker only auto-detects `Dockerfile`
   with a capital D. Lesson: filenames matter.

2. **`http://localhost:4000` from inside the frontend container.** Browser→host
   worked, SSR→container failed. Lesson: `localhost` is relative to whoever's
   asking. Use service DNS (`backend`) for container-to-container, and
   same-origin proxying (Next.js rewrites) for browser-to-server.

3. **`BACKEND_INTERNAL_URL` empty at runtime.** Set in the builder stage as
   `ARG` but not forwarded to the runner. PDP's `fetch()` tried `/api/products`
   as a relative URL on the server and crashed. Lesson: `ARG` is build-time
   only; `ENV` set in the `runner` stage (or injected via compose
   `environment:`) is runtime. They're different worlds.

---

## Mental model

- **Image** = a snapshot (what `FROM`/`COPY`/`RUN` produce)
- **Container** = a running instance of an image
- **Dockerfile** = a recipe for an image
- **Compose** = a recipe for how containers run together

That's really all of it. The rest is syntax.
