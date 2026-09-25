'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { Shield, User, Building2, Globe, Check, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<'phc_staff' | 'district_admin' | 'state_admin'>('district_admin');
  const [facilityName, setFacilityName] = useState('Amritsar District Command Centre');

  const roles = [
    {
      id: 'phc_staff',
      title: 'PHC Medical Officer & Staff',
      subtitle: 'Facility Level Operations',
      badge: 'Local PHC',
      description: 'Log daily drug receipts, report emergency ward beds, monitor local stock depletion, and request emergency transfers.',
      defaultFacility: 'Kalyanpur PHC (Amritsar)',
      icon: User,
    },
    {
      id: 'district_admin',
      title: 'District Chief Medical Officer (CMO)',
      subtitle: 'District Administration',
      badge: 'District HQ',
      description: 'Approve inter-PHC drug transfers, balance beds across blocks, dispatch ambulances, and coordinate regional response.',
      defaultFacility: 'Amritsar District Command Centre',
      icon: Building2,
    },
    {
      id: 'state_admin',
      title: 'State & National Mission Director',
      subtitle: 'State & National Level',
      badge: 'State Directorate',
      description: 'Oversee interstate health telemetry, track cross-district epidemics, coordinate central reserve supply, and run federated AI aggregation.',
      defaultFacility: 'National Health Mission Directorate',
      icon: Globe,
    },
  ];

  const handleLogin = (roleId: string, facility: string) => {
    if (typeof window !== 'undefined') {
      const roleObj = roles.find((r) => r.id === roleId);
      localStorage.setItem('swasthya_role', roleObj?.title || 'District Administrator');
      localStorage.setItem('swasthya_facility', facility);
    }
    router.push('/dashboard');
  };

  return (
    <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-lg mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Role Selection & Demo Authentication
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Select a verified role to experience the platform from a Medical Officer, CMO, or State Director perspective.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {roles.map((r) => {
            const isSelected = selectedRole === r.id;
            const Icon = r.icon;

            return (
              <div
                key={r.id}
                onClick={() => {
                  setSelectedRole(r.id as any);
                  setFacilityName(r.defaultFacility);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {r.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{r.title}</h3>
                    <p className="text-[11px] text-cyan-400 font-medium">{r.subtitle}</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="text-slate-400">Facility: </span>
                  <span className="text-slate-300 font-semibold">{r.defaultFacility}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => handleLogin(selectedRole, facilityName)}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>Sign In as {roles.find((r) => r.id === selectedRole)?.title.split('(')[0]}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Demo credentials note */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
          <span>Demo Credentials: </span>
          <code className="text-cyan-300 font-mono">admin@nhm.gov.in</code> |{' '}
          <span className="text-slate-400">Security Mode: </span>
          <span className="text-emerald-400 font-semibold">Pre-authenticated Session</span>
        </div>
      </div>
    </div>
  );
}
