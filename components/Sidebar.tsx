'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { useResilienceStore } from '@/lib/useResilienceStore';
import {
  LayoutDashboard,
  MapPin,
  Pill,
  Users,
  Bed,
  UserCog,
  TrendingUp,
  AlertCircle,
  Truck,
  Flame,
  Cpu,
  BarChart3,
  FileText,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { data } = useResilienceStore();

  const criticalAlertCount = data?.stats?.alerts?.critical || 0;
  const activeTransferCount = data?.stats?.redistribution?.recommended || 0;

  const navItems = [
    { href: '/dashboard', label: t('navOverview'), icon: LayoutDashboard },
    { href: '/phc-network', label: t('navPhcNetwork'), icon: MapPin },
    { href: '/inventory', label: t('navInventory'), icon: Pill },
    { href: '/patients', label: t('navPatients'), icon: Users },
    { href: '/beds', label: t('navBeds'), icon: Bed },
    { href: '/staff', label: t('navStaff'), icon: UserCog },
    { href: '/forecasts', label: t('navForecasts'), icon: TrendingUp },
    {
      href: '/alerts',
      label: t('navAlerts'),
      icon: AlertCircle,
      badge: criticalAlertCount > 0 ? criticalAlertCount : null,
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      href: '/redistribution',
      label: t('navRedistribution'),
      icon: Truck,
      badge: activeTransferCount > 0 ? activeTransferCount : null,
      badgeColor: 'bg-teal-600 text-white',
    },
    { href: '/emergency', label: t('navEmergency'), icon: Flame, special: true },
    { href: '/federated', label: t('navFederated'), icon: Cpu },
    { href: '/analytics', label: t('navAnalytics'), icon: BarChart3 },
    { href: '/reports', label: t('navReports'), icon: FileText },
    { href: '/settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-slate-950/80 p-3 shrink-0">
      <div className="space-y-1 py-2">
        <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          Command Modules
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-sm'
                  : item.special
                  ? 'text-rose-400 hover:bg-rose-950/40 hover:text-rose-300'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-cyan-400'
                      : item.special
                      ? 'text-rose-500'
                      : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Resilience Pipeline Box */}
      <div className="mt-auto p-3 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Resilience Loop</span>
        </div>
        <div className="text-[11px] text-slate-400 space-y-1">
          <p className="font-mono text-[10px] text-teal-300">MONITOR → PREDICT → WARN → EXPLAIN → OPTIMIZE → REDISTRIBUTE</p>
          <p className="text-slate-500 text-[10px] pt-1 border-t border-slate-800">
            Autonomous peer-to-peer balancing across 100 PHCs.
          </p>
        </div>
      </div>
    </aside>
  );
}
