'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import { RiskBadge } from '@/components/RiskBadge';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Bed,
  Users,
  UserCheck,
  Pill,
  Shield,
  Truck,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PhcDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const phcId = params.id as string;
  const { data } = useResilienceStore();

  const phc = useMemo(() => {
    return data?.phcs?.find((p) => p.id === phcId);
  }, [data?.phcs, phcId]);

  const inventory = useMemo(() => {
    return data?.inventory?.filter((i) => i.phcId === phcId) || [];
  }, [data?.inventory, phcId]);

  // 14 days patient trend
  const patientHistory = useMemo(() => {
    // Deterministic mock curve
    if (!phc) return [];
    const points = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const isWeekend = d.getDay() === 0;
      const val = Math.round(phc.dailyFootfall * (isWeekend ? 0.65 : 1.0 + Math.sin(i * 0.7) * 0.2));
      points.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        patients: val,
      });
    }
    return points;
  }, [phc]);

  if (!phc) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center space-y-4">
          <p className="text-slate-400">Loading facility records...</p>
          <Link
            href="/phc-network"
            className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Network Map</span>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const criticalMedicines = inventory.filter((i) => i.riskLevel === 'CRITICAL' || i.riskLevel === 'HIGH_RISK');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Network Map</span>
          </button>
        </div>

        {/* Facility Header Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400 shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
                    {phc.code}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                    {phc.type}
                  </span>
                  <RiskBadge level={phc.status} size="md" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">{phc.name}</h1>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {phc.block}, {phc.district}, {phc.state} · Lat: {phc.latitude}, Lng: {phc.longitude}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/redistribution?shortagePhc=${phc.id}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>Mutual Aid Optimizer</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Bed Occupancy</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {phc.occupiedBeds} / {phc.totalBeds}
              </div>
              <div className="text-[10px] text-cyan-400 font-medium">
                {phc.availableBeds} beds currently available
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Daily OPD Load</div>
              <div className="text-lg font-bold text-white mt-0.5">{phc.dailyFootfall}</div>
              <div className="text-[10px] text-slate-400 font-medium">Patients/day average</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Frontline Staff</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {phc.staffPresent} / {phc.staffTotal}
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">
                {Math.round((phc.staffPresent / phc.staffTotal) * 100)}% on duty today
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Catchment Population</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {phc.populationCovered.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Rural population registered</div>
            </div>
          </div>
        </div>

        {/* 2-Column: Patient Footfall Trend Chart & Ward Capacity Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Footfall Trend Chart */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">14-Day Patient Footfall Telemetry</h3>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Daily OPD Inflow</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={patientHistory}>
                  <defs>
                    <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#patientGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ward Bed Allocations */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Ward Bed Allocations</h3>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Live Census</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">General Medicine Ward</span>
                <span className="text-base font-bold text-white mt-1 block">
                  {Math.round(phc.totalBeds * 0.4)} Beds
                </span>
                <span className="text-[10px] text-emerald-400">Stable capacity</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Maternity & Labor Ward</span>
                <span className="text-base font-bold text-white mt-1 block">{phc.maternityBeds} Beds</span>
                <span className="text-[10px] text-cyan-400">Equipped for delivery</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Oxygen-Supported Ward</span>
                <span className="text-base font-bold text-white mt-1 block">{phc.oxygenBeds} Beds</span>
                <span className="text-[10px] text-teal-400">Concentrator verified</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">ICU / Emergency Stabilization</span>
                <span className="text-base font-bold text-white mt-1 block">{phc.icuBeds} Beds</span>
                <span className="text-[10px] text-amber-400">High acuity monitored</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medicine Inventory Ledger for this PHC */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">Facility Medicine Inventory Ledger</h3>
            </div>
            <span className="text-xs text-slate-400">20 Essential Medicines Tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Medicine & Category</th>
                  <th className="p-3">Current Stock</th>
                  <th className="p-3">Daily Burn</th>
                  <th className="p-3">Days Remaining</th>
                  <th className="p-3">Batch & Expiry</th>
                  <th className="p-3">Risk Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{item.medicineName}</div>
                      <div className="text-[10px] text-cyan-400">{item.category}</div>
                    </td>
                    <td className="p-3 font-semibold text-white">{item.currentStock}</td>
                    <td className="p-3 text-slate-400">{item.dailyConsumption} /day</td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${
                          item.daysRemaining < 3
                            ? 'text-rose-400'
                            : item.daysRemaining <= 7
                            ? 'text-orange-400'
                            : item.daysRemaining <= 14
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {item.daysRemaining} days
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-400">
                      <div>{item.batchNumber}</div>
                      <div className="text-[10px] text-slate-500">Exp: {item.expiryDate}</div>
                    </td>
                    <td className="p-3">
                      <RiskBadge level={item.riskLevel} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      {item.riskLevel !== 'NORMAL' ? (
                        <Link
                          href={`/redistribution?medicine=${item.medicineId}&shortagePhc=${phc.id}`}
                          className="px-2.5 py-1 rounded-md bg-teal-950 text-teal-300 border border-teal-800 hover:bg-teal-900 text-[11px] font-semibold"
                        >
                          Find Donor
                        </Link>
                      ) : (
                        <span className="text-[10px] text-slate-500">Optimal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
