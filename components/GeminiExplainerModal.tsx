'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Sparkles, Volume2, VolumeX, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface GeminiExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  loading: boolean;
  content: string | null;
  source?: string;
  error?: string | null;
}

export function GeminiExplainerModal({
  isOpen,
  onClose,
  title,
  subtitle,
  loading,
  content,
  source,
  error,
}: GeminiExplainerModalProps) {
  const { speak, stopSpeaking, isSpeaking, t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        stopSpeaking();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, stopSpeaking]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gemini-modal-title"
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="gemini-modal-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {title}
              </h2>
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-cyan-300 font-medium animate-pulse">
                Querying Google Gemini AI clinical reasoning engine...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to generate explanation</p>
                <p className="text-rose-400/90 mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap selection:bg-cyan-900">
                {content}
              </div>

              {/* Source Tag & TTS Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Engine: </span>
                  <span className="font-mono text-cyan-300 font-semibold">
                    {source || 'Gemini 1.5 Flash'}
                  </span>
                </div>

                {/* Voice Affordance */}
                {content && (
                  <div className="flex items-center gap-2">
                    {isSpeaking ? (
                      <button
                        onClick={() => stopSpeaking()}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-900/60 text-rose-300 border border-rose-700 text-xs font-semibold hover:bg-rose-900"
                        aria-label="Stop reading aloud"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>{t('stopReading')}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => speak(content)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-semibold hover:bg-cyan-900"
                        aria-label="Read explanation aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t('readAloud')}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
