'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-jet-950 border-t border-smoke-800 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-smoke-850">
          <div className="md:col-span-2 space-y-3">
            <span className="font-extrabold text-base tracking-tight text-white block">
              DelaySense
            </span>
            <p className="text-xs text-smoke-400 max-w-sm leading-relaxed">
              Machine learning calibrated on multi-modal freight corridors to predict shipment disruption probabilities and protect delivery SLAs across global supply chains.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-smoke-400">
              <span className="w-2 h-2 rounded-full bg-smoke-400" />
              <span>FastAPI backend · v1.0.0</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-smoke-300">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-smoke-400">
              <li>
                <a href="#corridors" className="hover:text-white transition-colors">
                  Freight corridors
                </a>
              </li>
              <li>
                <a href="#workbench" className="hover:text-white transition-colors">
                  Prediction workbench
                </a>
              </li>
              <li>
                <a href="#economics" className="hover:text-white transition-colors">
                  Penalty economics
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">
                  Model architecture
                </a>
              </li>
              <li>
                <a href="#case-studies" className="hover:text-white transition-colors">
                  Case benchmarks
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-smoke-300">
              Engineering
            </h4>
            <ul className="space-y-2 text-xs text-smoke-400">
              <li>
                <span className="text-smoke-300">LightGBM · XGBoost · CatBoost</span>
              </li>
              <li>
                <span className="text-smoke-400">Stacking meta-learner</span>
              </li>
              <li>
                <span className="text-smoke-400">Docker container runtime</span>
              </li>
              <li>
                <span className="text-smoke-400">OpenAPI / Swagger spec</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-smoke-500">
          <p>© {new Date().getFullYear()} DelaySense. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-smoke-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
