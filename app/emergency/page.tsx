'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import { useLanguage } from '@/lib/i18n';
import { DemoPreset } from '@/lib/data/types';
import {
  Flame,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  TrendingUp,
  Bed,
  Users,
  Pill,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function EmergencyPage() {
  const { data, simulateEmergency, resetDemo, applyPreset, loading } = useResilienceStore();
  const { t, speak, stopSpeaking, isSpeaking } = useLanguage();

  const isEmergencyActive = data?.emergency?.isActive;
  const emergency = data?.emergency;

  // Briefing state
  const [briefingText, setBriefingText] = useState<string | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingSource, setBriefingSource] = useState('gemini-1.5-flash');

  const handleGenerateBriefing = async () => {
    setBriefingLoading(true);
    try {
      const res = await fetch('/api/gemini/emergency-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergencyType: emergency?.type || 'Acute Epidemic Surge',
          phcCount: data?.stats?.total || 100,
          totalFootfall: data?.stats?.patientsToday || 18500,
          bedOccupancyRate: data?.stats?.bedOccupancyRate || 94,
          criticalAlertsCount: data?.stats?.alerts?.critical || 12,
          activeTransfersCount: data?.stats?.redistribution?.recommended || 8,
        }),
      });
      const result = await res.json();
      setBriefingText(result.text);
      setBriefingSource(result.modelUsed || 'gemini-1.5-flash');
    } catch (e: any) {
      console.error(e);
      setBriefingText('Executive briefing generation failed. Please verify connectivity.');
    } finally {
      setBriefingLoading(false);
    }
  };

  const timeline = [
    { step: '1', title: 'Emergency Event', desc: 'Acute viral epidemic / mass casualty incident triggers across 12 districts.', active: isEmergencyActive },
    { step: '2', title: 'Patient Surge', desc: 'OPD footfall spikes +120% above historical moving averages.', active: isEmergencyActive },
    { step: '3', title: 'Medicine Demand ↑', desc: 'Antipyretic and rehydration consumption surges 2.5x standard velocity.', active: isEmergencyActive },
    { step: '4', title: 'Bed Pressure ↑', desc: 'Ward occupancy climbs to 94%+ across general and pediatric beds.', active: isEmergencyActive },
    { step: '5', title: 'AI Prediction', desc: 'Forecast engine detects impending stock exhaustion in 48-72 hours.', active: isEmergencyActive },
    { step: '6', title: 'Alert Generation', desc: 'CRITICAL stock-out alerts flagged with Gemini clinical root cause.', active: isEmergencyActive },
    { step: '7', title: 'Surplus Match', desc: 'Haversine distance algorithm identifies buffer in neighboring blocks.', active: isEmergencyActive },
    { step: '8', title: 'Redistribution', desc: 'Peer-to-peer mutual aid dispatches stabilize receiving facility.', active: isEmergencyActive },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Flame className="w-6 h-6 text-rose-500" />
              <span>Emergency Command & Surge Simulator</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Test resilience stress limits by injecting regional health crises into the live state store.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => resetDemo()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('resetDemo')}</span>
            </button>
          </div>
        </div>

        {/* Primary Simulation Banner */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isEmergencyActive
              ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-rose-600 shadow-2xl shadow-rose-950/50'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                    isEmergencyActive
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {isEmergencyActive ? '🚨 EPIDEMIC SURGE SIMULATION ACTIVE' : 'ROUTINE OPERATIONS'}
                </span>
                {isEmergencyActive && (
                  <span className="text-xs text-rose-400 font-mono">
                    Surge Multiplier: 2.2x Footfall / 2.5x Medicine
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isEmergencyActive ? emergency?.type : 'Simulate Epidemic & Supply Shock'}
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                {isEmergencyActive
                  ? emergency?.description
                  : 'Injecting an emergency immediately alters telemetry across all 100 PHCs, creates critical stock alerts, stresses ward beds, and generates peer mutual aid recommendations.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => simulateEmergency()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-5 h-5" />
                <span>Simulate Health Emergency</span>
              </button>
            </div>
          </div>
        </div>

        {/* Individual Demo Control Presets */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Independent System Stress Toggles</h3>
            <span className="text-xs text-slate-400">Click to alter specific data slices live</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
            <button
              onClick={() => resetDemo()}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-left space-y-1 transition-all"
            >
              <div className="text-xs font-bold text-emerald-400">Normal Operation</div>
              <div className="text-[10px] text-slate-500">Pristine baseline</div>
            </button>
            <button
              onClick={() => applyPreset('MEDICINE_SHORTAGE')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-left space-y-1 transition-all"
            >
              <div className="text-xs font-bold text-rose-400">Drug Shortage</div>
              <div className="text-[10px] text-slate-500">Depletes Paracetamol</div>
            </button>
            <button
              onClick={() => applyPreset('PATIENT_SURGE')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-left space-y-1 transition-all"
            >
              <div className="text-xs font-bold text-amber-400">Patient Surge</div>
              <div className="text-[10px] text-slate-500">+90% OPD footfall</div>
            </button>
            <button
              onClick={() => applyPreset('BED_CRISIS')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500 text-left space-y-1 transition-all"
            >
              <div className="text-xs font-bold text-orange-400">Bed Crisis</div>
              <div className="text-[10px] text-slate-500">100% bed occupancy</div>
            </button>
            <button
              onClick={() => applyPreset('STAFF_SHORTAGE')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-yellow-500 text-left space-y-1 transition-all"
            >
              <div className="text-xs font-bold text-yellow-400">Staff Shortage</div>
              <div className="text-[10px] text-slate-500">Frontline deficit</div>
            </button>
            <button
              onClick={() => simulateEmergency()}
              className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 hover:border-rose-500 text-left space-y-1 transition-all"
            >
              <div className="text-xs font-bold text-rose-300">Full Emergency</div>
              <div className="text-[10px] text-rose-400/80">Compound surge</div>
            </button>
          </div>
        </div>

        {/* Visual Timeline (Section 9) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              End-to-End Resilience Pipeline Timeline
            </h3>
            <span className="text-xs text-cyan-400 font-mono">
              {isEmergencyActive ? 'Live Stage: Redistribution & Mutual Aid' : 'Ready for simulation'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {timeline.map((item) => (
              <div
                key={item.step}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.active
                    ? 'bg-slate-950 border-cyan-500/70 shadow-sm'
                    : 'bg-slate-950/50 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    Step {item.step}
                  </span>
                  {item.active && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gemini Executive Situation Briefing Panel */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Gemini AI Executive Crisis Briefing
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time strategic assessment for Chief Medical Officer and District Magistrate.
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerateBriefing}
              disabled={briefingLoading}
              className="px-4 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{briefingLoading ? 'Synthesizing with Gemini...' : 'Generate Situation Briefing'}</span>
            </button>
          </div>

          {briefingText ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {briefingText}
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 font-mono">Engine: {briefingSource}</span>
                {isSpeaking ? (
                  <button
                    onClick={() => stopSpeaking()}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 font-semibold"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>{t('stopReading')}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => speak(briefingText)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t('readAloud')}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-950 border border-slate-800">
              Click &quot;Generate Situation Briefing&quot; to formulate real-time strategic guidance via Google Gemini.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
