import { headers } from "next/headers";

const KEY_PATTERN = /^rr_live_[A-Za-z0-9_-]+$/;

export function looksLikeProjectKey(value: string | null | undefined): boolean {
  if (!value) return false;
  return KEY_PATTERN.test(value.trim());
}

export async function resolveApiKey(request?: Request): Promise<string | null> {
  if (request) {
    const auth = request.headers.get("authorization") || request.headers.get("Authorization");
    if (auth?.toLowerCase().startsWith("bearer ")) {
      const token = auth.slice(7).trim();
      if (token) return token;
    }
    const headerKey = request.headers.get("x-rankreactor-key");
    if (headerKey?.trim()) return headerKey.trim();
  }

  try {
    const h = await headers();
    const auth = h.get("authorization") || h.get("Authorization");
    if (auth?.toLowerCase().startsWith("bearer ")) {
      const token = auth.slice(7).trim();
      if (token) return token;
    }
    const headerKey = h.get("x-rankreactor-key");
    if (headerKey?.trim()) return headerKey.trim();
  } catch {
    // headers() can throw outside a request
  }

  const envKey = process.env.RANKREACTOR_API_KEY?.trim();
  return envKey || null;
}
