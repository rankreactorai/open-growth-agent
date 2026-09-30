# UGC loop (hero)

Featured overnight path. Queue a short product video, then stop. RankReactor renders 9:16 / 720p server-side.

## Tools

1. `get_reactor_status` — Pro/Ultra + monthly video quota (UTC)
2. `generate_ugc_video` — confirmation; inferred `{ prompt, product_name?, ideal_customer? }`
3. `list_ugc_videos`

## Cron

```bash
30 8 * * 1,4 cd /path/to/open-growth-agent && RANKREACTOR_API_KEY=… npm run overnight:ugc -- --prompt='short product video about our trail runner' --product='Trail runner'
```

Two nights a week is enough for Pro (3/month). Ultra can run more often — still respect the monthly cap.

Play, download, and social publish stay on [https://www.rankreactor.ai](https://www.rankreactor.ai).
