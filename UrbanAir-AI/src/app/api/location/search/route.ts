import { NextRequest, NextResponse } from 'next/server';
import { searchCities } from '@/lib/air-quality/open-meteo';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const results = await searchCities(query);
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Location search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search locations' },
      { status: 500 }
    );
  }
}
