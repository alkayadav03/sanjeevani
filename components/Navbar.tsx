'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { useResilienceStore } from '@/lib/useResilienceStore';
import {
  Activity,
  AlertTriangle,
  RotateCcw,
  Languages,
  Sparkles,
  Wifi,
  WifiOff,
  UserCheck,
  Menu,
  X,
  Shield,
} from 'lucide-react';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { data, simulateEmergency, resetDemo, isOffline } = useResilienceStore();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<'READY' | 'CHECKING' | 'NOT_CONFIGURED'>('CHECKING');
  const [currentRole, setCurrentRole] = useState<string>('District Administrator');

  useEffect(() => {
    // Check saved role
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('swasthya_role');
      if (savedRole) setCurrentRole(savedRole);
    }

    // Check Gemini configuration status
    fetch('/api/gemini/status')
      .then((res) => res.json())
      .then((data) => {
        setGeminiStatus(data.configured ? 'READY' : 'NOT_CONFIGURED');
      })
      .catch(() => setGeminiStatus('NOT_CONFIGURED'));
  }, []);

  const isEmergencyActive = data?.emergency?.isActive;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Cross-Border Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-700 text-white shadow-lg shadow-cyan-900/30 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
              <Activity className="w-3 h-3 absolute text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-base sm:text-lg tracking-tight">
                  {t('appTitle')}
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  NHM Pilot
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
                {t('appSubtitle')}
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Live Emergency Banner Indicator */}
        {isEmergencyActive && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-600 text-rose-300 text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>EMERGENCY PROTOCOL ACTIVE: SURGE +120%</span>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline indicator */}
          {isOffline && (
            <span
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-amber-950 text-amber-300 border border-amber-600"
              title="Working offline using cached local storage telemetry"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline Cache</span>
            </span>
          )}

          {/* Gemini AI Status Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs"
            title={
              geminiStatus === 'READY'
                ? 'Google Gemini 1.5 Flash Connected'
                : 'Gemini running in local algorithmic expert mode (GEMINI_API_KEY optional)'
            }
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${
                geminiStatus === 'READY' ? 'text-cyan-400' : 'text-slate-400'
              }`}
            />
            <span className="text-slate-400">Gemini AI:</span>
            <span
              className={`font-semibold ${
                geminiStatus === 'READY' ? 'text-cyan-400' : 'text-amber-400'
              }`}
            >
              {geminiStatus === 'READY' ? 'Live' : 'Local Fallback'}
            </span>
          </div>

          {/* Emergency Trigger Button */}
          <button
            onClick={() => simulateEmergency()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              isEmergencyActive
                ? 'bg-rose-600 text-white hover:bg-rose-700 ring-2 ring-rose-500/50'
                : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/60'
            }`}
            title="Trigger mass epidemic and surge simulation"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('simulateEmergency')}</span>
            <span className="sm:hidden">🚨 Surge</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={() => resetDemo()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            title="Restore original deterministic seeded state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{t('resetDemo')}</span>
          </button>

          {/* Language Switcher (EN / HI) */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 transition-colors"
            aria-label="Toggle language between English and Hindi"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Role badge */}
          <Link
            href="/login"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Switch demo role or facility"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="truncate max-w-[120px]">{currentRole}</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-2">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
          >
            Dashboard
          </Link>
          <Link
            href="/phc-network"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
          >
            PHC Network (Map)
          </Link>
          <Link
            href="/alerts"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-sm text-rose-300 hover:bg-slate-900 font-semibold"
          >
            Stock Alerts
          </Link>
          <Link
            href="/redistribution"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-sm text-teal-300 hover:bg-slate-900 font-semibold"
          >
            Resource Redistribution
          </Link>
          <Link
            href="/emergency"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-sm text-orange-300 hover:bg-slate-900 font-semibold"
          >
            Emergency Mode & Timeline
          </Link>
          <Link
            href="/forecasts"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
          >
            AI Forecasts
          </Link>
          <Link
            href="/federated"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-sm text-cyan-300 hover:bg-slate-900"
          >
            Federated AI Simulation
          </Link>
          <Link
            href="/reports"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
          >
            Printable Reports
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
          >
            Settings & Localization
          </Link>
        </div>
      )}
    </header>
  );
}
