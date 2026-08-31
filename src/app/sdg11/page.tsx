'use client';

import React from 'react';
import Link from 'next/link';
import { Globe2, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Building2, Users, Compass, AlertCircle } from 'lucide-react';

export default function SDG11Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="pb-4 border-b border-forest-800/10 dark:border-white/[0.08] space-y-1">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">UN Sustainable Development Goals</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white tracking-tight">SDG 11 — Sustainable Cities & Communities</h1>
        <p className="text-muted text-xs">Making cities and human settlements inclusive, safe, resilient, and sustainable through environmental transparency.</p>
      </div>

      {/* Product-SDG Alignment Banner (§23: Approved Verbs Enforced) */}
      <div className="p-6 sm:p-8 rounded-[20px] bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700 text-white space-y-6 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Target 11.6 & Indicator 11.6.2</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            How UrbanAir AI Contributes to SDG 11
          </h2>
          <p className="text-xs sm:text-sm text-white/90 max-w-3xl leading-relaxed">
            UrbanAir AI <strong>supports</strong> and <strong>contributes to</strong> UN SDG 11 by helping citizens, researchers, and urban leaders access and understand ambient environmental data. It <strong>helps advance awareness of</strong> Target 11.6 without claiming software alone eliminates urban air pollution.
          </p>
        </div>

        {/* 6-Step Understanding Chain Diagram (§23) */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-white/80">From Physical Sensors to Community Empowerment:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
            {[
              { step: '01', title: 'Urban Air Quality', desc: 'Real physical sensors measure ambient air' },
              { step: '02', title: 'Open Data', desc: 'Normalized telemetry made openly accessible' },
              { step: '03', title: 'AI Interpretation', desc: 'Plain-language contextual explanation' },
              { step: '04', title: 'Public Awareness', desc: 'Citizens understand localized exposure' },
              { step: '05', title: 'Informed Action', desc: 'Communities advocate for clean transit' },
              { step: '06', title: 'SDG 11 Contribution', desc: 'Measurable progress toward Target 11.6' },
            ].map((st, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-200">STEP {st.step}</span>
                <div className="text-xs font-semibold text-white leading-tight">{st.title}</div>
                <p className="text-[10px] text-white/70">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to AI Advisor */}
        <div className="pt-2">
          <Link
            href="/ai?q=How%20does%20my%20city%20compare%20to%20UN%20SDG%2011%20and%20WHO%20clean%20air%20benchmarks%3F"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ask AI how your city compares to SDG 11 benchmarks →</span>
          </Link>
        </div>
      </div>

      {/* 4-Column Framework Breakdown (§23) */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-forest-800 dark:text-white">SDG 11.6 Framework Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="p-5 rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] space-y-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-semibold text-sm text-forest-800 dark:text-white">What SDG 11.6 Measures</h3>
            <p className="text-xs text-muted leading-relaxed">
              Target 11.6 tracks the environmental impact of cities, specifically focusing on air quality via Indicator 11.6.2 (annual population-weighted mean PM2.5 concentrations).
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] space-y-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-semibold text-sm text-forest-800 dark:text-white">How UrbanAir AI Supports It</h3>
            <p className="text-xs text-muted leading-relaxed">
              Turns dense spatial sensor grids into plain-language summaries grounded in WHO 2021 guidelines, enabling public scrutiny of urban environmental health.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] space-y-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-semibold text-sm text-forest-800 dark:text-white">Real Urban Challenges</h3>
            <p className="text-xs text-muted leading-relaxed">
              Rapid urbanization, diesel fleets, industrial emissions, and weather inversions create persistent exposure hotspots that disproportionately impact vulnerable neighborhoods.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] space-y-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-ai-500/10 text-ai-500 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="font-semibold text-sm text-forest-800 dark:text-white">How Communities Use This</h3>
            <p className="text-xs text-muted leading-relaxed">
              Parents schedule low-exposure outdoor activities, students conduct grounded science projects, and neighborhood coalitions advocate for low-emission transit corridors.
            </p>
          </div>

        </div>
      </div>

      {/* Scope Disclaimer */}
      <div className="p-4 rounded-xl bg-ivory-100 dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] flex items-start gap-2.5 text-xs text-muted">
        <AlertCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-forest-800 dark:text-slate-200">Ethical Framework Note:</strong> UrbanAir AI makes no claim that software alone eliminates particulate matter. Achieving SDG 11 requires real-world policy reform, industrial emission controls, and green infrastructure investment.
        </p>
      </div>

    </div>
  );
}

