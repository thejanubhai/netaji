import { headers } from 'next/headers';

type StateHealth = {
  state: string;
  healthScore: number;
};

type SystemHealthResponse = {
  healthScore: number;
  stats: {
    voteAnomalies: number;
    governanceStability: number;
    healthDrift?: number;
    stateHealth?: StateHealth[];
  };
  hash: string;
};

type MetricsResponse = {
  totalVotes: number;
  aiBacklog: number;
};

type AnchorResponse = {
  latest: {
    hash: string;
    created_at: string;
  } | null;
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const h = await headers();
    const host = h.get('host') || 'localhost:3000';
    const proto = h.get('x-forwarded-proto') || 'http';
    const baseUrl = `${proto}://${host}`;

    const res = await fetch(`${baseUrl}${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default async function GovernanceDashboardPage() {
  const [health, metrics, anchor] = await Promise.all([
    fetchJson<SystemHealthResponse>('/api/public/system-health'),
    fetchJson<MetricsResponse>('/api/public/system-metrics'),
    fetchJson<AnchorResponse>('/api/public/verify-anchor'),
  ]);

  const states = health?.stats.stateHealth ?? [];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
            Public governance signal
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Is the Neta governance layer behaving like a good referee?
          </h1>
          <p className="text-sm text-slate-600">
            This page turns internal integrity checks into a simple, public dashboard. No user data,
            no secrets — only the health of the rules engine that powers Neta.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Health score</p>
            <p className="text-2xl font-black text-slate-900">
              {health ? health.healthScore : '–'}
            </p>
            <p className="text-[11px] text-slate-500">
              0–100 composite stability score for the governance engine.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Governance stability
            </p>
            <p className="text-2xl font-black text-slate-900">
              {health ? health.stats.governanceStability : '–'}
            </p>
            <p className="text-[11px] text-slate-500">
              Higher is better. Captures how predictable rule outcomes are over time.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Vote anomalies</p>
            <p className="text-2xl font-black text-slate-900">
              {health ? health.stats.voteAnomalies : '–'}
            </p>
            <p className="text-[11px] text-slate-500">
              Suspicious vote patterns detected by the anomaly engine in the last window.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Health drift</p>
            <p className="text-2xl font-black text-slate-900">
              {health && typeof health.stats.healthDrift === 'number'
                ? health.stats.healthDrift
                : '–'}
            </p>
            <p className="text-[11px] text-slate-500">
              Short-term movement in the health score compared to the previous audit.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Total votes on Neta</p>
            <p className="text-2xl font-black text-slate-900">
              {metrics ? metrics.totalVotes : '–'}
            </p>
            <p className="text-[11px] text-slate-500">
              Aggregate yes/no votes cast across all tracked politicians.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">AI backlog</p>
            <p className="text-2xl font-black text-slate-900">
              {metrics ? metrics.aiBacklog : '–'}
            </p>
            <p className="text-[11px] text-slate-500">
              Profiles still waiting for narrative refresh by the AI layer.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Latest anchor hash</p>
            <p className="text-xs font-mono break-all text-slate-800">
              {anchor?.latest?.hash || health?.hash || 'No anchor yet'}
            </p>
            {anchor?.latest?.created_at && (
              <p className="text-[11px] text-slate-500">
                Anchored at {new Date(anchor.latest.created_at).toLocaleString()}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              State governance ranking
            </h2>
            <p className="text-[11px] text-slate-500">
              Ranking based on how healthy each state&apos;s combined representation looks.
            </p>
          </div>
          {states.length === 0 ? (
            <p className="text-sm text-slate-500">No state health data available.</p>
          ) : (
            <div className="space-y-2">
              {states.map((s, index) => (
                <div
                  key={s.state}
                  className="flex items-center justify-between text-sm text-slate-700 rounded-2xl border border-slate-100 bg-white px-4 py-2"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-400 w-5">
                      {index + 1}.
                    </span>
                    <span className="font-medium">{s.state}</span>
                  </span>
                  <span className="font-semibold text-slate-900">{s.healthScore}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="pt-2 border-t border-slate-200 mt-4">
          <p className="text-[11px] text-slate-500">
            This dashboard is read-only and only consumes aggregation endpoints. It exposes no user
            identities, internal IDs or API secrets.
          </p>
        </footer>
      </div>
    </div>
  );
}
