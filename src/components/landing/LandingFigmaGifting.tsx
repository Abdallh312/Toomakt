import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LandingFigmaGiftingProps {
  onTalkGifting: () => void;
}

export const LandingFigmaGifting: React.FC<LandingFigmaGiftingProps> = ({
  onTalkGifting,
}) => {
  const { isRtl } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Parallax and scroll motion
  const copyY = useTransform(progress, [0, 1], [35, -25]);
  const imageY = useTransform(progress, [0, 1], [50, -40]);
  const imageScale = useTransform(progress, [0, 0.5, 1], [1.06, 1, 1.04]);
  const floatCardY = useTransform(progress, [0, 1], [25, -20]);

  // Scroll-driven crossfade for main showcase box (NO CLICKS)
  const mainImg1Opacity = useTransform(progress, [0, 0.5, 0.65], [1, 1, 0]);
  const mainImg2Opacity = useTransform(progress, [0.45, 0.65, 1], [0, 1, 1]);

  const partnerTiers = [
    { en: 'Wholesalers & Bulk Distributors', ar: 'تجار الجملة والموزعين' },
    { en: 'Commercial Agents & Exporters', ar: 'الوكلاء التجاريين والمصدرين' },
    { en: 'Retail Chains & Supermarkets', ar: 'سلاسل التجزئة والمتاجر' },
  ];

  return (
    <section
      ref={sectionRef}
      id="wholesale-and-trade-partnerships"
      className="relative w-full bg-white text-[#22120C] pt-12 pb-24 sm:pt-16 sm:pb-32 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-label="Wholesale and Trade Partnerships"
    >
      {/* Seamless flow without cutoffs - soft unified ambient glow */}
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#E890A8]/8 blur-3xl" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Distinct Multi-Scale Showcase Composition - Layout 2: Wide Box + Overlapping Offset Card */}
        <motion.div
          style={{ y: imageY }}
          className="lg:col-span-6 relative flex flex-col items-center lg:items-start order-2 lg:order-1"
        >
          <div className="relative w-full max-w-[530px]">
            {/* Box 1 (Main Wide Showcase Box with distinct horizontal proportions) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="relative w-full aspect-[16/11] rounded-[32px] sm:rounded-[38px] overflow-hidden shadow-[0_24px_55px_rgba(34,18,12,0.12)] border border-[#22120C]/10 bg-[#FAF9F7] group"
            >
              {/* Real Google Drive Photo 1: Mint Luxury Gift Box on stone display */}
              <motion.img
                style={{ scale: imageScale, opacity: mainImg1Opacity }}
                src="/images/drive/toomakt_mint_luxury_box.webp"
                alt={isRtl ? 'صندوق هدايا وتوزيع توماكت الفاخر الحقيقي من الدرايف' : 'Real TOOMAKT luxury gift and retail box from Google Drive'}
                className="absolute inset-0 h-full w-full object-cover will-change-transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Real Google Drive Photo 2: Confectionery packages on pedestals revealed on scroll */}
              <motion.img
                style={{ scale: imageScale, opacity: mainImg2Opacity }}
                src="/images/drive/toomakt_pedestal_packages.webp"
                alt={isRtl ? 'تشكيلة منتجات توماكت على منصات العرض الفنية' : 'TOOMAKT confectionery packages on architectural pedestals'}
                className="absolute inset-0 h-full w-full object-cover will-change-transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#22120C]/75 via-transparent to-transparent" />
            </motion.div>

            {/* Box 2 (Secondary Floating Overlapping Box with distinct size and content) */}
            <motion.div
              style={{ y: floatCardY }}
              className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 z-20 w-44 sm:w-56 aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(34,18,12,0.18)] border-4 border-white bg-white group cursor-default"
            >
              <img
                src="/images/drive/toomakt_commercial_fleet.webp"
                alt={isRtl ? 'شاحنات وأسطول توزيع توماكت' : 'TOOMAKT distribution fleet'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 right-3 left-3 flex items-center gap-1.5 text-white">
                <Truck className="w-3.5 h-3.5 text-[#E890A8] shrink-0" />
                <span className="font-sans text-[10px] sm:text-[11px] font-medium leading-tight">
                  {isRtl ? 'أسطول التوريد والتوزيع' : 'Commercial Fleet'}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Commercial Trade Message Column (Right in RTL, Left in LTR) */}
        <motion.div
          style={{ y: copyY }}
          className={`lg:col-span-6 space-y-6 sm:space-y-7 order-1 lg:order-2 ${isRtl ? 'text-right' : 'text-left'}`}
        >
          {/* Top Tag matching user screenshot */}
          <div>
            <span className="font-sans text-xs sm:text-sm font-normal text-[#E890A8] block">
              {isRtl ? 'شَرَاكَاتُ النَّجَاحِ وَالتَّوْزِيعِ التِّجَارِيّ' : 'WHOLESALE & TRADE PARTNERSHIPS'}
            </span>
          </div>

          {/* Heading with Arabic Tashkeel using unified Alexandria font */}
          <h2
            dir={isRtl ? 'rtl' : 'ltr'}
            className="font-sans text-3xl sm:text-5xl lg:text-[3.6rem] font-bold leading-[1.15] tracking-tight text-[#22120C]"
          >
            {isRtl ? (
              <span className="flex flex-col gap-1 sm:gap-2">
                <span className="block font-bold">عَلَاقَاتٌ طَوِيلَةُ الأَمَد:</span>
                <span className="block font-normal italic text-[#E890A8] text-[clamp(2.3rem,4.8vw,3.9rem)] leading-[1.15]">
                  مَعَ شُرَكَاءِ النَّجَاحِ حَوْلَ العَالَم.
                </span>
              </span>
            ) : (
              <>
                <span className="block font-bold">Enduring Alliances:</span>
                <span className="block font-normal italic text-[#E890A8] text-[clamp(2.2rem,4.4vw,3.6rem)] leading-tight mt-1">
                  With trade partners across the world.
                </span>
              </>
            )}
          </h2>

          {/* Body Description */}
          <p className="font-sans text-base sm:text-lg text-[#22120C]/80 font-normal leading-relaxed max-w-xl">
            {isRtl
              ? 'نعمل على بناء علاقات طويلة الأمد مع تجار الجملة والموزعين والوكلاء ومحلات التجزئة، مع السعي إلى تلبية تطلعات المستهلكين وتقديم منتجات تلائم احتياجات الأسواق المختلفة بمذاق مميز وأسعار تنافسية.'
              : 'We build enduring long-term relationships with wholesalers, distributors, commercial agents, and retail stores, dedicated to meeting consumer desires and delivering confectionery crafted for global markets at outstanding taste and competitive pricing.'}
          </p>

          {/* Primary Action Button (Pink Button matching user screenshot) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onTalkGifting}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#E890A8] hover:bg-[#22120C] text-white font-sans font-medium text-sm sm:text-base shadow-[0_12px_28px_rgba(232,144,168,0.38)] hover:shadow-[0_14px_32px_rgba(34,18,12,0.25)] transition-all duration-300 ease-out cursor-pointer group hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{isRtl ? 'تَوَاصَلْ لِطَلَبَاتِ الجُمْلَةِ وَالتَّوْزِيع' : 'Inquire for Wholesale & Trade'}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>

          {/* Partner Tier Pills below the button matching user screenshot */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {partnerTiers.map((tier, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-full font-sans text-xs sm:text-[13px] font-normal bg-white text-[#22120C]/85 border border-[#22120C]/15 hover:border-[#E890A8] hover:text-[#E890A8] transition-colors shadow-xs"
                >
                  {isRtl ? tier.ar : tier.en}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingFigmaGifting;
