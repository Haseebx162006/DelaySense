'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none ${
        isScrolled
          ? 'bg-[#07110e]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between pointer-events-auto">
        {/* Brand Link (Minimalist, solid, crisp) */}
        <a
          href="#overview"
          onClick={(e) => scrollToSection(e, '#overview')}
          className="group flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 select-none"
        >
          <span className="font-extrabold tracking-tight text-white font-sans text-xs sm:text-sm uppercase">
            DELAYSENSE
          </span>
          <span className="text-[10px] text-zinc-400 font-sans tracking-normal font-normal">
            ™
          </span>
        </a>

        {/* Central Floating Navigation Links (Valyent style pill menu - Desktop) */}
        <nav className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <a
            href="#overview"
            onClick={(e) => scrollToSection(e, '#overview')}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white rounded-full hover:bg-white/5 transition-all duration-200"
          >
            Overview
          </a>
          <a
            href="#solutions"
            onClick={(e) => scrollToSection(e, '#solutions')}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white rounded-full hover:bg-white/5 transition-all duration-200"
          >
            Solutions
          </a>
          <a
            href="#workbench"
            onClick={(e) => scrollToSection(e, '#workbench')}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white rounded-full hover:bg-white/5 transition-all duration-200"
          >
            Workbench
          </a>
          <a
            href="#case-studies"
            onClick={(e) => scrollToSection(e, '#case-studies')}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white rounded-full hover:bg-white/5 transition-all duration-200"
          >
            Case Studies
          </a>
        </nav>

        {/* Right Action Button (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#workbench"
            onClick={(e) => scrollToSection(e, '#workbench')}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-white text-zinc-950 text-xs font-semibold tracking-tight hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 shadow-md"
          >
            <span>Launch Workbench</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Header Controls (Phone & Small Tablet) */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="#workbench"
            onClick={(e) => scrollToSection(e, '#workbench')}
            className="px-3 py-1.5 rounded-full bg-white text-zinc-950 text-xs font-semibold tracking-tight shadow-sm active:scale-95"
          >
            Workbench
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full bg-black/50 border border-white/10 text-white active:scale-95 transition-transform"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Full responsiveness with zero overflow) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-3 p-3 rounded-2xl bg-[#07110e]/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col space-y-1 pointer-events-auto animate-fadeIn">
          <a
            href="#overview"
            onClick={(e) => scrollToSection(e, '#overview')}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:bg-white/5 active:bg-white/10"
          >
            Overview
          </a>
          <a
            href="#solutions"
            onClick={(e) => scrollToSection(e, '#solutions')}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:bg-white/5 active:bg-white/10"
          >
            Solutions
          </a>
          <a
            href="#workbench"
            onClick={(e) => scrollToSection(e, '#workbench')}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:bg-white/5 active:bg-white/10"
          >
            Workbench
          </a>
          <a
            href="#case-studies"
            onClick={(e) => scrollToSection(e, '#case-studies')}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:bg-white/5 active:bg-white/10"
          >
            Case Studies
          </a>
        </div>
      )}
    </header>
  );
};
