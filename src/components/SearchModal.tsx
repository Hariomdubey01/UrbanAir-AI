'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, Navigation, X, Loader2, AlertCircle } from 'lucide-react';
import { CityLocation } from '@/lib/types';
import { POPULAR_CITIES } from '@/lib/air-quality/open-meteo';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: CityLocation) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectCity }: SearchModalProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>(POPULAR_CITIES);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and focus input when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(focusTimer);
    } else {
      document.body.style.overflow = '';
      setGeoError(null);
    }
  }, [isOpen]);

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults(POPULAR_CITIES);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/location/search?q=${encodeURIComponent(query.trim())}`);
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
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGeoError("Location access is not supported by your browser. You can still search any city above.");
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
        if (err.code === 1) {
          setGeoError("Location access was declined. You can still search any city above.");
        } else if (err.code === 3) {
          setGeoError("Location request timed out. You can still search any city above.");
        } else {
          setGeoError("Location access was declined. You can still search any city above.");
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative z-[9991] w-[calc(100vw-24px)] sm:w-[min(720px,calc(100vw-32px))] max-h-[calc(100dvh-24px)] sm:max-h-[calc(100dvh-32px)] flex flex-col rounded-2xl bg-white dark:bg-[#0c1322]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-modal-in"
      >
        {/* Header - Stays fixed inside modal shell */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
              Search City Air Quality
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors active:scale-95"
            aria-label="Close search modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Area - Stays fixed inside modal shell */}
        <div className="px-5 sm:px-6 pt-4 pb-2 space-y-3 shrink-0">
          {/* Input Bar */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search a city, region or country (e.g. Lagos, Jakarta, São Paulo)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            {loading && (
              <Loader2 className="absolute right-3.5 top-3.5 w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin pointer-events-none" />
            )}
          </div>

          {/* GPS Location CTA & Privacy Notice */}
          <div className="space-y-1.5">
            <button
              onClick={handleUseMyLocation}
              disabled={geoLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-800 dark:bg-slate-900/90 dark:hover:bg-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/40 text-xs font-semibold transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
            >
              {geoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
              <span>Use My Location</span>
            </button>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center px-2 leading-relaxed">
              Location access is used only when you choose to use your current location. Coordinates are used transiently to retrieve environmental data and are not intentionally stored by UrbanAir AI.
            </p>

            {geoError && (
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-xs font-medium px-2 py-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{geoError}</span>
              </div>
            )}
          </div>

          {/* List Section Heading */}
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 pt-1">
            {query.trim().length >= 2 ? 'Search Results' : 'Popular Cities'}
          </div>
        </div>

        {/* Scrollable Cities Area - Only this area scrolls internally */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 sm:px-6 pb-5 pt-1 city-scroll">
          {results.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
              <p className="text-xs text-slate-900 dark:text-slate-200 font-semibold">
                No match found
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Try a city, region or country, e.g. <em>Lagos</em>, <em>Jakarta</em>, or <em>São Paulo</em>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {results.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 dark:bg-slate-900/70 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 text-left transition-all duration-150 group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-200/70 dark:bg-slate-950 flex items-center justify-center border border-slate-300/40 dark:border-white/5 group-hover:bg-emerald-500/15 group-hover:border-emerald-500/30 transition-colors shrink-0">
                    <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {city.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {city.country} {city.region ? `• ${city.region}` : ''}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

