import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel } from '@/types/prediction';

/**
 * Combines Tailwind classes cleanly and resolves conflicting utilities
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with standard commas (e.g. 12,450)
 */
export function formatNumber(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Formats a decimal or percentage value (e.g. 38.4%)
 * If isDecimal is true, 0.384 -> 38.4%
 */
export function formatPercent(value: number, isDecimal = false, decimals = 1): string {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  const num = isDecimal ? value * 100 : value;
  return `${num.toFixed(decimals)}%`;
}

/**
 * Formats milliseconds nicely (e.g. "142.5 ms" or "1.24 s")
 */
export function formatMs(ms: number): string {
  if (ms === undefined || ms === null || isNaN(ms)) return '0 ms';
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(2)} s`;
  }
  return `${ms.toFixed(1)} ms`;
}

/**
 * Maps risk level to luxury emerald/amber/rose Tailwind classes
 */
export function getRiskBadgeClass(level: RiskLevel): string {
  switch (level) {
    case 'Low':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Medium':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'High':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  }
}

/**
 * Calculates risk level based on delay probability
 */
export function computeRiskLevel(prob: number): RiskLevel {
  if (prob >= 0.7) return 'High';
  if (prob >= 0.4) return 'Medium';
  return 'Low';
}
