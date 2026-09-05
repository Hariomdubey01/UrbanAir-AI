'use client';

import React from 'react';

interface BrandLogoProps {
  scrolled?: boolean;
  className?: string;
}

export default function BrandLogo({ scrolled = false, className = '' }: BrandLogoProps) {
  const sizeClass = scrolled ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-7 h-7 sm:w-8 sm:h-8';

  return (
    <>
      {/* ☀️ LIGHT MODE: DARK UrbanAir AI LOGO (shown when html does not have .dark) */}
      <span className={`flex items-center gap-3 dark:hidden ${className}`}>
        <span
          className={`transition-all duration-200 rounded-xl bg-slate-900 border border-slate-800 text-white flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 group-hover:border-emerald-500/40 ${sizeClass}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* City vertical building silhouette bar */}
            <rect x="9" y="3" width="6" height="18" rx="1.5" className="fill-[#10b981] stroke-none" />
            {/* Airflow curve 1 with signal dot */}
            <path d="M3 8.5 Q9 6 15 8.5 T21 8.5" stroke="#2dd4bf" strokeWidth="2" />
            <circle cx="21" cy="8.5" r="1.5" className="fill-[#6366f1] stroke-none" />
            {/* Airflow curve 2 */}
            <path d="M3 15.5 Q10 17.5 16 15.5 T21 15.5" stroke="#10b981" strokeWidth="1.8" />
          </svg>
        </span>

        <span className="flex items-baseline gap-1">
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            UrbanAir
          </span>
          <span className="font-normal text-sm text-slate-500">
            AI
          </span>
        </span>
      </span>

      {/* 🌙 DARK MODE: WHITE / LIGHT UrbanAir AI LOGO (shown when html has .dark) */}
      <span className={`hidden dark:flex items-center gap-3 ${className}`}>
        <span
          className={`transition-all duration-200 rounded-xl bg-white border border-white/20 text-slate-900 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 group-hover:border-emerald-400/40 ${sizeClass}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* City vertical building silhouette bar */}
            <rect x="9" y="3" width="6" height="18" rx="1.5" className="fill-[#059669] stroke-none" />
            {/* Airflow curve 1 with signal dot */}
            <path d="M3 8.5 Q9 6 15 8.5 T21 8.5" stroke="#0d9488" strokeWidth="2" />
            <circle cx="21" cy="8.5" r="1.5" className="fill-[#6366f1] stroke-none" />
            {/* Airflow curve 2 */}
            <path d="M3 15.5 Q10 17.5 16 15.5 T21 15.5" stroke="#059669" strokeWidth="1.8" />
          </svg>
        </span>

        <span className="flex items-baseline gap-1">
          <span className="font-bold text-lg text-white tracking-tight">
            UrbanAir
          </span>
          <span className="font-normal text-sm text-slate-400">
            AI
          </span>
        </span>
      </span>
    </>
  );
}
