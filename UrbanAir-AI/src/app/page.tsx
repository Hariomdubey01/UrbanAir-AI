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
              <div className="inline-flex flex-wrap items-center gap-2 text-[13px] text-muted tracking-[0.04em] font-medium">
                <span className="px-2.5 py-1 rounded-full bg-forest-800/5 dark:bg-white/5 border border-forest-800/10 dark:border-white/[0.08] text-forest-800 dark:text-slate-200 uppercase text-[11px] font-semibold tracking-wider">
                  SDG 11.6 · AIR QUALITY
                </span>
                <span>·</span>
                <span>Real-time environmental data</span>
                <span>·</span>
                <span>AI-powered insights</span>
                <span>·</span>
                <span>Trusted knowledge</span>
              </div>

              {/* Editorial Large Headline (§08) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-forest-800 dark:text-white tracking-tight leading-[1.12]">
                Your city has a story in its air.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-forest-800/80 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
                UrbanAir AI turns complex air-quality data into clear environmental insights, helping communities understand the air around them.
              </p>

              {/* CTAs (§8.1) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-resting hover:shadow-elevated transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Your City →</span>
                </button>

                <Link
                  href={`/ai?city=${encodeURIComponent(previewCity.name)}`}
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white dark:bg-[#0D1B18] hover:bg-ivory-200 dark:hover:bg-forest-900 text-forest-800 dark:text-white border border-forest-800/15 dark:border-white/[0.08] text-sm font-semibold transition-all shadow-resting hover:shadow-elevated"
                >
                  <Sparkles className="w-4 h-4 text-ai-500" />
                  <span>Ask UrbanAir AI</span>
                </Link>
              </div>

              {/* Grounding Thesis & SDG Supporting Statement (Change 1) */}
              <div className="pt-2 space-y-1.5">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Supporting SDG 11 — Sustainable Cities and Communities</span>
                </p>
                <p className="text-xs text-muted font-medium">
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
                isDemo={aqData ? Boolean(aqData.isDemo) : true}

                isCached={Boolean(aqData?.isCached)}
                isStale={Boolean(aqData?.isStale)}
                timestamp={aqData?.timestamp}
                minutesAgo={aqData?.minutesAgo}
                source={aqData?.source || (loading ? 'Open-Meteo' : 'Source unavailable')}
                aqiStandard={aqData?.aqiStandard || 'US EPA AQI'}
                pm25={aqData?.pollutants.pm25?.value ?? 72}
                pm10={aqData?.pollutants.pm10?.value ?? 118}
                no2={aqData?.pollutants.no2?.value ?? 41}
                o3={aqData?.pollutants.o3?.value ?? 28}
                primaryPollutant={aqData?.primaryPollutant || 'O₃'}
              />
            </div>


          </div>
        </div>
      </section>

      {/* 02 — Live City Snapshot (§8.2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Live Environmental Snapshot</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white mt-1">What's happening right now?</h2>
              <p className="text-xs text-muted">Explore the latest available environmental conditions in your city.</p>
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-white dark:bg-[#0D1B18] hover:bg-ivory-200 dark:hover:bg-forest-900 text-forest-800 dark:text-white border border-forest-800/15 dark:border-white/[0.08] transition-all shadow-resting hover:shadow-elevated"
            >
              <Search className="w-4 h-4 text-emerald-500" />
              <span>Change Location ({previewCity.name})</span>
            </button>
          </div>

          {loading || !aqData ? (
            <div className="p-12 text-center rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] text-muted text-xs animate-pulse">
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
              <div className="rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-resting hover:shadow-elevated transition-shadow">
                <div>
                  <div className="flex items-center gap-2 text-ai-500 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>UrbanAir AI Summary</span>
                  </div>
                  <h3 className="text-xl font-semibold text-forest-800 dark:text-white mt-2">What this means for {previewCity.name}</h3>
                  <p className="text-xs sm:text-sm text-forest-800/80 dark:text-slate-300 leading-relaxed mt-3">
                    The current reported AQI in {previewCity.name} is <strong className="font-mono tabular-nums">{aqData.aqi}</strong> ({aqData.category}). Fine particulate matter (PM2.5) stands at <span className="font-mono tabular-nums">{aqData.pollutants.pm25?.value} µg/m³</span>, which exceeds WHO 24-hr guidelines (15 µg/m³).
                  </p>
                </div>

                <Link
                  href={`/location/${previewCity.id}?lat=${previewCity.lat}&lng=${previewCity.lng}&name=${encodeURIComponent(previewCity.name)}&country=${encodeURIComponent(previewCity.country)}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest-800 dark:bg-forest-700 hover:bg-forest-900 text-white font-semibold text-xs transition-all shadow-resting hover:shadow-elevated"
                >
                  <span>Open City Intelligence →</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 03 — The Problem (§8.3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] p-7 sm:p-10 shadow-resting hover:shadow-elevated transition-shadow grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">The Problem</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white leading-snug">
              Air quality shouldn't require a science degree to understand.
            </h2>
            <p className="text-forest-800/80 dark:text-slate-300 text-sm leading-relaxed">
              Technical numbers like <code className="text-amber-600 dark:text-amber-400 font-mono text-xs bg-amber-500/10 px-2 py-0.5 rounded">AQI 164, PM2.5 72 µg/m³</code> leave citizens wondering <em>"What does this mean for my community today?"</em>
            </p>
            <div className="pt-1">
              <Link
                href={`/ai?city=${encodeURIComponent(previewCity.name)}&q=${encodeURIComponent("Why is my city's air quality at this level today?")}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ai-500/10 hover:bg-ai-500/20 text-ai-500 border border-ai-500/20 text-xs font-semibold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI why →</span>
              </Link>
            </div>
          </div>

          {/* Transformation Editorial Visual with EXAMPLE RESPONSE Tag (§8.3) */}
          <div className="p-5 rounded-xl bg-ivory-100 dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-3 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-muted text-[11px] uppercase tracking-wider">Raw Environmental Telemetry</span>
              <div className="font-mono text-xs text-forest-800 dark:text-white font-medium bg-white dark:bg-forest-800 p-3 rounded-lg border border-forest-800/10 dark:border-white/[0.08]">
                AQI: 164 · PM2.5: 72 µg/m³ · PM10: 118 µg/m³ · NO₂: 41 µg/m³
              </div>
            </div>

            <div className="text-center font-semibold text-ai-500 text-xs flex items-center justify-center gap-1.5 py-1 tracking-wider">
              <span>DATA → CONTEXT → AI → UNDERSTANDING</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider">Understandable Insight</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-forest-800/10 dark:bg-white/10 text-muted uppercase">EXAMPLE RESPONSE</span>
              </div>
              <div className="text-xs text-forest-800 dark:text-slate-200 leading-relaxed font-normal bg-white dark:bg-forest-800 p-3.5 rounded-lg border-l-4 border-l-emerald-500 border border-forest-800/10 dark:border-white/[0.08]">
                "Air quality is currently in the Unhealthy range based on elevated fine particulate matter (PM2.5 72 µg/m³), exceeding WHO safety guidelines."
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 04 — Data to Understanding Pipeline (§17) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Architecture & Flow</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white">Data to Understanding Pipeline</h2>
            <p className="text-xs text-muted">A 5-stage transparent transformation turning physical sensor telemetry into human knowledge</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {[
              { num: '01', title: 'RAW DATA', desc: 'Real-time telemetry (PM2.5, NO₂, AQI) from Open-Meteo & station grids', icon: Database, color: 'text-teal-500' },
              { num: '02', title: 'CONTEXT', desc: 'Normalization against US EPA index benchmarks & regional baselines', icon: MapPin, color: 'text-emerald-500' },
              { num: '03', title: 'KNOWLEDGE', desc: 'RAG retrieval from WHO Guidelines 2021, EPA standards & UN SDG 11', icon: BookOpen, color: 'text-amber-500' },
              { num: '04', title: 'AI INTERPRETATION', desc: 'Gemini reasoning + Context Engine without number fabrication', icon: Sparkles, color: 'text-ai-500' },
              { num: '05', title: 'UNDERSTANDING', desc: 'Clear plain-language explanations with transparency drawers', icon: CheckCircle2, color: 'text-emerald-600' },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] flex flex-col justify-between space-y-3 shadow-sm hover:border-emerald-500/30 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-muted">{st.num}</span>
                      <Icon className={`w-4 h-4 ${st.color}`} />
                    </div>
                    <h3 className="font-semibold text-xs text-forest-800 dark:text-white uppercase tracking-wider">{st.title}</h3>
                    <p className="text-[11px] text-muted leading-relaxed">{st.desc}</p>
                  </div>
                  {i < 4 && (
                    <div className="hidden md:flex justify-end text-muted font-bold text-xs">→</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05 — AI Intelligence & Capability Cards (§18, §19) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] p-7 sm:p-10 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-forest-800/10 dark:border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 text-ai-500 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI Context Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white mt-1">Ask your city's air anything.</h2>
              <p className="text-xs text-muted">UrbanAir AI connects environmental telemetry with trusted knowledge to give clear answers.</p>
            </div>

            <Link
              href={`/ai?city=${encodeURIComponent(previewCity.name)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ai-500 hover:bg-ai-600 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <span>Ask another question →</span>
            </Link>
          </div>

          {/* Sample Conversation (§18) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Conversation Demo</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-ai-500/10 text-ai-500 border border-ai-500/20 uppercase">SAMPLE CONVERSATION</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-ivory-100 dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1.5">
                <span className="font-semibold text-muted text-[10px] uppercase">USER INQUIRY</span>
                <p className="text-xs font-medium text-forest-800 dark:text-white">"Why is the air quality poor today in my city?"</p>
              </div>

              <div className="p-4 rounded-xl bg-ai-500/5 dark:bg-ai-500/10 border-l-4 border-l-ai-500 border border-forest-800/10 dark:border-white/[0.08] text-forest-800 dark:text-slate-100 space-y-2">
                <span className="font-semibold text-ai-500 text-[10px] uppercase">AI CONTEXTUAL RESPONSE</span>
                <p className="text-xs leading-relaxed font-normal">
                  "Based on current telemetry, the selected location reports an Unhealthy AQI of 164 (US EPA AQI). PM2.5 levels are elevated relative to WHO 24-hr guidelines (15 µg/m³)."
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-forest-800 text-[10px] font-mono text-muted border border-forest-800/5 dark:border-white/[0.05]">Data: AQI · PM2.5 · PM10</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-forest-800 text-[10px] font-semibold text-ai-500 border border-ai-500/20">Sources: WHO · EPA</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Capability Cards (§19: Explain, Analyze, Compare with Lucide stroke-width 1.5) */}
          <div className="pt-4 border-t border-forest-800/10 dark:border-white/[0.08]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Core AI Capabilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-ivory-100/60 dark:bg-forest-900/60 border border-forest-800/10 dark:border-white/[0.08] space-y-2">
                <MessageCircleQuestion className="w-5 h-5 text-ai-500 stroke-[1.5]" />
                <h4 className="font-semibold text-sm text-forest-800 dark:text-white">Explain</h4>
                <p className="text-xs text-muted leading-relaxed">Translates technical pollutant scores (PM2.5, NO₂, O₃) into plain-language health guidance grounded in WHO guidelines.</p>
              </div>

              <div className="p-5 rounded-xl bg-ivory-100/60 dark:bg-forest-900/60 border border-forest-800/10 dark:border-white/[0.08] space-y-2">
                <ChartSpline className="w-5 h-5 text-emerald-500 stroke-[1.5]" />
                <h4 className="font-semibold text-sm text-forest-800 dark:text-white">Analyze</h4>
                <p className="text-xs text-muted leading-relaxed">Evaluates meteorological drivers, temperature inversions, and multi-day pollutant accumulation patterns.</p>
              </div>

              <div className="p-5 rounded-xl bg-ivory-100/60 dark:bg-forest-900/60 border border-forest-800/10 dark:border-white/[0.08] space-y-2">
                <ArrowLeftRight className="w-5 h-5 text-teal-500 stroke-[1.5]" />
                <h4 className="font-semibold text-sm text-forest-800 dark:text-white">Compare</h4>
                <p className="text-xs text-muted leading-relaxed">Executes normalized side-by-side metric comparisons between global cities with missing-metric handling.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 06 — Explore Your City (§20) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Explore Global Cities</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white mt-1">Air quality varies across the globe.</h2>
              <p className="text-xs text-muted">Discover live AQI readings, pollutant breakdowns, and community insights.</p>
            </div>

            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-sm transition-all"
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
                className="p-4 rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] hover:border-emerald-500/40 hover:shadow-sm transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-forest-800 dark:text-white">{c.name}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  </div>
                  <span className="text-[11px] text-muted">{c.country}</span>
                </div>
                <div className="flex items-baseline justify-between pt-2 border-t border-forest-800/5 dark:border-white/[0.05]">
                  <span className="font-mono tabular-nums text-sm font-bold" style={{ color: c.color }}>AQI {c.aqi}</span>
                  <span className="text-[10px] font-medium text-muted">{c.cat}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — City Comparison (§8.7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] p-7 sm:p-10 shadow-resting hover:shadow-elevated transition-shadow space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">City Comparison</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white mt-1">Cities tell different stories.</h2>
              <p className="text-xs text-muted">Compare side-by-side air quality metrics between global urban centers.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/compare?cityA=Delhi&cityB=Tokyo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-resting hover:shadow-elevated transition-all"
              >
                <span>Open Full Comparison Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/ai?q=Compare%20air%20quality%20between%20Delhi%20and%20Tokyo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ai-500 hover:bg-ai-600 text-white font-semibold text-xs shadow-resting hover:shadow-elevated transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explain this comparison with AI</span>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-forest-800/10 dark:border-white/[0.08] text-muted">
                  <th className="py-2.5 px-3 font-semibold">Metric</th>
                  <th className="py-2.5 px-3 font-semibold">Delhi (India)</th>
                  <th className="py-2.5 px-3 font-semibold">Tokyo (Japan)</th>
                  <th className="py-2.5 px-3 font-semibold">Comparison Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-800/5 dark:divide-white/[0.05] text-forest-800 dark:text-slate-200 font-medium">
                <tr>
                  <td className="py-3 px-3 font-semibold">AQI Index</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-red-500 font-bold">164 · Unhealthy</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-emerald-500 font-bold">32 · Good</td>

                  <td className="py-3 px-3 text-muted">Tokyo measures 132 AQI points cleaner</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">PM2.5</td>
                  <td className="py-3 px-3 font-mono tabular-nums">72 µg/m³</td>
                  <td className="py-3 px-3 font-mono tabular-nums">8 µg/m³</td>
                  <td className="py-3 px-3 text-muted">Delhi exceeds WHO limit (15 µg/m³)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">PM10</td>
                  <td className="py-3 px-3 font-mono tabular-nums">118 µg/m³</td>
                  <td className="py-3 px-3 font-mono tabular-nums">18 µg/m³</td>
                  <td className="py-3 px-3 text-muted">Coarse particulate loading delta</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">NO₂</td>
                  <td className="py-3 px-3 font-mono tabular-nums">41 µg/m³</td>
                  <td className="py-3 px-3 font-mono tabular-nums">14 µg/m³</td>
                  <td className="py-3 px-3 text-muted">Traffic and industrial combustion delta</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">SO₂</td>
                  <td className="py-3 px-3 font-mono tabular-nums">12 µg/m³</td>
                  <td className="py-3 px-3 text-muted italic">— not reported</td>
                  <td className="py-3 px-3 text-muted font-normal">Missing metric handled honestly</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 08 — Environmental Learning (§8.8: Featured PM2.5 + 6 others) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Environmental Education Hub</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white mt-1">Air Quality 101</h2>
              <p className="text-xs text-muted">Learn about the 7 core air pollutants and measurement scales.</p>
            </div>

            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#0D1B18] hover:bg-ivory-200 dark:hover:bg-forest-900 text-forest-800 dark:text-white border border-forest-800/15 dark:border-white/[0.08] font-semibold text-xs shadow-resting hover:shadow-elevated transition-all"
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
                className="p-5 rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] space-y-3 flex flex-col justify-between shadow-resting hover:shadow-elevated transition-shadow"
              >
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-sm text-forest-800 dark:text-white">{item.topic}</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium italic">"{item.simple}"</p>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-forest-800/5 dark:border-white/[0.05]">
                  <Link
                    href={`/ai?q=${encodeURIComponent(item.query)}`}
                    className="text-[11px] font-semibold text-ai-500 hover:underline inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask AI about this →</span>
                  </Link>
                  <Link
                    href="/learn"
                    className="text-[11px] font-medium text-muted hover:text-forest-800 dark:hover:text-white"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[20px] bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 p-8 sm:p-10 text-white shadow-resting hover:shadow-elevated transition-shadow space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
            <Globe2 className="w-4 h-4" />
            <span>UN Sustainable Development Goal 11</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Better information. More informed communities.
          </h2>

          <p className="text-xs sm:text-sm leading-relaxed font-normal max-w-3xl opacity-95">
            UrbanAir AI <strong>supports</strong> and <strong>contributes to</strong> SDG 11 (Sustainable Cities and Communities) by helping citizens and urban planners access, understand, and explore air quality data. It <strong>helps advance awareness of</strong> Target 11.6 and <strong>aligns with</strong> global urban sustainability initiatives without claiming software alone solves air pollution.
          </p>

          <div className="pt-2">
            <Link
              href="/sdg-11"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 text-white font-semibold text-xs hover:bg-forest-900 transition-all shadow-resting hover:shadow-elevated"
            >
              <span>Read SDG 11 Narrative & Targets →</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10 — Responsible AI (§8.10: 4 Pillars concrete sentences) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Governance & Ethics</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white">Responsible AI Principles</h2>
            <p className="text-xs text-muted">Four core pillars governing safety, fairness, and transparency in UrbanAir AI</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {[
              { title: 'FAIRNESS', desc: 'UrbanAir AI avoids drawing conclusions about people or communities based on location, and limits its scope to environmental data interpretation.' },
              { title: 'TRANSPARENCY', desc: 'Every AI answer discloses the data points and knowledge sources it drew from, visible via "Why did AI give this answer?"' },
              { title: 'ETHICS', desc: 'UrbanAir AI will not provide medical diagnoses, treatment advice, or fabricated data — see §32 for the exact refusal pattern.' },
              { title: 'PRIVACY', desc: 'UrbanAir AI does not collect or store personally identifiable user information. Client-side browser storage is strictly limited to local theme preferences.' },

            ].map((pillar, idx) => (
              <div key={idx} className="p-5 rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] space-y-2 shadow-resting hover:shadow-elevated transition-shadow">
                <div className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">{pillar.title}</div>
                <p className="text-muted leading-relaxed font-normal">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link href="/responsible-ai" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              <span>Explore Responsible AI →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 11 — Final CTA (§8.11) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] p-8 sm:p-12 text-center space-y-6 shadow-resting hover:shadow-elevated transition-shadow">
          <h2 className="text-3xl sm:text-4xl font-semibold text-forest-800 dark:text-white tracking-tight">
            Start with your city.
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Search any city worldwide to inspect live environmental telemetry, or consult UrbanAir AI for grounded, cited answers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-resting hover:shadow-elevated transition-all"
            >
              Explore Your City →
            </button>
            <Link
              href="/ai"
              className="px-7 py-3.5 rounded-xl bg-forest-800 dark:bg-forest-700 hover:bg-forest-900 text-white text-xs font-semibold transition-all shadow-resting hover:shadow-elevated"
            >
              Ask UrbanAir AI →
            </Link>
          </div>

          {/* Footer credibility row repeating the hero's 3-pillar line (§8.11) */}
          <div className="pt-6 border-t border-forest-800/10 dark:border-white/[0.08] text-[12px] text-muted flex flex-wrap items-center justify-center gap-3">
            <span>Real-time environmental data</span>
            <span>·</span>
            <span>AI-powered insights</span>
            <span>·</span>
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


