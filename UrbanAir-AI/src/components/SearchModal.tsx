'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, X, Loader2, AlertCircle } from 'lucide-react';
import { CityLocation } from '@/lib/types';
import { POPULAR_CITIES } from '@/lib/air-quality/open-meteo';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: CityLocation) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectCity }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>(POPULAR_CITIES);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults(POPULAR_CITIES);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/location/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success && data.results) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleUseMyLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Location access was declined. You can still search any city above.");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc: CityLocation = {
          id: 'current-user-location',
          name: 'My Current Location',
          country: 'Detected via GPS',
          countryCode: 'GPS',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setGeoLoading(false);
        onSelectCity(userLoc);
        onClose();
      },
      (err) => {
        setGeoLoading(false);
        setGeoError("Location access was declined. You can still search any city above.");
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4 bg-forest-800/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-[20px] bg-ivory-100 dark:bg-[#0D1B18] border border-forest-800/15 dark:border-white/[0.08] p-6 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-forest-800/10 dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-base text-forest-800 dark:text-white">Search City Air Quality</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-muted hover:text-forest-800 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search a city, region or country (e.g. Lagos, Jakarta, São Paulo)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-white dark:bg-forest-900 border border-forest-800/15 dark:border-white/[0.08] rounded-xl pl-10 pr-10 py-3 text-sm text-forest-800 dark:text-white placeholder-muted focus:outline-none focus:border-emerald-500"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
          {loading && <Loader2 className="absolute right-3.5 top-3.5 w-4 h-4 text-emerald-500 animate-spin" />}
        </div>

        {/* GPS Location CTA & Error Notice */}
        <div className="space-y-1.5">
          <button
            onClick={handleUseMyLocation}
            disabled={geoLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-semibold transition-all"
          >
            {geoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4 text-emerald-500" />}
            <span>Use My Location</span>
          </button>

          <p className="text-[10px] text-muted text-center px-2 leading-relaxed">
            Location access is used only when you choose to use your current location. Coordinates are used transiently to retrieve environmental data and are not intentionally stored by UrbanAir AI.
          </p>

          {geoError && (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-medium mt-2 px-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{geoError}</span>
            </div>
          )}
        </div>


        {/* Results List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          <div className="text-[10px] font-semibold text-muted uppercase tracking-wider px-1">
            {query.length >= 2 ? 'Search Results' : 'Popular Cities'}
          </div>

          {results.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-white/60 dark:bg-forest-900/60 border border-forest-800/10 dark:border-white/[0.08] space-y-1">
              <p className="text-xs text-forest-800 dark:text-slate-200 font-semibold">
                No match found
              </p>
              <p className="text-xs text-muted">
                Try a city, region or country, e.g. <em>Lagos</em>, <em>Jakarta</em>, or <em>São Paulo</em>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {results.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-forest-900 hover:bg-ivory-200 dark:hover:bg-forest-800 border border-forest-800/10 dark:border-white/[0.08] text-left transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-ivory-100 dark:bg-forest-800 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-muted group-hover:text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-forest-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{city.name}</div>
                    <div className="text-[10px] text-muted">{city.country} {city.region ? `• ${city.region}` : ''}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

