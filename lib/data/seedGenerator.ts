import { PHC, Medicine, InventoryItem, PatientDailyRecord, RiskLevel, StockAlert, TransferRecommendation } from './types';

// Deterministic PRNG (Mulberry32)
export function createRng(seed = 123456789) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ESSENTIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-01',
    code: 'PCM-500',
    name: 'Paracetamol 500mg',
    genericName: 'Paracetamol Tablets IP',
    category: 'Analgesics & Antipyretics',
    unit: 'Tablets',
    standardDailyDose: 4,
    criticalBufferDays: 7,
    description: 'First-line antipyretic and analgesic for fever, pain, and viral syndromes.',
  },
  {
    id: 'med-02',
    code: 'AMX-500',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Capsules IP',
    category: 'Antibiotics',
    unit: 'Capsules',
    standardDailyDose: 3,
    criticalBufferDays: 10,
    description: 'Broad-spectrum beta-lactam antibiotic for acute respiratory, ENT, and soft tissue infections.',
  },
  {
    id: 'med-03',
    code: 'ORS-PCH',
    name: 'Oral Rehydration Salts (ORS)',
    genericName: 'WHO-formula Oral Rehydration Salts',
    category: 'Rehydration & GI',
    unit: 'Sachets',
    standardDailyDose: 2,
    criticalBufferDays: 14,
    description: 'Electrolyte rehydration solution for acute diarrhoeal diseases and dehydration.',
  },
  {
    id: 'med-04',
    code: 'MET-500',
    name: 'Metformin 500mg',
    genericName: 'Metformin Hydrochloride Tablets IP',
    category: 'Antidiabetic',
    unit: 'Tablets',
    standardDailyDose: 2,
    criticalBufferDays: 14,
    description: 'First-line biguanide oral hypoglycemic agent for Type 2 Diabetes Mellitus.',
  },
  {
    id: 'med-05',
    code: 'AL-ACT',
    name: 'Artemether + Lumefantrine',
    genericName: 'Artemisinin-based Combination (ACT)',
    category: 'Antimalarial',
    unit: 'Strip (6 tabs)',
    standardDailyDose: 1,
    criticalBufferDays: 10,
    description: 'National Vector Borne Disease Control Program first-line treatment for P. falciparum malaria.',
  },
  {
    id: 'med-06',
    code: 'INS-REG',
    name: 'Regular Human Insulin 40IU/ml',
    genericName: 'Human Soluble Insulin Injection',
    category: 'Antidiabetic',
    unit: 'Vials (10ml)',
    standardDailyDose: 1,
    criticalBufferDays: 7,
    description: 'Cold-chain injectable insulin for severe glycemic decompensation and diabetic emergencies.',
  },
  {
    id: 'med-07',
    code: 'AZI-500',
    name: 'Azithromycin 500mg',
    genericName: 'Azithromycin Tablets IP',
    category: 'Antibiotics',
    unit: 'Tablets',
    standardDailyDose: 1,
    criticalBufferDays: 10,
    description: 'Macrolide antibiotic for atypical pneumonia, enteric fever, and genital infections.',
  },
  {
    id: 'med-08',
    code: 'IFA-TAB',
    name: 'Iron & Folic Acid (IFA)',
    genericName: 'Ferrous Sulfate + Folic Acid Tablets',
    category: 'Maternal & Child Health',
    unit: 'Tablets',
    standardDailyDose: 1,
    criticalBufferDays: 21,
    description: 'Anemia Mukt Bharat national supplementation program for pregnant and lactating women.',
  },
  {
    id: 'med-09',
    code: 'OXY-10',
    name: 'Oxytocin 10IU/ml',
    genericName: 'Oxytocin Injection IP',
    category: 'Maternal & Child Health',
    unit: 'Ampoules',
    standardDailyDose: 1,
    criticalBufferDays: 7,
    description: 'Life-saving uterotonic to prevent and treat postpartum hemorrhage (PPH) during childbirth.',
  },
  {
    id: 'med-10',
    code: 'SAL-INH',
    name: 'Salbutamol Inhaler 100mcg',
    genericName: 'Salbutamol Metered Dose Inhaler',
    category: 'Respiratory',
    unit: 'Canister (200 doses)',
    standardDailyDose: 1,
    criticalBufferDays: 10,
    description: 'Short-acting beta-agonist bronchodilator for acute asthma exacerbations and COPD bronchospasm.',
  },
  {
    id: 'med-11',
    code: 'CIP-500',
    name: 'Ciprofloxacin 500mg',
    genericName: 'Ciprofloxacin Tablets IP',
    category: 'Antibiotics',
    unit: 'Tablets',
    standardDailyDose: 2,
    criticalBufferDays: 10,
    description: 'Fluoroquinolone antibiotic for urinary tract infections and invasive diarrhoeal episodes.',
  },
  {
    id: 'med-12',
    code: 'AML-05',
    name: 'Amlodipine 5mg',
    genericName: 'Amlodipine Besylate Tablets IP',
    category: 'Cardiovascular',
    unit: 'Tablets',
    standardDailyDose: 1,
    criticalBufferDays: 14,
    description: 'Dihydropyridine calcium channel blocker for primary essential hypertension.',
  },
  {
    id: 'med-13',
    code: 'ATE-50',
    name: 'Atenolol 50mg',
    genericName: 'Atenolol Tablets IP',
    category: 'Cardiovascular',
    unit: 'Tablets',
    standardDailyDose: 1,
    criticalBufferDays: 14,
    description: 'Beta-1 adrenergic receptor antagonist for ischemic heart disease and secondary hypertension.',
  },
  {
    id: 'med-14',
    code: 'ALB-400',
    name: 'Albendazole 400mg',
    genericName: 'Albendazole Chewable Tablets IP',
    category: 'Rehydration & GI',
    unit: 'Tablets',
    standardDailyDose: 1,
    criticalBufferDays: 14,
    description: 'National Deworming Day broad-spectrum anthelmintic for soil-transmitted helminths.',
  },
  {
    id: 'med-15',
    code: 'ZNC-20',
    name: 'Zinc Sulfate 20mg',
    genericName: 'Zinc Sulfate Dispersible Tablets IP',
    category: 'Rehydration & GI',
    unit: 'Tablets',
    standardDailyDose: 1,
    criticalBufferDays: 14,
    description: 'Essential micronutrient co-prescribed with ORS for pediatric diarrhoeal recovery.',
  },
  {
    id: 'med-16',
    code: 'CTX-1G',
    name: 'Ceftriaxone Injection 1g',
    genericName: 'Ceftriaxone Sodium Injection IP',
    category: 'Antibiotics',
    unit: 'Vials',
    standardDailyDose: 1,
    criticalBufferDays: 7,
    description: 'Third-generation cephalosporin for severe bacterial sepsis, meningitis, and complicated pneumonia.',
  },
  {
    id: 'med-17',
    code: 'DIC-GEL',
    name: 'Diclofenac Gel 30g',
    genericName: 'Diclofenac Diethylamine Topical Gel',
    category: 'Analgesics & Antipyretics',
    unit: 'Tubes',
    standardDailyDose: 1,
    criticalBufferDays: 14,
    description: 'Topical anti-inflammatory analgesic for musculoskeletal trauma and osteoarthritic aches.',
  },
  {
    id: 'med-18',
    code: 'TT-VAX',
    name: 'Tetanus & Diphtheria (Td) Vaccine',
    genericName: 'Adsorbed Td Vaccine Injection',
    category: 'Maternal & Child Health',
    unit: 'Vials (10 doses)',
    standardDailyDose: 1,
    criticalBufferDays: 10,
    description: 'Universal Immunization Program vaccine for maternal tetanus prevention and wound prophylaxis.',
  },
  {
    id: 'med-19',
    code: 'PAN-40',
    name: 'Pantoprazole 40mg',
    genericName: 'Pantoprazole Sodium Tablets IP',
    category: 'Rehydration & GI',
    unit: 'Tablets',
    standardDailyDose: 1,
    criticalBufferDays: 14,
    description: 'Proton pump inhibitor for gastroesophageal reflux disease, gastritis, and peptic ulcers.',
  },
  {
    id: 'med-20',
    code: 'ATV-10',
    name: 'Atorvastatin 10mg',
    genericName: 'Atorvastatin Calcium Tablets IP',
    category: 'Cardiovascular',
    unit: 'Tablets',
    standardDailyDose: 1,
    criticalBufferDays: 14,
    description: 'HMG-CoA reductase inhibitor for lipid dyslipidemia and cardiovascular event reduction.',
  },
];

interface DistrictGeo {
  state: string;
  district: string;
  centerLat: number;
  centerLng: number;
}

const DISTRICT_CENTERS: DistrictGeo[] = [
  // Punjab
  { state: 'Punjab', district: 'Amritsar', centerLat: 31.634, centerLng: 74.8723 },
  { state: 'Punjab', district: 'Ludhiana', centerLat: 30.901, centerLng: 75.8573 },
  { state: 'Punjab', district: 'Jalandhar', centerLat: 31.326, centerLng: 75.5762 },
  // Haryana
  { state: 'Haryana', district: 'Gurugram', centerLat: 28.4595, centerLng: 77.0266 },
  { state: 'Haryana', district: 'Rohtak', centerLat: 28.8955, centerLng: 76.6066 },
  { state: 'Haryana', district: 'Karnal', centerLat: 29.6857, centerLng: 76.9905 },
  // Rajasthan
  { state: 'Rajasthan', district: 'Jaipur', centerLat: 26.9124, centerLng: 75.7873 },
  { state: 'Rajasthan', district: 'Jodhpur', centerLat: 26.2389, centerLng: 73.0243 },
  { state: 'Rajasthan', district: 'Alwar', centerLat: 27.553, centerLng: 76.6346 },
  // Uttar Pradesh
  { state: 'Uttar Pradesh', district: 'Varanasi', centerLat: 25.3176, centerLng: 82.9739 },
  { state: 'Uttar Pradesh', district: 'Lucknow', centerLat: 26.8467, centerLng: 80.9462 },
  { state: 'Uttar Pradesh', district: 'Kanpur', centerLat: 26.4499, centerLng: 80.3319 },
];

const PHC_NAMES_PREFIX = [
  'Adarsh Gram', 'Kalyanpur', 'Ramnagar', 'Shivpur', 'Govindpur',
  'Krishnapur', 'Mohanpur', 'Fatehpur', 'Shanti Nagar', 'Sundarpur',
  'Anandpur', 'Haripur', 'Durgapur', 'Chandanpur', 'Bhimpur',
  'Laxmipur', 'Ganeshpur', 'Sitapur', 'Rampur', 'Madhupur'
];

const DOCTOR_NAMES = [
  'Dr. Rajesh Sharma, MBBS', 'Dr. Sunita Verma, MD', 'Dr. Amit Patel, MBBS',
  'Dr. Priya Nair, DGO', 'Dr. Vikram Singh, MBBS', 'Dr. Neha Gupta, DCH',
  'Dr. Manoj Tiwari, MBBS', 'Dr. Kavita Joshi, MD', 'Dr. Suresh Yadav, MBBS',
  'Dr. Pooja Mishra, MBBS', 'Dr. Arvind Rao, MBBS', 'Dr. Ananya Das, DGO'
];

export interface SeedDataResult {
  phcs: PHC[];
  medicines: Medicine[];
  inventory: InventoryItem[];
  alerts: StockAlert[];
  redistributions: TransferRecommendation[];
  history: Record<string, PatientDailyRecord[]>; // keyed by phcId
}

export function generateSeedData(): SeedDataResult {
  const rng = createRng(42); // Deterministic seed

  const phcs: PHC[] = [];
  const inventory: InventoryItem[] = [];
  const history: Record<string, PatientDailyRecord[]> = {};

  let phcCounter = 1;

  for (const d of DISTRICT_CENTERS) {
    // 8-9 PHCs per district to total 100 PHCs
    const countInDistrict = d.district === 'Amritsar' || d.district === 'Lucknow' || d.district === 'Jaipur' || d.district === 'Gurugram' ? 9 : 8;

    for (let i = 0; i < countInDistrict; i++) {
      const id = `phc-${String(phcCounter).padStart(3, '0')}`;
      const nameIndex = (phcCounter - 1) % PHC_NAMES_PREFIX.length;
      const phcName = `${PHC_NAMES_PREFIX[nameIndex]} PHC (${d.district})`;
      const block = `${d.district} Block ${String.fromCharCode(65 + (i % 5))}`;

      // Distribute coordinates in ~15-25 km radius around district center
      const latOffset = (rng() - 0.5) * 0.35;
      const lngOffset = (rng() - 0.5) * 0.35;
      const latitude = +(d.centerLat + latOffset).toFixed(5);
      const longitude = +(d.centerLng + lngOffset).toFixed(5);

      const totalBeds = Math.floor(12 + rng() * 18); // 12 to 30 beds
      const occupiedBeds = Math.floor(totalBeds * (0.45 + rng() * 0.4)); // 45% - 85% occupancy
      const availableBeds = Math.max(0, totalBeds - occupiedBeds);
      const icuBeds = Math.floor(2 + rng() * 3);
      const oxygenBeds = Math.floor(4 + rng() * 6);
      const maternityBeds = Math.floor(4 + rng() * 6);

      const staffTotal = Math.floor(8 + rng() * 10); // 8 - 18 staff
      const staffPresent = Math.floor(staffTotal * (0.7 + rng() * 0.28));

      const dailyFootfall = Math.floor(60 + rng() * 120); // 60 - 180 patients/day
      const populationCovered = Math.floor(22000 + rng() * 28000); // 22,000 - 50,000

      const docIndex = (phcCounter + i) % DOCTOR_NAMES.length;
      const doctor = DOCTOR_NAMES[docIndex];
      const phone = `+91 ${98000 + Math.floor(rng() * 1999)} ${10000 + Math.floor(rng() * 89999)}`;

      // Deterministic initial status distribution
      let status: RiskLevel = 'NORMAL';
      if (phcCounter === 4 || phcCounter === 18 || phcCounter === 45) {
        status = 'CRITICAL';
      } else if (phcCounter === 12 || phcCounter === 29 || phcCounter === 67 || phcCounter === 83) {
        status = 'HIGH_RISK';
      } else if (phcCounter % 7 === 0) {
        status = 'WARNING';
      }

      const phcRecord: PHC = {
        id,
        code: `PHC-${d.state.slice(0, 2).toUpperCase()}-${String(phcCounter).padStart(3, '0')}`,
        name: phcName,
        type: i === 0 ? 'CHC' : 'PHC',
        state: d.state,
        district: d.district,
        block,
        latitude,
        longitude,
        totalBeds,
        occupiedBeds,
        availableBeds,
        icuBeds,
        oxygenBeds,
        maternityBeds,
        staffTotal,
        staffPresent,
        dailyFootfall,
        populationCovered,
        status,
        contactDoctor: doctor,
        phone,
      };

      phcs.push(phcRecord);

      // Generate 90 days patient history for this PHC
      const phcHistory: PatientDailyRecord[] = [];
      for (let day = 89; day >= 0; day--) {
        const dDate = new Date();
        dDate.setDate(dDate.getDate() - day);
        const dateStr = dDate.toISOString().split('T')[0];

        // Day of week seasonality: Mondays higher, Sundays lower
        const dayOfWeek = dDate.getDay();
        const dowMultiplier = dayOfWeek === 1 ? 1.25 : dayOfWeek === 0 ? 0.6 : 1.0;
        const noise = 0.85 + rng() * 0.3;
        const totalP = Math.round(dailyFootfall * dowMultiplier * noise);

        phcHistory.push({
          date: dateStr,
          totalPatients: totalP,
          opdGeneral: Math.round(totalP * 0.55),
          opdPediatric: Math.round(totalP * 0.2),
          opdMaternal: Math.round(totalP * 0.15),
          feverRespiratorySurge: Math.round(totalP * 0.07),
          emergencyTrauma: Math.round(totalP * 0.03),
        });
      }
      history[id] = phcHistory;

      // Generate inventory for each medicine for this PHC
      for (const med of ESSENTIAL_MEDICINES) {
        // Base consumption depends on footfall
        const baseDaily = Math.max(2, Math.round((dailyFootfall / 8) * (0.6 + rng() * 0.8)));

        // Create specific conditions for demo:
        // PHC-004 has severe shortage of Paracetamol & Amoxicillin (CRITICAL)
        // PHC-001 (nearby in Amritsar) has large SURPLUS of Paracetamol & Amoxicillin!
        let daysStock = Math.floor(15 + rng() * 25); // default normal >14 days

        if (id === 'phc-004' && (med.id === 'med-01' || med.id === 'med-02')) {
          daysStock = 1.8; // < 3 days -> CRITICAL
        } else if (id === 'phc-001' && (med.id === 'med-01' || med.id === 'med-02')) {
          daysStock = 45; // large surplus to redistribute!
        } else if (id === 'phc-018' && med.id === 'med-09') {
          daysStock = 2.2; // Oxytocin critical
        } else if (id === 'phc-012' && med.id === 'med-06') {
          daysStock = 5.0; // Insulin high risk
        } else if (rng() < 0.05) {
          daysStock = +(2.5 + rng() * 4).toFixed(1); // some natural high risks
        } else if (rng() < 0.12) {
          daysStock = +(7 + rng() * 6).toFixed(1); // some warnings (7-14d)
        }

        const currentStock = Math.max(5, Math.round(baseDaily * daysStock));
        const daysRemaining = +(currentStock / baseDaily).toFixed(1);

        let itemRisk: RiskLevel = 'NORMAL';
        if (daysRemaining < 3) itemRisk = 'CRITICAL';
        else if (daysRemaining <= 7) itemRisk = 'HIGH_RISK';
        else if (daysRemaining <= 14) itemRisk = 'WARNING';

        const batchYear = 2026 + Math.floor(rng() * 2);
        const batchMonth = String(1 + Math.floor(rng() * 12)).padStart(2, '0');

        inventory.push({
          id: `inv-${id}-${med.id}`,
          phcId: id,
          phcName: phcRecord.name,
          medicineId: med.id,
          medicineName: med.name,
          category: med.category,
          currentStock,
          dailyConsumption: baseDaily,
          minimumThreshold: baseDaily * med.criticalBufferDays,
          batchNumber: `BAT-${d.state.slice(0, 2).toUpperCase()}-${2026}-${Math.floor(100 + rng() * 900)}`,
          expiryDate: `${batchYear}-${batchMonth}-28`,
          daysRemaining,
          riskLevel: itemRisk,
          lastRestocked: '2026-08-15',
        });
      }

      phcCounter++;
      if (phcCounter > 100) break;
    }
    if (phcCounter > 100) break;
  }

  // Derive initial stock alerts (< 14 days)
  const alerts: StockAlert[] = [];
  for (const item of inventory) {
    if (item.riskLevel !== 'NORMAL') {
      const phc = phcs.find((p) => p.id === item.phcId);
      alerts.push({
        id: `alert-${item.id}`,
        phcId: item.phcId,
        phcName: item.phcName,
        district: phc?.district || 'Unknown',
        state: phc?.state || 'Unknown',
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

  // Generate initial transfer recommendations
  // Shortage PHCs paired with nearest surplus PHC in same district/state
  const redistributions = computeInitialTransfers(phcs, inventory, alerts);

  return {
    phcs,
    medicines: ESSENTIAL_MEDICINES,
    inventory,
    alerts,
    redistributions,
    history,
  };
}

// Haversine distance calculator between two coordinates (km)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function computeInitialTransfers(
  phcs: PHC[],
  inventory: InventoryItem[],
  alerts: StockAlert[]
): TransferRecommendation[] {
  const recommendations: TransferRecommendation[] = [];
  const criticalOrHighAlerts = alerts.filter(
    (a) => (a.riskLevel === 'CRITICAL' || a.riskLevel === 'HIGH_RISK') && !a.resolved
  );

  for (const alert of criticalOrHighAlerts.slice(0, 8)) {
    const shortagePhc = phcs.find((p) => p.id === alert.phcId);
    if (!shortagePhc) continue;

    // Find PHCs in same state/district with surplus of same medicine (daysRemaining > 25)
    const candidates = inventory
      .filter(
        (item) =>
          item.medicineId === alert.medicineId &&
          item.phcId !== alert.phcId &&
          item.daysRemaining > 20
      )
      .map((item) => {
        const donorPhc = phcs.find((p) => p.id === item.phcId);
        if (!donorPhc) return null;
        const dist = calculateDistanceKm(
          shortagePhc.latitude,
          shortagePhc.longitude,
          donorPhc.latitude,
          donorPhc.longitude
        );
        // Prefer same district
        const sameDistrict = donorPhc.district === shortagePhc.district;
        return { item, donorPhc, dist, sameDistrict };
      })
      .filter(Boolean) as { item: InventoryItem; donorPhc: PHC; dist: number; sameDistrict: boolean }[];

    if (candidates.length === 0) continue;

    // Sort by same district first, then lowest distance
    candidates.sort((a, b) => {
      if (a.sameDistrict && !b.sameDistrict) return -1;
      if (!a.sameDistrict && b.sameDistrict) return 1;
      return a.dist - b.dist;
    });

    const best = candidates[0];
    const transferQty = Math.round(alert.predictedDemand * 10); // 10 days supply

    recommendations.push({
      id: `tr-${alert.phcId}-${best.donorPhc.id}-${alert.medicineId}`,
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
      urgency: alert.riskLevel,
      status: 'RECOMMENDED',
      timestamp: new Date().toISOString(),
      aiRationale: `Direct peer-to-peer route via NH/SH corridor (${best.dist} km). ${best.donorPhc.name} has ${best.item.daysRemaining} days surplus buffer, safe to dispatch ${transferQty} units without compromising local maternal/childcare or emergency readiness.`,
    });
  }

  return recommendations;
}
