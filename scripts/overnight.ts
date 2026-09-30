/**
 * Thin CLI for cron / Cursor schedules / agent cron.
 * RankReactor does the server-side generation; this script only calls live MCP tools.
 *
 *   npm run overnight:keywords
 *   npm run overnight:content
 *   npm run overnight:ugc
 *   npm run overnight:audit
 */
import {
  generateArticle,
  generateUgcVideo,
  getMetrics,
  getReactorStatus,
  listArticles,
  listProjects,
  listUgcVideos,
  refreshMetrics,
} from "../lib/rankreactor/client";

type Playbook = "keywords" | "content" | "ugc" | "audit";

function arg(name: string, fallback?: string): string | undefined {
  const prefix = `--${name}=`;
  const hit = process.argv.find((item) => item.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

async function main() {
  const playbook = (process.argv[2] || "") as Playbook;
  const apiKey = process.env.RANKREACTOR_API_KEY;
  if (!apiKey) {
    console.error("RANKREACTOR_API_KEY is required for overnight playbooks.");
    process.exit(1);
  }
  const session = { apiKey };

  switch (playbook) {
    case "keywords": {
      console.log("Nightly keyword refresh → shortlist");
      const refresh = await refreshMetrics(session, "keywords");
      console.log(JSON.stringify(refresh, null, 2));
      const metrics = await getMetrics(session);
      console.log(JSON.stringify(metrics, null, 2));
      break;
    }
    case "content": {
      const keyword = arg("keyword");
      if (!keyword) {
        console.error("content playbook needs --keyword='target term'");
        process.exit(1);
      }
      console.log("Content loop: generate_article");
      const queued = await generateArticle(session, { keyword });
      console.log(JSON.stringify(queued, null, 2));
      const list = await listArticles(session);
      console.log(JSON.stringify(list, null, 2));
      break;
    }
    case "ugc": {
      const prompt = arg("prompt");
      const productName = arg("product");
      const idealCustomer = arg("customer");
      if (!prompt) {
        console.error("ugc playbook needs --prompt='short product video…'");
        process.exit(1);
      }
      console.log("UGC loop: generate_ugc_video (hero)");
      const queued = await generateUgcVideo(session, { prompt, productName, idealCustomer });
      console.log(JSON.stringify(queued, null, 2));
      const list = await listUgcVideos(session);
      console.log(JSON.stringify(list, null, 2));
      break;
    }
    case "audit": {
      console.log("Weekly audit pass");
      const status = await getReactorStatus(session);
      console.log(JSON.stringify(status, null, 2));
      const tech = await refreshMetrics(session, "technical_seo");
      console.log(JSON.stringify(tech, null, 2));
      const audit = await refreshMetrics(session, "website_audit");
      console.log(JSON.stringify(audit, null, 2));
      const metrics = await getMetrics(session);
      console.log(JSON.stringify(metrics, null, 2));
      break;
    }
    default: {
      const project = await listProjects(session);
      console.log(JSON.stringify(project, null, 2));
      console.error("Usage: tsx scripts/overnight.ts <keywords|content|ugc|audit>");
      process.exit(playbook ? 1 : 0);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
