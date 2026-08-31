export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive Groups' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous';


export type AIResponseMode = 'gemini-rag' | 'knowledge-fallback';

export type Pollutant = 'pm25' | 'pm10' | 'no2' | 'o3' | 'so2' | 'co';

export type DataFreshness = 'current' | 'recent' | 'stale' | 'unavailable';

export interface DominantPollutantResult {
  pollutant: string | null;
  label: string;
  determined: boolean;
}

export interface PollutantDetail {
  code: string;
  name: string;
  value: number;
  unit: string;
  status: 'Low' | 'Normal' | 'Elevated' | 'High' | 'Hazardous';
  definition: string;
  healthImpact: string;
  standardLimit: number; // e.g. WHO 24-hr guideline
}

export interface CityLocation {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  region?: string;
  population?: number;
}

/**
 * Concrete schema matching prompt §33
 */
export interface EnvironmentalReading {
  location: string;
  latitude: number;
  longitude: number;
  timestamp: string; // ISO 8601
  aqi: number | null;
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  o3: number | null;
  so2: number | null;
  co: number | null;
  source: string;
  aqiStandard?: string;
}

export interface NormalizedAirQuality {
  location: CityLocation;
  timestamp?: string;
  aqi: number;
  category: AQICategory;

  categoryCode: number; // 1-5
  color: string;
  primaryPollutant: string;
  dominantPollutantResult?: DominantPollutantResult;
  aqiStandard?: string;
  pollutants: {
    pm25?: PollutantDetail;
    pm10?: PollutantDetail;
    no2?: PollutantDetail;
    o3?: PollutantDetail;
    so2?: PollutantDetail;
    co?: PollutantDetail;
  };
  source: string;
  isStale?: boolean;
  isDemo?: boolean;
  isCached?: boolean;
  minutesAgo?: number;
}

export interface HourlyTrendPoint {
  time: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
}

export interface HistoricalTrendData {
  location: CityLocation;
  timeframe: '24h' | '7d' | '30d';
  points: HourlyTrendPoint[];
  summary: {
    averageAQI: number;
    maxAQI: number;
    minAQI: number;
    trendDirection: 'improving' | 'deteriorating' | 'stable';
  };
}

/**
 * Concrete schema matching prompt §31
 */
export interface KnowledgeDocument {
  id: string;
  title: string;
  organization: string;
  topic: string;
  content: string;
  snippet: string;
  source_url: string;
  url?: string;
  published_date: string;
  date?: string;
  retrieved_date: string;
  retrieval_method: string;
}

export interface MeasuredPollutantEntry {
  code: string;
  shortLabel: string;
  fullLabel: string;
  value: number | null;
  unit: string;
  standardLimit?: number;
}

export interface MeasuredDataSnapshot {
  locationName: string;
  aqi: number | null;
  category: string | null;
  aqiStandard: string;
  dominantPollutant: string;
  dominantPollutantDetermined: boolean;
  pollutants: MeasuredPollutantEntry[];
}

export interface DataTrustMetaProps {
  timestamp?: string;
  source?: string;
  aqiStandard?: string;
  isDemo?: boolean;
  isCached?: boolean;
  minutesAgo?: number;
  freshness?: DataFreshness;
}

export interface AIResponseData {
  success: boolean;
  answer: string;
  summary: string;
  mode?: AIResponseMode;
  dataUsed: string[];
  sources: KnowledgeDocument[];
  limitations: string[];
  disclaimer?: string;
  isFallback?: boolean;
  aiTask?: 'Environmental explanation' | 'Comparison' | 'Learning support' | string;
  aqiStandard?: string;
  dominantPollutantResult?: DominantPollutantResult;
  measuredData?: MeasuredDataSnapshot;
  dataTrust?: DataTrustMetaProps;
  sdgContext?: string;
  explainability: {
    locationUsed: string;
    dataUsed?: string[];
    dataSource?: string;
    aqiStandard?: string;
    aiMode?: string;
    metricsEvaluated: Record<string, any>;
    retrievedKnowledgeIds: string[];
    guardrailCheck: string;
    aiTask?: string;
    limitations?: string[];
  };
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  aiResponse?: AIResponseData;
  timestamp: string;
}

