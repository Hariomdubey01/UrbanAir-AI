import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponseData, KnowledgeDocument, NormalizedAirQuality } from '../types';
import { retrieveKnowledgeDocs } from './retriever';
import { checkGuardrails } from './guardrails';
import { detectUserIntent } from './intent-detector';
import { resolveLocationContext } from './location-resolver';
import { validateAIResponseContract } from './validator';

export interface AIContextInput {
  question: string;
  airQuality?: NormalizedAirQuality;
  compareAirQuality?: { cityA: NormalizedAirQuality; cityB: NormalizedAirQuality };
  locationName?: string;
  conversationLocationName?: string;
  topic?: string;
}

export async function generateAIExplanation(input: AIContextInput): Promise<AIResponseData> {
  const { question, airQuality, compareAirQuality, locationName, conversationLocationName, topic } = input;
  const nowStr = new Date().toISOString();

  // 1. Enforce Guardrails (Medical / Off-topic)
  const guardrailCheck = checkGuardrails(question);
  if (guardrailCheck.isBlocked && guardrailCheck.refusalResponse) {
    return {
      success: true,
      answer: guardrailCheck.refusalResponse.answer,
      summary: guardrailCheck.refusalResponse.summary,
      dataUsed: airQuality ? [`AQI: ${airQuality.aqi}`, `Location: ${airQuality.location.name}`] : [],
      sources: [],
      limitations: ['Query fell outside environmental intelligence scope or requested health diagnosis.'],
      disclaimer: guardrailCheck.refusalResponse.disclaimer,
      aiTask: 'Safety & Scope Guardrail',
      isFallback: true,
      explainability: {
        locationUsed: airQuality?.location.name || locationName || 'Global Context',
        metricsEvaluated: airQuality ? { aqi: airQuality.aqi, category: airQuality.category } : {},
        retrievedKnowledgeIds: [],
        guardrailCheck: `Triggered ${guardrailCheck.type} guardrail filter. Medical safety and scope enforcement active.`,
        aiTask: 'Safety & Scope Guardrail',
        limitations: ['Query fell outside environmental intelligence scope or requested health diagnosis.'],
      },
      generatedAt: nowStr,
    };
  }

  // 2. Intent Detection & Location Extraction
  const intentData = detectUserIntent(question, conversationLocationName);

  // 3. Resolve Authoritative Location Context (Location Priority Rule)
  const resolvedLocContext = await resolveLocationContext({
    extractedLocationNames: intentData.extractedLocationNames,
    selectedAirQuality: airQuality,
    selectedLocationName: locationName,
    conversationLocationName,
  });

  const effectiveAQ = resolvedLocContext.effectiveAirQuality!;
  const effectiveLoc = resolvedLocContext.effectiveLocation;

  // Debug Log (PRD Section 29)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[AGENT CONTEXT ENGINE]', {
      userQuery: question,
      intent: intentData.intent,
      extractedLocations: intentData.extractedLocationNames,
      selectedLocation: locationName || airQuality?.location.name,
      effectiveLocation: effectiveLoc.name,
      isOverridden: resolvedLocContext.isLocationOverridden,
    });
  }

  // 4. Retrieve RAG Knowledge Base Documents
  const retrievedDocs = retrieveKnowledgeDocs(
    question + ' ' + (topic || '') + ' ' + effectiveAQ.category + ' ' + effectiveAQ.primaryPollutant,
    2
  );

  // 5. Check Comparison Context
  if (intentData.intent === 'CITY_COMPARISON' && resolvedLocContext.comparisonLocations && resolvedLocContext.comparisonLocations.length >= 2) {
    const compA = resolvedLocContext.comparisonLocations[0].airQuality;
    const compB = resolvedLocContext.comparisonLocations[1].airQuality;
    return buildComparisonResponse(compA, compB, question, retrievedDocs);
  }

  // 6. Gemini LLM Mode (Server-side API Integration)
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== '') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });



      const prompt = `You are UrbanAir AI, an authoritative environmental intelligence assistant focused on SDG 11.

CORE PRINCIPLE:
"UrbanAir AI never generates a number — it only ever explains one that came from real measured data or a cited knowledge source."

CRITICAL LOCATION RULE:
The user's query is about: "${effectiveLoc.name}, ${effectiveLoc.country}".
You MUST answer strictly using the provided environmental data for ${effectiveLoc.name}.
DO NOT reference any other location unless the user explicitly requested a city comparison.

User Question: "${question}"
Location: ${effectiveLoc.name}, ${effectiveLoc.country}
Environmental Telemetry (Open-Meteo US EPA Standard):
- Air Quality Index (AQI): ${effectiveAQ.aqi} (${effectiveAQ.category})
- Dominant Pollutant: ${effectiveAQ.primaryPollutant}
- PM2.5: ${effectiveAQ.pollutants.pm25?.value ?? 'N/A'} µg/m³
- PM10: ${effectiveAQ.pollutants.pm10?.value ?? 'N/A'} µg/m³
- NO2: ${effectiveAQ.pollutants.no2?.value ?? 'N/A'} µg/m³
- Ozone (O3): ${effectiveAQ.pollutants.o3?.value ?? 'N/A'} µg/m³

Retrieved Knowledge Base Context:
${retrievedDocs.map(d => `- [${d.title} (${d.organization})]: ${d.snippet}`).join('\n')}

System Rules:
1. Provide a concise, clear response matching the question length. Do NOT write an overly long essay for simple questions.
2. Structure the answer cleanly using short bullet points where appropriate.
3. Base environmental interpretations strictly on the provided telemetry and WHO/EPA guidelines.
4. NEVER invent unmeasured metrics or provide medical diagnoses/prescriptions.
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const validated = validateAIResponseContract({
        rawAnswer: text,
        summary: `Air Quality Analysis for ${effectiveLoc.name} (${effectiveAQ.category})`,
        effectiveAQ,
        retrievedDocs,
        isLocationOverridden: resolvedLocContext.isLocationOverridden,
        requestedLocationName: resolvedLocContext.requestedLocationName,
        mode: 'gemini-rag',
      });

      return {
        ...validated,
        mode: 'gemini-rag',
        isFallback: false,
        aiTask: 'Environmental explanation',
        explainability: {
          ...validated.explainability,
          aiTask: 'Environmental explanation',
          aiMode: 'Gemini 3.6 Flash + RAG',
          limitations: validated.limitations,


        }
      };
    } catch (err) {
      console.warn('Gemini API call failed, using deterministic knowledge engine fallback:', err);
    }
  }

  // 7. Built-in Deterministic AI Context Engine (Zero-Config Fallback)
  const fallbackAnswer = buildDeterministicExplanation({
    question,
    intent: intentData.intent,
    effectiveAQ,
    compareAirQuality,
    retrievedDocs,
  });

  const validatedFallback = validateAIResponseContract({
    rawAnswer: fallbackAnswer.answer,
    summary: fallbackAnswer.summary,
    effectiveAQ,
    retrievedDocs,
    isLocationOverridden: resolvedLocContext.isLocationOverridden,
    requestedLocationName: resolvedLocContext.requestedLocationName,
    mode: 'knowledge-fallback',
  });

  return {
    ...validatedFallback,
    mode: 'knowledge-fallback',
    isFallback: true,
    aiTask: 'Environmental explanation',
    explainability: {
      ...validatedFallback.explainability,
      aiTask: 'Environmental explanation',
      aiMode: 'Knowledge-based fallback',
      limitations: validatedFallback.limitations,
    }
  };
}

function buildComparisonResponse(
  compA: NormalizedAirQuality,
  compB: NormalizedAirQuality,
  question: string,
  retrievedDocs: KnowledgeDocument[]
): AIResponseData {
  const betterCity = compA.aqi < compB.aqi ? compA : compB;
  const worseCity = compA.aqi > compB.aqi ? compA : compB;
  const diff = Math.abs(compA.aqi - compB.aqi);

  const answerText = `Comparative Air Quality Analysis:

**${compA.location.name}** currently reports an AQI of **${compA.aqi}** (${compA.category}), while **${compB.location.name}** measures an AQI of **${compB.aqi}** (${compB.category}).

**Pollutant Comparison Breakdown:**
- **PM2.5:** ${compA.location.name} measures ${compA.pollutants.pm25?.value ?? 'N/A'} µg/m³ vs ${compB.location.name} measuring ${compB.pollutants.pm25?.value ?? 'N/A'} µg/m³.
- **NO₂:** ${compA.location.name} measures ${compA.pollutants.no2?.value ?? 'N/A'} µg/m³ vs ${compB.location.name} measuring ${compB.pollutants.no2?.value ?? 'N/A'} µg/m³.

Currently, ${betterCity.location.name} reports lower ambient air pollution concentrations than ${worseCity.location.name} by a margin of ${diff} AQI points under the US EPA benchmark.`;

  return {
    success: true,
    answer: answerText,
    summary: `Side-by-Side Comparison: ${compA.location.name} (AQI ${compA.aqi}) vs ${compB.location.name} (AQI ${compB.aqi})`,
    mode: 'knowledge-fallback',
    isFallback: true,
    dataUsed: [
      `${compA.location.name} AQI: ${compA.aqi} (${compA.category})`,
      `${compB.location.name} AQI: ${compB.aqi} (${compB.category})`,
      `PM2.5 Delta: ${Math.abs((compA.pollutants.pm25?.value || 0) - (compB.pollutants.pm25?.value || 0)).toFixed(1)} µg/m³`,
    ],
    sources: retrievedDocs,
    limitations: ['Comparison is based on real-time ambient outdoor monitoring telemetry.'],
    disclaimer: 'UrbanAir AI provides environmental insights to support community awareness under SDG 11.',
    sdgContext: 'UrbanAir AI supports environmental awareness by making local air-quality information easier to understand, aligning with SDG 11 and Target 11.6.',
    explainability: {
      locationUsed: `Side-by-side comparison: ${compA.location.name} and ${compB.location.name}`,
      dataUsed: [
        `${compA.location.name}: AQI ${compA.aqi}`,
        `${compB.location.name}: AQI ${compB.aqi}`,
      ],
      dataSource: 'Open-Meteo',
      aqiStandard: 'US EPA AQI',
      aiMode: 'Deterministic Knowledge Engine',
      metricsEvaluated: {
        cityA: { name: compA.location.name, aqi: compA.aqi },
        cityB: { name: compB.location.name, aqi: compB.aqi },
      },
      retrievedKnowledgeIds: retrievedDocs.map(d => d.id),
      guardrailCheck: 'Retrieved fresh telemetry for both comparison locations independently.',
    },
    generatedAt: new Date().toISOString(),
  };
}

function buildDeterministicExplanation(params: {
  question: string;
  intent: string;
  effectiveAQ: NormalizedAirQuality;
  compareAirQuality?: { cityA: NormalizedAirQuality; cityB: NormalizedAirQuality };
  retrievedDocs: KnowledgeDocument[];
}) {
  const { question, effectiveAQ } = params;
  const city = effectiveAQ.location.name;
  const country = effectiveAQ.location.country;
  const aqi = effectiveAQ.aqi;
  const cat = effectiveAQ.category;
  const primary = effectiveAQ.primaryPollutant;
  const pm25 = effectiveAQ.pollutants.pm25?.value ?? 'N/A';
  const pm10 = effectiveAQ.pollutants.pm10?.value ?? 'N/A';
  const no2 = effectiveAQ.pollutants.no2?.value ?? 'N/A';
  const o3 = effectiveAQ.pollutants.o3?.value ?? 'N/A';

  const qLower = question.toLowerCase();

  if (qLower.includes('pm2.5') || qLower.includes('pm25')) {
    return {
      summary: `PM2.5 Analysis for ${city}`,
      answer: `In **${city}, ${country}**, the reported PM2.5 level is **${pm25} µg/m³**, classified as **${effectiveAQ.pollutants.pm25?.status || 'Normal'}**.

**What is PM2.5?**
PM2.5 refers to fine particulate matter smaller than 2.5 micrometers in diameter. 
- **WHO 24-Hour Safety Limit:** 15 µg/m³
- Current reading in ${city} is **${Number(pm25) > 15 ? 'above' : 'within'}** the WHO reference threshold.

**Community Impact under SDG 11:**
PM2.5 is the primary global indicator (SDG Indicator 11.6.2) for tracking city air quality and public health exposure.`,
    };
  }

  if (qLower.includes('why') && (qLower.includes('poor') || qLower.includes('unhealthy') || qLower.includes('hazardous') || qLower.includes('high') || qLower.includes('bad'))) {
    return {
      summary: `Environmental Explanation for ${city} (AQI ${aqi})`,

      answer: `The current Air Quality Index (AQI) in **${city}, ${country}** is **${aqi}**, classified as **${cat}** (US EPA standard).

**Key Contributing Factors:**
- **Dominant Pollutant:** **${primary}** (PM2.5 level: **${pm25} µg/m³**).
- **Other Metrics:** PM10 is ${pm10} µg/m³ and NO₂ is ${no2} µg/m³.

**Why AQI Varies in Urban Centers:**
Particulate and gaseous accumulation occurs due to vehicular emissions, industrial fuel combustion, and meteorological conditions such as wind stagnation or temperature inversions.`,
    };
  }

  // Default concise current AQ summary (Fix #3, Fix #4)
  return {
    summary: `Current Air Quality Intelligence for ${city}`,
    answer: `In **${city}, ${country}**, the current Air Quality Index (AQI) is **${aqi}** (**${cat}**) based on the US EPA standard.

**Reported Measurements:**
- **Dominant Pollutant:** ${primary}
- **PM2.5:** ${pm25} µg/m³
- **PM10:** ${pm10} µg/m³
- **NO₂:** ${no2} µg/m³
- **O₃:** ${o3} µg/m³

**Context & SDG 11:**
UrbanAir AI supports environmental awareness by making local air-quality information easier to understand, aligning with SDG 11 and Target 11.6.`,
  };
}
