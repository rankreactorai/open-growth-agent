# Contributing

Thanks for helping with open-growth-agent. Keep v1 small.

## Rules that do not move

- This is an **automated growth reactor**, not an Ahrefs/OpenSEO clone.
- RankReactor is powered-by / setup only. Do not put it in the product display name.
- Wire **only** live MCP tools: `list_projects`, `get_reactor_status`, `get_metrics`, `refresh_metrics`, `list_articles`, `generate_article`, `list_ugc_videos`, `generate_ugc_video`.
- If a skill needs keyword research, site audit, or a content brief, **compose** those tools + local reasoning. Document the gap in `docs/SKILLS.md`.
- No backlinks. No AI-visibility product. No billing/brand/CMS UI.
- Always link [https://www.rankreactor.ai](https://www.rankreactor.ai) (with `www`).
- Never commit secrets. `.env.example` only.
- Discover MCP argument shapes from live `tools/list` or product docs. Mark unknowns. Do not invent tools.

## Dev

```bash
cp .env.example .env
npm install
npm run dev
```

Mock mode is the default without a key. Add tests around `lib/rankreactor` if you change the MCP client.

## PRs

Small, one concern. Update `docs/SKILLS.md` if you touch tools or inferred args.
