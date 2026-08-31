import { AQICategory, CityLocation, HistoricalTrendData, HourlyTrendPoint, NormalizedAirQuality, PollutantDetail } from '../types';
import { calculateDominantPollutant, POLLUTANTS } from './pollutants';

export function determineAQICategory(aqi: number): { category: AQICategory; code: number; color: string } {
  if (typeof aqi !== 'number' || isNaN(aqi) || aqi < 0) {
    return { category: 'Good', code: 1, color: '#10b981' };
  }
  if (aqi <= 50) {
    return { category: 'Good', code: 1, color: '#10b981' };
  } else if (aqi <= 100) {
    return { category: 'Moderate', code: 2, color: '#f59e0b' };
  } else if (aqi <= 150) {
    return { category: 'Unhealthy for Sensitive Groups', code: 3, color: '#f97316' };
  } else if (aqi <= 200) {
    return { category: 'Unhealthy', code: 4, color: '#ef4444' };
  } else if (aqi <= 300) {
    return { category: 'Very Unhealthy', code: 5, color: '#8b5cf6' };
  } else {
    return { category: 'Hazardous', code: 6, color: '#881337' };
  }
}


export function getAQICategory(aqi: number): { category: AQICategory; code: number; color: string; standard: string } {
  const res = determineAQICategory(aqi);
  return {
    ...res,
    standard: 'US EPA AQI',
  };
}

export function calculateAQI(raw: any): { aqi: number; category: AQICategory; code: number; color: string; standard: string } {
  const current = raw?.current || raw || {};
  const aqi = Math.round(current.us_aqi ?? current.aqi ?? current.european_aqi ?? 45);
  const cat = getAQICategory(aqi);
  return {
    aqi,
    category: cat.category,
    code: cat.code,
    color: cat.color,
    standard: 'US EPA AQI',
  };
}


export function normalizeAirQuality(raw: any, location: CityLocation): NormalizedAirQuality {
  const current = raw.current || {};
  const currentUnits = raw.current_units || {};

  const usAqi = Math.round(current.us_aqi ?? current.european_aqi ?? 45);
  const { category, code, color } = determineAQICategory(usAqi);

  const pm25Val = current.pm2_5 !== undefined ? Number(current.pm2_5.toFixed(1)) : 12.4;
  const pm10Val = current.pm10 !== undefined ? Number(current.pm10.toFixed(1)) : 28.5;
  const no2Val = current.nitrogen_dioxide !== undefined ? Number(current.nitrogen_dioxide.toFixed(1)) : 18.2;
  const o3Val = current.ozone !== undefined ? Number(current.ozone.toFixed(1)) : 42.0;
  const so2Val = current.sulphur_dioxide !== undefined ? Number(current.sulphur_dioxide.toFixed(1)) : 5.1;
  const coVal = current.carbon_monoxide !== undefined ? Number((current.carbon_monoxide / 1000).toFixed(2)) : 0.35; // mg/m³

  const pollutants: NormalizedAirQuality['pollutants'] = {
    pm25: {
      code: POLLUTANTS.pm25.code,
      name: POLLUTANTS.pm25.fullLabel,
      value: pm25Val,
      unit: POLLUTANTS.pm25.unit,
      status: pm25Val <= 15 ? 'Low' : pm25Val <= 35 ? 'Normal' : pm25Val <= 75 ? 'Elevated' : 'High',
      definition: POLLUTANTS.pm25.description,
      healthImpact: pm25Val > 35 ? 'May cause irritation, coughing, and exacerbation of respiratory conditions.' : 'Air quality is considered satisfactory with minimal risk.',
      standardLimit: POLLUTANTS.pm25.whoLimit,
    },
    pm10: {
      code: POLLUTANTS.pm10.code,
      name: POLLUTANTS.pm10.fullLabel,
      value: pm10Val,
      unit: POLLUTANTS.pm10.unit,
      status: pm10Val <= 45 ? 'Low' : pm10Val <= 100 ? 'Normal' : pm10Val <= 180 ? 'Elevated' : 'High',
      definition: POLLUTANTS.pm10.description,
      healthImpact: pm10Val > 100 ? 'Can irritate eyes, nose, and throat.' : 'Low risk to general public.',
      standardLimit: POLLUTANTS.pm10.whoLimit,
    },
    no2: {
      code: POLLUTANTS.no2.code,
      name: POLLUTANTS.no2.fullLabel,
      value: no2Val,
      unit: POLLUTANTS.no2.unit,
      status: no2Val <= 25 ? 'Low' : no2Val <= 50 ? 'Normal' : no2Val <= 100 ? 'Elevated' : 'High',
      definition: POLLUTANTS.no2.description,
      healthImpact: no2Val > 50 ? 'Increased likelihood of respiratory infections and airway inflammation.' : 'Acceptable levels for ambient outdoor air.',
      standardLimit: POLLUTANTS.no2.whoLimit,
    },
    o3: {
      code: POLLUTANTS.o3.code,
      name: POLLUTANTS.o3.fullLabel,
      value: o3Val,
      unit: POLLUTANTS.o3.unit,
      status: o3Val <= 60 ? 'Low' : o3Val <= 100 ? 'Normal' : o3Val <= 140 ? 'Elevated' : 'High',
      definition: POLLUTANTS.o3.description,
      healthImpact: o3Val > 100 ? 'Can trigger shortness of breath and chest tightness during outdoor exercise.' : 'Unlikely to affect healthy individuals.',
      standardLimit: POLLUTANTS.o3.whoLimit,
    },
    so2: {
      code: POLLUTANTS.so2.code,
      name: POLLUTANTS.so2.fullLabel,
      value: so2Val,
      unit: POLLUTANTS.so2.unit,
      status: so2Val <= 40 ? 'Low' : so2Val <= 80 ? 'Normal' : 'Elevated',
      definition: POLLUTANTS.so2.description,
      healthImpact: 'Can affect breathing, particularly during intense physical exertion.',
      standardLimit: POLLUTANTS.so2.whoLimit,
    },
    co: {
      code: POLLUTANTS.co.code,
      name: POLLUTANTS.co.fullLabel,
      value: coVal,
      unit: POLLUTANTS.co.unit,
      status: coVal <= 4 ? 'Low' : coVal <= 9 ? 'Normal' : 'Elevated',
      definition: POLLUTANTS.co.description,
      healthImpact: 'Reduces oxygen delivery to the body organs.',
      standardLimit: POLLUTANTS.co.whoLimit,
    },
  };

  // Deterministically calculate dominant pollutant (Fix #2)
  const dominantResult = calculateDominantPollutant({
    pm25: pm25Val,
    pm10: pm10Val,
    no2: no2Val,
    o3: o3Val,
    so2: so2Val,
    co: coVal,
  });

  const isFallback = Boolean(raw.isFallback);
  const rawTime = current.time;
  const normalizedTimestamp = rawTime 
    ? (rawTime.endsWith('Z') || rawTime.includes('+') ? rawTime : `${rawTime}:00Z`)
    : undefined;

  return {
    location,
    timestamp: normalizedTimestamp,
    aqi: usAqi,
    category,
    categoryCode: code,
    color,
    primaryPollutant: dominantResult.label,
    dominantPollutantResult: dominantResult,
    aqiStandard: 'US EPA AQI',
    pollutants,
    source: isFallback ? 'Estimated Baselines' : 'Open-Meteo',
    isDemo: isFallback,
  };
}


export function normalizeHistoricalData(raw: any, location: CityLocation, timeframe: '24h' | '7d' | '30d' = '24h'): HistoricalTrendData {
  const hourly = raw.hourly || {};
  const times: string[] = hourly.time || [];
  const aqis: number[] = hourly.us_aqi || [];
  const pm25s: number[] = hourly.pm2_5 || [];
  const pm10s: number[] = hourly.pm10 || [];
  const no2s: number[] = hourly.nitrogen_dioxide || [];
  const o3s: number[] = hourly.ozone || [];

  const totalPoints = times.length;
  let sliceCount = 24;
  if (timeframe === '7d') sliceCount = 24 * 7;
  if (timeframe === '30d') sliceCount = totalPoints;

  const startIndex = Math.max(0, totalPoints - sliceCount);
  const points: HourlyTrendPoint[] = [];

  for (let i = startIndex; i < totalPoints; i++) {
    const rawTime = times[i];
    const dateObj = new Date(rawTime);
    const formattedTime = timeframe === '24h' 
      ? `${String(dateObj.getHours()).padStart(2, '0')}:00`
      : `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${String(dateObj.getHours()).padStart(2, '0')}:00`;


    points.push({
      time: formattedTime,
      aqi: Math.round(aqis[i] ?? 45),
      pm25: Number((pm25s[i] ?? 12).toFixed(1)),
      pm10: Number((pm10s[i] ?? 25).toFixed(1)),
      no2: Number((no2s[i] ?? 18).toFixed(1)),
      o3: Number((o3s[i] ?? 40).toFixed(1)),
    });
  }

  const validAqis = points.map(p => p.aqi);
  const avgAQI = validAqis.length ? Math.round(validAqis.reduce((a, b) => a + b, 0) / validAqis.length) : 50;
  const maxAQI = validAqis.length ? Math.max(...validAqis) : 50;
  const minAQI = validAqis.length ? Math.min(...validAqis) : 50;

  const firstHalfAvg = validAqis.slice(0, Math.floor(validAqis.length / 2)).reduce((a, b) => a + b, 0) / (validAqis.length / 2 || 1);
  const secondHalfAvg = validAqis.slice(Math.floor(validAqis.length / 2)).reduce((a, b) => a + b, 0) / (validAqis.length / 2 || 1);

  let direction: 'improving' | 'deteriorating' | 'stable' = 'stable';
  if (secondHalfAvg < firstHalfAvg - 5) direction = 'improving';
  else if (secondHalfAvg > firstHalfAvg + 5) direction = 'deteriorating';

  return {
    location,
    timeframe,
    points,
    summary: {
      averageAQI: avgAQI,
      maxAQI: maxAQI,
      minAQI: minAQI,
      trendDirection: direction,
    },
  };
}
