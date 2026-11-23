'use client';

import React, { useState } from 'react';
import { Sliders, RefreshCw, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

export const DelayStressTester: React.FC = () => {
  const [customsHoldHours, setCustomsHoldHours] = useState<number>(12);
  const [portCongestion, setPortCongestion] = useState<number>(1.5);
  const [transitBufferDays, setTransitBufferDays] = useState<number>(1);
  const [weatherSeverity, setWeatherSeverity] = useState<'Clear' | 'Moderate' | 'Severe'>('Moderate');

  const calculateDisruptionRisk = () => {
    let base = 25; // baseline risk %
    base += (customsHoldHours / 72) * 35;
    base += (portCongestion - 1.0) * 20;
    base -= transitBufferDays * 8;
    if (weatherSeverity === 'Moderate') base += 12;
    if (weatherSeverity === 'Severe') base += 28;

    return Math.min(96, Math.max(8, Math.round(base * 10) / 10));
  };

  const currentRisk = calculateDisruptionRisk();
  const isHigh = currentRisk >= 60;
  const isMedium = currentRisk >= 35 && currentRisk < 60;

  const resetDefaults = () => {
    setCustomsHoldHours(12);
    setPortCongestion(1.5);
    setTransitBufferDays(1);
    setWeatherSeverity('Moderate');
  };

  return (
    <div className="panel-jet p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-smoke-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white">
            What-if delay sensitivity stress tester
          </h3>
          <p className="text-xs text-smoke-400 mt-0.5">
            Evaluate how external customs holds, terminal congestion, and weather shocks compound transit delay risk.
          </p>
        </div>

        <button
          type="button"
          onClick={resetDefaults}
          className="btn-secondary text-xs px-3 py-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset parameters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Slider 1: Customs Hold */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-smoke-300 font-medium">Customs clearance hold</span>
              <span className="font-mono text-white tabular-nums">{customsHoldHours} hours</span>
            </div>
            <input
              type="range"
              min={0}
              max={72}
              step={4}
              value={customsHoldHours}
              onChange={(e) => setCustomsHoldHours(Number(e.target.value))}
              className="w-full h-1.5 bg-smoke-800 rounded-lg appearance-none cursor-pointer accent-cherry-600"
            />
            <div className="flex justify-between text-[10px] text-smoke-500 font-mono">
              <span>0h (instant)</span>
              <span>36h (standard)</span>
              <span>72h (high delay)</span>
            </div>
          </div>

          {/* Slider 2: Port Congestion Factor */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-smoke-300 font-medium">Port / yard berth congestion multiplier</span>
              <span className="font-mono text-white tabular-nums">{portCongestion.toFixed(1)}x baseline</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={3.0}
              step={0.1}
              value={portCongestion}
              onChange={(e) => setPortCongestion(Number(e.target.value))}
              className="w-full h-1.5 bg-smoke-800 rounded-lg appearance-none cursor-pointer accent-cherry-600"
            />
            <div className="flex justify-between text-[10px] text-smoke-500 font-mono">
              <span>1.0x (normal flow)</span>
              <span>2.0x (elevated dwell)</span>
              <span>3.0x (severe gridlock)</span>
            </div>
          </div>

          {/* Slider 3: Scheduled Transit Buffer */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-smoke-300 font-medium">Customer promise buffer days</span>
              <span className="font-mono text-white tabular-nums">{transitBufferDays} days</span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={transitBufferDays}
              onChange={(e) => setTransitBufferDays(Number(e.target.value))}
              className="w-full h-1.5 bg-smoke-800 rounded-lg appearance-none cursor-pointer accent-cherry-600"
            />
            <div className="flex justify-between text-[10px] text-smoke-500 font-mono">
              <span>0 days (strict JIT)</span>
              <span>2 days (recommended)</span>
              <span>4 days (safe cushion)</span>
            </div>
          </div>

          {/* Segmented Selector: Weather Disruption */}
          <div className="space-y-2">
            <span className="text-xs text-smoke-300 font-medium block">
              En route transit weather anomaly
            </span>
            <div className="segmented-control w-full">
              {(['Clear', 'Moderate', 'Severe'] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeatherSeverity(w)}
                  className={`flex-1 text-center py-1.5 text-xs rounded-md transition-colors ${
                    weatherSeverity === w ? 'segmented-item-active' : 'segmented-item-inactive'
                  }`}
                >
                  {w} conditions
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Output Column */}
        <div className="lg:col-span-5 panel-jet-elevated p-6 space-y-5">
          <div>
            <span className="text-xs text-smoke-400 block">Simulated disruption probability</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span
                className={`text-4xl sm:text-5xl font-black font-mono tabular-nums ${
                  isHigh ? 'text-cherry-400' : isMedium ? 'text-amber-400' : 'text-smoke-200'
                }`}
              >
                {currentRisk}%
              </span>
              <span className="text-xs text-smoke-400 font-medium">risk score</span>
            </div>
          </div>

          {/* Bar indicator */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 rounded-full bg-smoke-900 border border-smoke-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  isHigh ? 'bg-cherry-600' : isMedium ? 'bg-amber-500' : 'bg-smoke-400'
                }`}
                style={{ width: `${currentRisk}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-smoke-500 font-mono">
              <span>Low (0–34%)</span>
              <span>Medium (35–59%)</span>
              <span>Critical (60%+)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-smoke-900 border border-smoke-800 space-y-1 text-xs">
            <span className="font-semibold text-white block">Operational consequence:</span>
            <p className="text-[11px] text-smoke-400 leading-relaxed">
              {isHigh
                ? 'High risk of breaching carrier SLA. An estimated +2.8 days of variance will impact warehouse intake unless inventory is rerouted through a local secondary terminal.'
                : isMedium
                ? 'Moderate schedule stress. Delivery variance remains manageable if local dispatch buffers are deployed within 24 hours.'
                : 'Resilient delivery path. The current buffer absorbs external customs and terminal delays without breaching commitment dates.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
