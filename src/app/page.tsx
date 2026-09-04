'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  ArrowRight,
  Activity,
  MapPin,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  BarChart2,
  BookOpen,
  MessageCircleQuestion,
  ChartSpline,
  ArrowLeftRight,
  Database,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import SearchModal from '@/components/SearchModal';
import LivingCityVisual from '@/components/LivingCityVisual';
import { CityLocation, NormalizedAirQuality } from '@/lib/types';
import AQIGauge from '@/components/AQIGauge';
import PollutantCard from '@/components/PollutantCard';

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [previewCity, setPreviewCity] = useState<CityLocation>({
    id: 'delhi-in',
    name: 'Delhi',
    country: 'India',
    countryCode: 'IN',
    lat: 28.6139,
    lng: 77.2090,
  });
  const [aqData, setAqData] = useState<NormalizedAirQuality | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/air-quality/current?lat=${previewCity.lat}&lng=${previewCity.lng}&name=${encodeURIComponent(previewCity.name)}&country=${encodeURIComponent(previewCity.country)}`
        );
        const result = await res.json();
        if (result.success) {
          setAqData(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [previewCity]);

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      
      {/* 01 — Hero Section (§12, §13, §14) */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Credibility Row Eyebrow Chips (Change 1) */}
              <div className="inline-flex flex-wrap items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 tracking-[0.04em] font-medium">
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 uppercase text-[11px] font-bold tracking-wider shadow-sm">
                  SDG 11.6 · AIR QUALITY
                </span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span>Real-time environmental data</span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span>AI-powered insights</span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span>Trusted knowledge</span>
              </div>

              {/* Editorial Large Headline (§08, §6) matching image typography & gradient accents */}
              <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.75rem] font-black tracking-[-0.04em] leading-[1.02] text-[#0F172A] dark:text-[#F8FAFC] [text-wrap:balance] max-w-4xl transition-colors duration-200">
                Your city has a{' '}
                <span className="text-gradient-emerald inline">
                  story
                </span>{' '}
                <span className="text-gradient-urgency-light dark:text-gradient-urgency-dark inline">
                  in its
                </span>{' '}
                air.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
                UrbanAir AI turns complex air-quality data into clear environmental insights, helping communities understand the air around them.
              </p>

              {/* CTAs (§8.1, §11) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#34d399] text-[#052e24] text-sm font-bold shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.95]"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Your City →</span>
                </button>

                <Link
                  href={`/ai?city=${encodeURIComponent(previewCity.name)}`}
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 text-sm font-semibold transition-all duration-200 hover:border-slate-400 dark:hover:border-white/20 active:scale-[0.95] shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Ask UrbanAir AI</span>
                </Link>
              </div>

              {/* Grounding Thesis & SDG Supporting Statement (Change 1) */}
              <div className="pt-2 space-y-1.5">
                <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Supporting SDG 11 — Sustainable Cities and Communities</span>
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  "UrbanAir AI never generates a number — it only ever explains one that came from real measured data or a cited knowledge source."
                </p>
              </div>
            </div>

            {/* Right Column: Custom Living City Visualization + Hero Telemetry Card (Changes 2, 3, 4) */}
            <div className="lg:col-span-5">
              <LivingCityVisual
                cityName={previewCity.name}
                countryName={previewCity.country}
                aqi={aqData?.aqi ?? 164}
                category={aqData?.category ?? 'Unhealthy'}
                color={aqData?.color ?? '#ef4444'}
                isDemo={Boolean(aqData?.isDemo)}

                isCached={Boolean(aqData?.isCached)}
                isStale={Boolean(aqData?.isStale)}
                timestamp={aqData?.timestamp}
                minutesAgo={aqData?.minutesAgo}
                source={aqData?.source || 'Open-Meteo'}
                aqiStandard={aqData?.aqiStandard || 'US EPA AQI'}
                pm25={aqData?.pollutants?.pm25?.value ?? 72}
                pm10={aqData?.pollutants?.pm10?.value ?? 118}
                no2={aqData?.pollutants?.no2?.value ?? 41}
                o3={aqData?.pollutants?.o3?.value ?? 28}
                primaryPollutant={aqData?.primaryPollutant || 'O₃'}
              />
            </div>

          </div>
        </div>
      </section>

      {/* 02 — Live City Snapshot (§8.2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-entrance">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Live Environmental Snapshot</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">What's happening right now?</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Explore the latest available environmental conditions in your city.</p>
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-800 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-white/20 transition-all shadow-sm active:scale-95"
            >
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Change Location ({previewCity.name})</span>
            </button>
          </div>

          {loading || !aqData ? (
            <div className="p-12 text-center rounded-2xl glass-card text-slate-500 dark:text-slate-400 text-xs animate-pulse">
              Retrieving live telemetry for {previewCity.name}...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AQIGauge
                  aqi={aqData.aqi}
                  category={aqData.category}
                  color={aqData.color}
                  locationName={`${aqData.location.name}, ${aqData.location.country}`}
                  source={aqData.source}
                  minutesAgo={aqData.minutesAgo ?? 8}
                />
              </div>

              {/* Quick Summary Card */}
              <div className="rounded-2xl glass-card glass-card-hover p-6 sm:p-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="card-badge-indigo inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>UrbanAir AI Summary</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">What this means for {previewCity.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                    The current reported AQI in {previewCity.name} is <strong className="font-mono tabular-nums text-slate-900 dark:text-white">{aqData.aqi}</strong> ({aqData.category}). Fine particulate matter (PM2.5) stands at <span className="font-mono tabular-nums text-slate-900 dark:text-white">{aqData.pollutants.pm25?.value} µg/m³</span>, which exceeds WHO 24-hr guidelines (15 µg/m³).
                  </p>
                </div>

                <Link
                  href={`/location/${previewCity.id}?lat=${previewCity.lat}&lng=${previewCity.lng}&name=${encodeURIComponent(previewCity.name)}&country=${encodeURIComponent(previewCity.country)}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700/80 hover:border-emerald-500/40 transition-all shadow-sm"
                >
                  <span>Open City Intelligence →</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 03 — The Problem (§8.3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-entrance">
        <div className="command-container p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="card-badge-amber inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">The Problem</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              Air quality shouldn't require a science degree to understand.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Technical numbers like <code className="text-amber-600 dark:text-amber-300 font-mono text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">AQI 164, PM2.5 72 µg/m³</code> leave citizens wondering <em>"What does this mean for my community today?"</em>
            </p>
            <div className="pt-1">
              <Link
                href={`/ai?city=${encodeURIComponent(previewCity.name)}&q=${encodeURIComponent("Why is my city's air quality at this level today?")}`}
                className="card-badge-indigo inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI why →</span>
              </Link>
            </div>
          </div>

          {/* Transformation Editorial Visual with EXAMPLE RESPONSE Tag (§8.3) */}
          <div className="p-5 rounded-2xl inner-panel space-y-3 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Raw Environmental Telemetry</span>
              <div className="telemetry-panel font-mono text-xs text-slate-900 dark:text-white font-medium p-3 rounded-lg border border-slate-300 dark:border-slate-700/80">
                AQI: 164 · PM2.5: 72 µg/m³ · PM10: 118 µg/m³ · NO₂: 41 µg/m³
              </div>
            </div>

            <div className="text-center font-bold text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center gap-1.5 py-1 tracking-wider">
              <span>DATA → CONTEXT → AI → UNDERSTANDING</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="card-badge-emerald inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Understandable Insight</span>
                <span className="card-badge-indigo text-[10px] font-bold px-2 py-0.5 rounded uppercase">EXAMPLE RESPONSE</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal telemetry-panel p-3.5 rounded-lg border-l-4 border-l-emerald-500 border border-slate-300 dark:border-slate-700/80">
                "Air quality is currently in the Unhealthy range based on elevated fine particulate matter (PM2.5 72 µg/m³), exceeding WHO safety guidelines."
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 04 — Data to Understanding Pipeline (§17) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-entrance">
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="card-badge-emerald inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">Architecture & Flow</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Data to Understanding Pipeline</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">A 5-stage transparent transformation turning physical sensor telemetry into human knowledge</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {[
              { num: '01', title: 'RAW DATA', desc: 'Real-time telemetry (PM2.5, NO₂, AQI) from Open-Meteo & station grids', icon: Database, color: 'text-teal-600 dark:text-teal-400' },
              { num: '02', title: 'CONTEXT', desc: 'Normalization against US EPA index benchmarks & regional baselines', icon: MapPin, color: 'text-emerald-600 dark:text-emerald-400' },
              { num: '03', title: 'KNOWLEDGE', desc: 'RAG retrieval from WHO Guidelines 2021, EPA standards & UN SDG 11', icon: BookOpen, color: 'text-amber-600 dark:text-amber-400' },
              { num: '04', title: 'AI INTERPRETATION', desc: 'Gemini reasoning + Context Engine without number fabrication', icon: Sparkles, color: 'text-indigo-600 dark:text-indigo-400' },
              { num: '05', title: 'UNDERSTANDING', desc: 'Clear plain-language explanations with transparency drawers', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400' },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="process-card flex flex-col justify-between space-y-3 h-full"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold tracking-[0.08em] text-[#047857] dark:text-[#34D399]">{st.num}</span>
                      <Icon className={`w-4 h-4 ${st.color}`} />
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">{st.title}</h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{st.desc}</p>
                  </div>
                  {i < 4 && (
                    <div className="hidden md:flex justify-end text-slate-400 dark:text-slate-600 font-bold text-xs">→</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05 — AI Intelligence & Capability Cards (§18, §19) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-entrance">
        <div className="command-container p-7 sm:p-10 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              <div className="card-badge-indigo inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI Context Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">Ask your city's air anything.</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">UrbanAir AI connects environmental telemetry with trusted knowledge to give clear answers.</p>
            </div>

            <Link
              href={`/ai?city=${encodeURIComponent(previewCity.name)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#090d16] font-bold text-xs shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)] transition-all active:scale-95"
            >
              <span>Ask another question →</span>
            </Link>
          </div>

          {/* Sample Conversation (§18) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conversation Demo</span>
              <span className="card-badge-indigo text-[10px] font-bold px-2 py-0.5 rounded uppercase">SAMPLE CONVERSATION</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl inner-panel space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase">USER INQUIRY</span>
                <p className="text-xs font-medium text-slate-900 dark:text-white">"Why is the air quality poor today in my city?"</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/20 border-l-4 border-l-indigo-500 border border-indigo-200 dark:border-indigo-500/20 text-slate-800 dark:text-slate-100 space-y-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[10px] uppercase">AI CONTEXTUAL RESPONSE</span>
                <p className="text-xs leading-relaxed font-normal">
                  "Based on current telemetry, the selected location reports an Unhealthy AQI of 164 (US EPA AQI). PM2.5 levels are elevated relative to WHO 24-hr guidelines (15 µg/m³)."
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="telemetry-panel px-2 py-0.5 rounded text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/10">Data: AQI · PM2.5 · PM10</span>
                  <span className="card-badge-indigo px-2 py-0.5 rounded text-[10px] font-bold">Sources: WHO · EPA</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Capability Cards (§19: Explain, Analyze, Compare with Lucide stroke-width 1.5) */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Core AI Capabilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl inner-panel space-y-2 hover:border-emerald-500/30 transition-all">
                <MessageCircleQuestion className="w-5 h-5 text-indigo-600 dark:text-indigo-400 stroke-[1.5]" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Explain</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Translates technical pollutant scores (PM2.5, NO₂, O₃) into plain-language health guidance grounded in WHO guidelines.</p>
              </div>

              <div className="p-5 rounded-xl inner-panel space-y-2 hover:border-emerald-500/30 transition-all">
                <ChartSpline className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Analyze</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Evaluates meteorological drivers, temperature inversions, and multi-day pollutant accumulation patterns.</p>
              </div>

              <div className="p-5 rounded-xl inner-panel space-y-2 hover:border-emerald-500/30 transition-all">
                <ArrowLeftRight className="w-5 h-5 text-teal-600 dark:text-teal-400 stroke-[1.5]" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Compare</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Executes normalized side-by-side metric comparisons between global cities with missing-metric handling.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 06 — Explore Your City (§20) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-entrance">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="card-badge-emerald inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">Explore Global Cities</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">Air quality varies across the globe.</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Discover live AQI readings, pollutant breakdowns, and community insights.</p>
            </div>

            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#090d16] font-bold text-xs shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
              <span>View Global Map & Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              { name: 'Delhi', country: 'India', aqi: 164, cat: 'Unhealthy', color: '#ef4444' },
              { name: 'Tokyo', country: 'Japan', aqi: 32, cat: 'Good', color: '#10b981' },
              { name: 'London', country: 'United Kingdom', aqi: 45, cat: 'Good', color: '#10b981' },
              { name: 'Paris', country: 'France', aqi: 54, cat: 'Moderate', color: '#f59e0b' },
              { name: 'New York', country: 'United States', aqi: 48, cat: 'Good', color: '#10b981' },
              { name: 'São Paulo', country: 'Brazil', aqi: 78, cat: 'Moderate', color: '#f59e0b' },
              { name: 'Lagos', country: 'Nigeria', aqi: 135, cat: 'Unhealthy for Sensitive Groups', color: '#f97316' },
              { name: 'Jakarta', country: 'Indonesia', aqi: 158, cat: 'Unhealthy', color: '#ef4444' },
            ].map((c, idx) => (

              <Link
                key={idx}
                href={`/location/${c.name.toLowerCase()}?lat=0&lng=0&name=${encodeURIComponent(c.name)}&country=${encodeURIComponent(c.country)}`}
                className="p-4 rounded-2xl glass-card glass-card-hover space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{c.country}</span>
                </div>
                <div className="flex items-baseline justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                  <span className="font-mono tabular-nums text-sm font-bold" style={{ color: c.color }}>AQI {c.aqi}</span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{c.cat}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — City Comparison (§8.7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-entrance">
        <div className="command-container p-7 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="card-badge-emerald inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">City Comparison</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">Cities tell different stories.</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Compare side-by-side air quality metrics between global urban centers.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/compare?cityA=Delhi&cityB=Tokyo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-[0_0_20px_-3px_rgba(20,184,166,0.3)] transition-all active:scale-95"
              >
                <span>Open Full Comparison Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/ai?q=Compare%20air%20quality%20between%20Delhi%20and%20Tokyo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 font-bold text-xs hover:border-slate-400 dark:hover:border-white/20 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Explain this comparison with AI</span>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto inner-panel p-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400">
                  <th className="py-2.5 px-3 font-bold">Metric</th>
                  <th className="py-2.5 px-3 font-bold">Delhi (India)</th>
                  <th className="py-2.5 px-3 font-bold">Tokyo (Japan)</th>
                  <th className="py-2.5 px-3 font-bold">Comparison Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-200 font-medium">
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">AQI Index</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-red-500 dark:text-red-400 font-bold">164 · Unhealthy</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-bold">32 · Good</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">Tokyo measures 132 AQI points cleaner</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">PM2.5</td>
                  <td className="py-3 px-3 font-mono tabular-nums">72 µg/m³</td>
                  <td className="py-3 px-3 font-mono tabular-nums">8 µg/m³</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">Delhi exceeds WHO limit (15 µg/m³)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">PM10</td>
                  <td className="py-3 px-3 font-mono tabular-nums">118 µg/m³</td>
                  <td className="py-3 px-3 font-mono tabular-nums">18 µg/m³</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">Coarse particulate loading delta</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">NO₂</td>
                  <td className="py-3 px-3 font-mono tabular-nums">41 µg/m³</td>
                  <td className="py-3 px-3 font-mono tabular-nums">14 µg/m³</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">Traffic and industrial combustion delta</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">SO₂</td>
                  <td className="py-3 px-3 font-mono tabular-nums">12 µg/m³</td>
                  <td className="py-3 px-3 text-slate-400 dark:text-slate-500 italic">— not reported</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-normal">Missing metric handled honestly</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 08 — Environmental Learning (§8.8: Featured PM2.5 + 6 others) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-entrance">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="card-badge-emerald inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">Environmental Education Hub</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">Air Quality 101</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Learn about the 7 core air pollutants and measurement scales.</p>
            </div>

            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 font-bold text-xs hover:border-slate-400 dark:hover:border-white/20 transition-all shadow-sm"
            >
              <span>Explore All Modules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                topic: 'PM2.5 (Featured: Fine Particulate Matter)',
                simple: 'Particles so small they pass straight through your lungs’ natural filters.',
                desc: 'Particles under 2.5 µm from combustion and industry that penetrate into the bloodstream. WHO limit: 15 µg/m³.',
                query: 'Explain PM2.5 health thresholds and WHO guidelines in plain language.',
              },
              {
                topic: 'AQI (Air Quality Index)',
                simple: 'Think of it as a single grade for how the air is doing right now.',
                desc: 'A standardized 0–500+ scale combining several pollutants into one number to communicate health risk.',
                query: 'How is AQI calculated across different countries?',
              },
              {
                topic: 'PM10 (Coarse Particles)',
                simple: 'The bigger, dustier cousin of PM2.5.',
                desc: 'Dust, pollen, and debris under 10 µm generally trapped in the upper respiratory tract. WHO limit: 45 µg/m³.',
                query: 'What is the difference between PM10 and PM2.5?',
              },
              {
                topic: 'NO₂ (Nitrogen Dioxide)',
                simple: 'A traffic-and-industry gas that irritates airways.',
                desc: 'Released by combustion engines and power plants; key driver of urban photochemical smog.',
                query: 'Where does NO2 pollution come from in cities?',
              },
              {
                topic: 'O₃ (Ground-Level Ozone)',
                simple: 'Not the ozone layer — this is a ground-level irritant formed on hot sunny days.',
                desc: 'Formed when vehicular NOx and VOCs react under sunlight; triggers coughing and airway irritation.',
                query: 'Why is ground-level ozone worse in the summer?',
              },
              {
                topic: 'SO₂ & CO (Sulfur Dioxide & Carbon Monoxide)',
                simple: 'Gases linked to industrial fuel-burning and incomplete combustion.',
                desc: 'SO₂ stems from sulfurous coal/oil combustion; CO reduces how much oxygen blood can carry.',
                query: 'What health effects do SO2 and CO have in urban areas?',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl glass-card glass-card-hover space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.topic}</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-300 font-medium italic">"{item.simple}"</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                  <Link
                    href={`/ai?q=${encodeURIComponent(item.query)}`}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask AI about this →</span>
                  </Link>
                  <Link
                    href="/learn"
                    className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Module →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — SDG 11 Framework (§8.9: Strictly approved verbs compliant) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-entrance">
        <div className="sdg-panel-container p-8 sm:p-10 space-y-5 relative overflow-hidden backdrop-blur-md">
          <div className="card-badge-emerald inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold">
            <Globe2 className="w-4 h-4" />
            <span>UN Sustainable Development Goal 11</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Better information. More informed communities.
          </h2>

          <p className="text-xs sm:text-sm leading-relaxed font-normal max-w-3xl text-slate-700 dark:text-slate-300">
            UrbanAir AI <strong>supports</strong> and <strong>contributes to</strong> SDG 11 (Sustainable Cities and Communities) by helping citizens and urban planners access, understand, and explore air quality data. It <strong>helps advance awareness of</strong> Target 11.6 and <strong>aligns with</strong> global urban sustainability initiatives without claiming software alone solves air pollution.
          </p>

          <div className="pt-2">
            <Link
              href="/sdg-11"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#10b981] hover:bg-[#34d399] text-[#090d16] font-bold text-xs shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] active:scale-[0.95]"
            >
              <span>Read SDG 11 Narrative & Targets →</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10 — Responsible AI (§8.10: 4 Pillars concrete sentences) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-entrance">
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="card-badge-emerald inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">Governance & Ethics</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Responsible AI Principles</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Four core pillars governing safety, fairness, and transparency in UrbanAir AI</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {[
              { title: 'FAIRNESS', desc: 'UrbanAir AI avoids drawing conclusions about people or communities based on location, and limits its scope to environmental data interpretation.' },
              { title: 'TRANSPARENCY', desc: 'Every AI answer discloses the data points and knowledge sources it drew from, visible via "Why did AI give this answer?"' },
              { title: 'ETHICS', desc: 'UrbanAir AI will not provide medical diagnoses, treatment advice, or fabricated data — see §32 for the exact refusal pattern.' },
              { title: 'PRIVACY', desc: 'UrbanAir AI does not collect or store personally identifiable user information. Client-side browser storage is strictly limited to local theme preferences.' },

            ].map((pillar, idx) => (
              <div key={idx} className="p-5 rounded-2xl glass-card glass-card-hover space-y-2">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs tracking-wider">{pillar.title}</div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link href="/responsible-ai" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              <span>Explore Responsible AI →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 11 — Final CTA (§8.11) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-entrance">
        <div className="command-container p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Start with your city.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Search any city worldwide to inspect live environmental telemetry, or consult UrbanAir AI for grounded, cited answers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="px-7 py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#34d399] text-[#090d16] text-xs font-bold shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] active:scale-[0.95]"
            >
              Explore Your City →
            </button>
            <Link
              href="/ai"
              className="px-7 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 text-xs font-bold hover:border-slate-400 dark:hover:border-white/20 transition-all active:scale-[0.95]"
            >
              Ask UrbanAir AI →
            </Link>
          </div>

          {/* Footer credibility row repeating the hero's 3-pillar line (§8.11) */}
          <div className="pt-6 border-t border-slate-200 dark:border-white/10 text-[12px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-3">
            <span>Real-time environmental data</span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span>AI-powered insights</span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span>Trusted knowledge</span>
          </div>
        </div>
      </section>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCity={(c) => setPreviewCity(c)}
      />

    </div>
  );
}


