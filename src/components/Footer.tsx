import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Send } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigateView?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateView }) => {
  const { isRtl } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.subscribeNewsletter(email);
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    }
  };

  const nav = (v: string) => {
    if (onNavigateView) {
      onNavigateView(v);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1F1127] text-[#F5EFE6] pt-16 sm:pt-20 pb-12 border-t-2 border-[#1F1127] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Headline Bar */}
        <div className="pb-12 border-b-2 border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight lowercase">
                toomakt
              </span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF5E2B] border border-white" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#F5EFE6]/70 max-w-md">
              {isRtl
                ? 'أنظمة طقس صغيرة من الفاكهة الطبيعية تصنع يدوياً في القاهرة.'
                : 'Little fruit weather systems handmade in small batches in Cairo, Egypt.'}
            </p>
          </div>

          {/* Newsletter Input Box */}
          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="inline-flex items-center gap-2 bg-[#C4E86E] text-[#1F1127] px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#1F1127]">
                <Check className="w-4 h-4" />
                <span>{isRtl ? 'تم الاشتراك بنجاح! كود الخصم: JOY10' : 'YOU ARE ON THE FORECAST LIST! CODE: JOY10'}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your email..."
                  required
                  className="w-full sm:w-64 bg-[#FFFDF5] text-[#1F1127] placeholder-[#1F1127]/50 text-xs px-4 py-3 rounded-full border-2 border-[#1F1127] focus:outline-none focus:bg-[#FFE842]/40 font-bold"
                />
                <button
                  type="submit"
                  className="btn-neo bg-[#FFE842] text-[#1F1127] px-6 py-3 text-xs font-black uppercase tracking-wider hover:bg-[#FF5E2B] hover:text-white cursor-pointer"
                >
                  JOIN
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-b-2 border-white/10 text-xs">
          {/* Col 1: SHOP */}
          <div>
            <span className="font-display font-black text-sm text-[#FFE842] uppercase tracking-wider block mb-4">
              SHOP
            </span>
            <ul className="space-y-2.5 font-bold text-[#F5EFE6]/80">
              <li>
                <button onClick={() => nav('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Mango Sunbeam (220 EGP)
                </button>
              </li>
              <li>
                <button onClick={() => nav('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Berry Afterglow (230 EGP)
                </button>
              </li>
              <li>
                <button onClick={() => nav('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Citrus Comet (210 EGP)
                </button>
              </li>
              <li>
                <button onClick={() => nav('shop')} className="hover:text-white transition-colors cursor-pointer">
                  The Sun Chaser Box
                </button>
              </li>
              <li>
                <button onClick={() => nav('shop')} className="hover:text-white transition-colors cursor-pointer text-[#FF5E2B]">
                  Build a Custom Box →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: EXPLORE */}
          <div>
            <span className="font-display font-black text-sm text-[#C4E86E] uppercase tracking-wider block mb-4">
              EXPLORE
            </span>
            <ul className="space-y-2.5 font-bold text-[#F5EFE6]/80">
              <li>
                <button onClick={() => nav('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Taste Lab Catalog
                </button>
              </li>
              <li>
                <button onClick={() => nav('our-story')} className="hover:text-white transition-colors cursor-pointer">
                  When We Started (2021-2024)
                </button>
              </li>
              <li>
                <button onClick={() => nav('ingredients')} className="hover:text-white transition-colors cursor-pointer">
                  Real Fruit Puree & 84% Butter
                </button>
              </li>
              <li>
                <button onClick={() => nav('shipping')} className="hover:text-white transition-colors cursor-pointer">
                  Cold-Chain Delivery Cairo & Alex
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: HELP */}
          <div>
            <span className="font-display font-black text-sm text-[#FF4D8D] uppercase tracking-wider block mb-4">
              HELP
            </span>
            <ul className="space-y-2.5 font-bold text-[#F5EFE6]/80">
              <li>
                <button onClick={() => nav('track')} className="hover:text-white transition-colors cursor-pointer">
                  Track Your Weather Box
                </button>
              </li>
              <li>
                <button onClick={() => nav('wholesale')} className="hover:text-white transition-colors cursor-pointer">
                  Wholesale & Corporate Gifting
                </button>
              </li>
              <li>
                <button onClick={() => nav('faq')} className="hover:text-white transition-colors cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <a href="https://wa.me/201000000000" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Atelier Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: ABOUT / ADMIN */}
          <div>
            <span className="font-display font-black text-sm text-[#4AD4DA] uppercase tracking-wider block mb-4">
              ABOUT
            </span>
            <ul className="space-y-2.5 font-bold text-[#F5EFE6]/80">
              <li>Cairo Atelier No. 08</li>
              <li>Slow-Simmered Copper Cauldrons</li>
              <li>45-Second Signature Chew</li>
              <li>
                <button onClick={() => nav('admin')} className="text-[#FFE842] hover:underline font-mono font-bold cursor-pointer">
                  Merchant Admin Access ↗
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Badges Strip & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-mono font-bold text-[#FFE842]">
              REAL FRUIT
            </span>
            <span className="px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-mono font-bold text-[#FF5E2B]">
              SMALL BATCH
            </span>
            <span className="px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-mono font-bold text-[#C4E86E]">
              FREE SHIPPING OVER EGP 2,500
            </span>
            <span className="px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-mono font-bold text-[#4AD4DA]">
              ATMOSPHERE: 100% JOY
            </span>
          </div>

          <p className="text-[11px] text-[#F5EFE6]/60 font-mono">
            © 2024 toomakt fruit weather co. all rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
