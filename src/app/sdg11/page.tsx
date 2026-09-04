'use client';

import React from 'react';
import Link from 'next/link';
import { Globe2, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Building2, Users, Compass, AlertCircle } from 'lucide-react';

export default function SDG11Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-entrance">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-white/10 space-y-1">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">UN Sustainable Development Goals</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">SDG 11 — Sustainable Cities & Communities</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Making cities and human settlements inclusive, safe, resilient, and sustainable through environmental transparency.</p>
      </div>

      {/* Product-SDG Alignment Banner (§23: Approved Verbs Enforced) */}
      <div className="sdg-panel-container p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Target 11.6 & Indicator 11.6.2</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            How UrbanAir AI Contributes to SDG 11
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 max-w-3xl leading-relaxed">
            UrbanAir AI <strong>supports</strong> and <strong>contributes to</strong> UN SDG 11 by helping citizens, researchers, and urban leaders access and understand ambient environmental data. It <strong>helps advance awareness of</strong> Target 11.6 without claiming software alone eliminates urban air pollution.
          </p>
        </div>

        {/* 6-Step Understanding Chain Diagram (§23) */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300">From Physical Sensors to Community Empowerment:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
            {[
              { step: '01', title: 'Urban Air Quality', desc: 'Real physical sensors measure ambient air' },
              { step: '02', title: 'Open Data', desc: 'Normalized telemetry made openly accessible' },
              { step: '03', title: 'AI Interpretation', desc: 'Plain-language contextual explanation' },
              { step: '04', title: 'Public Awareness', desc: 'Citizens understand localized exposure' },
              { step: '05', title: 'Informed Action', desc: 'Communities advocate for clean transit' },
              { step: '06', title: 'SDG 11 Contribution', desc: 'Measurable progress toward Target 11.6' },
            ].map((st, i) => (
              <div key={i} className="p-3.5 rounded-xl inner-panel flex flex-col justify-between space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">STEP {st.step}</span>
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{st.title}</div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to AI Advisor */}
        <div className="pt-2">
          <Link
            href="/ai?q=How%20does%20my%20city%20compare%20to%20UN%20SDG%2011%20and%20WHO%20clean%20air%20benchmarks%3F"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#090d16] text-xs font-bold shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)] transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI how your city compares to SDG 11 benchmarks →</span>
          </Link>
        </div>
      </div>

      {/* 4-Column Framework Breakdown (§23) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">SDG 11.6 Framework Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="p-5 rounded-2xl glass-card glass-card-hover space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">What SDG 11.6 Measures</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Target 11.6 tracks the environmental impact of cities, specifically focusing on air quality via Indicator 11.6.2 (annual population-weighted mean PM2.5 concentrations).
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl glass-card glass-card-hover space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">How UrbanAir AI Supports It</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Turns dense spatial sensor grids into plain-language summaries grounded in WHO 2021 guidelines, enabling public scrutiny of urban environmental health.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl glass-card glass-card-hover space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Real Urban Challenges</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Rapid urbanization, diesel fleets, industrial emissions, and weather inversions create persistent exposure hotspots that disproportionately impact vulnerable neighborhoods.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl glass-card glass-card-hover space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">How Communities Use This</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Parents schedule low-exposure outdoor activities, students conduct grounded science projects, and neighborhood coalitions advocate for low-emission transit corridors.
            </p>
          </div>

        </div>
      </div>

      {/* Scope Disclaimer */}
      <div className="p-4 rounded-xl inner-panel flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
        <AlertCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 dark:text-white">Ethical Framework Note:</strong> UrbanAir AI makes no claim that software alone eliminates particulate matter. Achieving SDG 11 requires real-world policy reform, industrial emission controls, and green infrastructure investment.
        </p>
      </div>

    </div>
  );
}

