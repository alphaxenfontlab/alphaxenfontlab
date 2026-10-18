import React, { useState } from 'react';
import { GlyphItem, getAssetUrl } from '../services/fontData';

interface DemoGlyphProps {
  glyph: GlyphItem;
  size?: number; // Size in pixels
  unitsPerEm?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string; // For vector glyphs
}

export const DemoGlyph: React.FC<DemoGlyphProps> = React.memo(({
  glyph,
  size = 48,
  unitsPerEm = 1000,
  className = '',
  style = {},
  color = 'currentColor',
}) => {
  const [imgError, setImgError] = useState(false);

  if (glyph.type === 'space') {
    const spaceWidth = (glyph.advance / unitsPerEm) * size;
    return (
      <span
        className={`inline-block select-none pointer-events-none ${className}`}
        style={{
          width: `${Math.max(8, spaceWidth)}px`,
          height: `${size}px`,
          ...style,
        }}
        aria-hidden="true"
      >
        &nbsp;
      </span>
    );
  }

  if (glyph.type === 'image' && glyph.src && !imgError) {
    const resolvedSrc = getAssetUrl(glyph.src);
    return (
      <img
        src={resolvedSrc}
        alt={glyph.char}
        className={`inline-block select-none pointer-events-none transition-transform ${className}`}
        style={{
          height: `${size}px`,
          width: 'auto',
          maxWidth: 'none',
          verticalAlign: 'baseline',
          objectFit: 'contain',
          ...style,
        }}
        draggable={false}
        decoding="async"
        onError={() => setImgError(true)}
      />
    );
  }

  if (glyph.type === 'vector' && glyph.path) {
    const width = (glyph.advance / unitsPerEm) * size;
    return (
      <svg
        viewBox={`0 0 ${glyph.advance} ${unitsPerEm}`}
        className={`inline-block select-none ${className}`}
        style={{
          height: `${size}px`,
          width: `${width}px`,
          verticalAlign: 'baseline',
          color: color,
          ...style,
        }}
        aria-hidden="true"
      >
        <path d={glyph.path} fill="currentColor" />
      </svg>
    );
  }

  // Fallback for missing glyph representation
  return (
    <span
      className={`inline-flex items-center justify-center font-syne font-black text-white/90 select-none ${className}`}
      style={{
        height: `${size}px`,
        fontSize: `${size * 0.72}px`,
        minWidth: `${size * 0.5}px`,
        lineHeight: 1,
        ...style,
      }}
    >
      {glyph.char}
    </span>
  );
});
