'use client';

import React from 'react';
import { AIResponseData, KnowledgeDocument } from '@/lib/types';
import { X, HelpCircle, MapPin, Database, BookOpen, ShieldCheck, AlertTriangle, Layers, Activity } from 'lucide-react';

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  explainability: AIResponseData['explainability'];
  limitations?: string[];
  dataUsed?: string[];
  sources?: KnowledgeDocument[];
  aiTask?: string;
  isFallback?: boolean;
  dataSource?: string;
  aqiStandard?: string;
  aiMode?: string;
}

export default function ExplainabilityModal({
  isOpen,
  onClose,
  explainability,
  limitations = [],
  dataUsed = [],
  sources = [],
  aiTask,
  isFallback = false,
  dataSource,
  aqiStandard,
  aiMode,
}: ExplainabilityModalProps) {
  if (!isOpen) return null;

  const locValue = explainability?.locationUsed || 'None used for this answer';
  const taskValue = aiTask || explainability?.aiTask || 'Environmental explanation';
  const sourceValue = dataSource || explainability?.dataSource || 'Open-Meteo';
  const standardValue = aqiStandard || explainability?.aqiStandard || 'US EPA AQI';
  const modeValue = aiMode || explainability?.aiMode || (isFallback ? 'Knowledge-based fallback' : 'Gemini + RAG');
  const guardrailsValue = explainability?.guardrailCheck || '✓ Location validated · ✓ Data availability checked · ✓ Medical safety · ✓ Environmental scope';

  // Format data used
  let formattedDataUsed: string[] = [];
  if (dataUsed && dataUsed.length > 0) {
    formattedDataUsed = dataUsed;
  } else if (explainability?.dataUsed && explainability.dataUsed.length > 0) {
    formattedDataUsed = explainability.dataUsed;
  } else if (explainability?.metricsEvaluated && Object.keys(explainability.metricsEvaluated).length > 0) {
    formattedDataUsed = Object.entries(explainability.metricsEvaluated).map(
      ([k, v]) => `${k.toUpperCase()}: ${typeof v === 'object' ? JSON.stringify(v) : v}`
    );
  }

  // Format sources used
  const knowledgeSources = sources && sources.length > 0
    ? sources.map(s => `${s.organization} (${s.title})`).join(' · ')
    : explainability?.retrievedKnowledgeIds && explainability.retrievedKnowledgeIds.length > 0
      ? explainability.retrievedKnowledgeIds.join(' · ')
      : 'None used for this answer';

  // Format limitations
  const allLimitations = limitations && limitations.length > 0
    ? limitations
    : explainability?.limitations && explainability.limitations.length > 0
      ? explainability.limitations
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#0c1322]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">AI Transparency & Explainability</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Why did AI give this answer?</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainability Matrix */}
        <div className="space-y-2.5 text-xs">
          
          {/* LOCATION */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center gap-2 font-bold text-[11px] text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>LOCATION</span>
            </div>
            <p className="text-slate-900 dark:text-white font-medium pl-5">
              {locValue}
            </p>
          </div>

          {/* DATA USED */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center gap-2 font-bold text-[11px] text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              <Database className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>DATA USED</span>
            </div>
            <div className="pl-5 text-slate-900 dark:text-white font-medium">
              {formattedDataUsed.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formattedDataUsed.map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 font-mono text-[11px] text-slate-700 dark:text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 dark:text-slate-500 italic">None used for this answer</span>
              )}
            </div>
          </div>

          {/* DATA SOURCE & AQI STANDARD */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[10px] text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                <Database className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>DATA SOURCE</span>
              </div>
              <p className="text-slate-900 dark:text-white font-medium pl-5">
                {sourceValue}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[10px] text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>AQI STANDARD</span>
              </div>
              <p className="text-slate-900 dark:text-white font-medium pl-5">
                {standardValue}
              </p>
            </div>
          </div>

          {/* KNOWLEDGE SOURCES */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center gap-2 font-bold text-[11px] text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>KNOWLEDGE RETRIEVED</span>
            </div>
            <p className="text-slate-900 dark:text-white font-medium pl-5 leading-relaxed">
              {knowledgeSources}
            </p>
          </div>

          {/* AI MODE & TASK */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center gap-2 font-bold text-[11px] text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>AI MODE & TASK</span>
            </div>
            <div className="pl-5 flex items-center gap-2">
              <span className="text-slate-900 dark:text-white font-medium">{taskValue}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-500/30">
                {modeValue}
              </span>
            </div>
          </div>

          {/* GUARDRAILS */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center gap-2 font-bold text-[11px] text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>GUARDRAILS</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 pl-5 font-normal">
              {guardrailsValue}
            </p>
          </div>

          {/* LIMITATIONS */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center gap-2 font-bold text-[11px] text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>LIMITATIONS</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 pl-5 font-normal">
              {allLimitations.length > 0 ? allLimitations.join(' · ') : 'None used for this answer'}
            </p>
          </div>

        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold border border-slate-300 dark:border-slate-700/80 transition-all hover:border-slate-400 dark:hover:border-white/20 active:scale-95"
          >
            Close Transparency Drawer
          </button>
        </div>

      </div>
    </div>
  );
}


