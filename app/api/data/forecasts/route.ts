import { NextRequest, NextResponse } from 'next/server';
import { ForecastEngine } from '@/lib/data/forecastEngine';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phcId = searchParams.get('phcId') || 'ALL';
  const medicineId = searchParams.get('medicineId') || 'med-01';

  const medicineForecast = ForecastEngine.getMedicineDemandForecast(phcId, medicineId);
  const patientForecast = ForecastEngine.getPatientFootfallForecast(phcId);
  const bedForecast = ForecastEngine.getBedOccupancyForecast(phcId);

  return NextResponse.json({
    phcId,
    medicineId,
    disclaimer: ForecastEngine.DISCLAIMER,
    medicineForecast,
    patientForecast,
    bedForecast,
  });
}
