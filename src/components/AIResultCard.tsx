import React from 'react';
import { MLPredictionResult } from '../types.ts';
import { CircularConfidenceGauge } from './CircularConfidenceGauge.tsx';
import { ShieldAlert, ShieldCheck, ShieldX, Edit3, X, AlertTriangle, Cpu } from 'lucide-react';

interface Props {
  result: MLPredictionResult;
  onEdit?: () => void;
  onCancel?: () => void;
  onForceAllow?: () => void;
}

export const AIResultCard: React.FC<Props> = ({ result, onEdit, onCancel, onForceAllow }) => {
  const isSafe = result.prediction === 'safe';
  const isBullying = result.prediction === 'bullying';
  const isSevere = result.prediction === 'severe_bullying';

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 shadow-sm ${
        isSafe
          ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100'
          : isBullying
          ? 'bg-amber-50/80 border-amber-200 dark:bg-amber-950/25 dark:border-amber-800/50 text-amber-950 dark:text-amber-100'
          : 'bg-rose-50/80 border-rose-200 dark:bg-rose-950/25 dark:border-rose-800/50 text-rose-950 dark:text-rose-100'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl mt-0.5 ${
              isSafe
                ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                : isBullying
                ? 'bg-amber-500 text-white dark:bg-amber-600'
                : 'bg-rose-600 text-white'
            }`}
          >
            {isSafe && <ShieldCheck className="w-5 h-5" />}
            {isBullying && <AlertTriangle className="w-5 h-5" />}
            {isSevere && <ShieldX className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                AI Analysis Result:
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isSafe
                    ? 'bg-emerald-600 text-white'
                    : isBullying
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {isSafe && 'SAFE'}
                {isBullying && 'WARNING'}
                {isSevere && 'SEVERE CYBERBULLYING'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/60 font-mono">
                <Cpu className="w-3 h-3 text-indigo-500" />
                {result.language} NLP
              </span>
            </div>

            <h4 className="text-base font-bold mt-2">
              {isSafe && '✓ Safe — COMMENT ALLOWED'}
              {isBullying && '⚠ Warning — REVIEW REQUIRED'}
              {isSevere && '⛔ Cyberbullying Detected — COMMENT BLOCKED'}
            </h4>

            <p className="text-xs sm:text-sm mt-1 opacity-90 leading-relaxed max-w-xl">
              {result.reason}
            </p>

            {result.detected_categories && result.detected_categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-xs font-medium opacity-75">Signals:</span>
                {result.detected_categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border border-current/10 font-medium capitalize"
                  >
                    {cat.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="flex flex-col items-center shrink-0">
          <CircularConfidenceGauge confidence={result.confidence} prediction={result.prediction} size={64} />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-1 opacity-75">
            Confidence
          </span>
        </div>
      </div>

      {/* Action buttons if not safe */}
      {!isSafe && (
        <div className="mt-4 pt-3 border-t border-current/10 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs opacity-80">
            {isSevere ? 'Violations of safety guidelines cannot be published.' : 'Please consider editing to foster respectful discourse.'}
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                Edit Comment
              </button>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
            {isBullying && onForceAllow && (
              <button
                type="button"
                onClick={onForceAllow}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-amber-900 dark:text-amber-200 hover:bg-amber-200/50 dark:hover:bg-amber-900/40 transition cursor-pointer"
                title="Post anyway with warning recorded"
              >
                Post Anyway
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
