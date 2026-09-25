'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import { useLanguage } from '@/lib/i18n';
import { RiskBadge } from '@/components/RiskBadge';
import { GeminiExplainerModal } from '@/components/GeminiExplainerModal';
import { StockAlert, RiskLevel } from '@/lib/data/types';
import {
  AlertCircle,
  Sparkles,
  Truck,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export default function AlertsPage() {
  const { data } = useResilienceStore();
  const alerts = data?.alerts || [];
  const { t } = useLanguage();

  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Gemini explainer modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalSource, setModalSource] = useState<string>('gemini-1.5-flash');
  const [modalError, setModalError] = useState<string | null>(null);
  const [activeAlert, setActiveAlert] = useState<StockAlert | null>(null);

  const districts = useMemo(() => {
    return Array.from(new Set(alerts.map((a) => a.district)));
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (a.resolved) return false;
      if (selectedRisk !== 'ALL' && a.riskLevel !== selectedRisk) return false;
      if (selectedDistrict !== 'ALL' && a.district !== selectedDistrict) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          a.phcName.toLowerCase().includes(q) ||
          a.medicineName.toLowerCase().includes(q) ||
          a.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [alerts, selectedRisk, selectedDistrict, searchQuery]);

  const handleAskGemini = async (alert: StockAlert) => {
    setActiveAlert(alert);
    setModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    setModalContent(null);

    try {
      const res = await fetch('/api/gemini/explain-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: alert.id,
          phcName: alert.phcName,
          medicineName: alert.medicineName,
          currentStock: alert.currentStock,
          predictedDemand: alert.predictedDemand,
          daysRemaining: alert.daysRemaining,
          riskLevel: alert.riskLevel,
          district: alert.district,
          state: alert.state,
        }),
      });

      const result = await res.json();
      setModalContent(result.text);
      setModalSource(result.modelUsed || 'gemini-1.5-flash');
    } catch (err: any) {
      setModalError(err.message || 'Failed to communicate with Gemini API');
    } finally {
      setModalLoading(false);
    }
  };

  const criticalCount = alerts.filter((a) => a.riskLevel === 'CRITICAL' && !a.resolved).length;
  const highRiskCount = alerts.filter((a) => a.riskLevel === 'HIGH_RISK' && !a.resolved).length;
  const warningCount = alerts.filter((a) => a.riskLevel === 'WARNING' && !a.resolved).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-rose-400" />
              <span>Medicine Stock-out Early Warnings</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Automated algorithmic stock depletion alarms classified by days-to-stockout thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/redistribution"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Open Mutual Aid Optimizer</span>
            </Link>
          </div>
        </div>

        {/* Risk Tier Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold">Total Active Alerts</span>
            <div className="text-2xl font-bold text-white mt-1">{filteredAlerts.length}</div>
            <span className="text-[10px] text-slate-500">Unresolved depletion flags</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-rose-300 font-semibold">CRITICAL (&lt; 3 Days)</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-extrabold text-rose-400 mt-1">{criticalCount}</div>
            <span className="text-[10px] text-rose-400/90">Immediate peer transfer required</span>
          </div>

          <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-800">
            <span className="text-[11px] text-orange-300 font-semibold">HIGH RISK (3 - 7 Days)</span>
            <div className="text-2xl font-extrabold text-orange-400 mt-1">{highRiskCount}</div>
            <span className="text-[10px] text-orange-400/90">Warehouse indent expedited</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800">
            <span className="text-[11px] text-amber-300 font-semibold">WARNING (7 - 14 Days)</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">{warningCount}</div>
            <span className="text-[10px] text-amber-400/90">Consumption pattern monitored</span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PHC, medicine, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="CRITICAL">Critical (&lt; 3 Days)</option>
              <option value="HIGH_RISK">High Risk (3 - 7 Days)</option>
              <option value="WARNING">Warning (7 - 14 Days)</option>
            </select>
          </div>

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
        </div>

        {/* Alert List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-white text-sm">No Active Alerts In This Category</h3>
              <p className="text-xs text-slate-400">All facility inventory lines maintain safe operational buffer.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <RiskBadge level={alert.riskLevel} size="md" />
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base">
                        {alert.medicineName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Facility:{' '}
                        <Link
                          href={`/phc-network/${alert.phcId}`}
                          className="text-cyan-400 hover:underline font-medium"
                        >
                          {alert.phcName}
                        </Link>{' '}
                        · {alert.district}, {alert.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Telemetry synced today</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                      Current Physical Stock
                    </span>
                    <strong className="text-white text-sm">{alert.currentStock.toLocaleString()}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                      Daily Consumption Velocity
                    </span>
                    <strong className="text-white text-sm">{alert.predictedDemand} units/day</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                      Calculated Buffer Remaining
                    </span>
                    <strong
                      className={`text-sm font-extrabold ${
                        alert.daysRemaining < 3
                          ? 'text-rose-400'
                          : alert.daysRemaining <= 7
                          ? 'text-orange-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {alert.daysRemaining} Days
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                      Stock-out Formula
                    </span>
                    <span className="text-slate-400 text-[11px] font-mono">Stock ÷ Daily Burn</span>
                  </div>
                </div>

                {/* Inline Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => handleAskGemini(alert)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 text-xs font-bold transition-colors shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{t('askGeminiWhy')}</span>
                  </button>

                  <Link
                    href={`/redistribution?medicine=${alert.medicineId}&shortagePhc=${alert.phcId}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-950 text-teal-300 border border-teal-800 hover:bg-teal-900 text-xs font-semibold transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Pair With Nearby Surplus PHC</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Gemini Explainer Modal */}
      <GeminiExplainerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Gemini Clinical & Logistical Root-Cause Analysis"
        subtitle={
          activeAlert ? `${activeAlert.medicineName} at ${activeAlert.phcName}` : undefined
        }
        loading={modalLoading}
        content={modalContent}
        source={modalSource}
        error={modalError}
      />
    </DashboardLayout>
  );
}
