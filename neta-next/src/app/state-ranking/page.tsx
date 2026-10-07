import { headers } from 'next/headers';

type StateHealth = {
  state: string;
  healthScore: number;
};

type SystemHealthResponse = {
  stats: {
    stateHealth?: StateHealth[];
  };
};

async function fetchSystemHealth(): Promise<SystemHealthResponse | null> {
  try {
    const h = await headers();
    const host = h.get('host') || 'localhost:3000';
    const proto = h.get('x-forwarded-proto') || 'http';
    const baseUrl = `${proto}://${host}`;

    const res = await fetch(`${baseUrl}/api/public/system-health`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as SystemHealthResponse;
  } catch {
    return null;
  }
}

export default async function RankingPage() {
  const data = await fetchSystemHealth();
  const states = data?.stats.stateHealth ?? [];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-xl mx-auto space-y-6">
        <header className="space-y-3">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
            State scorecard
          </p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Which states are governing well according to Neta?
          </h1>
          <p className="text-sm text-slate-600">
            Each state&apos;s score is derived from the combined performance of its MPs and MLAs on
            Neta — complaints, votes and other signals rolled into a single health number.
          </p>
        </header>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
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
        </div>

        <footer className="pt-1 border-t border-slate-200">
          <p className="text-[11px] text-slate-500">
            This view is fully public and driven by the same health feed used on the governance
            dashboard.
          </p>
        </footer>
      </div>
    </div>
  );
}
