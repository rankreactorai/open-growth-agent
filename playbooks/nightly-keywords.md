# Nightly keyword refresh → shortlist

RankReactor stores the keyword snapshot. This playbook only refreshes and reads it.

## Tools

1. `refresh_metrics` `{ "metric": "keywords" }` — inferred arg; confirmation; Starter+
2. `get_metrics`
3. Local shortlist (no MCP tool)

## Cron

```bash
# UTC 07:00 — after most daily caps reset
0 7 * * * cd /path/to/open-growth-agent && RANKREACTOR_API_KEY=… npm run overnight:keywords
```

Cursor schedules / agent cron: run the same command, or ask the agent to follow `skills/keyword-research`.

## Stop conditions

- 401 → key revoked or regenerated. Stop.
- Cooldown / plan limit → log and stop. Do not loop.
- Free plan → skip refresh; read `get_metrics` only.
