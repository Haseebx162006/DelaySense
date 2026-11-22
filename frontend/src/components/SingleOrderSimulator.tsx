'use client';

import React, { useState } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Truck,
  Calendar,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { SingleOrderRequest, SingleOrderResponse } from '@/types/prediction';
import { predictSingleOrder } from '@/lib/api';
import { cn, formatPercent, getRiskBadgeClass } from '@/lib/utils';

export interface SingleOrderSimulatorProps {
  onPredictionComplete?: (result: SingleOrderResponse) => void;
  className?: string;
}

const SHIPPING_MODES = [
  'Standard Class',
  'First Class',
  'Second Class',
  'Same Day',
];

const POPULAR_CITIES = [
  'Caguas',
  'San Jose',
  'Los Angeles',
  'New York',
  'Miami',
  'Chicago',
  'Houston',
  'Seattle',
  'Dallas',
  'Atlanta',
];

export const SingleOrderSimulator: React.FC<SingleOrderSimulatorProps> = ({
  onPredictionComplete,
  className,
}) => {
  const [orderId, setOrderId] = useState<number>(() => Math.floor(70000 + Math.random() * 25000));
  const [customerCity, setCustomerCity] = useState<string>('San Jose');
  const [shippingMode, setShippingMode] = useState<string>('Standard Class');
  const [orderDate, setOrderDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SingleOrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload: SingleOrderRequest = {
      order_id: Number(orderId) || 75000,
      customer_city: customerCity.trim() || 'San Jose',
      shipping_mode: shippingMode,
      order_date: orderDate || new Date().toISOString().split('T')[0],
    };

    try {
      const response = await predictSingleOrder(payload);
      setResult(response);
      onPredictionComplete?.(response);
    } catch (err: unknown) {
      console.error('Single prediction failed:', err);
      setError(err instanceof Error ? err.message : 'Prediction calculation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomize = () => {
    setOrderId(Math.floor(70000 + Math.random() * 25000));
    const randomCity = POPULAR_CITIES[Math.floor(Math.random() * POPULAR_CITIES.length)];
    const randomMode = SHIPPING_MODES[Math.floor(Math.random() * SHIPPING_MODES.length)];
    setCustomerCity(randomCity);
    setShippingMode(randomMode);
    setResult(null);
    setError(null);
  };

  // Dynamic recommendation based on risk and mode
  const getRecommendation = (res: SingleOrderResponse) => {
    if (res.risk_level === 'High') {
      return {
        action: 'Expedite Carrier Dispatch & Buffer Fulfillment',
        details:
          'High probability of transit bottleneck. We advise rerouting through a tier-1 regional hub or upgrading carrier priority to prevent SLA penalty.',
        urgency: 'Immediate Action Advised',
        color: 'rose',
      };
    }
    if (res.risk_level === 'Medium') {
      return {
        action: 'Monitor Telemetry & Early Notification',
        details:
          'Moderate risk detected. Ensure warehouse pick-and-pack SLA is maintained within 12 hours and schedule proactive delivery tracking notifications.',
        urgency: 'Cautionary Advisory',
        color: 'amber',
      };
    }
    return {
      action: 'Standard Fulfillment Cadence',
      details:
        'Optimal delivery path confirmed. Order is tracking safely within delivery SLA commitment thresholds.',
      urgency: 'Optimal SLA Guaranteed',
      color: 'emerald',
    };
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-obsidian-900/60 backdrop-blur-md p-6 shadow-glow-card flex flex-col gap-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Single Order Risk Simulator
            </h3>
          </div>
          <p className="text-xs text-sage-400">
            Simulate and score an ad-hoc order instantly through the trained LightGBM ML model.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomize}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-sage-300 bg-obsidian-800 hover:bg-obsidian-700 border border-white/10 flex items-center gap-1.5 transition-colors"
          title="Randomize input parameters"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sage-400" />
          <span>Randomize</span>
        </button>
      </div>

      {/* Simulator Form and Result Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields */}
        <form onSubmit={handleSimulate} className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Order ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-sage-300 flex items-center gap-1">
                <span>Order ID</span>
                <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={orderId}
                  onChange={(e) => setOrderId(Number(e.target.value))}
                  required
                  placeholder="e.g. 75939"
                  className="w-full px-3.5 py-2 rounded-xl bg-obsidian-800/80 border border-white/10 text-xs text-white placeholder-sage-500 font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>

            {/* Order Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-sage-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Order Date</span>
              </label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-obsidian-800/80 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          {/* Customer City */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-sage-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Customer City</span>
            </label>
            <div className="relative">
              <input
                type="text"
                list="city-options"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                placeholder="Enter or select city..."
                required
                className="w-full px-3.5 py-2 rounded-xl bg-obsidian-800/80 border border-white/10 text-xs text-white placeholder-sage-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
              <datalist id="city-options">
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Shipping Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-sage-300 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shipping Mode</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SHIPPING_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setShippingMode(mode)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all',
                    shippingMode === mode
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-obsidian-800/60 text-sage-400 border-white/5 hover:border-white/20 hover:text-white'
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-white" />
                  <span>Calculating ML Probabilities...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Instant Prediction</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              {error}
            </p>
          )}
        </form>

        {/* Right Column: Instant Inference Output Card */}
        <div className="lg:col-span-6 flex flex-col h-full justify-between">
          {result ? (
            <div className="rounded-2xl border border-white/10 bg-obsidian-950/70 p-5 space-y-5 animate-in fade-in duration-300">
              {/* Order summary header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white">
                    Order #{result.order_id}
                  </span>
                  <span className="text-[11px] text-sage-400">• {result.shipping_mode}</span>
                </div>
                <span
                  className={cn(
                    'text-[11px] font-semibold px-2.5 py-0.5 rounded-md border tracking-wide uppercase',
                    getRiskBadgeClass(result.risk_level)
                  )}
                >
                  {result.risk_level} Risk
                </span>
              </div>

              {/* Status and Probability Gauge */}
              <div className="grid grid-cols-2 gap-4">
                {/* Delayed / On-Time status badge */}
                <div className="p-3.5 rounded-xl bg-obsidian-800/60 border border-white/5 space-y-1">
                  <span className="text-[11px] text-sage-400 uppercase font-medium">
                    Predicted Outcome
                  </span>
                  <div className="flex items-center gap-2 pt-0.5">
                    {result.is_delayed === 1 ? (
                      <>
                        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                        <span className="text-sm font-bold text-rose-300">Late Delivery</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="text-sm font-bold text-emerald-300">On-Time SLA</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Probability Score */}
                <div className="p-3.5 rounded-xl bg-obsidian-800/60 border border-white/5 space-y-1">
                  <span className="text-[11px] text-sage-400 uppercase font-medium">
                    Delay Probability
                  </span>
                  <div className="flex items-baseline gap-1 pt-0.5">
                    <span className="text-xl font-bold font-mono text-white">
                      {formatPercent(result.delay_probability, true, 1)}
                    </span>
                    <span className="text-[10px] text-sage-400">confidence</span>
                  </div>
                </div>
              </div>

              {/* Visual Probability Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-sage-400">Risk Assessment Scale</span>
                  <span className="font-mono font-medium text-emerald-400">
                    {formatPercent(result.delay_probability, true, 0)}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-obsidian-800 border border-white/5 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700',
                      result.risk_level === 'High'
                        ? 'bg-gradient-to-r from-rose-500 to-red-400'
                        : result.risk_level === 'Medium'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    )}
                    style={{ width: `${Math.max(8, result.delay_probability * 100)}%` }}
                  />
                </div>
              </div>

              {/* Actionable Supply Chain Recommendation */}
              {(() => {
                const rec = getRecommendation(result);
                return (
                  <div
                    className={cn(
                      'p-4 rounded-xl border text-xs space-y-2',
                      rec.color === 'rose'
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                        : rec.color === 'amber'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                    )}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {rec.action}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-obsidian-900/60">
                        {rec.urgency}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-relaxed">{rec.details}</p>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Standby Card */
            <div className="h-full rounded-2xl border border-dashed border-white/10 bg-obsidian-950/40 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-obsidian-800 border border-white/5 flex items-center justify-center text-sage-400">
                <Sparkles className="w-6 h-6 text-emerald-400/60" />
              </div>
              <h4 className="text-sm font-semibold text-white">Simulator Standing By</h4>
              <p className="text-xs text-sage-400 max-w-xs leading-relaxed">
                Configure order attributes on the left and trigger{' '}
                <span className="text-emerald-400">Run Instant Prediction</span> to inspect real-time LightGBM inference and mitigation advice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
