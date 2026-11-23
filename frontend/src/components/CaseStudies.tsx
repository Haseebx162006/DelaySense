'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface CaseStudy {
  id: string;
  image: string;
  imageAlt: string;
  industry: string;
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'air-freight',
    image: '/images/air-cargo.jpg',
    imageAlt: 'Cargo freighter aircraft on tarmac at dusk',
    industry: 'Semiconductor & High-Tech Air Freight',
    title: 'Transpacific Air Corridor SLA Defense',
    metric: '$2.4M',
    metricLabel: 'Prevented in SLA breach chargebacks',
    description:
      'Eliminated critical factory downtime for Tier-1 chipmakers through sub-hour customs electronic declaration holds and automated flight rescheduling.',
  },
  {
    id: 'intermodal',
    image: '/images/intermodal-rail.jpg',
    imageAlt: 'Freight train hauling double-stacked shipping containers',
    industry: 'Automotive & Heavy Manufacturing',
    title: 'North American Intermodal JIT Adherence',
    metric: '99.1%',
    metricLabel: 'Just-in-time delivery adherence rate',
    description:
      'Eliminated costly buffer warehousing along continental automotive supply corridors with continuous multi-modal ETA reconciliation and rail yard switching alerts.',
  },
  {
    id: 'retail',
    image: '/images/hero-freight.jpg',
    imageAlt: 'Container ship freight terminal illuminated at night',
    industry: 'Omnichannel Retail Distribution',
    title: 'Continental Maritime Port Congestion Preemption',
    metric: '34.2%',
    metricLabel: 'Reduction in customer delay penalties',
    description:
      'Standardized predictive delivery alerts across 14 regional distribution hubs, proactively rerouting shipments 36 hours prior to carrier terminal congestion.',
  },
];

export const CaseStudies: React.FC = () => {
  return (
    <section id="case-studies" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-smoke-800 bg-jet-950">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading: Benefit first, no eyebrow */}
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Operational outcomes across global supply chains
          </h2>
          <p className="mt-3 text-sm sm:text-base text-smoke-400 leading-relaxed">
            Real enterprise case benchmarks measuring SLA penalty avoidance and predictive route intervention.
          </p>
        </div>

        {/* 3-Column Editorial Photography Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="panel-jet overflow-hidden flex flex-col justify-between group hover:border-smoke-700 transition-colors duration-150"
            >
              {/* Image Container with 16:9 Aspect Ratio */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-smoke-900 border-b border-smoke-800">
                <Image
                  src={study.image}
                  alt={study.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jet-900/80 via-transparent to-transparent" />
              </div>

              {/* Text & Metrics Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <span className="text-[11px] text-smoke-400 font-mono block">
                    {study.industry}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {study.title}
                  </h3>
                  <p className="text-xs text-smoke-400 leading-relaxed pt-1">
                    {study.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-smoke-800/80 space-y-1">
                  <span className="text-3xl font-bold font-mono text-white tabular-nums block">
                    {study.metric}
                  </span>
                  <span className="text-xs text-smoke-300 block font-medium">
                    {study.metricLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
