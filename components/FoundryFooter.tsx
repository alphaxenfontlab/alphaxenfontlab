import React from 'react';
import { ShieldCheck, Heart, Sparkles, Terminal, ShoppingBag, ExternalLink } from 'lucide-react';
import { MYFONTS_SHOP_URL } from '../services/fontData';

interface FoundryFooterProps {
  onScrollToSection?: (sectionId: string) => void;
  onOpenLicense?: () => void;
}

export const FoundryFooter: React.FC<FoundryFooterProps> = ({
  onScrollToSection,
  onOpenLicense,
}) => {
  return (
    <footer className="border-t border-white/10 bg-[#06080e] text-slate-400 py-16 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Studio */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-amber-400 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
              <img
                src="/logo.png"
                alt="Alphaxen Type Foundry"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>
            <div>
              <span className="text-base font-black text-white font-syne tracking-tight block">
                ALPHAXEN TYPE FOUNDRY
              </span>
              <p className="text-[10px] text-purple-400 font-mono uppercase tracking-widest">
                Chromatic &amp; 3D Typography Studio
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Alphaxen is an independent digital type foundry sculpting high-end display typography,
            photorealistic materials, and next-generation chromatic OpenType font suites.
            Sculpted with passion for visionary art directors, brand designers, and creative technologists.
          </p>

          <div className="p-3.5 pure-molten-pill-pod text-[11px] text-slate-300 flex items-center gap-2.5 max-w-md">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>
              <strong>Zero-Leak Architecture:</strong> Proprietary font files are completely isolated and never exposed in the client repository.
              Interactive web previews utilize authentic isolated demo glyphs with true colors and textures.
            </span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href={MYFONTS_SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
              >
                <ShoppingBag size={13} /> Official MyFonts Store &nearr;
              </a>
            </li>
            <li>
              <a href="#catalog" className="hover:text-purple-400 transition-colors">
                Typeface Catalog (22)
              </a>
            </li>
            <li>
              <a href="#type-tester" className="hover:text-purple-400 transition-colors">
                Interactive Type Tester
              </a>
            </li>
            <li>
              <a href="#specimen" className="hover:text-purple-400 transition-colors">
                Specimen Waterfalls
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-purple-400 transition-colors">
                Foundry Story
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Legal & Security */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
            Technology &amp; Security
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="text-slate-400">OpenType-SVG &amp; sbix Multi-Color</li>
            <li className="text-slate-400">Photorealistic Texture Synthesis</li>
            <li className="text-slate-400">Hardware DRM Protected Vault</li>
            <li className="text-slate-400">Commercial EULA Agreements</li>
            <li>
              <a
                href={MYFONTS_SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
              >
                <ShoppingBag size={12} /> Purchase Licenses on MyFonts
              </a>
            </li>
            <li className="pt-1">
              <button
                onClick={onOpenLicense}
                className="text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer"
              >
                Request Custom Enterprise License &rarr;
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar matching Image 2 with quote and social icon pills */}
      <div className="max-w-7xl mx-auto pt-8 mt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-6">
        
        {/* Left: Brand Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-bold text-white">Alphaxen Font Lab</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Independent, Type Foundry</span>
        </div>

        {/* Center: Quote from frontend top part.png */}
        <div className="text-center md:text-left text-[11px] text-slate-400 italic">
          &ldquo;Typography is not just communication. It&rsquo;s a form of visual art.&rdquo;
          <span className="text-purple-400 not-italic font-bold ml-1.5">&mdash; Abdullaha Forhad</span>
        </div>

        {/* Right: Social Platform Links */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.behance.net"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full neu-convex-btn flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs font-bold"
            title="Behance"
          >
            Bē
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full neu-convex-btn flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs"
            title="Instagram"
          >
            ig
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full neu-convex-btn flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs font-bold"
            title="X (Twitter)"
          >
            𝕏
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full neu-convex-btn flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs font-bold"
            title="Facebook"
          >
            f
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full neu-convex-btn flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs font-bold"
            title="YouTube"
          >
            yt
          </a>
          <a
            href="https://www.myfonts.com/collections/alphaxen-font-lab-foundry"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white flex items-center justify-center transition-all text-xs font-bold shadow-md hover:scale-110"
            title="MyFonts Store"
          >
            <ShoppingBag size={13} />
          </a>
        </div>

      </div>
    </footer>
  );
};
