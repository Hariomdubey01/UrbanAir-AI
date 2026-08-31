'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import SearchModal from './SearchModal';

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
    if (path === '/ai' && (pathname === '/ai' || pathname === '/advisor')) return true;
    if (path === '/sdg-11' && (pathname === '/sdg11' || pathname === '/sdg-11')) return true;
    return pathname === path;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-ivory-100/85 dark:bg-forest-900/85 backdrop-blur-md border-b border-forest-800/10 dark:border-white/[0.08] shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 transition-all">
            
            {/* Brand Logo Spec §09: Single vertical bar with 2 curved airflow lines + signal dot */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className={`transition-all duration-200 rounded-xl bg-forest-800 dark:bg-ivory-100 text-white dark:text-forest-800 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 ${
                  scrolled ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-7 h-7 sm:w-8 sm:h-8'
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {/* City vertical building silhouette bar */}
                  <rect x="9" y="3" width="6" height="18" rx="1.5" className="fill-current text-emerald-500 stroke-none" />
                  {/* Airflow curve 1 with signal dot */}
                  <path d="M3 8.5 Q9 6 15 8.5 T21 8.5" stroke="#2C9C98" strokeWidth="2" />
                  <circle cx="21" cy="8.5" r="1.5" className="fill-current text-ai-500" />
                  {/* Airflow curve 2 */}
                  <path d="M3 15.5 Q10 17.5 16 15.5 T21 15.5" stroke="#20A86B" strokeWidth="1.8" />
                </svg>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-semibold text-lg text-forest-800 dark:text-ivory-100 tracking-tight">
                  UrbanAir
                </span>
                <span className="font-normal text-sm text-forest-800/70 dark:text-ivory-100/70">
                  AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/20'
                        : 'text-forest-800/80 dark:text-slate-300 hover:text-forest-800 dark:hover:text-white hover:bg-ivory-200/60 dark:hover:bg-forest-800/60'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-ai-500 text-white ml-0.5">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Bar */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* Search Modal Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 rounded-xl text-forest-800/70 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-ivory-200/60 dark:hover:bg-forest-800 transition-colors"
                title="Search City Air Quality"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-forest-800/70 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-ivory-200/60 dark:hover:bg-forest-800 transition-colors"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Warm Ivory'} Theme`}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>

              <Link
                href="/explore"
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all"
              >
                <span>Explore Cities</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 rounded-xl text-forest-800 dark:text-slate-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-forest-800 dark:text-slate-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-forest-800 dark:text-slate-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Slide-in Drawer with exact order matching §10 */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-ivory-100 dark:bg-forest-900 border-b border-ivory-300 dark:border-forest-700 px-4 pt-3 pb-6 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive(link.href)
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'text-forest-800 dark:text-slate-200 hover:bg-ivory-200 dark:hover:bg-forest-800'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-ai-500 text-white font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-3 border-t border-ivory-300 dark:border-forest-700">
              <Link
                href="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl bg-emerald-500 text-white text-center shadow-sm"
              >
                Explore Cities
              </Link>
            </div>
          </div>
        )}
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


