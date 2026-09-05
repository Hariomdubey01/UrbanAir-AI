import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Globe, ExternalLink } from 'lucide-react';
import { MEDICAL_REFUSAL } from '@/lib/ai/guardrails';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-slate-100/90 dark:bg-[#070b12]/90 backdrop-blur-md border-t border-slate-200 dark:border-white/10 pt-12 pb-10 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-200 dark:border-white/10">
          
          {/* Brand & SDG 11 Alignment */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center group" aria-label="UrbanAir AI Home">
              <BrandLogo />
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              Understand your city's air. UrbanAir AI transforms environmental data into clear human insights, supporting sustainable cities under UN SDG 11.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-200/80 dark:bg-slate-900/80 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Supports <strong className="text-slate-900 dark:text-white">UN SDG Target 11.6</strong></span>
            </div>
          </div>

          {/* Discover Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2.5">Discover</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-emerald-600 dark:hover:text-[#34d399] transition-colors">Home & Living City</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-[#34d399] transition-colors">City Air Dashboard</Link></li>
              <li><Link href="/explore" className="hover:text-emerald-600 dark:hover:text-[#34d399] transition-colors">Explore Global Cities</Link></li>
              <li><Link href="/compare" className="hover:text-emerald-600 dark:hover:text-[#34d399] transition-colors">Side-by-Side Comparison</Link></li>
              <li><Link href="/ai" className="hover:text-emerald-600 dark:hover:text-[#34d399] transition-colors">Ask UrbanAir AI</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2.5">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/learn" className="hover:text-emerald-600 dark:hover:text-[#34d399] transition-colors">Air Quality 101</Link></li>
              <li><Link href="/sdg11" className="hover:text-emerald-600 dark:hover:text-[#34d399] transition-colors">SDG 11 Story & Target 11.6</Link></li>
              <li><Link href="/responsible-ai" className="hover:text-emerald-600 dark:hover:text-[#34d399] transition-colors">Responsible AI Principles</Link></li>
              <li><Link href="/sources" className="hover:text-emerald-600 dark:hover:text-[#34d399] transition-colors">Verified RAG Sources</Link></li>
              <li><Link href="/how-it-works" className="hover:text-emerald-600 dark:hover:text-[#34d399] transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Environmental Streams */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2.5">Environmental Data</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">Open-Meteo Air API <ExternalLink className="w-3 h-3 opacity-60" /></li>
              <li className="flex items-center gap-1.5">WHO Air Quality 2021 <ExternalLink className="w-3 h-3 opacity-60" /></li>
              <li className="flex items-center gap-1.5">US EPA AQI Standards <ExternalLink className="w-3 h-3 opacity-60" /></li>
              <li className="flex items-center gap-1.5">UN SDG Target 11.6 <ExternalLink className="w-3 h-3 opacity-60" /></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-300/60 dark:border-amber-500/20 max-w-2xl">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-amber-900 dark:text-amber-200">Medical Disclaimer:</strong> {MEDICAL_REFUSAL}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 text-[11px] text-slate-500 dark:text-slate-500 font-mono shrink-0">
            <span>Privacy: Local theme preferences only (No PII stored)</span>
            <span className="hidden sm:inline">·</span>
            <span>© {new Date().getFullYear()} UrbanAir AI</span>
            <span className="hidden sm:inline">·</span>
            <span>
              Made by{' '}
              <a
                href="https://www.linkedin.com/in/itzhariomdubey"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gradient-emerald hover:opacity-85 transition-opacity inline-block"
                aria-label="Hariom Dubey on LinkedIn"
              >
                Hariom Dubey
              </a>
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}

