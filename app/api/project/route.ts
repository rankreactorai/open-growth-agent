import { resolveApiKey } from "@/lib/rankreactor";
import { getReactorStatus, listProjects } from "@/lib/rankreactor/client";
import { jsonResult } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const apiKey = await resolveApiKey(request);
  return jsonResult(async () => {
    const projects = await listProjects({ apiKey });
    const status = await getReactorStatus({ apiKey });
    return {
      mode: projects.mode,
      tool: "list_projects+get_reactor_status",
      warning: projects.warning,
      data: { projects: projects.data, status: status.data },
    };
  });
}
