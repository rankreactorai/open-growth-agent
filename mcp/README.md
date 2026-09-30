# MCP config snippets

Hosted server: [https://www.rankreactor.ai/mcp](https://www.rankreactor.ai/mcp)

Auth is a **per-project** RankReactor key (`rr_live_…`) from the dashboard sidebar **API Key**.

Two ways to send it (existing product behavior — do not invent a second key type):

1. **Bearer header** — `Authorization: Bearer <RANKREACTOR_API_KEY>` on every MCP request. Prefer this when the client documents custom headers.
2. **OAuth paste-key** — clients that only speak MCP OAuth (ChatGPT developer mode, Cursor marketplace plugin, Claude custom connector) open **Connect RankReactorAI**. Paste the same project key and choose Allow. This is not a Google/magic-link login.

Official per-client steps: [https://www.rankreactor.ai/docs/ai-assistants](https://www.rankreactor.ai/docs/ai-assistants)

| Client | Snippet | Official guide |
|---|---|---|
| Cursor | [`cursor.mcp.json`](./cursor.mcp.json) | [https://www.rankreactor.ai/docs/cursor](https://www.rankreactor.ai/docs/cursor) |
| Claude | [`claude.mcp.json`](./claude.mcp.json) | [https://www.rankreactor.ai/docs/claude](https://www.rankreactor.ai/docs/claude) |
| Gemini CLI | [`gemini.settings.json`](./gemini.settings.json) | [https://www.rankreactor.ai/docs/gemini-cli](https://www.rankreactor.ai/docs/gemini-cli) |
| Grok | [`grok.md`](./grok.md) | [https://www.rankreactor.ai/docs/grok-bot](https://www.rankreactor.ai/docs/grok-bot) |

Do not commit a live `rr_live_…` key. Use env interpolation or the client’s secret prompt.
