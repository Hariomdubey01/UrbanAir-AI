'use client';

import React from 'react';
import { PollutantDetail } from '@/lib/types';
import { Sparkles } from 'lucide-react';

interface PollutantCardProps {
  pollutant: PollutantDetail;
  onAskAI: (pollutantName: string) => void;
}

export default function PollutantCard({ pollutant, onAskAI }: PollutantCardProps) {
  const getStatusStyle = (status: PollutantDetail['status']) => {
    switch (status) {
      case 'Low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Normal': return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'Elevated': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Hazardous': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="group rounded-2xl glass-card glass-card-hover p-5 space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900/90 flex items-center justify-center font-extrabold text-xs text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/80">
              {pollutant.code}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">{pollutant.name}</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">WHO Limit: {pollutant.standardLimit} {pollutant.unit}</p>
            </div>
          </div>

          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusStyle(pollutant.status)}`}>
            {pollutant.status}
          </span>
        </div>

        {/* Horizontal Value Display */}
        <div className="telemetry-panel p-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {pollutant.value}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{pollutant.unit}</span>
          </div>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {pollutant.value > pollutant.standardLimit ? 'Above Baseline' : 'Within Safety Limits'}
          </span>
        </div>

        {/* Short Definition */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {pollutant.definition}
        </p>
      </div>

      {/* Action CTA (§11) */}
      <button
        onClick={() => onAskAI(pollutant.name)}
        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all active:scale-[0.98]"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>Ask UrbanAir AI about {pollutant.code}</span>
      </button>
    </div>
  );
}
