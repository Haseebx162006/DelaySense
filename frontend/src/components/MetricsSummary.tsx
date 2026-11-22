'use client';

import React from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Percent,
  TrendingDown,
  Clock,
  Sparkles,
} from 'lucide-react';
import { BatchSummary } from '@/types/prediction';
import { cn, formatNumber, formatPercent, formatMs } from '@/lib/utils';

export interface MetricsSummaryProps {
  summary: BatchSummary | null;
  isLoading?: boolean;
  className?: string;
}

export const MetricsSummary: React.FC<MetricsSummaryProps> = ({
  summary,
  isLoading = false,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full', className)}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 bg-obsidian-900/40 p-5 space-y-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 bg-obsidian-800 rounded-md" />
              <div className="w-8 h-8 bg-obsidian-800 rounded-xl" />
            </div>
            <div className="w-28 h-8 bg-obsidian-800 rounded-lg" />
            <div className="w-36 h-3 bg-obsidian-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const {
    total_orders,
    delayed_count,
    on_time_count,
    delay_rate,
    processing_time_ms,
  } = summary;

  const onTimeRate = total_orders > 0 ? (on_time_count / total_orders) * 100 : 0;
  const isHighRisk = delay_rate >= 50;
  const isMediumRisk = delay_rate >= 25 && delay_rate < 50;

  // SVG Radial meter math for delay rate (radius 32, circumference ~ 201)
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, delay_rate)) / 100) * circumference;

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Upper KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Orders */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-obsidian-900/60 p-5 backdrop-blur-md shadow-glow-card transition-all duration-300 hover:border-white/20 hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sage-400 uppercase tracking-wider">
              Total Telemetry Analyzed
            </span>
            <div className="w-9 h-9 rounded-xl bg-obsidian-800 border border-white/10 flex items-center justify-center text-sage-300">
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {formatNumber(total_orders)}
            </span>
            <span className="text-xs text-sage-400">orders</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-sage-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dataset batch synchronized</span>
          </div>
        </div>

        {/* Card 2: Delayed Orders (Late Delivery Risk) */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-b from-rose-950/20 to-obsidian-900/60 p-5 backdrop-blur-md shadow-glass transition-all duration-300 hover:border-rose-500/40 hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-300 uppercase tracking-wider">
              Predicted Delayed
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-300 tracking-tight font-mono">
              {formatNumber(delayed_count)}
            </span>
            <span className="text-xs font-medium text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
              {formatPercent(delay_rate, false, 1)}
            </span>
          </div>

          <div className="mt-3 text-xs text-rose-300/80 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            <span>Requires operational mitigation</span>
          </div>
        </div>

        {/* Card 3: On-Time Orders */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-obsidian-900/60 p-5 backdrop-blur-md shadow-glass transition-all duration-300 hover:border-emerald-500/40 hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-300 uppercase tracking-wider">
              On-Time Deliveries
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-300 tracking-tight font-mono">
              {formatNumber(on_time_count)}
            </span>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              {formatPercent(onTimeRate, false, 1)}
            </span>
          </div>

          <div className="mt-3 text-xs text-emerald-300/80 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Within SLA commitment bounds</span>
          </div>
        </div>

        {/* Card 4: Overall Delay Rate with Radial Progress */}
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 hover:scale-[1.01]',
            isHighRisk
              ? 'border-rose-500/30 bg-rose-950/20 shadow-[0_0_25px_-5px_rgba(244,63,94,0.15)]'
              : isMediumRisk
              ? 'border-amber-500/30 bg-amber-950/20 shadow-[0_0_25px_-5px_rgba(245,158,11,0.15)]'
              : 'border-emerald-500/30 bg-emerald-950/20 shadow-glow-emerald'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-sage-300 uppercase tracking-wider">
                Overall Delay Rate
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span
                  className={cn(
                    'text-3xl font-extrabold font-mono tracking-tight',
                    isHighRisk
                      ? 'text-rose-400'
                      : isMediumRisk
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  )}
                >
                  {delay_rate.toFixed(1)}
                </span>
                <span className="text-base font-semibold text-sage-400">%</span>
              </div>
            </div>

            {/* Radial Meter */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="transparent"
                  className="text-white/5"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className={cn(
                    'transition-all duration-1000 ease-out',
                    isHighRisk
                      ? 'text-rose-500'
                      : isMediumRisk
                      ? 'text-amber-500'
                      : 'text-emerald-400'
                  )}
                />
              </svg>
              <Percent
                className={cn(
                  'w-4 h-4 absolute',
                  isHighRisk
                    ? 'text-rose-400'
                    : isMediumRisk
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                )}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span
              className={cn(
                'inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full text-[11px] border',
                isHighRisk
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : isMediumRisk
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              )}
            >
              {isHighRisk ? 'High Delay Risk' : isMediumRisk ? 'Elevated Risk' : 'Optimal SLA'}
            </span>
            <span className="text-[11px] text-sage-400">Target &lt; 20%</span>
          </div>
        </div>
      </div>

      {/* Latency & Hardware Performance Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 rounded-xl border border-white/5 bg-obsidian-900/40 text-xs text-sage-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Zap className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="font-medium text-white">ML Inference Latency:</span>
          <span className="font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {formatMs(processing_time_ms)}
          </span>
          <span className="text-sage-400 hidden md:inline">
            ({(processing_time_ms / Math.max(1, total_orders)).toFixed(2)} ms / record)
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-sage-400 font-mono">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>Sub-second ML performance</span>
          </span>
          <span>•</span>
          <span className="text-emerald-400">LightGBM v4.x</span>
        </div>
      </div>
    </div>
  );
};
