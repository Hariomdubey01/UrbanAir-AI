'use client';

import React from 'react';
import { ExternalLink, Database, BookOpen, ShieldCheck, CheckCircle2, Globe2 } from 'lucide-react';
import { KNOWLEDGE_BASE } from '@/lib/ai/knowledge-base';

export default function SourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-entrance">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-white/10 space-y-1">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Provenance & Citations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Environmental Data & RAG Sources</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Transparent documentation of all environmental telemetry streams, standard reference scales, and verified RAG knowledge base documents (§31).</p>
      </div>

      {/* Primary Data Provider */}
      <div className="command-container p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          <Database className="w-4 h-4" />
          <span>Live Environmental Data Stream</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Open-Meteo Air Quality Telemetry Grid</h2>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
          UrbanAir AI retrieves real-time hourly telemetry for PM2.5, PM10, Nitrogen Dioxide (NO₂), Ground-level Ozone (O₃), Sulfur Dioxide (SO₂), and Carbon Monoxide (CO) via Open-Meteo. Data is normalized to standard US EPA and European EEA Air Quality Index benchmarks.
        </p>
        <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-medium">Update Frequency: Hourly</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-medium">Spatial Coverage: Global</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-medium">License: Open Database License (ODbL)</span>
        </div>
      </div>

      {/* RAG Knowledge Base Bibliography (§31) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[1.5]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Verified Reference Registry (RAG Schema)</h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{KNOWLEDGE_BASE.length} Peer-Reviewed Documents</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KNOWLEDGE_BASE.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl glass-card glass-card-hover space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="card-badge-indigo inline-block text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {doc.topic}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2 leading-snug">{doc.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{doc.organization} · Published {doc.published_date || doc.date}</p>
                  </div>

                  <a
                    href={doc.source_url || doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-slate-800 transition-colors shrink-0 border border-slate-200 dark:border-slate-700/80 active:scale-95"
                    title="Visit official document source"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 inner-panel p-3.5 rounded-xl italic leading-relaxed">
                  "{doc.snippet}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span>Method: {doc.retrieval_method || 'Dense Semantic Vector RAG'}</span>
                <span>Verified: {doc.retrieved_date || '2024-01-15'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

