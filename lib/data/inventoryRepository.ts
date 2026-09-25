import { InventoryItem, Medicine, MedicineCategory, RiskLevel } from './types';
import { getStore } from './mockDatabase';

export interface InventoryFilterParams {
  phcId?: string;
  category?: MedicineCategory | 'ALL';
  riskLevel?: RiskLevel | 'ALL';
  searchQuery?: string;
}

export class InventoryRepository {
  static getAll(): InventoryItem[] {
    return getStore().inventory;
  }

  static getMedicines(): Medicine[] {
    return getStore().medicines;
  }

  static getByPhc(phcId: string): InventoryItem[] {
    return getStore().inventory.filter((item) => item.phcId === phcId);
  }

  static getFiltered(params: InventoryFilterParams): InventoryItem[] {
    let list = getStore().inventory;

    if (params.phcId && params.phcId !== 'ALL') {
      list = list.filter((i) => i.phcId === params.phcId);
    }

    if (params.category && params.category !== 'ALL') {
      list = list.filter((i) => i.category === params.category);
    }

    if (params.riskLevel && params.riskLevel !== 'ALL') {
      list = list.filter((i) => i.riskLevel === params.riskLevel);
    }

    if (params.searchQuery && params.searchQuery.trim() !== '') {
      const q = params.searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.medicineName.toLowerCase().includes(q) ||
          i.phcName.toLowerCase().includes(q) ||
          i.batchNumber.toLowerCase().includes(q)
      );
    }

    return list;
  }

  static getAggregatedStockByMedicine() {
    const inv = getStore().inventory;
    const meds = getStore().medicines;

    return meds.map((med) => {
      const items = inv.filter((i) => i.medicineId === med.id);
      const totalStock = items.reduce((acc, i) => acc + i.currentStock, 0);
      const totalDailyDemand = items.reduce((acc, i) => acc + i.dailyConsumption, 0);
      const avgDaysRemaining =
        totalDailyDemand > 0 ? +(totalStock / totalDailyDemand).toFixed(1) : 0;
      const criticalPhcCount = items.filter((i) => i.riskLevel === 'CRITICAL').length;
      const warningPhcCount = items.filter((i) => i.riskLevel === 'WARNING' || i.riskLevel === 'HIGH_RISK').length;

      return {
        medicine: med,
        totalStock,
        totalDailyDemand,
        avgDaysRemaining,
        criticalPhcCount,
        warningPhcCount,
      };
    });
  }
}
