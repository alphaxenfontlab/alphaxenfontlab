/**
 * Alphaxen Type Foundry - Real Font Data Service
 * Exclusively provides demo characters and metadata from "all fonts/".
 * Proprietary .otf binaries are NEVER linked or served.
 */

export const MYFONTS_SHOP_URL = "https://www.myfonts.com/collections/alphaxen-font-lab-foundry";

export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const cleanPath = path.replace(/^\.?\//, '');
  let base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '';
  if (!base || base === './' || base === '.') {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/alphaxenfontlab')) {
      base = '/alphaxenfontlab/';
    } else {
      base = '/';
    }
  }
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
};

export interface GlyphItem {
  code: number;
  char: string;
  name: string;
  type: 'image' | 'vector' | 'space';
  src?: string;
  path?: string;
  advance: number;
  lsb: number;
}

export interface FontSummary {
  id: string;
  name: string;
  category: 'chromatic' | 'vector';
  subCategory: string;
  theme: string;
  accent: string;
  badge: string;
  description: string;
  specimenWords: string[];
  designer: string;
  releaseYear: number;
  unitsPerEm: number;
  glyphCount: number;
  sampleChars: string[];
  spaceAdvance: number;
  previewGlyphs: GlyphItem[];
}

export interface FontDetail extends FontSummary {
  glyphs: Record<string, GlyphItem>;
}

// Memory caches
let cachedCatalog: FontSummary[] | null = null;
const cachedFontDetails: Record<string, FontDetail> = {};

/**
 * Loads the master catalog of all 22 real fonts
 */
export async function getFoundryCatalog(): Promise<FontSummary[]> {
  if (cachedCatalog) return cachedCatalog;

  try {
    const url = getAssetUrl('foundry_data/catalog.json');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data: FontSummary[] = await res.json();
    cachedCatalog = data;
    return data;
  } catch (err) {
    console.error('Failed to fetch catalog.json:', err);
    return [];
  }
}

/**
 * Returns cached font detail synchronously if already loaded in memory
 */
export function getCachedFontDetail(fontId: string): FontDetail | null {
  return cachedFontDetails[fontId] || null;
}

/**
 * Loads the complete glyph dictionary for a specific font
 */
export async function getFontDetail(fontId: string): Promise<FontDetail | null> {
  if (cachedFontDetails[fontId]) {
    return cachedFontDetails[fontId];
  }

  try {
    const url = getAssetUrl(`foundry_data/${fontId}.json`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data: FontDetail = await res.json();
    cachedFontDetails[fontId] = data;
    return data;
  } catch (err) {
    console.error(`Failed to fetch font detail for ${fontId}:`, err);
    return null;
  }
}

/**
 * Maps an input string to an array of glyph items for real-character rendering
 */
export function mapTextToGlyphs(text: string, fontDetail: FontDetail): GlyphItem[] {
  const glyphs = fontDetail.glyphs;
  const result: GlyphItem[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    // 1. Direct match
    if (glyphs[String(code)]) {
      result.push(glyphs[String(code)]);
      continue;
    }

    // 2. Space fallback
    if (char === ' ') {
      result.push({
        code: 32,
        char: ' ',
        name: 'space',
        type: 'space',
        advance: fontDetail.spaceAdvance || 400,
        lsb: 0,
      });
      continue;
    }

    // 3. Lowercase -> Uppercase fallback (many chromatic fonts are uppercase-titling only)
    const upperChar = char.toUpperCase();
    const upperCode = upperChar.charCodeAt(0);
    if (glyphs[String(upperCode)]) {
      result.push(glyphs[String(upperCode)]);
      continue;
    }

    // 4. Uppercase -> Lowercase fallback
    const lowerChar = char.toLowerCase();
    const lowerCode = lowerChar.charCodeAt(0);
    if (glyphs[String(lowerCode)]) {
      result.push(glyphs[String(lowerCode)]);
      continue;
    }

    // 5. If missing, provide fallback vector/text glyph
    result.push({
      code,
      char,
      name: `char_${code}`,
      type: 'space',
      advance: 500,
      lsb: 0,
    });
  }

  return result;
}

/**
 * Preset Pangrams and phrases for typography demonstration
 */
export const SAMPLE_PHRASES = [
  'ALPHAXEN FOUNDRY',
  'CHROMATIC LUXURY',
  'SYNTHESIS 2026',
  'COSMIC HORIZON',
  'VOLCANIC DEPTHS',
  'THE QUICK BROWN FOX',
  'JUMPS OVER LAZY DOG',
  'HAUTE COUTURE',
  'WYVERN & DRAGON',
  '0123456789',
];

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Typefaces' },
  { id: 'chromatic', label: 'Chromatic 3D' },
  { id: 'vector', label: 'Precision Vector' },
  { id: 'fantasy', label: 'Fantasy & Mythic' },
  { id: 'scifi', label: 'Sci-Fi & Cyber' },
  { id: 'oceanic', label: 'Oceanic & Polar' },
  { id: 'organic', label: 'Organic & Fluid' },
  { id: 'luxury', label: 'Luxury & Regal' },
];
