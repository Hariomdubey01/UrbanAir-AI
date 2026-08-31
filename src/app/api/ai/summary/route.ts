import { NextRequest, NextResponse } from 'next/server';
import { generateAIExplanation } from '@/lib/ai/context-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { airQuality } = body;

    const question = `Give me a concise environmental summary for ${airQuality?.location?.name || 'this location'} based on current AQI ${airQuality?.aqi ?? ''}.`;

    const aiResult = await generateAIExplanation({
      question,
      airQuality,
    });

    return NextResponse.json(aiResult);
  } catch (error: any) {
    console.error('AI Summary API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate AI summary' },
      { status: 500 }
    );
  }
}
