import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import PersistentAIButton from '@/components/PersistentAIButton';

const inter = Inter({ subsets: ['latin'] });

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-bg-base dark:bg-bg-base-dark text-text-primary dark:text-slate-100 transition-colors duration-200`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <PersistentAIButton />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

