import { NextResponse } from "next/server";
import { METRIC_KINDS, resolveApiKey, type MetricKind } from "@/lib/rankreactor";
import { refreshMetrics } from "@/lib/rankreactor/client";
import { jsonResult } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const apiKey = await resolveApiKey(request);
  let body: { metric?: string } = {};
  try {
    body = (await request.json()) as { metric?: string };
  } catch {
    body = {};
  }
  const allowed = METRIC_KINDS.map((item) => item.id);
  const metric = (body.metric || "keywords") as MetricKind;
  if (!allowed.includes(metric)) {
    return NextResponse.json(
      { error: `metric must be one of: ${allowed.join(", ")}` },
      { status: 400 },
    );
  }
  return jsonResult(() => refreshMetrics({ apiKey }, metric));
}
