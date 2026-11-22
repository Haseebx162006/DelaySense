'use client';

import React from 'react';
import { ArrowUpRight, ArrowDown, MapPin } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="overview"
      className="relative w-full bg-[#07110e] rounded-b-[2.5rem] sm:rounded-b-[3.5rem] lg:rounded-b-[4.5rem] border-b border-white/[0.08] overflow-hidden flex flex-col justify-between min-h-[84vh] sm:min-h-[88vh]"
    >
      {/* 3D Tactile Emerald Sculptural Ribs / Fins Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Ambient Dark Emerald Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-[#0d3f31]/60 via-[#06241b]/40 to-transparent rounded-full blur-[120px]" />

        {/* SVG Sculptural 3D Organic Ribbed Curves (Tactile geometry replicating Valyent) */}
        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[850px] max-w-none opacity-85"
          viewBox="0 0 1400 850"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="finGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#082319" />
              <stop offset="35%" stopColor="#14523f" />
              <stop offset="65%" stopColor="#0a3327" />
              <stop offset="100%" stopColor="#04140f" />
            </linearGradient>

            <linearGradient id="finGrad2" x1="0%" y1="10%" x2="100%" y2="90%">
              <stop offset="0%" stopColor="#0a2e22" />
              <stop offset="40%" stopColor="#1a634e" />
              <stop offset="70%" stopColor="#0c382b" />
              <stop offset="100%" stopColor="#03120d" />
            </linearGradient>

            <linearGradient id="finGrad3" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#0e3a2c" />
              <stop offset="50%" stopColor="#227b61" />
              <stop offset="85%" stopColor="#0e3a2c" />
              <stop offset="100%" stopColor="#051711" />
            </linearGradient>

            <linearGradient id="specularEdge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </linearGradient>

            <filter id="ribShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#010705" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Layered Sculptural Fins */}
          <g filter="url(#ribShadow)">
            {/* Far Left Rib */}
            <path
              d="M 120 -80 C 180 120, 240 340, 220 520 C 200 660, 140 760, 80 820 C 40 780, 70 580, 110 420 C 140 260, 100 80, 60 -80 Z"
              fill="url(#finGrad1)"
            />
            <path
              d="M 120 -80 C 180 120, 240 340, 220 520 C 200 660, 140 760, 80 820"
              stroke="url(#specularEdge)"
              strokeWidth="1.5"
              opacity="0.4"
            />

            {/* Left Rib 2 */}
            <path
              d="M 310 -100 C 370 140, 420 380, 380 560 C 350 700, 290 800, 220 860 C 190 820, 230 630, 280 470 C 320 290, 290 90, 250 -100 Z"
              fill="url(#finGrad2)"
            />
            <path
              d="M 310 -100 C 370 140, 420 380, 380 560 C 350 700, 290 800, 220 860"
              stroke="url(#specularEdge)"
              strokeWidth="2"
              opacity="0.5"
            />

            {/* Central-Left Arch Rib */}
            <path
              d="M 520 -120 C 580 160, 610 390, 560 570 C 520 710, 450 810, 380 870 C 350 830, 400 640, 450 490 C 490 310, 480 100, 450 -120 Z"
              fill="url(#finGrad3)"
            />
            <path
              d="M 520 -120 C 580 160, 610 390, 560 570 C 520 710, 450 810, 380 870"
              stroke="url(#specularEdge)"
              strokeWidth="2.5"
              opacity="0.7"
            />

            {/* Central-Right Arch Rib */}
            <path
              d="M 880 -120 C 820 160, 790 390, 840 570 C 880 710, 950 810, 1020 870 C 1050 830, 1000 640, 950 490 C 910 310, 920 100, 950 -120 Z"
              fill="url(#finGrad3)"
            />
            <path
              d="M 880 -120 C 820 160, 790 390, 840 570 C 880 710, 950 810, 1020 870"
              stroke="url(#specularEdge)"
              strokeWidth="2.5"
              opacity="0.7"
            />

            {/* Right Rib 2 */}
            <path
              d="M 1090 -100 C 1030 140, 980 380, 1020 560 C 1050 700, 1110 800, 1180 860 C 1210 820, 1170 630, 1120 470 C 1080 290, 1110 90, 1150 -100 Z"
              fill="url(#finGrad2)"
            />
            <path
              d="M 1090 -100 C 1030 140, 980 380, 1020 560 C 1050 700, 1110 800, 1180 860"
              stroke="url(#specularEdge)"
              strokeWidth="2"
              opacity="0.5"
            />

            {/* Far Right Rib */}
            <path
              d="M 1280 -80 C 1220 120, 1160 340, 1180 520 C 1200 660, 1260 760, 1320 820 C 1360 780, 1330 580, 1290 420 C 1260 260, 1300 80, 1340 -80 Z"
              fill="url(#finGrad1)"
            />
            <path
              d="M 1280 -80 C 1220 120, 1160 340, 1180 520 C 1200 660, 1260 760, 1320 820"
              stroke="url(#specularEdge)"
              strokeWidth="1.5"
              opacity="0.4"
            />
          </g>

          {/* Depth Vignette at Base */}
          <rect y="480" width="1400" height="370" fill="url(#bottomFade)" />
          <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#07110e" stopOpacity="0" />
            <stop offset="70%" stopColor="#07110e" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#07110e" stopOpacity="1" />
          </linearGradient>
        </svg>

        {/* Soft Radial Contrast Behind Text */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#07110e]/40 to-[#07110e]" />
      </div>

      {/* Top Navbar Clearance (Responsive: 6.5rem on mobile, 8.5rem on desktop) */}
      <div className="pt-24 sm:pt-32 md:pt-36" />

      {/* Hero Centerpiece Typography (Valyent Style: Confident, Pure, Crisp) */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-4 sm:px-6 my-auto">
        {/* Main Brand Title: Clean solid white display heading */}
        <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-[-0.035em] text-white font-sans uppercase select-none leading-none drop-shadow-sm flex items-start justify-center max-w-full">
          <span className="truncate">DELAYSENSE</span>
          <span className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-light text-zinc-400 ml-1 sm:ml-2 tracking-normal normal-case">
            ™
          </span>
        </h1>

        {/* Human Editorial Tagline */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-zinc-300 font-normal tracking-[-0.01em] max-w-xs sm:max-w-xl leading-relaxed">
          Driving clarity through predictive logistics strategy
        </p>

        {/* Understated Action Controls */}
        <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto px-4 sm:px-0">
          <button
            type="button"
            onClick={() => scrollTo('#workbench')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs sm:text-sm tracking-tight hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            <span>Launch Workbench</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollTo('#solutions')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium text-xs sm:text-sm hover:text-white hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
          >
            <span>Solutions Overview</span>
            <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Bottom Architectural Bar (Cleanly formatted & 100% mobile responsive) */}
      <div className="relative z-10 mt-auto border-t border-white/[0.08] bg-black/35 backdrop-blur-md px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Bottom Left: Customer Proof */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex -space-x-2 shrink-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#154636] border-2 border-[#07110e] flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-emerald-200 font-mono">
              MK
            </div>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#20362f] border-2 border-[#07110e] flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-zinc-300 font-mono">
              FX
            </div>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#102d23] border-2 border-[#07110e] flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-emerald-300 font-mono">
              DH
            </div>
          </div>
          <span className="text-zinc-400 font-medium text-[11px] sm:text-xs">
            Trusted by 120+ global enterprise freight leaders
          </span>
        </div>

        {/* Bottom Center: Minimalist Network Status (Hidden on very small screens, visible on md+) */}
        <div className="hidden md:flex items-center gap-2 text-zinc-400 text-[11px] font-mono">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>Global Operations Network • 42 Hubs Active</span>
        </div>

        {/* Bottom Right: Version Stamp */}
        <div className="text-zinc-500 font-mono text-[10px] sm:text-[11px] tracking-wide">
          Autonomous Delay Engine • v0.1.0
        </div>
      </div>
    </section>
  );
};
