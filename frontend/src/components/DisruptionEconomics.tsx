'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingDown, ArrowRight, Check } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export const DisruptionEconomics: React.FC = () => {
  const [monthlyOrders, setMonthlyOrders] = useState<number>(25000);
  const [delayRate, setDelayRate] = useState<number>(32);
  const [penaltyPerLateOrder, setPenaltyPerLateOrder] = useState<number>(65);

  // Calculations
  const monthlyLateOrders = Math.round((monthlyOrders * delayRate) / 100);
  const annualLateOrders = monthlyLateOrders * 12;
  const annualPenaltyLoss = annualLateOrders * penaltyPerLateOrder;
  // DelaySense typically mitigates ~74% of SLA penalties through dynamic buffers and proactive rerouting
  const annualSavings = Math.round(annualPenaltyLoss * 0.74);
  const estimatedPlatformCost = Math.round(monthlyOrders * 0.12 * 12);
  const netRoi = Math.max(1.5, Math.round((annualSavings / Math.max(1, estimatedPlatformCost)) * 10) / 10);

  return (
    <section id="economics" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-smoke-800 bg-jet-950">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading: Benefit first, no eyebrow */}
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Calculate your freight SLA penalty exposure
          </h2>
          <p className="mt-3 text-sm sm:text-base text-smoke-400 leading-relaxed">
            Late deliveries incur contractual carrier penalties, detention fees, and customer chargebacks. Model how proactive delay mitigation safeguards your bottom line.
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders Column */}
          <div className="lg:col-span-7 panel-jet p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-smoke-300 font-medium">Monthly freight volume</span>
                <span className="font-mono text-white tabular-nums font-semibold">
                  {formatNumber(monthlyOrders)} shipments / mo
                </span>
              </div>
              <input
                type="range"
                min={2000}
                max={150000}
                step={1000}
                value={monthlyOrders}
                onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                className="w-full h-1.5 bg-smoke-800 rounded-lg appearance-none cursor-pointer accent-cherry-600"
              />
              <div className="flex justify-between text-[10px] text-smoke-500 font-mono">
                <span>2,000 (mid-market)</span>
                <span>50,000 (enterprise)</span>
                <span>150,000+ (global)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-smoke-300 font-medium">Estimated baseline delay frequency</span>
                <span className="font-mono text-cherry-400 tabular-nums font-semibold">
                  {delayRate}% of shipments
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={1}
                value={delayRate}
                onChange={(e) => setDelayRate(Number(e.target.value))}
                className="w-full h-1.5 bg-smoke-800 rounded-lg appearance-none cursor-pointer accent-cherry-600"
              />
              <div className="flex justify-between text-[10px] text-smoke-500 font-mono">
                <span>5% (tight control)</span>
                <span>30% (industry average)</span>
                <span>60% (volatile lanes)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-smoke-300 font-medium">
                  Average SLA breach fine &amp; detention cost per delayed order
                </span>
                <span className="font-mono text-white tabular-nums font-semibold">
                  ${penaltyPerLateOrder} / incident
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={250}
                step={5}
                value={penaltyPerLateOrder}
                onChange={(e) => setPenaltyPerLateOrder(Number(e.target.value))}
                className="w-full h-1.5 bg-smoke-800 rounded-lg appearance-none cursor-pointer accent-cherry-600"
              />
              <div className="flex justify-between text-[10px] text-smoke-500 font-mono">
                <span>$15 (express e-comm)</span>
                <span>$65 (standard freight)</span>
                <span>$250 (critical JIT manufacturing)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-smoke-800 flex items-center justify-between text-xs text-smoke-400">
              <span>Unmitigated monthly delayed orders:</span>
              <span className="font-mono text-white font-medium tabular-nums">
                ~{formatNumber(monthlyLateOrders)} orders / mo
              </span>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 panel-jet-elevated p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs text-smoke-400 block">Projected annual SLA penalty recovery</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                  ${formatNumber(annualSavings)}
                </span>
                <span className="text-xs text-smoke-400">/ year</span>
              </div>
              <p className="text-xs text-smoke-400 mt-1">
                Based on 74% proactive mitigation of avoidable carrier schedule breaches.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-smoke-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-smoke-400">Gross annual penalty exposure:</span>
                <span className="font-mono text-cherry-400 tabular-nums font-medium">
                  -${formatNumber(annualPenaltyLoss)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-smoke-400">Estimated platform investment:</span>
                <span className="font-mono text-smoke-200 tabular-nums font-medium">
                  ~${formatNumber(estimatedPlatformCost)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-smoke-400">Net projected ROI multiplier:</span>
                <span className="font-mono text-white font-bold tabular-nums">
                  {netRoi}x cost recovery
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-smoke-900 border border-smoke-800 text-xs text-smoke-300 space-y-2">
              <span className="font-semibold text-white block">Key enterprise impact:</span>
              <ul className="space-y-1.5 text-[11px] text-smoke-400">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-smoke-300 shrink-0" />
                  <span>36-hour pre-departure delay alerts for terminal re-routing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-smoke-300 shrink-0" />
                  <span>Elimination of disputed late-delivery chargebacks</span>
                </li>
              </ul>
            </div>

            <a href="#workbench" className="btn-cherry w-full text-center">
              <span>Test with your own data</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
