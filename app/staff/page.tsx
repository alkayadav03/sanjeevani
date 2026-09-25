'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import { UserCog, UserCheck, AlertTriangle, CheckCircle2, Shield, Search } from 'lucide-react';

export default function StaffPage() {
  const { data } = useResilienceStore();
  const phcs = data?.phcs || [];
  const [searchQuery, setSearchQuery] = useState('');

  const totalStaff = phcs.reduce((acc, p) => acc + p.staffTotal, 0);
  const presentStaff = phcs.reduce((acc, p) => acc + p.staffPresent, 0);
  const attendanceRate = totalStaff > 0 ? Math.round((presentStaff / totalStaff) * 100) : 0;

  const roles = [
    { role: 'Medical Officers (MBBS/MD)', count: Math.round(totalStaff * 0.22), present: Math.round(presentStaff * 0.22), status: 'Normal' },
    { role: 'Staff Nurses (GNM/BSc)', count: Math.round(totalStaff * 0.38), present: Math.round(presentStaff * 0.38), status: 'Elevated Load' },
    { role: 'Auxiliary Nurse Midwives (ANM)', count: Math.round(totalStaff * 0.2), present: Math.round(presentStaff * 0.2), status: 'Normal' },
    { role: 'Pharmacists', count: Math.round(totalStaff * 0.1), present: Math.round(presentStaff * 0.1), status: 'Normal' },
    { role: 'Laboratory Technicians', count: Math.round(totalStaff * 0.1), present: Math.round(presentStaff * 0.1), status: 'Normal' },
  ];

  const filteredPhcs = phcs.filter((p) => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.contactDoctor.toLowerCase().includes(q) || p.district.toLowerCase().includes(q);
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <UserCog className="w-6 h-6 text-cyan-400" />
              <span>Frontline Staff & Duty Roster</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Duty attendance, cadre allocation, and shift stress indexing across 100 primary healthcare centers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Total Sanctioned Posts:</span>
            <strong className="text-white font-bold">{totalStaff}</strong>
          </div>
        </div>

        {/* Staffing KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold">Total Staff Present</span>
            <div className="text-2xl font-bold text-white mt-1">{presentStaff}</div>
            <span className="text-[10px] text-emerald-400 font-medium">{attendanceRate}% active attendance</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold">Medical Officers Active</span>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{roles[0].present}</div>
            <span className="text-[10px] text-slate-400">Doctors conducting OPD today</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold">Nursing & Midwifery</span>
            <div className="text-2xl font-bold text-teal-400 mt-1">{roles[1].present + roles[2].present}</div>
            <span className="text-[10px] text-teal-400">24x7 delivery & ward coverage</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold">Shift Stress Index</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {data?.emergency?.isActive ? 'HIGH' : 'MODERATE'}
            </div>
            <span className="text-[10px] text-slate-400">Burnout risk monitored</span>
          </div>
        </div>

        {/* Cadre Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {roles.map((r) => (
            <div key={r.role} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <span className="text-slate-400 text-[10px] block font-semibold truncate">{r.role}</span>
              <div className="text-base font-bold text-white">
                {r.present} / {r.count}
              </div>
              <span className="text-[10px] text-cyan-400 block font-medium">
                {Math.round((r.present / r.count) * 100)}% active
              </span>
            </div>
          ))}
        </div>

        {/* Facility Roster Search & Table */}
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facility or Medical Officer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">PHC Facility</th>
                    <th className="p-3.5">District</th>
                    <th className="p-3.5">Medical Officer In Charge</th>
                    <th className="p-3.5">Staff Present</th>
                    <th className="p-3.5">Sanctioned</th>
                    <th className="p-3.5">Duty Ratio</th>
                    <th className="p-3.5 text-right">Emergency Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPhcs.slice(0, 25).map((phc) => {
                    const ratio = Math.round((phc.staffPresent / phc.staffTotal) * 100);
                    return (
                      <tr key={phc.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <Link
                            href={`/phc-network/${phc.id}`}
                            className="font-bold text-white hover:text-cyan-400 transition-colors"
                          >
                            {phc.name}
                          </Link>
                          <div className="text-[10px] text-slate-500">{phc.code}</div>
                        </td>
                        <td className="p-3.5 text-slate-400">{phc.district}</td>
                        <td className="p-3.5 text-white font-medium">{phc.contactDoctor}</td>
                        <td className="p-3.5 font-bold text-emerald-400">{phc.staffPresent}</td>
                        <td className="p-3.5 text-slate-400">{phc.staffTotal}</td>
                        <td className="p-3.5">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                              ratio < 70
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {ratio}%
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono text-cyan-400">{phc.phone}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
