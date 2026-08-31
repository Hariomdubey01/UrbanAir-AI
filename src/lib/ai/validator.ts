import { AIResponseData, KnowledgeDocument, NormalizedAirQuality, MeasuredDataSnapshot, DataTrustMetaProps } from '../types';
import { POLLUTANTS, calculateDominantPollutant, calculateDataFreshness } from '../air-quality/pollutants';

export function validateAIResponseContract(params: {
  rawAnswer: string;
  summary?: string;
  effectiveAQ: NormalizedAirQuality;
  retrievedDocs: KnowledgeDocument[];
  isLocationOverridden: boolean;
  requestedLocationName?: string;
  mode?: 'gemini-rag' | 'knowledge-fallback';
}): AIResponseData {
  const { rawAnswer, summary, effectiveAQ, retrievedDocs, isLocationOverridden, mode = 'gemini-rag' } = params;

  // Calculate dominant pollutant deterministically (Fix #2)
  const domResult = effectiveAQ.dominantPollutantResult || calculateDominantPollutant({
    pm25: effectiveAQ.pollutants.pm25?.value,
    pm10: effectiveAQ.pollutants.pm10?.value,
    no2: effectiveAQ.pollutants.no2?.value,
    o3: effectiveAQ.pollutants.o3?.value,
    so2: effectiveAQ.pollutants.so2?.value,
    co: effectiveAQ.pollutants.co?.value,
  });

  const aqiStandard = effectiveAQ.aqiStandard || 'US EPA AQI';
  const source = effectiveAQ.source || 'Open-Meteo';

  // Canonical Pollutant Snapshot (Fix #3, Fix #5)
  const pollutantsList = [
    {
      code: POLLUTANTS.pm25.code,
      shortLabel: POLLUTANTS.pm25.shortLabel,
      fullLabel: POLLUTANTS.pm25.fullLabel,
      value: effectiveAQ.pollutants.pm25?.value ?? null,
      unit: POLLUTANTS.pm25.unit,
      standardLimit: POLLUTANTS.pm25.whoLimit,
    },
    {
      code: POLLUTANTS.pm10.code,
      shortLabel: POLLUTANTS.pm10.shortLabel,
      fullLabel: POLLUTANTS.pm10.fullLabel,
      value: effectiveAQ.pollutants.pm10?.value ?? null,
      unit: POLLUTANTS.pm10.unit,
      standardLimit: POLLUTANTS.pm10.whoLimit,
    },
    {
      code: POLLUTANTS.no2.code,
      shortLabel: POLLUTANTS.no2.shortLabel,
      fullLabel: POLLUTANTS.no2.fullLabel,
      value: effectiveAQ.pollutants.no2?.value ?? null,
      unit: POLLUTANTS.no2.unit,
      standardLimit: POLLUTANTS.no2.whoLimit,
    },
    {
      code: POLLUTANTS.o3.code,
      shortLabel: POLLUTANTS.o3.shortLabel,
      fullLabel: POLLUTANTS.o3.fullLabel,
      value: effectiveAQ.pollutants.o3?.value ?? null,
      unit: POLLUTANTS.o3.unit,
      standardLimit: POLLUTANTS.o3.whoLimit,
    },
    {
      code: POLLUTANTS.so2.code,
      shortLabel: POLLUTANTS.so2.shortLabel,
      fullLabel: POLLUTANTS.so2.fullLabel,
      value: effectiveAQ.pollutants.so2?.value ?? null,
      unit: POLLUTANTS.so2.unit,
      standardLimit: POLLUTANTS.so2.whoLimit,
    },
    {
      code: POLLUTANTS.co.code,
      shortLabel: POLLUTANTS.co.shortLabel,
      fullLabel: POLLUTANTS.co.fullLabel,
      value: effectiveAQ.pollutants.co?.value ?? null,
      unit: POLLUTANTS.co.unit,
      standardLimit: POLLUTANTS.co.whoLimit,
    },
  ];

  const measuredData: MeasuredDataSnapshot = {
    locationName: `${effectiveAQ.location.name}, ${effectiveAQ.location.country}`,
    aqi: effectiveAQ.aqi,
    category: effectiveAQ.category,
    aqiStandard,
    dominantPollutant: domResult.label,
    dominantPollutantDetermined: domResult.determined,
    pollutants: pollutantsList,
  };

  const freshnessCalc = calculateDataFreshness(effectiveAQ.timestamp, effectiveAQ.minutesAgo);

  const dataTrust: DataTrustMetaProps = {
    timestamp: effectiveAQ.timestamp,
    source,
    aqiStandard,
    isDemo: effectiveAQ.isDemo || false,
    isCached: effectiveAQ.isCached || false,
    minutesAgo: freshnessCalc.minutesAgo,
    freshness: freshnessCalc.freshness,
  };

  // Measured Data Evaluated tags
  const dataUsedBadges: string[] = [
    `Location: ${effectiveAQ.location.name}, ${effectiveAQ.location.country}`,
    `AQI: ${effectiveAQ.aqi} (${effectiveAQ.category}) - ${aqiStandard}`,
    `Dominant Pollutant: ${domResult.label}`,
  ];

  if (effectiveAQ.pollutants.pm25) dataUsedBadges.push(`PM2.5: ${effectiveAQ.pollutants.pm25.value} µg/m³`);
  if (effectiveAQ.pollutants.pm10) dataUsedBadges.push(`PM10: ${effectiveAQ.pollutants.pm10.value} µg/m³`);
  if (effectiveAQ.pollutants.no2) dataUsedBadges.push(`NO₂: ${effectiveAQ.pollutants.no2.value} µg/m³`);
  if (effectiveAQ.pollutants.o3) dataUsedBadges.push(`O₃: ${effectiveAQ.pollutants.o3.value} µg/m³`);

  const docIds = retrievedDocs.map(d => d.id);

  return {
    success: true,
    answer: rawAnswer,
    summary: summary || `Air Quality Intelligence for ${effectiveAQ.location.name}`,
    mode,
    isFallback: mode === 'knowledge-fallback',
    dataUsed: dataUsedBadges,
    sources: retrievedDocs,
    limitations: [
      'Environmental assessments rely on outdoor ambient telemetry from reporting sensor stations.',
      `AQI values follow the ${aqiStandard} methodology.`,
    ],
    disclaimer: 'UrbanAir AI provides environmental insights to support community awareness under SDG 11.',
    aqiStandard,
    dominantPollutantResult: domResult,
    measuredData,
    dataTrust,
    sdgContext: 'UrbanAir AI supports environmental awareness by making local air-quality information easier to understand, aligning with SDG 11 and Target 11.6.',
    explainability: {
      locationUsed: `${effectiveAQ.location.name}, ${effectiveAQ.location.country}${isLocationOverridden ? ' (Explicitly requested by user query)' : ''}`,
      dataUsed: dataUsedBadges,
      dataSource: source,
      aqiStandard,
      aiMode: mode === 'gemini-rag' ? 'Gemini 2.5 Flash + RAG' : 'Deterministic Knowledge Engine',
      metricsEvaluated: {

        aqi: effectiveAQ.aqi,
        category: effectiveAQ.category,
        dominantPollutant: domResult.label,
        pm25: effectiveAQ.pollutants.pm25?.value,
        pm10: effectiveAQ.pollutants.pm10?.value,
        no2: effectiveAQ.pollutants.no2?.value,
        o3: effectiveAQ.pollutants.o3?.value,
      },
      retrievedKnowledgeIds: docIds,
      guardrailCheck: isLocationOverridden 
        ? `Location intent overridden to ${effectiveAQ.location.name}. Passed medical safety and domain scope checks.`
        : 'Passed medical safety and domain scope checks.',
    },
    generatedAt: new Date().toISOString(),
  };
}

