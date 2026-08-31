import { NextRequest, NextResponse } from 'next/server';
import { fetchRawAirQuality, POPULAR_CITIES } from '@/lib/air-quality/open-meteo';
import { normalizeAirQuality } from '@/lib/air-quality/normalizer';
import { CityLocation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const name = searchParams.get('name') || 'Delhi';
    const country = searchParams.get('country') || 'India';
    const id = searchParams.get('id') || 'delhi-in';

    let lat = latStr ? parseFloat(latStr) : 28.6139;
    let lng = lngStr ? parseFloat(lngStr) : 77.2090;

    if (!latStr || !lngStr) {
      const match = POPULAR_CITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
      if (match) {
        lat = match.lat;
        lng = match.lng;
      }
    }

    const cityLoc: CityLocation = {
      id,
      name,
      country,
      countryCode: 'LOC',
      lat,
      lng,
    };

    const rawData = await fetchRawAirQuality(lat, lng);
    const normalized = normalizeAirQuality(rawData, cityLoc);

    return NextResponse.json({ success: true, data: normalized });
  } catch (error: any) {
    console.error('Current AQ API error:', error);
    return NextResponse.json(
      { success: false, error: 'Air-quality data is temporarily unavailable.' },
      { status: 500 }
    );
  }
}
