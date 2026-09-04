'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Sparkles, X, Send, MapPin } from 'lucide-react';

function PersistentAIButtonInner() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Determine if viewing a specific city (Change 5)
  let activeCity = searchParams?.get('name') || searchParams?.get('city') || '';
  const countryParam = searchParams?.get('country') || '';

  if (!activeCity && pathname?.startsWith('/location/')) {
    const slug = pathname.replace('/location/', '').split('/')[0].split('-')[0];
    if (slug) {
      activeCity = slug.charAt(0).toUpperCase() + slug.slice(1);
    }
  }

  const isCityContext = !!activeCity;
  const locationLabel = isCityContext ? `${activeCity}${countryParam ? `, ${countryParam}` : ''}` : null;
  const buttonText = isCityContext ? `Ask about ${activeCity}'s air ✦` : "Ask about your city's air ✦";
  const ariaLabel = isCityContext ? `Ask UrbanAir AI about ${activeCity}'s air` : "Ask UrbanAir AI about your city's air";

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    const targetCity = activeCity ? `&city=${encodeURIComponent(activeCity)}` : '';
    setDrawerOpen(false);
    router.push(`/ai?q=${encodeURIComponent(quickQuery.trim())}${targetCity}`);
  };

  return (
    <>
      {/* Floating Bottom-Right Button (Change 5: Contextual CTA) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#10b981] hover:bg-[#34d399] text-[#090d16] font-bold text-xs shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all group"
          aria-label={ariaLabel}
        >
          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">{buttonText}</span>
          <span className="sm:hidden">{isCityContext ? `${activeCity} AI ✦` : 'AI ✦'}</span>
        </button>
      </div>

      {/* Floating Quick Drawer */}
      {drawerOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 rounded-2xl bg-white dark:bg-[#0c1322]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-5 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Ask UrbanAir AI</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Contextual Environmental Assistant</p>
              </div>
            </div>
            <button onClick={() => setDrawerOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contextual Disclosure String (§26) */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            {isCityContext ? (
              <div>
                Currently viewing: <strong className="text-slate-900 dark:text-white">{locationLabel}</strong> — I can answer questions using its latest available data.
              </div>
            ) : (
              <div>
                Ask about any city's air quality, or search one first for grounded answers.
              </div>
            )}
          </div>

          <form onSubmit={handleQuickAsk} className="flex gap-2">
            <input
              type="text"
              placeholder={isCityContext ? `Ask about ${activeCity}'s air...` : "Ask about any city's air quality..."}
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#10b981] hover:bg-[#34d399] text-[#090d16] font-bold rounded-xl text-xs flex items-center gap-1 transition-all active:scale-95 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-center">
            <Link
              href={isCityContext ? `/ai?city=${encodeURIComponent(activeCity)}` : "/ai"}
              onClick={() => setDrawerOpen(false)}
              className="text-[11px] font-bold text-emerald-600 dark:text-[#34d399] hover:underline inline-flex items-center gap-1"
            >
              <span>Open Full AI Advisor Workspace →</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function PersistentAIButton() {
  return (
    <Suspense fallback={null}>
      <PersistentAIButtonInner />
    </Suspense>
  );
}


