import { headers } from 'next/headers';

type MetricsResponse = {
  totalVotes: number;
  aiBacklog: number;
};

async function fetchMetrics(): Promise<MetricsResponse | null> {
  try {
    const h = await headers();
    const host = h.get('host') || 'localhost:3000';
    const proto = h.get('x-forwarded-proto') || 'http';
    const baseUrl = `${proto}://${host}`;

    const res = await fetch(`${baseUrl}/api/public/system-metrics`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as MetricsResponse;
  } catch {
    return null;
  }
}

export default async function PublicMetrics() {
  const data = await fetchMetrics();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-xl mx-auto space-y-6">
        <header className="space-y-3">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
            Platform workload
          </p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            How much work is Neta doing right now?
          </h1>
          <p className="text-sm text-slate-600">
            These numbers show how many votes have been recorded and how many politician profiles
            are still waiting for AI narrative refresh. No identities, only aggregate work.
          </p>
        </header>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          {!data ? (
            <p className="text-sm text-slate-500">
              Metrics are currently unavailable. When online, this page shows how much work the
              platform is doing without exposing any individual user.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Total votes recorded
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {data.totalVotes.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500">
                  Combined yes/no votes cast across all politicians tracked on Neta.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  AI backlog (profiles)
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {data.aiBacklog.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500">
                  Politician profiles that still need an updated narrative from the AI layer.
                </p>
              </div>
            </>
          )}
        </div>

        <footer className="pt-1 border-t border-slate-200">
          <p className="text-[11px] text-slate-500">
            This page is read-only, driven by the public <code className="font-mono text-[10px]">/api/public/system-metrics</code> endpoint.
          </p>
        </footer>
      </div>
    </div>
  );
}
