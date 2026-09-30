import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    name: "open-growth-agent",
    mcp: process.env.RANKREACTOR_MCP_URL || "https://www.rankreactor.ai/mcp",
    hasEnvKey: Boolean(process.env.RANKREACTOR_API_KEY?.trim()),
  });
}
