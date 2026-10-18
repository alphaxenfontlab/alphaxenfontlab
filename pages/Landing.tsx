import React, { useState, useEffect, useMemo } from 'react';
import {
  FontSummary,
  getFoundryCatalog,
  FontDetail,
  getFontDetail,
  mapTextToGlyphs,
  CATEGORY_FILTERS,
  MYFONTS_SHOP_URL,
  getAssetUrl,
  initialCatalog,
  initialFutureFont,
} from '../services/fontData';
import { FoundryNavbar } from '../components/FoundryNavbar';
import { FoundryFooter } from '../components/FoundryFooter';
import { LiveTypeTester } from '../components/LiveTypeTester';
import { LicenseInquiryModal } from '../components/LicenseInquiryModal';
import { DemoGlyph } from '../components/DemoGlyph';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Sliders,
  Type,
  KeyRound,
  Eye,
  Layers,
  Cpu,
  Flame,
  Globe,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Compass,
  Grid,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export const Landing: React.FC = () => {
  const [catalog, setCatalog] = useState<FontSummary[]>(() => initialCatalog || []);
  const [loadingCatalog, setLoadingCatalog] = useState<boolean>(!initialCatalog || initialCatalog.length === 0);

  // Selected state
  const [heroFontId, setHeroFontId] = useState<string>('alphaxen-future');
  const [heroFontDetail, setHeroFontDetail] = useState<FontDetail | null>(() => initialFutureFont || null);

  // Alphaxen Future font detail for the headline "MOLTEN" word
  const [futureFontDetail, setFutureFontDetail] = useState<FontDetail | null>(() => initialFutureFont || null);

  // Filter state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [licenseModalFont, setLicenseModalFont] = useState<FontSummary | null>(null);
  const [showLicenseModal, setShowLicenseModal] = useState<boolean>(false);

  // Waterfall font
  const [waterfallFontId, setWaterfallFontId] = useState<string>('alphaxen-future');
  const [waterfallDetail, setWaterfallDetail] = useState<FontDetail | null>(() => initialFutureFont || null);

  // Responsive glyph sizing with throttled resize
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    let rAF = 0;
    const handleResize = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        setWindowWidth(window.innerWidth);
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Defer heavy hover work during active scroll for 60-120fps responsiveness
  useEffect(() => {
    let scrollTimeout = 0;
    const onScrollStart = () => {
      if (!document.body.classList.contains('is-scrolling')) {
        document.body.classList.add('is-scrolling');
      }
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 100);
    };

    const onScrollEnd = () => {
      clearTimeout(scrollTimeout);
      document.body.classList.remove('is-scrolling');
    };

    window.addEventListener('scroll', onScrollStart, { passive: true });
    if ('onscrollend' in window) {
      window.addEventListener('scrollend', onScrollEnd, { passive: true });
    }

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', onScrollStart);
      if ('onscrollend' in window) {
        window.removeEventListener('scrollend', onScrollEnd);
      }
      document.body.classList.remove('is-scrolling');
    };
  }, []);

  const heroBallGlyphSize = useMemo(() => {
    if (windowWidth < 400) return 26;
    if (windowWidth < 520) return 30;
    if (windowWidth < 640) return 35;
    if (windowWidth < 1024) return 38;
    if (windowWidth < 1280) return 42;
    return 46;
  }, [windowWidth]);

  const waterfallScale = useMemo(() => {
    if (windowWidth < 480) return 0.52;
    if (windowWidth < 640) return 0.68;
    if (windowWidth < 1024) return 0.82;
    if (windowWidth < 1280) return 0.92;
    return 1;
  }, [windowWidth]);

  // Load master catalog
  useEffect(() => {
    getFoundryCatalog().then((data) => {
      setCatalog(data);
      setLoadingCatalog(false);
      if (data.length > 0) {
        const futureFont = data.find((f) => f.id === 'alphaxen-future') || data[0];
        setHeroFontId(futureFont.id);
        setWaterfallFontId(futureFont.id);
      }
    });
  }, []);

  // Preload alphaxen-future font for hero title
  useEffect(() => {
    getFontDetail('alphaxen-future').then((d) => setFutureFontDetail(d));
  }, []);

  // Load hero font detail
  useEffect(() => {
    if (heroFontId) {
      getFontDetail(heroFontId).then((d) => setHeroFontDetail(d));
    }
  }, [heroFontId]);

  // Load waterfall font detail
  useEffect(() => {
    if (waterfallFontId) {
      getFontDetail(waterfallFontId).then((d) => setWaterfallDetail(d));
    }
  }, [waterfallFontId]);

  // Filtered catalog
  const filteredCatalog = useMemo(() => {
    return catalog.filter((font) => {
      // Category match
      if (activeCategory === 'chromatic' && font.category !== 'chromatic') return false;
      if (activeCategory === 'vector' && font.category !== 'vector') return false;
      if (activeCategory === 'fantasy' && !font.subCategory.toLowerCase().includes('fantasy') && !font.subCategory.toLowerCase().includes('mythic')) return false;
      if (activeCategory === 'scifi' && !font.subCategory.toLowerCase().includes('sci-fi') && !font.subCategory.toLowerCase().includes('cyber') && !font.subCategory.toLowerCase().includes('cosmic')) return false;
      if (activeCategory === 'oceanic' && !font.subCategory.toLowerCase().includes('oceanic') && !font.subCategory.toLowerCase().includes('polar') && !font.subCategory.toLowerCase().includes('abyssal') && !font.subCategory.toLowerCase().includes('arctic')) return false;
      if (activeCategory === 'organic' && !font.subCategory.toLowerCase().includes('organic') && !font.subCategory.toLowerCase().includes('fluid') && !font.subCategory.toLowerCase().includes('flora')) return false;
      if (activeCategory === 'luxury' && !font.subCategory.toLowerCase().includes('luxury') && !font.subCategory.toLowerCase().includes('regal') && !font.subCategory.toLowerCase().includes('haute') && !font.subCategory.toLowerCase().includes('display')) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = font.name.toLowerCase().includes(q);
        const matchesSub = font.subCategory.toLowerCase().includes(q);
        const matchesTheme = font.theme.toLowerCase().includes(q);
        const matchesDesc = font.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesTheme && !matchesDesc) return false;
      }

      return true;
    });
  }, [catalog, activeCategory, searchQuery]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openLicense = (font?: FontSummary) => {
    setLicenseModalFont(font || catalog[0] || null);
    setShowLicenseModal(true);
  };

  const getFontWaterboxClass = (font: FontSummary, idx: number) => {
    const cat = (font.subCategory || '').toLowerCase();
    const theme = (font.theme || '').toLowerCase();
    const id = (font.id || '').toLowerCase();
    const stagger = `water-stagger-${(idx % 4) + 1}`;

    let base = 'waterbox';

    // 1. Dragon / Volcanic Magma / Lava: Shape 2 (multi-wave fluid splash blob)
    if (cat.includes('fantasy') || cat.includes('magma') || theme.includes('lava') || theme.includes('fire') || id.includes('dragon')) {
      base = 'waterbox-lava waterbox-blob-splash';
    } 
    // 2. Polar / Arctic / Ice: Keep pure spherical water droplet
    else if (cat.includes('polar') || cat.includes('arctic') || id.includes('penguin') || theme.includes('ice')) {
      base = 'waterbox-oceanic';
    }
    // 3. Oceanic / Deep Water / Marine: Shape 5 (fluid landscape pod blob)
    else if (cat.includes('oceanic') || theme.includes('water') || id.includes('octopus')) {
      base = 'waterbox-oceanic waterbox-blob-landscape';
    } 
    // 4. Sci-Fi / Cyber / Cosmic / Amethyst: Shape 3 (diagonal elongated fluid droplet)
    else if (cat.includes('sci-fi') || cat.includes('cosmic') || cat.includes('cyber') || cat.includes('amethyst') || theme.includes('violet')) {
      base = 'waterbox-violet waterbox-blob-diagonal';
    } 
    // 5. Luxury / Flora / Honey / Nature: Shape 1 (organic puddle) or Shape 4 (fluid pebble)
    else if (cat.includes('luxury') || cat.includes('gold') || theme.includes('honey')) {
      base = 'waterbox-honey waterbox-blob-pebble';
    }
    else if (cat.includes('flora') || cat.includes('nature') || id.includes('peacock') || id.includes('chameleon')) {
      base = 'waterbox-honey waterbox-blob-puddle';
    } else {
      // Diverse distribution matching the 6 user reference shapes and round spheres:
      const organicFlavors = [
        'waterbox waterbox-blob-puddle',
        'waterbox-oceanic waterbox-blob-landscape',
        'waterbox-violet waterbox-blob-diagonal',
        'waterbox-lava waterbox-blob-splash',
        'waterbox-honey waterbox-blob-pebble',
        'waterbox waterbox-blob-droplet',
        'waterbox-oceanic',
      ];
      base = organicFlavors[idx % organicFlavors.length];
    }

    return `${base} ${stagger}`;
  };

  return (
    <div className="min-h-screen bg-[#07080e] md:bg-[#07080e] text-slate-100 font-sans selection:bg-purple-500/40 selection:text-purple-100 relative overflow-x-hidden">
      
      {/* Mobile Fixed UI Background (High-Fidelity Cosmic Planet & Liquid Magma Landscape from background.png) */}
      <div 
        className="md:hidden fixed inset-0 pointer-events-none z-0 transform-gpu"
        style={{
          backgroundImage: `url('${getAssetUrl('background.png')}')`,
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          contain: 'strict',
          isolation: 'isolate',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Desktop & Laptop Fixed UI Background from bgdesk.png (Matches Mobile Architecture) */}
      <div 
        className="hidden md:block fixed inset-0 pointer-events-none z-0 transform-gpu"
        style={{
          backgroundImage: `url('${getAssetUrl('bgdesk.png')}')`,
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          contain: 'strict',
          isolation: 'isolate',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Top Fixed Navbar */}
      <div className="relative z-40">
        <FoundryNavbar
          onOpenLicenseModal={() => openLicense()}
          onScrollToSection={scrollToSection}
        />
      </div>

      {/* Hero Section (Ultra-Luxury Futuristic Typography & Mobile Master Architecture) */}
      <section className="relative pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
        
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
          
          {/* Eyebrow Floating Capsule Badge (Direct Match to Mobile Reference Mockup) */}
          <div className="text-center px-1">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-full navbar-glass-capsule text-[10px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest shadow-xl border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-emerald-400 font-bold">ALPHAXEN FONT LAB</span>
              <span className="text-slate-500 font-normal">/</span>
              <span className="text-slate-300">INDEPENDENT TYPE FOUNDRY</span>
            </div>
          </div>

          {/* Hero Top Grid: Title & Floating Molten Specimen Orb */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            
            {/* Left Col: Refined Futuristic Luxury Typography */}
            <div className="lg:col-span-5 text-left space-y-5">
              <div className="space-y-1">
                <span className="block text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-[0.18em] uppercase font-syne leading-none">
                  SCULPTING
                </span>
                <span className="block text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-[0.18em] uppercase font-syne leading-none mt-1 sm:mt-1.5">
                  THE
                </span>
                
                {/* 3D Photorealistic MOLTEN Typography with Floating Droplet Artifact */}
                <div className="py-2 flex items-center justify-between relative max-w-lg">
                  {futureFontDetail ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                      {mapTextToGlyphs('MOLTEN', futureFontDetail).map((glyph, idx) => (
                        <span
                          key={idx}
                          className="filter drop-shadow-[0_8px_20px_rgba(6,182,212,0.7)] drop-shadow-[0_0_18px_rgba(168,85,247,0.6)] transform hover:scale-115 hover:-translate-y-1 transition-transform inline-block"
                          title={`Alphaxen Future - ${glyph.char}`}
                        >
                          <DemoGlyph
                            glyph={glyph}
                            size={windowWidth < 640 ? 44 : (windowWidth < 1024 ? 48 : 52)}
                            unitsPerEm={futureFontDetail.unitsPerEm}
                            color="#ffffff"
                            priority={true}
                          />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <img
                      src={getAssetUrl('art-molten-word.png')}
                      alt="MOLTEN"
                      className="h-10 sm:h-12 md:h-14 w-auto object-contain filter drop-shadow-[0_8px_20px_rgba(236,72,153,0.55)] transform -ml-0.5"
                    />
                  )}

                  {/* Pure Code 3D Floating Molten Liquid Droplet (Matching reference mockup image) */}
                  <div className="relative shrink-0 -mt-6 sm:-mt-8 mr-1 sm:mr-4">
                    <div className="mobile-molten-droplet" />
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee] absolute -top-1 -right-1 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_#ec4899] absolute bottom-1 -left-1 animate-bounce" />
                  </div>
                </div>

                <span className="block text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.18em] uppercase font-syne leading-none text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-400 to-cyan-300 drop-shadow-[0_0_25px_rgba(236,72,153,0.85)] mt-1 sm:mt-1.5">
                  DIMENSION
                </span>
              </div>
              
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans max-w-lg">
                Step into the future of digital typography. Genuine photorealistic materials—dragon scales,
                incandescent <strong className="text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">volcanic magma</strong>, viscous liquid gold, and
                endless oceanic bioluminescence. Rendered straight from our proprietary style vaults.
              </p>

              {/* The Two Luxury Feature Chips (Direct Match to Mobile Reference Mockup) */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono">
                <div className="px-4 py-2 rounded-full navbar-glass-capsule text-purple-200 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-purple-400/35 backdrop-blur-md">
                  <Layers size={14} className="text-purple-400" />
                  <span className="font-semibold text-white">{catalog.length} Master Typefaces</span>
                </div>
                <div className="px-4 py-2 rounded-full navbar-glass-capsule text-cyan-200 flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-400/35 backdrop-blur-md">
                  <ShieldCheck size={14} className="text-cyan-400" />
                  <span className="font-semibold text-cyan-300">Zero OTF Leaks</span>
                </div>
              </div>

              {/* Desktop Action Buttons */}
              <div className="pt-2 hidden md:flex flex-wrap items-center gap-3">
                <button
                  onClick={() => scrollToSection('catalog')}
                  className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:brightness-110 text-white shadow-lg shadow-purple-900/40 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border-t border-white/40"
                >
                  <span>Explore Typefaces</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => scrollToSection('type-tester')}
                  className="px-6 py-3 rounded-full text-xs font-bold neu-convex-btn text-slate-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} className="text-purple-400" />
                  <span>Live Type Tester</span>
                </button>
              </div>

              {/* Foundry IP & Asset Protection Confirmation Notice */}
              <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0d1226]/80 to-cyan-950/40 border border-purple-500/25 backdrop-blur-md flex items-start gap-3 shadow-lg max-w-lg">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0 text-purple-300 mt-0.5 shadow-inner">
                  <ShieldCheck size={16} className="text-emerald-400" />
                </div>
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-200">
                      Asset Protection &amp; Demo Notice
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
                      Protected Specimen
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    Please note: The font demo glyphs showcased across this foundry portal are intentionally curated preview variations rather than identical commercial production masters. We purposefully maintain select demo-grade variations to safeguard our proprietary type assets against digital extraction and piracy. Complete, pristine character matrices are delivered exclusively with official licenses on MyFonts.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col: Monumental Master Waterbox (Pure Organic Fluid Water Vessel) */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end items-center py-4 w-full">
              <div className="waterbox molten-master-box w-full max-w-[560px] sm:max-w-[600px] min-h-[390px] sm:min-h-[420px] p-6 sm:p-9 flex flex-col justify-between">
                <div className="relative z-10 flex flex-col justify-between h-full w-full space-y-6">
                  
                  {/* Top Badge Row - Placed comfortably inside safe curved bounds */}
                  <div className="flex items-center justify-between gap-3 px-4 sm:px-6 pt-1">
                    <span className="text-emerald-300 text-[11px] font-mono flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 shadow-sm backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ZERO OTF LABS</span>
                    </span>
                    <button
                      onClick={() => scrollToSection('type-tester')}
                      className="text-purple-200 hover:text-white font-mono text-[11px] flex items-center gap-1.5 cursor-pointer transition-all backdrop-blur-md px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 shadow-sm hover:scale-105"
                    >
                      <span>Live Type Studio</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* Central Monumental Specimen: Full ALPHAXEN Glyphs Display with Generous Safe Inset */}
                  <div className="py-4 my-auto text-center flex flex-col items-center justify-center">
                    {heroFontDetail ? (
                      <div className="w-full flex flex-col items-center justify-center">
                        {/* The 8 full characters of ALPHAXEN completely visible and centered with zero clipping */}
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 max-w-full overflow-visible py-2 px-2">
                          {mapTextToGlyphs('ALPHAXEN', heroFontDetail).slice(0, 8).map((glyph, idx) => (
                            <span
                              key={idx}
                              className="filter drop-shadow-[0_12px_22px_rgba(255,85,0,0.9)] drop-shadow-[0_0_16px_rgba(236,72,153,0.7)] shrink-0 transition-transform duration-200 hover:scale-115 hover:-translate-y-1.5 inline-flex items-center justify-center cursor-default"
                              title={`Character: ${glyph.char}`}
                            >
                              <DemoGlyph
                                glyph={glyph}
                                size={heroBallGlyphSize}
                                unitsPerEm={heroFontDetail.unitsPerEm}
                                color="#ffffff"
                                priority={true}
                              />
                            </span>
                          ))}
                        </div>

                        {/* Molten Liquid Specular Reflection Pool */}
                        <div className="molten-liquid-pool w-3/4 max-w-xs mx-auto mt-2 mb-3" />

                        <span className="block text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-cyan-200 font-extrabold drop-shadow">
                          THE FUTURE IN LETTERS
                        </span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto my-8" />
                    )}
                  </div>

                  {/* Bottom Telemetry - Inset safely away from the curved bottom corners */}
                  <div className="pt-3.5 border-t border-white/15 flex items-center justify-between text-[11px] font-mono text-slate-300 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                      <span className="font-semibold text-white">Photorealistic Materials</span>
                    </div>
                    <span className="text-orange-400 font-bold drop-shadow">100% SVG &bull; Live 3D</span>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Main Hero Organic Waterbox Stage (Pure Fluid Water Vessel with Full Safe Clearance) */}
          <div className="pt-4 max-w-5xl mx-auto px-1 sm:px-4">
            <div className="waterbox-stage py-10 sm:py-14 md:py-16 px-6 sm:px-12 md:px-16 shadow-2xl">
              <div className="relative z-10 w-full">
                {/* Stage Top Bar / Telemetry */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} className="text-amber-400 animate-pulse" />
                    <span className="text-white font-extrabold text-sm sm:text-base tracking-tight font-syne">
                      {heroFontDetail?.name || 'Alphaxen Dragon'}
                    </span>
                    <span className="text-slate-400 text-xs hidden sm:inline">&bull; {heroFontDetail?.subCategory}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <ShieldCheck size={13} /> Zero_OTF_Labs
                    </span>
                    <button
                      onClick={() => scrollToSection('type-tester')}
                      className="text-purple-300 hover:text-white font-bold cursor-pointer flex items-center gap-1.5 text-xs transition-colors"
                    >
                      <Sliders size={13} /> Live Studio &rarr;
                    </button>
                  </div>
                </div>

                {/* High-Impact 3D Liquid Stage Podium with Floating Demo Characters */}
                <div className="py-12 sm:py-20 liquid-podium flex items-center justify-center overflow-x-auto custom-scrollbar relative">
                  {/* Left Side Vertical Controls from frontend top part.png */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 text-slate-400 z-10">
                    <button className="w-7 h-7 rounded-full neu-convex-btn flex items-center justify-center hover:text-white transition-all text-xs">
                      <ArrowUp size={12} />
                    </button>
                    <span className="text-[10px] font-mono rotate-90 my-2 text-slate-400 tracking-wider">
                      90 / 06
                    </span>
                    <button className="w-7 h-7 rounded-full neu-convex-btn flex items-center justify-center hover:text-white transition-all text-xs">
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  {heroFontDetail ? (
                    <div className="inline-flex items-center gap-2 sm:gap-3.5 whitespace-nowrap px-4 md:px-12">
                      {mapTextToGlyphs('ALPHAXEN', heroFontDetail).map((glyph, idx) => (
                        <span
                          key={idx}
                          className="transition-all duration-300 hover:scale-120 hover:-translate-y-2 cursor-pointer filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
                          title={`Demo Glyph: ${glyph.char}`}
                        >
                          <DemoGlyph
                            glyph={glyph}
                            size={window.innerWidth < 640 ? 58 : 108}
                            unitsPerEm={heroFontDetail.unitsPerEm}
                            color="#f8fafc"
                          />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                {/* Quick Typeface Selector Bar with Custom Slider Accent */}
                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass size={13} className="text-purple-400" /> Switch Live Typeface:
                      </span>
                      <span className="text-[10px] font-mono text-purple-400">
                        {heroFontDetail?.theme || 'Scaled Armor & Gold'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                      {[
                        { id: 'alphaxen-dragon', label: 'Dragon' },
                        { id: 'alphaxen-molten-lava', label: 'Molten Lava' },
                        { id: 'alphaxen-future', label: 'Future' },
                        { id: 'alphaxen-honey', label: 'Honey' },
                        { id: 'alphaxen-jellyfish', label: 'Oceanic' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setHeroFontId(item.id)}
                          className={`text-xs px-4 py-2 rounded-xl font-mono whitespace-nowrap transition-all cursor-pointer ${
                            heroFontId === item.id
                              ? 'neu-convex-btn text-white font-bold border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-105'
                              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Slider Feature Badge (Design Scales & Detail Layers) */}
                  <div className="neu-inset-well p-3 rounded-2xl md:min-w-[240px]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mb-1.5">
                      <span>Design Scales &amp; Detail Layers</span>
                      <button className="w-4 h-4 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_8px_rgba(236,72,153,0.8)]" title="Color Wheel" />
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                      <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Organic Waterbox 3-Action Cards (Single Fluid Water Vessels) */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Card 1: Shop on MyFonts (Organic Fluid Blob 1 - Puddle) */}
            <a
              href={MYFONTS_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="waterbox waterbox-blob-puddle water-stagger-1 p-7 sm:p-8 flex flex-col justify-between cursor-pointer min-h-[220px]"
            >
              <div className="relative z-10 w-full flex flex-col justify-between h-full space-y-4">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-900/40 group-hover:rotate-6 transition-transform">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white font-syne tracking-tight">
                      SHOP ON MYFONTS
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Get your favorite fonts directly from our official MyFonts store collection.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <div className="w-9 h-9 rounded-full neu-convex-btn flex items-center justify-center text-slate-300 group-hover:text-white group-hover:scale-110 transition-all">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </a>

            {/* Card 2: Open Type Tester (Organic Fluid Blob 4 - Pebble) */}
            <button
              onClick={() => scrollToSection('type-tester')}
              className="waterbox waterbox-blob-pebble water-stagger-2 w-full p-7 sm:p-8 flex flex-col justify-between text-left cursor-pointer min-h-[220px]"
            >
              <div className="relative z-10 w-full flex flex-col justify-between h-full space-y-4">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/40 group-hover:rotate-6 transition-transform">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white font-syne tracking-tight">
                      OPEN TYPE TESTER
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Try every glyph, weight, style and photorealistic material in real-time.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <div className="w-9 h-9 rounded-full neu-convex-btn flex items-center justify-center text-slate-300 group-hover:text-white group-hover:scale-110 transition-all">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </button>

            {/* Card 3: Explore Fonts (Organic Fluid Blob 3 - Diagonal Droplet) */}
            <button
              onClick={() => scrollToSection('catalog')}
              className="waterbox waterbox-blob-diagonal water-stagger-3 w-full p-7 sm:p-8 flex flex-col justify-between text-left cursor-pointer min-h-[220px]"
            >
              <div className="relative z-10 w-full flex flex-col justify-between h-full space-y-4">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/40 group-hover:rotate-6 transition-transform">
                    <span className="font-extrabold font-syne text-lg">Aa</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white font-syne tracking-tight">
                      EXPLORE {catalog.length} FONTS
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Diverse styles, infinite possibilities, authentic multi-color SVG fonts.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <div className="w-9 h-9 rounded-full neu-convex-btn flex items-center justify-center text-slate-300 group-hover:text-white group-hover:scale-110 transition-all">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Signature Molten Curved Metrics Pill Bar */}
          <div className="pt-4 max-w-5xl mx-auto px-2">
            <div className="pure-molten-metrics px-6 sm:px-12 py-5 sm:py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono overflow-hidden">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                  <Layers size={18} />
                </div>
                <div className="text-left space-y-0.5">
                  <span className="text-xl sm:text-2xl font-black text-white block font-syne leading-none">{catalog.length}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Typefaces</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Sparkles size={18} />
                </div>
                <div className="text-left space-y-0.5">
                  <span className="text-xl sm:text-2xl font-black text-purple-300 block font-syne leading-none">100%</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Real Textures</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Type size={18} />
                </div>
                <div className="text-left space-y-0.5">
                  <span className="text-xl sm:text-2xl font-black text-white block font-syne leading-none">2,298</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Glyphs</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={18} />
                </div>
                <div className="text-left space-y-0.5">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 block font-syne leading-none">ZERO</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">DOT LEAKS (SAFE)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Section 2: Interactive Type Tester Studio */}
      <section className="py-16 sm:py-24 relative z-10" id="type-tester">
        <LiveTypeTester
          catalog={catalog}
          initialFontId={heroFontId}
          onOpenLicense={openLicense}
        />
      </section>



      {/* Section 3: Foundry Typeface Catalog Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 content-visibility-section" id="catalog">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full molten-glass-panel text-purple-300 text-xs font-mono uppercase tracking-wider mb-2">
              <Layers size={13} /> Complete Foundry Archive
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-syne">
              The {catalog.length} Typefaces
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Curated strictly from your &ldquo;all fonts&rdquo; vault. Featuring {catalog.filter(f => f.category === 'chromatic').length} chromatic 3D material
              display typefaces and high-contrast precision vector display suites.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, material or theme..."
              className="w-full neu-inset-well rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-all font-sans"
            />
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs px-4 py-2.5 rounded-2xl font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'neu-convex-btn text-white font-black border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.35)] scale-105'
                  : 'molten-glass-panel text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        {loadingCatalog ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono uppercase tracking-widest">Loading catalog from vault...</span>
          </div>
        ) : filteredCatalog.length === 0 ? (
          <div className="text-center py-24 molten-glass-panel rounded-3xl p-8 space-y-3">
            <p className="text-slate-300 font-bold text-base">No typefaces match your filter criteria.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-purple-400 hover:text-purple-300 underline font-mono"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredCatalog.map((font, idx) => (
              <div
                key={font.id}
                className={`${getFontWaterboxClass(font, idx)} catalog-card-contain p-6 sm:p-7 flex flex-col justify-between h-full overflow-hidden`}
                style={{
                  borderRightColor: font.accent,
                  borderBottomColor: font.accent,
                }}
              >
                <div className="relative z-10 flex flex-col justify-between h-full w-full">
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: font.accent, color: font.accent }} />
                          <h3 className="text-xl font-black text-white font-syne tracking-tight">
                            {font.name}
                          </h3>
                        </div>
                        <span className="text-xs text-purple-400 font-mono block mt-0.5">
                          {font.subCategory}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 uppercase shrink-0 shadow-inner">
                        {font.category === 'chromatic' ? 'Chromatic 3D' : 'Vector'}
                      </span>
                    </div>

                    {/* Theme Description */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {font.description}
                    </p>

                    {/* Character Specimen Strip (Real Demo Characters in Molten Fluid Inset) */}
                    <div className="pure-molten-input-wrap rounded-2xl p-4 flex items-center justify-center gap-2 mb-4 overflow-hidden min-h-[76px]">
                      {font.previewGlyphs && font.previewGlyphs.length > 0 ? (
                        font.previewGlyphs.map((glyph, gIdx) => (
                          <span key={gIdx} className="transition-transform hover:scale-120 duration-200 hover:filter hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] inline-flex items-center justify-center">
                            <DemoGlyph
                              glyph={glyph}
                              size={36}
                              unitsPerEm={font.unitsPerEm}
                              color="#f8fafc"
                            />
                          </span>
                        ))
                      ) : (
                        <span className="text-xs font-mono text-slate-500">Glyphs Loaded</span>
                      )}
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 mb-6">
                      <div className="p-2.5 rounded-xl pure-molten-pill-pod">
                        <span className="text-slate-500 block text-[9px] uppercase">Total Glyphs</span>
                        <span className="text-white font-bold">{font.glyphCount} Characters</span>
                      </div>
                      <div className="p-2.5 rounded-xl pure-molten-pill-pod">
                        <span className="text-slate-500 block text-[9px] uppercase">Format</span>
                        <span className="text-white font-bold">
                          {font.category === 'chromatic' ? 'OpenType-SVG' : 'CFF Outline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setHeroFontId(font.id);
                        scrollToSection('type-tester');
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold neu-convex-btn text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sliders size={13} /> Test
                    </button>

                    <a
                      href={MYFONTS_SHOP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md hover:scale-105"
                      title={`Buy ${font.name} on MyFonts`}
                    >
                      <ShoppingBag size={13} /> Buy
                    </a>

                    <button
                      onClick={() => openLicense(font)}
                      className="p-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white transition-all cursor-pointer shadow hover:scale-105"
                      title="License Inquiry"
                    >
                      <KeyRound size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 4: Specimen Waterfall & Optical Scalability */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 content-visibility-section" id="specimen">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full molten-glass-panel text-purple-300 text-xs font-mono uppercase tracking-wider mb-2">
                <Eye size={13} /> Optical Scalability
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-syne">
                Specimen Waterfall
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Observe how genuine color and textured glyphs perform across cascading optical scales
                from monumental display (84px) to titling (20px).
              </p>
            </div>

            {/* Waterfall Font Selector */}
            <div className="flex items-center gap-3">
              <select
                value={waterfallFontId}
                onChange={(e) => setWaterfallFontId(e.target.value)}
                className="neu-convex-btn text-white text-xs font-semibold rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {catalog.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cascading Waterfall Container inside High-Impact Organic Waterball (Fluid Landscape Shape 5) */}
          <div className="waterbox-waterfall waterbox-blob-landscape py-14 sm:py-20 md:py-24 px-6 sm:px-14 md:px-20 lg:px-24 shadow-2xl relative">
            <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6 sm:space-y-7">
              {/* Waterball Top Telemetry & Font Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  <span className="text-white font-black tracking-wide uppercase font-syne">
                    {waterfallDetail?.name || 'Alphaxen Future'}
                  </span>
                  <span className="text-cyan-300 text-[11px]">&bull; {waterfallDetail?.subCategory || 'Specimen'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/35 text-cyan-300 font-semibold shadow-inner">
                    Zero Distortion Waterfall
                  </span>
                </div>
              </div>

              {waterfallDetail ? (
                [
                  { baseSize: 72, text: 'ALPHAXEN', label: 'Monumental Titling' },
                  { baseSize: 46, text: 'CHROMATIC FOUNDRY', label: 'Display Scale' },
                  { baseSize: 32, text: 'HIGH CONTRAST MATERIALS', label: 'Editorial Headline' },
                  { baseSize: 22, text: 'PHOTOREALISTIC 3D LIGHTING & DEPTH', label: 'Subhead Tier' },
                  { baseSize: 15, text: '0123456789 THE QUICK BROWN FOX JUMPS OVER LAZY DOG', label: 'Complete Character Matrix' },
                ].map((tier, idx) => {
                  const glyphs = mapTextToGlyphs(tier.text, waterfallDetail);
                  const computedSize = Math.max(11, Math.round(tier.baseSize * waterfallScale));

                  return (
                    <div key={idx} className="border-b border-white/10 pb-4 sm:pb-5 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-2 px-1">
                        <span className="text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          {computedSize}px &bull; {tier.label}
                        </span>
                        <span className="text-slate-400 font-mono text-[9px]">
                          {glyphs.length} Glyphs
                        </span>
                      </div>
                      <div className="w-full flex items-center justify-center overflow-x-auto whitespace-nowrap custom-scrollbar py-1">
                        <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-nowrap">
                          {glyphs.map((g, gIdx) => (
                            <span
                              key={gIdx}
                              className="inline-flex items-center justify-center shrink-0 transition-transform duration-150 hover:scale-115 filter drop-shadow-[0_4px_10px_rgba(0,242,254,0.35)]"
                              title={`Character: ${g.char}`}
                            >
                              <DemoGlyph
                                glyph={g}
                                size={computedSize}
                                unitsPerEm={waterfallDetail.unitsPerEm}
                                color="#f8fafc"
                              />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center text-slate-400 text-xs font-mono">
                  Loading specimen waterfall...
                </div>
              )}

              {/* Waterball Bottom Telemetry */}
              <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span className="font-semibold text-white">Full Optical Fidelity</span>
                </div>
                <span className="text-cyan-300 font-bold drop-shadow">100% SVG Vector Materials</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Foundry Philosophy & Security */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 content-visibility-section" id="about">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full molten-glass-panel text-purple-300 text-xs font-mono uppercase tracking-wider">
              <Sparkles size={13} /> The Alphaxen Philosophy
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-syne leading-tight">
              Pushing Typography Beyond Monochrome Outlines
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Traditional digital typography has remained locked in two-dimensional single-color vector
              paths for decades. Alphaxen was founded to dissolve the boundary between type design and
              hyper-detailed material art.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Each chromatic typeface in our catalog is engineered using cutting-edge OpenType-SVG specifications,
              delivering rich physical textures, reflections, specular highlights, and organic structures directly
              into letterforms without requiring 3D software rendering in post-production.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 pure-molten-pill-pod space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <Flame size={16} /> Authentic Materials
                </div>
                <p className="text-slate-400 text-[11px] font-sans">
                  Volcanic basalt, liquid honey droplets, iridescent feathers, and bioluminescence.
                </p>
              </div>

              <div className="p-4 pure-molten-pill-pod space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck size={16} /> DRM Protected Vault
                </div>
                <p className="text-slate-400 text-[11px] font-sans">
                  Server-side security prevents unauthorized font downloads while allowing rich demo previews.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Feature Box with Cosmic Violet Molten Box */}
          <div className="molten-violet-box p-8 sm:p-12 shadow-2xl overflow-hidden">
            <div className="relative z-10 w-full space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">
                  Exclusively For Visionary Projects
                </span>
                <h3 className="text-2xl font-black text-white font-syne">
                  Commercial Deployments
                </h3>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Haute Branding &amp; Packaging:</strong> Stand out in luxury cosmetics, perfumes,
                    spirits, and high-fashion editorial covers.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cinema, Broadcast &amp; Key Art:</strong> Deliver unforgettable movie titles,
                    album covers, and streaming series logos.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Bespoke Type Commissions:</strong> Work directly with Alphaxen to sculpt
                    a proprietary chromatic font family for your global brand.
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => openLicense()}
                  className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border-t border-white/30 hover:scale-[1.02]"
                >
                  <KeyRound size={15} /> Request Commercial License Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Licensing Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 content-visibility-section" id="licensing">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full pure-molten-pill-pod text-purple-300 text-xs font-mono uppercase tracking-wider">
            <KeyRound size={13} /> Transparent Commercial EULA
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-syne">
            Foundry Licensing Tiers
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Choose the right licensing tier for your creative studio or enterprise brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Oceanic Bioluminescent Molten Card */}
          <div className="p-8 molten-oceanic-box flex flex-col justify-between h-full">
            <div className="relative z-10 w-full flex flex-col justify-between h-full space-y-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  Design &amp; Print
                </span>
                <h3 className="text-xl font-black text-white font-syne">Desktop Commercial</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  For creative agencies, freelancing directors, and print publishing. Includes full commercial
                  rights for packaging, identities, posters, and books.
                </p>
              </div>
              <button
                onClick={() => openLicense()}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider neu-convex-btn text-white transition-all cursor-pointer"
              >
                Inquire Desktop
              </button>
            </div>
          </div>

          {/* Tier 2: Cosmic Violet Molten Card (Popular) */}
          <div className="p-8 molten-violet-box flex flex-col justify-between border-2 border-purple-500/60 shadow-[0_0_35px_rgba(139,92,246,0.35)] relative h-full">
            <div className="absolute top-4 right-4 text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500 text-white uppercase font-bold shadow z-20">
              POPULAR
            </div>
            <div className="relative z-10 w-full flex flex-col justify-between h-full space-y-4">
              <div>
                <span className="text-xs font-mono text-pink-400 uppercase tracking-widest block mb-1">
                  Digital &amp; Broadcast
                </span>
                <h3 className="text-xl font-black text-white font-syne">Web &amp; Media Rights</h3>
                <p className="text-xs text-slate-200 leading-relaxed mt-2">
                  Covers digital web platforms, streaming releases, YouTube/TikTok broadcasting, interactive
                  gaming apps, and commercial marketing campaigns.
                </p>
              </div>
              <button
                onClick={() => openLicense()}
                className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-lg cursor-pointer"
              >
                Inquire Digital
              </button>
            </div>
          </div>

          {/* Tier 3: Viscous Liquid Gold Honey Molten Card */}
          <div className="p-8 molten-honey-box flex flex-col justify-between h-full">
            <div className="relative z-10 w-full flex flex-col justify-between h-full space-y-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">
                  Enterprise &amp; Bespoke
                </span>
                <h3 className="text-xl font-black text-white font-syne">Unlimited Worldwide</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  Perpetual global deployment across all subsidiaries, unlimited apps, broadcasting networks,
                  and bespoke typeface custom sculpting.
                </p>
              </div>
              <button
                onClick={() => openLicense()}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider neu-convex-btn text-white transition-all cursor-pointer"
              >
                Inquire Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showLicenseModal && (
        <LicenseInquiryModal
          initialFont={licenseModalFont}
          catalog={catalog}
          onClose={() => setShowLicenseModal(false)}
        />
      )}

      {/* Floating Mobile Dock (Visible on Mobile Screens - Stadium Liquid Glass Vessel) */}
      <div className="md:hidden fixed bottom-4 left-3 right-3 sm:left-6 sm:right-6 z-40 mobile-nav-dock px-3 sm:px-6 py-2 flex items-center justify-around shadow-2xl">
        {/* Item 1: Shop with Glowing Gradient Ring & Active Cyan Indicator Bar */}
        <a
          href={MYFONTS_SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center relative flex-1 group"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-indigo-600 to-fuchsia-500 shadow-[0_0_22px_rgba(236,72,153,0.9),0_0_15px_rgba(6,182,212,0.8)] group-hover:scale-105 transition-all flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#080d22] flex flex-col items-center justify-center">
              <ShoppingBag size={18} className="text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              <span className="text-[9.5px] font-mono font-bold text-white mt-0.5">Shop</span>
            </div>
          </div>
          <div className="w-7 h-[2.5px] rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] mt-1" />
        </a>

        {/* Item 2: Type Tester */}
        <button
          onClick={() => scrollToSection('type-tester')}
          className="flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white flex-1 py-1 transition-colors cursor-pointer"
        >
          <Sliders size={20} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          <span className="text-[10px] font-mono font-medium">Tester</span>
        </button>

        {/* Item 3: Fonts */}
        <button
          onClick={() => scrollToSection('catalog')}
          className="flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white flex-1 py-1 transition-colors cursor-pointer"
        >
          <Grid size={20} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          <span className="text-[10px] font-mono font-medium">{catalog.length} Fonts</span>
        </button>

        {/* Item 4: License */}
        <button
          onClick={() => openLicense()}
          className="flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white flex-1 py-1 transition-colors cursor-pointer"
        >
          <KeyRound size={20} className="text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]" />
          <span className="text-[10px] font-mono font-medium">License</span>
        </button>
      </div>

      {/* Global Footer */}
      <div className="relative z-10 pb-20 md:pb-0">
        <FoundryFooter
          onScrollToSection={scrollToSection}
          onOpenLicense={() => openLicense()}
        />
      </div>
    </div>
  );
};

export default Landing;
