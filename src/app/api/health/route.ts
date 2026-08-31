import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'UrbanAir AI Platform',
    version: '1.0.0',
    primarySDG: 'SDG 11 - Sustainable Cities and Communities',
    timestamp: new Date().toISOString(),
    aiEngineStatus: process.env.GEMINI_API_KEY ? 'Gemini 2.5 Flash Connected' : 'Deterministic Context RAG Engine Active',
    environmentalDataProvider: 'Open-Meteo Environmental Intelligence Stream (WHO/US-EPA Normalized)',

  });
}
