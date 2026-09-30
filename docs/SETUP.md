# Setup

open-growth-agent is free to run. You bring a **RankReactor per-project API key**. RankReactor is the powered-by engine, not the product display name.

Official assistant docs: [https://www.rankreactor.ai/docs/ai-assistants](https://www.rankreactor.ai/docs/ai-assistants)

## 1. Create / regenerate / revoke a key

Keys are **per project**, format `rr_live_…`. They are not a new key product invented by this repo.

1. Sign in at [https://www.rankreactor.ai](https://www.rankreactor.ai) and open the project the agent should use.
2. Open **API Key** in the dashboard sidebar.
3. **Generate** — if none exists. Copy it now; RankReactor shows the full value once.
4. **Regenerate** — only when you intend to replace the current key. The old key dies immediately.
5. **Revoke** — stops the current key immediately. OAuth and Bearer connections fail until you generate a new one.

If you manage several sites, create a key on each project you want an assistant to use.

## 2. Environment

```bash
cp .env.example .env
```

Set:

```
RANKREACTOR_API_KEY=rr_live_…
RANKREACTOR_MCP_URL=https://www.rankreactor.ai/mcp
PORT=3000
```

Never commit `.env`. The example file is the only env template in git.

## 3. Connect an assistant (Bearer header preferred)

Hosted MCP: `https://www.rankreactor.ai/mcp`  
Header: `Authorization: Bearer <RANKREACTOR_API_KEY>`

Copy the snippet for your client from [`mcp/`](../mcp/README.md):

- Cursor → `mcp/cursor.mcp.json` (or marketplace plugin + OAuth paste-key)
- Claude Code → `mcp/claude.mcp.json` or `claude mcp add --transport http … --header "Authorization: Bearer …"`
- Gemini CLI → `mcp/gemini.settings.json` (`httpUrl` + headers)
- Grok → `mcp/grok.md` (marketplace listing coming soon; same header shape when custom MCP is available)

### OAuth paste-key (ChatGPT-style clients)

Clients that only support MCP OAuth open **Connect RankReactorAI**. Paste the same project key and choose Allow. This is not Google/magic-link auth. ChatGPT needs developer mode; see [https://www.rankreactor.ai/docs/chatgpt](https://www.rankreactor.ai/docs/chatgpt).

## 4. Run the light UI locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **No key** in env and nothing pasted → **mock mode**. The banner says so. Buttons still run, but they do not create live RankReactor jobs.
- **Env key** or pasted `rr_live_…` → **live mode**. The UI calls the hosted MCP tools with Bearer auth.

Read-mostly sections: Keywords, Audit snapshot, Articles, UGC.  
Buttons that exist because MCP supports them: refresh keywords, generate article, generate UGC.

Billing, brand editor, CMS, and social publish are **not** in this UI. Use [https://www.rankreactor.ai](https://www.rankreactor.ai).

## 5. Docker (personal machine)

See [SELF_HOSTING_DOCKER.md](./SELF_HOSTING_DOCKER.md). One image, `docker compose up`.
