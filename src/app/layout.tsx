import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import PersistentAIButton from '@/components/PersistentAIButton';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "UrbanAir AI — Understand Your City's Air",
  description: "Live air quality telemetry explained with AI-powered insights grounded in WHO, EPA, and UN SDG 11 guidance. Turning complex data into clear environmental intelligence.",
  keywords: ["UrbanAir AI", "Air Quality", "AQI", "PM2.5", "Living City", "SDG 11", "Environmental Intelligence", "WHO Guidelines", "Clean Air"],
  authors: [{ name: "UrbanAir AI Team" }],
  openGraph: {
    title: "UrbanAir AI — Understand Your City's Air",
    description: "UrbanAir AI turns complex air-quality data into clear environmental insights, helping communities understand the air around them under SDG 11.",
    siteName: "UrbanAir AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UrbanAir AI — Understand Your City's Air",
    description: "Live air quality telemetry and grounded AI explanations for sustainable cities (SDG 11).",
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
  verification: {
    google: 'En8YtG5yCo-vql8lid4p76IKmCV-6QRzZlAoMZRvenw',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth dark ${plusJakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#090d16] text-slate-800 dark:text-[#cbd5e1] font-sans antialiased selection:bg-[#10b981] selection:text-[#090d16] relative overflow-x-hidden transition-colors duration-300">
        {/* Global Canvas Ambient Layers (§1, §2, §3, §4, §5) */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {/* Subtle Technical Grid (§5) */}
          <div className="absolute inset-0 bg-grid-pattern opacity-25 dark:opacity-60 transition-opacity duration-300" />
          {/* Radial Emerald Spotlight (§2) */}
          <div className="absolute inset-0 radial-emerald-spotlight opacity-30 dark:opacity-100 transition-opacity duration-300" />
          {/* Ambient Emerald Glow (§3) */}
          <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 ambient-emerald-glow opacity-5 dark:opacity-10 animate-ambient-slow transition-opacity duration-300" />
          {/* Secondary Amber Atmosphere (§4) */}
          <div className="absolute top-[40%] -right-24 ambient-amber-glow opacity-5 dark:opacity-10 animate-ambient-slow transition-opacity duration-300" />
        </div>

        <ThemeProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <PersistentAIButton />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


