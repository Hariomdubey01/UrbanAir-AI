import { NextRequest, NextResponse } from 'next/server';
import { generateAIExplanation } from '@/lib/ai/context-engine';

const MAX_QUESTION_LENGTH = 2000;

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

    const {
      airQuality,
      compareAirQuality,
      locationName,
      conversationLocationName,
      topic,
    } = body;

    const rawQuestion = body.question || body.query || body.prompt;

    if (
      !rawQuestion ||
      typeof rawQuestion !== 'string' ||
      rawQuestion.trim().length === 0
    ) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid question.' },
        { status: 400 }
      );
    }

    const question = rawQuestion.trim();

    // Prevent excessively large requests
    if (question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `Question must be ${MAX_QUESTION_LENGTH} characters or fewer.`,
        },
        { status: 400 }
      );
    }

    const aiResult = await generateAIExplanation({
      question,
      airQuality,
      compareAirQuality,
      locationName,
      conversationLocationName,
      topic,
    });

    return NextResponse.json(aiResult);
  } catch (error) {
    console.error('AI Chat API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'UrbanAir AI service is temporarily unavailable.',
      },
      { status: 500 }
    );
  }
}
