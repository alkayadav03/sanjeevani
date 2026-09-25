import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.trim().length > 10 && apiKey !== 'YOUR_GEMINI_API_KEY');

  return NextResponse.json({
    configured: isConfigured,
    model: 'gemini-1.5-flash',
    maskedKey: isConfigured ? `••••••••••••${apiKey!.slice(-4)}` : null,
    provider: 'Google Generative AI',
    status: isConfigured ? 'READY' : 'KEY_NOT_CONFIGURED',
  });
}
