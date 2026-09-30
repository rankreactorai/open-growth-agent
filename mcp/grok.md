# Grok

Official status (2026-09-30): a RankReactor **Grok Bot marketplace listing is coming soon**. There is no supported in-marketplace install path today. See [https://www.rankreactor.ai/docs/grok-bot](https://www.rankreactor.ai/docs/grok-bot).

When a Grok / xAI client accepts a remote Streamable HTTP MCP server with headers, use the same URL and Bearer key as Cursor:

```json
{
  "mcpServers": {
    "rankreactor": {
      "url": "https://www.rankreactor.ai/mcp",
      "headers": {
        "Authorization": "Bearer ${RANKREACTOR_API_KEY}"
      }
    }
  }
}
```

Until the listing ships, use Cursor, Claude, Gemini CLI, or ChatGPT (OAuth paste-key) against the same server.

ChatGPT-style clients that only support OAuth: add `https://www.rankreactor.ai/mcp`, choose OAuth, paste the project key on **Connect RankReactorAI**.
