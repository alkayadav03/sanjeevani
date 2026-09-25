'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import { useLanguage } from '@/lib/i18n';
import { RiskBadge } from '@/components/RiskBadge';
import { GeminiExplainerModal } from '@/components/GeminiExplainerModal';
import { DemoPreset, StockAlert } from '@/lib/data/types';
import {
  Building,
  MapPin,
  Bed,
  Users,
  UserCheck,
  AlertCircle,
  Flame,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Truck,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { data, loading, isOffline, applyPreset, resetDemo, simulateEmergency, updateTransfer } =
    useResilienceStore();
  const { t } = useLanguage();

  // Gemini explainer modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalSource, setModalSource] = useState<string>('gemini-1.5-flash');
  const [modalError, setModalError] = useState<string | null>(null);
  const [activeAlert, setActiveAlert] = useState<StockAlert | null>(null);

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
      setModalError(err.message || 'Failed to connect to Gemini API');
    } finally {
      setModalLoading(false);
    }
  };

  const stats = data?.stats;
  const criticalAlerts = data?.alerts?.filter((a) => !a.resolved).slice(0, 5) || [];
  const pendingTransfers = data?.redistributions?.filter((r) => r.status === 'RECOMMENDED').slice(0, 3) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header & Demo Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {t('navOverview')} Command Center
              </h1>
              {data?.emergency?.isActive && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white animate-pulse">
                  SURGE ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live telemetry aggregated across Punjab, Haryana, Rajasthan, and Uttar Pradesh.
            </p>
          </div>

          {/* Individual Demo Controls Bar */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 px-2">Preset:</span>
            <button
              onClick={() => resetDemo()}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                data?.activePreset === 'NORMAL'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => applyPreset('MEDICINE_SHORTAGE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                data?.activePreset === 'MEDICINE_SHORTAGE'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800'
              }`}
            >
              Drug Shortage
            </button>
            <button
              onClick={() => applyPreset('PATIENT_SURGE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                data?.activePreset === 'PATIENT_SURGE'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
              }`}
            >
              Patient Surge
            </button>
            <button
              onClick={() => applyPreset('BED_CRISIS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                data?.activePreset === 'BED_CRISIS'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:text-orange-300 hover:bg-slate-800'
              }`}
            >
              Bed Crisis
            </button>
            <button
              onClick={() => applyPreset('STAFF_SHORTAGE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                data?.activePreset === 'STAFF_SHORTAGE'
                  ? 'bg-yellow-600 text-slate-950'
                  : 'text-slate-400 hover:text-yellow-300 hover:bg-slate-800'
              }`}
            >
              Staff Deficit
            </button>
            <button
              onClick={() => simulateEmergency()}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                data?.activePreset === 'HEALTH_EMERGENCY'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
              }`}
            >
              🚨 Emergency
            </button>
          </div>
        </div>

        {/* Live Dynamic KPIs (Section 5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* Total PHCs */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">{t('kpiTotalPhcs')}</span>
              <Building className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">
              {stats?.total ?? 100}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">All Telemetry Active</div>
          </div>

          {/* Districts */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">{t('kpiDistricts')}</span>
              <MapPin className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">12</div>
            <div className="text-[10px] text-slate-400 mt-1">4 Indian States</div>
          </div>

          {/* Beds Total & Available */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">{t('kpiBeds')}</span>
              <Bed className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">
              {stats?.availableBeds ?? 0}
              <span className="text-xs font-normal text-slate-400"> / {stats?.totalBeds ?? 0}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Occupancy: <strong className="text-cyan-400">{stats?.bedOccupancyRate ?? 0}%</strong>
            </div>
          </div>

          {/* Patients Today */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">{t('kpiPatients')}</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">
              {stats?.patientsToday?.toLocaleString() ?? 0}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Live Inflow</div>
          </div>

          {/* Staff Attendance */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">{t('kpiStaff')}</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">
              {stats?.staffAttendanceRate ?? 0}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {stats?.staffPresent ?? 0} Present On Duty
            </div>
          </div>

          {/* Active Stock Alerts */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">{t('kpiStockAlerts')}</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400 mt-2">
              {stats?.alerts?.totalActive ?? 0}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Depletion &lt; 14 Days</div>
          </div>

          {/* Critical Alerts */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">{t('kpiCriticalAlerts')}</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-extrabold text-rose-400 mt-2">
              {stats?.alerts?.critical ?? 0}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Stock-out in &lt; 3 Days</div>
          </div>
        </div>

        {/* Network Readiness Status Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div>
              <div className="text-sm font-bold text-white">{stats?.normal ?? 0} PHCs</div>
              <div className="text-[11px] text-slate-400">Normal (&gt; 14 Days Buffer)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div>
              <div className="text-sm font-bold text-white">{stats?.warning ?? 0} PHCs</div>
              <div className="text-[11px] text-slate-400">Warning (7 - 14 Days)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <div>
              <div className="text-sm font-bold text-white">{stats?.highRisk ?? 0} PHCs</div>
              <div className="text-[11px] text-slate-400">High Risk (3 - 7 Days)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <div>
              <div className="text-sm font-bold text-white">{stats?.critical ?? 0} PHCs</div>
              <div className="text-[11px] text-slate-400">Critical (&lt; 3 Days Stock)</div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Section: Active Critical Alerts & Live Redistribution Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Critical Alerts */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <h2 className="font-bold text-white text-base">Active Stock-out Alerts</h2>
              </div>
              <Link
                href="/alerts"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>View All ({stats?.alerts?.totalActive})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {criticalAlerts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-950 border border-slate-800">
                  No active stock-out alerts. All essential medicines above buffer threshold.
                </div>
              ) : (
                criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white">{alert.phcName}</h3>
                        <p className="text-xs text-cyan-400 font-medium">
                          {alert.medicineName} · {alert.district}, {alert.state}
                        </p>
                      </div>
                      <RiskBadge level={alert.riskLevel} size="sm" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg">
                      <div>
                        Stock: <span className="font-bold text-white">{alert.currentStock}</span>
                      </div>
                      <div>
                        Burn: <span className="font-bold text-white">{alert.predictedDemand}/day</span>
                      </div>
                      <div>
                        Stockout in:{' '}
                        <span className="font-bold text-rose-400">{alert.daysRemaining} days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleAskGemini(alert)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t('askGeminiWhy')}</span>
                      </button>

                      <Link
                        href={`/redistribution?medicine=${alert.medicineId}&shortagePhc=${alert.phcId}`}
                        className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                      >
                        <span>Find Surplus Donor</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Peer-to-Peer Redistribution Feed */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-teal-400" />
                <h2 className="font-bold text-white text-base">Algorithmic Mutual Aid Transfers</h2>
              </div>
              <Link
                href="/redistribution"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Full Optimizer ({data?.redistributions?.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {pendingTransfers.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-950 border border-slate-800">
                  No pending transfers recommended. Supplies currently balanced across facilities.
                </div>
              ) : (
                pendingTransfers.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-300">
                        {tr.medicineName} ({tr.transferQuantity} units)
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800">
                        {tr.distanceKm} km transit
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-lg">
                      <div className="truncate max-w-[160px]">
                        <span className="text-[10px] text-slate-500 block">Surplus Donor:</span>
                        <strong className="text-white">{tr.fromPhcName}</strong>
                      </div>
                      <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 mx-2" />
                      <div className="truncate max-w-[160px] text-right">
                        <span className="text-[10px] text-slate-500 block">Deficit Recipient:</span>
                        <strong className="text-white">{tr.toPhcName}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <RiskBadge level={tr.urgency} size="sm" />
                      <button
                        onClick={() => updateTransfer(tr.id, 'APPROVED')}
                        className="px-3 py-1 rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 text-slate-950 text-xs font-bold hover:brightness-110 shadow-sm"
                      >
                        {t('approveTransfer')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <Link
            href="/phc-network"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                Interactive PHC Map
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Explore 100 facilities across 4 states</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </Link>

          <Link
            href="/forecasts"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                AI 7-Day Demand Forecasts
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Epidemic & seasonal projections</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </Link>

          <Link
            href="/federated"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                Federated AI Simulation
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Multi-state decentralized learning</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Gemini Explainer Modal */}
      <GeminiExplainerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Gemini Clinical & Logistical Analysis"
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
