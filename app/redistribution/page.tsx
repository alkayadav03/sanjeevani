'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import { useLanguage } from '@/lib/i18n';
import { RiskBadge } from '@/components/RiskBadge';
import { GeminiExplainerModal } from '@/components/GeminiExplainerModal';
import { TransferRecommendation, TransferStatus, RiskLevel } from '@/lib/data/types';
import {
  Truck,
  Sparkles,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  PackageCheck,
  RotateCw,
  Info,
} from 'lucide-react';

export default function RedistributionPage() {
  const { data, updateTransfer } = useResilienceStore();
  const { t } = useLanguage();
  const redistributions = data?.redistributions || [];

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Gemini modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalSource, setModalSource] = useState<string>('gemini-1.5-flash');
  const [modalError, setModalError] = useState<string | null>(null);
  const [activeTransfer, setActiveTransfer] = useState<TransferRecommendation | null>(null);

  const filteredTransfers = useMemo(() => {
    if (selectedStatus === 'ALL') return redistributions;
    return redistributions.filter((r) => r.status === selectedStatus);
  }, [redistributions, selectedStatus]);

  const handleWhyRecommendation = async (tr: TransferRecommendation) => {
    setActiveTransfer(tr);
    setModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    setModalContent(null);

    try {
      const res = await fetch('/api/gemini/explain-redistribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferId: tr.id,
          fromPhcName: tr.fromPhcName,
          toPhcName: tr.toPhcName,
          medicineName: tr.medicineName,
          transferQuantity: tr.transferQuantity,
          distanceKm: tr.distanceKm,
          urgency: tr.urgency,
          state: tr.state,
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

  const advanceTransferStatus = (tr: TransferRecommendation) => {
    if (tr.status === 'RECOMMENDED') {
      updateTransfer(tr.id, 'APPROVED');
    } else if (tr.status === 'APPROVED') {
      updateTransfer(tr.id, 'IN_TRANSIT');
    } else if (tr.status === 'IN_TRANSIT') {
      updateTransfer(tr.id, 'RECEIVED');
    }
  };

  const getStepIndex = (status: TransferStatus) => {
    switch (status) {
      case 'RECOMMENDED':
        return 0;
      case 'APPROVED':
        return 1;
      case 'IN_TRANSIT':
        return 2;
      case 'RECEIVED':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Truck className="w-6 h-6 text-teal-400" />
              <span>Peer-to-Peer Mutual Aid Redistribution</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Automated pairing of shortage facilities with closest surplus donors across road corridors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800 font-mono">
              Transit: Cold-chain Verified
            </span>
          </div>
        </div>

        {/* Workflow Pipeline Explainer */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Simulated 4-Step Chain of Custody: </strong> Advancing status to{' '}
              <span className="text-emerald-400 font-bold">RECEIVED</span> automatically credits recipient inventory and lowers its stock-out risk.
            </span>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses ({redistributions.length})</option>
              <option value="RECOMMENDED">Recommended</option>
              <option value="APPROVED">Approved</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="RECEIVED">Received & Stock Restored</option>
            </select>
          </div>
        </div>

        {/* Transfer Cards List */}
        <div className="space-y-4">
          {filteredTransfers.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <ShieldCheck className="w-10 h-10 text-teal-400 mx-auto" />
              <h3 className="font-bold text-white text-sm">No Transfers in this Stage</h3>
              <p className="text-xs text-slate-400">All regional facilities are currently self-balanced.</p>
            </div>
          ) : (
            filteredTransfers.map((tr) => {
              const stepIdx = getStepIndex(tr.status);

              return (
                <div
                  key={tr.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                >
                  {/* Top line: Urgency, Distance, Medicine */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <RiskBadge level={tr.urgency} size="sm" />
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {tr.distanceKm} km transit
                      </span>
                      <span className="text-xs text-slate-400">· State: {tr.state}</span>
                    </div>

                    <div className="text-xs font-semibold">
                      Status:{' '}
                      <span
                        className={`font-mono font-bold uppercase ${
                          tr.status === 'RECEIVED'
                            ? 'text-emerald-400'
                            : tr.status === 'IN_TRANSIT'
                            ? 'text-cyan-400'
                            : tr.status === 'APPROVED'
                            ? 'text-teal-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {tr.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Route Visualizer Card: PHC B -> PHC A | Medicine X | 120 units | 24 km */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800/80 items-center">
                    {/* Donor PHC */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        Surplus Donor PHC
                      </span>
                      <div className="font-bold text-white text-sm">{tr.fromPhcName}</div>
                      <div className="text-xs text-slate-400">{tr.fromPhcDistrict} District</div>
                    </div>

                    {/* Middle: Transfer Info */}
                    <div className="flex flex-col items-center justify-center p-2 text-center border-y md:border-y-0 md:border-x border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-cyan-300">
                        {tr.medicineName}
                      </div>
                      <div className="text-base font-extrabold text-white">
                        {tr.transferQuantity.toLocaleString()} Units
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-teal-400 font-medium">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Highway Corridor: ~{Math.round(tr.distanceKm * 1.6)} mins</span>
                      </div>
                    </div>

                    {/* Recipient PHC */}
                    <div className="space-y-1 md:text-right">
                      <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                        Shortage Recipient PHC
                      </span>
                      <div className="font-bold text-white text-sm">{tr.toPhcName}</div>
                      <div className="text-xs text-slate-400">{tr.toPhcDistrict} District</div>
                    </div>
                  </div>

                  {/* 4-Step Interactive Progress Stepper */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    <div
                      className={`p-2 rounded-lg text-[11px] font-semibold border ${
                        stepIdx >= 0
                          ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      1. RECOMMENDED
                    </div>
                    <div
                      className={`p-2 rounded-lg text-[11px] font-semibold border ${
                        stepIdx >= 1
                          ? 'bg-teal-950/80 border-teal-700 text-teal-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      2. APPROVED
                    </div>
                    <div
                      className={`p-2 rounded-lg text-[11px] font-semibold border ${
                        stepIdx >= 2
                          ? 'bg-blue-950/80 border-blue-700 text-blue-300 animate-pulse'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      3. IN TRANSIT
                    </div>
                    <div
                      className={`p-2 rounded-lg text-[11px] font-semibold border ${
                        stepIdx >= 3
                          ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      4. RECEIVED
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleWhyRecommendation(tr)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 text-xs font-semibold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Why this recommendation? (Gemini)</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {tr.status !== 'RECEIVED' && tr.status !== 'REJECTED' && (
                        <>
                          <button
                            onClick={() => updateTransfer(tr.id, 'REJECTED')}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => advanceTransferStatus(tr)}
                            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1"
                          >
                            {tr.status === 'RECOMMENDED' && <span>Approve Transfer</span>}
                            {tr.status === 'APPROVED' && <span>Dispatch (Mark In Transit)</span>}
                            {tr.status === 'IN_TRANSIT' && <span>Confirm Delivery (Received)</span>}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {tr.status === 'RECEIVED' && (
                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800">
                          <PackageCheck className="w-4 h-4" />
                          <span>Delivered · Stock Ledger Updated</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Gemini Explainer Modal */}
      <GeminiExplainerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Gemini Supply-Chain Routing Rationale"
        subtitle={
          activeTransfer
            ? `${activeTransfer.fromPhcName} → ${activeTransfer.toPhcName} (${activeTransfer.medicineName})`
            : undefined
        }
        loading={modalLoading}
        content={modalContent}
        source={modalSource}
        error={modalError}
      />
    </DashboardLayout>
  );
}
