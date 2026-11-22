'use client';

import React from 'react';
import { Anchor, Plane, Ship, Truck, Package, Shield, Globe } from 'lucide-react';

interface Partner {
  name: string;
  category: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PARTNERS: Partner[] = [
  {
    name: 'Maersk Line',
    category: 'Ocean & Intermodal',
    code: 'MSK',
    icon: Ship,
  },
  {
    name: 'DHL Global Forwarding',
    category: 'Air & Ocean Freight',
    code: 'DHL',
    icon: Plane,
  },
  {
    name: 'FedEx Supply Chain',
    category: 'Express & Parcel',
    code: 'FDX',
    icon: Truck,
  },
  {
    name: 'Flexport Freight',
    category: 'Digital Forwarding',
    code: 'FLX',
    icon: Globe,
  },
  {
    name: 'DB Schenker',
    category: 'European Road & Rail',
    code: 'DBS',
    icon: Package,
  },
  {
    name: 'Hapag-Lloyd',
    category: 'Global Container Shipping',
    code: 'HLAG',
    icon: Anchor,
  },
  {
    name: 'DSV Panalpina',
    category: 'Contract Logistics',
    code: 'DSV',
    icon: Shield,
  },
];

export const PartnerLogos: React.FC = () => {
  return (
    <section className="relative py-12 px-4 sm:px-6 bg-obsidian-950 border-y border-white/5 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-950/20 via-transparent to-transparent opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Caption */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-medium">
              Ecosystem Connectivity & Carrier Integrations
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Real-time EDI & API Webhooks
          </span>
        </div>

        {/* Logo Grid / Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {PARTNERS.map((partner) => {
            const Icon = partner.icon;
            return (
              <div
                key={partner.name}
                className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-obsidian-900/60 border border-white/5 hover:border-emerald-500/40 hover:bg-obsidian-850/80 transition-all duration-300 shadow-sm hover:shadow-glow-emerald"
              >
                {/* Carrier Icon & Code */}
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="w-7 h-7 rounded-lg bg-obsidian-800 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-zinc-200 tracking-wider">
                    {partner.code}
                  </span>
                </div>

                {/* Carrier Name */}
                <div className="w-full text-left">
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                    {partner.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {partner.category}
                  </p>
                </div>

                {/* Subtle bottom active accent on hover */}
                <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent group-hover:via-emerald-400/60 transition-all duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
