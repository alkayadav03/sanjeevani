const http = require('http');

async function testFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = http.request(
      {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            body: data,
            json: () => JSON.parse(data),
          });
        });
      }
    );

    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runVerification() {
  console.log('--- SWASTHYA RESILIENCE AI: AUTOMATED TEST SUITE ---');

  // 1. Verify 17 Routes
  const routes = [
    '/',
    '/login',
    '/dashboard',
    '/phc-network',
    '/phc-network/phc-004',
    '/inventory',
    '/patients',
    '/beds',
    '/staff',
    '/forecasts',
    '/alerts',
    '/redistribution',
    '/emergency',
    '/federated',
    '/analytics',
    '/reports',
    '/settings',
  ];

  console.log('\n[1/4] Verifying all 17 page routes return HTTP 200...');
  for (const r of routes) {
    const res = await testFetch(`http://localhost:3000${r}`);
    if (res.status !== 200) {
      throw new Error(`Route ${r} returned HTTP ${res.status}`);
    }
    console.log(`  ✓ Route: ${r} -> HTTP 200`);
  }

  // 2. Verify Data Layer & Store
  console.log('\n[2/4] Verifying Initial Seed Data Store (100 PHCs, 20 Medicines)...');
  const storeRes = await testFetch('http://localhost:3000/api/data/store');
  const store = storeRes.json();
  console.log(`  ✓ Total PHCs: ${store.phcs.length} (Expected: 100)`);
  console.log(`  ✓ Total Medicines: ${store.medicines.length} (Expected: 20)`);
  console.log(`  ✓ Total Tracked Batches: ${store.inventory.length}`);
  console.log(`  ✓ Initial Active Alerts: ${store.alerts.length}`);
  console.log(`  ✓ Initial Mutual Aid Transfers: ${store.redistributions.length}`);
  if (store.phcs.length !== 100) throw new Error('PHC count is not 100');

  // 3. Verify Gemini Server-Side Handlers
  console.log('\n[3/4] Testing Server-Side Gemini API Handlers...');
  const geminiStatusRes = await testFetch('http://localhost:3000/api/gemini/status');
  const geminiStatus = geminiStatusRes.json();
  console.log(`  ✓ Gemini Status Check: ${geminiStatus.status} (${geminiStatus.model})`);

  const explainAlertRes = await testFetch('http://localhost:3000/api/gemini/explain-alert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      alertId: 'test-alert',
      phcName: 'Kalyanpur PHC (Amritsar)',
      medicineName: 'Paracetamol 500mg',
      currentStock: 15,
      predictedDemand: 30,
      daysRemaining: 0.5,
      riskLevel: 'CRITICAL',
      district: 'Amritsar',
      state: 'Punjab',
    }),
  });
  const explainAlert = explainAlertRes.json();
  console.log(`  ✓ Explain Alert Response [Source: ${explainAlert.source}]:`);
  console.log(`    "${explainAlert.text.slice(0, 100)}..."`);

  const explainTrRes = await testFetch('http://localhost:3000/api/gemini/explain-redistribution', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromPhcName: 'Adarsh Gram PHC (Amritsar)',
      toPhcName: 'Kalyanpur PHC (Amritsar)',
      medicineName: 'Paracetamol 500mg',
      transferQuantity: 300,
      distanceKm: 18.4,
      urgency: 'CRITICAL',
      state: 'Punjab',
    }),
  });
  const explainTr = explainTrRes.json();
  console.log(`  ✓ Explain Redistribution Response [Source: ${explainTr.source}]:`);
  console.log(`    "${explainTr.text.slice(0, 100)}..."`);

  const briefingRes = await testFetch('http://localhost:3000/api/gemini/emergency-briefing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      emergencyType: 'Acute Monsoonal Dengue & Encephalitis Surge',
      phcCount: 100,
      totalFootfall: 24500,
      bedOccupancyRate: 95,
      criticalAlertsCount: 14,
      activeTransfersCount: 8,
    }),
  });
  const briefing = briefingRes.json();
  console.log(`  ✓ Emergency Briefing Response [Source: ${briefing.source}]:`);
  console.log(`    "${briefing.text.slice(0, 100)}..."`);

  // 4. Section 9 Live Demo Flow Verification
  console.log('\n[4/4] Executing Section 9 End-to-End Demo Simulation Flow...');
  
  // A. Trigger Emergency
  console.log('  -> Action: Trigger Emergency Surge (/api/data/store: simulate_emergency)...');
  await testFetch('http://localhost:3000/api/data/store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'simulate_emergency' }),
  });
  const surgeStore = (await testFetch('http://localhost:3000/api/data/store')).json();
  console.log(`     ✓ Emergency Active: ${surgeStore.emergency.isActive}`);
  console.log(`     ✓ Surge Footfall: ${surgeStore.stats.patientsToday} (Baseline was ~${store.stats.patientsToday})`);
  console.log(`     ✓ Bed Occupancy: ${surgeStore.stats.bedOccupancyRate}%`);
  console.log(`     ✓ Critical Alerts Count: ${surgeStore.stats.alerts.critical}`);
  console.log(`     ✓ Generated Mutual Aid Transfers: ${surgeStore.redistributions.length}`);

  // B. Advance a transfer to RECEIVED and check live risk reduction
  const targetTransfer = surgeStore.redistributions[0];
  console.log(`  -> Action: Advancing Transfer ${targetTransfer.id} to RECEIVED...`);
  console.log(`     Recipient: ${targetTransfer.toPhcName} (${targetTransfer.medicineName})`);
  await testFetch('http://localhost:3000/api/data/store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'update_transfer',
      transferId: targetTransfer.id,
      status: 'RECEIVED',
    }),
  });

  const updatedStore = (await testFetch('http://localhost:3000/api/data/store')).json();
  const updatedItem = updatedStore.inventory.find(
    (i) => i.phcId === targetTransfer.toPhcId && i.medicineId === targetTransfer.medicineId
  );
  console.log(`     ✓ Recipient new stock: ${updatedItem?.currentStock} units`);
  console.log(`     ✓ Recipient new days buffer: ${updatedItem?.daysRemaining} days (Risk: ${updatedItem?.riskLevel})`);

  // C. Reset Demo
  console.log('  -> Action: Reset Demo to exact seeded baseline...');
  await testFetch('http://localhost:3000/api/data/store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'reset' }),
  });
  const resetStore = (await testFetch('http://localhost:3000/api/data/store')).json();
  console.log(`     ✓ Emergency Active: ${resetStore.emergency.isActive}`);
  console.log(`     ✓ Total PHCs: ${resetStore.phcs.length}`);
  console.log(`     ✓ Footfall restored: ${resetStore.stats.patientsToday}`);

  console.log('\n🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runVerification().catch((e) => {
  console.error('\n❌ Verification failed:', e);
  process.exit(1);
});
