---
name: content-brief
description: Local brief from get_metrics + get_reactor_status, then hand off to generate-article.
---

# content-brief

There is **no** `content_brief` MCP tool. Write the brief locally, then hand off.

## Compose

1. `get_reactor_status` — remaining article quota (UTC). Free = 1 lifetime article shared with the dashboard.
2. `get_metrics` — pick a target term from the stored keyword snapshot.
3. `list_articles` — skip terms that already have a draft/published page if you can tell from the payload.
4. Produce a short local brief (markdown in chat — do not call a missing tool):
   - Target keyword
   - Search intent (only if present in metrics)
   - Suggested type: list article / buying guide / pillar page (dashboard options)
   - Angle + outline
   - Optional UGC hook (hand to **generate-ugc**)
5. After the user confirms, run `skills/generate-article`.

## Do not

- Invent a brief API.
- Publish, connect WordPress, or edit brand voice here. Those stay on [https://www.rankreactor.ai](https://www.rankreactor.ai).
- Queue `generate_article` without confirmation.
