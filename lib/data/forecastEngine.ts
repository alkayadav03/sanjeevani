import { ForecastPoint } from './types';
import { getStore } from './mockDatabase';

export class ForecastEngine {
  static readonly DISCLAIMER = 'Algorithmic estimate (±12% confidence interval). Not clinically validated; for supply-chain simulation only.';

  /**
   * Generates a 7-day rolling forecast for a specific medicine at a PHC
   */
  static getMedicineDemandForecast(phcId: string, medicineId: string): ForecastPoint[] {
    const store = getStore();
    const invItem = store.inventory.find((i) => i.phcId === phcId && i.medicineId === medicineId);
    const baseDaily = invItem ? invItem.dailyConsumption : 25;
    const isSurge = store.emergency.isActive;

    const points: ForecastPoint[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let day = 1; day <= 7; day++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + day);
      const dayOfWeek = targetDate.getDay();
      const dayName = dayNames[dayOfWeek];

      // Day of week seasonality factors (Mon higher, Sun lower)
      const dowFactor = dayOfWeek === 1 ? 1.25 : dayOfWeek === 2 ? 1.15 : dayOfWeek === 0 ? 0.65 : 1.0;
      // Slight upward trend in disease season
      const trendFactor = 1.0 + (day * 0.015);
      const surgeMultiplier = isSurge ? 2.5 : 1.0;

      const baseline = Math.round(baseDaily * dowFactor * trendFactor);
      const predictedDemand = Math.round(baseline * surgeMultiplier);
      const errorMargin = Math.round(predictedDemand * 0.12);

      points.push({
        dayNumber: day,
        date: targetDate.toISOString().split('T')[0],
        dayName: `Day ${day} (${dayName})`,
        predictedDemand,
        lowerBound: Math.max(0, predictedDemand - errorMargin),
        upperBound: predictedDemand + errorMargin,
        baselineDemand: baseline,
        emergencyDemand: isSurge ? predictedDemand : undefined,
      });
    }

    return points;
  }

  /**
   * Generates a 7-day forecast for Patient Footfall across the network or for a PHC
   */
  static getPatientFootfallForecast(phcId?: string): ForecastPoint[] {
    const store = getStore();
    let baseFootfall = 0;

    if (phcId && phcId !== 'ALL') {
      const phc = store.phcs.find((p) => p.id === phcId);
      baseFootfall = phc ? phc.dailyFootfall : 120;
    } else {
      baseFootfall = store.phcs.reduce((acc, p) => acc + p.dailyFootfall, 0);
    }

    const isSurge = store.emergency.isActive;
    const points: ForecastPoint[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let day = 1; day <= 7; day++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + day);
      const dayOfWeek = targetDate.getDay();
      const dowFactor = dayOfWeek === 1 ? 1.3 : dayOfWeek === 6 ? 0.85 : dayOfWeek === 0 ? 0.55 : 1.05;
      const trendFactor = 1.0 + (day * 0.012);
      const surgeMultiplier = isSurge ? 2.2 : 1.0;

      const baseline = Math.round(baseFootfall * dowFactor * trendFactor);
      const predictedDemand = Math.round(baseline * surgeMultiplier);
      const errorMargin = Math.round(predictedDemand * 0.10);

      points.push({
        dayNumber: day,
        date: targetDate.toISOString().split('T')[0],
        dayName: `Day ${day} (${dayNames[dayOfWeek]})`,
        predictedDemand,
        lowerBound: Math.max(0, predictedDemand - errorMargin),
        upperBound: predictedDemand + errorMargin,
        baselineDemand: baseline,
        emergencyDemand: isSurge ? predictedDemand : undefined,
      });
    }

    return points;
  }

  /**
   * Generates a 7-day forecast for Bed Occupancy
   */
  static getBedOccupancyForecast(phcId?: string): { dayName: string; occupied: number; totalBeds: number; rate: number }[] {
    const store = getStore();
    let totalBeds = 0;
    let currentOccupied = 0;

    if (phcId && phcId !== 'ALL') {
      const phc = store.phcs.find((p) => p.id === phcId);
      totalBeds = phc ? phc.totalBeds : 24;
      currentOccupied = phc ? phc.occupiedBeds : 16;
    } else {
      totalBeds = store.phcs.reduce((acc, p) => acc + p.totalBeds, 0);
      currentOccupied = store.phcs.reduce((acc, p) => acc + p.occupiedBeds, 0);
    }

    const isSurge = store.emergency.isActive;
    const results = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let day = 1; day <= 7; day++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + day);
      const dayOfWeek = targetDate.getDay();

      const surgeFactor = isSurge ? Math.min(0.98, 0.75 + day * 0.04) : 0.62 + (day % 3) * 0.03;
      const occupied = Math.min(totalBeds, Math.round(totalBeds * surgeFactor));
      const rate = totalBeds > 0 ? Math.round((occupied / totalBeds) * 100) : 0;

      results.push({
        dayName: `Day ${day} (${dayNames[dayOfWeek]})`,
        occupied,
        totalBeds,
        rate,
      });
    }

    return results;
  }
}
