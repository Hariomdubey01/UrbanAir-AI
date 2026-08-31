'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, HelpCircle, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AIResponseData } from '@/lib/types';
import AIResponseCard from '@/components/AIResponseCard';
import ExplainabilityModal from '@/components/ExplainabilityModal';

interface LearnTopic {
  id: string;
  title: string;
  category: string;
  simpleExplanation: string;
  whatItIs: string;
  whyItMatters: string;
  howMeasured: string;
  whoLimit: string;
  prompt: string;
}

const LEARN_TOPICS: LearnTopic[] = [
  {
    id: 'aqi',
    title: 'AQI (Air Quality Index)',
    category: 'Standard Scale',
    simpleExplanation: 'Think of it as a single grade for how clean or polluted the ambient air is right now.',
    whatItIs: 'A composite index calculated from measured concentrations of ground-level ozone, particulate matter (PM2.5, PM10), carbon monoxide, sulfur dioxide, and nitrogen dioxide.',
    whyItMatters: 'Translates varied complex chemical values into actionable health brackets (0–500 scale: Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous).',
    howMeasured: 'Calculated using standardized breakpoint piecewise formulas established by national environmental agencies like the US EPA.',

    whoLimit: 'Composite scale — reflects dominant constituent pollutant',
    prompt: 'Explain how the Air Quality Index (AQI) is calculated from raw pollutant breakpoints and why it is used globally.',
  },
  {
    id: 'pm25',
    title: 'PM2.5 (Fine Particulate Matter)',
    category: 'Particulate Matter',
    simpleExplanation: 'Microscopic airborne particles so small they pass straight through your lungs into your bloodstream.',
    whatItIs: 'Particulate matter 2.5 micrometers or smaller in aerodynamic diameter (roughly 30x smaller than a strand of human hair).',
    whyItMatters: 'Deep lung and vascular penetration causes chronic cardiovascular and pulmonary illnesses; most hazardous urban pollutant.',
    howMeasured: 'Laser optical particle counters and gravimetric beta-attenuation monitors measuring mass concentration in µg/m³.',
    whoLimit: '15 µg/m³ (24-hr guideline) · 5 µg/m³ (annual)',
    prompt: 'Explain PM2.5 particulate matter, its primary combustion sources, health impacts, and WHO 2021 guideline limits.',
  },
  {
    id: 'pm10',
    title: 'PM10 (Coarse Inhalable Particles)',
    category: 'Particulate Matter',
    simpleExplanation: 'The bigger, dustier cousin of PM2.5, including road dust, pollen, and construction debris.',
    whatItIs: 'Inhalable coarse particles between 2.5 and 10 micrometers in aerodynamic diameter.',
    whyItMatters: 'Deposits in upper respiratory airways, irritating nasal passages, eyes, and lungs; triggers asthma and allergies.',
    howMeasured: 'High-volume air samplers with size-selective acoustic or aerodynamic inlet separators (µg/m³).',
    whoLimit: '45 µg/m³ (24-hr guideline) · 15 µg/m³ (annual)',
    prompt: 'What is PM10 coarse particulate matter, how is it sampled, and how does it differ from fine PM2.5?',
  },
  {
    id: 'no2',
    title: 'NO₂ (Nitrogen Dioxide)',
    category: 'Gaseous Pollutants',
    simpleExplanation: 'A traffic-and-industry gas that irritates airways and forms urban photochemical smog.',
    whatItIs: 'A pungent reddish-brown gas produced during high-temperature combustion in vehicles and thermal power stations.',
    whyItMatters: 'Inflames respiratory airways, reduces lung function, and acts as a primary chemical precursor to ground-level ozone and acid rain.',
    howMeasured: 'Chemiluminescence gas analyzers and satellite tropospheric column spectrometers (µg/m³ or ppb).',
    whoLimit: '25 µg/m³ (24-hr guideline) · 10 µg/m³ (annual)',
    prompt: 'Explain Nitrogen Dioxide (NO2), how vehicle combustion generates it, and its role in urban smog.',
  },
  {
    id: 'o3',
    title: 'O₃ (Ground-Level Ozone)',
    category: 'Photochemical Smog',
    simpleExplanation: 'Not the high-altitude protective ozone layer — this is ground-level smog created on hot, sunny days.',
    whatItIs: 'A secondary atmospheric pollutant formed when NOx and volatile organic compounds (VOCs) react under solar radiation.',
    whyItMatters: 'A powerful oxidant that irritates lung tissue, triggers coughing and asthma attacks, and damages agricultural crops.',
    howMeasured: 'Ultraviolet (UV) photometric absorption analyzers measuring ambient ground concentrations (µg/m³ or ppb).',
    whoLimit: '100 µg/m³ (8-hr maximum average)',
    prompt: 'Explain ground-level ozone (O3), why it peaks in warm summer afternoons, and its difference from stratospheric ozone.',
  },
  {
    id: 'so2',
    title: 'SO₂ (Sulfur Dioxide)',
    category: 'Industrial Emissions',
    simpleExplanation: 'A heavy, sharp gas released when burning sulfur-rich fossil fuels like coal and crude oil.',
    whatItIs: 'A toxic inorganic gas produced by industrial smelters, power stations burning high-sulfur coal, and volcanic activity.',
    whyItMatters: 'Causes severe bronchoconstriction, aggravates cardiovascular diseases, and transforms into acid rain.',
    howMeasured: 'Pulsed fluorescence spectroscopy and UV absorption sensors (µg/m³ or ppb).',
    whoLimit: '40 µg/m³ (24-hr guideline)',
    prompt: 'What is Sulfur Dioxide (SO2), where does it come from in industrial cities, and what are WHO guidelines?',
  },
  {
    id: 'co',
    title: 'CO (Carbon Monoxide)',
    category: 'Combustion Gas',
    simpleExplanation: 'A colorless, odorless gas produced by incomplete combustion that reduces oxygen delivery in the blood.',
    whatItIs: 'A toxic gas produced when carbon-based fuels (petrol, natural gas, wood) burn in oxygen-depleted conditions.',
    whyItMatters: 'Binds tightly with hemoglobin (forming carboxyhemoglobin), reducing oxygen delivery to vital organs and tissues.',
    howMeasured: 'Non-dispersive infrared (NDIR) spectrometry and electrochemical sensor cells (mg/m³ or ppm).',
    whoLimit: '4 mg/m³ (24-hr guideline) · 10 mg/m³ (8-hr average)',
    prompt: 'Explain Carbon Monoxide (CO), how incomplete combustion creates it, and its physiological effects on oxygen transport.',
  },
];

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState<LearnTopic | null>(null);
  const [aiData, setAiData] = useState<AIResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false);

  const handleAskAIAboutTopic = async (topic: LearnTopic) => {
    setSelectedTopic(topic);
    setLoading(true);
    setAiData(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: topic.prompt,
          topic: topic.category,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAiData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-forest-800/10 dark:border-white/[0.08] space-y-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Environmental Education Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white tracking-tight">Air Quality 101</h1>
        <p className="text-muted text-xs">Structured 4-part reference modules covering all 7 primary air pollutants and measurement scales according to WHO 2021 Guidelines.</p>
      </div>

      {/* Topics Grid (§22: 7 modules) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEARN_TOPICS.map((topic) => (
          <div
            key={topic.id}
            className="rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] p-5 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  {topic.category}
                </span>
                <span className="text-[10px] text-muted font-mono">{topic.whoLimit}</span>
              </div>

              <h3 className="text-base font-semibold text-forest-800 dark:text-white">{topic.title}</h3>
              
              {/* 4-Part Structure */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-ivory-100 dark:bg-forest-900 border border-forest-800/5 dark:border-white/[0.05]">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block text-[10px] uppercase">Simple Explanation</span>
                  <p className="text-forest-800/90 dark:text-slate-200 italic mt-0.5">"{topic.simpleExplanation}"</p>
                </div>

                <div className="space-y-1 text-[11px] text-muted">
                  <div><strong className="text-forest-800 dark:text-slate-200">What it is:</strong> {topic.whatItIs}</div>
                  <div><strong className="text-forest-800 dark:text-slate-200">Why it matters:</strong> {topic.whyItMatters}</div>
                  <div><strong className="text-forest-800 dark:text-slate-200">How it's measured:</strong> {topic.howMeasured}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleAskAIAboutTopic(topic)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-ivory-100 dark:bg-forest-900 hover:bg-ai-500/10 text-forest-800 dark:text-slate-200 hover:text-ai-500 border border-forest-800/10 dark:border-white/[0.08] text-xs font-semibold transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-ai-500" />
              <span>Ask AI about this topic</span>
            </button>
          </div>
        ))}
      </div>

      {/* Dynamic AI Explanation Section */}
      {selectedTopic && (
        <div className="pt-6 border-t border-forest-800/10 dark:border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2 text-ai-500 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Deep-Dive Explanation: {selectedTopic.title}</span>
          </div>

          {loading ? (
            <div className="p-8 text-center rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] text-muted text-xs">
              Generating grounded educational insight with verified RAG knowledge citation...
            </div>
          ) : aiData ? (
            <AIResponseCard
              data={aiData}
              onOpenExplainability={() => setExplainOpen(true)}
            />
          ) : null}
        </div>
      )}

      {aiData && (
        <ExplainabilityModal
          isOpen={explainOpen}
          onClose={() => setExplainOpen(false)}
          explainability={aiData.explainability}
          limitations={aiData.limitations}
          dataUsed={aiData.dataUsed}
          sources={aiData.sources}
          aiTask={aiData.aiTask}
          isFallback={aiData.isFallback}
          dataSource={aiData.dataTrust?.source || aiData.explainability?.dataSource}
          aqiStandard={aiData.dataTrust?.aqiStandard || aiData.explainability?.aqiStandard}
          aiMode={aiData.explainability?.aiMode}
        />
      )}

    </div>
  );
}

