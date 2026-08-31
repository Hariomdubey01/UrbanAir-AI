import { POPULAR_CITIES } from '../air-quality/open-meteo';

export type AgentIntent =
  | 'CURRENT_AIR_QUALITY'
  | 'POLLUTANT_EXPLANATION'
  | 'AQI_EXPLANATION'
  | 'POLLUTANT_ANALYSIS'
  | 'TREND_ANALYSIS'
  | 'CITY_COMPARISON'
  | 'ENVIRONMENTAL_EDUCATION'
  | 'SDG_11'
  | 'GENERAL_ENVIRONMENTAL'
  | 'MEDICAL_REQUEST'
  | 'OFF_TOPIC';

export interface ExtractedIntent {
  intent: AgentIntent;
  extractedLocationNames: string[];
  primaryPollutantMentioned?: string;
  requiresLiveData: boolean;
  isComparison: boolean;
}

const COMMON_CITIES_MAP: Record<string, string> = {
  london: 'London',
  delhi: 'Delhi',
  tokyo: 'Tokyo',
  mumbai: 'Mumbai',
  'new york': 'New York',
  paris: 'Paris',
  beijing: 'Beijing',
  cairo: 'Cairo',
  sydney: 'Sydney',
  'sao paulo': 'São Paulo',
  bengaluru: 'Bengaluru',
  bangalore: 'Bengaluru',
  berlin: 'Berlin',
  madrid: 'Madrid',
  rome: 'Rome',
  toronto: 'Toronto',
  chicago: 'Chicago',
  'los-angeles': 'Los Angeles',
  'los angeles': 'Los Angeles',
  singapore: 'Singapore',
  dubai: 'Dubai',
  seoul: 'Seoul',
  bangkok: 'Bangkok',
};

export function detectUserIntent(userQuery: string, conversationLocationName?: string): ExtractedIntent {
  const qLower = userQuery.toLowerCase().trim();

  // 1. Check Guardrails first
  const medicalWords = ['diagnose', 'asthma medicine', 'inhaler', 'prescription', 'symptoms of', 'treatment for', 'should i take', 'pills', 'cure my'];
  if (medicalWords.some(w => qLower.includes(w))) {
    return {
      intent: 'MEDICAL_REQUEST',
      extractedLocationNames: [],
      requiresLiveData: false,
      isComparison: false,
    };
  }

  const offTopicWords = ['python code', 'build a game', 'write essay', 'recipe for', 'movie review', 'cricket match', 'solve equation'];
  if (offTopicWords.some(w => qLower.includes(w))) {
    return {
      intent: 'OFF_TOPIC',
      extractedLocationNames: [],
      requiresLiveData: false,
      isComparison: false,
    };
  }

  // 2. Location Extraction from User Query
  const foundLocations: string[] = [];

  // Check explicit pattern "of London", "in London", "for London", "London and Delhi"
  for (const [key, normalizedName] of Object.entries(COMMON_CITIES_MAP)) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(qLower)) {
      if (!foundLocations.includes(normalizedName)) {
        foundLocations.push(normalizedName);
      }
    }
  }

  // Generic extraction for "in [City]", "of [City]", "for [City]" if not in predefined dictionary
  const prepMatches = qLower.match(/(?:in|of|for|at|around)\s+([a-z\s]+?)(?=\s+\b(?:today|now|aqi|pm25|pm10|and|or|\?|$)\b)/gi);
  if (prepMatches) {
    for (const match of prepMatches) {
      const cityCandidate = match.replace(/^(in|of|for|at|around)\s+/i, '').trim();
      if (cityCandidate.length >= 3 && !['the', 'my', 'this', 'current', 'air', 'aqi', 'today'].includes(cityCandidate)) {
        const titleCased = cityCandidate.charAt(0).toUpperCase() + cityCandidate.slice(1);
        if (!foundLocations.includes(titleCased)) {
          foundLocations.push(titleCased);
        }
      }
    }
  }

  // 3. Classify Intent Type
  const isComparison = qLower.includes('compare') || (foundLocations.length >= 2) || qLower.includes('versus') || qLower.includes(' vs ');

  let intent: AgentIntent = 'CURRENT_AIR_QUALITY';

  if (isComparison) {
    intent = 'CITY_COMPARISON';
  } else if (qLower.includes('what is aqi') || qLower.includes('explain aqi') || qLower.includes('how is aqi calculated')) {
    intent = 'AQI_EXPLANATION';
  } else if (qLower.includes('pm2.5') || qLower.includes('pm10') || qLower.includes('no2') || qLower.includes('o3') || qLower.includes('so2') || qLower.includes('co')) {
    intent = 'POLLUTANT_EXPLANATION';
  } else if (qLower.includes('sdg') || qLower.includes('sustainable') || qLower.includes('community')) {
    intent = 'SDG_11';
  } else if (qLower.includes('trend') || qLower.includes('improving') || qLower.includes('worse') || qLower.includes('over time')) {
    intent = 'TREND_ANALYSIS';
  } else if (foundLocations.length > 0 || qLower.includes('aqi') || qLower.includes('current') || qLower.includes('air quality')) {
    intent = 'CURRENT_AIR_QUALITY';
  } else {
    intent = 'GENERAL_ENVIRONMENTAL';
  }

  const liveDataIntents: AgentIntent[] = ['CURRENT_AIR_QUALITY', 'CITY_COMPARISON', 'POLLUTANT_ANALYSIS', 'TREND_ANALYSIS'];

  return {
    intent,
    extractedLocationNames: foundLocations,
    requiresLiveData: liveDataIntents.includes(intent),
    isComparison,
  };
}
