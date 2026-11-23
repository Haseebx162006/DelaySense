'use client';

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Clock,
  MapPin,
  Truck,
  Calendar,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { SingleOrderRequest, SingleOrderResponse } from '@/types/prediction';
import { predictSingleOrder } from '@/lib/api';
import { cn, formatPercent } from '@/lib/utils';

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

  return (
    <div className={cn('panel-jet p-6 flex flex-col gap-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-smoke-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white">Single order route simulator</h3>
          <p className="text-xs text-smoke-400 mt-0.5">
            Evaluate individual delivery parameters through the trained ensemble pipeline.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomize}
          className="btn-secondary text-xs px-3 py-1.5"
          title="Randomize parameters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Randomize</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields */}
        <form onSubmit={handleSimulate} className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-smoke-300">Order ID</label>
              <input
                type="number"
                value={orderId}
                onChange={(e) => setOrderId(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-lg bg-smoke-900 border border-smoke-800 text-xs text-white font-mono tabular-nums focus:outline-none focus:border-smoke-600 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-smoke-300">Order date</label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-smoke-900 border border-smoke-800 text-xs text-white font-mono focus:outline-none focus:border-smoke-600 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-smoke-300">Customer city destination</label>
            <input
              type="text"
              list="city-options"
              value={customerCity}
              onChange={(e) => setCustomerCity(e.target.value)}
              placeholder="e.g. San Jose, Los Angeles..."
              required
              className="w-full px-3 py-2 rounded-lg bg-smoke-900 border border-smoke-800 text-xs text-white focus:outline-none focus:border-smoke-600 transition-colors"
            />
            <datalist id="city-options">
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-smoke-300">Shipping mode</label>
            <div className="grid grid-cols-2 gap-2">
              {SHIPPING_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setShippingMode(mode)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-medium border text-left transition-colors',
                    shippingMode === mode
                      ? 'bg-smoke-800 text-white border-smoke-600'
                      : 'bg-smoke-900 text-smoke-400 border-smoke-800 hover:text-smoke-200'
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-cherry w-full"
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-white" />
                  <span>Evaluating ensemble models...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Calculate delay risk</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="text-xs text-cherry-300 bg-cherry-950/40 p-2.5 rounded-lg border border-cherry-800">
              {error}
            </p>
          )}
        </form>

        {/* Right Column: Output */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full">
          {result ? (
            <div className="panel-jet-elevated p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-smoke-800 pb-3">
                <span className="font-mono text-xs text-smoke-200 font-medium tabular-nums">
                  Order #{result.order_id} · {result.shipping_mode}
                </span>
                <span
                  className={cn(
                    'text-[11px] font-medium px-2 py-0.5 rounded',
                    result.risk_level === 'High'
                      ? 'bg-cherry-950/80 text-cherry-300 border border-cherry-800'
                      : result.risk_level === 'Medium'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      : 'bg-smoke-800 text-smoke-200 border border-smoke-700'
                  )}
                >
                  {result.risk_level} risk tier
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-smoke-900 border border-smoke-800">
                  <span className="text-[11px] text-smoke-400 block">Predicted delivery</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {result.is_delayed === 1 ? (
                      <>
                        <ShieldAlert className="w-4 h-4 text-cherry-400 shrink-0" />
                        <span className="text-xs font-semibold text-cherry-300">Late delivery</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-smoke-200 shrink-0" />
                        <span className="text-xs font-semibold text-smoke-200">On-time adherence</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-smoke-900 border border-smoke-800">
                  <span className="text-[11px] text-smoke-400 block">Probability score</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-bold font-mono text-white tabular-nums">
                      {formatPercent(result.delay_probability, true, 1)}
                    </span>
                    <span className="text-[10px] text-smoke-400">calibrated</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-smoke-400">
                  <span>Ensemble threshold scale</span>
                  <span className="font-mono tabular-nums text-smoke-300">
                    {formatPercent(result.delay_probability, true, 0)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-smoke-900 border border-smoke-800 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      result.risk_level === 'High' ? 'bg-cherry-500' : 'bg-smoke-400'
                    )}
                    style={{ width: `${Math.max(6, result.delay_probability * 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-smoke-900 border border-smoke-800 text-xs text-smoke-300 space-y-1">
                <span className="font-medium text-white block">Mitigation protocol:</span>
                <p className="text-[11px] text-smoke-400 leading-relaxed">
                  {result.risk_level === 'High'
                    ? 'Proactively adjust customer dispatch window by +24h to avoid carrier SLA failure penalties.'
                    : result.risk_level === 'Medium'
                    ? 'Monitor local terminal queues and assign automated milestone tracking alerts.'
                    : 'Standard fulfillment cadence. Expected to meet scheduled delivery timeline.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full rounded-xl border border-dashed border-smoke-800 p-8 flex flex-col items-center justify-center text-center text-smoke-500 space-y-2">
              <span className="text-sm font-medium text-smoke-300">Simulator ready</span>
              <p className="text-xs text-smoke-400 max-w-xs">
                Select or randomize shipment attributes and click Calculate delay risk to test the model.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
