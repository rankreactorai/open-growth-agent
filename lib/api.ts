import { NextResponse } from "next/server";
import { RankReactorMcpError, type ClientResult } from "@/lib/rankreactor";

export async function jsonResult(work: () => Promise<ClientResult>) {
  try {
    const result = await work();
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof RankReactorMcpError ? error.status ?? 502 : 500;
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message, mode: "error" }, { status });
  }
}
