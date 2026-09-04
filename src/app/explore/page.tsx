'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Globe, Sparkles, Filter, ArrowRight, RefreshCw } from 'lucide-react';
import { POPULAR_CITIES } from '@/lib/air-quality/open-meteo';
import { CityLocation, NormalizedAirQuality } from '@/lib/types';
import SearchModal from '@/components/SearchModal';

interface CityExploreItem {
  city: CityLocation;
  data?: NormalizedAirQuality;
  loading: boolean;
}

export default function ExplorePage() {
  const [items, setItems] = useState<CityExploreItem[]>(
    POPULAR_CITIES.map(c => ({ city: c, loading: true }))
  );
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    async function loadAllCities() {
      const updated = await Promise.all(
        POPULAR_CITIES.map(async (c) => {
          try {
            const res = await fetch(`/api/air-quality/current?lat=${c.lat}&lng=${c.lng}&name=${encodeURIComponent(c.name)}&country=${encodeURIComponent(c.country)}`);
            const json = await res.json();
            if (json.success) {
              return { city: c, data: json.data, loading: false };
            }
          } catch (e) {}
          return { city: c, loading: false };
        })
      );
      setItems(updated);
    }
    loadAllCities();
  }, []);

  const filteredItems = items.filter(item => {
    if (filterCategory === 'All') return true;
    return item.data?.category === filterCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-entrance">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Global City Exploration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Explore World Cities Air Quality</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Discover real-time environmental metrics and community insights worldwide</p>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#090d16] font-bold text-xs shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)] transition-all active:scale-95"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search Any Custom City</span>
        </button>
      </div>

      {/* Filter Category Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1 shrink-0">Filter AQI:</span>
        {['All', 'Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              filterCategory === cat
                ? 'bg-[#10b981] text-[#090d16] border-transparent shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const { city, data, loading } = item;
          return (
            <div
              key={city.id}
              className="rounded-2xl glass-card glass-card-hover p-5 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{city.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{city.country}</p>
                  </div>

                  {data ? (
                    <div 
                      className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono text-white shadow-sm"
                      style={{ backgroundColor: data.color }}
                    >
                      AQI {data.aqi}
                    </div>
                  ) : loading ? (
                    <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin" />
                  ) : null}
                </div>

                {data && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Status Category:</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{data.category}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Primary Pollutant:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">{data.primaryPollutant}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>PM2.5:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">{data.pollutants.pm25?.value} µg/m³</strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Link
                  href={`/location/${city.id}?lat=${city.lat}&lng=${city.lng}&name=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-300 hover:border-emerald-500/40 border border-slate-200 dark:border-slate-700/80 text-xs font-bold transition-all"
                >
                  <span>City Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/compare?cityA=${encodeURIComponent(city.name)}`}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700/80 text-xs font-bold transition-all"
                  title="Compare with another city"
                >
                  Compare
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCity={(c) => {
          window.location.href = `/location/${c.id}?lat=${c.lat}&lng=${c.lng}&name=${encodeURIComponent(c.name)}&country=${encodeURIComponent(c.country)}`;
        }}
      />

    </div>
  );
}

