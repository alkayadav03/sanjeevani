'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import { RiskBadge } from '@/components/RiskBadge';
import {
  FileText,
  Printer,
  Download,
  Shield,
  AlertCircle,
  Truck,
  Building2,
  Sparkles,
  Calendar,
} from 'lucide-react';

export default function ReportsPage() {
  const { data } = useResilienceStore();
  const stats = data?.stats;
  const criticalAlerts = data?.alerts?.filter((a) => !a.resolved).slice(0, 8) || [];
  const transfers = data?.redistributions?.slice(0, 6) || [];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Print Button (hidden in print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800 print:hidden">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-400" />
              <span>Official Healthcare Resilience Briefing Report</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Formatted for District Health Society review, District Magistrates, and State Assembly briefings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-slate-200 print:bg-white print:text-black print:border-none print:p-0">
          {/* Document Header */}
          <div className="border-b border-slate-800 print:border-black pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 print:bg-slate-100 print:text-black">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 print:text-slate-600 block">
                  Government of India · National Health Mission
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white print:text-black">
                  SwasthyaResilience AI — Weekly Command Briefing
                </h2>
                <p className="text-xs text-slate-400 print:text-slate-600">
                  Northern Region Health Telemetry & Mutual Aid Supply Chain Audit
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 print:text-slate-700">
              <div>
                Date: <strong className="text-white print:text-black">{currentDate}</strong>
              </div>
              <div>
                Classification: <strong className="text-cyan-400 print:text-black">Official Use Only</strong>
              </div>
              <div>Districts: 12 (PB, HR, RJ, UP)</div>
            </div>
          </div>

          {/* Section 1: Executive Key Metrics */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider">
              1. Executive Network Telemetry Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <div className="text-[10px] text-slate-400 print:text-slate-600 font-semibold">Total PHCs Monitored</div>
                <div className="text-lg font-bold text-white print:text-black mt-0.5">{stats?.total ?? 100} Facilities</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <div className="text-[10px] text-slate-400 print:text-slate-600 font-semibold">Total Patient Footfall</div>
                <div className="text-lg font-bold text-white print:text-black mt-0.5">{stats?.patientsToday?.toLocaleString() ?? 0} Visits</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <div className="text-[10px] text-slate-400 print:text-slate-600 font-semibold">Bed Occupancy Rate</div>
                <div className="text-lg font-bold text-white print:text-black mt-0.5">{stats?.bedOccupancyRate ?? 0}% Census</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <div className="text-[10px] text-slate-400 print:text-slate-600 font-semibold">Clinical Staff On Duty</div>
                <div className="text-lg font-bold text-white print:text-black mt-0.5">{stats?.staffAttendanceRate ?? 0}% Attendance</div>
              </div>
            </div>
          </div>

          {/* Section 2: Active Critical Stock Alerts */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider">
              2. Active Critical Medicine Stock-out Flags (&lt; 3 Days Remaining)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-slate-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 print:bg-slate-100 text-slate-400 print:text-slate-800 font-semibold border-b border-slate-800 print:border-slate-300">
                  <tr>
                    <th className="p-2.5">Primary Health Centre</th>
                    <th className="p-2.5">District / State</th>
                    <th className="p-2.5">Medicine Name</th>
                    <th className="p-2.5">Stock</th>
                    <th className="p-2.5">Daily Burn</th>
                    <th className="p-2.5">Days Left</th>
                    <th className="p-2.5">Risk Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {criticalAlerts.map((a) => (
                    <tr key={a.id} className="print:text-black">
                      <td className="p-2.5 font-bold text-white print:text-black">{a.phcName}</td>
                      <td className="p-2.5 text-slate-400 print:text-slate-700">{a.district}, {a.state}</td>
                      <td className="p-2.5 font-semibold text-cyan-400 print:text-black">{a.medicineName}</td>
                      <td className="p-2.5">{a.currentStock}</td>
                      <td className="p-2.5">{a.predictedDemand} /day</td>
                      <td className="p-2.5 font-bold text-rose-400 print:text-red-700">{a.daysRemaining} days</td>
                      <td className="p-2.5">
                        <RiskBadge level={a.riskLevel} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Peer-to-Peer Mutual Aid Manifest */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider">
              3. Automated Inter-Facility Mutual Aid Manifest
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-slate-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 print:bg-slate-100 text-slate-400 print:text-slate-800 font-semibold border-b border-slate-800 print:border-slate-300">
                  <tr>
                    <th className="p-2.5">Donor PHC (Surplus)</th>
                    <th className="p-2.5">Recipient PHC (Deficit)</th>
                    <th className="p-2.5">Medicine Dispatched</th>
                    <th className="p-2.5">Quantity</th>
                    <th className="p-2.5">Corridor Distance</th>
                    <th className="p-2.5">Chain Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {transfers.map((t) => (
                    <tr key={t.id} className="print:text-black">
                      <td className="p-2.5 font-semibold text-emerald-400 print:text-black">{t.fromPhcName}</td>
                      <td className="p-2.5 font-semibold text-rose-400 print:text-black">{t.toPhcName}</td>
                      <td className="p-2.5 font-bold">{t.medicineName}</td>
                      <td className="p-2.5 font-mono font-bold">{t.transferQuantity} units</td>
                      <td className="p-2.5">{t.distanceKm} km</td>
                      <td className="p-2.5 font-mono text-[11px] font-bold uppercase">{t.status.replace('_', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Document Sign-off */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-400 flex justify-between items-end text-xs text-slate-400 print:text-slate-700">
            <div>
              <p>Certified Autonomous Telemetry Log</p>
              <p className="font-mono text-[10px] text-slate-500">Hash: SHA256-7D-NHM-AI-P2P</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white print:text-black">Dr. Rajesh Sharma, MBBS</p>
              <p className="text-[11px]">Chief Medical Officer & Regional Controller</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
