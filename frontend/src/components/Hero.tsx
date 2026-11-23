'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const scrollTo = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 bg-jet-950 border-b border-smoke-800 overflow-hidden select-none"
    >
      {/* 1. Giant Background Typographic Watermark (Studio Depth Layering) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden opacity-[0.035]">
        <span className="text-[17vw] font-black tracking-[-0.05em] uppercase text-white whitespace-nowrap select-none font-sans leading-none">
          DELAYSENSE
        </span>
      </div>

      {/* Subtle Studio Lighting Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-smoke-900/10 via-jet-950/85 to-jet-950 pointer-events-none z-0" />

      {/* 2. Main Studio Showcase Stage: Left Content | Right-Center Floating 3D Parcel */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Direct Editorial Headline & Action Controls */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-7 text-left">
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[-0.03em] text-white leading-[0.98]">
              DelaySense
              <span className="block text-smoke-200 font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mt-2 tracking-tight">
                Parcel Engine
              </span>
            </h1>
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-smoke-300 font-normal leading-relaxed max-w-xl">
            Predictive transit intelligence calibrated across multi-modal freight corridors to calculate shipment disruption risk and protect delivery SLAs.
          </p>

          {/* Action Trigger & Cherry Red Accent Indicator */}
          <div className="space-y-5 pt-1">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => scrollTo('#workbench')}
                className="btn-cherry !text-sm sm:!text-base px-7 py-3.5 font-semibold"
              >
                <span>Analyze manifest</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('#corridors')}
                className="btn-secondary !text-sm sm:!text-base px-6 py-3.5 font-medium"
              >
                <span>View corridors</span>
              </button>
            </div>

            {/* Signature Cherry Red Accent Indicator Bar */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-16 sm:w-20 h-1.5 bg-cherry-600 rounded-full" />
              <div className="w-4 h-1.5 bg-smoke-800 rounded-full" />
              <span className="text-xs font-mono uppercase tracking-wider text-smoke-400 pl-1">
                Active Telemetry · &lt; 25ms inference
              </span>
            </div>
          </div>
        </div>

        {/* Right-Center Stage: 100% Transparent Floating 3D Parcel & Cherry Halo Ring (NO BOX, NO RIGHT CARD) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center my-4 lg:my-0">
          <div
            className="relative flex items-center justify-center group cursor-pointer w-full max-w-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => scrollTo('#workbench')}
          >
            {/* Signature Cherry Red Halo Ring (Offset behind top-right of parcel) */}
            <div
              className={`absolute -top-6 sm:-top-10 right-4 sm:right-10 md:right-14 w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full border-[7px] border-cherry-600/90 shadow-[0_0_40px_rgba(225,29,72,0.35)] transition-all duration-300 pointer-events-none z-0 ${
                isHovered
                  ? 'scale-105 border-cherry-500 shadow-[0_0_55px_rgba(225,29,72,0.5)]'
                  : ''
              }`}
            />

            {/* Free-Floating 3D Parcel (100% Transparent Background, NO BOX FRAME, NO BORDER) */}
            <div
              className={`relative z-10 w-full max-w-[430px] sm:max-w-[490px] md:max-w-[550px] aspect-[859/588] transition-all duration-300 ease-out ${
                isHovered
                  ? '-translate-y-3 scale-[1.03] filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)]'
                  : 'filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]'
              }`}
            >
              <Image
                src="/images/parcel-transparent.png"
                alt="DelaySense calibrated cargo parcel with cherry red security seal"
                fill
                priority
                sizes="(max-width: 768px) 380px, 550px"
                className="object-contain pointer-events-none select-none"
              />
            </div>

            {/* Soft Elliptical Floor Contact Shadow Beneath Parcel */}
            <div
              className={`absolute -bottom-8 w-64 sm:w-80 md:w-96 h-8 bg-black/90 rounded-full blur-xl pointer-events-none transition-all duration-300 ${
                isHovered ? 'scale-90 opacity-70' : 'scale-100 opacity-95'
              }`}
            />
          </div>

          <span className="text-[11px] font-mono text-smoke-500 mt-6 block tracking-wide">
            Model DS-1 · Tamper-evident transit monitoring
          </span>
        </div>
      </div>

      {/* 3. Bottom Minimal Horizon Strip */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-6 border-t border-smoke-850 flex flex-wrap items-center justify-between gap-4 text-xs text-smoke-500">
        <div className="flex items-center gap-5">
          <span className="font-mono text-smoke-400">
            LightGBM · XGBoost · CatBoost · Stacking Meta-Learner
          </span>
        </div>

        <button
          type="button"
          onClick={() => scrollTo('#corridors')}
          className="text-smoke-400 hover:text-white flex items-center gap-1.5 transition-colors duration-150"
        >
          <span>Explore global corridor telemetry</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
