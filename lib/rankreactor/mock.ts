import type { JsonValue } from "./types";

/** Demo payload used when no RANKREACTOR_API_KEY (or pasted key) is present. */
export const MOCK_PROJECT = {
  domain: "glowhive.example",
  name: "Glowhive",
  projectId: "mock_project_glowhive",
};

export const MOCK_STATUS = {
  plan: "Pro",
  domain: MOCK_PROJECT.domain,
  quotas: {
    articlesRemainingToday: 2,
    articlesDailyCap: 3,
    ugcRemainingThisMonth: 2,
    ugcMonthlyCap: 3,
  },
  recentActivity: [
    { kind: "article", title: "Best niacinamide serums for combination skin", status: "published" },
    { kind: "ugc", title: "Trail glow drops — 10s review", status: "ready" },
  ],
};

export const MOCK_METRICS = {
  keywords: {
    refreshedAt: "2026-09-28T04:12:00.000Z",
    page1: 18,
    page2to3: 41,
    items: [
      { keyword: "niacinamide serum", intent: "commercial", volume: 5400, position: 7 },
      { keyword: "best vitamin c for sensitive skin", intent: "commercial", volume: 2900, position: 14 },
      { keyword: "glow drops vs highlighter", intent: "informational", volume: 880, position: 4 },
      { keyword: "trail runner recovery routine", intent: "informational", volume: 720, position: 22 },
    ],
  },
  analytics: {
    organicClicks: 41936,
    impressions: 968000,
    averagePosition: 18.4,
    ctr: 0.043,
  },
  technicalSeo: {
    healthScore: 81,
    geoReadiness: 74,
    issues: ["Missing FAQ schema on 3 money pages", "LCP > 2.5s on /collections/serums"],
  },
  websiteAudit: {
    score: 78,
    critical: 2,
    warnings: 9,
    passed: 41,
  },
};

export const MOCK_ARTICLES = [
  {
    id: "art_01",
    title: "Best niacinamide serums for combination skin",
    keyword: "niacinamide serum",
    status: "published",
    createdAt: "2026-09-22T08:00:00.000Z",
  },
  {
    id: "art_02",
    title: "Glow drops vs highlighter: which finish actually lasts",
    keyword: "glow drops vs highlighter",
    status: "draft",
    createdAt: "2026-09-27T09:10:00.000Z",
  },
];

export const MOCK_UGC = [
  {
    id: "ugc_01",
    title: "Trail glow drops — 10s review",
    productName: "Trail Glow Drops",
    status: "ready",
    aspect: "9:16",
    resolution: "720p",
    createdAt: "2026-09-26T18:40:00.000Z",
  },
  {
    id: "ugc_02",
    title: "Niacinamide morning routine",
    productName: "Clear + Calm Serum",
    status: "generating",
    aspect: "9:16",
    resolution: "720p",
    createdAt: "2026-09-29T22:05:00.000Z",
  },
];

export function mockForTool(tool: string, args: Record<string, unknown> = {}): JsonValue {
  switch (tool) {
    case "list_projects":
      return { projects: [MOCK_PROJECT] };
    case "get_reactor_status":
      return MOCK_STATUS;
    case "get_metrics":
      return MOCK_METRICS;
    case "refresh_metrics":
      return {
        queued: true,
        metric: String(args.metric ?? "keywords"),
        note: "Mock refresh only — no live RankReactor job was created.",
      };
    case "list_articles":
      return { articles: MOCK_ARTICLES };
    case "generate_article":
      return {
        queued: true,
        keyword: String(args.keyword ?? "untitled"),
        status: "generating",
        note: "Mock queue only — no live article was created.",
      };
    case "list_ugc_videos":
      return { videos: MOCK_UGC };
    case "generate_ugc_video":
      return {
        queued: true,
        prompt: String(args.prompt ?? "short product video"),
        status: "queued",
        note: "Mock queue only — no live UGC video was created.",
      };
    default:
      return { error: `Unknown tool in mock: ${tool}` };
  }
}
