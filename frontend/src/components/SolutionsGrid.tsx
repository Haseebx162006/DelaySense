'use client';

import React, { useState } from 'react';
import {
  Clock,
  ShieldAlert,
  Compass,
  Zap,
  Radio,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const SolutionsGrid: React.FC = () => {
  const [capsuleHovered, setCapsuleHovered] = useState(false);

  return (
    <section id="solutions" className="relative py-28 px-4 sm:px-6 bg-obsidian-950 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-700/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Predictive Intelligence</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight font-sans">
            SUPPLY CHAIN <span className="text-gradient-emerald">SOLUTIONS</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
            Deploy autonomous machine learning models that preemptively forecast delivery bottlenecks,
            carrier anomalies, and systemic supply chain vulnerabilities.
          </p>
        </div>

        {/* 4-Quadrant Solutions Layout with Central 3D Dark-Emerald Capsule */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column (Quadrants 1 & 3) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Card 1: Real-Time Delay Forecasting */}
            <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  01 / FORECAST
                </span>
                <div className="w-9 h-9 rounded-xl bg-obsidian-850 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-emerald-300 transition-colors">
                Real-Time Delay Forecasting
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed mb-5">
                Continuous ML inference estimating transit delay probabilities prior to carrier dispatch.
                Calculates probability distributions against scheduled delivery windows.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-zinc-400">
                <span className="px-2.5 py-1 rounded-full bg-obsidian-900 border border-white/5">
                  &lt;150ms Latency
                </span>
                <span className="px-2.5 py-1 rounded-full bg-obsidian-900 border border-white/5">
                  Multi-Carrier Telemetry
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Pre-Dispatch Scoring
                </span>
              </div>
            </div>

            {/* Card 3: Route & Carrier Advisory */}
            <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  03 / ADVISORY
                </span>
                <div className="w-9 h-9 rounded-xl bg-obsidian-850 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Compass className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-emerald-300 transition-colors">
                Route &amp; Carrier Advisory
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed mb-5">
                Proactive dynamic rerouting recommendations factoring in historical choke points, port
                congestion, severe weather patterns, and regional customs bottlenecks.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-zinc-400">
                <span className="px-2.5 py-1 rounded-full bg-obsidian-900 border border-white/5">
                  Geospatial Vectors
                </span>
                <span className="px-2.5 py-1 rounded-full bg-obsidian-900 border border-white/5">
                  Port Congestion Sync
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Dynamic Reroute
                </span>
              </div>
            </div>
          </div>

          {/* Center Column: Centerpiece 3D Dark-Emerald Glowing Capsule */}
          <div className="lg:col-span-4 flex justify-center py-4">
            <div
              onMouseEnter={() => setCapsuleHovered(true)}
              onMouseLeave={() => setCapsuleHovered(false)}
              className="relative w-full max-w-[320px] h-[540px] rounded-[52px] bg-gradient-to-b from-emerald-950/70 via-obsidian-900/90 to-obsidian-950 p-[1px] shadow-glow-capsule transition-all duration-500 group cursor-default"
            >
              {/* Outer Glowing Border Ring */}
              <div
                className={`absolute inset-0 rounded-[52px] bg-gradient-to-b from-emerald-400/40 via-emerald-600/20 to-transparent transition-opacity duration-500 pointer-events-none ${
                  capsuleHovered ? 'opacity-100' : 'opacity-60'
                }`}
              />

              {/* Inner Capsule Chamber */}
              <div className="relative w-full h-full rounded-[51px] bg-obsidian-900/95 backdrop-blur-2xl p-6 flex flex-col items-center justify-between overflow-hidden border border-emerald-500/20">
                {/* Internal Ambient Radial Lights */}
                <div className="absolute top-1/4 w-40 h-40 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none" />
                <div className="absolute bottom-1/4 w-32 h-32 bg-emerald-400/15 rounded-full blur-[30px] pointer-events-none" />

                {/* Top Readout Header */}
                <div className="w-full flex items-center justify-between text-xs font-mono border-b border-emerald-500/20 pb-4 z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-zinc-200 font-bold uppercase tracking-wider text-[11px]">
                      CORE v1.0
                    </span>
                  </div>
                  <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ONLINE
                  </span>
                </div>

                {/* Center Animated 3D Sensor Core Visual */}
                <div className="relative flex items-center justify-center my-auto py-6">
                  {/* Outer Concentric Radar Rings */}
                  <div className="w-48 h-48 rounded-full border border-emerald-500/20 flex items-center justify-center animate-pulse-subtle">
                    <div className="w-36 h-36 rounded-full border border-emerald-400/30 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border border-emerald-300/40 flex items-center justify-center bg-emerald-950/40">
                        {/* Core Glowing Orb */}
                        <div
                          className={`w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-glow-emerald-lg flex items-center justify-center transition-transform duration-500 ${
                            capsuleHovered ? 'scale-110' : 'scale-100'
                          }`}
                        >
                          <Cpu className="w-7 h-7 text-white animate-spin" style={{ animationDuration: '12s' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rotating Sweeping Radar Ray */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 rounded-full border border-transparent border-t-emerald-400/60 animate-radar" />
                  </div>
                </div>

                {/* Bottom Sensor Telemetry Console */}
                <div className="w-full space-y-2.5 z-10 bg-obsidian-950/70 p-3.5 rounded-2xl border border-emerald-500/15">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">TELEMETRY UPTIME</span>
                    <span className="text-emerald-400 font-semibold">99.85%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">CARRIER SYNC</span>
                    <span className="text-white font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> OK (7/7)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">INFERENCE ENGINE</span>
                    <span className="text-zinc-200">LightGBM-Opt</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-obsidian-850 h-1.5 rounded-full overflow-hidden mt-1 border border-white/5">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full w-[88%] rounded-full shadow-glow-emerald" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Quadrants 2 & 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Card 2: Multimodal Risk Scoring */}
            <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  02 / RISK MATRIX
                </span>
                <div className="w-9 h-9 rounded-xl bg-obsidian-850 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-emerald-300 transition-colors">
                Multimodal Risk Scoring
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed mb-5">
                Automatically partition high-velocity shipments into Low, Medium, and High delay risk tiers.
                Provides operational trigger flags for immediate triage.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-zinc-400">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Low Risk Tier
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Medium Caution
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  High Alert Tier
                </span>
              </div>
            </div>

            {/* Card 4: High-Throughput Batch Processing */}
            <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  04 / PIPELINE
                </span>
                <div className="w-9 h-9 rounded-xl bg-obsidian-850 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-emerald-300 transition-colors">
                High-Throughput Batch Processing
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed mb-5">
                Process 10,000+ orders concurrently via streaming CSV ingestion pipeline.
                Returns structured risk metrics and downloadable manifests with sub-second turnaround.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-zinc-400">
                <span className="px-2.5 py-1 rounded-full bg-obsidian-900 border border-white/5">
                  10,000+ Concurrency
                </span>
                <span className="px-2.5 py-1 rounded-full bg-obsidian-900 border border-white/5">
                  Multipart Streaming
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CSV One-Click Export
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
