'use client';

import React from 'react';
import {
  TrendingDown,
  DollarSign,
  CheckCircle,
  ShieldCheck,
  ArrowUpRight,
  ShoppingBag,
  Cpu,
  Car,
  ThermometerSnowflake,
} from 'lucide-react';

interface CaseStudy {
  id: string;
  tag: string;
  industry: string;
  title: string;
  metric: string;
  metricLabel: string;
  subMetric: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'retail',
    tag: 'RETAIL & E-COMMERCE',
    industry: 'Omnichannel Logistics',
    title: 'Global Omnichannel Retailer',
    metric: '34.2%',
    metricLabel: 'Reduction in delay penalties',
    subMetric: '1.2M+ Annual Shipments',
    description:
      'Standardized predictive delivery alerts across 14 continental fulfillment centers, proactively rerouting shipments 36 hours prior to carrier terminal congestion.',
    icon: ShoppingBag,
    accentColor: 'from-emerald-500/20 to-emerald-950/40',
  },
  {
    id: 'electronics',
    tag: 'SEMICONDUCTOR & HARDWARE',
    industry: 'High-Tech Air Freight',
    title: 'High-Tech Electronics Freight',
    metric: '$2.4M',
    metricLabel: 'Saved in SLA breach penalties',
    subMetric: 'Transpacific Air Corridor',
    description:
      'Eliminated critical factory downtime for Tier-1 chipmakers through sub-hour customs clearance delay predictions and automated flight reschedule advisory.',
    icon: Cpu,
    accentColor: 'from-teal-500/20 to-obsidian-950',
  },
  {
    id: 'automotive',
    tag: 'AUTOMOTIVE MANUFACTURING',
    industry: 'Cross-Border Supply Chain',
    title: 'Cross-Border Automotive Logistics',
    metric: '99.1%',
    metricLabel: 'JIT delivery adherence rate',
    subMetric: '42 Assembly Plants',
    description:
      'Eliminated costly inventory buffer warehousing along North American automotive supply corridors with continuous multi-modal ETA reconciliation.',
    icon: Car,
    accentColor: 'from-emerald-600/20 to-obsidian-950',
  },
  {
    id: 'pharma',
    tag: 'BIOPHARMA & HEALTHCARE',
    industry: 'Cold-Chain Distribution',
    title: 'Cold-Chain Pharmaceutical Transport',
    metric: '0',
    metricLabel: 'Integrity or timeline breaches',
    subMetric: '100% Vaccine Potency Retained',
    description:
      'Preempted transit temperature excursions and customs port holds for life-saving therapeutics using multi-variate environmental and transit duration forecasting.',
    icon: ThermometerSnowflake,
    accentColor: 'from-emerald-400/20 to-obsidian-950',
  },
];

export const CaseStudies: React.FC = () => {
  return (
    <section id="case-studies" className="relative py-28 px-4 sm:px-6 bg-obsidian-950 border-t border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-emerald-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-emerald-700/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Proven Business Impact</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight font-sans">
              ENTERPRISE <span className="text-gradient-emerald">CASE STUDIES</span>
            </h2>
            <p className="mt-3 text-base text-zinc-300">
              Demonstrated operational cost reduction and SLA preservation across the world’s most demanding supply networks.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Audited Production Case Data (2024–2026)</span>
          </div>
        </div>

        {/* 4 Cards Grid mirroring bottom section of reference screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CASE_STUDIES.map((study) => {
            const Icon = study.icon;
            return (
              <div
                key={study.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-obsidian-900/80 border border-white/10 hover:border-emerald-500/40 p-6 transition-all duration-300 hover:shadow-glow-card-hover backdrop-blur-xl overflow-hidden"
              >
                {/* Background subtle gradient bloom */}
                <div
                  className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${study.accentColor} blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none`}
                />

                {/* Card Top: Tag & Icon */}
                <div className="relative z-10 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono tracking-widest font-semibold text-emerald-400/90 uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {study.tag}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-obsidian-800 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-200 transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{study.industry}</p>
                </div>

                {/* Card Middle: Primary Hero Metric */}
                <div className="relative z-10 my-4 py-4 border-y border-white/5">
                  <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    {study.metric}
                  </div>
                  <p className="text-xs font-semibold text-zinc-200 mt-1">
                    {study.metricLabel}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-400/80 mt-0.5">
                    {study.subMetric}
                  </p>
                </div>

                {/* Card Bottom: Description & Interactive Action */}
                <div className="relative z-10 flex flex-col justify-between mt-2">
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    {study.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-medium text-zinc-400 group-hover:text-emerald-300 transition-colors">
                    <span className="text-[11px] font-mono">Verified Production Outcome</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Bottom glowing accent bar on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent group-hover:via-emerald-400/80 transition-all duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
