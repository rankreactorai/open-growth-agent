import { mockForTool } from "./mock";
import { mapArgsToSchema, RankReactorMcpClient, RankReactorMcpError } from "./mcp";
import type {
  ClientResult,
  GenerateArticleInput,
  GenerateUgcInput,
  JsonValue,
  LiveMcpTool,
  McpToolSchema,
  MetricKind,
} from "./types";

export type ReactorSession = {
  apiKey?: string | null;
};

function useMock(apiKey?: string | null): boolean {
  return !apiKey || !apiKey.trim();
}

async function runTool(
  apiKey: string | null | undefined,
  tool: LiveMcpTool,
  args: Record<string, unknown> = {},
): Promise<ClientResult> {
  if (useMock(apiKey)) {
    return {
      mode: "mock",
      tool,
      data: mockForTool(tool, args),
      warning:
        "Mock mode — paste a project key (rr_live_…) or set RANKREACTOR_API_KEY to call live MCP tools.",
    };
  }

  const mcp = new RankReactorMcpClient(apiKey as string);
  let schemas: McpToolSchema[] = [];
  try {
    schemas = await mcp.listTools();
  } catch {
    schemas = [];
  }
  const schema = schemas.find((item) => item.name === tool);
  const mapped = mapArgsToSchema(schema, args);
  const data = await mcp.callTool(tool, mapped);
  return { mode: "live", tool, data };
}

export async function listProjects(session: ReactorSession): Promise<ClientResult> {
  return runTool(session.apiKey, "list_projects");
}

export async function getReactorStatus(session: ReactorSession): Promise<ClientResult> {
  return runTool(session.apiKey, "get_reactor_status");
}

export async function getMetrics(session: ReactorSession): Promise<ClientResult> {
  return runTool(session.apiKey, "get_metrics");
}

export async function refreshMetrics(
  session: ReactorSession,
  metric: MetricKind,
): Promise<ClientResult> {
  // Argument name `metric` is inferred from product docs — live schema unknown.
  return runTool(session.apiKey, "refresh_metrics", { metric });
}

export async function listArticles(session: ReactorSession): Promise<ClientResult> {
  return runTool(session.apiKey, "list_articles");
}

export async function generateArticle(
  session: ReactorSession,
  input: GenerateArticleInput,
): Promise<ClientResult> {
  return runTool(session.apiKey, "generate_article", {
    keyword: input.keyword,
    secondary_keywords: input.secondaryKeywords,
    content_type: input.contentType,
    word_count: input.wordCount,
    goal: input.goal,
  });
}

export async function listUgcVideos(session: ReactorSession): Promise<ClientResult> {
  return runTool(session.apiKey, "list_ugc_videos");
}

export async function generateUgcVideo(
  session: ReactorSession,
  input: GenerateUgcInput,
): Promise<ClientResult> {
  return runTool(session.apiKey, "generate_ugc_video", {
    prompt: input.prompt,
    ideal_customer: input.idealCustomer,
    product_name: input.productName,
  });
}

export async function discoverTools(session: ReactorSession): Promise<ClientResult<JsonValue>> {
  if (useMock(session.apiKey)) {
    return {
      mode: "mock",
      data: {
        tools: [
          "list_projects",
          "get_reactor_status",
          "get_metrics",
          "refresh_metrics",
          "list_articles",
          "generate_article",
          "list_ugc_videos",
          "generate_ugc_video",
        ],
        note: "Live input schemas are unknown until a project key calls tools/list.",
      },
    };
  }
  const mcp = new RankReactorMcpClient(session.apiKey as string);
  const tools = await mcp.listTools();
  return { mode: "live", data: { tools } };
}

export { RankReactorMcpError };
