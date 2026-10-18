import React, { useState, useEffect, useMemo } from 'react';
import {
  FontSummary,
  FontDetail,
  getFontDetail,
  getCachedFontDetail,
  mapTextToGlyphs,
  SAMPLE_PHRASES,
  MYFONTS_SHOP_URL,
} from '../services/fontData';
import { DemoGlyph } from './DemoGlyph';
import {
  Sliders,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ShieldCheck,
  Type,
  KeyRound,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';

interface LiveTypeTesterProps {
  catalog: FontSummary[];
  initialFontId?: string;
  onOpenLicense?: (font: FontSummary) => void;
}

const BG_THEMES = [
  { id: 'void', name: 'Deep Void', bg: 'bg-[#06080e]', text: 'text-white', border: 'border-white/10' },
  { id: 'obsidian', name: 'Obsidian Slate', bg: 'bg-[#0f1322]', text: 'text-white', border: 'border-white/10' },
  { id: 'white', name: 'Studio White', bg: 'bg-[#f8fafc]', text: 'text-slate-900', border: 'border-slate-300' },
  { id: 'paper', name: 'Warm Cream', bg: 'bg-[#f4efe7]', text: 'text-stone-900', border: 'border-stone-300' },
  { id: 'cyber', name: 'Cyber Neon', bg: 'bg-[#040813]', text: 'text-cyan-300', border: 'border-cyan-500/30' },
];

export const LiveTypeTester: React.FC<LiveTypeTesterProps> = ({
  catalog,
  initialFontId,
  onOpenLicense,
}) => {
  const [selectedFontId, setSelectedFontId] = useState<string>(
    initialFontId || (catalog[0]?.id || 'alphaxen-dragon')
  );
  const [activeFontDetail, setActiveFontDetail] = useState<FontDetail | null>(() =>
    getCachedFontDetail(initialFontId || (catalog[0]?.id || 'alphaxen-dragon'))
  );
  const [loading, setLoading] = useState<boolean>(() =>
    !getCachedFontDetail(initialFontId || (catalog[0]?.id || 'alphaxen-dragon'))
  );

  // Typer controls
  const [customText, setCustomText] = useState<string>('ALPHAXEN FOUNDRY');
  const [fontSize, setFontSize] = useState<number>(window.innerWidth < 640 ? 44 : 68);
  const [letterSpacing, setLetterSpacing] = useState<number>(4);
  const [lineHeight, setLineHeight] = useState<number>(1.2);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [bgTheme, setBgTheme] = useState<string>('void');

  // Load font detail when selected font changes
  useEffect(() => {
    let isMounted = true;
    const cached = getCachedFontDetail(selectedFontId);
    if (cached) {
      setActiveFontDetail(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    getFontDetail(selectedFontId).then((detail) => {
      if (isMounted) {
        setActiveFontDetail(detail);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedFontId]);

  // Keep selectedFontId updated if prop changes
  useEffect(() => {
    if (initialFontId && initialFontId !== selectedFontId) {
      setSelectedFontId(initialFontId);
    }
  }, [initialFontId]);

  const currentFontSummary = useMemo(() => {
    return catalog.find((f) => f.id === selectedFontId) || catalog[0];
  }, [catalog, selectedFontId]);

  const activeTheme = useMemo(() => {
    return BG_THEMES.find((t) => t.id === bgTheme) || BG_THEMES[0];
  }, [bgTheme]);

  // Split lines
  const lines = useMemo(() => {
    return customText.split('\n');
  }, [customText]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Container Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-8">
        
        {/* Left Col: Headings & Direct CTAs */}
        <div className="lg:max-w-md space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full molten-glass-panel text-purple-300 text-[10px] font-mono uppercase tracking-wider">
            <Sparkles size={12} /> Interactive Type Tester Studio
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-syne leading-[1.05]">
            Live Character <br />
            <span className="molten-chrome-title">Engine</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Type with dynamic, real-time characters extracted directly from our foundry vaults.
            Real chromatic colors, textures, and 3D lighting without exposing font binaries.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('tester-input');
                if (el) el.focus();
              }}
              className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:brightness-110 text-white shadow-lg shadow-purple-900/40 hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 border-t border-white/30"
            >
              <Sparkles size={13} /> Try It Now
            </button>
            <a
              href="#about"
              className="px-5 py-2.5 rounded-full text-xs font-bold neu-convex-btn text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              How It Works &rarr;
            </a>
          </div>
        </div>

        {/* Right Col: Pure Procedural Molten Glass Studio Console (Matching reference image) */}
        <div className="flex-1 max-w-2xl relative">
          {/* Ambient Floating Aa Glass Badge on Left Edge from frontend top part.png */}
          <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-[0_0_20px_rgba(168,85,247,0.6)] hidden md:flex items-center justify-center z-20 pointer-events-none">
            <div className="w-full h-full rounded-full bg-[#080b18] flex items-center justify-center text-white font-syne font-black text-sm">
              Aa
            </div>
          </div>

          <div className="waterbox p-6 sm:p-8">
            <div className="relative z-10 w-full">
              {/* Top Toolbar in Console: Dropdown + Matrix + Shop */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs shadow-inner">
                  Aa
                </div>
                <div className="relative flex-1">
                  <select
                    value={selectedFontId}
                    onChange={(e) => setSelectedFontId(e.target.value)}
                    className="w-full appearance-none neu-convex-btn text-white text-xs font-semibold rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:border-purple-400 cursor-pointer"
                  >
                    {catalog.map((font) => (
                      <option key={font.id} value={font.id}>
                        {font.name} ({font.category === 'chromatic' ? '3D Color' : 'Vector'})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={MYFONTS_SHOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag size={13} /> Buy
                </a>
              </div>
            </div>

            {/* Inset Text Box (Pure CSS Fluid Input) */}
            <div className="relative mb-5 pure-molten-input-wrap">
              <input
                id="tester-input"
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type your text..."
                className="w-full bg-transparent px-4 py-3 text-white text-sm focus:outline-none transition-all font-sans rounded-full"
              />
              {customText && (
                <button
                  onClick={() => setCustomText('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Slider Controls Row (Pure Molten Pill Pods) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center mb-5 text-[11px] font-mono">
              <div className="p-3 pure-molten-pill-pod">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Size</span>
                  <span className="text-white font-bold">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={130}
                  step={2}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-black/60 rounded-full appearance-none"
                />
              </div>

              <div className="p-3 pure-molten-pill-pod">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Tracking</span>
                  <span className="text-white font-bold">{letterSpacing}px</span>
                </div>
                <input
                  type="range"
                  min={-4}
                  max={28}
                  step={1}
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-black/60 rounded-full appearance-none"
                />
              </div>

              <div className="p-3 pure-molten-pill-pod">
                <span className="text-slate-400 block mb-1">Align</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAlignment('left')}
                    className={`p-1.5 rounded-lg flex-1 text-center transition-all ${
                      alignment === 'left' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <AlignLeft size={12} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => setAlignment('center')}
                    className={`p-1.5 rounded-lg flex-1 text-center transition-all ${
                      alignment === 'center' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <AlignCenter size={12} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => setAlignment('right')}
                    className={`p-1.5 rounded-lg flex-1 text-center transition-all ${
                      alignment === 'right' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <AlignRight size={12} className="mx-auto" />
                  </button>
                </div>
              </div>

              <div className="p-3 pure-molten-pill-pod">
                <span className="text-slate-400 block mb-1">Canvas</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {BG_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setBgTheme(theme.id)}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        theme.id === 'white'
                          ? 'bg-white'
                          : theme.id === 'paper'
                          ? 'bg-[#f4efe7]'
                          : theme.id === 'cyber'
                          ? 'bg-[#040813]'
                          : theme.id === 'obsidian'
                          ? 'bg-[#0f1322]'
                          : 'bg-[#06080e]'
                      } ${bgTheme === theme.id ? 'ring-2 ring-purple-400 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.7)]' : 'border-white/20'}`}
                      title={theme.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Word Tags & Generate Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                {['ALPHAXEN', 'FOUNDRY', 'CHROMATIC', 'DRAGON'].map((word) => (
                  <button
                    key={word}
                    onClick={() => setCustomText(word)}
                    className="text-[10px] font-mono px-3 py-1.5 rounded-lg neu-convex-btn text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                  >
                    {word}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const phrases = ['MOLTEN MAGMA', 'PHOTOREALISTIC', 'CHROMATIC DIMENSION', 'CYBER FUTURE', 'SCULPTED LETTERS'];
                  const rand = phrases[Math.floor(Math.random() * phrases.length)];
                  setCustomText(rand);
                }}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                <Sparkles size={13} /> Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Interactive Render Stage with Selected Molten Glass Architecture */}
      <div
        className={`w-full min-h-[340px] mt-8 waterbox p-6 sm:p-14 flex flex-col justify-center relative overflow-hidden shadow-2xl ${activeTheme.bg} ${activeTheme.text}`}
      >
        <div className="relative z-10 w-full flex flex-col justify-center">
          {/* Subtle background branding watermark */}
        <div className="absolute bottom-4 right-6 pointer-events-none select-none opacity-25 text-[11px] font-mono uppercase tracking-widest hidden sm:block">
          {currentFontSummary?.name} &bull; {currentFontSummary?.subCategory}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono uppercase tracking-widest">Compiling demo glyph matrix...</span>
          </div>
        ) : !activeFontDetail ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Failed to load demo glyphs for this typeface.
          </div>
        ) : (
          <div
            className={`w-full flex flex-col gap-3 overflow-x-auto py-6 custom-scrollbar`}
            style={{
              textAlign: alignment,
            }}
          >
            {lines.map((lineText, lineIdx) => {
              const glyphs = mapTextToGlyphs(lineText, activeFontDetail);

              if (glyphs.length === 0) {
                return (
                  <div key={lineIdx} style={{ height: `${fontSize * 0.5}px` }}>
                    &nbsp;
                  </div>
                );
              }

              return (
                <div
                  key={lineIdx}
                  className="inline-block whitespace-nowrap px-2"
                  style={{
                    lineHeight: lineHeight,
                  }}
                >
                  {glyphs.map((g, gIdx) => (
                    <span
                      key={`${lineIdx}-${gIdx}-${g.code}`}
                      style={{
                        marginRight: `${letterSpacing}px`,
                      }}
                      className="inline-block transition-transform hover:scale-110 filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.65)]"
                      title={`${g.char} (U+${g.code.toString(16).toUpperCase().padStart(4, '0')})`}
                    >
                      <DemoGlyph
                        glyph={g}
                        size={fontSize}
                        unitsPerEm={activeFontDetail.unitsPerEm}
                        color={activeTheme.id === 'white' || activeTheme.id === 'paper' ? '#0f172a' : '#f8fafc'}
                      />
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* Security telemetry bar */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono gap-2">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck size={14} />
            <span>Zero Binary Exposure &bull; Protected Asset Vault</span>
          </div>
          <div>
            <span>Format: OpenType-SVG Chromatic Multi-Color</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
