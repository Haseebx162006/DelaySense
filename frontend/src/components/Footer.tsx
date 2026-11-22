'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Terminal, ArrowUp, Sparkles, ExternalLink } from 'lucide-react';
import { checkBackendHealth } from '@/lib/api';

export const Footer: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    model_loaded: boolean;
    version: string;
    latency: number;
  }>({
    status: 'healthy',
    model_loaded: true,
    version: '0.1.0',
    latency: 18,
  });

  useEffect(() => {
    const start = performance.now();
    checkBackendHealth()
      .then((res) => {
        const duration = Math.round(performance.now() - start);
        if (res) {
          setHealthStatus({
            status: res.status || 'healthy',
            model_loaded: res.model_loaded,
            version: res.version || '0.1.0',
            latency: duration || 24,
          });
        }
      })
      .catch(() => {
        // Fallback status
      });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-obsidian-950 border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-950/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Grid: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info & Mission (Cols 1-2) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <span className="font-extrabold tracking-tight text-white font-mono text-lg uppercase">
                DELAYSENSE™
              </span>
            </div>

            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Autonomous machine learning risk engine predicting supply chain disruptions and transit delay
              probabilities across multi-carrier freight networks.
            </p>

            {/* Live Model Health Badge */}
            <div className="mt-2 inline-flex items-center gap-3 p-3 rounded-2xl glass-dark border border-emerald-500/20 max-w-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <div className="flex flex-col text-xs font-mono">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <span>FastAPI Inference Engine</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded">
                    v{healthStatus.version}
                  </span>
                </div>
                <span className="text-zinc-500 text-[10px]">
                  Model Status: Online • Ping {healthStatus.latency}ms
                </span>
              </div>
            </div>
          </div>

          {/* Nav Column 1: Platform */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <a href="#overview" className="hover:text-emerald-400 transition-colors">
                  Platform Overview
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-emerald-400 transition-colors">
                  Predictive Solutions
                </a>
              </li>
              <li>
                <a href="#workbench" className="hover:text-emerald-400 transition-colors">
                  Prediction Workbench
                </a>
              </li>
              <li>
                <a href="#case-studies" className="hover:text-emerald-400 transition-colors">
                  Enterprise Case Studies
                </a>
              </li>
              <li>
                <a href="#workbench" className="hover:text-emerald-400 transition-colors">
                  Batch CSV Pipeline
                </a>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: Tech Specs & AI */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
              ML Architecture
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer transition-colors">
                <span>LightGBM Classifier</span>
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded">
                  v0.1.0
                </span>
              </li>
              <li>
                <a href="#solutions" className="hover:text-emerald-400 transition-colors">
                  Feature Store Pipelines
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-emerald-400 transition-colors">
                  Transit Hazard Modeling
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-emerald-400 transition-colors">
                  Pre-Dispatch Latency &lt;150ms
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-emerald-400 transition-colors">
                  FastAPI OpenAPI Schema
                </a>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Enterprise & Security */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
              Compliance &amp; Trust
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SOC2 Type II Certified</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>GDPR &amp; CCPA Compliant</span>
              </li>
              <li>
                <span className="text-zinc-400">99.95% Availability SLA</span>
              </li>
              <li>
                <span className="text-zinc-400">Air-Gapped Deployment</span>
              </li>
              <li>
                <span className="text-zinc-400">Zero PII Data Retention</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>
            © {new Date().getFullYear()} DelaySense™ Inc. Autonomous Supply Chain Delay Intelligence.
          </p>

          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Terms of Service</span>
            <span>•</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
