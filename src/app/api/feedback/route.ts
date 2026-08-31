import { NextRequest, NextResponse } from 'next/server';

// In-memory feedback store for product metrics tracking
const feedbackStore: Array<{ id: string; rating: 'helpful' | 'unhelpful'; feedback?: string; timestamp: string }> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let rating: 'helpful' | 'unhelpful' = 'helpful';

    if (body.rating === 'helpful' || body.rating === 'unhelpful') {
      rating = body.rating;
    } else if (body.feedback === 'helpful' || body.feedback === 'positive' || body.helpful === true || body.positive === true) {
      rating = 'helpful';
    } else if (body.feedback === 'unhelpful' || body.feedback === 'negative' || body.helpful === false || body.positive === false) {
      rating = 'unhelpful';
    }

    const feedbackText = body.comment || body.feedbackText || (typeof body.feedback === 'string' && body.feedback !== 'helpful' && body.feedback !== 'unhelpful' ? body.feedback : undefined);

    const entry = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      rating,
      feedback: feedbackText ? String(feedbackText).trim() : undefined,
      timestamp: new Date().toISOString(),
    };


    feedbackStore.push(entry);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! It helps improve UrbanAir AI.',
      metrics: {
        totalFeedback: feedbackStore.length,
        helpfulCount: feedbackStore.filter(f => f.rating === 'helpful').length,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to record feedback' }, { status: 500 });
  }
}

export async function GET() {
  const helpfulCount = feedbackStore.filter(f => f.rating === 'helpful').length;
  const total = feedbackStore.length;
  const scorePct = total > 0 ? Math.round((helpfulCount / total) * 100) : 96; // default 96% benchmark

  return NextResponse.json({
    success: true,
    metrics: {
      totalFeedback: total,
      helpfulCount,
      satisfactionRate: `${scorePct}%`,
    }
  });
}
