'use client';

import React from 'react';
import { Package, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { BatchSummary } from '@/types/prediction';
import { cn, formatNumber, formatPercent } from '@/lib/utils';

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
          <div key={i} className="panel-jet p-5 space-y-3 animate-pulse">
            <div className="w-24 h-4 bg-smoke-800 rounded" />
            <div className="w-28 h-7 bg-smoke-800 rounded" />
            <div className="w-36 h-3 bg-smoke-850 rounded" />
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

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Orders */}
        <div className="panel-jet p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-smoke-400">Total orders</span>
            <div className="p-1.5 rounded-md bg-smoke-850 text-smoke-300">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {formatNumber(total_orders)}
            </span>
            <span className="text-xs text-smoke-400">records</span>
          </div>
          <div className="mt-3 text-xs text-smoke-400">
            <span>Manifest batch evaluated</span>
          </div>
        </div>

        {/* Card 2: Predicted Late (Cherry Red Alert) */}
        <div className="panel-jet border-cherry-900/60 p-5 bg-cherry-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cherry-300">Predicted delayed</span>
            <div className="p-1.5 rounded-md bg-cherry-900/40 text-cherry-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-cherry-300 font-mono tabular-nums">
              {formatNumber(delayed_count)}
            </span>
            <span className="text-xs font-mono font-medium text-cherry-300 bg-cherry-900/40 px-1.5 py-0.5 rounded">
              {formatPercent(delay_rate, false, 1)}
            </span>
          </div>
          <div className="mt-3 text-xs text-cherry-400/90">
            <span>Requires operational rerouting</span>
          </div>
        </div>

        {/* Card 3: On-Time Orders */}
        <div className="panel-jet p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-smoke-400">On-time adherence</span>
            <div className="p-1.5 rounded-md bg-smoke-850 text-smoke-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {formatNumber(on_time_count)}
            </span>
            <span className="text-xs font-mono font-medium text-smoke-300 bg-smoke-800 px-1.5 py-0.5 rounded">
              {formatPercent(onTimeRate, false, 1)}
            </span>
          </div>
          <div className="mt-3 text-xs text-smoke-400">
            <span>Within SLA commitment window</span>
          </div>
        </div>

        {/* Card 4: Processing Latency */}
        <div className="panel-jet p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-smoke-400">Inference latency</span>
            <div className="p-1.5 rounded-md bg-smoke-850 text-smoke-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {processing_time_ms.toFixed(1)}
            </span>
            <span className="text-xs text-smoke-400">ms total</span>
          </div>
          <div className="mt-3 text-xs text-smoke-400 font-mono">
            <span>{(processing_time_ms / Math.max(1, total_orders)).toFixed(2)} ms / record</span>
          </div>
        </div>
      </div>
    </div>
  );
};
