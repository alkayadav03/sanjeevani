# SwasthyaResilience AI — Smart Health & Supply Chain Resilience Platform

> **Hackathon prototype using synthetic/demo healthcare data. Not connected to live government healthcare systems and not intended for clinical decision-making.**

---

## 1. Project Overview

SwasthyaResilience AI is a command-and-control intelligence platform built for Indian Primary Health Centres (PHCs) and district health networks to eliminate medicine stock-outs, anticipate disease surges, and automate peer-to-peer resource redistribution. By coupling 7-day algorithmic demand forecasting with Google Gemini AI root-cause reasoning, the system alerts health administrators to medicine exhaustion before patients arrive at empty dispensary shelves and coordinates mutual aid between neighboring facilities within hours.

---

## 2. Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.17.0 or newer (Tested on Node v24.17.0)
- **npm**: v9.0.0 or newer

### Installation Steps

1. **Navigate to the project directory**:
   ```bash
   cd swasthya-resilience-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your Google Gemini API Key:
   ```env
   GEMINI_API_KEY=AIzaSyYourKeyHere...
   ```
   *(Note: If `GEMINI_API_KEY` is omitted, the platform runs in **Local Algorithmic Expert Fallback** mode so all features, explanations, and demo workflows remain fully interactive without crashing).*

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Production Build & Verification**:
   ```bash
   npm run build
   npm run start
   ```

6. **Run Automated Test Suite (Verifies all 17 routes and Section 9 flow)**:
   ```bash
   node scripts/verify_demo_flow.js
   ```

---

## 3. Demo Role Credentials

The platform features pre-configured, session-authenticated demo roles accessible via `/login` or the role selector in the top navigation bar:

| Role | Designated Facility / Scope | Primary Responsibilities |
| :--- | :--- | :--- |
| **PHC Medical Officer & Staff** | `Kalyanpur PHC (Amritsar)` | Log stock receipts, monitor facility bed wards, view local medicine burn, and request peer aid. |
| **District Chief Medical Officer (CMO)** | `Amritsar District Command Centre` | Approve inter-PHC drug transfers, balance beds across blocks, and coordinate emergency surge response. |
| **State & National Mission Director** | `National Health Mission Directorate` | Track multi-state health telemetry, inspect regional epidemics, and orchestrate Federated AI training rounds. |

- **Demo Email**: `admin@nhm.gov.in`
- **Security Mode**: Pre-authenticated verified session (1-click role selection)

---

## 4. Step-by-Step Hackathon Demo Script (Section 9 Flow)

Follow this numbered script during your live presentation or hackathon judging walkthrough:

1. **Start on a Normal PHC**:
   - Go to `/phc-network` and click on **Adarsh Gram PHC (Amritsar)** (`phc-001`).
   - Notice the status badge is `NORMAL`, bed occupancy is stable (~55%), and all essential medications have >14 days of operational buffer.

2. **Trigger Simulated Emergency**:
   - Click the prominent **🚨 Simulate Health Emergency** button in the top navigation bar or navigate to `/emergency`.
   - The platform instantly mutates the live state across all 100 PHCs.

3. **Confirm Live Metric Surges on the Overview Dashboard**:
   - Navigate to `/dashboard`.
   - Verify that **Patients Today** surges by +120% (e.g. from ~12,300 to ~27,000).
   - Verify **Bed Availability** shrinks dramatically with **Occupancy climbing to 94%+**.
   - Notice the emergency banner activates: `EMERGENCY PROTOCOL ACTIVE: SURGE +120%`.

4. **Verify Algorithmic Demand Forecasting**:
   - Navigate to `/forecasts`.
   - Select **Paracetamol 500mg** at **Kalyanpur PHC (`phc-004`)**.
   - Confirm the 7-day projection curve displays the surge in predicted consumption along with the algorithmic confidence envelope (`±12%`).

5. **Inspect the Critical Stock-out Alert**:
   - Navigate to `/alerts`.
   - Observe the new **CRITICAL (< 3 Days)** stock-out alerts that appeared due to elevated burn rate.
   - Note the calculated days remaining (e.g. 0.8 days left).

6. **Ask Gemini Why? (Server-Side Clinical Reasoning)**:
   - On the critical alert row, click **"Ask Gemini Why?"**.
   - An accessible modal opens, showing a real server-side call to Google Gemini 1.5 Flash.
   - Read the clinical root cause explanation covering patient risk, epidemiological vector, and supply-chain recommendations.
   - Click **"🔊 Read Aloud / सुनें"** to hear the native Web Speech API voice readout.

7. **Review Optimized Mutual Aid Recommendation**:
   - Navigate to `/redistribution`.
   - Notice the algorithm has paired the deficit PHC (`Kalyanpur PHC`) with a nearby surplus donor (`Adarsh Gram PHC`, 18.4 km away).
   - Click **"Why this recommendation?"** to see Gemini explain why this donor facility was chosen without endangering its own local safety buffer.

8. **Execute Chain-of-Custody Workflow**:
   - Click **"Approve Transfer"** (`RECOMMENDED → APPROVED`).
   - Click **"Dispatch"** (`APPROVED → IN TRANSIT`).
   - Click **"Confirm Delivery"** (`IN TRANSIT → RECEIVED`).
   - Watch the recipient facility's stock increase, buffer days rise above 14 days, and its risk level subside from `CRITICAL` back to `NORMAL`.

9. **Run Federated AI Distributed Learning Simulation**:
   - Navigate to `/federated`.
   - Review the honest disclaimer: *"Federated learning prototype simulation. No production privacy guarantee."*
   - Click **"Start Federated Training"**.
   - Watch the animated 4-state node progress (Punjab, Haryana, Rajasthan, Uttar Pradesh).
   - Notice the global model version increment upon aggregation (e.g. `v2.4.1` → `v2.4.2`).

10. **Reset Demo**:
    - Click **"Reset Demo"** in the top navigation bar.
    - Confirm all telemetry, bed occupancy, alerts, and inventory ledger return to the original pristine deterministic seed.

---

## 5. Cross-Border Applicability

While demonstrated in India's Primary Health Centre (PHC) context under the National Health Mission (NHM), SwasthyaResilience AI is architected so regional variables are **pure configuration**, not hardcoded logic:

- **Localization Settings (`/settings`)**:
  - Currency format (₹ INR, R$ BRL for Brazil SUS, R ZAR for South Africa, $ USD).
  - Administrative terminology (`State / District`, `Province / Municipality`, `County / Subdistrict`).
  - Unit of distance (`Kilometers` or `Miles`).
- **Language Dictionary (`lib/i18n.tsx`)**: Easily extended to Portuguese, Russian, or local regional dialects by adding keys to the translation dictionary.

---

## 6. Inclusivity & Accessibility (Section 12)

Designed specifically for rural healthcare workers and under-resourced district command centers:

1. **Bilingual Interface (English & Hindi)**:
   - Instant language toggle in the header and settings (`lib/i18n.tsx`).
   - Translates all primary navigation, risk status badges, KPI labels, and emergency controls.
2. **Low-Literacy & Voice Affordances**:
   - Large, icon-led primary actions on Emergency and Alert screens.
   - Status is identifiable by distinct shape, iconography, and high-contrast color (not text alone).
   - Integrated browser-native **Web Speech API (`SpeechSynthesis`)** allowing frontline nurses and community workers to listen to Gemini AI clinical explanations in Indian English or Hindi.
3. **Low-Connectivity & Offline Resilience**:
   - Client-side `localStorage` caching of the last-known dashboard snapshot ensures the screen never goes blank during poor cellular connectivity in remote villages.
   - Visual **"Offline Cache"** badge automatically indicates when telemetry is served from local cache.
   - Paginated tables and lightweight SVG map markers keep initial page weight lean (<110 kB First Load JS).
4. **WCAG Compliance & High Contrast**:
   - Restrained high-contrast command-center palette. Amber and Rose are reserved strictly for Warning and Critical states.
   - Screen-reader accessible ARIA labels on all icon buttons and dialog modals.

---

## 7. Path to Production (Deployability & Scalability)

To enable rapid deployment into real district health networks within weeks, the platform strictly follows the **Repository Pattern**:

```
UI Components (Next.js Pages)
          │
          ▼
Data-Access Layer (lib/data/*Repository.ts)
   ├── PhcRepository.ts
   ├── InventoryRepository.ts
   ├── AlertRepository.ts
   └── RedistributionRepository.ts
          │
          ▼
Data Store (Current: In-memory seeded singleton)
          │
          ▼ [Upgrade Path: Zero UI code changes]
PostgreSQL / Supabase / Prisma ORM
```

- **How to upgrade**: Replace the in-memory array access inside `*Repository.ts` with SQL queries or Prisma client calls. The 17 Next.js pages and API routes require zero modifications.
- **Database Schema**: The TypeScript interfaces in `lib/data/types.ts` map 1:1 to standard relational tables (`phcs`, `medicines`, `inventory_items`, `stock_alerts`, `transfers`).

---

## 8. Third-Party & Open-Source Components

All third-party libraries used in this build are standard, permissive open-source packages:

| Package | Purpose | License |
| :--- | :--- | :--- |
| **Next.js 14** | Full-stack App Router framework | MIT |
| **React 18** | UI component rendering | MIT |
| **Tailwind CSS** | Command-center styling system | MIT |
| **Lucide React** | Accessible iconography | ISC |
| **Recharts** | Time-series forecasting and telemetry charts | MIT |
| **Leaflet** | GIS OpenStreetMap integration | BSD-2-Clause |
| **Google Generative AI** | Server-side Gemini 1.5 Flash endpoint | Apache-2.0 |

---

## 9. Mandatory Disclaimer

> **Hackathon prototype using synthetic/demo healthcare data. Not connected to live government healthcare systems and not intended for clinical decision-making.**
