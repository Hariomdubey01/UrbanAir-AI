'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, RefreshCw, ArrowLeftRight, Plus, Trash2, MapPin } from 'lucide-react';
import { POPULAR_CITIES } from '@/lib/air-quality/open-meteo';
import { NormalizedAirQuality, AIResponseData } from '@/lib/types';
import AIResponseCard from '@/components/AIResponseCard';
import ExplainabilityModal from '@/components/ExplainabilityModal';

function CompareContent() {
  const searchParams = useSearchParams();
  const defaultCityA = searchParams?.get('cityA') || 'Delhi';
  const defaultCityB = searchParams?.get('cityB') || 'Tokyo';
  const defaultCityC = searchParams?.get('cityC') || '';

  const [cityASelect, setCityASelect] = useState<string>(defaultCityA);
  const [cityBSelect, setCityBSelect] = useState<string>(defaultCityB);
  const [cityCSelect, setCityCSelect] = useState<string>(defaultCityC);
  const [showCityC, setShowCityC] = useState<boolean>(!!defaultCityC);

  const [cityAData, setCityAData] = useState<NormalizedAirQuality | null>(null);
  const [cityBData, setCityBData] = useState<NormalizedAirQuality | null>(null);
  const [cityCData, setCityCData] = useState<NormalizedAirQuality | null>(null);

  const [aiCompare, setAiCompare] = useState<AIResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false);

  useEffect(() => {
    async function loadComparison() {
      setLoading(true);
      try {
        const objA = POPULAR_CITIES.find(c => c.name.toLowerCase() === cityASelect.toLowerCase()) || POPULAR_CITIES[0];
        const objB = POPULAR_CITIES.find(c => c.name.toLowerCase() === cityBSelect.toLowerCase()) || POPULAR_CITIES[1];
        const objC = showCityC && cityCSelect ? POPULAR_CITIES.find(c => c.name.toLowerCase() === cityCSelect.toLowerCase()) : null;

        const promises = [
          fetch(`/api/air-quality/current?lat=${objA.lat}&lng=${objA.lng}&name=${encodeURIComponent(objA.name)}&country=${encodeURIComponent(objA.country)}`),
          fetch(`/api/air-quality/current?lat=${objB.lat}&lng=${objB.lng}&name=${encodeURIComponent(objB.name)}&country=${encodeURIComponent(objB.country)}`),
        ];

        if (objC) {
          promises.push(
            fetch(`/api/air-quality/current?lat=${objC.lat}&lng=${objC.lng}&name=${encodeURIComponent(objC.name)}&country=${encodeURIComponent(objC.country)}`)
          );
        }

        const responses = await Promise.all(promises);
        const jsonA = await responses[0].json();
        const jsonB = await responses[1].json();

        if (jsonA.success) setCityAData(jsonA.data);
        if (jsonB.success) setCityBData(jsonB.data);

        if (objC && responses[2]) {
          const jsonC = await responses[2].json();
          if (jsonC.success) setCityCData(jsonC.data);
        } else {
          setCityCData(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadComparison();
  }, [cityASelect, cityBSelect, cityCSelect, showCityC]);

  const handleExplainComparison = async () => {
    if (!cityAData || !cityBData) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityA: cityAData,
          cityB: cityBData,
          cityC: showCityC && cityCData ? cityCData : undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAiCompare(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const citiesList = [
    { label: 'Location A', data: cityAData },
    { label: 'Location B', data: cityBData },
    ...(showCityC && cityCData ? [{ label: 'Location C', data: cityCData }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-entrance">
      
      {/* Header */}
      <div className="pb-4 border-b border-white/10 space-y-1">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-teal-400 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Environmental Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Side-by-Side City Comparison</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Compare real-time air quality metrics and pollutant profiles across 2–3 global cities with honest missing-metric handling.</p>
      </div>

      {/* Selectors */}
      <div className="p-5 rounded-2xl glass-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
          <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Configure Cities for Comparison</span>
          {!showCityC ? (
            <button
              onClick={() => {
                setShowCityC(true);
                if (!cityCSelect) setCityCSelect('London');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-500/30 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add 3rd City</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setShowCityC(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold border border-red-500/30 transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove 3rd City</span>
            </button>
          )}
        </div>

        <div className={`grid grid-cols-1 ${showCityC ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>City A:</span>
            </label>
            <select
              value={cityASelect}
              onChange={(e) => setCityASelect(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c.id} value={c.name}>{c.name}, {c.country}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>City B:</span>
            </label>
            <select
              value={cityBSelect}
              onChange={(e) => setCityBSelect(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c.id} value={c.name}>{c.name}, {c.country}</option>
              ))}
            </select>
          </div>

          {showCityC && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>City C (Optional 3rd):</span>
              </label>
              <select
                value={cityCSelect}
                onChange={(e) => setCityCSelect(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {POPULAR_CITIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}, {c.country}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {loading || !cityAData || !cityBData ? (
        <div className="p-12 text-center rounded-2xl glass-card space-y-2">
          <RefreshCw className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Fetching comparison telemetry...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Top Score Summary Cards */}
          <div className={`grid grid-cols-1 ${showCityC && cityCData ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
            {citiesList.map((item, idx) => {
              if (!item.data) return null;
              return (
                <div key={idx} className="p-6 rounded-2xl glass-card space-y-3 shadow-card transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">{item.label}</span>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{item.data.location.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.data.location.country}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold font-mono tabular-nums" style={{ color: item.data.color }}>{item.data.aqi}</div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.data.category}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>Primary: {item.data.primaryPollutant}</span>
                    <span role="status" aria-label={`Air Quality Index ${item.data.aqi}, category ${item.data.category}`}>
                      {item.data.aqi} · {item.data.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Comparative Trigger */}
          <div className="text-center">
            <button
              onClick={handleExplainComparison}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#10b981] hover:bg-[#34d399] text-[#090d16] font-bold text-xs shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.95] disabled:opacity-50"
            >
              {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Explain this comparison with UrbanAir AI</span>
            </button>
          </div>

          {aiCompare && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">AI Comparative Analysis</h2>
              <AIResponseCard
                data={aiCompare}
                onOpenExplainability={() => setExplainOpen(true)}
              />
            </div>
          )}

          {/* Pollutant Measurement Matrix (§21: Missing metric handling) */}
          <div className="rounded-2xl glass-card p-6 overflow-x-auto shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Pollutant Measurement Matrix</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Only metrics reported by stations are compared; missing indicators are labeled transparently.</p>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Tabular Numerals · US EPA Scale</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400">
                  <th className="py-2.5 px-3 font-bold">Pollutant Parameter</th>
                  <th className="py-2.5 px-3 font-bold">{cityAData.location.name}</th>
                  <th className="py-2.5 px-3 font-bold">{cityBData.location.name}</th>
                  {showCityC && cityCData && (
                    <th className="py-2.5 px-3 font-bold">{cityCData.location.name}</th>
                  )}
                  <th className="py-2.5 px-3 font-bold">Environmental Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-200">
                {[
                  { name: 'AQI (Air Quality Index)', valA: cityAData.aqi, valB: cityBData.aqi, valC: cityCData?.aqi, unit: '' },
                  { name: 'PM2.5 (Fine particulate matter)', valA: cityAData.pollutants.pm25?.value, valB: cityBData.pollutants.pm25?.value, valC: cityCData?.pollutants.pm25?.value, unit: 'µg/m³' },
                  { name: 'PM10 (Coarse particulate matter)', valA: cityAData.pollutants.pm10?.value, valB: cityBData.pollutants.pm10?.value, valC: cityCData?.pollutants.pm10?.value, unit: 'µg/m³' },
                  { name: 'NO₂ (Nitrogen dioxide)', valA: cityAData.pollutants.no2?.value, valB: cityBData.pollutants.no2?.value, valC: cityCData?.pollutants.no2?.value, unit: 'µg/m³' },
                  { name: 'O₃ (Ground-level ozone)', valA: cityAData.pollutants.o3?.value, valB: cityBData.pollutants.o3?.value, valC: cityCData?.pollutants.o3?.value, unit: 'µg/m³' },
                  { name: 'SO₂ (Sulfur dioxide)', valA: cityAData.pollutants.so2?.value, valB: cityBData.pollutants.so2?.value, valC: cityCData?.pollutants.so2?.value, unit: 'µg/m³' },
                  { name: 'CO (Carbon monoxide)', valA: cityAData.pollutants.co?.value, valB: cityBData.pollutants.co?.value, valC: cityCData?.pollutants.co?.value, unit: 'mg/m³' },
                ].map((row, i) => {
                  const hasA = row.valA !== undefined && row.valA !== null;
                  const hasB = row.valB !== undefined && row.valB !== null;
                  const hasC = showCityC && cityCData ? (row.valC !== undefined && row.valC !== null) : null;

                  return (
                    <tr key={i}>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{row.name}</td>
                      <td className="py-3 px-3 font-mono tabular-nums font-semibold">
                        {hasA ? `${row.valA} ${row.unit}` : <span className="text-slate-400 dark:text-slate-500 italic">— not reported</span>}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums font-semibold">
                        {hasB ? `${row.valB} ${row.unit}` : <span className="text-slate-400 dark:text-slate-500 italic">— not reported</span>}
                      </td>
                      {showCityC && cityCData && (
                        <td className="py-3 px-3 font-mono tabular-nums font-semibold">
                          {hasC ? `${row.valC} ${row.unit}` : <span className="text-slate-400 dark:text-slate-500 italic">— not reported</span>}
                        </td>
                      )}
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-xs">
                        {hasA && hasB ? (
                          row.valA! < row.valB! ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{cityAData.location.name} measures cleaner</span>
                          ) : row.valA! > row.valB! ? (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">{cityBData.location.name} measures cleaner</span>
                          ) : (
                            <span className="text-slate-700 dark:text-slate-300">Equal measured values</span>
                          )
                        ) : (
                          <span className="italic text-[11px] text-slate-400 dark:text-slate-500">— not reported for one or more cities</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {aiCompare && (
        <ExplainabilityModal
          isOpen={explainOpen}
          onClose={() => setExplainOpen(false)}
          explainability={aiCompare.explainability}
          limitations={aiCompare.limitations}
          dataUsed={aiCompare.dataUsed}
          sources={aiCompare.sources}
          aiTask={aiCompare.aiTask}
          isFallback={aiCompare.isFallback}
          dataSource={aiCompare.dataTrust?.source || aiCompare.explainability?.dataSource}
          aqiStandard={aiCompare.dataTrust?.aqiStandard || aiCompare.explainability?.aqiStandard}
          aiMode={aiCompare.explainability?.aiMode}
        />
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-muted text-xs">Loading comparison workspace...</div>}>
      <CompareContent />
    </Suspense>
  );
}


