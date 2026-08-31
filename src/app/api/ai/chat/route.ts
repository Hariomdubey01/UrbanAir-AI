import { NextRequest, NextResponse } from 'next/server';
import { generateAIExplanation } from '@/lib/ai/context-engine';

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid JSON payload.' },
        { status: 400 }
      );
    }

    const { airQuality, compareAirQuality, locationName, conversationLocationName, topic } = body;
    const rawQuestion = body.question || body.query || body.prompt;

    if (!rawQuestion || typeof rawQuestion !== 'string' || rawQuestion.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid question.' },
        { status: 400 }
      );
    }

    const aiResult = await generateAIExplanation({
      question: rawQuestion.trim(),
      airQuality,
      compareAirQuality,
      locationName,
      conversationLocationName,
      topic,
    });


    return NextResponse.json(aiResult);
  } catch (error: any) {
    console.error('AI Chat API error:', error);
    return NextResponse.json(
      { success: false, error: 'UrbanAir AI service is temporarily unavailable.' },
      { status: 500 }
    );
  }
}
