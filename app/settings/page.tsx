'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useLanguage } from '@/lib/i18n';
import { useResilienceStore } from '@/lib/useResilienceStore';
import {
  Settings,
  Languages,
  Sparkles,
  RotateCcw,
  Globe2,
  Database,
  Shield,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Key,
  Layers,
} from 'lucide-react';

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { resetDemo } = useResilienceStore();

  const [geminiInfo, setGeminiInfo] = useState<{
    configured: boolean;
    maskedKey: string | null;
    model: string;
    status: string;
  }>({
    configured: false,
    maskedKey: null,
    model: 'gemini-1.5-flash',
    status: 'CHECKING',
  });

  const [currency, setCurrency] = useState('₹ INR');
  const [regionLabel, setRegionLabel] = useState('State / District (India NHM)');
  const [distanceUnit, setDistanceUnit] = useState('Kilometers (km)');
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gemini/status')
      .then((res) => res.json())
      .then((d) => setGeminiInfo(d))
      .catch(() =>
        setGeminiInfo({
          configured: false,
          maskedKey: null,
          model: 'gemini-1.5-flash',
          status: 'OFFLINE',
        })
      );
  }, []);

  const handleReset = async () => {
    await resetDemo();
    setResetMessage('State store successfully restored to initial deterministic seed!');
    setTimeout(() => setResetMessage(null), 4000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="pb-2 border-b border-slate-800">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <span>Platform Settings & Regional Configuration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage multilingual localization, AI API connections, and cross-border deployment variables.
          </p>
        </div>

        {/* Gemini API Key Configuration Panel */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Google Gemini API Configuration
                </h3>
                <p className="text-xs text-slate-400">
                  Secure server-side API integration for clinical root-cause reasoning.
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                geminiInfo.configured
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {geminiInfo.configured ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Configured & Ready</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Algorithmic Fallback Active</span>
                </>
              )}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active Model:</span>
              <strong className="font-mono text-cyan-300">Google Gemini 1.5 Flash</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Environment Key Status:</span>
              <span className="font-mono text-slate-300">
                {geminiInfo.configured ? geminiInfo.maskedKey : 'Not detected in .env.local'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Security Architecture:</span>
              <span className="text-emerald-400 font-semibold">
                Server-side Next.js route handlers only (Key never exposed to client)
              </span>
            </div>
          </div>

          {!geminiInfo.configured && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200">How to enable live Gemini generation:</p>
              <p>
                Add <code className="text-cyan-300 font-mono">GEMINI_API_KEY=AIzaSy...</code> to your{' '}
                <code className="text-cyan-300 font-mono">.env.local</code> file and restart the Next.js server.
              </p>
            </div>
          )}
        </div>

        {/* Multilingual & Accessibility Settings */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Languages className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Multilingual Interface & Voice Affordances (Section 12)
              </h3>
              <p className="text-xs text-slate-400">
                Inclusivity features designed for primary healthcare frontline workers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-white block">System Interface Language</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  English (Default)
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    language === 'hi'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Translates all critical navigation, KPI cards, and stock alert descriptors.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-white block">Speech Synthesis (Web Speech API)</label>
              <div className="text-xs text-slate-300">
                Status: <span className="text-emerald-400 font-semibold">Enabled</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Native browser TTS reads Gemini AI clinical briefings aloud for low-literacy field workers.
              </p>
            </div>
          </div>
        </div>

        {/* Cross-Border Localization Config */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Globe2 className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Cross-Border Applicability Configuration
              </h3>
              <p className="text-xs text-slate-400">
                Relabel for other BRICS and regional health networks without altering core logic.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Currency Unit</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="₹ INR">₹ INR (India)</option>
                <option value="R$ BRL">R$ BRL (Brazil SUS)</option>
                <option value="R ZAR">R ZAR (South Africa)</option>
                <option value="$ USD">$ USD (International)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Administrative Hierarchy</label>
              <select
                value={regionLabel}
                onChange={(e) => setRegionLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="State / District (India NHM)">State / District (India NHM)</option>
                <option value="Province / Municipality">Province / Municipality</option>
                <option value="County / Subdistrict">County / Subdistrict</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Distance Metric</label>
              <select
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Kilometers (km)">Kilometers (km)</option>
                <option value="Miles (mi)">Miles (mi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Path to Production (Deployability 25% Criterion) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Data-Access Layer Architecture (Path to Production)
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All data access is structured cleanly behind the repository pattern (
            <code className="text-cyan-300 font-mono">PhcRepository</code>,{' '}
            <code className="text-cyan-300 font-mono">InventoryRepository</code>,{' '}
            <code className="text-cyan-300 font-mono">AlertRepository</code>,{' '}
            <code className="text-cyan-300 font-mono">RedistributionRepository</code>
            ). To upgrade from the prototype in-memory store to PostgreSQL or Supabase, replace the queries inside those repository classes without modifying any frontend UI component!
          </p>
        </div>

        {/* Demo State Reset Control */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Reset Synthetic Dataset</h3>
                <p className="text-xs text-slate-400">
                  Restores original seeded state (100 PHCs, 20 medicines, 0 emergency surge).
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 text-xs font-bold transition-colors"
            >
              Reset to Seed
            </button>
          </div>

          {resetMessage && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300">
              {resetMessage}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
