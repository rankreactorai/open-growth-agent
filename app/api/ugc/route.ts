import { resolveApiKey } from "@/lib/rankreactor";
import { generateUgcVideo, listUgcVideos } from "@/lib/rankreactor/client";
import { jsonResult } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const apiKey = await resolveApiKey(request);
  return jsonResult(() => listUgcVideos({ apiKey }));
}

export async function POST(request: Request) {
  const apiKey = await resolveApiKey(request);
  let body: { prompt?: string; idealCustomer?: string; productName?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }
  return jsonResult(() => generateUgcVideo({ apiKey }, body));
}
