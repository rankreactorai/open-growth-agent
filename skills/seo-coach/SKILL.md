---
name: seo-coach
description: Coach the next overnight move from reactor status + stored metrics. Compose live tools only.
---

# seo-coach

Read the keyed project and recommend the next automated move. You are a growth reactor operator, not an Ahrefs clone.

## Live MCP tools (compose)

1. `list_projects` — which site this key can use (exactly one).
2. `get_reactor_status` — plan, quotas, recent article/video activity.
3. `get_metrics` — stored search + site health.
4. `list_articles` and `list_ugc_videos` — what already exists.

Optional writes (confirmation required, plan-gated):

- `refresh_metrics` if a stored metric is stale and the plan allows it.
- Hand off to `generate-article` or **generate-ugc** (hero) after a brief.

## There is no keyword-research / site-audit / content-brief MCP tool

Those jobs are local reasoning on top of `get_metrics` / `refresh_metrics` / `get_reactor_status`. See `docs/SKILLS.md`.

## Coaching loop

1. Identify the project. Do not guess another domain. Troubleshooting docs: a domain that names a different site is rejected; omit domain so the keyed site is used.
2. Read plan + remaining article/video quota (UTC).
3. Read stored metrics. If empty, say so — do not fabricate ranks.
4. Recommend **one** next action:
   - Refresh keywords (Starter+) if the keyword snapshot is stale.
   - Draft a local content brief, then `generate_article` if article quota remains.
   - **Queue UGC** if Pro/Ultra and video quota remains (prefer this when the user wants growth, not more research).
   - Weekly technical SEO / website audit refresh if due.
5. Deep-link billing, brand, CMS, and social publish to [https://www.rankreactor.ai](https://www.rankreactor.ai).

## Out of scope

Backlinks. AI visibility / GEO dashboards as a product. Semrush-style crawlers. A second RankReactor UI.
