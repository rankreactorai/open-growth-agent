# open-growth-agent

**SEO + AI UGC that runs overnight.**

Free open-source **automated growth reactor**. Not an Ahrefs clone. Not an OpenSEO clone. The agent works while you sleep.

> **Free to run. Bring a RankReactor API key.**

[![MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](./LICENSE)
[![MCP](https://img.shields.io/badge/MCP-rankreactor.ai%2Fmcp-3ee0b2.svg)](https://www.rankreactor.ai/docs/ai-assistants)
[![Docker](https://img.shields.io/badge/self--host-docker%20compose%20up-f4c14a.svg)](./docs/SELF_HOSTING_DOCKER.md)

OpenSEO is a **research app**. This is an **automated growth reactor**.

Hero: **AI UGC** plus overnight **SEO → content → UGC** automation. No backlinks. No AI-visibility suite.

Powered by [RankReactor](https://www.rankreactor.ai) for project keys and server-side generation — RankReactor is setup only, never the product display name.

## What you get

| Layer | What it is |
|---|---|
| **Agent kit** | MCP snippets (Cursor / Claude / Gemini / Grok) + skills + overnight playbooks |
| **Hero skill** | [`skills/generate-ugc`](./skills/generate-ugc/SKILL.md) — queue short product videos |
| **Light UI** | Next.js viewer: Keywords · Audit snapshot · Articles · **UGC** |
| **Docker** | One image, `docker compose up` on your machine |

RankReactor writes the articles and 9:16 clips. This repo is the open automation layer you cron, schedule, or leave with an agent.

## Quick start (local UI)

```bash
git clone https://github.com/rankreactorai/open-growth-agent.git
cd open-growth-agent
cp .env.example .env
# optional: RANKREACTOR_API_KEY=rr_live_…
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **No key** → mock mode (banner is explicit; nothing is queued on RankReactor).
- **Key** in `.env` or pasted in the UI → live MCP calls with `Authorization: Bearer`.

Full setup: [docs/SETUP.md](./docs/SETUP.md)

## Self-hosting with Docker

Personal machine first — not Cloudflare or Railway for v1. Same shape as a one-service compose file.

```bash
cp .env.example .env
# set RANKREACTOR_API_KEY if you want live mode
docker compose up
```

Open [http://localhost:3000](http://localhost:3000). Details, ports, and mock-vs-live: **[docs/SELF_HOSTING_DOCKER.md](./docs/SELF_HOSTING_DOCKER.md)**.

## Connect an assistant

Hosted MCP: [https://www.rankreactor.ai/mcp](https://www.rankreactor.ai/mcp)

1. In RankReactor, sidebar **API Key** → Generate (`rr_live_…`). Regenerating replaces the old key immediately. Revoke stops it immediately.
2. Prefer the **Bearer** header: `Authorization: Bearer $RANKREACTOR_API_KEY`
3. ChatGPT-style clients that only speak OAuth: paste the same key on **Connect RankReactorAI**

Snippets: [`mcp/`](./mcp/README.md)

| Client | File |
|---|---|
| Cursor | [`mcp/cursor.mcp.json`](./mcp/cursor.mcp.json) |
| Claude | [`mcp/claude.mcp.json`](./mcp/claude.mcp.json) |
| Gemini CLI | [`mcp/gemini.settings.json`](./mcp/gemini.settings.json) |
| Grok | [`mcp/grok.md`](./mcp/grok.md) (marketplace listing coming soon) |

Official install pages: [https://www.rankreactor.ai/docs/ai-assistants](https://www.rankreactor.ai/docs/ai-assistants)

## Skills

Featured first: **generate-ugc**.

| Skill | Job |
|---|---|
| [generate-ugc](./skills/generate-ugc/SKILL.md) | **Hero** — `generate_ugc_video` |
| [seo-coach](./skills/seo-coach/SKILL.md) | Next overnight move from status + metrics |
| [keyword-research](./skills/keyword-research/SKILL.md) | Compose `refresh_metrics` + `get_metrics` |
| [site-audit](./skills/site-audit/SKILL.md) | Compose technical SEO / website audit metrics |
| [content-brief](./skills/content-brief/SKILL.md) | Local brief, then generate-article |
| [generate-article](./skills/generate-article/SKILL.md) | `generate_article` |

Gaps (no MCP tools for research/audit/brief APIs): [docs/SKILLS.md](./docs/SKILLS.md)

## Overnight playbooks

- [Nightly keywords](./playbooks/nightly-keywords.md)
- [Content loop](./playbooks/content-loop.md)
- [**UGC loop**](./playbooks/ugc-loop.md)
- [Weekly audit](./playbooks/weekly-audit.md)

Schedule with crontab, Cursor schedules, or agent cron. Commands: `npm run overnight:keywords` · `overnight:content` · `overnight:ugc` · `overnight:audit`

See [docs/AUTOMATION.md](./docs/AUTOMATION.md)

## Live MCP tools 

`list_projects` · `get_reactor_status` · `get_metrics` · `refresh_metrics` · `list_articles` · `generate_article` · `list_ugc_videos` · `generate_ugc_video`

## Out of scope

Semrush/OpenSEO parity

## License

[MIT](./LICENSE) · [Contributing](./CONTRIBUTING.md)

Need a project and a key? [https://www.rankreactor.ai](https://www.rankreactor.ai)
