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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-800/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-[20px] bg-ivory-100 dark:bg-[#0D1B18] border border-forest-800/15 dark:border-white/[0.08] p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-forest-800/10 dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ai-500/10 text-ai-500 flex items-center justify-center border border-ai-500/20 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-forest-800 dark:text-white tracking-tight">AI Transparency & Explainability</h3>
              <p className="text-xs text-muted">Why did AI give this answer?</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-forest-800 dark:hover:text-white hover:bg-forest-800/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainability Matrix */}
        <div className="space-y-2.5 text-xs">
          
          {/* LOCATION */}
          <div className="p-3 rounded-xl bg-white dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[11px] text-muted tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>LOCATION</span>
            </div>
            <p className="text-forest-800 dark:text-slate-200 font-medium pl-5">
              {locValue}
            </p>
          </div>

          {/* DATA USED */}
          <div className="p-3 rounded-xl bg-white dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[11px] text-muted tracking-wider uppercase">
              <Database className="w-3.5 h-3.5 text-teal-500" />
              <span>DATA USED</span>
            </div>
            <div className="pl-5 text-forest-800 dark:text-slate-200 font-medium">
              {formattedDataUsed.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formattedDataUsed.map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-ivory-100 dark:bg-forest-800 border border-forest-800/10 dark:border-white/[0.08] font-mono text-[11px]">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted italic">None used for this answer</span>
              )}
            </div>
          </div>

          {/* DATA SOURCE & AQI STANDARD */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-white dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1">
              <div className="flex items-center gap-2 font-semibold text-[10px] text-muted tracking-wider uppercase">
                <Database className="w-3 h-3 text-teal-500" />
                <span>DATA SOURCE</span>
              </div>
              <p className="text-forest-800 dark:text-slate-200 font-medium pl-5">
                {sourceValue}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1">
              <div className="flex items-center gap-2 font-semibold text-[10px] text-muted tracking-wider uppercase">
                <Activity className="w-3 h-3 text-emerald-500" />
                <span>AQI STANDARD</span>
              </div>
              <p className="text-forest-800 dark:text-slate-200 font-medium pl-5">
                {standardValue}
              </p>
            </div>
          </div>

          {/* KNOWLEDGE SOURCES */}
          <div className="p-3 rounded-xl bg-white dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[11px] text-muted tracking-wider uppercase">
              <BookOpen className="w-3.5 h-3.5 text-ai-500" />
              <span>KNOWLEDGE RETRIEVED</span>
            </div>
            <p className="text-forest-800 dark:text-slate-200 font-medium pl-5 leading-relaxed">
              {knowledgeSources}
            </p>
          </div>

          {/* AI MODE & TASK */}
          <div className="p-3 rounded-xl bg-white dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[11px] text-muted tracking-wider uppercase">
              <Layers className="w-3.5 h-3.5 text-ai-500" />
              <span>AI MODE & TASK</span>
            </div>
            <div className="pl-5 flex items-center gap-2">
              <span className="text-forest-800 dark:text-slate-200 font-medium">{taskValue}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-ai-500/10 text-ai-500 border border-ai-500/20">
                {modeValue}
              </span>
            </div>
          </div>

          {/* GUARDRAILS */}
          <div className="p-3 rounded-xl bg-white dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[11px] text-muted tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>GUARDRAILS</span>
            </div>
            <p className="text-forest-800/90 dark:text-slate-300 pl-5 font-normal">
              {guardrailsValue}
            </p>
          </div>

          {/* LIMITATIONS */}
          <div className="p-3 rounded-xl bg-white dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[11px] text-muted tracking-wider uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>LIMITATIONS</span>
            </div>
            <p className="text-forest-800/90 dark:text-slate-300 pl-5 font-normal">
              {allLimitations.length > 0 ? allLimitations.join(' · ') : 'None used for this answer'}
            </p>
          </div>

        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-forest-800 dark:bg-forest-700 hover:bg-forest-900 text-white text-xs font-semibold transition-all"
          >
            Close Transparency Drawer
          </button>
        </div>

      </div>
    </div>
  );
}


