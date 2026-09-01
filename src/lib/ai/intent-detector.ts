import { POPULAR_CITIES } from '../air-quality/open-meteo';

export type AgentIntent =
  | 'CURRENT_AIR_QUALITY'
  | 'POLLUTANT_EXPLANATION'
  | 'AQI_EXPLANATION'
  | 'POLLUTANT_ANALYSIS'
  | 'TREND_ANALYSIS'
  | 'CITY_COMPARISON'
  | 'DIFFERENCE_EXPLANATION'
  | 'HEALTH_IMPACT_EXPLANATION'
  | 'WHO_EPA_GUIDELINES'
  | 'CAUSES_SOLUTIONS'
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

  // 1. Guardrail short-circuits
  const medicalWords = ['diagnose my', 'diagnose me', 'prescribe', 'what medicine', 'take pills', 'dosage for', 'what dose', 'cure my', 'chest pain remedy'];
  if (medicalWords.some(w => qLower.includes(w))) {
    return {
      intent: 'MEDICAL_REQUEST',
      extractedLocationNames: [],
      requiresLiveData: false,
      isComparison: false,
    };
  }

  const offTopicWords = ['python code', 'python snake game', 'build a game', 'write essay', 'recipe for', 'movie review', 'cricket match', 'solve equation', 'tell me a joke'];
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

  // Check predefined dictionary
  for (const [key, normalizedName] of Object.entries(COMMON_CITIES_MAP)) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(qLower)) {
      if (!foundLocations.includes(normalizedName)) {
        foundLocations.push(normalizedName);
      }
    }
  }

  // Preposition matches: "in [City]", "of [City]", "for [City]"
  const prepMatches = qLower.match(/(?:in|of|for|at|around|between|with)\s+([a-z\s]+?)(?=\s+\b(?:today|now|aqi|pm25|pm10|and|or|\?|$)\b)/gi);
  if (prepMatches) {
    for (const match of prepMatches) {
      const cityCandidate = match.replace(/^(in|of|for|at|around|between|with)\s+/i, '').trim();
      if (cityCandidate.length >= 3 && !['the', 'my', 'this', 'current', 'air', 'aqi', 'today', 'who', 'epa'].includes(cityCandidate)) {
        const titleCased = cityCandidate.charAt(0).toUpperCase() + cityCandidate.slice(1);
        if (!foundLocations.includes(titleCased)) {
          foundLocations.push(titleCased);
        }
      }
    }
  }

  // 3. Classify Intent Type
  const isComparison = qLower.includes('compare') || 
                       (foundLocations.length >= 2) || 
                       qLower.includes('versus') || 
                       qLower.includes(' vs ') ||
                       (qLower.includes('which') && (qLower.includes('better') || qLower.includes('worse') || qLower.includes('higher') || qLower.includes('lower') || qLower.includes('cleaner')));

  const isDifference = qLower.includes('difference between') || 
                       qLower.includes('how does') && qLower.includes('differ') ||
                       qLower.includes('differ from') ||
                       qLower.includes('distinction between');

  let intent: AgentIntent = 'CURRENT_AIR_QUALITY';

  if (isComparison) {
    intent = 'CITY_COMPARISON';
  } else if (isDifference) {
    intent = 'DIFFERENCE_EXPLANATION';
  } else if (qLower.includes('who recommend') || qLower.includes('who guideline') || qLower.includes('epa standard') || qLower.includes('epa aqi scale') || qLower.includes('threshold')) {
    intent = 'WHO_EPA_GUIDELINES';
  } else if (qLower.includes('health impact') || qLower.includes('respiratory') || qLower.includes('lungs') || qLower.includes('long-term exposure') || qLower.includes('public health') || qLower.includes('dangerous') || qLower.includes('harmful')) {
    intent = 'HEALTH_IMPACT_EXPLANATION';
  } else if (qLower.includes('reduce') || qLower.includes('solution') || qLower.includes('policy') || qLower.includes('urban planner') || qLower.includes('causes of') || qLower.includes('why is air pollution high') || qLower.includes('traffic pollution')) {
    intent = 'CAUSES_SOLUTIONS';
  } else if (qLower.includes('what is aqi') || qLower.includes('explain aqi') || qLower.includes('how is aqi calculated') || qLower.includes('aqi 150') || qLower.includes('what does aqi')) {
    intent = 'AQI_EXPLANATION';
  } else if (qLower.includes('what is pm2.5') || qLower.includes('what is pm10') || qLower.includes('what is no2') || qLower.includes('what is ozone') || qLower.includes('what is co') || qLower.includes('what is so2') || qLower.includes('dominant pollutant')) {
    intent = 'POLLUTANT_EXPLANATION';
  } else if (qLower.includes('sdg') || qLower.includes('sustainable') || qLower.includes('community')) {
    intent = 'SDG_11';
  } else if (qLower.includes('trend') || qLower.includes('improving') || qLower.includes('over time')) {
    intent = 'TREND_ANALYSIS';
  } else if (foundLocations.length > 0 || qLower.includes('aqi') || qLower.includes('current') || qLower.includes('today') || qLower.includes('air quality')) {
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
