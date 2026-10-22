import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Phone,
  Mail,
  ArrowUpRight,
  MessageCircle,
  MapPin,
  Sparkles,
  Clock,
  Check,
  Copy,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LandingFigmaConversationProps {
  onStartTalk: () => void;
}

export const LandingFigmaConversation: React.FC<LandingFigmaConversationProps> = ({
  onStartTalk,
}) => {
  const { isRtl } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {}
  };

  // Scroll parallax for visual elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const smoothPhotoY = useSpring(photoY, { stiffness: 85, damping: 20 });

  return (
    <section
      ref={sectionRef}
      id="start-a-sweet-conversation"
      className="relative w-full bg-white text-[#22120C] py-20 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-label="Official Contact and Inquiries"
    >
      {/* ─── Ambient Seamless Glow (No Square, No Borders, No Cutoffs) ─── */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,144,168,0.06)_0%,rgba(106,172,233,0.04)_45%,transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* ─── LEFT COLUMN: Editorial Contact Dossier (Open & Fluid) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 sm:space-y-7"
          >
            {/* Live Concierge Status Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#E890A8]/10 border border-[#E890A8]/25 text-xs font-mono font-semibold text-[#E890A8] shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>
                  {isRtl
                    ? 'مَكْتَبُ الاِتِّصَالِ وَالعَلاَقَاتِ التِّجَارِيَّة · رَدٌّ فَوْرِيّ'
                    : 'OFFICIAL CONCIERGE & INQUIRIES · FAST RESPONSE'}
                </span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#22120C]/08 text-[11px] font-mono text-[#22120C]/70">
                <Clock className="w-3.5 h-3.5 text-[#E890A8]" />
                <span>{isRtl ? 'مجمع العاشر من رمضان' : '10th of Ramadan Complex'}</span>
              </span>
            </div>

            {/* Main Headline (Alexandria bold in Arabic, Zero Font Mismatch) */}
            <h2
              className={`${
                isRtl ? 'font-sans font-extrabold tracking-tight' : 'font-serif font-normal tracking-tight'
              } text-3xl sm:text-5xl lg:text-[3.5rem] text-[#22120C] leading-[1.12]`}
            >
              {isRtl ? (
                <>
                  كُلُّ نَجَاحٍ يَبْدَأُ بِتَوَاصُل:
                  <span className="block mt-1.5 text-[#E890A8]">
                    تَسْعَدُنَا خِدْمَتُكُمْ دَائِماً.
                  </span>
                </>
              ) : (
                <>
                  Every Success Starts with a Talk:
                  <span className="block mt-1.5 italic font-light text-[#E890A8]">
                    We are Always at Your Service.
                  </span>
                </>
              )}
            </h2>

            {/* Editorial Description */}
            <p className="text-base sm:text-lg text-[#22120C]/75 font-light leading-relaxed max-w-xl">
              {isRtl
                ? 'استفسارات المنتجات، طلبيات الجملة والتوريد، عقود التصدير الدولي، أو زيارة مجمعنا ومصنعنا بالعاشر من رمضان؛ فريق شركة الزهرة وتوماكت جاهز للإجابة وتنسيق عينات التذوق.'
                : 'Product enquiries, wholesale distribution orders, international export contracts, or visiting our 10th of Ramadan complex; the Al-Zahra & TOOMAKT team is ready to assist.'}
            </p>

            {/* ─── Direct Contact Pills (Seamless & Flexible on Page Canvas) ─── */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#22120C]/50 block font-semibold">
                {isRtl ? 'خُطُوطُ الاِتِّصَالِ الرَّسْمِيَّة:' : 'DIRECT CONTACT HOTLINES:'}
              </span>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Main Hotline: 01024542139 */}
                <a
                  href="tel:01024542139"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#22120C] text-white hover:bg-[#E890A8] text-xs sm:text-sm font-mono font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group/pill"
                  title={isRtl ? 'الرقم الرئيسي للموقع' : 'Main Website Line'}
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover/pill:bg-white group-hover/pill:text-[#E890A8] transition-colors">
                    <Phone className="w-3 h-3" />
                  </div>
                  <span className="font-sans font-bold">{isRtl ? 'الرئيسي:' : 'Main:'}</span>
                  <span dir="ltr">01024542139</span>
                </a>

                {/* WhatsApp Direct Line */}
                <a
                  href="https://wa.me/201024542139?text=Hello%20Al-Zahra%20Toomakt!%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-mono font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'واتساب مباشر' : 'WhatsApp'}</span>
                  <span dir="ltr">01024542139</span>
                </a>

                {/* Secondary Hotline 1 */}
                <a
                  href="tel:+201095288014"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#22120C] hover:text-[#E890A8] border border-[#22120C]/10 hover:border-[#E890A8] text-xs font-mono font-medium shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <Phone className="w-3 h-3 text-[#E890A8]" />
                  <span dir="ltr">+20 10 95288014</span>
                </a>

                {/* Secondary Hotline 2 */}
                <a
                  href="tel:+201277664957"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#22120C] hover:text-[#E890A8] border border-[#22120C]/10 hover:border-[#E890A8] text-xs font-mono font-medium shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <Phone className="w-3 h-3 text-[#E890A8]" />
                  <span dir="ltr">+20 12 77664957</span>
                </a>

                {/* Email with copy button */}
                <div className="inline-flex items-center rounded-full bg-[#FAF8F5] border border-[#22120C]/10 text-xs font-mono font-medium text-[#22120C] hover:border-[#E890A8] shadow-2xs transition-all duration-200 overflow-hidden">
                  <a
                    href="mailto:alzahra.company23@gmail.com"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 hover:text-[#E890A8] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#E890A8]" />
                    <span>alzahra.company23@gmail.com</span>
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopy('alzahra.company23@gmail.com', 'email', e)}
                    className="px-2.5 py-2.5 border-l rtl:border-l-0 rtl:border-r border-[#22120C]/10 hover:bg-[#22120C]/05 transition-colors cursor-pointer"
                    title={isRtl ? 'نسخ البريد الإلكتروني' : 'Copy email address'}
                  >
                    {copiedKey === 'email' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#22120C]/60" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── RIGHT COLUMN: Confectionery Hospitality Showcase & Direct CTA ─── */}
          <motion.div
            style={{ y: smoothPhotoY }}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-5"
          >
            {/* Real Drive Confection Hospitality Visual */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3.2] shadow-[0_20px_50px_rgba(34,18,12,0.12)] border border-[#22120C]/08 group/photo">
              <img
                src="/images/drive/toomakt_butter_gold_hand.webp"
                alt={isRtl ? 'ضيافة حلويات توماكت الفاخرة' : 'Toomakt Confectionery Hospitality'}
                className="w-full h-full object-cover object-center group-hover/photo:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#22120C]/75 via-transparent to-transparent pointer-events-none" />

              {/* Floating Hospitality Badge */}
              <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#22120C] text-[11px] font-sans font-bold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#E890A8]" />
                  <span>{isRtl ? 'عينات وضيافة تذوق للشركات' : 'Complimentary Tasting Sets'}</span>
                </span>
              </div>

              {/* Bottom Location Pill */}
              <div className="absolute bottom-3.5 inset-x-3.5 flex items-center justify-between text-xs font-mono text-white">
                <span className="flex items-center gap-1.5 bg-[#22120C]/80 backdrop-blur-md px-3 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-[#F5C869]" />
                  <span>{isRtl ? 'العاشر من رمضان · المنطقة الصناعية' : '10th of Ramadan'}</span>
                </span>
                <span className="bg-[#22120C]/80 backdrop-blur-md px-3 py-1 rounded-full text-white/80">
                  {isRtl ? 'تأسس ١٩٧٠' : 'Est. 1970'}
                </span>
              </div>
            </div>

            {/* Primary Action Button: Grand Send Inquiry */}
            <button
              type="button"
              onClick={onStartTalk}
              className="w-full py-4.5 px-7 rounded-2xl bg-[#E890A8] hover:bg-[#6AACE9] text-white font-sans font-bold text-base shadow-[0_12px_32px_rgba(232,144,168,0.35)] hover:shadow-[0_16px_40px_rgba(106,172,233,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-between group/btn cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white group-hover/btn:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="tracking-tight text-left rtl:text-right">
                  {isRtl ? 'إِرْسَالُ طَلَبٍ أَوْ اسْتِفْسَارٍ تِجَارِيّ' : 'Send an Inquiry / Wholesale Request'}
                </span>
              </div>

              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white group-hover/btn:bg-white group-hover/btn:text-[#6AACE9] transition-all shrink-0">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </span>
            </button>

            {/* Official Social Channels Deck */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left rtl:text-right">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#22120C]/60 font-semibold block">
                {isRtl ? 'قَنَوَاتُنَا الرَّسْمِيَّة:' : 'OFFICIAL SOCIAL CHANNELS:'}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com/share/1FViuqzzWy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#22120C]/80 hover:text-[#1877F2] border border-[#22120C]/10 hover:border-[#1877F2]/40 text-xs font-mono font-medium shadow-2xs transition-all duration-200 flex items-center gap-1"
                >
                  <span>Facebook</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </a>
                <a
                  href="https://instagram.com/toomakt11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#22120C]/80 hover:text-[#E4405F] border border-[#22120C]/10 hover:border-[#E4405F]/40 text-xs font-mono font-medium shadow-2xs transition-all duration-200 flex items-center gap-1"
                >
                  <span>Instagram</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </a>
                <a
                  href="https://tiktok.com/@alzahra.eg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#22120C]/80 hover:text-black border border-[#22120C]/10 hover:border-black/40 text-xs font-mono font-medium shadow-2xs transition-all duration-200 flex items-center gap-1"
                >
                  <span>TikTok</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingFigmaConversation;
