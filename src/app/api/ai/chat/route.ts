import { NextRequest, NextResponse } from 'next/server';
import { generateAIExplanation } from '@/lib/ai/context-engine';

// In-Memory Rate Limiter (sliding 1-minute window per IP)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_REQUESTS_PER_MINUTE = 100;
const WINDOW_MS = 60 * 1000;


function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Extract Client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = (forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip')) || '127.0.0.1';

    // Check Rate Limiting
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before sending more queries.',
        },
        { status: 429 }
      );
    }

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
    const rawQuestion = body.question || body.query || body.prompt || body.message;

    if (!rawQuestion || typeof rawQuestion !== 'string' || rawQuestion.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid question.' },
        { status: 400 }
      );
    }

    const trimmedQuestion = rawQuestion.trim();
    if (trimmedQuestion.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Question must be 2000 characters or fewer.' },
        { status: 400 }
      );
    }

    const aiResult = await generateAIExplanation({
      question: trimmedQuestion,
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
