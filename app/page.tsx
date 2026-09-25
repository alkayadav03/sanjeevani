'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import {
  Shield,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Truck,
  Cpu,
  Globe2,
  CheckCircle2,
  BarChart3,
  Layers,
  Flame,
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();

  const pipelineSteps = [
    { step: '01', title: 'MONITOR', desc: 'Real-time telemetry across 100 PHCs: stock ledgers, bed counts, patient OPD flow, and cold-chain status.' },
    { step: '02', title: 'PREDICT', desc: '7-day algorithmic forecasting adjusting for seasonality, monsoon vectors, and epidemiological trends.' },
    { step: '03', title: 'WARN', desc: 'Categorized early-warning risk tiers: Normal (>14d), Warning (7-14d), High Risk (3-7d), Critical (<3d).' },
    { step: '04', title: 'EXPLAIN', desc: 'Google Gemini 1.5 Flash generates clinical and logistical root-cause analysis with voice read-aloud.' },
    { step: '05', title: 'OPTIMIZE', desc: 'Automated distance-weighted pairing of deficit PHCs with nearby surplus facilities within the district.' },
    { step: '06', title: 'REDISTRIBUTE', desc: 'Simulated 4-step dispatch workflow (Recommended → Approved → In-Transit → Received) restoring stocks.' },
    { step: '07', title: 'COORDINATE', desc: 'Decentralized federated intelligence aggregating state models while keeping local patient telemetry on-premise.' },
  ];

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-900 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-teal-600/10 to-blue-600/15 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold shadow-inner">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cross-Border Ready: Configurable for any district health grid</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Predict Medicine Stock-outs. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
              Mobilize Regional Healthcare Resilience.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A command-and-control platform empowering Indian Primary Health Centres (PHCs) and District Chief Medical Officers to eliminate drug shortages, anticipate disease surges, and execute peer-to-peer resource redistribution before patients arrive at empty dispensary shelves.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Launch Command Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/emergency"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700 font-bold text-sm transition-all"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Simulate Epidemic Surge</span>
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-sm transition-all"
            >
              <span>Select Demo Role</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400">100</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">PHCs & CHCs Monitored</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-teal-400">12</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Districts across 4 States</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">7-Day</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Predictive Demand Horizon</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-rose-400">&lt; 3 Days</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Critical Early Warning</div>
            </div>
          </div>
        </div>
      </section>

      {/* Resilience Pipeline Interactive Stepper */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-mono tracking-wider uppercase text-cyan-400 font-semibold">
            Closed-Loop Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            The 7-Step Resilience Pipeline
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Every minute an alert sits unaddressed in rural health networks costs lives. SwasthyaResilience transforms passive spreadsheets into proactive logistical coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pipelineSteps.map((item, idx) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400/80 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">
                    {item.step}
                  </span>
                  <Activity className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5-Minute Executive Brief for Non-Technical Leadership */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">
              Why this matters to a District Magistrate or Minister of Health:
            </h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <h4 className="font-bold text-white text-sm">Prevents Dispensary Stock-outs</h4>
              <p className="text-slate-400">
                Instead of waiting for a patient to be turned away, the system flags medications reaching critical levels 5 to 7 days before zero stock.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <h4 className="font-bold text-white text-sm">Peer Aid Without Warehouses</h4>
              <p className="text-slate-400">
                State central medical stores take 2-4 weeks to deliver. Our algorithm identifies excess buffer at a neighbouring PHC just 20 km away and coordinates transit in hours.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <h4 className="font-bold text-white text-sm">Decentralized Intelligence</h4>
              <p className="text-slate-400">
                Patient records stay confidential in local jurisdictions while a federated AI model learns outbreak patterns across state borders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
