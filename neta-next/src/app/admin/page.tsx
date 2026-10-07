 'use client';

 import React, { useEffect, useState } from 'react';
 import Link from 'next/link';
 import {
   Activity,
   AlertTriangle,
   ArrowRight,
   BrainCircuit,
   Database,
   GaugeCircle,
   Globe2,
   ShieldCheck,
   Zap,
 } from 'lucide-react';

 type SystemHealth = {
   healthScore: number;
   riskLevel: 'low' | 'medium' | 'high';
   stats: {
     pendingAI: number;
     voteAnomalies: number;
     staleProfiles: number;
     governanceStability?: number;
     projectedStability?: number;
     healthDrift?: number;
   };
   generatedAt: string;
   hash: string;
 };

 type PublicMetrics = {
   totalVotes: number;
   aiBacklog: number;
 };

 type MonitorStatus = {
   db: 'ok' | 'error';
   pinecone: 'ok' | 'unconfigured';
   gemini: 'ok' | 'unconfigured';
   lastScrape: string | null;
   lastAiRun: string | null;
   pendingScrapes: number;
 };

 type AdminStats = {
   users: number;
   politicians: number | null;
   complaints: number | null;
   pendingComplaints: number | null;
   volunteers: number | null;
   rtiTasks: number | null;
   votes: number | null;
   games: number | null;
 };

 type FetchState<T> = {
   loading: boolean;
   error: string | null;
   data: T | null;
 };

 const initialFetchState = <T,>(): FetchState<T> => ({
   loading: true,
   error: null,
   data: null,
 });

 async function safeGetJson<T>(url: string, options?: RequestInit): Promise<T | null> {
   try {
     const res = await fetch(url, {
       ...options,
       headers: {
         ...(options && options.headers),
       },
     });
     if (!res.ok) {
       return null;
     }
     return (await res.json()) as T;
   } catch {
     return null;
   }
 }

 const AdminControlRoom: React.FC = () => {
   const [health, setHealth] = useState<FetchState<SystemHealth>>(initialFetchState);
   const [metrics, setMetrics] = useState<FetchState<PublicMetrics>>(initialFetchState);
   const [monitor, setMonitor] = useState<FetchState<MonitorStatus>>(initialFetchState);
   const [stats, setStats] = useState<FetchState<AdminStats>>(initialFetchState);
   const [cronMessage, setCronMessage] = useState<string | null>(null);
   const [cronRunning, setCronRunning] = useState(false);

   useEffect(() => {
     const load = async () => {
       setHealth((s) => ({ ...s, loading: true }));
       setMetrics((s) => ({ ...s, loading: true }));
       setMonitor((s) => ({ ...s, loading: true }));
       setStats((s) => ({ ...s, loading: true }));

       const [healthJson, metricsJson, monitorJson, statsJson] = await Promise.all([
         safeGetJson<SystemHealth>('/api/public/system-health'),
         safeGetJson<PublicMetrics>('/api/public/system-metrics'),
         safeGetJson<MonitorStatus>('/api/monitor/status'),
         safeGetJson<AdminStats>('/api/admin/stats'),
       ]);

       setHealth({
         loading: false,
         error: healthJson ? null : 'Unavailable',
         data: healthJson,
       });
       setMetrics({
         loading: false,
         error: metricsJson ? null : 'Unavailable',
         data: metricsJson,
       });
       setMonitor({
         loading: false,
         error: monitorJson ? null : 'Requires admin token or offline',
         data: monitorJson,
       });
       setStats({
         loading: false,
         error: statsJson ? null : 'Requires admin token or offline',
         data: statsJson,
       });
     };

     load();
   }, []);

   const runCron = async (kind: 'scrape' | 'ai-refresh' | 'system-audit') => {
     if (cronRunning) return;
     setCronRunning(true);
     setCronMessage(null);
     try {
       const url =
         kind === 'scrape'
           ? '/api/cron/scrape?limit=5'
           : kind === 'ai-refresh'
           ? '/api/cron/ai-refresh?limit=3'
           : '/api/cron/system-audit?reason=admin';
       const res = await fetch(url);
       if (!res.ok) {
         setCronMessage('Cron endpoint returned an error or requires admin auth.');
       } else {
         const json = (await res.json()) as { ok?: boolean; durationMs?: number };
         if (json && typeof json.durationMs === 'number') {
           setCronMessage(`Job ran in ${json.durationMs}ms.`);
         } else {
           setCronMessage('Job triggered successfully.');
         }
       }
     } catch {
       setCronMessage('Failed to reach cron endpoint.');
     } finally {
       setCronRunning(false);
     }
   };

   const riskColor =
     health.data?.riskLevel === 'high'
       ? 'bg-red-500/10 text-red-600 border border-red-200'
       : health.data?.riskLevel === 'medium'
       ? 'bg-amber-500/10 text-amber-600 border border-amber-200'
       : 'bg-emerald-500/10 text-emerald-600 border border-emerald-200';

   return (
     <div className="min-h-screen bg-slate-50 px-4 py-10">
       <div className="max-w-6xl mx-auto space-y-8">
         <header className="space-y-3">
           <p className="text-xs font-mono uppercase tracking-[0.22em] text-slate-500">
             Neta OS / Superadmin Control
           </p>
           <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
             Command center for the Neta network
           </h1>
           <p className="text-sm text-slate-600 max-w-2xl">
             One place to see infrastructure health, data coverage, and AI backlog, and to trigger
             scrapers and audits. All powered by the same public endpoints citizens can verify.
           </p>
           <div className="flex flex-wrap gap-3 pt-2 text-xs">
             <Link
               href="/governance-dashboard"
               className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white font-semibold shadow-sm hover:bg-slate-800"
             >
               <GaugeCircle size={14} />
               Open governance dashboard
             </Link>
             <Link
               href="/system-transparency"
               className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 bg-white text-slate-800 font-semibold hover:bg-slate-50"
             >
               <ShieldCheck size={14} />
               Verify transparency feed
             </Link>
           </div>
         </header>

         <section className="grid gap-4 md:grid-cols-4">
           <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
             <p className="text-xs font-semibold text-slate-500 uppercase">Health score</p>
             <p className="text-3xl font-black text-slate-900">
               {health.loading ? '…' : health.data?.healthScore ?? '–'}
             </p>
             <p className="text-[11px] text-slate-500">
               Composite score from system checks and audit snapshots.
             </p>
           </div>

           <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3">
             <p className="text-xs font-semibold text-slate-500 uppercase">Risk level</p>
             {health.loading ? (
               <div className="h-7 w-24 rounded-full bg-slate-100 animate-pulse" />
             ) : (
               <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${riskColor}`}>
                 <AlertTriangle size={12} className="mr-1" />
                 {health.data?.riskLevel ?? 'unknown'}
               </span>
             )}
             <p className="text-[11px] text-slate-500">
               Derived from anomalies, stale profiles, and infrastructure checks.
             </p>
           </div>

           <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
             <p className="text-xs font-semibold text-slate-500 uppercase">AI backlog</p>
             <p className="text-2xl font-black text-slate-900">
               {metrics.loading ? '…' : metrics.data?.aiBacklog ?? '–'}
             </p>
             <p className="text-[11px] text-slate-500">
               Profiles still waiting for narrative refresh in the AI layer.
             </p>
           </div>

           <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2">
             <p className="text-xs font-semibold text-slate-500 uppercase">Votes tracked</p>
             <p className="text-2xl font-black text-slate-900">
               {metrics.loading
                 ? '…'
                 : metrics.data?.totalVotes != null
                 ? metrics.data.totalVotes.toLocaleString()
                 : '–'}
             </p>
             <p className="text-[11px] text-slate-500">
               Aggregated from public vote data across all tenants.
             </p>
           </div>
         </section>

         <section className="grid gap-4 md:grid-cols-3">
           <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-xs font-semibold text-slate-500 uppercase">Data coverage</p>
                 <p className="text-sm text-slate-600">
                   Politicians, complaints, RTI tasks, and volunteers in scope.
                 </p>
               </div>
               <Database className="text-slate-400" size={18} />
             </div>
             <div className="grid grid-cols-2 gap-3 text-xs">
               <div className="space-y-1">
                 <p className="text-slate-500">Politicians</p>
                 <p className="text-base font-black text-slate-900">
                   {stats.loading
                     ? '…'
                     : stats.data?.politicians != null
                     ? stats.data.politicians.toLocaleString()
                     : '–'}
                 </p>
               </div>
               <div className="space-y-1">
                 <p className="text-slate-500">Complaints</p>
                 <p className="text-base font-black text-slate-900">
                   {stats.loading
                     ? '…'
                     : stats.data?.complaints != null
                     ? stats.data.complaints.toLocaleString()
                     : '–'}
                 </p>
               </div>
               <div className="space-y-1">
                 <p className="text-slate-500">Volunteers</p>
                 <p className="text-base font-black text-slate-900">
                   {stats.loading
                     ? '…'
                     : stats.data?.volunteers != null
                     ? stats.data.volunteers.toLocaleString()
                     : '–'}
                 </p>
               </div>
               <div className="space-y-1">
                 <p className="text-slate-500">RTI tasks</p>
                 <p className="text-base font-black text-slate-900">
                   {stats.loading
                     ? '…'
                     : stats.data?.rtiTasks != null
                     ? stats.data.rtiTasks.toLocaleString()
                     : '–'}
                 </p>
               </div>
             </div>
           </div>

           <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-xs font-semibold text-slate-500 uppercase">
                   Infrastructure stack
                 </p>
                 <p className="text-sm text-slate-600">
                   Quick view of DB, vector search, and AI provider health.
                 </p>
               </div>
               <Globe2 className="text-slate-400" size={18} />
             </div>
             <div className="grid grid-cols-3 gap-2 text-[11px]">
               <StackPill
                 label="Database"
                 status={monitor.data?.db === 'ok' ? 'ok' : 'error'}
                 icon={<Database size={12} />}
               />
               <StackPill
                 label="Pinecone"
                 status={monitor.data?.pinecone === 'ok' ? 'ok' : 'unconfigured'}
                 icon={<BrainCircuit size={12} />}
               />
               <StackPill
                 label="Gemini"
                 status={monitor.data?.gemini === 'ok' ? 'ok' : 'unconfigured'}
                 icon={<Activity size={12} />}
               />
             </div>
             <p className="text-[11px] text-slate-500">
               {monitor.error
                 ? monitor.error
                 : monitor.loading
                 ? 'Loading monitor status…'
                 : 'Status derived from internal health checks.'}
             </p>
           </div>

           <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-xs font-semibold text-slate-500 uppercase">Scraper queue</p>
                 <p className="text-sm text-slate-600">
                   Remaining profiles to refresh from live MyNeta and other sources.
                 </p>
               </div>
               <Zap className="text-slate-400" size={18} />
             </div>
             <p className="text-2xl font-black text-slate-900">
               {monitor.loading
                 ? '…'
                 : monitor.data
                 ? monitor.data.pendingScrapes.toLocaleString()
                 : '–'}
             </p>
             <div className="flex items-center justify-between text-[11px] text-slate-500">
               <span>
                 Last scrape:{' '}
                 {monitor.data?.lastScrape
                   ? new Date(monitor.data.lastScrape).toLocaleString()
                   : 'never'}
               </span>
               <span>
                 Last AI run:{' '}
                 {monitor.data?.lastAiRun
                   ? new Date(monitor.data.lastAiRun).toLocaleString()
                   : 'never'}
               </span>
             </div>
           </div>
         </section>

         <section className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
           <div className="flex items-center justify-between gap-3">
             <div>
               <p className="text-xs font-semibold text-slate-500 uppercase">
                 Control actions
               </p>
               <p className="text-sm text-slate-600">
                 Trigger jobs through the same HTTP interfaces used by your cron runner.
               </p>
             </div>
             {cronMessage && (
               <p className="text-[11px] text-slate-500 max-w-xs text-right">{cronMessage}</p>
             )}
           </div>
           <div className="grid gap-3 md:grid-cols-3">
             <ActionButton
               label="Run scrape batch"
               description="Fetch and normalise real politician data."
               icon={<Activity size={16} />}
               onClick={() => runCron('scrape')}
               disabled={cronRunning}
             />
             <ActionButton
               label="Run AI refresh"
               description="Regenerate narratives for stale profiles."
               icon={<BrainCircuit size={16} />}
               onClick={() => runCron('ai-refresh')}
               disabled={cronRunning}
             />
             <ActionButton
               label="Run system audit"
               description="Produce a signed health report and snapshot."
               icon={<ShieldCheck size={16} />}
               onClick={() => runCron('system-audit')}
               disabled={cronRunning}
             />
           </div>
           <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
             <span>
               For more detailed views, go to the{' '}
               <Link href="/system-transparency" className="text-blue-600 font-semibold">
                 transparency feed
               </Link>{' '}
               or{' '}
               <Link href="/governance-dashboard" className="text-blue-600 font-semibold">
                 governance dashboard
               </Link>
               .
             </span>
             <span className="inline-flex items-center gap-1">
               <ArrowRight size={12} /> All actions are logged via Next API.
             </span>
           </div>
         </section>

         <section className="rounded-3xl border border-slate-200 bg-slate-900 text-slate-50 p-5 space-y-3">
           <div className="flex items-center gap-3">
             <Activity size={18} className="text-emerald-400" />
             <h2 className="text-sm font-semibold tracking-wide">
               Deep links for specialists
             </h2>
           </div>
           <div className="grid gap-2 md:grid-cols-3 text-[11px]">
             <Link
               href="/open-data.json"
               className="flex items-center justify-between rounded-2xl bg-slate-800/70 px-3 py-2 hover:bg-slate-800 transition-colors"
             >
               <span className="font-medium">Open data feed</span>
               <span className="text-slate-400">JSON</span>
             </Link>
             <Link
               href="/public-metrics"
               className="flex items-center justify-between rounded-2xl bg-slate-800/70 px-3 py-2 hover:bg-slate-800 transition-colors"
             >
               <span className="font-medium">Public metrics</span>
               <span className="text-slate-400">Dashboard</span>
             </Link>
             <Link
               href="/system-transparency"
               className="flex items-center justify-between rounded-2xl bg-slate-800/70 px-3 py-2 hover:bg-slate-800 transition-colors"
             >
               <span className="font-medium">Integrity snapshots</span>
               <span className="text-slate-400">Audit</span>
             </Link>
           </div>
         </section>
       </div>
     </div>
   );
 };

 type StackPillProps = {
   label: string;
   status: 'ok' | 'error' | 'unconfigured';
   icon: React.ReactNode;
 };

 const StackPill: React.FC<StackPillProps> = ({ label, status, icon }) => {
   const color =
     status === 'ok'
       ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
       : status === 'error'
       ? 'bg-red-50 text-red-700 border-red-200'
       : 'bg-slate-50 text-slate-500 border-slate-200';
   return (
     <div
       className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] font-semibold ${color}`}
     >
       {icon}
       <span>{label}</span>
     </div>
   );
 };

 type ActionButtonProps = {
   label: string;
   description: string;
   icon: React.ReactNode;
   onClick: () => void;
   disabled?: boolean;
 };

 const ActionButton: React.FC<ActionButtonProps> = ({
   label,
   description,
   icon,
   onClick,
   disabled,
 }) => {
   return (
     <button
       type="button"
       onClick={onClick}
       disabled={disabled}
       className="w-full text-left rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors px-4 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
     >
       <div className="flex items-start gap-3">
         <div className="mt-0.5 text-slate-500">{icon}</div>
         <div className="space-y-1">
           <p className="text-xs font-semibold text-slate-900">{label}</p>
           <p className="text-[11px] text-slate-500">{description}</p>
         </div>
       </div>
     </button>
   );
 };

 export default AdminControlRoom;

