import { CityLocation, NormalizedAirQuality } from '../types';
import { searchCities, fetchRawAirQuality, POPULAR_CITIES } from '../air-quality/open-meteo';
import { normalizeAirQuality } from '../air-quality/normalizer';

export interface ResolvedLocationContext {
  requestedLocationName?: string;
  selectedLocationName: string;
  effectiveLocation: CityLocation;
  effectiveAirQuality?: NormalizedAirQuality;
  isLocationOverridden: boolean;
  comparisonLocations?: Array<{ location: CityLocation; airQuality: NormalizedAirQuality }>;
}

export async function resolveLocationContext(params: {
  extractedLocationNames: string[];
  selectedAirQuality?: NormalizedAirQuality;
  selectedLocationName?: string;
  conversationLocationName?: string;
}): Promise<ResolvedLocationContext> {
  const { extractedLocationNames, selectedAirQuality, selectedLocationName, conversationLocationName } = params;

  const currentSelectedName = selectedAirQuality?.location.name || selectedLocationName || 'Delhi';

  // Debug Logging in Development (PRD Section 29)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DEBUG LOCATION RESOLVER]', {
      extracted: extractedLocationNames,
      selectedUI: currentSelectedName,
      conversationMemory: conversationLocationName,
    });
  }

  // Priority Rule 1: Explicit location in user query
  if (extractedLocationNames.length > 0) {
    const primaryExtracted = extractedLocationNames[0];

    // Check if user requested a comparison between 2+ locations
    if (extractedLocationNames.length >= 2) {
      const compResults = await Promise.all(
        extractedLocationNames.slice(0, 2).map(async (name) => {
          const matched = await resolveSingleCity(name);
          const raw = await fetchRawAirQuality(matched.lat, matched.lng);
          const norm = normalizeAirQuality(raw, matched);
          return { location: matched, airQuality: norm };
        })
      );

      return {
        requestedLocationName: primaryExtracted,
        selectedLocationName: currentSelectedName,
        effectiveLocation: compResults[0].location,
        effectiveAirQuality: compResults[0].airQuality,
        isLocationOverridden: true,
        comparisonLocations: compResults,
      };
    }

    // Single explicit user location override
    const effectiveLoc = await resolveSingleCity(primaryExtracted);
    const rawData = await fetchRawAirQuality(effectiveLoc.lat, effectiveLoc.lng);
    const effectiveAQ = normalizeAirQuality(rawData, effectiveLoc);

    return {
      requestedLocationName: primaryExtracted,
      selectedLocationName: currentSelectedName,
      effectiveLocation: effectiveLoc,
      effectiveAirQuality: effectiveAQ,
      isLocationOverridden: primaryExtracted.toLowerCase() !== currentSelectedName.toLowerCase(),
    };
  }

  // Priority Rule 2: Conversation memory location
  if (conversationLocationName && conversationLocationName.toLowerCase() !== currentSelectedName.toLowerCase()) {
    const effectiveLoc = await resolveSingleCity(conversationLocationName);
    const rawData = await fetchRawAirQuality(effectiveLoc.lat, effectiveLoc.lng);
    const effectiveAQ = normalizeAirQuality(rawData, effectiveLoc);

    return {
      requestedLocationName: conversationLocationName,
      selectedLocationName: currentSelectedName,
      effectiveLocation: effectiveLoc,
      effectiveAirQuality: effectiveAQ,
      isLocationOverridden: true,
    };
  }

  // Priority Rule 3: Current selected UI location
  if (selectedAirQuality) {
    return {
      selectedLocationName: currentSelectedName,
      effectiveLocation: selectedAirQuality.location,
      effectiveAirQuality: selectedAirQuality,
      isLocationOverridden: false,
    };
  }

  // Priority Rule 4 & 5: Fallback lookup
  const fallbackLoc = await resolveSingleCity(currentSelectedName);
  const rawData = await fetchRawAirQuality(fallbackLoc.lat, fallbackLoc.lng);
  const effectiveAQ = normalizeAirQuality(rawData, fallbackLoc);

  return {
    selectedLocationName: currentSelectedName,
    effectiveLocation: fallbackLoc,
    effectiveAirQuality: effectiveAQ,
    isLocationOverridden: false,
  };
}

async function resolveSingleCity(nameQuery: string): Promise<CityLocation> {
  const matchPopular = POPULAR_CITIES.find(c => c.name.toLowerCase() === nameQuery.toLowerCase());
  if (matchPopular) return matchPopular;

  try {
    const searchResults = await searchCities(nameQuery);
    if (searchResults && searchResults.length > 0) {
      return searchResults[0];
    }
  } catch (err) {
    console.error('Error resolving city location:', err);
  }

  return POPULAR_CITIES[0]; // Fallback to Delhi if completely unresolvable
}
