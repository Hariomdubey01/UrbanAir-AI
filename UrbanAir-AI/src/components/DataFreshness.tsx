'use client';

import React, { useState, useEffect } from 'react';
import { getDataFreshness, FreshnessInfo } from '@/lib/air-quality/pollutants';
import { AlertTriangle, Clock, Database } from 'lucide-react';

interface DataFreshnessProps {
  timestamp?: string;
  minutesAgo?: number;
  source?: string;
  isDemo?: boolean;
  isCached?: boolean;
  isStale?: boolean;
  showWarning?: boolean;
  compact?: boolean;
  className?: string;
}

export default function DataFreshness({
  timestamp,
  minutesAgo,
  source = 'Open-Meteo',
  isDemo = false,
  isCached = false,
  isStale = false,
  showWarning = true,
  compact = false,
  className = '',
}: DataFreshnessProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const freshnessInfo: FreshnessInfo = getDataFreshness({
    timestamp,
    explicitMinutesAgo: minutesAgo,
    isDemo,
    isCached,
  });

  const effectiveStale = isStale || freshnessInfo.isStale;
  const effectiveStatus = isDemo ? 'demo' : effectiveStale ? 'stale' : freshnessInfo.status;
  const effectiveSource = source && source.trim() !== '' ? source : 'Source unavailable';

  let dotColor = 'bg-emerald-500';
  let textColor = 'text-emerald-700 dark:text-emerald-300';
  let badgeBorder = 'border-emerald-500/20 bg-emerald-500/10';
  let statusText = '● Current environmental data';

  if (effectiveStatus === 'demo') {
    badgeBorder = 'border-amber-500/30 bg-amber-500/10';
    textColor = 'text-amber-700 dark:text-amber-300';
    statusText = 'DEMO DATA';
  } else if (effectiveStatus === 'stale') {
    dotColor = 'bg-rose-500';
    textColor = 'text-rose-700 dark:text-rose-300';
    badgeBorder = 'border-rose-500/20 bg-rose-500/10';
    statusText = '● Stale environmental data';
  } else if (effectiveStatus === 'recent') {
    dotColor = 'bg-amber-500';
    textColor = 'text-amber-700 dark:text-amber-300';
    badgeBorder = 'border-amber-500/20 bg-amber-500/10';
    statusText = '● Latest available reading';
  } else if (effectiveStatus === 'unavailable') {
    dotColor = 'bg-muted';
    textColor = 'text-muted';
    badgeBorder = 'border-forest-800/10 bg-forest-800/5';
    statusText = '● Data freshness unavailable';
  }

  const ariaStatusLabel = isDemo 
    ? 'Environmental data status: Demonstration values only' 
    : `Environmental data status: ${effectiveStatus}. ${freshnessInfo.relativeTime}.`;

  const ariaSourceLabel = `Environmental data source: ${effectiveSource}`;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs font-mono ${className}`}>
        {effectiveStatus === 'demo' ? (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeBorder} ${textColor}`}>
            DEMO DATA
          </span>
        ) : (
          <div className={`flex items-center gap-1.5 font-medium ${textColor}`} aria-label={ariaStatusLabel}>
            <span className={`w-2 h-2 rounded-full ${dotColor} ${effectiveStatus === 'current' ? 'animate-pulse' : ''}`} />
            <span>{statusText}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 text-xs font-mono ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Status Chip */}
        {effectiveStatus === 'demo' ? (
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeBorder} ${textColor}`}>
            DEMO DATA
          </span>
        ) : (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${badgeBorder} ${textColor}`} aria-label={ariaStatusLabel}>
            <span className={`w-2 h-2 rounded-full ${dotColor} ${effectiveStatus === 'current' ? 'animate-pulse' : ''}`} />
            <span>{statusText}</span>
          </div>
        )}

        {/* Dynamic Relative Timestamp and Source */}
        <div className="flex items-center gap-2 text-muted text-[11px]">
          {effectiveStatus !== 'demo' && <span>{freshnessInfo.relativeTime}</span>}
          <span>·</span>
          <span aria-label={ariaSourceLabel}>Source: <strong>{effectiveSource}</strong></span>
        </div>
      </div>

      {/* Stale Warning Banner (Issue 2) */}
      {showWarning && effectiveStatus === 'stale' && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-700 dark:text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20 font-sans">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>This reading may not represent current conditions.</span>
        </div>
      )}

      {/* Demo Disclosure Banner (Issue 4) */}
      {showWarning && effectiveStatus === 'demo' && (
        <p className="text-[10px] text-amber-700 dark:text-amber-300 font-sans leading-relaxed">
          Demonstration values — not live environmental measurements.
        </p>
      )}
    </div>
  );
}
