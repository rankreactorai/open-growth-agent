---
name: generate-ugc
description: Hero skill — queue an AI UGC short via RankReactor generate_ugc_video. Feature this first.
---

# generate-ugc (hero)

This is the featured skill. open-growth-agent is an **automated growth reactor**, not a research app. AI UGC is the differentiator: overnight SEO → content → **UGC**.

## Live MCP tool

Use **only** `generate_ugc_video` to queue. Read the result list with `list_ugc_videos`. Check plan/quota first with `get_reactor_status`.

There is no other video tool. Do not invent render, download, publish, or caption tools.

## Preconditions

1. `list_projects` — confirm the keyed site (one project per key).
2. `get_reactor_status` — UGC queue needs **Pro or Ultra**. Free/Starter cannot queue videos. Monthly cap is UTC (Pro 3 / Ultra 10 per product docs).
3. Brand brief lives on RankReactor (Settings → Brand & voice). If generate fails because a brief is missing, deep-link [https://www.rankreactor.ai](https://www.rankreactor.ai) — do not build a brand editor here.

## Arguments (inferred — live schema unknown)

Product docs for UGC Video Marketing describe a dashboard form. MCP argument names were **not** confirmed against `tools/list` in this repo without a live key. Send what the schema allows; otherwise try these inferred fields and stop if the server rejects them:

| Inferred field | Required? | Notes |
|---|---|---|
| `prompt` | likely | Dashboard: required, editable, loaded from brand brief |
| `product_name` | optional | Dashboard: “what they are reviewing” |
| `ideal_customer` | optional | Dashboard: “who is speaking” |

Do **not** invent `image`, `destination`, `duration`, or social-publish args. Reference images and YouTube/Instagram publish stay on RankReactor.

Write tools ask for **confirmation** first. Never queue without an explicit user confirm.

## Procedure

1. Confirm with the user (keyword/product + that quota will be used).
2. Call `generate_ugc_video` with the inferred args the schema accepts.
3. Call `list_ugc_videos` and report status (`queued` / `generating` / `ready` / `failed` / `published` as returned).
4. Failed runs do not use quota (product docs). Ready and in-progress do.
5. Play/download/publish: send the user to [https://www.rankreactor.ai](https://www.rankreactor.ai) UGC Video Marketing.

## Example prompt to the agent

> After I confirm, queue a short product video about our trail runner.

## Overnight

See `docs/AUTOMATION.md` and `playbooks/ugc-loop.md`. RankReactor generates server-side; this repo only queues.
