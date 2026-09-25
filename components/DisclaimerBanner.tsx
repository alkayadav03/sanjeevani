'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Info } from 'lucide-react';

export function DisclaimerBanner() {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-slate-900 border-t border-slate-800/80 px-4 py-2.5 text-center text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          <strong className="text-slate-300">Notice:</strong> {t('disclaimerBanner')}
        </span>
      </div>
    </div>
  );
}
