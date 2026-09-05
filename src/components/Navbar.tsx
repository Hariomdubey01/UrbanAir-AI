'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import SearchModal from './SearchModal';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exact mobile drawer order matching prompt §10
  const navLinks = [
    { name: 'Discover', href: '/' },
    { name: 'Cities', href: '/explore' },
    { name: 'Insights', href: '/dashboard' },
    { name: 'AI Advisor', href: '/ai', badge: 'AI' },
    { name: 'Learn', href: '/learn' },
    { name: 'SDG 11', href: '/sdg-11' },
    { name: 'Responsible AI', href: '/responsible-ai' },
    { name: 'Sources', href: '/sources' },
  ];

  const isActive = (path: string) => {
    if (path === '/explore' && (pathname === '/explore' || pathname === '/cities')) return true;
    if (path === '/dashboard' && (pathname === '/dashboard' || pathname === '/insights')) return true;
    if (path === '/ai' && (pathname === '/ai' || pathname === '/advisor' || pathname === '/ai-advisor')) return true;
    if (path === '/sdg-11' && (pathname === '/sdg11' || pathname === '/sdg-11')) return true;
    return pathname === path;
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full pointer-events-none transition-all duration-300 pt-2.5 sm:pt-3 md:pt-3.5 px-3.5 sm:px-6 lg:px-7">
        <div className="max-w-7xl mx-auto w-full">
          <div
            className={`pointer-events-auto h-[74px] sm:h-[78px] px-4 sm:px-6 rounded-[24px] sm:rounded-[26px] border transition-all duration-300 flex items-center justify-between xl:grid xl:grid-cols-[1fr_auto_1fr] ${
              scrolled
                ? 'bg-white/95 dark:bg-[rgba(9,13,22,0.95)] backdrop-blur-xl border-slate-300/80 dark:border-emerald-500/30 shadow-[0_14px_38px_-6px_rgba(0,0,0,0.1),0_4px_14px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_14px_45px_-8px_rgba(0,0,0,0.8),0_0_28px_-4px_rgba(16,185,129,0.2)]'
                : 'bg-white/90 dark:bg-[rgba(9,13,22,0.88)] backdrop-blur-xl border-slate-200/80 dark:border-emerald-500/20 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-8px_rgba(0,0,0,0.7),0_0_22px_-5px_rgba(16,185,129,0.14)]'
            }`}
          >
            {/* Left side: Brand Logo */}
            <div className="flex items-center justify-start flex-shrink-0">
              <Link href="/" className="inline-flex items-center group" aria-label="UrbanAir AI Home">
                <BrandLogo scrolled={scrolled} />
              </Link>
            </div>

            {/* Center: Primary Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center justify-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
                      active
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-[#34d399] font-semibold border border-emerald-500/30 dark:border-emerald-500/20 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm leading-none">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side: Action Controls */}
            <div className="flex items-center justify-end gap-2 sm:gap-2.5 flex-shrink-0">
              {/* Search Modal Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-white/10 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
                title="Search City Air Quality"
                aria-label="Search City Air Quality"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-white/10 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
                )}
              </button>

              {/* Primary CTA Button */}
              <Link
                href="/explore"
                className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 sm:px-5 rounded-full bg-[#10b981] hover:bg-[#34d399] text-[#052e24] font-bold text-xs shadow-[0_4px_16px_-2px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_-2px_rgba(16,185,129,0.45)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
              >
                <span>Explore Cities</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-white/10 transition-all duration-200 shadow-sm active:scale-95"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Slide-in / Dropdown Drawer */}
          {mobileMenuOpen && (
            <div className="xl:hidden mt-2 pointer-events-auto rounded-[22px] bg-white/95 dark:bg-[rgba(9,13,22,0.95)] backdrop-blur-xl border border-slate-200/90 dark:border-emerald-500/25 p-4 space-y-1 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_45px_-8px_rgba(0,0,0,0.85),0_0_24px_-4px_rgba(16,185,129,0.18)]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-[#34d399] border border-emerald-500/30 dark:border-emerald-500/20'
                      : 'text-slate-600 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f8fafc] hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                <Link
                  href="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-full bg-[#10b981] hover:bg-[#34d399] text-[#052e24] text-center shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.95]"
                >
                  <span>Explore Cities</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectCity={(city) => {
          router.push(`/location/${city.id}?lat=${city.lat}&lng=${city.lng}&name=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}`);
        }}
      />
    </>
  );
}


