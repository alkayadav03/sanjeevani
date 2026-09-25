import { StockAlert, RiskLevel } from './types';
import { getStore } from './mockDatabase';

export class AlertRepository {
  static getAll(): StockAlert[] {
    return getStore().alerts;
  }

  static getActive(): StockAlert[] {
    return getStore().alerts.filter((a) => !a.resolved);
  }

  static getByRisk(risk: RiskLevel): StockAlert[] {
    return getStore().alerts.filter((a) => a.riskLevel === risk && !a.resolved);
  }

  static getByPhc(phcId: string): StockAlert[] {
    return getStore().alerts.filter((a) => a.phcId === phcId && !a.resolved);
  }

  static getAlertById(id: string): StockAlert | undefined {
    return getStore().alerts.find((a) => a.id === id);
  }

  static setAiExplanation(alertId: string, explanation: string) {
    const alert = getStore().alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.aiExplanation = explanation;
    }
  }

  static getSummary() {
    const alerts = getStore().alerts.filter((a) => !a.resolved);
    return {
      totalActive: alerts.length,
      critical: alerts.filter((a) => a.riskLevel === 'CRITICAL').length,
      highRisk: alerts.filter((a) => a.riskLevel === 'HIGH_RISK').length,
      warning: alerts.filter((a) => a.riskLevel === 'WARNING').length,
    };
  }
}
