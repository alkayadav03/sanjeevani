import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      emergencyType,
      phcCount,
      totalFootfall,
      bedOccupancyRate,
      criticalAlertsCount,
      activeTransfersCount,
    } = body;

    const prompt = `You are the Principal Secretary of Health & Family Welfare directing response to an active crisis:
- Emergency Scenario: ${emergencyType || 'Regional Health Influx'}
- Total Monitored PHCs: ${phcCount}
- Combined Patient Inflow Today: ${totalFootfall} patients
- Bed Occupancy Rate: ${bedOccupancyRate}%
- Active Critical Medicine Alerts: ${criticalAlertsCount}
- Active Inter-PHC Transits: ${activeTransfersCount}

Produce a high-impact, 3-paragraph executive briefing for the State Disaster Management Authority and District Magistrates:
1. Situation Assessment & Immediate Vulnerabilities
2. Supply-Chain & Bed Capacity Stabilization Directives
3. Cross-district mutual aid instructions.`;

    const fallback = `EXECUTIVE CRISIS BRIEFING: The simulated surge across ${phcCount} primary health facilities has escalated regional patient footfall to ${totalFootfall} visits, driving bed occupancy to ${bedOccupancyRate}%. Acute depletion risks have surfaced across ${criticalAlertsCount} critical medication lines. 

Immediate operational directives mandate the activation of decentralized mutual aid corridors, routing ${activeTransfersCount} prioritized transfers from surplus primary centres. Local medical officers are instructed to expand secondary observation wards and prioritize triage protocols for pediatric and acute febrile cases.

All district warehouse reserves and cold-chain supply lines are placed on emergency alert to support automated facility redistributions, ensuring no health sub-centre runs dry during the epidemic window.`;

    const result = await callGemini(prompt, fallback);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        text: 'Failed to generate emergency briefing.',
        source: 'algorithmic_fallback',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
