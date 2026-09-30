# Self-hosting with Docker

Personal machine first. One image. No Cloudflare, Railway, or multi-service stack for v1.

The light UI is the only process. RankReactor remains the hosted MCP/generation engine — this container does not replace it.

## Prerequisites

- Docker Desktop, or Docker Engine + Docker Compose
- A RankReactor project key (`rr_live_…`) from the dashboard sidebar **API Key** — or omit it to run **mock mode**

## Quickstart

```bash
cp .env.example .env
```

Set `RANKREACTOR_API_KEY` in `.env` (optional; mock mode works without it), then:

```bash
docker compose up
```

Or detached:

```bash
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000). First build compiles the Next.js UI and may take a minute. Follow logs with `docker compose logs -f`.

## Ports and env

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Host and container port |
| `RANKREACTOR_API_KEY` | empty | Bearer key for live MCP. Empty = mock mode |
| `RANKREACTOR_MCP_URL` | `https://www.rankreactor.ai/mcp` | Hosted MCP |

`.env.example` is the template. Compose passes `RANKREACTOR_API_KEY` into the container. Never commit `.env`.

Change the published port:

```bash
PORT=3001 docker compose up
```

Then open `http://localhost:3001`.

## Mock vs live

- No key → UI banner **Mock mode**. Buttons do not create RankReactor jobs.
- Key present → UI banner **Live**. Calls `list_*` / `get_*` / `refresh_metrics` / `generate_*` with `Authorization: Bearer`.

## Common commands

```bash
docker compose up --build
docker compose up -d --force-recreate
docker compose logs -f
docker compose down
```

Health: [http://localhost:3000/api/health](http://localhost:3000/api/health)

## What is not in this image

No database, Redis, crawler, or RankReactor replica. Billing, brand, CMS, and video hosting stay at [https://www.rankreactor.ai](https://www.rankreactor.ai).
