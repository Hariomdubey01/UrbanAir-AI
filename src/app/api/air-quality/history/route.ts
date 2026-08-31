import { NextRequest, NextResponse } from 'next/server';
import { fetchRawAirQuality } from '@/lib/air-quality/open-meteo';
import { normalizeHistoricalData } from '@/lib/air-quality/normalizer';
import { CityLocation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '28.6139');
    const lng = parseFloat(searchParams.get('lng') || '77.2090');
    const name = searchParams.get('name') || 'Delhi';
    const country = searchParams.get('country') || 'India';
    const tf = (searchParams.get('timeframe') as '24h' | '7d' | '30d') || '24h';

    const cityLoc: CityLocation = {
      id: `${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      country,
      countryCode: 'LOC',
      lat,
      lng,
    };

    const rawData = await fetchRawAirQuality(lat, lng);
    const history = normalizeHistoricalData(rawData, cityLoc, tf);

    return NextResponse.json({ success: true, data: history });
  } catch (error: any) {
    console.error('History AQ API error:', error);
    return NextResponse.json(
      { success: false, error: 'Historical air-quality data is temporarily unavailable.' },
      { status: 500 }
    );
  }
}
