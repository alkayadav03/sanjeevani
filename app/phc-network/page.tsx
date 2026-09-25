'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import { PHC, RiskLevel } from '@/lib/data/types';
import { RiskBadge } from '@/components/RiskBadge';
import {
  MapPin,
  Filter,
  Search,
  Building,
  Bed,
  Users,
  UserCheck,
  ArrowRight,
  Phone,
  Pill,
  ExternalLink,
} from 'lucide-react';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-slate-900/60 rounded-2xl border border-slate-800">
      <p className="text-xs text-cyan-400 animate-pulse font-mono">
        Loading GIS telemetry layer across 100 PHCs...
      </p>
    </div>
  ),
});

export default function PhcNetworkPage() {
  const { data } = useResilienceStore();
  const phcs = data?.phcs || [];

  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhc, setSelectedPhc] = useState<PHC | null>(null);

  // States & Districts
  const states = useMemo(() => Array.from(new Set(phcs.map((p) => p.state))), [phcs]);
  const districts = useMemo(() => {
    let list = phcs;
    if (selectedState !== 'ALL') {
      list = list.filter((p) => p.state === selectedState);
    }
    return Array.from(new Set(list.map((p) => p.district)));
  }, [phcs, selectedState]);

  // Filtered PHCs
  const filteredPhcs = useMemo(() => {
    return phcs.filter((p) => {
      if (selectedState !== 'ALL' && p.state !== selectedState) return false;
      if (selectedDistrict !== 'ALL' && p.district !== selectedDistrict) return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [phcs, selectedState, selectedDistrict, selectedStatus, searchQuery]);

  // Selected PHC inventory snapshot
  const selectedInventory = useMemo(() => {
    if (!selectedPhc || !data?.inventory) return [];
    return data.inventory.filter((i) => i.phcId === selectedPhc.id).slice(0, 6);
  }, [selectedPhc, data?.inventory]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-6 h-6 text-cyan-400" />
              <span>PHC Geographic Network</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              GIS mapping of 100 primary health facilities with live risk classification and capacity telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Showing:</span>
            <strong className="text-cyan-400 font-bold">{filteredPhcs.length}</strong>
            <span className="text-slate-400">of 100 PHCs</span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PHC name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('ALL');
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All States (4)</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
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

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical (&lt; 3 Days)</option>
              <option value="HIGH_RISK">High Risk (3 - 7 Days)</option>
              <option value="WARNING">Warning (7 - 14 Days)</option>
              <option value="NORMAL">Normal (&gt; 14 Days)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div>
            <button
              onClick={() => {
                setSelectedState('ALL');
                setSelectedDistrict('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Map & Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-2 h-[560px]">
            <LeafletMap
              phcs={filteredPhcs}
              selectedPhc={selectedPhc}
              onSelectPhc={(phc) => setSelectedPhc(phc)}
            />
          </div>

          {/* Selected PHC Details Drawer */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
            {selectedPhc ? (
              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      {selectedPhc.code}
                    </span>
                    <h2 className="text-base font-bold text-white mt-0.5">{selectedPhc.name}</h2>
                    <p className="text-xs text-slate-400">
                      {selectedPhc.district}, {selectedPhc.state} ({selectedPhc.block})
                    </p>
                  </div>
                  <RiskBadge level={selectedPhc.status} size="sm" />
                </div>

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Bed Capacity</span>
                    <strong className="text-white text-sm">
                      {selectedPhc.availableBeds} / {selectedPhc.totalBeds}
                    </strong>
                    <span className="text-[10px] text-cyan-400 block mt-0.5">
                      {Math.round((selectedPhc.occupiedBeds / selectedPhc.totalBeds) * 100)}% occupied
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Daily Inflow</span>
                    <strong className="text-white text-sm">{selectedPhc.dailyFootfall}</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Patients/day</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Staff On Duty</span>
                    <strong className="text-white text-sm">
                      {selectedPhc.staffPresent} / {selectedPhc.staffTotal}
                    </strong>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">Present</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Population</span>
                    <strong className="text-white text-sm">
                      {selectedPhc.populationCovered.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Catchment</span>
                  </div>
                </div>

                {/* Contact Officer */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Medical Officer In Charge
                  </div>
                  <div className="text-white font-semibold">{selectedPhc.contactDoctor}</div>
                  <div className="text-cyan-400 flex items-center gap-1 text-[11px]">
                    <Phone className="w-3 h-3" />
                    <span>{selectedPhc.phone}</span>
                  </div>
                </div>

                {/* Sample Medicine Inventory at this PHC */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Medications Snapshot</span>
                    <span className="text-[10px] text-slate-500">Days Buffer</span>
                  </div>
                  <div className="space-y-1.5">
                    {selectedInventory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/70 text-xs"
                      >
                        <div className="truncate max-w-[150px]">
                          <div className="font-medium text-white truncate">{item.medicineName}</div>
                          <div className="text-[10px] text-slate-400">Stock: {item.currentStock}</div>
                        </div>
                        <div className="text-right">
                          <RiskBadge level={item.riskLevel} size="sm" showIcon={false} />
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.daysRemaining} days</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/phc-network/${selectedPhc.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-all"
                  >
                    <span>Open Comprehensive Facility Dossier</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-cyan-400 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Select a PHC Marker</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                  Click any marker on the map to inspect live beds, medicine stock levels, staffing, and direct mutual aid recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
