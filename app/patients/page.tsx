'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import {
  Users,
  Baby,
  HeartHandshake,
  ThermometerSnowflake,
  Activity,
  Calendar,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export default function PatientsPage() {
  const { data } = useResilienceStore();
  const phcs = data?.phcs || [];
  const [selectedState, setSelectedState] = useState('ALL');

  const filteredPhcs = useMemo(() => {
    if (selectedState === 'ALL') return phcs;
    return phcs.filter((p) => p.state === selectedState);
  }, [phcs, selectedState]);

  const totalPatients = filteredPhcs.reduce((acc, p) => acc + p.dailyFootfall, 0);
  const isSurge = data?.emergency?.isActive;

  // Hourly curve mock
  const hourlyCurve = [
    { hour: '08:00', general: 45, pediatric: 18, maternal: 12, fever: 15 },
    { hour: '09:00', general: 110, pediatric: 42, maternal: 35, fever: 38 },
    { hour: '10:00', general: 185, pediatric: 70, maternal: 55, fever: 65 },
    { hour: '11:00', general: 210, pediatric: 85, maternal: 60, fever: 80 },
    { hour: '12:00', general: 165, pediatric: 60, maternal: 40, fever: 70 },
    { hour: '13:00', general: 95, pediatric: 35, maternal: 25, fever: 40 },
    { hour: '14:00', general: 120, pediatric: 45, maternal: 30, fever: 50 },
    { hour: '15:00', general: 85, pediatric: 30, maternal: 20, fever: 35 },
    { hour: '16:00', general: 55, pediatric: 20, maternal: 15, fever: 25 },
  ];

  // District comparison
  const districtComparison = useMemo(() => {
    const map: Record<string, number> = {};
    filteredPhcs.forEach((p) => {
      map[p.district] = (map[p.district] || 0) + p.dailyFootfall;
    });
    return Object.entries(map).map(([district, footfall]) => ({
      district,
      footfall,
    }));
  }, [filteredPhcs]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-400" />
              <span>Patient Footfall & OPD Analytics</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time patient census and syndromic surveillance across rural primary healthcare centers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All States</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>
        </div>

        {/* Surge Banner if Active */}
        {isSurge && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-300 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-white">
                  Syndromic Outbreak Warning: +120% Acute Febrile/Respiratory Surge
                </h3>
                <p className="text-xs text-rose-300/90 mt-0.5">
                  Automated surveillance flagged abnormal influx. Oral rehydration and antibiotic demand increased 2.5x.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-md bg-rose-600 text-white font-bold text-xs">
              Protocol Level 3 Active
            </span>
          </div>
        )}

        {/* Triage Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">Total Inflow</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1.5">
              {totalPatients.toLocaleString()}
            </div>
            <span className="text-[10px] text-cyan-400">Daily OPD attendance</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">General Medicine</span>
              <Activity className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1.5">
              {Math.round(totalPatients * 0.55).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">55% of OPD visits</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">Pediatric OPD</span>
              <Baby className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1.5">
              {Math.round(totalPatients * 0.2).toLocaleString()}
            </div>
            <span className="text-[10px] text-blue-400">Under-5 child health</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">Maternal & ANC</span>
              <HeartHandshake className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1.5">
              {Math.round(totalPatients * 0.15).toLocaleString()}
            </div>
            <span className="text-[10px] text-rose-400">Antenatal consultations</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">Acute Febrile Surge</span>
              <ThermometerSnowflake className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1.5">
              {Math.round(totalPatients * (isSurge ? 0.25 : 0.07)).toLocaleString()}
            </div>
            <span className="text-[10px] text-amber-400">Monsoon viral vectors</span>
          </div>
        </div>

        {/* Charts: Hourly Inflow & District Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm">Hourly OPD Arrival Profile</h3>
            <p className="text-xs text-slate-400">
              Peak patient queues concentrate between 09:30 and 12:00 IST.
            </p>
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748B" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="general" fill="#06B6D4" name="General OPD" stackId="a" />
                  <Bar dataKey="pediatric" fill="#3B82F6" name="Pediatric" stackId="a" />
                  <Bar dataKey="maternal" fill="#F43F5E" name="Maternal" stackId="a" />
                  <Bar dataKey="fever" fill="#F59E0B" name="Fever Surge" stackId="a" />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm">District-wise Daily Load Distribution</h3>
            <p className="text-xs text-slate-400">
              Total patients attending primary health centres by administrative district.
            </p>
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                  <XAxis type="number" stroke="#64748B" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="district" type="category" stroke="#64748B" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="footfall" fill="#14B8A6" name="Patients Today" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
