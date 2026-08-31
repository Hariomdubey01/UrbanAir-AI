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
    <div className="rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <h3 className="text-lg font-semibold text-forest-800 dark:text-white tracking-tight">See how your city changes</h3>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Observational air telemetry for {data.location.name}
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center gap-1 bg-ivory-100 dark:bg-forest-900 p-1 rounded-xl border border-forest-800/10 dark:border-white/[0.08]">
          {(['24h', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTimeframe === tf
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-muted hover:text-forest-800 dark:hover:text-white'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Badges (Tabular numerals) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-ivory-100 dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08]">
          <div className="text-[10px] uppercase font-semibold text-muted">Average AQI</div>
          <div className="text-xl font-bold font-mono tabular-nums text-forest-800 dark:text-white mt-0.5">{data.summary.averageAQI}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-ivory-100 dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08]">
          <div className="text-[10px] uppercase font-semibold text-muted">Peak AQI</div>
          <div className="text-xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-0.5">{data.summary.maxAQI}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-ivory-100 dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08]">
          <div className="text-[10px] uppercase font-semibold text-muted">Lowest AQI</div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">{data.summary.minAQI}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-ivory-100 dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold text-muted">Trend Pattern</div>
            <div className="text-xs font-semibold text-forest-800 dark:text-slate-200 capitalize mt-0.5">{data.summary.trendDirection}</div>
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
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeMetric === m
                ? 'bg-forest-800 dark:bg-forest-700 text-white border-forest-800'
                : 'bg-ivory-100 dark:bg-forest-900 text-muted border-transparent hover:bg-ivory-200'
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
                <stop offset="5%" stopColor={metricColors[activeMetric]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={metricColors[activeMetric]} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 115, 109, 0.15)" />
            <XAxis dataKey="time" stroke="#64736D" fontSize={11} tickLine={false} />
            <YAxis stroke="#64736D" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D1B18',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
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

