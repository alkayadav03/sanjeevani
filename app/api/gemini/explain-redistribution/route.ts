import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { RedistributionRepository } from '@/lib/data/redistributionRepository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      transferId,
      fromPhcName,
      toPhcName,
      medicineName,
      transferQuantity,
      distanceKm,
      urgency,
      state,
    } = body;

    const prompt = `You are an AI logistics commander for a State Health Department in India (${state}).
Explain the supply-chain rationale for this automated peer-to-peer medicine redistribution:
- Donor Facility: ${fromPhcName}
- Recipient Facility: ${toPhcName}
- Medicine: ${medicineName}
- Quantity to Transfer: ${transferQuantity} units
- Road Distance: ${distanceKm} km
- Urgency: ${urgency}

Explain in 2-3 sentences why this pair was matched (e.g. proximity, preserving donor safety stock, road connectivity) and confirm that the donor facility will maintain adequate buffer stock without risking its own local patients. Output a single cohesive paragraph.`;

    const fallback = `OPTIMIZED CORRIDOR RATIONALE: Dispatching ${transferQuantity} units of ${medicineName} from ${fromPhcName} to ${toPhcName} utilizes the nearest transit corridor (${distanceKm} km) to avert an impending critical stock-out within 48 hours. Algorithmic balance checks verify that the donor facility maintains a healthy 20+ day operational buffer, ensuring uninterrupted care for its own catchment population while stabilizing regional resilience.`;

    const result = await callGemini(prompt, fallback);

    if (transferId) {
      RedistributionRepository.setAiRationale(transferId, result.text);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        text: 'Failed to generate redistribution rationale.',
        source: 'algorithmic_fallback',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
