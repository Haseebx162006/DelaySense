'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-150 ${
        isScrolled
          ? 'bg-jet-950/95 backdrop-blur-md border-b border-smoke-800 shadow-panel'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark (Strong visual presence, architectural sans) */}
        <div className="flex items-center gap-6">
          <a
            href="#hero"
            onClick={(e) => scrollTo(e, '#hero')}
            className="flex items-center gap-2 group select-none"
          >
            <span className="font-extrabold text-base tracking-tight text-white">
              DelaySense
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-smoke-800 text-smoke-300 border border-smoke-700">
              v1.0
            </span>
          </a>

          {/* Desktop Nav Links (Sentence case, subtle smoke gray) */}
          <nav className="hidden md:flex items-center gap-5 text-xs text-smoke-400">
            <a
              href="#corridors"
              onClick={(e) => scrollTo(e, '#corridors')}
              className="hover:text-white transition-colors duration-150"
            >
              Corridors
            </a>
            <a
              href="#workbench"
              onClick={(e) => scrollTo(e, '#workbench')}
              className="hover:text-white transition-colors duration-150"
            >
              Workbench
            </a>
            <a
              href="#economics"
              onClick={(e) => scrollTo(e, '#economics')}
              className="hover:text-white transition-colors duration-150"
            >
              Economics
            </a>
            <a
              href="#architecture"
              onClick={(e) => scrollTo(e, '#architecture')}
              className="hover:text-white transition-colors duration-150"
            >
              Architecture
            </a>
            <a
              href="#case-studies"
              onClick={(e) => scrollTo(e, '#case-studies')}
              className="hover:text-white transition-colors duration-150"
            >
              Case studies
            </a>
          </nav>
        </div>

        {/* Action Button: Cherry Red */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#workbench"
            onClick={(e) => scrollTo(e, '#workbench')}
            className="btn-cherry-sm"
          >
            <span>Launch workbench</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="#workbench"
            onClick={(e) => scrollTo(e, '#workbench')}
            className="btn-cherry-sm"
          >
            <span>Workbench</span>
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-smoke-900 border border-smoke-800 text-smoke-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-jet-900 border-b border-smoke-800 px-4 py-4 space-y-3">
          <a
            href="#corridors"
            onClick={(e) => scrollTo(e, '#corridors')}
            className="block text-sm text-smoke-300 hover:text-white py-1.5"
          >
            Corridors
          </a>
          <a
            href="#workbench"
            onClick={(e) => scrollTo(e, '#workbench')}
            className="block text-sm text-smoke-300 hover:text-white py-1.5"
          >
            Workbench
          </a>
          <a
            href="#economics"
            onClick={(e) => scrollTo(e, '#economics')}
            className="block text-sm text-smoke-300 hover:text-white py-1.5"
          >
            Economics
          </a>
          <a
            href="#architecture"
            onClick={(e) => scrollTo(e, '#architecture')}
            className="block text-sm text-smoke-300 hover:text-white py-1.5"
          >
            Architecture
          </a>
          <a
            href="#case-studies"
            onClick={(e) => scrollTo(e, '#case-studies')}
            className="block text-sm text-smoke-300 hover:text-white py-1.5"
          >
            Case studies
          </a>
        </div>
      )}
    </header>
  );
};
