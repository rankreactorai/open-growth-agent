/**
 * Live RankReactor MCP tools (do not invent more):
 * list_projects, get_reactor_status, get_metrics, refresh_metrics,
 * list_articles, generate_article, list_ugc_videos, generate_ugc_video
 *
 * Argument shapes below are inferred from https://www.rankreactor.ai/docs/ai-assistants
 * and related product docs. Live JSON Schema is unknown without a project key —
 * the client discovers tools/list when a key is present and remaps aliases.
 */

export const LIVE_MCP_TOOLS = [
  "list_projects",
  "get_reactor_status",
  "get_metrics",
  "refresh_metrics",
  "list_articles",
  "generate_article",
  "list_ugc_videos",
  "generate_ugc_video",
] as const;

export type LiveMcpTool = (typeof LIVE_MCP_TOOLS)[number];

/** Inferred from product docs. Live enum strings may differ — marked unknown. */
export type MetricKind =
  | "analytics"
  | "technical_seo"
  | "website_audit"
  | "keywords";

export const METRIC_KINDS: { id: MetricKind; label: string; docsName: string }[] =
  [
    { id: "analytics", label: "Analytics", docsName: "analytics" },
    { id: "technical_seo", label: "Technical SEO", docsName: "technical SEO" },
    { id: "website_audit", label: "Website audit", docsName: "website audit" },
    { id: "keywords", label: "Keywords", docsName: "keywords" },
  ];

export type DataMode = "live" | "mock";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonObject = { [key: string]: JsonValue };

export type McpToolSchema = {
  name: string;
  description?: string;
  inputSchema?: {
    type?: string;
    properties?: Record<string, JsonObject>;
    required?: string[];
  };
};

export type GenerateArticleInput = {
  /** Inferred. Dashboard + MCP example: target keyword. */
  keyword?: string;
  /** Inferred from Keywords & Content docs. Unknown if MCP accepts this. */
  secondaryKeywords?: string;
  /** Inferred: list article | buying guide | pillar page. Unknown MCP enum. */
  contentType?: string;
  /** Inferred from dashboard form. Unknown if MCP accepts this. */
  wordCount?: number;
  /** Inferred from dashboard form. Unknown if MCP accepts this. */
  goal?: string;
};

export type GenerateUgcInput = {
  /** Inferred. Dashboard: required editable prompt from the brand brief. */
  prompt?: string;
  /** Inferred. Dashboard: optional “who is speaking”. */
  idealCustomer?: string;
  /** Inferred. Dashboard: optional product being reviewed. */
  productName?: string;
};

export type ClientResult<T = JsonValue> = {
  mode: DataMode;
  tool?: LiveMcpTool | string;
  data: T;
  warning?: string;
};
