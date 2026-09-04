'use client';

import React from 'react';
import { Activity, MapPin, AlertTriangle } from 'lucide-react';
import { getDataFreshness, FreshnessInfo } from '@/lib/air-quality/pollutants';

interface LivingCityVisualProps {
  cityName?: string;
  countryName?: string;
  aqi?: number;
  category?: string;
  color?: string;
  isDemo?: boolean;
  isCached?: boolean;
  isStale?: boolean;
  timestamp?: string;
  minutesAgo?: number;
  source?: string;
  aqiStandard?: string;
  pm25?: number;
  pm10?: number;
  no2?: number;
  o3?: number;
  primaryPollutant?: string;
}

export default function LivingCityVisual({
  cityName = 'Delhi',
  countryName = 'India',
  aqi = 164,
  category = 'Unhealthy',
  color = '#ef4444',
  isDemo = false,

  isCached = false,
  isStale = false,
  timestamp,
  minutesAgo,
  source = 'Open-Meteo',
  aqiStandard = 'US EPA AQI',
  pm25 = 72,
  pm10 = 118,
  no2 = 41,
  o3 = 28,
  primaryPollutant = 'O₃',
}: LivingCityVisualProps) {
  const freshnessInfo: FreshnessInfo = getDataFreshness({
    timestamp,
    explicitMinutesAgo: minutesAgo,
    isDemo,
    isCached,
  });

  const effectiveStale = isStale || freshnessInfo.isStale;
  const effectiveStatus = isDemo ? 'demo' : effectiveStale ? 'stale' : freshnessInfo.status;
  const effectiveSource = source && source.trim() !== '' ? source : 'Source unavailable';

  let statusBadgeText = '● Current environmental data';
  let dotColor = 'bg-emerald-500';
  let textColor = 'text-emerald-700 dark:text-emerald-300';
  let badgeBorder = 'border-emerald-500/20 bg-emerald-500/10';

  if (effectiveStatus === 'demo') {
    statusBadgeText = 'DEMO DATA';
    badgeBorder = 'border-amber-500/30 bg-amber-500/10';
    textColor = 'text-amber-700 dark:text-amber-300';
  } else if (effectiveStatus === 'stale') {
    statusBadgeText = '● Stale environmental data';
    dotColor = 'bg-rose-500';
    textColor = 'text-rose-700 dark:text-rose-300';
    badgeBorder = 'border-rose-500/20 bg-rose-500/10';
  } else if (effectiveStatus === 'recent') {
    statusBadgeText = '● Latest available reading';
    dotColor = 'bg-amber-500';
    textColor = 'text-amber-700 dark:text-amber-300';
    badgeBorder = 'border-amber-500/20 bg-amber-500/10';
  } else if (effectiveStatus === 'unavailable') {
    statusBadgeText = '● Data freshness unavailable';
    dotColor = 'bg-muted';
    textColor = 'text-muted';
    badgeBorder = 'border-forest-800/10 bg-forest-800/5';
  }

  const aqiAriaLabel = `Air Quality Index ${aqi}, ${category}, based on ${aqiStandard}`;
  const freshnessAriaLabel = effectiveStatus === 'demo'
    ? 'Environmental data status: Demonstration values only'
    : `Environmental data status: ${effectiveStatus}. ${freshnessInfo.relativeTime}.`;
  const sourceAriaLabel = `Environmental data source: ${effectiveSource}`;

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl glass-card p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-card hover:shadow-2xl transition-shadow duration-300 min-h-[460px] sm:min-h-[480px]">
      
      {/* Background Topographic / Grid Texture (<8% opacity §8.1) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cityGridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cityGridPattern)" />
      </svg>

      {/* Background Living Airflow Waves (§13: 18-24s linear drift) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 600 300" fill="none">
        <path
          d="M-50,75 Q150,35 350,85 T750,65"
          stroke="url(#airflowGrad1)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          className="animate-[airflowWave_20s_linear_infinite] motion-reduce:animate-none"
        />
        <path
          d="M-50,135 Q200,175 400,115 T800,145"
          stroke="url(#airflowGrad2)"
          strokeWidth="2"
          className="animate-[airflowWave_24s_linear_infinite] motion-reduce:animate-none"
          style={{ animationDelay: '2s' }}
        />
        <path
          d="M-50,195 Q250,155 450,215 T850,185"
          stroke="url(#airflowGrad1)"
          strokeWidth="1.8"
          strokeDasharray="4 4"
          className="animate-[airflowWave_18s_linear_infinite] motion-reduce:animate-none"
          style={{ animationDelay: '4s' }}
        />

        <defs>
          <linearGradient id="airflowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="airflowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Particles */}
      <div className="absolute top-10 left-1/4 w-2 h-2 rounded-full bg-emerald-400/60 animate-[particleFloat_8s_ease-in-out_infinite] motion-reduce:animate-none" />
      <div className="absolute top-24 right-1/3 w-2.5 h-2.5 rounded-full bg-teal-400/50 animate-[particleFloat_6s_ease-in-out_infinite] motion-reduce:animate-none" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-36 left-1/3 w-1.5 h-1.5 rounded-full bg-indigo-400/60 animate-[particleFloat_10s_ease-in-out_infinite] motion-reduce:animate-none" style={{ animationDelay: '3s' }} />

      {/* Top Header: Grid Sensor Label + Explicit Data Status (Issues 1, 2, 3, 4, 13) */}
      <div className="relative z-10 flex items-center justify-between gap-2 min-h-[28px]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-sm">
          <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-[pulse_2.4s_ease-in-out_infinite]" />
          <span>Living City Sensor Grid</span>
        </div>

        {effectiveStatus === 'demo' ? (
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeBorder} ${textColor}`}>
            DEMO DATA
          </span>
        ) : (
          <div className={`text-[11px] font-mono font-semibold flex items-center gap-1.5 ${textColor}`} aria-label={freshnessAriaLabel}>
            <span className={`w-2 h-2 rounded-full ${dotColor} ${effectiveStatus === 'current' ? 'animate-pulse' : ''}`} />
            <span>{statusBadgeText}</span>
          </div>
        )}
      </div>

      {/* Hero Telemetry Card (Issues 7, 8, 9, 10, 12) */}
      <div className="relative z-10 my-4 p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">{cityName}, {countryName}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Dominant: <strong className="text-slate-800 dark:text-slate-200">{primaryPollutant || 'Not determined'}</strong></div>
            </div>
          </div>

          {/* Status Chip with Deterministic AQI, Category, and Standard (Issues 7, 8, 9) */}
          <div className="text-right">
            <span
              role="status"
              aria-label={aqiAriaLabel}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-white shadow-md border border-white/10"
              style={{ backgroundColor: color }}
            >
              <span className="tabular-nums font-mono font-black">{aqi}</span>
              <span>·</span>
              <span>{category}</span>
            </span>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              {aqiStandard}
            </div>
          </div>
        </div>

        {/* Telemetry Metric Columns */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/80 text-center font-mono">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">PM2.5</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">{pm25} <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500">µg/m³</span></div>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">PM10</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">{pm10} <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500">µg/m³</span></div>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">NO₂</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">{no2} <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500">µg/m³</span></div>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">O₃</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">{o3} <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500">µg/m³</span></div>
          </div>
        </div>

        {/* Compact Trust Metadata Footer (Issues 2, 3, 4, 5, 6, 12) */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-1 font-mono min-h-[24px]">
          {effectiveStatus === 'demo' ? (
            <span className="text-amber-600 dark:text-amber-300 font-sans text-[10px] leading-relaxed">
              Demonstration values — not live environmental measurements.
            </span>
          ) : (
            <>
              <div className="flex items-center gap-1.5" aria-label={freshnessAriaLabel}>
                <span>{freshnessInfo.relativeTime}</span>
                <span>·</span>
                <span aria-label={sourceAriaLabel}>Source: <strong className="text-slate-800 dark:text-slate-200">{effectiveSource}</strong></span>
              </div>
              <span className="text-teal-600 dark:text-teal-400 font-semibold">{aqiStandard}</span>
            </>
          )}
        </div>

        {/* Stale Warning Banner (Issue 2) */}
        {effectiveStatus === 'stale' && (
          <div className="flex items-center gap-1.5 text-[10px] text-rose-700 dark:text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20 font-sans mt-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>This reading may not represent current conditions.</span>
          </div>
        )}
      </div>

      {/* Vector City Skyline Silhouette Base */}
      <div className="relative z-10 w-full flex items-end justify-center gap-2 pt-2 border-b-2 border-slate-200 dark:border-slate-700/60">
        {/* Building 1 */}
        <div className="w-12 h-16 rounded-t-lg bg-gradient-to-t from-slate-200 to-slate-300 dark:from-slate-950 dark:to-slate-800 border border-slate-300 dark:border-white/10 flex flex-col justify-around p-1">
          <div className="w-full h-1 bg-emerald-500/40 rounded" />
          <div className="w-full h-1 bg-emerald-500/20 rounded" />
          <div className="w-full h-1 bg-emerald-500/40 rounded" />
        </div>

        {/* Building 2 - High Rise with Signal Pulse */}
        <div className="w-16 h-28 rounded-t-xl bg-gradient-to-t from-slate-200 via-slate-300 to-slate-400 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 border border-slate-300 dark:border-white/10 flex flex-col justify-between p-2 shadow-sm">
          <div className="w-full h-2 rounded bg-indigo-500/30 flex justify-end px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-[pulse_2.4s_ease-in-out_infinite]" />
          </div>
          <div className="grid grid-cols-2 gap-1 my-auto">
            <div className="h-2 bg-emerald-500/30 rounded" />
            <div className="h-2 bg-emerald-500/40 rounded" />
            <div className="h-2 bg-emerald-500/40 rounded" />
            <div className="h-2 bg-emerald-500/30 rounded" />
          </div>
        </div>

        {/* Building 3 - Glass Tower */}
        <div className="w-20 h-22 rounded-t-xl bg-gradient-to-t from-slate-200 to-slate-300 dark:from-slate-950 dark:to-slate-800 border border-slate-300 dark:border-white/10 flex flex-col justify-around p-2">
          <div className="w-full h-1.5 bg-teal-500/30 rounded" />
          <div className="w-full h-1.5 bg-teal-500/50 rounded" />
          <div className="w-full h-1.5 bg-teal-500/30 rounded" />
        </div>

        {/* Building 4 */}
        <div className="w-14 h-18 rounded-t-lg bg-gradient-to-t from-slate-200 to-slate-300 dark:from-slate-950 dark:to-slate-800 border border-slate-300 dark:border-white/10 flex flex-col justify-around p-1.5">
          <div className="w-full h-1 bg-emerald-500/30 rounded" />
          <div className="w-full h-1 bg-emerald-500/40 rounded" />
        </div>
      </div>

    </div>
  );
}



