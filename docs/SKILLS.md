# Skills and MCP gaps

Skills live in [`skills/`](../skills/). They are markdown playbooks for Cursor / Claude / Gemini / Grok — not extra RankReactor APIs.

**Hero skill: [`generate-ugc`](../skills/generate-ugc/SKILL.md).** Feature it. This project is an automated growth reactor; AI UGC is the overnight differentiator.

| Skill | Composes |
|---|---|
| [generate-ugc](../skills/generate-ugc/SKILL.md) | `get_reactor_status` → `generate_ugc_video` → `list_ugc_videos` |
| [seo-coach](../skills/seo-coach/SKILL.md) | `list_projects`, `get_reactor_status`, `get_metrics`, `list_*` |
| [keyword-research](../skills/keyword-research/SKILL.md) | `refresh_metrics` (keywords) + `get_metrics` |
| [site-audit](../skills/site-audit/SKILL.md) | `refresh_metrics` (technical SEO / website audit) + `get_metrics` |
| [content-brief](../skills/content-brief/SKILL.md) | local brief from metrics + status, then generate-article |
| [generate-article](../skills/generate-article/SKILL.md) | `generate_article` + `list_articles` |

## Live MCP tools only

Documented at [https://www.rankreactor.ai/docs/ai-assistants](https://www.rankreactor.ai/docs/ai-assistants):

| Tool | Role |
|---|---|
| `list_projects` | Key scoped to one project |
| `get_reactor_status` | Plan, quotas, recent activity |
| `get_metrics` | Stored search + site health |
| `refresh_metrics` | One of analytics / technical SEO / website audit / keywords |
| `list_articles` | Generated articles |
| `generate_article` | Queue article (confirmation, plan limits) |
| `list_ugc_videos` | Generated shorts |
| `generate_ugc_video` | Queue UGC (confirmation, Pro/Ultra) |

Do not invent tools. If a job is missing, compose the table above + local reasoning.

## MCP gaps (intentional)

These do **not** exist on the hosted server:

- Keyword research / SERP explorer / competitor keywords
- Site crawler / Lighthouse / Core Web Vitals runner
- Content-brief or outline generator
- Publish to WordPress / webhook / Partner Blogger
- Brand brief editor
- Backlink index
- AI visibility / GEO mention tracking
- UGC download, delete, or social publish
- Billing or plan checkout

When a skill needs one of those, it either reasons locally or deep-links [https://www.rankreactor.ai](https://www.rankreactor.ai).

## Argument shapes (unknown vs inferred)

This repo could not call live `tools/list` without a project key. Shapes below are **inferred from product docs** and remapped if a live schema is discovered at runtime (`GET /api/tools` with a key).

| Tool | Inferred arguments | Confidence |
|---|---|---|
| `list_projects` | none (optional `domain` mentioned in troubleshooting) | unknown |
| `get_reactor_status` | none | unknown |
| `get_metrics` | none | unknown |
| `refresh_metrics` | `metric`: `analytics` \| `technical_seo` \| `website_audit` \| `keywords` | inferred |
| `list_articles` | none | unknown |
| `generate_article` | `keyword` (likely); `secondary_keywords`, `content_type`, `word_count`, `goal` unconfirmed | inferred |
| `list_ugc_videos` | none | unknown |
| `generate_ugc_video` | `prompt` (likely); `product_name`, `ideal_customer` unconfirmed | inferred |

Write tools require user confirmation. Plan gates (docs):

- Read tools: every plan
- `refresh_metrics` via assistant: Starter / Pro / Ultra
- `generate_article`: Free has 1 lifetime article (shared with the dashboard); paid daily UTC caps
- `generate_ugc_video`: Pro / Ultra
