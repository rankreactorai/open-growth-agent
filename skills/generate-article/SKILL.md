---
name: generate-article
description: Queue an article with RankReactor generate_article after confirmation.
---

# generate-article

## Live MCP tool

`generate_article` queues a draft on the keyed project. RankReactor writes it server-side using the project brand brief. List results with `list_articles`.

## Preconditions

1. `get_reactor_status` — article quota remaining.
   - Free: 1 lifetime article (dashboard + assistant share the count).
   - Starter 1 / Pro 3 / Ultra 5 per UTC day (product docs).
2. Brand brief must exist on RankReactor. If the tool says it is missing, deep-link Settings → Brand & voice on [https://www.rankreactor.ai](https://www.rankreactor.ai).
3. Confirmation required before the write.

## Arguments (inferred — live schema unknown)

MCP example from docs: “queue an article for the keyword running shoes.”

Dashboard form also mentions secondary keywords, content type (list article, buying guide, pillar page), word count, and goal. Those names are **not** confirmed on MCP.

| Inferred field | Notes |
|---|---|
| `keyword` | Most likely required |
| `secondary_keywords` | Unknown if accepted |
| `content_type` | Unknown MCP enum |
| `word_count` | Unknown if accepted |
| `goal` | Unknown if accepted |

Prefer `keyword` only unless `tools/list` shows more properties.

## After queue

Call `list_articles`. Statuses on Generated Pages include generating, draft, publishing, published, failed. Publishing destinations are **out of scope** here — send the user to [https://www.rankreactor.ai](https://www.rankreactor.ai).
