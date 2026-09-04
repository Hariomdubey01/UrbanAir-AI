'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Sparkles, RefreshCw, BarChart2 } from 'lucide-react';
import AQIGauge from '@/components/AQIGauge';
import PollutantCard from '@/components/PollutantCard';
import HistoricalChart from '@/components/HistoricalChart';
import AIResponseCard from '@/components/AIResponseCard';
import ExplainabilityModal from '@/components/ExplainabilityModal';
import SearchModal from '@/components/SearchModal';
import { CityLocation, HistoricalTrendData, NormalizedAirQuality, AIResponseData } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<CityLocation>({
    id: 'delhi-in',
    name: 'Delhi',
    country: 'India',
    countryCode: 'IN',
    lat: 28.6139,
    lng: 77.2090,
  });

  const [airQuality, setAirQuality] = useState<NormalizedAirQuality | null>(null);
  const [history, setHistory] = useState<HistoricalTrendData | null>(null);
  const [activeTf, setActiveTf] = useState<'24h' | '7d' | '30d'>('24h');
  const [aiSummary, setAiSummary] = useState<AIResponseData | null>(null);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [explainModalOpen, setExplainModalOpen] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const aqRes = await fetch(
          `/api/air-quality/current?lat=${selectedCity.lat}&lng=${selectedCity.lng}&name=${encodeURIComponent(selectedCity.name)}&country=${encodeURIComponent(selectedCity.country)}`
        );
        const aqJson = await aqRes.json();
        if (aqJson.success) {
          setAirQuality(aqJson.data);

          setAiLoading(true);
          const aiRes = await fetch('/api/ai/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ airQuality: aqJson.data }),
          });
          const aiJson = await aiRes.json();
          if (aiJson.success) {
            setAiSummary(aiJson);
          }
          setAiLoading(false);
        }

        const histRes = await fetch(
          `/api/air-quality/history?lat=${selectedCity.lat}&lng=${selectedCity.lng}&name=${encodeURIComponent(selectedCity.name)}&country=${encodeURIComponent(selectedCity.country)}&timeframe=${activeTf}`
        );
        const histJson = await histRes.json();
        if (histJson.success) {
          setHistory(histJson.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [selectedCity, activeTf]);

  const handleAskAIPollutant = (pollutantCode: string) => {
    router.push(`/ai?city=${encodeURIComponent(selectedCity.name)}&q=${encodeURIComponent(`Explain ${pollutantCode} for ${selectedCity.name} simply.`)}`);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-entrance">
      
      {/* Editorial Header (§16) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Environmental Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            How is the air in your city today?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Real-time telemetry and grounded AI explanation for {selectedCity.name}</p>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm active:scale-95"
        >
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Location: <strong>{selectedCity.name}, {selectedCity.country}</strong></span>
          <Search className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </button>
      </div>

      {loading || !airQuality ? (
        <div className="p-12 text-center rounded-2xl glass-card space-y-2">
          <RefreshCw className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Fetching environmental metrics for {selectedCity.name}...</p>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Large Hero AQI Area */}
          <AQIGauge
            aqi={airQuality.aqi}
            category={airQuality.category}
            color={airQuality.color}
            locationName={`${airQuality.location.name}, ${airQuality.location.country}`}
            source={airQuality.source}
            minutesAgo={airQuality.minutesAgo ?? 8}
          />

          {/* "What's in the air?" Pollutant Telemetry Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">What's in the air?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(airQuality.pollutants).map((pollutant) => (
                pollutant && (
                  <PollutantCard
                    key={pollutant.code}
                    pollutant={pollutant}
                    onAskAI={handleAskAIPollutant}
                  />
                )
              ))}
            </div>
          </div>

          {/* "UrbanAir AI Insight" Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">UrbanAir AI Insight</h2>
              </div>
              {aiLoading && (
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Formulating explanation...
                </span>
              )}
            </div>

            {aiSummary && (
              <AIResponseCard
                data={aiSummary}
                onOpenExplainability={() => setExplainModalOpen(true)}
              />
            )}
          </div>

          {/* "Air quality over time" Trend Section */}
          {history && (
            <HistoricalChart
              data={history}
              activeTimeframe={activeTf}
              onTimeframeChange={(tf) => setActiveTf(tf)}
            />
          )}

        </div>
      )}

      {/* Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCity={(c) => setSelectedCity(c)}
      />

      {aiSummary && (
        <ExplainabilityModal
          isOpen={explainModalOpen}
          onClose={() => setExplainModalOpen(false)}
          explainability={aiSummary.explainability}
          limitations={aiSummary.limitations}
          dataUsed={aiSummary.dataUsed}
          sources={aiSummary.sources}
          aiTask={aiSummary.aiTask}
          isFallback={aiSummary.isFallback}
          dataSource={aiSummary.dataTrust?.source || aiSummary.explainability?.dataSource}
          aqiStandard={aiSummary.dataTrust?.aqiStandard || aiSummary.explainability?.aqiStandard}
          aiMode={aiSummary.explainability?.aiMode}
        />
      )}

    </div>
  );
}

