import {
  PHC,
  Medicine,
  InventoryItem,
  StockAlert,
  TransferRecommendation,
  TransferStatus,
  PatientDailyRecord,
  EmergencyState,
  DemoPreset,
  FederatedState,
  RiskLevel,
} from './types';
import { generateSeedData, calculateDistanceKm, SeedDataResult } from './seedGenerator';

export interface DataStore {
  phcs: PHC[];
  medicines: Medicine[];
  inventory: InventoryItem[];
  alerts: StockAlert[];
  redistributions: TransferRecommendation[];
  history: Record<string, PatientDailyRecord[]>;
  emergency: EmergencyState;
  federated: FederatedState;
  activePreset: DemoPreset;
}

// Initial seed
let currentStore: DataStore | null = null;
const listeners = new Set<() => void>();

function initializeStore(): DataStore {
  const seed = generateSeedData();
  return {
    phcs: seed.phcs,
    medicines: seed.medicines,
    inventory: seed.inventory,
    alerts: seed.alerts,
    redistributions: seed.redistributions,
    history: seed.history,
    activePreset: 'NORMAL',
    emergency: {
      isActive: false,
      severity: 'NORMAL',
      type: 'Routine Operations',
      description: 'Standard baseline primary healthcare telemetry across all monitored districts.',
      startedAt: null,
      impactMultiplier: { footfall: 1.0, medicine: 1.0, beds: 1.0, staffStress: 1.0 },
      timelineStep: 0,
    },
    federated: {
      globalModelVersion: 'v2.4.1',
      round: 14,
      isTraining: false,
      progress: 0,
      nodes: [
        { id: 'node-pb', stateName: 'Punjab', phcCount: 25, localSamples: 48500, epochsTrained: 120, status: 'READY', localAccuracy: 94.2, loss: 0.082 },
        { id: 'node-hr', stateName: 'Haryana', phcCount: 25, localSamples: 46200, epochsTrained: 120, status: 'READY', localAccuracy: 93.8, loss: 0.089 },
        { id: 'node-rj', stateName: 'Rajasthan', phcCount: 25, localSamples: 51200, epochsTrained: 120, status: 'READY', localAccuracy: 94.7, loss: 0.078 },
        { id: 'node-up', stateName: 'Uttar Pradesh', phcCount: 25, localSamples: 62400, epochsTrained: 120, status: 'READY', localAccuracy: 95.1, loss: 0.071 },
      ],
      lastAggregation: '2026-09-17T18:00:00Z',
    },
  };
}

export function getStore(): DataStore {
  if (!currentStore) {
    currentStore = initializeStore();
  }
  return currentStore;
}

export function subscribeToStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifySubscribers() {
  for (const listener of Array.from(listeners)) {
    try {
      listener();
    } catch (e) {
      console.error('Subscriber error:', e);
    }
  }
}

// Full reset to seeded pristine baseline
export function resetDemo(): DataStore {
  currentStore = initializeStore();
  notifySubscribers();
  return currentStore;
}

// Simulate Health Emergency (Surge)
export function simulateEmergency(): DataStore {
  const store = getStore();

  store.activePreset = 'HEALTH_EMERGENCY';
  store.emergency = {
    isActive: true,
    severity: 'CRITICAL',
    type: 'Acute Seasonal Epidemic & Respiratory/Dengue Influx',
    description:
      'Simulated health emergency triggered across North India corridor. Mass influx of acute febrile illness, severe pediatric dehydration, and respiratory distress creating immediate bed shortages and medicine depletion.',
    startedAt: new Date().toISOString(),
    impactMultiplier: {
      footfall: 2.2, // +120% footfall
      medicine: 2.5, // +150% drug consumption
      beds: 1.8,     // beds surging to 95%+
      staffStress: 2.0,
    },
    timelineStep: 4,
    briefing:
      'Executive Emergency Briefing: Influx of acute viral encephalitis and respiratory syncytial surge detected. Immediate emergency protocol activated across 12 districts. Buffer reserves mobilized for Paracetamol, ORS, Amoxicillin, and Ceftriaxone.',
  };

  // Mutate PHCs: footfall rises, beds fill up, statuses worsen
  for (const phc of store.phcs) {
    phc.isEmergencySurge = true;
    phc.dailyFootfall = Math.round(phc.dailyFootfall * 2.2);
    phc.occupiedBeds = Math.min(phc.totalBeds, Math.round(phc.totalBeds * 0.94));
    phc.availableBeds = phc.totalBeds - phc.occupiedBeds;
    if (phc.availableBeds <= 1) {
      phc.status = 'CRITICAL';
    } else if (phc.availableBeds <= 3 && phc.status === 'NORMAL') {
      phc.status = 'HIGH_RISK';
    }
  }

  // Mutate inventory: consumption surges 2.5x -> daysRemaining shrinks drastically
  for (const item of store.inventory) {
    item.dailyConsumption = Math.round(item.dailyConsumption * 2.5);
    item.daysRemaining = +(item.currentStock / item.dailyConsumption).toFixed(1);

    if (item.daysRemaining < 3) {
      item.riskLevel = 'CRITICAL';
    } else if (item.daysRemaining <= 7) {
      item.riskLevel = 'HIGH_RISK';
    } else if (item.daysRemaining <= 14) {
      item.riskLevel = 'WARNING';
    }
  }

  // Re-generate Alerts
  store.alerts = [];
  for (const item of store.inventory) {
    if (item.riskLevel !== 'NORMAL') {
      const phc = store.phcs.find((p) => p.id === item.phcId);
      store.alerts.push({
        id: `alert-emerg-${item.id}`,
        phcId: item.phcId,
        phcName: item.phcName,
        district: phc?.district || 'District',
        state: phc?.state || 'State',
        medicineId: item.medicineId,
        medicineName: item.medicineName,
        currentStock: item.currentStock,
        predictedDemand: item.dailyConsumption,
        daysRemaining: item.daysRemaining,
        riskLevel: item.riskLevel,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    }
  }

  // Generate urgent cross-facility transfers
  store.redistributions = generateEmergencyTransfers(store.phcs, store.inventory, store.alerts);

  notifySubscribers();
  return store;
}

// Preset controls for independent demo changes
export function applyDemoPreset(preset: DemoPreset): DataStore {
  const store = getStore();
  store.activePreset = preset;

  if (preset === 'NORMAL') {
    return resetDemo();
  }

  if (preset === 'HEALTH_EMERGENCY') {
    return simulateEmergency();
  }

  // For individual presets, modify specific slices:
  if (preset === 'MEDICINE_SHORTAGE') {
    // Paracetamol & Amoxicillin shortage across 15 PHCs
    for (const item of store.inventory) {
      if (item.medicineId === 'med-01' || item.medicineId === 'med-02') {
        item.currentStock = Math.max(10, Math.round(item.dailyConsumption * 1.5));
        item.daysRemaining = +(item.currentStock / item.dailyConsumption).toFixed(1);
        item.riskLevel = 'CRITICAL';
      }
    }
  } else if (preset === 'PATIENT_SURGE') {
    for (const phc of store.phcs) {
      phc.dailyFootfall = Math.round(phc.dailyFootfall * 1.9);
      if (phc.status === 'NORMAL') phc.status = 'HIGH_RISK';
    }
  } else if (preset === 'BED_CRISIS') {
    for (const phc of store.phcs) {
      phc.occupiedBeds = phc.totalBeds;
      phc.availableBeds = 0;
      phc.status = 'CRITICAL';
    }
  } else if (preset === 'STAFF_SHORTAGE') {
    for (const phc of store.phcs) {
      phc.staffPresent = Math.max(2, Math.round(phc.staffTotal * 0.4));
      if (phc.status === 'NORMAL') phc.status = 'WARNING';
    }
  }

  // Re-sync alerts
  store.alerts = [];
  for (const item of store.inventory) {
    if (item.riskLevel !== 'NORMAL') {
      const phc = store.phcs.find((p) => p.id === item.phcId);
      store.alerts.push({
        id: `alert-preset-${item.id}`,
        phcId: item.phcId,
        phcName: item.phcName,
        district: phc?.district || 'District',
        state: phc?.state || 'State',
        medicineId: item.medicineId,
        medicineName: item.medicineName,
        currentStock: item.currentStock,
        predictedDemand: item.dailyConsumption,
        daysRemaining: item.daysRemaining,
        riskLevel: item.riskLevel,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    }
  }

  notifySubscribers();
  return store;
}

// Transfer status workflow: RECOMMENDED -> APPROVED -> IN_TRANSIT -> RECEIVED
export function updateTransferStatus(transferId: string, newStatus: TransferStatus): { success: boolean; transfer?: TransferRecommendation } {
  const store = getStore();
  const transfer = store.redistributions.find((t) => t.id === transferId);
  if (!transfer) return { success: false };

  transfer.status = newStatus;

  // If RECEIVED: Update underlying data live!
  if (newStatus === 'RECEIVED') {
    // 1. Add to receiving PHC inventory
    const recipientItem = store.inventory.find(
      (item) => item.phcId === transfer.toPhcId && item.medicineId === transfer.medicineId
    );
    if (recipientItem) {
      recipientItem.currentStock += transfer.transferQuantity;
      recipientItem.daysRemaining = +(recipientItem.currentStock / recipientItem.dailyConsumption).toFixed(1);
      
      // Update risk band based on new days remaining
      if (recipientItem.daysRemaining < 3) {
        recipientItem.riskLevel = 'CRITICAL';
      } else if (recipientItem.daysRemaining <= 7) {
        recipientItem.riskLevel = 'HIGH_RISK';
      } else if (recipientItem.daysRemaining <= 14) {
        recipientItem.riskLevel = 'WARNING';
      } else {
        recipientItem.riskLevel = 'NORMAL';
      }
    }

    // 2. Deduct safely from donor PHC inventory
    const donorItem = store.inventory.find(
      (item) => item.phcId === transfer.fromPhcId && item.medicineId === transfer.medicineId
    );
    if (donorItem) {
      donorItem.currentStock = Math.max(0, donorItem.currentStock - transfer.transferQuantity);
      donorItem.daysRemaining = +(donorItem.currentStock / donorItem.dailyConsumption).toFixed(1);
    }

    // 3. Resolve or update the active alert for recipient
    const recipientAlert = store.alerts.find(
      (a) => a.phcId === transfer.toPhcId && a.medicineId === transfer.medicineId && !a.resolved
    );
    if (recipientAlert && recipientItem) {
      recipientAlert.currentStock = recipientItem.currentStock;
      recipientAlert.daysRemaining = recipientItem.daysRemaining;
      recipientAlert.riskLevel = recipientItem.riskLevel;
      if (recipientItem.riskLevel === 'NORMAL') {
        recipientAlert.resolved = true;
      }
    }

    // 4. Update recipient PHC overall status if it was critical
    const recipientPhc = store.phcs.find((p) => p.id === transfer.toPhcId);
    if (recipientPhc && recipientItem?.riskLevel === 'NORMAL') {
      const remainingCritical = store.alerts.some(
        (a) => a.phcId === recipientPhc.id && a.riskLevel === 'CRITICAL' && !a.resolved
      );
      if (!remainingCritical) {
        recipientPhc.status = 'NORMAL';
      }
    }
  }

  notifySubscribers();
  return { success: true, transfer };
}

function generateEmergencyTransfers(
  phcs: PHC[],
  inventory: InventoryItem[],
  alerts: StockAlert[]
): TransferRecommendation[] {
  const recommendations: TransferRecommendation[] = [];
  const criticalAlerts = alerts.filter((a) => a.riskLevel === 'CRITICAL' && !a.resolved);

  for (const alert of criticalAlerts.slice(0, 12)) {
    const shortagePhc = phcs.find((p) => p.id === alert.phcId);
    if (!shortagePhc) continue;

    // Search for closest donor with surplus
    const donors = inventory
      .filter((item) => item.medicineId === alert.medicineId && item.phcId !== alert.phcId && item.daysRemaining > 15)
      .map((item) => {
        const donorPhc = phcs.find((p) => p.id === item.phcId);
        if (!donorPhc) return null;
        const dist = calculateDistanceKm(
          shortagePhc.latitude,
          shortagePhc.longitude,
          donorPhc.latitude,
          donorPhc.longitude
        );
        return { item, donorPhc, dist, sameDistrict: donorPhc.district === shortagePhc.district };
      })
      .filter(Boolean) as { item: InventoryItem; donorPhc: PHC; dist: number; sameDistrict: boolean }[];

    if (donors.length === 0) continue;

    donors.sort((a, b) => {
      if (a.sameDistrict && !b.sameDistrict) return -1;
      if (!a.sameDistrict && b.sameDistrict) return 1;
      return a.dist - b.dist;
    });

    const best = donors[0];
    const transferQty = Math.round(alert.predictedDemand * 14); // 14-day emergency buffer

    recommendations.push({
      id: `tr-emerg-${alert.phcId}-${best.donorPhc.id}-${alert.medicineId}`,
      fromPhcId: best.donorPhc.id,
      fromPhcName: best.donorPhc.name,
      fromPhcDistrict: best.donorPhc.district,
      toPhcId: shortagePhc.id,
      toPhcName: shortagePhc.name,
      toPhcDistrict: shortagePhc.district,
      state: shortagePhc.state,
      medicineId: alert.medicineId,
      medicineName: alert.medicineName,
      transferQuantity: transferQty,
      distanceKm: best.dist,
      urgency: 'CRITICAL',
      status: 'RECOMMENDED',
      timestamp: new Date().toISOString(),
      aiRationale: `URGENT CORRIDOR: Surge-induced depletion at ${shortagePhc.name}. Rapid mobilization from ${best.donorPhc.name} (${best.dist} km transit). Donor retains safe ${best.item.daysRemaining} days operational buffer.`,
    });
  }

  return recommendations;
}
