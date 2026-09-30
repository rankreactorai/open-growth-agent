# Weekly audit pass

## Tools

1. `get_reactor_status`
2. `refresh_metrics` `{ "metric": "technical_seo" }` then `{ "metric": "website_audit" }` if not in cooldown
3. `get_metrics`
4. Local `site-audit` summary (no extra MCP tool)

## Cron

```bash
0 6 * * 1 cd /path/to/open-growth-agent && RANKREACTOR_API_KEY=… npm run overnight:audit
```

Starter can only refresh these metrics every 7 days — weekly is the natural cadence. Pro/Ultra may refresh more often; still do not hammer the endpoint.
