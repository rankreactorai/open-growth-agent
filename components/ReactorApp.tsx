"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiFetch,
  asArray,
  asRecord,
  firstRecord,
  pickNumber,
  pickString,
} from "@/lib/ui";

type Tab = "keywords" | "audit" | "articles" | "ugc";

const DASHBOARD = "https://www.rankreactor.ai";
const KEY_PAGE = "https://www.rankreactor.ai";

function ModeBanner({ mode, warning }: { mode: string; warning?: string }) {
  if (mode === "live") {
    return (
      <div className="rounded-xl border border-reactor-mint/30 bg-reactor-mint/10 px-3 py-2 text-sm text-reactor-mint">
        Live — calling hosted MCP at {DASHBOARD}/mcp
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-reactor-amber/30 bg-reactor-amber/10 px-3 py-2 text-sm text-amber-100">
      {warning ||
        "Mock mode — paste a project key (rr_live_…) or set RANKREACTOR_API_KEY. No live RankReactor jobs run until then."}
    </div>
  );
}

function JsonHint({ data }: { data: unknown }) {
  if (data == null) return null;
  return (
    <details className="mt-4 text-xs text-zinc-500">
      <summary className="cursor-pointer select-none">Raw MCP payload</summary>
      <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-ink-950 p-3 text-[11px] leading-relaxed text-zinc-400">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

function DeepLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-reactor-amber underline-offset-2 hover:underline"
    >
      {children}
    </a>
  );
}

export function ReactorApp({ hasEnvKey }: { hasEnvKey: boolean }) {
  const [pastedKey, setPastedKey] = useState("");
  const [storedKey, setStoredKey] = useState("");
  const [tab, setTab] = useState<Tab>("ugc");
  const [mode, setMode] = useState<"live" | "mock">(hasEnvKey ? "live" : "mock");
  const [warning, setWarning] = useState<string | undefined>();
  const [error, setError] = useState<string>("");
  const [busy, setBusy] = useState<string>("");
  const [project, setProject] = useState<unknown>(null);
  const [metrics, setMetrics] = useState<unknown>(null);
  const [articles, setArticles] = useState<unknown>(null);
  const [ugc, setUgc] = useState<unknown>(null);

  const activeKey = storedKey || (hasEnvKey ? "" : "");

  const loadAll = useCallback(async (key: string) => {
    setError("");
    setBusy("load");
    try {
      const [proj, met, arts, videos] = await Promise.all([
        apiFetch("/api/project", key),
        apiFetch("/api/metrics", key),
        apiFetch("/api/articles", key),
        apiFetch("/api/ugc", key),
      ]);
      setProject(proj.data);
      setMetrics(met.data);
      setArticles(arts.data);
      setUgc(videos.data);
      const nextMode = proj.mode === "live" ? "live" : "mock";
      setMode(nextMode);
      setWarning(proj.warning);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setBusy("");
    }
  }, []);

  useEffect(() => {
    const saved = window.sessionStorage.getItem("oga_key") || "";
    if (saved) {
      setStoredKey(saved);
      setPastedKey(saved);
      void loadAll(saved);
    } else {
      void loadAll("");
    }
  }, [loadAll]);

  function applyKey() {
    const next = pastedKey.trim();
    if (next) window.sessionStorage.setItem("oga_key", next);
    else window.sessionStorage.removeItem("oga_key");
    setStoredKey(next);
    void loadAll(next);
  }

  function clearKey() {
    window.sessionStorage.removeItem("oga_key");
    setPastedKey("");
    setStoredKey("");
    void loadAll("");
  }

  const projectCard = useMemo(() => summarizeProject(project), [project]);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-8 sm:px-6">
      <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-reactor-mint" />
            Automated growth reactor · works while you sleep
          </div>
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-10 w-10" />
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">open-growth-agent</h1>
          </div>
          <p className="mt-3 text-lg text-zinc-300">
            Free to run. Bring a RankReactor API key.{" "}
            <span className="text-white">AI UGC</span> plus overnight SEO → content → UGC — not a
            research app.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            OpenSEO is a research app. This is an automated growth reactor. No backlinks. No AI
            visibility suite. Billing, brand, and CMS stay on{" "}
            <DeepLink href={DASHBOARD}>rankreactor.ai</DeepLink>.
          </p>
        </div>
        <div className="panel w-full max-w-md p-4 shadow-glow">
          <label className="text-xs uppercase tracking-wide text-zinc-500">Project API key</label>
          <input
            className="field mt-2"
            type="password"
            autoComplete="off"
            placeholder="rr_live_…"
            value={pastedKey}
            onChange={(e) => setPastedKey(e.target.value)}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn-amber" onClick={applyKey} disabled={busy === "load"}>
              {hasEnvKey && !pastedKey ? "Use env key" : "Connect project"}
            </button>
            <button className="btn-ghost" onClick={clearKey}>
              Mock mode
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Sidebar → <strong className="text-zinc-300">API Key</strong> in the RankReactor
            dashboard. Generate, regenerate, or revoke there. Key stays in this browser session
            only.
          </p>
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-3">
        <ModeBanner mode={mode} warning={warning} />
        {error ? (
          <div className="rounded-xl border border-reactor-coral/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </div>

      <section className="panel mt-6 grid gap-4 p-5 sm:grid-cols-4">
        <Stat label="Project" value={projectCard.domain || "—"} />
        <Stat label="Plan" value={projectCard.plan || "—"} />
        <Stat label="Articles left" value={projectCard.articles || "—"} />
        <Stat label="UGC left" value={projectCard.ugc || "—"} />
      </section>

      <section className="mt-6 overflow-hidden rounded-3xl border border-reactor-mint/25 bg-gradient-to-br from-emerald-400/10 via-ink-800 to-ink-900 p-6 shadow-mint">
        <p className="text-xs uppercase tracking-[0.2em] text-reactor-mint">Hero · AI UGC</p>
        <h2 className="mt-2 text-2xl font-semibold">Overnight UGC reactor</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-300">
          Queue short 9:16 product videos with <code>generate_ugc_video</code>. RankReactor writes
          them server-side on Pro/Ultra. This repo is the open automation layer — the agent works
          while you sleep.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn-mint" onClick={() => setTab("ugc")}>
            Open UGC
          </button>
          <a className="btn-ghost" href={`${DASHBOARD}`} target="_blank" rel="noreferrer">
            Open RankReactor dashboard
          </a>
        </div>
      </section>

      <nav className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["keywords", "Keywords"],
            ["audit", "Audit snapshot"],
            ["articles", "Articles"],
            ["ugc", "UGC"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            className={tab === id ? "tab-active" : "tab"}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="panel mt-4 p-5">
        {tab === "keywords" ? (
          <KeywordsPanel
            data={metrics}
            busy={busy}
            onRefresh={async () => {
              setBusy("keywords");
              try {
                await apiFetch("/api/metrics/refresh", activeKey, {
                  method: "POST",
                  body: JSON.stringify({ metric: "keywords" }),
                });
                const met = await apiFetch("/api/metrics", activeKey);
                setMetrics(met.data);
                setMode(met.mode === "live" ? "live" : "mock");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Refresh failed");
              } finally {
                setBusy("");
              }
            }}
          />
        ) : null}
        {tab === "audit" ? <AuditPanel data={metrics} /> : null}
        {tab === "articles" ? (
          <ArticlesPanel
            data={articles}
            busy={busy}
            onGenerate={async (keyword) => {
              setBusy("article");
              try {
                await apiFetch("/api/articles", activeKey, {
                  method: "POST",
                  body: JSON.stringify({ keyword }),
                });
                const list = await apiFetch("/api/articles", activeKey);
                setArticles(list.data);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Generate failed");
              } finally {
                setBusy("");
              }
            }}
          />
        ) : null}
        {tab === "ugc" ? (
          <UgcPanel
            data={ugc}
            busy={busy}
            onGenerate={async (payload) => {
              setBusy("ugc");
              try {
                await apiFetch("/api/ugc", activeKey, {
                  method: "POST",
                  body: JSON.stringify(payload),
                });
                const list = await apiFetch("/api/ugc", activeKey);
                setUgc(list.data);
              } catch (err) {
                setError(err instanceof Error ? err.message : "UGC generate failed");
              } finally {
                setBusy("");
              }
            }}
          />
        ) : null}
      </main>

      <footer className="mt-10 flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:justify-between">
        <p>
          Powered by{" "}
          <DeepLink href={DASHBOARD}>RankReactor</DeepLink> — setup and generation only, not the
          product name. Keys: create / regenerate / revoke on the dashboard API Key page.
        </p>
        <p>
          <DeepLink href="https://www.rankreactor.ai/docs/ai-assistants">MCP tools</DeepLink>
          {" · "}
          <DeepLink href={KEY_PAGE}>Get a key</DeepLink>
        </p>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 truncate text-lg font-medium text-white">{value}</p>
    </div>
  );
}

function summarizeProject(data: unknown) {
  const root = asRecord(data);
  const projects = firstRecord(asArray(root?.projects)[0], asRecord(root?.projects), root);
  const status = firstRecord(root?.status, root);
  const quotas = firstRecord(status?.quotas, status);
  return {
    domain:
      pickString(projects, ["domain", "name", "site", "project"]) ||
      pickString(status, ["domain", "name", "site"]),
    plan: pickString(status, ["plan", "tier", "membership"]),
    articles:
      formatPair(quotas, ["articlesRemainingToday", "articlesDailyCap"]) ||
      pickString(quotas, ["articlesRemainingToday", "articles_remaining", "articlesLeft"]),
    ugc:
      formatPair(quotas, ["ugcRemainingThisMonth", "ugcMonthlyCap"]) ||
      pickString(quotas, ["ugcRemainingThisMonth", "videos_remaining", "ugcLeft"]),
  };
}

function formatPair(obj: Record<string, unknown> | null, keys: [string, string]): string {
  const a = pickNumber(obj, [keys[0]]);
  const b = pickNumber(obj, [keys[1]]);
  if (a == null || b == null) return "";
  return `${a} / ${b}`;
}

function KeywordsPanel({
  data,
  busy,
  onRefresh,
}: {
  data: unknown;
  busy: string;
  onRefresh: () => void;
}) {
  const root = asRecord(data);
  const keywordsBlock = firstRecord(root?.keywords, root);
  const items = asArray(keywordsBlock?.items ?? keywordsBlock?.keywords ?? root?.items);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium">Keywords</h3>
          <p className="text-sm text-zinc-500">
            Stored search terms from <code>get_metrics</code>. Refresh calls{" "}
            <code>refresh_metrics</code> (keywords). Paid plans only on live.
          </p>
        </div>
        <button className="btn-amber" disabled={busy === "keywords"} onClick={onRefresh}>
          {busy === "keywords" ? "Refreshing…" : "Refresh keywords"}
        </button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="pb-2">Keyword</th>
              <th className="pb-2">Intent</th>
              <th className="pb-2">Volume</th>
              <th className="pb-2">Position</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="py-4 text-zinc-500" colSpan={4}>
                  No keyword rows in this payload. Open the raw MCP data or refresh on a paid plan.
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const row = asRecord(item);
                return (
                  <tr key={index} className="border-t border-white/5">
                    <td className="py-2.5 text-white">
                      {pickString(row, ["keyword", "term", "query"]) || "—"}
                    </td>
                    <td className="py-2.5 text-zinc-400">{pickString(row, ["intent"]) || "—"}</td>
                    <td className="py-2.5 text-zinc-400">
                      {pickString(row, ["volume", "search_volume"]) || "—"}
                    </td>
                    <td className="py-2.5 text-zinc-400">
                      {pickString(row, ["position", "rank"]) || "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <JsonHint data={data} />
    </div>
  );
}

function AuditPanel({ data }: { data: unknown }) {
  const root = asRecord(data);
  const analytics = firstRecord(root?.analytics);
  const tech = firstRecord(root?.technicalSeo, root?.technical_seo);
  const audit = firstRecord(root?.websiteAudit, root?.website_audit);
  return (
    <div>
      <h3 className="text-lg font-medium">Audit snapshot</h3>
      <p className="text-sm text-zinc-500">
        Read-only view of stored analytics, technical SEO, and website audit from{" "}
        <code>get_metrics</code>. There is no separate site-audit MCP tool — compose metrics +
        local reasoning. Deep-link scans and billing to RankReactor.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Snapshot
          title="Analytics"
          lines={[
            `Clicks ${pickString(analytics, ["organicClicks", "clicks"]) || "—"}`,
            `Impressions ${pickString(analytics, ["impressions"]) || "—"}`,
            `Avg position ${pickString(analytics, ["averagePosition", "avg_position"]) || "—"}`,
          ]}
        />
        <Snapshot
          title="Technical SEO"
          lines={[
            `Health ${pickString(tech, ["healthScore", "score"]) || "—"}`,
            `GEO ${pickString(tech, ["geoReadiness", "geo"]) || "—"}`,
            pickString(asRecord(asArray(tech?.issues)[0]), ["0"]) ||
              (Array.isArray(tech?.issues) ? String(tech?.issues[0] ?? "—") : "—"),
          ]}
        />
        <Snapshot
          title="Website audit"
          lines={[
            `Score ${pickString(audit, ["score"]) || "—"}`,
            `Critical ${pickString(audit, ["critical"]) || "—"}`,
            `Warnings ${pickString(audit, ["warnings"]) || "—"}`,
          ]}
        />
      </div>
      <p className="mt-4 text-sm text-zinc-500">
        Full workspace:{" "}
        <DeepLink href={DASHBOARD}>RankReactor dashboard</DeepLink>
      </p>
      <JsonHint data={data} />
    </div>
  );
}

function Snapshot({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-950/50 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-zinc-200">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function ArticlesPanel({
  data,
  busy,
  onGenerate,
}: {
  data: unknown;
  busy: string;
  onGenerate: (keyword: string) => void;
}) {
  const [keyword, setKeyword] = useState("");
  const [confirm, setConfirm] = useState(false);
  const items = asArray(data);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium">Articles</h3>
          <p className="text-sm text-zinc-500">
            <code>list_articles</code> / <code>generate_article</code>. Publishing and CMS stay on
            RankReactor.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          className="field"
          placeholder="Target keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          className="btn-amber shrink-0"
          disabled={!keyword.trim() || busy === "article"}
          onClick={() => setConfirm(true)}
        >
          {busy === "article" ? "Queuing…" : "Generate article"}
        </button>
      </div>
      {confirm ? (
        <ConfirmBar
          text={`Queue generate_article for “${keyword}”? Uses the same article limits as the RankReactor dashboard.`}
          onCancel={() => setConfirm(false)}
          onOk={() => {
            setConfirm(false);
            onGenerate(keyword.trim());
          }}
        />
      ) : null}
      <ul className="mt-4 divide-y divide-white/5">
        {items.length === 0 ? (
          <li className="py-4 text-sm text-zinc-500">No articles in this payload yet.</li>
        ) : (
          items.map((item, index) => {
            const row = asRecord(item);
            return (
              <li key={index} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-white">
                    {pickString(row, ["title", "keyword", "name"]) || "Untitled"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {pickString(row, ["keyword", "status"]) || ""}
                  </p>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-400">
                  {pickString(row, ["status"]) || "unknown"}
                </span>
              </li>
            );
          })
        )}
      </ul>
      <p className="mt-3 text-sm text-zinc-500">
        Review drafts on{" "}
        <DeepLink href={`${DASHBOARD}`}>Generated Pages</DeepLink>.
      </p>
      <JsonHint data={data} />
    </div>
  );
}

function UgcPanel({
  data,
  busy,
  onGenerate,
}: {
  data: unknown;
  busy: string;
  onGenerate: (payload: { prompt: string; productName?: string; idealCustomer?: string }) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [productName, setProductName] = useState("");
  const [idealCustomer, setIdealCustomer] = useState("");
  const [confirm, setConfirm] = useState(false);
  const items = asArray(data);
  return (
    <div>
      <h3 className="text-lg font-medium">AI UGC videos</h3>
      <p className="text-sm text-zinc-500">
        Hero action. <code>list_ugc_videos</code> / <code>generate_ugc_video</code>. Live queue
        needs Pro or Ultra. Output is 9:16 / 720p on RankReactor.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <input
          className="field sm:col-span-2"
          placeholder="Prompt — short product video about…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <input
          className="field"
          placeholder="Product name (inferred arg)"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          className="field"
          placeholder="Ideal customer (inferred arg)"
          value={idealCustomer}
          onChange={(e) => setIdealCustomer(e.target.value)}
        />
      </div>
      <button
        className="btn-mint mt-3"
        disabled={!prompt.trim() || busy === "ugc"}
        onClick={() => setConfirm(true)}
      >
        {busy === "ugc" ? "Queuing…" : "Generate UGC video"}
      </button>
      {confirm ? (
        <ConfirmBar
          text="Queue generate_ugc_video? Uses the same monthly video limits as the RankReactor dashboard (Pro/Ultra)."
          onCancel={() => setConfirm(false)}
          onOk={() => {
            setConfirm(false);
            onGenerate({
              prompt: prompt.trim(),
              productName: productName.trim() || undefined,
              idealCustomer: idealCustomer.trim() || undefined,
            });
          }}
        />
      ) : null}
      <ul className="mt-4 divide-y divide-white/5">
        {items.length === 0 ? (
          <li className="py-4 text-sm text-zinc-500">No UGC videos in this payload yet.</li>
        ) : (
          items.map((item, index) => {
            const row = asRecord(item);
            return (
              <li key={index} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-white">
                    {pickString(row, ["title", "productName", "product_name", "prompt"]) ||
                      "Untitled clip"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {pickString(row, ["aspect", "resolution"]) || "9:16 · 720p"}
                  </p>
                </div>
                <span className="rounded-full bg-reactor-mint/10 px-2 py-1 text-xs text-reactor-mint">
                  {pickString(row, ["status"]) || "unknown"}
                </span>
              </li>
            );
          })
        )}
      </ul>
      <p className="mt-3 text-sm text-zinc-500">
        Play, download, and social publish live on{" "}
        <DeepLink href={DASHBOARD}>UGC Video Marketing</DeepLink>.
      </p>
      <JsonHint data={data} />
    </div>
  );
}

function ConfirmBar({
  text,
  onCancel,
  onOk,
}: {
  text: string;
  onCancel: () => void;
  onOk: () => void;
}) {
  return (
    <div className="mt-3 rounded-xl border border-reactor-amber/30 bg-reactor-amber/10 p-3 text-sm">
      <p>{text}</p>
      <div className="mt-2 flex gap-2">
        <button className="btn-amber" onClick={onOk}>
          Confirm
        </button>
        <button className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
