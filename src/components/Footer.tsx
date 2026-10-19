import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Check, MessageCircle, Phone, Mail, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigateView?: (view: string) => void;
  onNavigateSection?: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateView, onNavigateSection }) => {
  const { isRtl } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [footerHeight, setFooterHeight] = useState<number>(0);
  const footerContentRef = useRef<HTMLDivElement>(null);

  // Measure the footer content height dynamically for seamless behind-the-page reveal
  useEffect(() => {
    if (!footerContentRef.current) return;
    const updateHeight = () => {
      if (footerContentRef.current) {
        setFooterHeight(footerContentRef.current.offsetHeight);
      }
    };

    updateHeight();
    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(footerContentRef.current);
    window.addEventListener('resize', updateHeight, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.subscribeNewsletter(email);
    } catch {}
    setSubscribed(true);
  };

  const nav = (v: string) => {
    if (onNavigateView) {
      onNavigateView(v);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = [
    {
      titleEn: 'EXPLORE',
      titleAr: 'اسْتَكْشِف',
      links: [
        { en: 'Our sweets', ar: 'حلوياتنا الفاخرة', fn: () => nav('shop') },
        { en: 'Our story', ar: 'حكايتنا', fn: () => scrollToSection('a-sweeter-outlook') },
        { en: 'The craft', ar: 'الحرفة ومراجل النحاس', fn: () => scrollToSection('the-art-of-craft') },
        { en: 'Manufacturing plant', ar: 'المجمع الصناعي', fn: () => nav('factory') },
      ],
    },
    {
      titleEn: 'COME SAY HELLO',
      titleAr: 'تَفَضَّلْ بِمُحَادَثَتِنَا',
      links: [
        { en: 'Our branches', ar: 'فروعنا والمحطات', fn: () => scrollToSection('our-branches-trail') },
        { en: 'Contact us', ar: 'اتصل بنا', fn: () => nav('contact') },
        { en: 'Gifting enquiries', ar: 'طلبات الإهداء والشركات', fn: () => nav('contact') },
        { en: 'Track order', ar: 'تتبع الشحنة المبردة', fn: () => nav('track') },
      ],
    },
    {
      titleEn: 'ACCREDITATION',
      titleAr: 'الاعتماد وخدمة العملاء',
      links: [
        { en: 'NFSA White-List #017', ar: 'سلامة الغذاء NFSA #017', fn: () => nav('about') },
        { en: 'Corporate concierge', ar: 'مكتب كبار العملاء', fn: () => nav('contact') },
        { en: 'WhatsApp direct', ar: 'واتساب خدمة العملاء', fn: () => window.open('https://wa.me/201024542139', '_blank') },
      ],
    },
  ];

  return (
    <footer
      className="relative w-full z-0 overflow-hidden no-print"
      style={{ height: footerHeight > 0 ? `${footerHeight}px` : 'auto' }}
      aria-label="Behind-The-Page Footer"
    >
      {/* The Fixed Reveal Stage — warm cream design matching landing */}
      <div
        ref={footerContentRef}
        className="footer-reveal bg-[#FAF5EE] text-[#22120C] border-t border-[#22120C]/10"
      >
        {/* Subtle Ambient Back-Glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(228,176,114,0.08),transparent_70%)] pointer-events-none blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-20 pb-10">
          {/* Top Grid: Brand Dossier + 3 Link Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-14 border-b border-[#22120C]/10">
            {/* Brand Column (md:col-span-5) */}
            <div className={`md:col-span-5 space-y-5 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-3">
                <img
                  src="/images/logos/toomakt_logo_main.png"
                  alt="toomakt"
                  className="h-9 w-auto object-contain opacity-95"
                />
                <span className="font-serif text-3xl sm:text-4xl text-[#22120C] tracking-tight lowercase font-normal">
                  toomakt
                </span>
              </div>

              <p className="font-serif italic text-base sm:text-lg text-[#22120C]/75 font-light leading-relaxed max-w-sm">
                {isRtl
                  ? 'حلاوةٌ صغيرة تمتد في الأثر بعيداً.'
                  : 'A little sweetness goes a long way.'}
              </p>

              <p className="text-xs text-[#22120C]/60 font-light leading-relaxed max-w-md">
                {isRtl
                  ? 'شركة الزهرة للصناعات الغذائية (الزهرة عبد العزيز محمد الخالد وشركاؤه) · صاحبة العلامة التجارية TOOMAKT – توماكت. صناعة التوفي والبونبوني المحشي. سوريا ١٩٧٠ · مصر ٢٠١٢. مجمع العاشر من رمضان الصناعي.'
                  : 'Al-Zahra Food Industries (Al-Zahra Abdulaziz M. Al-Khaled & Co.) · Owner of TOOMAKT. Masters of toffee & filled bonbons. Syria 1970 · Egypt 2012 · 10th of Ramadan Industrial City.'}
              </p>

              {/* Direct Concierge Contact Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <a
                  href="tel:01024542139"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#963725] text-white text-xs font-mono font-bold shadow-xs hover:bg-[#822E1E] transition-all"
                  title={isRtl ? 'الرقم الرئيسي للموقع' : 'Main Website Hotline'}
                >
                  <Phone className="w-3.5 h-3.5 text-[#FAF5EE]" />
                  <span className="font-sans font-semibold text-[11px]">{isRtl ? 'الرئيسي:' : 'Main:'}</span>
                  <span dir="ltr">01024542139</span>
                </a>

                <a
                  href="tel:+201095288014"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22120C]/[0.04] hover:bg-[#22120C]/[0.08] border border-[#22120C]/15 text-xs font-mono text-[#22120C]/80 hover:text-[#963725] hover:border-[#963725]/40 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#963725]" />
                  <span dir="ltr">+20 10 95288014</span>
                </a>

                <a
                  href="tel:+201277664957"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22120C]/[0.04] hover:bg-[#22120C]/[0.08] border border-[#22120C]/15 text-xs font-mono text-[#22120C]/80 hover:text-[#963725] hover:border-[#963725]/40 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#963725]" />
                  <span dir="ltr">+20 12 77664957</span>
                </a>

                <a
                  href="mailto:alzahra.company23@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22120C]/[0.04] hover:bg-[#22120C]/[0.08] border border-[#22120C]/15 text-xs font-mono text-[#22120C]/80 hover:text-[#963725] hover:border-[#963725]/40 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#963725]" />
                  <span>alzahra.company23@gmail.com</span>
                </a>
              </div>
            </div>

            {/* 3 Nav Columns (md:col-span-7) */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {footerLinks.map((col) => (
                <div key={col.titleEn} className={isRtl ? 'text-right' : 'text-left'}>
                  <p className="text-[11px] font-mono tracking-widest uppercase mb-4 text-[#963725] font-semibold">
                    {isRtl ? col.titleAr : col.titleEn}
                  </p>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link.en}>
                        <button
                          type="button"
                          onClick={link.fn}
                          className="text-sm text-[#22120C]/65 hover:text-[#963725] hover:translate-x-1 rtl:hover:-translate-x-1 transition-all font-light cursor-pointer text-left rtl:text-right font-sans"
                        >
                          {isRtl ? link.ar : link.en}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Dispatch Subscription Bar */}
          <div className="py-8 border-b border-[#22120C]/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <h4 className="font-serif text-lg sm:text-xl text-[#22120C] font-normal mb-1">
                {isRtl ? 'انضم لنشرة معمل توماكت الحصرية' : 'Subscribe to the Atelier Dispatch'}
              </h4>
              <p className="text-xs text-[#22120C]/50 font-light font-sans">
                {isRtl
                  ? 'أخبار التشغيلات الموسمية الحصرية وعروض التوريد لكبار العملاء.'
                  : 'Private tasting reserve releases, seasonal batches, and corporate wholesale terms.'}
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full">
                <Check className="w-4 h-4" />
                <span>{isRtl ? 'تم تسجيل بريدك بنجاح في نشرة توماكت.' : 'Thank you. You are subscribed.'}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center w-full md:w-auto md:min-w-[360px]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRtl ? 'بريدك الإلكتروني المهني' : 'Enter work email'}
                  className="w-full text-xs px-5 pr-28 rtl:pr-5 rtl:pl-28 py-3 rounded-full bg-[#22120C]/[0.04] border border-[#22120C]/15 text-[#22120C] placeholder-[#22120C]/40 font-mono focus:outline-none focus:border-[#963725] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 rtl:right-auto rtl:left-1.5 px-4 py-2 rounded-full bg-[#963725] text-[#FAF5EE] text-[11px] font-mono font-bold uppercase tracking-wider hover:bg-[#822E1E] transition-all cursor-pointer shadow-md"
                >
                  {isRtl ? 'اشتراك' : 'Join'}
                </button>
              </form>
            )}
          </div>

          {/* Social Media */}
          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#963725] font-semibold">
                {isRtl ? 'تَابِعُونَا' : 'FOLLOW US'}
              </span>
              <a
                href="https://facebook.com/share/1FViuqzzWy/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#22120C]/15 flex items-center justify-center text-[#22120C]/70 hover:bg-[#963725] hover:text-[#FAF5EE] hover:border-[#963725] transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/toomakt11"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#22120C]/15 flex items-center justify-center text-[#22120C]/70 hover:bg-[#963725] hover:text-[#FAF5EE] hover:border-[#963725] transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@alzahra.eg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#22120C]/15 flex items-center justify-center text-[#22120C]/70 hover:bg-[#963725] hover:text-[#FAF5EE] hover:border-[#963725] transition-all"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>

            {/* Large Watermark Wordmark */}
            <div className="overflow-hidden text-center select-none pointer-events-none">
              <span className="font-serif text-[12vw] sm:text-[8vw] lg:text-[6vw] leading-none text-[#22120C]/[0.04] block tracking-tighter">
                toomakt
              </span>
            </div>
          </div>

          {/* Bottom Bar: Legal Registration & Scroll-to-Top */}
          <div className="pt-4 border-t border-[#22120C]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans font-light text-[#22120C]/50">
            <p>
              © {new Date().getFullYear()} toomakt — Al-Zahra Confectionery S.A.E.{' '}
              {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => nav('privacy-policy')}
                  className="hover:text-[#22120C] transition-colors"
                >
                  {isRtl ? 'سياسة الخصوصية' : 'Privacy policy'}
                </button>
                <button
                  type="button"
                  onClick={() => nav('terms-of-service')}
                  className="hover:text-[#22120C] transition-colors"
                >
                  {isRtl ? 'شروط الاستخدام' : 'Terms of use'}
                </button>
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#22120C]/[0.04] border border-[#22120C]/10 text-[#963725] hover:text-[#22120C] hover:border-[#22120C]/25 transition-all cursor-pointer font-mono tracking-wider text-xs"
                aria-label="Scroll to top"
              >
                <span className="hidden sm:inline">{isRtl ? 'العودة للأعلى' : 'Back to top'}</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
