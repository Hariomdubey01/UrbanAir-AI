import { DominantPollutantResult, DataFreshness } from '../types';

/**
 * Canonical Pollutant Definitions (Fix #3)
 * Use throughout Dashboard, Location, AI responses, Comparisons, and Learn modules.
 */
export const POLLUTANTS = {
  pm25: {
    code: 'PM2.5',
    shortLabel: 'PM2.5',
    fullLabel: 'Fine particulate matter',
    unit: 'µg/m³',
    whoLimit: 15,
    description: 'Fine microscopic particles under 2.5 µm that penetrate deep into lung tissue and the bloodstream.',
  },
  pm10: {
    code: 'PM10',
    shortLabel: 'PM10',
    fullLabel: 'Coarse particulate matter',
    unit: 'µg/m³',
    whoLimit: 45,
    description: 'Inhalable coarse particles (2.5–10 µm) from road dust, construction, and mechanical abrasion.',
  },
  no2: {
    code: 'NO₂',
    shortLabel: 'NO₂',
    fullLabel: 'Nitrogen dioxide',
    unit: 'µg/m³',
    whoLimit: 25,
    description: 'Gaseous pollutant generated primarily by motor vehicles, thermal power plants, and industrial combustion.',
  },
  o3: {
    code: 'O₃',
    shortLabel: 'O₃',
    fullLabel: 'Ground-level ozone',
    unit: 'µg/m³',
    whoLimit: 100,
    description: 'Secondary photochemical oxidant formed when NOx and volatile organic compounds react under sunlight.',
  },
  so2: {
    code: 'SO₂',
    shortLabel: 'SO₂',
    fullLabel: 'Sulfur dioxide',
    unit: 'µg/m³',
    whoLimit: 40,
    description: 'Pungent gas emitted from combustion of sulfur-bearing fossil fuels such as coal and crude oil.',
  },
  co: {
    code: 'CO',
    shortLabel: 'CO',
    fullLabel: 'Carbon monoxide',
    unit: 'mg/m³',
    whoLimit: 4,
    description: 'Toxic odorless gas formed from incomplete combustion of carbonaceous fuels in engines and furnaces.',
  },
} as const;

export type PollutantKey = keyof typeof POLLUTANTS;

/**
 * Deterministic Dominant Pollutant Calculator (Fix #2)
 * Calculated mathematically against standard threshold ratios (US EPA / WHO).
 * Gemini is NEVER allowed to guess or override this value.
 */
export function calculateDominantPollutant(
  pollutantValues: Record<string, number | null | undefined>
): DominantPollutantResult {
  const ratios: { code: string; label: string; ratio: number }[] = [];

  const valPM25 = pollutantValues.pm25 ?? pollutantValues['pm2_5'] ?? pollutantValues['PM2.5'];
  const valPM10 = pollutantValues.pm10 ?? pollutantValues['PM10'];
  const valNO2 = pollutantValues.no2 ?? pollutantValues['nitrogen_dioxide'] ?? pollutantValues['NO2'] ?? pollutantValues['NO₂'];
  const valO3 = pollutantValues.o3 ?? pollutantValues['ozone'] ?? pollutantValues['O3'] ?? pollutantValues['O₃'];
  const valSO2 = pollutantValues.so2 ?? pollutantValues['sulphur_dioxide'] ?? pollutantValues['SO2'] ?? pollutantValues['SO₂'];
  const valCO = pollutantValues.co ?? pollutantValues['carbon_monoxide'] ?? pollutantValues['CO'];

  if (typeof valPM25 === 'number' && !isNaN(valPM25) && valPM25 > 0) {
    ratios.push({ code: 'PM2.5', label: 'PM2.5', ratio: valPM25 / POLLUTANTS.pm25.whoLimit });
  }
  if (typeof valPM10 === 'number' && !isNaN(valPM10) && valPM10 > 0) {
    ratios.push({ code: 'PM10', label: 'PM10', ratio: valPM10 / POLLUTANTS.pm10.whoLimit });
  }
  if (typeof valNO2 === 'number' && !isNaN(valNO2) && valNO2 > 0) {
    ratios.push({ code: 'NO₂', label: 'NO₂', ratio: valNO2 / POLLUTANTS.no2.whoLimit });
  }
  if (typeof valO3 === 'number' && !isNaN(valO3) && valO3 > 0) {
    ratios.push({ code: 'O₃', label: 'O₃', ratio: valO3 / POLLUTANTS.o3.whoLimit });
  }
  if (typeof valSO2 === 'number' && !isNaN(valSO2) && valSO2 > 0) {
    ratios.push({ code: 'SO₂', label: 'SO₂', ratio: valSO2 / POLLUTANTS.so2.whoLimit });
  }
  if (typeof valCO === 'number' && !isNaN(valCO) && valCO > 0) {
    ratios.push({ code: 'CO', label: 'CO', ratio: valCO / POLLUTANTS.co.whoLimit });
  }

  if (ratios.length === 0) {
    return {
      pollutant: null,
      label: 'Not determined',
      determined: false,
    };
  }

  // Sort descending by highest threshold ratio
  ratios.sort((a, b) => b.ratio - a.ratio);
  const highest = ratios[0];

  return {
    pollutant: highest.code,
    label: highest.label,
    determined: true,
  };
}

/**
 * Deterministic Data Freshness Calculator (Fix #6)
 * < 1 hour: current
 * 1–6 hours: recent
 * > 6 hours: stale
 */
export function calculateDataFreshness(
  timestamp?: string,
  explicitMinutesAgo?: number
): { freshness: DataFreshness; minutesAgo: number; label: string } {
  if (typeof explicitMinutesAgo === 'number') {
    if (explicitMinutesAgo < 60) {
      return { freshness: 'current', minutesAgo: explicitMinutesAgo, label: 'Current' };
    }
    if (explicitMinutesAgo <= 360) {
      return { freshness: 'recent', minutesAgo: explicitMinutesAgo, label: 'Recent' };
    }
    return { freshness: 'stale', minutesAgo: explicitMinutesAgo, label: 'Stale' };
  }

  if (!timestamp) {
    return { freshness: 'unavailable', minutesAgo: 0, label: 'Timestamp unavailable' };
  }

  try {
    const readingTime = new Date(timestamp).getTime();
    const now = Date.now();
    const diffMs = Math.max(0, now - readingTime);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
      return { freshness: 'current', minutesAgo: diffMinutes || 8, label: 'Current' };
    }
    if (diffMinutes <= 360) {
      return { freshness: 'recent', minutesAgo: diffMinutes, label: 'Recent' };
    }
    return { freshness: 'stale', minutesAgo: diffMinutes, label: 'Stale' };
  } catch (err) {
    return { freshness: 'unavailable', minutesAgo: 0, label: 'Timestamp unavailable' };
  }
}

/**

 * Format relative time dynamically (deterministic calculation)
 */
export function formatRelativeTime(timestamp?: string, explicitMinutesAgo?: number): string {
  if (typeof explicitMinutesAgo === 'number') {
    if (explicitMinutesAgo < 2) return 'Updated just now';
    if (explicitMinutesAgo < 60) return `Updated ${explicitMinutesAgo} minutes ago`;
    const hours = Math.floor(explicitMinutesAgo / 60);
    if (hours < 24) return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Updated yesterday';
  }

  if (!timestamp) return 'Update time unavailable';

  try {
    const readingTime = new Date(timestamp).getTime();
    const now = Date.now();
    const diffMs = Math.max(0, now - readingTime);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 2) return 'Updated just now';
    if (diffMinutes < 60) return `Updated ${diffMinutes} minutes ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Updated ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Updated yesterday';
  } catch (err) {
    return 'Update time unavailable';
  }
}

export interface FreshnessInfo {

  status: 'current' | 'recent' | 'stale' | 'unavailable' | 'demo';
  label: string;
  badgeLabel: string;
  isStale: boolean;
  isRecent: boolean;
  isCurrent: boolean;
  isDemo: boolean;
  isCached: boolean;
  minutesAgo: number;
  relativeTime: string;
  warning?: string;
}

/**
 * Deterministic Data Freshness Calculator (Hero Trust & Freshness System)
 * < 1 hour: "Current" ("Current environmental data")
 * 1–6 hours: "Recent" ("Latest available reading")
 * > 6 hours: "Stale" ("Stale environmental data" + warning)
 * Unavailable: "Data freshness unavailable"
 */
export function getDataFreshness(params?: {
  timestamp?: string;
  explicitMinutesAgo?: number;
  isDemo?: boolean;
  isCached?: boolean;
}): FreshnessInfo {
  const isDemo = params?.isDemo || false;
  const isCached = params?.isCached || false;
  const timestamp = params?.timestamp;
  const explicitMinutesAgo = params?.explicitMinutesAgo;

  if (isDemo) {
    return {
      status: 'demo',
      label: 'Demonstration values — not live environmental measurements.',
      badgeLabel: 'DEMO DATA',
      isStale: false,
      isRecent: false,
      isCurrent: false,
      isDemo: true,
      isCached: false,
      minutesAgo: 0,
      relativeTime: 'Demo snapshot',
    };
  }

  const { freshness, minutesAgo } = calculateDataFreshness(timestamp, explicitMinutesAgo);
  const relativeTime = formatRelativeTime(timestamp, explicitMinutesAgo);

  if (freshness === 'stale') {
    return {
      status: 'stale',
      label: 'Stale environmental data',
      badgeLabel: '● Stale environmental data',
      isStale: true,
      isRecent: false,
      isCurrent: false,
      isDemo: false,
      isCached,
      minutesAgo,
      relativeTime,
      warning: 'This reading may not represent current conditions.',
    };
  }

  if (freshness === 'recent') {
    return {
      status: 'recent',
      label: 'Latest available reading',
      badgeLabel: '● Latest available reading',
      isStale: false,
      isRecent: true,
      isCurrent: false,
      isDemo: false,
      isCached,
      minutesAgo,
      relativeTime,
    };
  }

  if (freshness === 'current') {
    return {
      status: 'current',
      label: 'Current environmental data',
      badgeLabel: isCached ? '● Latest available reading' : '● Current environmental data',
      isStale: false,
      isRecent: false,
      isCurrent: true,
      isDemo: false,
      isCached,
      minutesAgo,
      relativeTime,
    };
  }

  return {
    status: 'unavailable',
    label: 'Data freshness unavailable',
    badgeLabel: '● Data freshness unavailable',
    isStale: false,
    isRecent: false,
    isCurrent: false,
    isDemo: false,
    isCached: false,
    minutesAgo: 0,
    relativeTime: 'Update time unavailable',
  };
}


