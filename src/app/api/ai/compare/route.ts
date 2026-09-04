import { NextRequest, NextResponse } from 'next/server';
import { generateAIExplanation } from '@/lib/ai/context-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cityA, cityB, cityC } = body;

    if (!cityA || !cityB) {
      return NextResponse.json(
        { success: false, error: 'Please provide at least two city datasets for comparison.' },
        { status: 400 }
      );
    }

    const nameA = cityA.location?.name || cityA.name || 'City A';
    const aqiA = cityA.aqi ?? 'N/A';
    const nameB = cityB.location?.name || cityB.name || 'City B';
    const aqiB = cityB.aqi ?? 'N/A';
    const nameC = cityC?.location?.name || cityC?.name || 'City C';
    const aqiC = cityC?.aqi ?? 'N/A';

    const question = cityC
      ? `Compare air quality between ${nameA} (AQI ${aqiA}), ${nameB} (AQI ${aqiB}), and ${nameC} (AQI ${aqiC}). Detail pollutant levels (PM2.5, PM10, NO2) and rank clean air conditions.`
      : `Explain the comparison between ${nameA} (AQI ${aqiA}) and ${nameB} (AQI ${aqiB}). Which city has better air quality and why?`;

    const aiResult = await generateAIExplanation({
      question,
      compareAirQuality: { cityA, cityB },
      locationName: nameA,
    });

    return NextResponse.json(aiResult);
  } catch (error: any) {
    console.error('AI Compare API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate comparison analysis' },
      { status: 500 }
    );
  }
}

