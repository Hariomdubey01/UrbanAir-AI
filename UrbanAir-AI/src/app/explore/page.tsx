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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-forest-800/10 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Global City Exploration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white tracking-tight mt-0.5">Explore World Cities Air Quality</h1>
          <p className="text-muted text-xs">Discover real-time environmental metrics and community insights worldwide</p>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-xs hover:bg-emerald-600 transition-all shadow-sm"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search Any Custom City</span>
        </button>
      </div>

      {/* Filter Category Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-muted shrink-0" />
        <span className="text-xs font-medium text-muted mr-1 shrink-0">Filter AQI:</span>
        {['All', 'Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              filterCategory === cat
                ? 'bg-forest-800 dark:bg-white text-white dark:text-forest-900 border-transparent shadow-sm'
                : 'bg-white dark:bg-[#0D1B18] text-muted border-forest-800/10 dark:border-white/[0.08] hover:bg-ivory-200 dark:hover:bg-forest-900'
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
              className="rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] p-5 hover:border-emerald-500/30 transition-all space-y-3 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-base text-forest-800 dark:text-white">{city.name}</h3>
                    <p className="text-xs text-muted">{city.country}</p>
                  </div>

                  {data ? (
                    <div 
                      className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono text-white"
                      style={{ backgroundColor: data.color }}
                    >
                      AQI {data.aqi}
                    </div>
                  ) : loading ? (
                    <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin" />
                  ) : null}
                </div>

                {data && (
                  <div className="mt-3 pt-3 border-t border-forest-800/5 dark:border-white/[0.05] space-y-1.5 text-xs">
                    <div className="flex justify-between text-forest-800/90 dark:text-slate-300">
                      <span>Status Category:</span>
                      <strong className="text-forest-800 dark:text-white font-semibold">{data.category}</strong>
                    </div>
                    <div className="flex justify-between text-muted text-[11px]">
                      <span>Primary Pollutant:</span>
                      <strong className="text-forest-800 dark:text-slate-200 font-mono">{data.primaryPollutant}</strong>
                    </div>
                    <div className="flex justify-between text-muted text-[11px]">
                      <span>PM2.5:</span>
                      <strong className="text-forest-800 dark:text-slate-200 font-mono">{data.pollutants.pm25?.value} µg/m³</strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Link
                  href={`/location/${city.id}?lat=${city.lat}&lng=${city.lng}&name=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-ivory-100 dark:bg-forest-900 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-forest-800/10 dark:border-white/[0.08] text-xs font-semibold transition-all"
                >
                  <span>City Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/compare?cityA=${encodeURIComponent(city.name)}`}
                  className="py-2 px-3 rounded-xl bg-ivory-100 dark:bg-forest-900 hover:bg-ivory-200 text-forest-800 dark:text-slate-300 border border-forest-800/10 dark:border-white/[0.08] text-xs font-semibold transition-all"
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

