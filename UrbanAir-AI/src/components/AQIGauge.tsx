'use client';

import React from 'react';
import { AQICategory } from '@/lib/types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame, Database } from 'lucide-react';
import { getDataFreshness } from '@/lib/air-quality/pollutants';

interface AQIGaugeProps {
  aqi: number;
  category: AQICategory;
  color: string;
  locationName: string;
  updatedAt?: string;
  source?: string;
  minutesAgo?: number;
}

export default function AQIGauge({
  aqi,
  category,
  color,
  locationName,
  updatedAt,
  source = 'Open-Meteo',
  minutesAgo = 8,
}: AQIGaugeProps) {
  const percentage = Math.min(Math.max((aqi / 300) * 100, 3), 97);
  const freshnessInfo = getDataFreshness({ timestamp: updatedAt, explicitMinutesAgo: minutesAgo });

  const effectiveSource = source && source.trim() !== '' ? source : 'Open-Meteo';
  const aqiAriaLabel = `Air Quality Index ${aqi}, ${category}, based on US EPA AQI`;
  const freshnessAriaLabel = `Environmental data status: ${freshnessInfo.status}. ${freshnessInfo.relativeTime}.`;
  const sourceAriaLabel = `Environmental data source: ${effectiveSource}`;


  const getCategoryIcon = (cat: AQICategory) => {
    switch (cat) {
      case 'Good': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'Moderate': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'Unhealthy for Sensitive Groups': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'Unhealthy': return <AlertOctagon className="w-4 h-4 text-red-500" />;
      case 'Very Unhealthy': return <AlertOctagon className="w-4 h-4 text-purple-500" />;
      case 'Hazardous': return <Flame className="w-4 h-4 text-rose-900" />;
      default: return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-sm">
      
      {/* Header with MEASURED label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forest-800/10 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">MEASURED TELEMETRY</span>
            <span className="text-muted text-xs">·</span>
            <span className="text-xs font-medium text-muted">Current Air Quality Index</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white tracking-tight mt-0.5">{locationName}</h2>
        </div>

        {/* Status Chip with ARIA §06, §38 */}
        <div className="flex items-center gap-2">
          <span
            role="status"
            aria-label={aqiAriaLabel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-white font-bold text-xs shadow-sm max-w-full truncate"
            style={{ backgroundColor: color }}
          >
            {getCategoryIcon(category)}
            <span className="font-mono tabular-nums">{aqi}</span>
            <span>·</span>
            <span className="truncate">{category}</span>
          </span>

        </div>
      </div>

      {/* Hero AQI Display (§02: Monospace / Tabular numerals for measured data) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-baseline gap-4 sm:gap-6">
          <span 
            className="text-6xl sm:text-7xl md:text-8xl font-bold font-mono tabular-nums tracking-tight"
            style={{ color }}
          >
            {aqi}
          </span>
          
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">US EPA STANDARD</span>
            <div className="text-sm sm:text-base font-medium text-forest-800 dark:text-slate-200 max-w-xs">
              {aqi <= 50 ? 'Satisfactory clean air with minimal risk' : aqi <= 100 ? 'Acceptable ambient air quality' : aqi <= 150 ? 'Unhealthy for sensitive groups' : aqi <= 200 ? 'Everyone may begin to experience health effects' : aqi <= 300 ? 'Health alert: risk of health effects increased for everyone' : 'Emergency conditions: health warnings for all'}
            </div>
            <div className="text-xs text-muted">
              Primary air quality score for {locationName}
            </div>
          </div>
        </div>

        {/* Clean Refined Gauge Meter */}
        <div className="w-full md:w-72 space-y-2.5 bg-ivory-100 dark:bg-forest-900 p-4 rounded-xl border border-forest-800/10 dark:border-white/[0.08]">
          <div className="flex justify-between text-[10px] font-semibold text-muted">
            <span>Good (0)</span>
            <span>Moderate</span>
            <span>Unhealthy</span>
            <span>Hazardous (300+)</span>
          </div>

          <div className="relative h-3 rounded-full bg-ivory-300 dark:bg-forest-700 p-0.5 overflow-hidden">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 via-red-500 via-purple-600 to-rose-900" />
            <div 
              className="absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full bg-white shadow-sm border-2 border-forest-800 transition-all duration-700"
              style={{ left: `${percentage}%` }}
              title={`AQI Needle: ${aqi}`}
            />
          </div>


          <div className="text-right text-[11px] font-medium text-forest-800 dark:text-slate-300">
            Active needle at <strong className="text-emerald-600 dark:text-emerald-400 font-bold font-mono tabular-nums">{aqi} AQI</strong>
          </div>
        </div>
      </div>

      {/* Footer Info with Data Trust & Staleness Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted pt-3 border-t border-forest-800/10 dark:border-white/[0.08]">
        <div className="flex items-center gap-2" aria-label={freshnessAriaLabel}>
          <span className={`w-2 h-2 rounded-full ${freshnessInfo.isStale ? 'bg-rose-500' : freshnessInfo.isRecent ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
          <span className={freshnessInfo.isStale ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-forest-800/90 dark:text-slate-300 font-medium'}>
            {freshnessInfo.badgeLabel}
          </span>
          <span className="text-muted hidden sm:inline">·</span>
          <span className="text-muted text-[11px] font-mono">
            {freshnessInfo.relativeTime}
          </span>
        </div>

        <div className="truncate max-w-md text-muted text-[11px] font-mono" aria-label={sourceAriaLabel}>
          Source: <strong>{effectiveSource}</strong>
        </div>
      </div>

    </div>
  );
}


