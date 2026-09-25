'use client';

import React from 'react';
import { RiskLevel } from '@/lib/data/types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function RiskBadge({ level, size = 'md', showIcon = true }: RiskBadgeProps) {
  const { t } = useLanguage();

  const config = {
    NORMAL: {
      label: t('badgeNormal'),
      bg: 'bg-emerald-950/70 text-emerald-400 border-emerald-600/50',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
    },
    WARNING: {
      label: t('badgeWarning'),
      bg: 'bg-amber-950/70 text-amber-300 border-amber-500/50',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    HIGH_RISK: {
      label: t('badgeHighRisk'),
      bg: 'bg-orange-950/80 text-orange-300 border-orange-500/60',
      icon: AlertOctagon,
      iconColor: 'text-orange-400',
    },
    CRITICAL: {
      label: t('badgeCritical'),
      bg: 'bg-rose-950/90 text-rose-300 border-rose-600 animate-pulse',
      icon: Flame,
      iconColor: 'text-rose-400',
    },
  }[level] || {
    label: level,
    bg: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: ShieldCheck,
    iconColor: 'text-slate-400',
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold tracking-wide',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} transition-all`}
      role="status"
      aria-label={`Risk level: ${config.label}`}
    >
      {showIcon && <IconComponent className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
}
