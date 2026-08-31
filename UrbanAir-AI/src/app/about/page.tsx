'use client';

import React from 'react';
import Link from 'next/link';
import { Wind, Globe2, ShieldCheck, User, Sparkles, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="pb-4 border-b border-forest-800/10 dark:border-white/[0.08] space-y-1">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">About Platform</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-forest-800 dark:text-white tracking-tight">UrbanAir AI</h1>
        <p className="text-muted text-xs">AI-Powered Urban Air Quality & Community Environmental Intelligence Platform.</p>
      </div>

      {/* Hero Mission */}
      <div className="p-6 sm:p-10 rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] space-y-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">Tagline: Understand Your City's Air.</span>
        <h2 className="text-xl sm:text-2xl font-semibold text-forest-800 dark:text-white">One-Line Description</h2>
        <p className="text-xs sm:text-sm text-forest-800/90 dark:text-slate-200 leading-relaxed max-w-3xl font-normal">
          UrbanAir AI transforms complex air-quality data into understandable environmental insights using AI, helping people explore their city's air and better understand sustainable communities.
        </p>
      </div>

      {/* Target User Persona (§07) */}
      <div className="rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>Target User Persona</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-ivory-100 dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1.5">
            <strong className="text-forest-800 dark:text-white font-semibold text-xs block">Aarav (Age 22, Student)</strong>
            <p className="text-muted">Basic technical knowledge. Wants to understand local air quality without deciphering raw atmospheric chemistry equations.</p>
          </div>

          <div className="p-4 rounded-xl bg-ivory-100 dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1.5">
            <strong className="text-amber-600 dark:text-amber-400 font-semibold text-xs block">Current Frustration</strong>
            <p className="text-muted">"I can see the AQI number online, but I don't really understand what it means or how it impacts my neighborhood."</p>
          </div>

          <div className="p-4 rounded-xl bg-ivory-100 dark:bg-forest-900 border border-forest-800/10 dark:border-white/[0.08] space-y-1.5">
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs block">Desired Experience</strong>
            <p className="text-muted">"I want one place where I can see my city's air quality and ask questions about it in simple, grounded language."</p>
          </div>
        </div>
      </div>

      {/* Final Product Specification */}
      <div className="p-6 sm:p-8 rounded-[20px] bg-white dark:bg-[#0D1B18] border border-forest-800/10 dark:border-white/[0.08] space-y-3 text-xs text-forest-800/90 dark:text-slate-300 leading-relaxed shadow-sm">
        <h2 className="text-base font-semibold text-forest-800 dark:text-white">Product Thesis & Scope</h2>
        <p>
          UrbanAir AI is an urban environmental intelligence platform that combines real-time air-quality telemetry, environmental analytics, trusted knowledge, and contextual AI to help people understand the air around them. The platform transforms complex environmental measurements into clear explanations, comparisons, trends, and educational insights while maintaining transparency, privacy, ethical safeguards, and a clear connection to SDG 11 — Sustainable Cities and Communities.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-sm"
          >
            <span>Explore Live Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}

