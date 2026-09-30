# Overnight automation

RankReactor **generates** articles and UGC on its servers. This repo is the **open automation layer**: skills, playbooks, and a thin client that queues work while you sleep.

OpenSEO is a research app. This is an automated growth reactor.

## Playbooks

| Playbook | File | MCP writes |
|---|---|---|
| Nightly keyword refresh → shortlist | [`playbooks/nightly-keywords.md`](../playbooks/nightly-keywords.md) | `refresh_metrics` (keywords) |
| Content loop | [`playbooks/content-loop.md`](../playbooks/content-loop.md) | `generate_article` |
| **UGC loop (hero)** | [`playbooks/ugc-loop.md`](../playbooks/ugc-loop.md) | `generate_ugc_video` |
| Weekly audit | [`playbooks/weekly-audit.md`](../playbooks/weekly-audit.md) | `refresh_metrics` (technical SEO, website audit) |

Always check `get_reactor_status` before a write. Confirm plan limits. Do not invent extra tools.

## How to schedule

### Simple cron (personal machine)

```bash
cp .env.example .env   # set RANKREACTOR_API_KEY

# keywords every night 07:00 UTC
0 7 * * * cd /path/to/open-growth-agent && . ./.env && npm run overnight:keywords

# article on weekdays (pass a keyword)
0 8 * * 1-5 cd /path/to/open-growth-agent && . ./.env && npm run overnight:content -- --keyword='running shoes'

# UGC twice a week (hero)
30 8 * * 1,4 cd /path/to/open-growth-agent && . ./.env && npm run overnight:ugc -- --prompt='short product video about our trail runner'

# weekly audit Monday 06:00 UTC
0 6 * * 1 cd /path/to/open-growth-agent && . ./.env && npm run overnight:audit
```

The CLI is `scripts/overnight.ts`. It uses the same TypeScript MCP client as the light UI (`Authorization: Bearer`).

### Cursor schedules / agent cron

Point the agent at this repo + [`mcp/cursor.mcp.json`](../mcp/cursor.mcp.json). Schedule a prompt:

> Follow `playbooks/ugc-loop.md` (hero) then `playbooks/content-loop.md` if article quota remains. Confirm writes. Do not invent MCP tools.

Cursor marketplace plugin can use OAuth paste-key instead of the Bearer header.

### Claude / Gemini / Grok

Same playbooks. Claude Code: HTTP transport + header (see `docs/SETUP.md`). Gemini CLI: `httpUrl` + headers. Grok Bot marketplace listing is coming soon; use another client or the header snippet in `mcp/grok.md`.

## What this repo will not automate

Publishing to WordPress, Partner Blogger, YouTube, or Instagram. Brand brief edits. Billing. Those stay on [https://www.rankreactor.ai](https://www.rankreactor.ai).
