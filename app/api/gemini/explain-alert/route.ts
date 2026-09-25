import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { AlertRepository } from '@/lib/data/alertRepository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      alertId,
      phcName,
      medicineName,
      currentStock,
      predictedDemand,
      daysRemaining,
      riskLevel,
      district,
      state,
    } = body;

    const prompt = `You are a Chief Medical Officer and AI Supply Chain Resilience Specialist for the National Health Mission (India).
Analyze this urgent medicine stock-out alert:
- Facility: ${phcName} (${district}, ${state})
- Medicine: ${medicineName}
- Current Physical Stock: ${currentStock} units
- Daily Predicted Consumption: ${predictedDemand} units/day
- Estimated Days to Stock-out: ${daysRemaining} days
- Classification: ${riskLevel}

Provide a concise, professional 3-sentence explanation covering:
1. The immediate clinical danger to rural outpatient and emergency care if stock reaches zero.
2. The likely epidemiological or supply-chain driver (e.g. seasonal monsoonal surge, delayed district warehouse allocation, batch expiration).
3. The recommended administrative/logistics intervention (e.g., peer PHC emergency transfer, state warehouse indent).
Do not use markdown headers or bullet points; output a single fluent executive paragraph.`;

    const algorithmicFallback = `CRITICAL ALERT ANALYSIS: Depletion of ${medicineName} at ${phcName} leaves only ${daysRemaining} days of buffer against a projected consumption of ${predictedDemand} units/day. In the rural primary care context, complete exhaustion threatens frontline management of acute presentations and maternal/child emergency protocols. Immediate peer-to-peer redistribution from adjacent surplus health centres within ${district} is strongly recommended to stabilize stocks before warehouse replenishment cycles.`;

    const result = await callGemini(prompt, algorithmicFallback);

    if (alertId) {
      AlertRepository.setAiExplanation(alertId, result.text);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        text: 'Unable to process explanation request at this time. Please check your network and environment settings.',
        source: 'algorithmic_fallback',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
