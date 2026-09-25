'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import { RiskBadge } from '@/components/RiskBadge';
import { MedicineCategory, RiskLevel } from '@/lib/data/types';
import {
  Pill,
  Search,
  Filter,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Package,
} from 'lucide-react';

export default function InventoryPage() {
  const { data } = useResilienceStore();
  const inventory = data?.inventory || [];
  const medicines = data?.medicines || [];
  const phcs = data?.phcs || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedPhc, setSelectedPhc] = useState<string>('ALL');

  // Categories
  const categories: MedicineCategory[] = [
    'Analgesics & Antipyretics',
    'Antibiotics',
    'Rehydration & GI',
    'Antidiabetic',
    'Antimalarial',
    'Maternal & Child Health',
    'Respiratory',
    'Cardiovascular',
  ];

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (selectedRisk !== 'ALL' && item.riskLevel !== selectedRisk) return false;
      if (selectedPhc !== 'ALL' && item.phcId !== selectedPhc) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          item.medicineName.toLowerCase().includes(q) ||
          item.phcName.toLowerCase().includes(q) ||
          item.batchNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inventory, selectedCategory, selectedRisk, selectedPhc, searchQuery]);

  // Pagination for lean rendering
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.ceil(filteredInventory.length / pageSize);
  const paginatedItems = filteredInventory.slice((page - 1) * pageSize, page * pageSize);

  const criticalCount = inventory.filter((i) => i.riskLevel === 'CRITICAL').length;
  const highRiskCount = inventory.filter((i) => i.riskLevel === 'HIGH_RISK').length;
  const warningCount = inventory.filter((i) => i.riskLevel === 'WARNING').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Pill className="w-6 h-6 text-cyan-400" />
              <span>Essential Medicine Inventory</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Stock telemetry for 20 National List of Essential Medicines (NLEM) drugs across 100 PHCs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/redistribution"
              className="px-3.5 py-1.5 rounded-xl bg-teal-950 text-teal-300 border border-teal-800 hover:bg-teal-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Redistribution Optimizer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold">Total Tracked Batches</span>
              <div className="text-2xl font-bold text-white mt-1">{inventory.length}</div>
              <span className="text-[10px] text-slate-500">20 drugs × 100 PHCs</span>
            </div>
            <Package className="w-8 h-8 text-cyan-400/50" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-rose-400 font-semibold">Critical Stock-outs (&lt; 3d)</span>
              <div className="text-2xl font-bold text-rose-400 mt-1">{criticalCount}</div>
              <span className="text-[10px] text-rose-400/80">Immediate transfer needed</span>
            </div>
            <AlertTriangle className="w-8 h-8 text-rose-400/50" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-orange-400 font-semibold">High Risk Batches (3-7d)</span>
              <div className="text-2xl font-bold text-orange-400 mt-1">{highRiskCount}</div>
              <span className="text-[10px] text-orange-400/80">Indent replenishment</span>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-400/50" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-400 font-semibold">Warning Batches (7-14d)</span>
              <div className="text-2xl font-bold text-amber-400 mt-1">{warningCount}</div>
              <span className="text-[10px] text-amber-400/80">Monitored buffer</span>
            </div>
            <ShieldCheck className="w-8 h-8 text-amber-400/50" />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search medicine, facility, batch..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="CRITICAL">Critical (&lt; 3 Days)</option>
              <option value="HIGH_RISK">High Risk (3 - 7 Days)</option>
              <option value="WARNING">Warning (7 - 14 Days)</option>
              <option value="NORMAL">Normal (&gt; 14 Days)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedPhc}
              onChange={(e) => {
                setSelectedPhc(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Primary Health Centres</option>
              {phcs.slice(0, 30).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Medicine Name</th>
                  <th className="p-3.5">Facility (PHC)</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Daily Velocity</th>
                  <th className="p-3.5">Days Buffer</th>
                  <th className="p-3.5">Batch / Expiry</th>
                  <th className="p-3.5">Risk Level</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{item.medicineName}</div>
                      <div className="text-[10px] text-cyan-400">{item.category}</div>
                    </td>
                    <td className="p-3.5">
                      <Link
                        href={`/phc-network/${item.phcId}`}
                        className="font-medium text-slate-200 hover:text-cyan-400 transition-colors"
                      >
                        {item.phcName}
                      </Link>
                    </td>
                    <td className="p-3.5 font-bold text-white">{item.currentStock.toLocaleString()}</td>
                    <td className="p-3.5 text-slate-400">{item.dailyConsumption} / day</td>
                    <td className="p-3.5">
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
                    <td className="p-3.5 text-[11px] text-slate-400">
                      <div>{item.batchNumber}</div>
                      <div className="text-[10px] text-slate-500">Exp: {item.expiryDate}</div>
                    </td>
                    <td className="p-3.5">
                      <RiskBadge level={item.riskLevel} size="sm" />
                    </td>
                    <td className="p-3.5 text-right">
                      {item.riskLevel !== 'NORMAL' ? (
                        <Link
                          href={`/redistribution?medicine=${item.medicineId}&shortagePhc=${item.phcId}`}
                          className="px-2.5 py-1 rounded-md bg-teal-950 text-teal-300 border border-teal-800 hover:bg-teal-900 text-[11px] font-semibold"
                        >
                          Find Donor
                        </Link>
                      ) : (
                        <span className="text-[10px] text-slate-500">Adequate</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing {filteredInventory.length === 0 ? 0 : (page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, filteredInventory.length)} of {filteredInventory.length} items
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-white"
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.max(1, totalPages)}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
