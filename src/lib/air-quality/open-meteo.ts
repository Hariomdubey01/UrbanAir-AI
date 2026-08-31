import { CityLocation } from '../types';

export const POPULAR_CITIES: CityLocation[] = [
  { id: 'delhi-in', name: 'Delhi', country: 'India', countryCode: 'IN', lat: 28.6139, lng: 77.2090, population: 32900000 },
  { id: 'tokyo-jp', name: 'Tokyo', country: 'Japan', countryCode: 'JP', lat: 35.6762, lng: 139.6503, population: 37400000 },
  { id: 'london-gb', name: 'London', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lng: -0.1278, population: 8980000 },
  { id: 'new-york-us', name: 'New York', country: 'United States', countryCode: 'US', lat: 40.7128, lng: -74.0060, population: 8468000 },
  { id: 'beijing-cn', name: 'Beijing', country: 'China', countryCode: 'CN', lat: 39.9042, lng: 116.4074, population: 21540000 },
  { id: 'mumbai-in', name: 'Mumbai', country: 'India', countryCode: 'IN', lat: 19.0760, lng: 72.8777, population: 20960000 },
  { id: 'paris-fr', name: 'Paris', country: 'France', countryCode: 'FR', lat: 48.8566, lng: 2.3522, population: 2161000 },
  { id: 'cairo-eg', name: 'Cairo', country: 'Egypt', countryCode: 'EG', lat: 30.0444, lng: 31.2357, population: 10000000 },
  { id: 'sydney-au', name: 'Sydney', country: 'Australia', countryCode: 'AU', lat: -33.8688, lng: 151.2093, population: 5312000 },
  { id: 'sao-paulo-br', name: 'São Paulo', country: 'Brazil', countryCode: 'BR', lat: -23.5505, lng: -46.6333, population: 12330000 },
  { id: 'lagos-ng', name: 'Lagos', country: 'Nigeria', countryCode: 'NG', lat: 6.5244, lng: 3.3792, population: 15388000 },
  { id: 'jakarta-id', name: 'Jakarta', country: 'Indonesia', countryCode: 'ID', lat: -6.2088, lng: 106.8456, population: 10560000 },
];

// In-memory cache for ultra-fast instant responses
const memoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function searchCities(query: string): Promise<CityLocation[]> {
  if (!query || query.trim().length < 2) {
    return POPULAR_CITIES;
  }

  const cacheKey = `search-${query.toLowerCase().trim()}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Geocoding search failed');
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      const filtered = POPULAR_CITIES.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) || 
        c.country.toLowerCase().includes(query.toLowerCase())
      );
      memoryCache.set(cacheKey, { data: filtered, timestamp: Date.now() });
      return filtered;
    }

    const results: CityLocation[] = data.results.map((r: any) => ({
      id: `${r.name.toLowerCase().replace(/\s+/g, '-')}-${r.country_code ? r.country_code.toLowerCase() : 'loc'}-${r.id}`,
      name: r.name,
      country: r.country || r.country_code || 'Unknown',
      countryCode: r.country_code || 'UN',
      lat: r.latitude,
      lng: r.longitude,
      region: r.admin1 || r.admin2,
      population: r.population,
    }));

    memoryCache.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  } catch (error) {
    const filtered = POPULAR_CITIES.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) || 
      c.country.toLowerCase().includes(query.toLowerCase())
    );
    return filtered;
  }
}

export async function fetchRawAirQuality(lat: number, lng: number) {
  const roundedLat = Math.round(lat * 100) / 100;
  const roundedLng = Math.round(lng * 100) / 100;
  const cacheKey = `aq-${roundedLat}-${roundedLng}`;

  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${roundedLat}&longitude=${roundedLng}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&past_days=7&forecast_days=1`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2200);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo Air Quality API error: ${res.statusText}`);
    }
    const data = await res.json();
    memoryCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.warn(`Open-Meteo fetch timed out or failed for ${lat},${lng}, using synthetic fallback`, err);
    // Generate deterministic baseline so the UI never blocks or fails
    const fallback = generateFallbackTelemetry(lat, lng);
    memoryCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    return fallback;
  }
}

function generateFallbackTelemetry(lat: number, lng: number) {
  // Generate consistent pseudo-telemetry based on coordinates
  const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233)) * 1000;
  const baseAQI = 30 + Math.round((seed % 140));
  const pm25 = Math.round(baseAQI * 0.45);
  const pm10 = Math.round(baseAQI * 0.75);
  const no2 = Math.round(15 + (seed % 35));
  const o3 = Math.round(20 + (seed % 40));
  const so2 = Math.round(5 + (seed % 15));
  const co = Math.round(200 + (seed % 400));

  const now = new Date();
  const hourlyTimes: string[] = [];
  const hourlyAQI: number[] = [];
  const hourlyPM25: number[] = [];
  const hourlyPM10: number[] = [];
  const hourlyNO2: number[] = [];
  const hourlyO3: number[] = [];
  const hourlySO2: number[] = [];
  const hourlyCO: number[] = [];

  for (let i = 24; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600 * 1000);
    hourlyTimes.push(t.toISOString().slice(0, 16));
    const noise = Math.sin(i * 0.5) * 15;
    hourlyAQI.push(Math.max(10, Math.round(baseAQI + noise)));
    hourlyPM25.push(Math.max(5, Math.round(pm25 + noise * 0.4)));
    hourlyPM10.push(Math.max(8, Math.round(pm10 + noise * 0.7)));
    hourlyNO2.push(Math.max(5, Math.round(no2 + noise * 0.3)));
    hourlyO3.push(Math.max(10, Math.round(o3 - noise * 0.2)));
    hourlySO2.push(Math.max(2, Math.round(so2 + noise * 0.1)));
    hourlyCO.push(Math.max(100, Math.round(co + noise * 10)));
  }

  return {
    isFallback: true,
    current: {
      time: now.toISOString().slice(0, 16),
      us_aqi: baseAQI,
      pm2_5: pm25,
      pm10: pm10,
      nitrogen_dioxide: no2,
      ozone: o3,
      sulphur_dioxide: so2,
      carbon_monoxide: co,
    },
    hourly: {
      time: hourlyTimes,
      us_aqi: hourlyAQI,
      pm2_5: hourlyPM25,
      pm10: hourlyPM10,
      nitrogen_dioxide: hourlyNO2,
      ozone: hourlyO3,
      sulphur_dioxide: hourlySO2,
      carbon_monoxide: hourlyCO,
    }
  };
}


