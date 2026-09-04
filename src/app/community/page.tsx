'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Users, Globe2, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-entrance">
      
      {/* Header */}
      <div className="pb-4 border-b border-white/10 space-y-1">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-emerald-400 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Community Intelligence Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Community Air Intelligence & Action</h1>
        <p className="text-slate-400 text-xs">Connecting individual environmental data with community-level understanding under UN SDG 11.</p>
      </div>

      {/* Hero Banner */}
      <div className="rounded-2xl bg-[rgba(15,23,42,0.75)] backdrop-blur-md border border-white/10 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-card">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Community Perspective</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Informed Communities Build Sustainable Cities.</h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
            When individuals understand what their city's AQI numbers mean, communities can make informed decisions about active transit, outdoor activity planning, school zone safety, and local greening initiatives.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
            <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
            <div className="text-2xl font-bold font-mono text-white">90%+</div>
            <div className="text-[11px] text-slate-400">Urban dwellers exposed to air above WHO limits</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
            <Globe2 className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
            <div className="text-2xl font-bold font-mono text-white">Target 11.6</div>
            <div className="text-[11px] text-slate-400">UN SDG 11 city environmental footprint goal</div>
          </div>
        </div>
      </div>

      {/* Actionable Pillars Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Four Pillars of Community Environmental Awareness</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: '1. Accessible Intelligence',
              desc: 'Translating technical PM2.5 and AQI numbers into simple language so families and students can easily interpret ambient conditions.',
            },
            {
              title: '2. Low-Emission Transit',
              desc: 'Encouraging walking, cycling, and electric public transit along pedestrian corridors to lower localized NO2 exhaust spikes.',
            },
            {
              title: '3. Neighborhood Greening',
              desc: 'Supporting urban tree canopy expansion to filter suspended coarse particles (PM10) and mitigate urban heat island effects.',
            },
            {
              title: '4. Informed Local Policy',
              desc: 'Using transparent air data to advocate for clean air zones around schools, parks, and residential neighborhoods.',
            },
          ].map((pillar, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[rgba(15,23,42,0.75)] backdrop-blur-md border border-white/10 space-y-2 shadow-card hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-bold text-sm text-white">{pillar.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Call to Action */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[rgba(15,23,42,0.75)] backdrop-blur-md border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
        <div>
          <h3 className="text-lg font-bold text-white">Want to explore air quality for your city?</h3>
          <p className="text-xs text-slate-400 mt-0.5">Search any global city or ask UrbanAir AI for a contextual summary.</p>
        </div>

        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#090d16] text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)] active:scale-95"
        >
          <span>Open Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

