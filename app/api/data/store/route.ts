import { NextRequest, NextResponse } from 'next/server';
import {
  getStore,
  resetDemo,
  simulateEmergency,
  applyDemoPreset,
  updateTransferStatus,
} from '@/lib/data/mockDatabase';
import { PhcRepository } from '@/lib/data/phcRepository';
import { AlertRepository } from '@/lib/data/alertRepository';
import { RedistributionRepository } from '@/lib/data/redistributionRepository';

export async function GET() {
  const store = getStore();
  const phcStats = PhcRepository.getStats();
  const alertStats = AlertRepository.getSummary();
  const redistributionStats = RedistributionRepository.getStats();

  return NextResponse.json({
    phcs: store.phcs,
    medicines: store.medicines,
    inventory: store.inventory,
    alerts: store.alerts,
    redistributions: store.redistributions,
    emergency: store.emergency,
    federated: store.federated,
    activePreset: store.activePreset,
    stats: {
      ...phcStats,
      alerts: alertStats,
      redistribution: redistributionStats,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'reset') {
      const store = resetDemo();
      return NextResponse.json({ success: true, message: 'Demo reset to initial seed data.', store });
    }

    if (action === 'simulate_emergency') {
      const store = simulateEmergency();
      return NextResponse.json({ success: true, message: 'Emergency surge simulated.', store });
    }

    if (action === 'preset') {
      const store = applyDemoPreset(body.preset);
      return NextResponse.json({ success: true, message: `Preset ${body.preset} applied.`, store });
    }

    if (action === 'update_transfer') {
      const result = updateTransferStatus(body.transferId, body.status);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
