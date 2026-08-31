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

    const question = cityC
      ? `Compare air quality between ${cityA.location.name} (AQI ${cityA.aqi}), ${cityB.location.name} (AQI ${cityB.aqi}), and ${cityC.location.name} (AQI ${cityC.aqi}). Detail pollutant levels (PM2.5, PM10, NO2) and rank clean air conditions.`
      : `Explain the comparison between ${cityA.location.name} (AQI ${cityA.aqi}) and ${cityB.location.name} (AQI ${cityB.aqi}). Which city has better air quality and why?`;

    const aiResult = await generateAIExplanation({
      question,
      compareAirQuality: { cityA, cityB },
      locationName: cityA.location.name,
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

