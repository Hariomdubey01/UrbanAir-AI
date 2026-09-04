'use client';

import React from 'react';
import Link from 'next/link';
import { Database, MapPin, BookOpen, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'ENVIRONMENTAL DATA',
      subtitle: 'Real-time Telemetry',
      desc: 'Connects to Open-Meteo global weather & air telemetry streams for PM2.5, PM10, NO₂, O₃, SO₂, and CO.',
      icon: Database,
      color: 'text-teal-500',
    },
    {
      num: '02',
      title: 'CONTEXT ENGINE',
      subtitle: 'Location & Telemetry Mapping',
      desc: 'Normalizes raw sensor measurements into standard US EPA AQI benchmarks and WHO safety thresholds.',
      icon: MapPin,
      color: 'text-emerald-500',
    },
    {
      num: '03',
      title: 'TRUSTED KNOWLEDGE',
      subtitle: 'RAG Retrieval',
      desc: 'Retrieves relevant reference documents from WHO Guidelines 2021, EPA standards, UN SDG 11, EEA, and C40 Cities.',
      icon: BookOpen,
      color: 'text-amber-500',
    },
    {
      num: '04',
      title: 'AI REASONING',
      subtitle: 'Gemini + Context Engine',
      desc: 'Combines user inquiry, live city telemetry, and verified RAG citations without fabricating synthetic numbers.',
      icon: Sparkles,
      color: 'text-ai-500',
    },
    {
      num: '05',
      title: 'HUMAN INSIGHT',
      subtitle: 'Transparent Output',
      desc: 'Delivers clear summaries, telemetry badges, citation sources, and interactive explainability drawers.',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-entrance">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-white/10 space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Technical & Product Workflow</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">How UrbanAir AI Works</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">A transparent 5-stage pipeline transforming physical telemetry into clear human understanding under SDG 11.</p>
      </div>

      {/* Hero Pipeline Flow */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Data to Understanding Pipeline</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">From Raw Numbers to Human Insight</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="process-card flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-500 dark:text-slate-400">{s.num}</span>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">{s.title}</h3>
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">{s.subtitle}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:flex justify-end pt-1 text-slate-400 text-xs font-bold">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety & Medical Guardrail Note */}
      <div className="command-container p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Core Product Principle</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Measured Data vs. AI Interpretation</h3>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
          UrbanAir AI maintains an explicit distinction between physical telemetry (PM2.5, PM10, AQI readings reported by sensor stations with tabular numerals) and AI contextual explanations with indigo left borders. The AI never fabricates missing sensor values, never provides medical prescriptions, and clearly cites its knowledge sources.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#090d16] font-bold text-xs shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)] transition-all active:scale-95"
          >
            Explore Live Dashboard →
          </Link>
          <Link
            href="/responsible-ai"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 font-bold text-xs transition-all active:scale-95"
          >
            Read Responsible AI Framework
          </Link>
        </div>
      </div>

    </div>
  );
}
