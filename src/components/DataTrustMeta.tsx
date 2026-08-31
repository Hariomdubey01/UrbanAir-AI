'use client';

import React from 'react';
import { DataTrustMetaProps } from '@/lib/types';
import { getDataFreshness, FreshnessInfo } from '@/lib/air-quality/pollutants';
import { ShieldCheck, Database, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DataTrustMeta({
  timestamp,
  source = 'Open-Meteo',
  aqiStandard = 'US EPA AQI',
  isDemo = false,
  isCached = false,
  minutesAgo,
  freshness: explicitFreshness,
}: DataTrustMetaProps) {
  const freshnessInfo: FreshnessInfo = getDataFreshness({
    timestamp,
    explicitMinutesAgo: minutesAgo,
    isDemo,
    isCached,
  });

  const effectiveStatus = explicitFreshness || freshnessInfo.status;
  const effectiveSource = source && source.trim() !== '' ? source : 'Source unavailable';

  let freshnessBadgeColor = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
  let dotColor = 'bg-emerald-500';
  let statusText = '● Current environmental data';

  if (isDemo || effectiveStatus === 'demo') {
    freshnessBadgeColor = 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
    statusText = 'DEMO DATA';
  } else if (effectiveStatus === 'stale') {
    freshnessBadgeColor = 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20';
    dotColor = 'bg-rose-500';
    statusText = '● Stale environmental data';
  } else if (effectiveStatus === 'recent') {
    freshnessBadgeColor = 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20';
    dotColor = 'bg-amber-500';
    statusText = '● Latest available reading';
  } else if (effectiveStatus === 'unavailable') {
    freshnessBadgeColor = 'bg-forest-800/10 text-muted border-forest-800/10';
    dotColor = 'bg-muted';
    statusText = '● Data freshness unavailable';
  }

  return (
    <div className="rounded-xl bg-ivory-100/70 dark:bg-forest-900/70 border border-teal-500/20 dark:border-teal-500/20 p-3.5 space-y-2 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        
        {/* Freshness Status Chip */}
        <div className="flex items-center gap-2">
          {effectiveStatus === 'demo' ? (
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${freshnessBadgeColor}`}>
              DEMO DATA
            </span>
          ) : (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${freshnessBadgeColor}`}>
              <span className={`w-2 h-2 rounded-full ${dotColor} ${effectiveStatus === 'current' ? 'animate-pulse' : ''}`} />
              <span>{statusText}</span>
            </div>
          )}

          <span className="text-[11px] text-muted font-mono">
            {effectiveStatus !== 'unavailable' && effectiveStatus !== 'demo' ? freshnessInfo.relativeTime : ''}
          </span>
        </div>

        {/* Demo / Cached Disclosures */}
        {isDemo ? (
          <span className="text-[10px] text-amber-700 dark:text-amber-300 font-sans">
            Demonstration values — not live environmental measurements.
          </span>
        ) : isCached ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-ivory-200 dark:bg-forest-800 text-muted border border-forest-800/10 dark:border-white/[0.08]">
            Showing latest available reading
          </span>
        ) : null}
      </div>

      {/* Stale Warning Banner (Issue 2) */}
      {effectiveStatus === 'stale' && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-700 dark:text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>This reading may not represent current conditions.</span>
        </div>
      )}

      {/* Telemetry Source & AQI Methodology Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-teal-500/10 dark:border-white/[0.05] text-[11px]">
        <div>
          <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">Source</span>
          <span className="font-semibold text-forest-800 dark:text-slate-200">{effectiveSource}</span>
        </div>

        <div>
          <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">AQI Methodology</span>
          <span className="font-semibold text-forest-800 dark:text-slate-200">{aqiStandard}</span>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">Data Standard</span>
          <span className="font-semibold text-teal-600 dark:text-teal-400">WHO 2021 / US EPA</span>
        </div>
      </div>
    </div>
  );
}

