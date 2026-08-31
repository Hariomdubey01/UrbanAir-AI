'use client';

import React, { useState } from 'react';
import { MapPin, Compass, Globe, Sparkles, AlertCircle } from 'lucide-react';

interface CityMapProps {
  name: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
  color: string;
  category: string;
  isStale?: boolean;
}

export default function CityMap({
  name,
  country,
  lat,
  lng,
  aqi,
  color,
  category,
  isStale = false,
}: CityMapProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] p-5 space-y-3 shadow-sm">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-forest-800 dark:text-white">
          <Globe className="w-4 h-4 text-teal-500" />
          <span>Spatial Sensor Grid</span>
        </div>
        <div className="flex items-center gap-2 text-muted font-mono text-[11px]">
          <span>LAT: {lat.toFixed(2)}°</span>
          <span>LNG: {lng.toFixed(2)}°</span>
        </div>
      </div>

      {/* SVG Interactive Graphic Canvas */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-48 sm:h-52 rounded-xl bg-ivory-100 dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] overflow-hidden flex items-center justify-center cursor-pointer transition-all"
      >
        {/* Geographic Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #2C9C98 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Concentric Signal Rings */}
        <div className="absolute w-32 h-32 rounded-full border border-teal-500/20 animate-ping opacity-25" />
        <div className="absolute w-52 h-52 rounded-full border border-emerald-500/10" />

        {/* Center Glowing City Node Pin with Marker States (§20) */}
        <div className="relative z-10 flex flex-col items-center space-y-2">
          <div className="relative">
            {/* Base Marker Node: Teal Dot with optional Indigo Ring when hovered (§20) */}
            <div 
              className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-all ${
                isHovered
                  ? 'ring-4 ring-ai-500/50 bg-teal-500/20'
                  : 'ring-2 ring-emerald-500/30 bg-teal-500/10'
              }`}
              style={{ border: `2px solid #20A86B` }}
            >
              <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>

            {/* Stale Data Marker: Small amber corner flag (§20) */}
            {isStale && (
              <span
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border border-white dark:border-forest-900 flex items-center justify-center"
                title="Stale Telemetry Flag"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </span>
            )}
          </div>

          <div className="text-center bg-white/95 dark:bg-forest-800/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-forest-800/10 dark:border-white/[0.08] shadow-sm space-y-0.5">
            <h4 className="font-semibold text-xs text-forest-800 dark:text-white">{name}, {country}</h4>
            <div className="flex items-center justify-center gap-1.5 text-[10px]">
              <span className="font-mono tabular-nums font-bold" style={{ color }}>AQI {aqi}</span>
              <span className="text-muted">·</span>
              <span className="font-medium text-muted">{category}</span>
            </div>
          </div>
        </div>

        {/* Compass / Source Footer */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 dark:bg-forest-800/80 border border-forest-800/10 dark:border-white/[0.08] text-[10px] text-muted font-mono">
          <Compass className="w-3 h-3 text-teal-500" />
          <span>Open-Meteo Grid</span>
        </div>
      </div>
    </div>
  );
}

