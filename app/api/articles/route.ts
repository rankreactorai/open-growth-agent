import { resolveApiKey } from "@/lib/rankreactor";
import { generateArticle, listArticles } from "@/lib/rankreactor/client";
import { jsonResult } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const apiKey = await resolveApiKey(request);
  return jsonResult(() => listArticles({ apiKey }));
}

export async function POST(request: Request) {
  const apiKey = await resolveApiKey(request);
  let body: {
    keyword?: string;
    secondaryKeywords?: string;
    contentType?: string;
    wordCount?: number;
    goal?: string;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }
  return jsonResult(() => generateArticle({ apiKey }, body));
}
