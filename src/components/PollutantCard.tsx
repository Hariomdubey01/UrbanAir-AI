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
      case 'Low': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Normal': return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30';
      case 'Elevated': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'High': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 'Hazardous': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="group rounded-2xl bg-white dark:bg-forest-800 border border-ivory-300 dark:border-forest-700 p-5 hover:border-emerald-500/50 hover:shadow-soft transition-all space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-ivory-100 dark:bg-forest-900 flex items-center justify-center font-extrabold text-xs text-emerald-600 dark:text-emerald-400 border border-ivory-300 dark:border-forest-700">
              {pollutant.code}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-forest-800 dark:text-white tracking-tight">{pollutant.name}</h3>
              <p className="text-[10px] text-muted font-mono">WHO Limit: {pollutant.standardLimit} {pollutant.unit}</p>
            </div>
          </div>

          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusStyle(pollutant.status)}`}>
            {pollutant.status}
          </span>
        </div>

        {/* Horizontal Value Display */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-forest-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {pollutant.value}
            </span>
            <span className="text-xs font-bold text-muted">{pollutant.unit}</span>
          </div>

          <span className="text-xs font-semibold text-muted">
            {pollutant.value > pollutant.standardLimit ? 'Above Baseline' : 'Within Safety Limits'}
          </span>
        </div>

        {/* Short Definition */}
        <p className="text-xs text-muted leading-relaxed line-clamp-2">
          {pollutant.definition}
        </p>
      </div>

      {/* Ask AI Action */}
      <button
        onClick={() => onAskAI(pollutant.code)}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-ivory-100 dark:bg-forest-900 hover:bg-ai-500/10 text-ai-500 border border-ivory-300 dark:border-forest-700 hover:border-ai-500/30 text-xs font-bold transition-all group/btn"
      >
        <Sparkles className="w-3.5 h-3.5 text-ai-500 group-hover/btn:rotate-12 transition-transform" />
        <span>Ask AI about {pollutant.code}</span>
      </button>
    </div>
  );
}
