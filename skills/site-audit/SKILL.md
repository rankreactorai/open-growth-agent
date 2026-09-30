---
name: site-audit
description: Compose technical SEO + website audit metrics. No dedicated site-audit MCP tool exists.
---

# site-audit

RankReactor has **no** `site_audit` or `run_audit` tool. Compose:

1. `get_reactor_status` — plan + whether a refresh is even allowed.
2. `get_metrics` — stored technical SEO and website audit numbers.
3. `refresh_metrics` for `technical_seo` and/or `website_audit` when the user confirms and the plan is not in cooldown.

## Metric arguments (inferred — unknown live name)

Send `{ "metric": "technical_seo" }` or `{ "metric": "website_audit" }` unless `tools/list` says otherwise. Docs wording: “technical SEO” and “website audit”.

## Cooldowns (analytics / technical SEO / website audit)

| Plan | Interval |
|---|---|
| Free | Scheduled only (30 days) — no assistant refresh |
| Starter | 7 days |
| Pro | 1 day |
| Ultra | 8 hours |

Refreshing one metric does not lock the others (product docs).

## Local reasoning

Summarize scores, critical issues, and warnings **from the payload**. Do not invent Core Web Vitals or crawl graphs that were not returned. Recommended fixes stay advisory. Implementation and full page lists live on [https://www.rankreactor.ai](https://www.rankreactor.ai) Technical SEO & GEO / Website Audit.

This skill does not include backlink analysis or AI-visibility tracking.
