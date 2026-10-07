'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StateLocator from '@components/home/StateLocator';
import ReverseLeaderboard from '@components/home/ReverseLeaderboard';
import type { Politician } from '@types';

const HomeClient: React.FC = () => {
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/politicians?limit=50');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setPoliticians(list as Politician[]);
        }
      } catch (e) {
        console.error('Failed to load initial data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const fetchByState = async () => {
      if (!selectedState) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/politicians?state=${encodeURIComponent(selectedState)}`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setPoliticians(list as Politician[]);
        }
      } catch (e) {
        console.error(`Failed to fetch politicians for ${selectedState}:`, e);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedState) {
      fetchByState();
    }
  }, [selectedState]);

  const displayedPoliticians = politicians;
  const handleStateSelect = (state: string) => {
    setSelectedState(state);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-20 space-y-16">
        <section className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-start">
          <div className="space-y-5">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
              India&apos;s citizen governance index
            </p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              See how your MP or MLA is actually performing, not just campaigning.
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-xl">
              Neta turns affidavits, complaints, RTI outcomes and public sentiment into a single
              performance view for every representative, so you can treat elections like a review,
              not a gamble.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/state-ranking"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Browse state rankings
              </Link>
              <Link
                href="/system-transparency"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Verify how Neta behaves
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 pt-4 text-xs text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1">
                <p className="font-semibold text-slate-900">Built for citizens</p>
                <p>
                  Simple scores and clear language. Enough detail for journalists, still readable
                  for first-time voters.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1">
                <p className="font-semibold text-slate-900">Evidence, not vibes</p>
                <p>Affidavits, complaints, RTI trails and votes combined into one performance view.</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
              Start with your state
            </p>
            <p className="text-xs text-slate-600 mb-4">
              Pick a state to see which leaders are underperforming their peers.
            </p>
            <StateLocator onStateSelect={handleStateSelect} />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                MPs and MLAs ranked by performance
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Leaders with the weakest approval appear first, so it is obvious where governance is
                failing. Each rank is grounded in real vote and complaint data collected on Neta.
                {selectedState && (
                  <span className="ml-1 text-indigo-600 font-semibold">
                    Focused on {selectedState}.
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Lowest approval
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Trending better
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-6">
            <ReverseLeaderboard politicians={displayedPoliticians} isLoading={isLoading} />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Governance dashboard</h3>
            <p className="text-xs text-slate-600">
              Understand how stable the overall governance layer is, including anomalies and drift.
            </p>
            <Link
              href="/governance-dashboard"
              className="inline-flex text-xs font-semibold text-blue-600 hover:underline"
            >
              Open governance view
            </Link>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">System workload</h3>
            <p className="text-xs text-slate-600">
              See how many votes have been cast and how much AI work is still pending.
            </p>
            <Link
              href="/public-metrics"
              className="inline-flex text-xs font-semibold text-blue-600 hover:underline"
            >
              View public metrics
            </Link>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Integrity feed</h3>
            <p className="text-xs text-slate-600">
              Inspect the signed system health snapshot that proves how Neta itself behaves.
            </p>
            <Link
              href="/system-transparency"
              className="inline-flex text-xs font-semibold text-blue-600 hover:underline"
            >
              Open transparency page
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeClient;
