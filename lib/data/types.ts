export type RiskLevel = 'NORMAL' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL';

export type UserRole = 'phc_staff' | 'district_admin' | 'state_admin';

export type MedicineCategory =
  | 'Antibiotics'
  | 'Analgesics & Antipyretics'
  | 'Cardiovascular'
  | 'Maternal & Child Health'
  | 'Antidiabetic'
  | 'Antimalarial'
  | 'Respiratory'
  | 'Rehydration & GI';

export interface Medicine {
  id: string;
  code: string;
  name: string;
  genericName: string;
  category: MedicineCategory;
  unit: string;
  standardDailyDose: number;
  criticalBufferDays: number;
  description: string;
}

export interface PHC {
  id: string;
  code: string;
  name: string;
  type: 'PHC' | 'CHC' | 'SubCentre';
  state: string;
  district: string;
  block: string;
  latitude: number;
  longitude: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  icuBeds: number;
  oxygenBeds: number;
  maternityBeds: number;
  staffTotal: number;
  staffPresent: number;
  dailyFootfall: number;
  populationCovered: number;
  status: RiskLevel;
  contactDoctor: string;
  phone: string;
  isEmergencySurge?: boolean;
}

export interface InventoryItem {
  id: string;
  phcId: string;
  phcName: string;
  medicineId: string;
  medicineName: string;
  category: MedicineCategory;
  currentStock: number;
  dailyConsumption: number;
  minimumThreshold: number;
  batchNumber: string;
  expiryDate: string;
  daysRemaining: number;
  riskLevel: RiskLevel;
  lastRestocked: string;
}

export interface StockAlert {
  id: string;
  phcId: string;
  phcName: string;
  district: string;
  state: string;
  medicineId: string;
  medicineName: string;
  currentStock: number;
  predictedDemand: number;
  daysRemaining: number;
  riskLevel: RiskLevel;
  timestamp: string;
  aiExplanation?: string;
  resolved: boolean;
}

export type TransferStatus = 'RECOMMENDED' | 'APPROVED' | 'IN_TRANSIT' | 'RECEIVED' | 'REJECTED';

export interface TransferRecommendation {
  id: string;
  fromPhcId: string;
  fromPhcName: string;
  fromPhcDistrict: string;
  toPhcId: string;
  toPhcName: string;
  toPhcDistrict: string;
  state: string;
  medicineId: string;
  medicineName: string;
  transferQuantity: number;
  distanceKm: number;
  urgency: RiskLevel;
  status: TransferStatus;
  timestamp: string;
  aiRationale?: string;
}

export interface ForecastPoint {
  dayNumber: number;
  date: string;
  dayName: string;
  predictedDemand: number;
  lowerBound: number;
  upperBound: number;
  baselineDemand: number;
  emergencyDemand?: number;
}

export interface PatientDailyRecord {
  date: string;
  totalPatients: number;
  opdGeneral: number;
  opdPediatric: number;
  opdMaternal: number;
  feverRespiratorySurge: number;
  emergencyTrauma: number;
}

export interface BedWardStatus {
  wardType: 'General' | 'Maternity' | 'Pediatric' | 'Emergency/Trauma' | 'ICU/Oxygen';
  total: number;
  occupied: number;
  available: number;
  occupancyRate: number;
}

export interface StaffRoster {
  roleName: string;
  sanctioned: number;
  present: number;
  onLeave: number;
  stressLevel: 'Normal' | 'Moderate' | 'Severe';
}

export interface FederatedNode {
  id: string;
  stateName: string;
  phcCount: number;
  localSamples: number;
  epochsTrained: number;
  status: 'IDLE' | 'TRAINING' | 'SYNCING' | 'READY';
  localAccuracy: number;
  loss: number;
}

export interface FederatedState {
  globalModelVersion: string;
  round: number;
  isTraining: boolean;
  progress: number;
  nodes: FederatedNode[];
  lastAggregation: string;
}

export type DemoPreset =
  | 'NORMAL'
  | 'MEDICINE_SHORTAGE'
  | 'PATIENT_SURGE'
  | 'BED_CRISIS'
  | 'STAFF_SHORTAGE'
  | 'HEALTH_EMERGENCY';

export interface EmergencyState {
  isActive: boolean;
  severity: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  type: string;
  description: string;
  startedAt: string | null;
  impactMultiplier: {
    footfall: number;
    medicine: number;
    beds: number;
    staffStress: number;
  };
  timelineStep: number;
  briefing?: string;
}
