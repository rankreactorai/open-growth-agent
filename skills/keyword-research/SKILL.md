---
name: keyword-research
description: Compose refresh_metrics (keywords) + get_metrics. No dedicated keyword-research MCP tool exists.
---

# keyword-research

RankReactor has **no** `keyword_research` tool. Compose:

1. `refresh_metrics` with the keywords metric (confirmation; Starter/Pro/Ultra — Free cannot refresh through the assistant).
2. `get_metrics` to read the stored search snapshot.

## Metric argument (inferred — unknown live name)

Product docs: refresh one of `analytics` / `technical SEO` / `website audit` / `keywords`.

This repo sends `{ "metric": "keywords" }` as an inferred argument. If `tools/list` shows a different property (`type`, `kind`, …), use the live schema. Do not invent extra research endpoints.

## Cooldowns (product docs)

| Plan | Keywords interval |
|---|---|
| Free | Scheduled only (28 days) — no assistant refresh |
| Starter | 21 days |
| Pro | 14 days |
| Ultra | 7 days |

If the tool reports cooldown or limit, wait. Do not retry in a loop.

## Local reasoning after `get_metrics`

Shortlist 3–7 terms using whatever fields came back (keyword, intent, volume, position — **if present**). Prefer commercial/transactional language when the payload includes intent. Hand the winner to `content-brief` → `generate-article`, and consider a matching **generate-ugc** prompt.

If the payload has no keyword rows, say the snapshot is empty and point at [https://www.rankreactor.ai](https://www.rankreactor.ai) Keywords & Content.
