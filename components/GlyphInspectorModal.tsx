import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FontSummary,
  FontDetail,
  getFontDetail,
  getCachedFontDetail,
  GlyphItem,
  MYFONTS_SHOP_URL,
} from '../services/fontData';
import { DemoGlyph } from './DemoGlyph';
import {
  X,
  Search,
  Maximize2,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Sliders,
  Type,
  ShieldAlert,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Layers,
} from 'lucide-react';

interface GlyphInspectorModalProps {
  fontId: string | null;
  catalog: FontSummary[];
  onClose: () => void;
  onSelectFontForTester?: (fontId: string) => void;
}

type BackdropTheme = 'dark' | 'navy' | 'light' | 'caustic';

export const GlyphInspectorModal: React.FC<GlyphInspectorModalProps> = ({
  fontId,
  catalog,
  onClose,
  onSelectFontForTester,
}) => {
  const [activeFontId, setActiveFontId] = useState<string>(fontId || catalog[0]?.id || 'alphaxen-dragon');
  const [fontDetail, setFontDetail] = useState<FontDetail | null>(() => getCachedFontDetail(activeFontId));
  const [loading, setLoading] = useState<boolean>(!getCachedFontDetail(activeFontId));

  // Filters & State
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'upper' | 'lower' | 'nums' | 'symbols'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedGlyph, setInspectedGlyph] = useState<GlyphItem | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedHex, setCopiedHex] = useState<boolean>(false);

  // Showcase controls
  const [macroZoom, setMacroZoom] = useState<number>(140);
  const [backdrop, setBackdrop] = useState<BackdropTheme>('dark');

  // Active font summary from catalog (synchronous, 0 delay)
  const currentSummary = useMemo(() => {
    return catalog.find((f) => f.id === activeFontId) || catalog[0] || null;
  }, [catalog, activeFontId]);

  // Sync fontId prop changes
  useEffect(() => {
    if (fontId && fontId !== activeFontId) {
      setActiveFontId(fontId);
    }
  }, [fontId]);

  // Load font details with instant cache hit
  useEffect(() => {
    let isMounted = true;
    const cached = getCachedFontDetail(activeFontId);

    if (cached) {
      setFontDetail(cached);
      setLoading(false);
      const glyphs = Object.values(cached.glyphs || {}).filter((g) => g.code !== 32);
      const defaultGlyph = cached.glyphs?.['65'] || glyphs[0] || null;
      setInspectedGlyph(defaultGlyph);
      return;
    }

    setLoading(true);
    getFontDetail(activeFontId).then((data) => {
      if (isMounted) {
        setFontDetail(data);
        setLoading(false);
        if (data && data.glyphs) {
          const glyphs = Object.values(data.glyphs).filter((g) => g.code !== 32);
          const defaultGlyph = data.glyphs['65'] || glyphs[0] || null;
          setInspectedGlyph(defaultGlyph);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeFontId]);

  // Master list of glyphs
  const allGlyphsList = useMemo(() => {
    if (!fontDetail || !fontDetail.glyphs) return [];
    return Object.values(fontDetail.glyphs).filter((g) => g.code !== 32);
  }, [fontDetail]);

  // Category counts
  const categoryCounts = useMemo(() => {
    let upper = 0;
    let lower = 0;
    let nums = 0;
    let symbols = 0;

    allGlyphsList.forEach((g) => {
      if (g.code >= 65 && g.code <= 90) upper++;
      else if (g.code >= 97 && g.code <= 122) lower++;
      else if (g.code >= 48 && g.code <= 57) nums++;
      else symbols++;
    });

    return {
      all: allGlyphsList.length,
      upper,
      lower,
      nums,
      symbols,
    };
  }, [allGlyphsList]);

  // Filtered glyph list
  const filteredGlyphs = useMemo(() => {
    return allGlyphsList.filter((g) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesChar = g.char.toLowerCase().includes(q);
        const matchesName = g.name.toLowerCase().includes(q);
        const hex = `u+${g.code.toString(16).toLowerCase()}`;
        const hexPadded = `u+${g.code.toString(16).padStart(4, '0').toLowerCase()}`;
        if (!matchesChar && !matchesName && !hex.includes(q) && !hexPadded.includes(q)) return false;
      }

      // Category filter
      if (categoryFilter === 'upper') {
        return g.code >= 65 && g.code <= 90;
      }
      if (categoryFilter === 'lower') {
        return g.code >= 97 && g.code <= 122;
      }
      if (categoryFilter === 'nums') {
        return g.code >= 48 && g.code <= 57;
      }
      if (categoryFilter === 'symbols') {
        const isLetter = (g.code >= 65 && g.code <= 90) || (g.code >= 97 && g.code <= 122);
        const isNum = g.code >= 48 && g.code <= 57;
        return !isLetter && !isNum;
      }

      return true;
    });
  }, [allGlyphsList, categoryFilter, searchQuery]);

  // Keep inspected glyph in sync with active filtered list
  useEffect(() => {
    if (filteredGlyphs.length > 0) {
      const isSelectedInList = inspectedGlyph && filteredGlyphs.some((g) => g.code === inspectedGlyph.code);
      if (!isSelectedInList) {
        setInspectedGlyph(filteredGlyphs[0]);
      }
    } else {
      setInspectedGlyph(null);
    }
  }, [filteredGlyphs]);

  // Arrow navigation
  const currentIndex = useMemo(() => {
    if (!inspectedGlyph) return -1;
    return filteredGlyphs.findIndex((g) => g.code === inspectedGlyph.code);
  }, [filteredGlyphs, inspectedGlyph]);

  const selectPrevGlyph = useCallback(() => {
    if (filteredGlyphs.length === 0) return;
    const nextIdx = currentIndex <= 0 ? filteredGlyphs.length - 1 : currentIndex - 1;
    setInspectedGlyph(filteredGlyphs[nextIdx]);
  }, [filteredGlyphs, currentIndex]);

  const selectNextGlyph = useCallback(() => {
    if (filteredGlyphs.length === 0) return;
    const nextIdx = currentIndex >= filteredGlyphs.length - 1 ? 0 : currentIndex + 1;
    setInspectedGlyph(filteredGlyphs[nextIdx]);
  }, [filteredGlyphs, currentIndex]);

  // Keyboard navigation & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        selectPrevGlyph();
      } else if (e.key === 'ArrowRight') {
        selectNextGlyph();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectPrevGlyph, selectNextGlyph]);

  const handleCopyChar = (char: string) => {
    navigator.clipboard.writeText(char);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHex = (code: number) => {
    const hex = `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
    navigator.clipboard.writeText(hex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  if (!fontId) return null;

  const fontAccent = currentSummary?.accent || '#a855f7';

  // Backdrop container styles for showcase chamber
  const chamberThemeClasses = {
    dark: 'bg-[#080912] text-white',
    navy: 'bg-gradient-to-br from-[#0c1228] to-[#060815] text-white',
    light: 'bg-[#f1f5f9] text-slate-900',
    caustic: 'bg-gradient-to-br from-purple-950/40 via-[#070914] to-cyan-950/40 text-white',
  }[backdrop];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Stable, High-Precision Liquid Glass Inspector Window */}
      <div
        className="relative w-full max-w-6xl my-auto bg-[#090c18]/95 border border-white/20 border-t-2 border-t-white/80 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.95),0_0_60px_rgba(168,85,247,0.35)] backdrop-blur-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{
          boxShadow: `0 35px 100px -10px rgba(0,0,0,0.98), 0 0 50px ${fontAccent}35, inset 0 2px 4px rgba(255,255,255,0.4)`,
        }}
      >
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-8 py-4 border-b border-white/10 bg-[#0d1020]/90">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner"
              style={{
                backgroundColor: `${fontAccent}25`,
                borderColor: `${fontAccent}50`,
                color: fontAccent,
                borderWidth: '1.5px',
              }}
            >
              <Type size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight font-syne">
                  {currentSummary?.name || 'Loading Typeface...'}
                </h3>
                <span
                  className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase"
                  style={{
                    backgroundColor: `${fontAccent}20`,
                    borderColor: `${fontAccent}50`,
                    color: fontAccent,
                    borderWidth: '1px',
                  }}
                >
                  {currentSummary?.badge || 'VAULT SPECIMEN'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {currentSummary?.glyphCount || 0} Demo Characters &bull;{' '}
                <span className="text-slate-300 font-medium">{currentSummary?.subCategory}</span> &bull; 100% Authentic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Switch Font Dropdown */}
            <select
              value={activeFontId}
              onChange={(e) => setActiveFontId(e.target.value)}
              className="neu-convex-btn text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-purple-400 cursor-pointer"
            >
              {catalog.map((f) => (
                <option key={f.id} value={f.id} className="bg-[#0b0e1b] text-white">
                  {f.name} ({f.category === 'chromatic' ? '3D' : 'Vector'})
                </option>
              ))}
            </select>

            {onSelectFontForTester && (
              <button
                onClick={() => {
                  onSelectFontForTester(activeFontId);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold neu-convex-btn text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sliders size={13} className="text-purple-400" /> Test in Studio
              </button>
            )}

            <a
              href={MYFONTS_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white transition-all cursor-pointer shadow flex items-center gap-1.5 hover:scale-105"
              title="Shop Alphaxen Typefaces on MyFonts"
            >
              <ShoppingBag size={13} /> Shop
            </a>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Foundry Asset Protection Confirmation Notice */}
        <div className="px-5 sm:px-8 py-2.5 bg-gradient-to-r from-purple-950/50 via-[#0d1226]/80 to-cyan-950/40 border-b border-purple-500/20 flex items-center gap-2.5 text-[11px] font-mono text-purple-200">
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          <span className="leading-snug">
            <strong className="text-white uppercase tracking-wider font-bold">Asset Protection Notice:</strong> Online demo glyphs are curated preview specimens with intentional variations to safeguard our proprietary foundry intellectual property. Full pristine commercial glyph matrices are delivered exclusively with official licenses on MyFonts.
          </span>
        </div>

        {/* Filter Pills Bar & Search Row */}
        <div className="px-5 sm:px-8 py-3 border-b border-white/10 bg-[#080b16]/90 flex flex-wrap items-center justify-between gap-3">
          {/* Categories with Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar">
            {[
              { id: 'all', label: 'All Glyphs', count: categoryCounts.all },
              { id: 'upper', label: 'Uppercase', count: categoryCounts.upper },
              { id: 'lower', label: 'Lowercase', count: categoryCounts.lower },
              { id: 'nums', label: 'Numerals', count: categoryCounts.nums },
              { id: 'symbols', label: 'Symbols', count: categoryCounts.symbols },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  categoryFilter === cat.id
                    ? 'neu-convex-btn text-white font-bold border-purple-400 shadow-md scale-102'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    categoryFilter === cat.id ? 'bg-purple-500/30 text-purple-200' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box with Clear Button */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter character or unicode..."
              className="w-full neu-inset-well rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs w-4 h-4 flex items-center justify-center rounded-full bg-white/10"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Modal Main Content: Split Grid & Macro Showcase */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* Left Column (7 Cols on desktop): Character Matrix Grid */}
          <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto max-h-[50vh] lg:max-h-[64vh] custom-scrollbar border-b lg:border-b-0 lg:border-r border-white/10 bg-[#070913]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-72 gap-3 text-slate-400">
                <div
                  className="w-9 h-9 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: fontAccent, borderTopColor: 'transparent' }}
                />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
                  Compiling character matrix for {currentSummary?.name}...
                </span>
              </div>
            ) : filteredGlyphs.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-sm space-y-2">
                <p>No glyphs matched the current search or category filter.</p>
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 underline font-mono"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                {filteredGlyphs.map((glyph) => {
                  const isSelected = inspectedGlyph?.code === glyph.code;
                  return (
                    <button
                      key={glyph.code}
                      onClick={() => setInspectedGlyph(glyph)}
                      className={`h-20 rounded-2xl flex flex-col items-center justify-center p-1.5 transition-all relative group cursor-pointer ${
                        isSelected
                          ? 'neu-convex-btn shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-105'
                          : 'bg-[#0e1222] hover:bg-[#161d36] border border-white/10 hover:border-white/30'
                      }`}
                      style={{
                        borderColor: isSelected ? fontAccent : undefined,
                        borderWidth: isSelected ? '2px' : '1px',
                      }}
                      title={`${glyph.char} (U+${glyph.code.toString(16).toUpperCase().padStart(4, '0')})`}
                    >
                      <div className="flex-1 flex items-center justify-center overflow-hidden w-full px-1">
                        <DemoGlyph
                          glyph={glyph}
                          size={38}
                          unitsPerEm={fontDetail?.unitsPerEm}
                          color="#f8fafc"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-white mt-0.5">
                        {glyph.char}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column (5 Cols on desktop): Macro Zoom Inspection Showcase */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-[#0b0e1e] flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-[64vh] custom-scrollbar space-y-5">
            {inspectedGlyph ? (
              <div className="space-y-4">
                
                {/* Showcase Top Row: Title + Prev/Next Controls */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider block font-bold" style={{ color: fontAccent }}>
                      MACRO SHOWCASE &bull; {currentSummary?.theme}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-white font-syne leading-tight">
                      Glyph &ldquo;{inspectedGlyph.char}&rdquo;
                    </h4>
                  </div>

                  {/* Quick Prev / Next Navigation */}
                  <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={selectPrevGlyph}
                      className="w-7 h-7 rounded-lg neu-convex-btn flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Previous Glyph (Left Arrow)"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400 px-1">
                      {currentIndex + 1}/{filteredGlyphs.length}
                    </span>
                    <button
                      onClick={selectNextGlyph}
                      className="w-7 h-7 rounded-lg neu-convex-btn flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Next Glyph (Right Arrow)"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Big Preview Chamber with Dynamic Backdrop & Zoom */}
                <div
                  className={`w-full h-48 sm:h-56 rounded-2xl neu-inset-well flex items-center justify-center p-6 relative overflow-hidden shadow-inner group transition-colors duration-300 ${chamberThemeClasses}`}
                  style={{
                    borderColor: `${fontAccent}30`,
                  }}
                >
                  <DemoGlyph
                    glyph={inspectedGlyph}
                    size={macroZoom}
                    unitsPerEm={fontDetail?.unitsPerEm}
                    color={backdrop === 'light' ? '#0f172a' : '#f8fafc'}
                    className="transform transition-transform group-hover:scale-105 duration-300 filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
                  />

                  {/* Format Tag & Dimension Indicator */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/50 text-slate-300 border border-white/10 backdrop-blur-md">
                      {macroZoom}px
                    </span>
                    <span
                      className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase backdrop-blur-md"
                      style={{
                        backgroundColor: `${fontAccent}30`,
                        color: fontAccent,
                        borderColor: `${fontAccent}50`,
                        borderWidth: '1px',
                      }}
                    >
                      {inspectedGlyph.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Interactive Showcase Controls: Zoom Slider + Backdrop Modes */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <ZoomIn size={13} style={{ color: fontAccent }} /> Optical Zoom:
                    </span>
                    <span className="text-white font-bold">{macroZoom}px</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMacroZoom(90)}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white"
                    >
                      Small
                    </button>
                    <input
                      type="range"
                      min={80}
                      max={220}
                      step={5}
                      value={macroZoom}
                      onChange={(e) => setMacroZoom(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer h-1.5 bg-black/60 rounded-full appearance-none"
                    />
                    <button
                      onClick={() => setMacroZoom(180)}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white"
                    >
                      Macro
                    </button>
                  </div>

                  {/* Backdrop Selector Row */}
                  <div className="pt-1.5 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Layers size={11} /> Chamber Mode:
                    </span>
                    <div className="flex items-center gap-1">
                      {[
                        { id: 'dark', label: 'Dark', title: 'Obsidian Night' },
                        { id: 'navy', label: 'Navy', title: 'Deep Twilight' },
                        { id: 'caustic', label: 'Fluid', title: 'Liquid Caustic Glow' },
                        { id: 'light', label: 'Light', title: 'Studio High Contrast' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setBackdrop(t.id as BackdropTheme)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-lg transition-all ${
                            backdrop === t.id
                              ? 'bg-purple-600 text-white font-bold shadow'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                          title={t.title}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 text-[10px] block uppercase">Unicode Hex</span>
                    <span className="text-white font-bold text-xs sm:text-sm">
                      U+{inspectedGlyph.code.toString(16).toUpperCase().padStart(4, '0')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 text-[10px] block uppercase">Decimal Code</span>
                    <span className="text-white font-bold text-xs sm:text-sm">{inspectedGlyph.code}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 text-[10px] block uppercase">Advance Width</span>
                    <span className="text-white font-bold text-xs sm:text-sm">{inspectedGlyph.advance} units</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 text-[10px] block uppercase">Side Bearing</span>
                    <span className="text-white font-bold text-xs sm:text-sm">{inspectedGlyph.lsb} units</span>
                  </div>
                </div>

                {/* Quick Copy Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyChar(inspectedGlyph.char)}
                    className="flex-1 py-2.5 rounded-xl neu-convex-btn text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-purple-400"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copied ? 'Copied Character' : 'Copy Character'}
                  </button>

                  <button
                    onClick={() => handleCopyHex(inspectedGlyph.code)}
                    className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Copy Unicode Hex format"
                  >
                    {copiedHex ? <Check size={14} className="text-emerald-400" /> : <Sparkles size={13} />}
                    {copiedHex ? 'Copied' : 'Hex'}
                  </button>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs font-mono py-12">
                Select a character from the matrix to inspect its macro texture.
              </div>
            )}

            {/* Bottom Security Note */}
            <div className="pt-3 border-t border-white/10 text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldAlert size={12} className="text-purple-400 shrink-0" />
                <span>Extracted Demo &bull; DRM Active</span>
              </div>
              <span className="text-slate-500">Keys: &larr; &rarr; Esc</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
