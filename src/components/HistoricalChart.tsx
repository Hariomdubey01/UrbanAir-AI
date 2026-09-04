'use client';

import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { HistoricalTrendData } from '@/lib/types';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HistoricalChartProps {
  data: HistoricalTrendData;
  onTimeframeChange: (tf: '24h' | '7d' | '30d') => void;
  activeTimeframe: '24h' | '7d' | '30d';
}

export default function HistoricalChart({ data, onTimeframeChange, activeTimeframe }: HistoricalChartProps) {
  const [activeMetric, setActiveMetric] = useState<'aqi' | 'pm25' | 'pm10' | 'no2' | 'o3'>('aqi');

  const metricColors: Record<string, string> = {
    aqi: '#20A86B',
    pm25: '#2C9C98',
    pm10: '#F3B63F',
    no2: '#E85D5D',
    o3: '#6C63FF',
  };

  const metricLabels: Record<string, string> = {
    aqi: 'AQI Index',
    pm25: 'PM2.5 (µg/m³)',
    pm10: 'PM10 (µg/m³)',
    no2: 'NO₂ (µg/m³)',
    o3: 'O₃ (µg/m³)',
  };

  const getTrendIcon = (direction: 'improving' | 'deteriorating' | 'stable') => {
    if (direction === 'improving') return <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />;
    if (direction === 'deteriorating') return <TrendingUp className="w-3.5 h-3.5 text-amber-500" />;
    return <Minus className="w-3.5 h-3.5 text-muted" />;
  };

  return (
    <div className="rounded-2xl glass-card p-6 sm:p-8 space-y-6 shadow-card">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">See how your city changes</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Observational air telemetry for {data.location.name}
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
          {(['24h', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTimeframe === tf
                  ? 'bg-[#10b981] text-[#090d16] shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Badges (Tabular numerals) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Average AQI</div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">{data.summary.averageAQI}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Peak AQI</div>
          <div className="text-xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-0.5">{data.summary.maxAQI}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Lowest AQI</div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">{data.summary.minAQI}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Trend Pattern</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 capitalize mt-0.5">{data.summary.trendDirection}</div>
          </div>
          {getTrendIcon(data.summary.trendDirection)}
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(['aqi', 'pm25', 'pm10', 'no2', 'o3'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setActiveMetric(m)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeMetric === m
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-black'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {metricLabels[m]}
          </button>
        ))}
      </div>

      {/* Recharts Area Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricColors[activeMetric]} stopOpacity={0.35} />
                <stop offset="95%" stopColor={metricColors[activeMetric]} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0c1322',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
              formatter={(value: any) => [`${value}`, metricLabels[activeMetric]]}
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={metricColors[activeMetric]}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorMetric)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

