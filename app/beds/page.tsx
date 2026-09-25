'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import { Bed, AlertCircle, ShieldAlert, ArrowRight, Activity, Search } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function BedsPage() {
  const { data } = useResilienceStore();
  const phcs = data?.phcs || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  const districts = useMemo(() => Array.from(new Set(phcs.map((p) => p.district))), [phcs]);

  const totalBeds = phcs.reduce((acc, p) => acc + p.totalBeds, 0);
  const occupiedBeds = phcs.reduce((acc, p) => acc + p.occupiedBeds, 0);
  const availableBeds = phcs.reduce((acc, p) => acc + p.availableBeds, 0);
  const totalIcu = phcs.reduce((acc, p) => acc + p.icuBeds, 0);
  const totalOxygen = phcs.reduce((acc, p) => acc + p.oxygenBeds, 0);
  const totalMaternity = phcs.reduce((acc, p) => acc + p.maternityBeds, 0);

  const overallRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const pieData = [
    { name: 'Occupied Beds', value: occupiedBeds, color: '#06B6D4' },
    { name: 'Available Beds', value: availableBeds, color: '#10B981' },
  ];

  const filteredPhcs = useMemo(() => {
    return phcs.filter((p) => {
      if (selectedDistrict !== 'ALL' && p.district !== selectedDistrict) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.district.toLowerCase().includes(q);
      }
      return true;
    });
  }, [phcs, selectedDistrict, searchQuery]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Bed className="w-6 h-6 text-cyan-400" />
              <span>Bed Capacity & Ward Management</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live census tracking across General, Maternity, Pediatric, Oxygen-Supported, and Emergency Stabilization beds.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Total System Beds:</span>
            <strong className="text-white font-bold">{totalBeds}</strong>
          </div>
        </div>

        {/* Capacity Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold">Available Beds</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{availableBeds}</div>
            <span className="text-[10px] text-emerald-400/80">Ready for immediate intake</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold">Occupied Beds</span>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{occupiedBeds}</div>
            <span className="text-[10px] text-cyan-400/80">{overallRate}% system-wide occupancy</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold">Oxygen-Supported Beds</span>
            <div className="text-2xl font-bold text-teal-400 mt-1">{totalOxygen}</div>
            <span className="text-[10px] text-slate-400">Concentrator pipeline active</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold">Maternity & Delivery</span>
            <div className="text-2xl font-bold text-rose-400 mt-1">{totalMaternity}</div>
            <span className="text-[10px] text-slate-400">Labor ward capacity</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold">ICU / High Dependency</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{totalIcu}</div>
            <span className="text-[10px] text-slate-400">Emergency stabilization</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facility name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Districts ({districts.length})</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Facilities Bed Roster Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">PHC Facility</th>
                  <th className="p-3.5">District</th>
                  <th className="p-3.5">Available Beds</th>
                  <th className="p-3.5">Total Beds</th>
                  <th className="p-3.5">Occupancy %</th>
                  <th className="p-3.5">Oxygen Beds</th>
                  <th className="p-3.5">Maternity</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPhcs.slice(0, 25).map((phc) => {
                  const rate = Math.round((phc.occupiedBeds / phc.totalBeds) * 100);
                  const isCritical = rate >= 90;
                  const isHigh = rate >= 75 && rate < 90;

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
                      <td className="p-3.5 font-bold text-white">{phc.availableBeds}</td>
                      <td className="p-3.5 text-slate-400">{phc.totalBeds}</td>
                      <td className="p-3.5">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                            isCritical
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : isHigh
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {rate}%
                        </span>
                      </td>
                      <td className="p-3.5 text-teal-400 font-medium">{phc.oxygenBeds}</td>
                      <td className="p-3.5 text-rose-400 font-medium">{phc.maternityBeds}</td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/phc-network/${phc.id}`}
                          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
