# Content loop: keyword → brief → generate article

## Tools

1. `get_metrics` + local `content-brief`
2. `get_reactor_status` — abort if no article quota
3. `generate_article` `{ "keyword": "…" }` — confirmation
4. `list_articles`

## Cron

```bash
0 8 * * 1-5 cd /path/to/open-growth-agent && RANKREACTOR_API_KEY=… npm run overnight:content -- --keyword='your term'
```

Prefer picking the keyword from last night’s shortlist rather than hard-coding. Agent cron can chain `keyword-research` → `content-brief` → this playbook.

Publishing is **not** in this repo. Drafts appear on RankReactor Generated Pages: [https://www.rankreactor.ai](https://www.rankreactor.ai)
