import { resolveApiKey } from "@/lib/rankreactor";
import { getMetrics } from "@/lib/rankreactor/client";
import { jsonResult } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const apiKey = await resolveApiKey(request);
  return jsonResult(() => getMetrics({ apiKey }));
}
