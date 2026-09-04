'use client';

import React, { useState } from 'react';
import { AIResponseData } from '@/lib/types';
import { Sparkles, Database, BookOpen, HelpCircle, ChevronDown, ChevronUp, AlertCircle, ExternalLink, MapPin, Globe2 } from 'lucide-react';
import FeedbackWidget from './FeedbackWidget';
import DataTrustMeta from './DataTrustMeta';

interface AIResponseCardProps {
  data: AIResponseData;
  onOpenExplainability: () => void;
}

export default function AIResponseCard({ data, onOpenExplainability }: AIResponseCardProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const isFallback = data.isFallback ?? (data.mode === 'knowledge-fallback');
  const isGemini = data.mode === 'gemini-rag' && !isFallback;

  // Markdown formatting helper
  const renderFormattedContent = (content?: string) => {
    if (!content || typeof content !== 'string') {
      return (
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
          No additional response text available.
        </p>
      );
    }
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
        return (
          <h4 key={idx} className="font-semibold text-sm text-slate-900 dark:text-white pt-2 pb-1 border-b border-slate-200 dark:border-white/[0.08]">
            {trimmed.replace(/\*\*/g, '')}
          </h4>
        );
      }

      if (trimmed.startsWith('- **') || trimmed.startsWith('* **')) {
        const parts = trimmed.substring(2).split('**');
        return (
          <div key={idx} className="flex items-start gap-2 text-xs py-0.5 pl-2">
            <span className="text-emerald-500 font-bold">•</span>
            <div>
              <strong className="text-slate-900 dark:text-white font-semibold">{parts[1] || ''}: </strong>
              <span className="text-slate-700 dark:text-slate-200">{parts.slice(2).join('')}</span>
            </div>
          </div>
        );
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start gap-2 text-xs py-0.5 pl-2">
            <span className="text-emerald-500 font-bold">•</span>
            <span className="text-slate-700 dark:text-slate-200">{trimmed.substring(2)}</span>
          </div>
        );
      }

      // Inline **bold** replacement
      const segments = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
          {segments.map((seg, i) => {
            if (seg.startsWith('**') && seg.endsWith('**')) {
              return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{seg.slice(2, -2)}</strong>;
            }
            return seg;
          })}
        </p>
      );
    });
  };

  const measuredSnapshot = data.measuredData;

  return (
    <div className={`rounded-2xl glass-card p-6 sm:p-7 space-y-5 transition-all border-l-4 ${
      isFallback ? 'border-l-teal-500' : 'border-l-indigo-500'
    }`}>
      
      {/* 1. Mode Banner (Fix #1) */}
      {isFallback ? (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20 text-xs font-medium">
          <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>Knowledge-based response — generated from our verified reference library, not a live AI model.</span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border border-indigo-500/20 text-xs font-medium">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>AI-grounded response — generated using current environmental data and verified reference knowledge.</span>
        </div>
      )}

      {/* 2. Top Header with Accurate Label (Fix #1) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
            isFallback 
              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30' 
              : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
          }`}>
            {isFallback ? <BookOpen className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                isFallback 
                  ? 'bg-teal-500/15 text-teal-800 dark:text-teal-300' 
                  : 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300'
              }`}>
                {isFallback ? 'KNOWLEDGE-BASED INSIGHT' : 'AI-GROUNDED INSIGHT'}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">UrbanAir AI Insight</h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Location Context: <strong className="text-slate-800 dark:text-slate-200">{data.explainability?.locationUsed || measuredSnapshot?.locationName || 'Global Environmental Context'}</strong></span>
            </p>
          </div>
        </div>

        {/* Explainability Trigger Button */}
        <button
          onClick={onOpenExplainability}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700/80 transition-all hover:border-slate-300 dark:hover:border-white/20 active:scale-95"
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Why did AI give this answer?</span>
        </button>
      </div>

      {/* 3. Overview Summary */}
      {data.summary && (
        <div className="p-3.5 rounded-xl inner-panel text-slate-700 dark:text-slate-200 text-xs font-medium leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 dark:text-white font-bold block mb-0.5">Overview Summary:</strong>
            {data.summary}
          </div>
        </div>
      )}

      {/* 4. Data Status & Trust Meta (Fix #6) */}
      <DataTrustMeta
        timestamp={data.dataTrust?.timestamp}
        source={data.dataTrust?.source || data.explainability?.dataSource || 'Open-Meteo'}
        aqiStandard={data.dataTrust?.aqiStandard || data.aqiStandard || 'US EPA AQI'}
        isDemo={data.dataTrust?.isDemo}
        isCached={data.dataTrust?.isCached}
        minutesAgo={data.dataTrust?.minutesAgo}
        freshness={data.dataTrust?.freshness}
      />

      {/* 5. Measured Data Evaluated — Green/Teal Structured Section (Fix #5) */}
      {measuredSnapshot && (
        <div className="rounded-xl inner-panel p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300">
              <Database className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="uppercase tracking-wider text-[11px] font-bold">MEASURED DATA</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Verified environmental telemetry</span>
          </div>

          {/* Key Parameters Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl telemetry-panel">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold uppercase">Location</span>
              <strong className="text-slate-900 dark:text-white truncate block">{measuredSnapshot.locationName}</strong>
            </div>

            <div className="p-2.5 rounded-xl telemetry-panel">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold uppercase">AQI Index</span>
              <strong className="text-slate-900 dark:text-white tabular-nums font-mono">
                {measuredSnapshot.aqi !== null ? `${measuredSnapshot.aqi} · ${measuredSnapshot.category}` : '— Not reported'}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl telemetry-panel">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold uppercase">AQI Standard</span>
              <strong className="text-slate-700 dark:text-slate-200">{measuredSnapshot.aqiStandard}</strong>
            </div>

            <div className="p-2.5 rounded-xl telemetry-panel">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold uppercase">Dominant Pollutant</span>
              <strong className="text-teal-700 dark:text-teal-300 font-mono">
                {measuredSnapshot.dominantPollutantDetermined ? measuredSnapshot.dominantPollutant : 'Not determined'}
              </strong>
            </div>
          </div>

          {/* Canonical Pollutants Grid (Fix #3, Fix #5) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
            {measuredSnapshot.pollutants.map((p) => (
              <div key={p.code} className="p-2 rounded-xl telemetry-panel text-center">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{p.shortLabel}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                  {p.value !== null ? (
                    <>
                      <span>{p.value}</span> <span className="text-[9px] font-normal text-slate-500 dark:text-slate-400">{p.unit}</span>
                    </>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] italic font-normal">— Not reported</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Environmental Interpretation (Main Body Answer) */}
      <div className="space-y-2.5 font-normal pt-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          <span>ENVIRONMENTAL INTERPRETATION</span>
        </h4>
        <div className="space-y-2">
          {renderFormattedContent(data.answer)}
        </div>
      </div>

      {/* 7. Context & SDG 11 Link (Fix #4: Accurate informational text) */}
      {data.sdgContext && (
        <div className="p-3.5 rounded-xl inner-panel text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
          <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-normal">
            <strong className="text-slate-900 dark:text-white font-bold">SDG 11 Alignment: </strong>
            {data.sdgContext}
          </p>
        </div>
      )}

      {/* 8. RAG Knowledge Sources Accordion */}
      {data.sources && data.sources.length > 0 && (
        <div className="inner-panel rounded-xl overflow-hidden">
          <button
            onClick={() => setSourcesOpen(!sourcesOpen)}
            className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Retrieved Knowledge & Reference Sources ({data.sources.length})</span>
            </div>
            {sourcesOpen ? <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
          </button>

          {sourcesOpen && (
            <div className="p-3.5 pt-0 space-y-2.5 border-t border-slate-200 dark:border-slate-700/80 text-xs">
              {data.sources.map((src) => (
                <div key={src.id} className="p-3 rounded-xl telemetry-panel space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{src.title}</span>
                    <a
                      href={src.source_url || src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 inline-flex items-center gap-1 text-[10px] font-semibold shrink-0"
                    >
                      <span>Official Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{src.organization} • Topic: {src.topic}</p>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] italic bg-slate-100 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-white/5 mt-1">
                    "{src.snippet}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 9. Disclaimer Notice */}
      {data.disclaimer && (
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{data.disclaimer}</span>
        </div>
      )}

      {/* 10. Feedback Widget */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-end">
        <FeedbackWidget />
      </div>

    </div>
  );
}


