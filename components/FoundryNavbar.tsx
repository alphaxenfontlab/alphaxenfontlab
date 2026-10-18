import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Volume2, VolumeX, ShoppingBag, ExternalLink, KeyRound, Grid, Sparkles, Eye, Layers } from 'lucide-react';
import { soundFx } from '../services/soundFx';
import { getAssetUrl } from '../services/fontData';
import { fastScrollTo } from '../services/fastScroll';

interface FoundryNavbarProps {
  onOpenLicenseModal?: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const FoundryNavbar: React.FC<FoundryNavbarProps> = ({
  onOpenLicenseModal,
  onScrollToSection,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(() => soundFx.isMuted());

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      fastScrollTo(sectionId, 76, 380);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-2 sm:pt-4 px-2 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 lg:gap-4 pointer-events-auto">
        
        {/* 1. Main Large Stadium Glass Capsule (Left to Center) */}
        <div className="navbar-glass-capsule px-2 sm:px-5 lg:px-6 py-1.5 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-6 lg:gap-8 flex-1 max-w-[840px] shadow-2xl shrink min-w-0">
          
          {/* Brand Monogram: Logo + ALPHAXEN FONT LAB */}
          <div
            className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 cursor-pointer group shrink-0"
            onClick={() => fastScrollTo(0, 0, 350)}
          >
            {/* Real Circular Logo Badge */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(56,189,248,0.5)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] group-hover:scale-105 transition-all overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={getAssetUrl('logo.png')}
                alt="Alphaxen Logo"
                className="w-full h-full object-cover rounded-full bg-black select-none pointer-events-none"
              />
            </div>

            {/* Typography: ALPHAXEN / FONT LAB (Slightly larger, crystal clear, zero cutoff) */}
            <div className="text-left select-none leading-none">
              <span className="text-[10.5px] sm:text-xs lg:text-sm font-black tracking-[0.05em] sm:tracking-[0.12em] lg:tracking-[0.18em] text-white font-syne leading-tight block group-hover:text-purple-200 transition-colors whitespace-nowrap">
                ALPHAXEN
              </span>
              <span className="text-[6.8px] sm:text-[7.5px] lg:text-[8px] font-mono tracking-[0.18em] sm:tracking-[0.25em] text-cyan-400 font-bold block mt-0.5 whitespace-nowrap">
                FONT LAB
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Direct Match to Reference Image) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 ml-auto text-[10.5px] font-mono uppercase tracking-[0.15em]">
            
            {/* TYPEFACES (22) */}
            <button
              onClick={() => handleNavClick('catalog')}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer font-bold group"
            >
              <span className="group-hover:text-white transition-colors">TYPEFACES</span>
              <span className="px-2 py-0.5 rounded-full border border-blue-400/40 text-blue-300 bg-blue-500/15 text-[9px] font-mono font-bold tracking-normal">
                (22)
              </span>
            </button>

            {/* TYPE / TESTER (Stacked as shown in reference) */}
            <button
              onClick={() => handleNavClick('type-tester')}
              className="flex flex-col items-center justify-center leading-none text-slate-300 hover:text-white transition-colors cursor-pointer font-bold group"
            >
              <span className="text-[10px] leading-tight group-hover:text-white transition-colors">TYPE</span>
              <span className="text-[8.5px] leading-tight text-slate-400 group-hover:text-slate-200 transition-colors">TESTER</span>
            </button>

            {/* SPECIMENS */}
            <button
              onClick={() => handleNavClick('specimen')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer font-bold"
            >
              SPECIMENS
            </button>

            {/* ABOUT */}
            <button
              onClick={() => handleNavClick('about')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer font-bold"
            >
              ABOUT
            </button>

            {/* LICENSING */}
            <button
              onClick={() => handleNavClick('licensing')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer font-bold"
            >
              LICENSING
            </button>
          </nav>
        </div>

        {/* 2. Standalone Right-Side Action Cluster (Matching reference image) */}
        <div className="flex items-center gap-1 sm:gap-2.5 lg:gap-3 shrink-0">
          
          {/* Button 1: SHOP ON MYFONTS (Hot Orange-Red Lava Gel Capsule) */}
          <a
            href="https://www.myfonts.com/collections/alphaxen-font-lab-foundry"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-btn-orange-lava px-2 sm:px-4 lg:px-5 py-1 sm:py-2.5 flex items-center gap-1 sm:gap-2 cursor-pointer shadow-xl group shrink-0"
            title="Shop our typefaces on MyFonts"
          >
            <div className="flex flex-col text-left leading-none font-syne font-black text-[7px] xs:text-[8px] sm:text-[9px] lg:text-[10px] tracking-wider uppercase">
              <span>SHOP ON</span>
              <span className="mt-0.5">MYFONTS</span>
            </div>
            <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </a>

          {/* Button 2: Circular Dark Glass Modern Audio / Sound Button */}
          <button
            onClick={() => {
              const isNowMuted = soundFx.toggleMute();
              setSoundMuted(isNowMuted);
            }}
            className={`navbar-btn-circle-mode cursor-pointer ${
              !soundMuted ? 'border-cyan-400/60 shadow-[0_0_18px_rgba(56,189,248,0.45)]' : 'border-white/10'
            }`}
            title={soundMuted ? 'Cyber Haptic Sound: Muted (Click to Turn On)' : 'Cyber Haptic Sound: Active (Click to Mute)'}
            aria-label={soundMuted ? 'Turn on sound' : 'Mute sound'}
          >
            {soundMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 transition-colors" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.85)] transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
              </div>
            )}
          </button>

          {/* Button 3: COMMISSION / LICENSE (Visible on Desktop) */}
          {onOpenLicenseModal && (
            <button
              onClick={onOpenLicenseModal}
              className="hidden lg:flex navbar-btn-purple-neon px-3.5 sm:px-5 py-2 sm:py-2.5 items-center gap-2 cursor-pointer shadow-xl group"
            >
              <span className="text-sm sm:text-base font-mono font-bold leading-none text-cyan-300">&divide;</span>
              <div className="flex flex-col text-left leading-none font-syne font-black text-[9px] sm:text-[10px] tracking-wider uppercase">
                <span>COMMISSION /</span>
                <span className="mt-0.5">LICENSE</span>
              </div>
            </button>
          )}

          {/* Button 4: Circular Dark Glass Hamburger Menu (Touch friendly 40px minimum) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden navbar-btn-circle-mode cursor-pointer min-w-[38px] min-h-[38px] w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center active:scale-90 transition-transform"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu (Touch-Optimized Large Targets) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden max-w-md mx-auto mt-3 p-4 navbar-glass-capsule rounded-3xl space-y-2 shadow-2xl pointer-events-auto animate-fade-in border border-white/20">
          <button
            onClick={() => handleNavClick('catalog')}
            className="w-full text-left py-3 px-4 text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center justify-between rounded-2xl border border-white/5 active:bg-white/10 active:scale-[0.98] transition-all"
          >
            <span>Typefaces</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/25 text-blue-300 text-xs">(22)</span>
          </button>
          <button
            onClick={() => handleNavClick('type-tester')}
            className="w-full text-left py-3 px-4 text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 rounded-2xl border border-white/5 active:bg-white/10 active:scale-[0.98] transition-all"
          >
            <span>Type Tester</span>
          </button>
          <button
            onClick={() => handleNavClick('specimen')}
            className="w-full text-left py-3 px-4 text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 rounded-2xl border border-white/5 active:bg-white/10 active:scale-[0.98] transition-all"
          >
            <span>Specimens</span>
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left py-3 px-4 text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 rounded-2xl border border-white/5 active:bg-white/10 active:scale-[0.98] transition-all"
          >
            <span>About</span>
          </button>
          <button
            onClick={() => handleNavClick('licensing')}
            className="w-full text-left py-3 px-4 text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 rounded-2xl border border-white/5 active:bg-white/10 active:scale-[0.98] transition-all"
          >
            <span>Licensing</span>
          </button>
          <button
            onClick={() => {
              const isNowMuted = soundFx.toggleMute();
              setSoundMuted(isNowMuted);
            }}
            className="w-full text-left py-3 px-4 text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 active:bg-white/10 active:scale-[0.98] transition-all"
          >
            <span className="flex items-center gap-2">
              {soundMuted ? <VolumeX size={15} className="text-slate-400" /> : <Volume2 size={15} className="text-cyan-300" />}
              <span>Sound Effects</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${!soundMuted ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/10 text-slate-400'}`}>
              {!soundMuted ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
