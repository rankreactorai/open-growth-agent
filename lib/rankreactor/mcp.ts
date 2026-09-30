import type { JsonValue, McpToolSchema } from "./types";

export const DEFAULT_MCP_URL = "https://www.rankreactor.ai/mcp";

type JsonRpcSuccess = {
  jsonrpc: "2.0";
  id: number | string;
  result: JsonValue;
};

type JsonRpcError = {
  jsonrpc: "2.0";
  id: number | string | null;
  error: { code: number; message: string; data?: JsonValue };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSsePayload(text: string): JsonValue | null {
  const blocks = text.split(/\n\n+/);
  let last: JsonValue | null = null;
  for (const block of blocks) {
    const dataLines = block
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (!dataLines) continue;
    try {
      last = JSON.parse(dataLines) as JsonValue;
    } catch {
      // ignore keep-alives
    }
  }
  return last;
}

function unwrapRpc(payload: JsonValue, method: string): JsonValue {
  if (!isRecord(payload)) return payload;
  if ("error" in payload) {
    const err = (payload as JsonRpcError).error;
    const extra = err?.data ? ` ${JSON.stringify(err.data)}` : "";
    throw new Error(
      `${method} failed: ${err?.message ?? "MCP error"}${extra}`,
    );
  }
  if ("result" in payload) {
    return (payload as JsonRpcSuccess).result;
  }
  return payload as JsonValue;
}

export class RankReactorMcpError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "RankReactorMcpError";
    this.status = status;
  }
}

export class RankReactorMcpClient {
  private readonly url: string;
  private readonly apiKey: string;
  private sessionId: string | null = null;
  private requestId = 0;
  private initialized = false;

  constructor(apiKey: string, url = process.env.RANKREACTOR_MCP_URL || DEFAULT_MCP_URL) {
    this.apiKey = apiKey.trim();
    this.url = url;
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    };
    if (this.sessionId) headers["Mcp-Session-Id"] = this.sessionId;
    return headers;
  }

  private async post(method: string, params?: Record<string, unknown>): Promise<JsonValue> {
    this.requestId += 1;
    const body = {
      jsonrpc: "2.0",
      id: this.requestId,
      method,
      params: params ?? {},
    };

    const res = await fetch(this.url, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const session = res.headers.get("mcp-session-id") || res.headers.get("Mcp-Session-Id");
    if (session) this.sessionId = session;

    const text = await res.text();
    if (res.status === 401) {
      throw new RankReactorMcpError(
        "401 from RankReactor MCP — key missing, invalid, or revoked. Generate a project key in the dashboard sidebar → API Key.",
        401,
      );
    }
    if (!res.ok) {
      throw new RankReactorMcpError(
        `MCP HTTP ${res.status} on ${method}: ${text.slice(0, 400)}`,
        res.status,
      );
    }

    const ctype = res.headers.get("content-type") || "";
    let payload: JsonValue;
    if (ctype.includes("text/event-stream") || text.startsWith("event:") || text.includes("\ndata:")) {
      const parsed = parseSsePayload(text);
      if (parsed == null) {
        throw new RankReactorMcpError(`Empty SSE payload for ${method}`);
      }
      payload = parsed;
    } else {
      try {
        payload = JSON.parse(text) as JsonValue;
      } catch {
        throw new RankReactorMcpError(`Non-JSON MCP response for ${method}: ${text.slice(0, 240)}`);
      }
    }

    return unwrapRpc(payload, method);
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.post("initialize", {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "open-growth-agent", version: "1.0.0" },
    });
    try {
      await fetch(this.url, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "notifications/initialized",
        }),
        cache: "no-store",
      });
    } catch {
      // notification is best-effort
    }
    this.initialized = true;
  }

  async listTools(): Promise<McpToolSchema[]> {
    await this.initialize();
    const result = await this.post("tools/list", {});
    if (isRecord(result) && Array.isArray(result.tools)) {
      return result.tools as McpToolSchema[];
    }
    return [];
  }

  async callTool(name: string, args: Record<string, unknown> = {}): Promise<JsonValue> {
    await this.initialize();
    const result = await this.post("tools/call", {
      name,
      arguments: args,
    });
    return unwrapToolContent(result);
  }
}

function unwrapToolContent(result: JsonValue): JsonValue {
  if (!isRecord(result)) return result;
  const content = result.content;
  if (Array.isArray(content)) {
    const texts: string[] = [];
    for (const part of content) {
      if (!isRecord(part) || part.type !== "text") continue;
      texts.push(String(part.text ?? ""));
    }
    if (texts.length === 1) {
      const raw = texts[0];
      try {
        return JSON.parse(raw) as JsonValue;
      } catch {
        return raw;
      }
    }
    if (texts.length > 1) return texts;
  }
  if ("structuredContent" in result && result.structuredContent != null) {
    return result.structuredContent as JsonValue;
  }
  return result;
}

export function mapArgsToSchema(
  schema: McpToolSchema | undefined,
  candidates: Record<string, unknown>,
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(candidates)) {
    if (value === undefined || value === "") continue;
    cleaned[key] = value;
  }
  const properties = schema?.inputSchema?.properties;
  if (!properties) return cleaned;

  const out: Record<string, unknown> = {};
  const keys = Object.keys(properties);
  for (const [key, value] of Object.entries(cleaned)) {
    const aliases = expandAliases(key);
    const match = aliases.find((alias) => keys.includes(alias));
    if (match) out[match] = value;
  }

  if (Object.keys(out).length === 0) {
    return cleaned;
  }
  return out;
}

function expandAliases(key: string): string[] {
  const snake = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
  const camel = snake.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
  const spaced = snake.replace(/_/g, " ");
  return Array.from(new Set([key, snake, camel, spaced, snake.replace(/_/g, "")]));
}
