import { PHC, RiskLevel } from './types';
import { getStore } from './mockDatabase';

export interface PhcFilterParams {
  state?: string;
  district?: string;
  status?: RiskLevel | 'ALL';
  searchQuery?: string;
}

export class PhcRepository {
  static getAll(): PHC[] {
    return getStore().phcs;
  }

  static getById(id: string): PHC | undefined {
    return getStore().phcs.find((p) => p.id === id);
  }

  static getFiltered(params: PhcFilterParams): PHC[] {
    let list = getStore().phcs;

    if (params.state && params.state !== 'ALL') {
      list = list.filter((p) => p.state.toLowerCase() === params.state!.toLowerCase());
    }

    if (params.district && params.district !== 'ALL') {
      list = list.filter((p) => p.district.toLowerCase() === params.district!.toLowerCase());
    }

    if (params.status && params.status !== 'ALL') {
      list = list.filter((p) => p.status === params.status);
    }

    if (params.searchQuery && params.searchQuery.trim() !== '') {
      const q = params.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q)
      );
    }

    return list;
  }

  static getStates(): string[] {
    const set = new Set(getStore().phcs.map((p) => p.state));
    return Array.from(set);
  }

  static getDistricts(state?: string): string[] {
    let list = getStore().phcs;
    if (state && state !== 'ALL') {
      list = list.filter((p) => p.state.toLowerCase() === state.toLowerCase());
    }
    const set = new Set(list.map((p) => p.district));
    return Array.from(set);
  }

  static getStats() {
    const phcs = getStore().phcs;
    const total = phcs.length;
    const critical = phcs.filter((p) => p.status === 'CRITICAL').length;
    const highRisk = phcs.filter((p) => p.status === 'HIGH_RISK').length;
    const warning = phcs.filter((p) => p.status === 'WARNING').length;
    const normal = phcs.filter((p) => p.status === 'NORMAL').length;

    const totalBeds = phcs.reduce((acc, p) => acc + p.totalBeds, 0);
    const availableBeds = phcs.reduce((acc, p) => acc + p.availableBeds, 0);
    const occupiedBeds = phcs.reduce((acc, p) => acc + p.occupiedBeds, 0);
    const patientsToday = phcs.reduce((acc, p) => acc + p.dailyFootfall, 0);
    const staffTotal = phcs.reduce((acc, p) => acc + p.staffTotal, 0);
    const staffPresent = phcs.reduce((acc, p) => acc + p.staffPresent, 0);

    return {
      total,
      critical,
      highRisk,
      warning,
      normal,
      totalBeds,
      availableBeds,
      occupiedBeds,
      bedOccupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
      patientsToday,
      staffTotal,
      staffPresent,
      staffAttendanceRate: staffTotal > 0 ? Math.round((staffPresent / staffTotal) * 100) : 0,
    };
  }
}
