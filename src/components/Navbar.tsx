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
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-[rgba(248,250,252,0.92)] dark:bg-[rgba(9,13,22,0.85)] backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm dark:shadow-black/20'
            : 'bg-[rgba(248,250,252,0.85)] dark:bg-[rgba(9,13,22,0.72)] backdrop-blur-md border-b border-slate-200/80 dark:border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 transition-all">
            
            {/* Brand Logo Spec §09: Single vertical bar with 2 curved airflow lines + signal dot */}
            <Link href="/" className="inline-flex items-center group" aria-label="UrbanAir AI Home">
              <BrandLogo scrolled={scrolled} />
            </Link>

            {/* Desktop Navigation Links (§12) */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-[#34d399] font-semibold border border-emerald-500/30 dark:border-emerald-500/20'
                        : 'text-slate-600 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f8fafc] hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500 text-white ml-0.5">
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
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-[#94a3b8] dark:hover:text-[#f8fafc] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] transition-colors"
                title="Search City Air Quality"
                aria-label="Search City Air Quality"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
                )}
              </button>

              <Link
                href="/explore"
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-2xl bg-[#10b981] hover:bg-[#34d399] text-[#052e24] shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.95]"
              >
                <span>Explore Cities</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                aria-label="Toggle theme"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Slide-in Drawer with exact order matching §10 */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-slate-50/95 dark:bg-[#090d16]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-4 pt-3 pb-6 space-y-1 shadow-2xl">
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
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500 text-white font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10">
              <Link
                href="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-2xl bg-[#10b981] hover:bg-[#34d399] text-[#052e24] text-center shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.95]"
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


