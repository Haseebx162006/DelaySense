'use client';

import React, { useState } from 'react';
import { Ship, Plane, Train, Truck, AlertTriangle, ArrowRight } from 'lucide-react';

interface Corridor {
  id: string;
  name: string;
  mode: string;
  icon: React.ElementType;
  origin: string;
  destination: string;
  scheduledDays: number;
  actualAvgDays: number;
  delayRate: number;
  primaryRisk: string;
  reliabilityScore: number;
  activeShipments: string;
}

const CORRIDORS: Corridor[] = [
  {
    id: 'transpacific-sea',
    name: 'Trans-Pacific Maritime Lane',
    mode: 'Standard Class (Maritime)',
    icon: Ship,
    origin: 'Ningbo / Shanghai',
    destination: 'Los Angeles / Long Beach',
    scheduledDays: 4,
    actualAvgDays: 5.6,
    delayRate: 58.2,
    primaryRisk: 'Berth congestion & container chassis shortage',
    reliabilityScore: 68,
    activeShipments: '14,280 TEU',
  },
  {
    id: 'transatlantic-sea',
    name: 'Trans-Atlantic Continental Lane',
    mode: 'Second Class (Maritime)',
    icon: Ship,
    origin: 'Rotterdam / Antwerp',
    destination: 'New York / New Jersey',
    scheduledDays: 3,
    actualAvgDays: 3.8,
    delayRate: 41.5,
    primaryRisk: 'North Atlantic winter storm routing adjustments',
    reliabilityScore: 82,
    activeShipments: '8,420 TEU',
  },
  {
    id: 'intermodal-rail',
    name: 'North American Intermodal Rail',
    mode: 'Standard Class (Rail)',
    icon: Train,
    origin: 'Chicago Intermodal Hub',
    destination: 'Dallas / Fort Worth',
    scheduledDays: 2,
    actualAvgDays: 2.7,
    delayRate: 36.8,
    primaryRisk: 'Classification yard switching queues & dwell time',
    reliabilityScore: 88,
    activeShipments: '4,190 Units',
  },
  {
    id: 'transpacific-air',
    name: 'High-Tech Priority Air Freight',
    mode: 'First Class (Air Cargo)',
    icon: Plane,
    origin: 'Taipei / Taoyuan',
    destination: 'Frankfurt Main Airport',
    scheduledDays: 1,
    actualAvgDays: 1.4,
    delayRate: 24.1,
    primaryRisk: 'Customs electronic declaration clearance holds',
    reliabilityScore: 94,
    activeShipments: '620 Metric Tons',
  },
];

export const CorridorMatrix: React.FC = () => {
  const [activeCorridorId, setActiveCorridorId] = useState<string>('transpacific-sea');

  const selected = CORRIDORS.find((c) => c.id === activeCorridorId) || CORRIDORS[0];

  return (
    <section id="corridors" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-smoke-800 bg-jet-900/50">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading: Benefit first, no eyebrow */}
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Global transit lane disruption telemetry
          </h2>
          <p className="mt-3 text-sm sm:text-base text-smoke-400 leading-relaxed">
            Historical variance patterns cross-referenced by shipping mode, regional port infrastructure, and seasonal clearance bottlenecks.
          </p>
        </div>

        {/* Interactive 4-Column Lane Selector (Non-AI, crisp segmented layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CORRIDORS.map((corridor) => {
            const Icon = corridor.icon;
            const isActive = corridor.id === activeCorridorId;
            return (
              <button
                key={corridor.id}
                type="button"
                onClick={() => setActiveCorridorId(corridor.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-150 ${
                  isActive
                    ? 'bg-jet-850 border-smoke-600 shadow-panel-raised'
                    : 'bg-jet-900/70 border-smoke-800 hover:border-smoke-700 hover:bg-jet-850/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? 'bg-smoke-800 text-white' : 'bg-smoke-900 text-smoke-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs tabular-nums text-smoke-400">
                    {corridor.delayRate}% late
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-smoke-100">{corridor.name}</h3>
                <p className="text-xs text-smoke-400 mt-1 truncate">
                  {corridor.origin} &rarr; {corridor.destination}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Corridor Detailed Inspection Stage */}
        <div className="panel-jet-elevated p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Column 1: Corridor Parameters */}
            <div className="space-y-5">
              <div>
                <span className="text-xs text-smoke-400 block">Selected transit route</span>
                <h3 className="text-xl font-bold text-white mt-1">{selected.name}</h3>
                <p className="text-xs text-smoke-300 font-mono mt-1">
                  {selected.origin} &rarr; {selected.destination}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-smoke-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-smoke-400">Scheduled transit window:</span>
                  <span className="font-mono text-smoke-200 tabular-nums font-medium">
                    {selected.scheduledDays} days
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-smoke-400">Actual real-world duration:</span>
                  <span className="font-mono text-smoke-200 tabular-nums font-medium">
                    {selected.actualAvgDays} days average
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-smoke-400">Mode specification:</span>
                  <span className="text-smoke-300">{selected.mode}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-smoke-400">Tracked volume:</span>
                  <span className="font-mono text-smoke-300 tabular-nums">
                    {selected.activeShipments}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Risk Profile */}
            <div className="space-y-5 lg:border-l lg:border-r lg:border-smoke-800 lg:px-8">
              <div>
                <span className="text-xs text-smoke-400 block">Primary bottleneck catalyst</span>
                <p className="text-sm text-smoke-200 font-medium mt-2 leading-relaxed flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-cherry-400 flex-shrink-0 mt-0.5" />
                  <span>{selected.primaryRisk}</span>
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-smoke-400">Historical delay risk rate:</span>
                  <span className="font-mono font-bold text-cherry-400 tabular-nums">
                    {selected.delayRate}%
                  </span>
                </div>
                <div className="w-full bg-smoke-900 h-2 rounded-full overflow-hidden border border-smoke-800">
                  <div
                    className="bg-cherry-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${selected.delayRate}%` }}
                  />
                </div>
                <p className="text-[11px] text-smoke-400 leading-normal">
                  Orders dispatched under this lane carry an elevated probability of exceeding scheduled customer delivery promises.
                </p>
              </div>
            </div>

            {/* Column 3: Recommended Action */}
            <div className="space-y-5 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs text-smoke-400 block">System mitigation protocol</span>
                <h4 className="text-sm font-semibold text-white mt-1">
                  Automated Buffer Reconciliation
                </h4>
                <p className="text-xs text-smoke-400 mt-2 leading-relaxed">
                  DelaySense re-weights the delivery commitment date upon order intake, preventing downstream carrier penalty chargebacks and inventory stockouts.
                </p>
              </div>

              <div className="pt-4 border-t border-smoke-800">
                <a
                  href="#workbench"
                  className="btn-cherry w-full"
                >
                  <span>Test route in simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
