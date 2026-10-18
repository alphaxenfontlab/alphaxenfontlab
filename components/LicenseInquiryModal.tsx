import React, { useState } from 'react';
import { FontSummary } from '../services/fontData';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Send,
  Building,
  Mail,
  User,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LicenseInquiryModalProps {
  initialFont?: FontSummary | null;
  catalog: FontSummary[];
  onClose: () => void;
}

const LICENSE_TIERS = [
  {
    id: 'desktop',
    title: 'Desktop & Print License',
    desc: 'Print design, editorial publishing, brand marks, packaging, and commercial merchandising.',
    recommended: 'Agencies & Studios',
  },
  {
    id: 'web',
    title: 'Web & Digital License',
    desc: 'Commercial web domains, cloud UI applications, and high-traffic interactive web experiences.',
    recommended: 'Web Startups & Platforms',
  },
  {
    id: 'app',
    title: 'App & Game Embedding',
    desc: 'Direct binary embedding in iOS, Android, macOS, Windows apps, and Unreal/Unity video games.',
    recommended: 'Game & App Developers',
  },
  {
    id: 'broadcast',
    title: 'Broadcast & Film Rights',
    desc: 'Cinema releases, television titling, streaming platforms (Netflix, HBO), and theatrical trailers.',
    recommended: 'Production Houses',
  },
  {
    id: 'enterprise',
    title: 'Unlimited Enterprise License',
    desc: 'Full perpetual global rights covering unlimited desktop workstations, websites, apps, and affiliates.',
    recommended: 'Global Brands',
  },
  {
    id: 'custom',
    title: 'Bespoke Custom Font Commission',
    desc: 'Commission Alphaxen to sculpt custom chromatic textures, extra language glyphs, or bespoke typefaces.',
    recommended: 'Exclusive Commissions',
  },
];

export const LicenseInquiryModal: React.FC<LicenseInquiryModalProps> = ({
  initialFont,
  catalog,
  onClose,
}) => {
  const [selectedFontId, setSelectedFontId] = useState<string>(
    initialFont?.id || (catalog[0]?.id || 'alphaxen-dragon')
  );
  const [selectedTier, setSelectedTier] = useState<string>('desktop');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const selectedFont = catalog.find((f) => f.id === selectedFontId) || initialFont || catalog[0];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Save inquiry to localStorage
    const inquiry = {
      fontId: selectedFontId,
      fontName: selectedFont?.name,
      tier: selectedTier,
      fullName,
      email,
      company,
      notes,
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('alphaxen_inquiries') || '[]');
    existing.push(inquiry);
    localStorage.setItem('alphaxen_inquiries', JSON.stringify(existing));

    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl my-auto bg-[#090c18]/95 border border-white/20 border-t-2 border-t-white/80 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.95),0_0_60px_rgba(168,85,247,0.35)] backdrop-blur-2xl overflow-hidden p-6 sm:p-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-10"
          title="Close (Esc)"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-black text-white font-syne">
              Licensing Inquiry Received
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-white font-semibold">{fullName || 'Client'}</span>.
              Our foundry representatives will review your request for{' '}
              <span className="text-purple-300 font-semibold">{selectedFont?.name}</span> and dispatch license terms to{' '}
              <span className="text-white font-semibold">{email}</span> within 24 hours.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-lg cursor-pointer"
              >
                Return to Foundry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full molten-glass-panel text-purple-300 text-xs font-mono uppercase tracking-wider mb-2">
                <ShieldCheck size={13} /> Commercial Licensing &amp; Commissions
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-syne">
                Acquire Font License
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Direct commercial deployment agreements from Alphaxen Type Foundry.
              </p>
            </div>

            {/* Select Font */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Typeface of Interest
              </label>
              <select
                value={selectedFontId}
                onChange={(e) => setSelectedFontId(e.target.value)}
                className="w-full neu-convex-btn rounded-2xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {catalog.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name} &mdash; {font.subCategory}
                  </option>
                ))}
              </select>
            </div>

            {/* License Tier Selection */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Select License Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto custom-scrollbar p-1">
                {LICENSE_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                      selectedTier === tier.id
                        ? 'neu-convex-btn border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{tier.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                        {tier.recommended}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Full Name / Contact
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Elias Vance"
                    className="w-full neu-inset-well rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Corporate / Client Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full neu-inset-well rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Company / Brand Name
                </label>
                <div className="relative">
                  <Building size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Studio or Organization"
                    className="w-full neu-inset-well rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Project Scope / Timeline
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Worldwide branding campaign, launch Q3"
                  className="w-full neu-inset-well rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                Official EULA &bull; Confidential &bull; Fast Delivery
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 cursor-pointer border-t border-white/20"
              >
                <Send size={14} /> Send Licensing Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
