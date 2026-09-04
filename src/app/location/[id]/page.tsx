'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Sparkles, RefreshCw, ArrowLeftRight, BarChart2 } from 'lucide-react';
import AQIGauge from '@/components/AQIGauge';
import PollutantCard from '@/components/PollutantCard';
import HistoricalChart from '@/components/HistoricalChart';
import AIResponseCard from '@/components/AIResponseCard';
import ExplainabilityModal from '@/components/ExplainabilityModal';
import CityMap from '@/components/CityMap';
import { CityLocation, HistoricalTrendData, NormalizedAirQuality, AIResponseData } from '@/lib/types';

function LocationDetailContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const id = (params?.id as string) || 'city-loc';
  const name = searchParams.get('name') || 'Delhi';
  const country = searchParams.get('country') || 'India';
  const lat = parseFloat(searchParams.get('lat') || '28.6139');
  const lng = parseFloat(searchParams.get('lng') || '77.2090');

  const [airQuality, setAirQuality] = useState<NormalizedAirQuality | null>(null);
  const [history, setHistory] = useState<HistoricalTrendData | null>(null);
  const [activeTf, setActiveTf] = useState<'24h' | '7d' | '30d'>('24h');
  const [aiSummary, setAiSummary] = useState<AIResponseData | null>(null);

  const [loading, setLoading] = useState(true);
  const [explainModalOpen, setExplainModalOpen] = useState(false);

  useEffect(() => {
    async function loadCityData() {
      setLoading(true);
      try {
        const aqRes = await fetch(`/api/air-quality/current?lat=${lat}&lng=${lng}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
        const aqJson = await aqRes.json();
        if (aqJson.success) {
          setAirQuality(aqJson.data);

          const aiRes = await fetch('/api/ai/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ airQuality: aqJson.data }),
          });
          const aiJson = await aiRes.json();
          if (aiJson.success) {
            setAiSummary(aiJson);
          }
        }

        const histRes = await fetch(`/api/air-quality/history?lat=${lat}&lng=${lng}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}&timeframe=${activeTf}`);
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
    loadCityData();
  }, [lat, lng, name, country, activeTf]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-entrance">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 stroke-[1.5]" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Detailed Environmental Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">{name}, {country}</h1>
          <p className="text-slate-400 text-xs font-mono">LAT: {lat.toFixed(2)}° · LNG: {lng.toFixed(2)}°</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/compare?cityA=${encodeURIComponent(name)}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700/80 hover:border-white/20 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-teal-400" />
            <span>Compare {name}</span>
          </Link>

          <Link
            href={`/ai?city=${encodeURIComponent(name)}&q=${encodeURIComponent(`Why is air quality in ${name} currently ${airQuality?.category || 'at this level'}?`)}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#090d16] text-xs font-bold shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)] transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI About {name}</span>
          </Link>
        </div>
      </div>

      {loading || !airQuality ? (
        <div className="p-12 text-center rounded-2xl bg-[rgba(15,23,42,0.75)] backdrop-blur-md border border-white/10 space-y-2">
          <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold">Loading location telemetry for {name}...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <AQIGauge
            aqi={airQuality.aqi}
            category={airQuality.category}
            color={airQuality.color}
            locationName={`${name}, ${country}`}
            source={airQuality.source}
            minutesAgo={airQuality.minutesAgo ?? 8}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {aiSummary && (
                <AIResponseCard
                  data={aiSummary}
                  onOpenExplainability={() => setExplainModalOpen(true)}
                />
              )}
            </div>

            <div>
              <CityMap
                name={name}
                country={country}
                lat={lat}
                lng={lng}
                aqi={airQuality.aqi}
                color={airQuality.color}
                category={airQuality.category}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-white tracking-tight">Pollutant Telemetry Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(airQuality.pollutants).map((p) => (
                p && (
                  <PollutantCard
                    key={p.code}
                    pollutant={p}
                    onAskAI={(code) => {
                      router.push(`/ai?city=${encodeURIComponent(name)}&q=${encodeURIComponent(`Explain ${code} for ${name} simply.`)}`);
                    }}
                  />
                )
              ))}
            </div>
          </div>

          {history && (
            <HistoricalChart
              data={history}
              activeTimeframe={activeTf}
              onTimeframeChange={(tf) => setActiveTf(tf)}
            />
          )}
        </div>
      )}

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

export default function LocationDetailPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-muted text-xs">Loading location detail...</div>}>
      <LocationDetailContent />
    </Suspense>
  );
}

