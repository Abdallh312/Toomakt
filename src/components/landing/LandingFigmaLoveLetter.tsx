import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Globe2, Plane } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LandingFigmaLoveLetterProps {
  onDiscoverCollection?: () => void;
  onExportContact?: () => void;
}

export const LandingFigmaLoveLetter: React.FC<LandingFigmaLoveLetterProps> = ({
  onDiscoverCollection,
  onExportContact,
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

  // Parallax scroll transforms
  const imageY = useTransform(progress, [0, 1], [50, -50]);
  const imageScale = useTransform(progress, [0, 0.5, 1], [1.08, 1, 1.05]);
  const copyY = useTransform(progress, [0, 0.5, 1], [30, 0, -20]);
  const orbY = useTransform(progress, [0, 1], [20, -20]);
  const orbRotate = useTransform(progress, [0, 1], [-8, 16]);

  // Pure scroll-driven transition between real drive photos (NO CLICKS)
  const driveImg1Opacity = useTransform(progress, [0, 0.45, 0.6], [1, 1, 0]);
  const driveImg2Opacity = useTransform(progress, [0.4, 0.6, 1], [0, 1, 1]);

  // Exact countries from user design screenshot
  const exportCountries = [
    { en: 'Egypt', ar: 'مصر' },
    { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
    { en: 'Jordan', ar: 'الأردن' },
    { en: 'Yemen', ar: 'اليمن' },
    { en: 'Lebanon', ar: 'لبنان' },
    { en: 'Turkey', ar: 'تركيا' },
    { en: 'Romania', ar: 'رومانيا' },
  ];

  const handleActionClick = () => {
    if (onExportContact) {
      onExportContact();
    } else if (onDiscoverCollection) {
      onDiscoverCollection();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="from-egypt-to-the-world"
      className="relative w-full bg-white px-6 pt-20 pb-16 sm:px-10 sm:pt-28 sm:pb-20 lg:px-16 text-[#22120C]"
      aria-label="Export and Global Presence"
    >
      {/* Soft ambient atmospheric glow - continuous, without cutoffs */}
      <div className="pointer-events-none absolute -right-36 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#E890A8]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-36 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#6AACE9]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Top Header Bar matching user screenshot (no cutoff line below) */}
        <div className="mb-12 flex items-baseline justify-between gap-6 pb-2 sm:mb-16">
          <div className="flex flex-col items-start gap-1">
            <h3 className="font-sans text-2xl sm:text-4xl font-bold text-[#22120C] tracking-tight">
              {isRtl ? 'نكهة تعرف طريقها.' : 'A taste that knows its way.'}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#22120C]/45">
              00 / 04
            </span>
          </div>
        </div>

        {/* Main 2-Column Grid (RTL: Copy on right, Tall Arched Window on left) */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Visual Arch Container - Tall Vertical Arch Portal (Layout 1) */}
          <motion.div
            style={{ y: imageY }}
            className="lg:col-span-6 flex flex-col items-center lg:items-start order-2 lg:order-1 relative"
          >
            <div className="relative w-full max-w-[460px] sm:max-w-[480px]">
              {/* Arched Frame with real Google Drive photoshoot */}
              <div className="relative aspect-[4/4.8] overflow-hidden rounded-t-[190px] rounded-b-[36px] bg-[#22120C] shadow-[0_24px_60px_rgba(34,18,12,0.18)] border border-[#22120C]/10">
                {/* Real Photo 1: Glass Jar with authentic Toomakt fruit confections */}
                <motion.img
                  style={{ scale: imageScale, opacity: driveImg1Opacity }}
                  src="/images/drive/toomakt_fruit_jar_tumble.webp"
                  alt={isRtl ? 'حلويات توماكت الفواكه الحقيقية من المصنع للتصدير' : 'Real TOOMAKT fruit confections from the factory for export'}
                  className="absolute inset-0 h-full w-full object-cover will-change-transform"
                  loading="eager"
                />

                {/* Real Photo 2: Golden Butter Toomakt pieces (crossfades smoothly on scroll) */}
                <motion.img
                  style={{ scale: imageScale, opacity: driveImg2Opacity }}
                  src="/images/drive/toomakt_butter_gold_hand.webp"
                  alt={isRtl ? 'حلوى توماكت زبدة الفاخرة بالذهب' : 'TOOMAKT golden butter toffee pieces'}
                  className="absolute inset-0 h-full w-full object-cover will-change-transform"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#22120C]/85 via-black/15 to-transparent" />

                {/* Inscription at the bottom inside the arch matching user screenshot */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white z-20">
                  <div>
                    <span className="font-sans text-[10px] text-white/70 block">
                      {isRtl ? 'صُنع في مصر' : 'Made in Egypt'}
                    </span>
                    <p className="mt-1 font-sans text-2xl sm:text-3xl font-normal text-white drop-shadow-sm">
                      {isRtl ? 'حلوى تعبر الحدود.' : 'Sweetness without borders.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/25">
                    <Globe2 className="h-5 w-5 text-white/90" />
                  </div>
                </div>
              </div>

              {/* Floating Action Pink Circular Orb on bottom-left corner matching user screenshot */}
              <motion.button
                type="button"
                onClick={handleActionClick}
                style={{ y: orbY, rotate: orbRotate }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -bottom-6 -left-4 sm:-bottom-7 sm:-left-6 z-30 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#E890A8] text-white shadow-[0_16px_36px_rgba(232,144,168,0.45)] border-4 border-white cursor-pointer group"
                aria-label={isRtl ? 'تواصل لفرص التصدير' : 'Contact for export'}
              >
                <div className="relative flex items-center justify-center">
                  <Plane className="h-7 w-7 sm:h-8 sm:w-8 -rotate-12 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Copy Column (Right in RTL, Left in LTR) */}
          <motion.div
            style={{ y: copyY }}
            className={`lg:col-span-6 space-y-6 sm:space-y-7 order-1 lg:order-2 ${isRtl ? 'text-right' : 'text-left'}`}
          >
            {/* Category Tag matching user screenshot */}
            <div>
              <span className="font-sans text-xs sm:text-sm font-medium text-[#6AACE9] block">
                {isRtl ? 'آفاق التصدير والانتشار الدولي' : 'Export & Global Horizons'}
              </span>
            </div>

            {/* Display Headline using unified Alexandria font */}
            <h2
              dir={isRtl ? 'rtl' : 'ltr'}
              className={`${
                isRtl
                  ? 'font-sans text-2xl sm:text-4xl lg:text-[2.6rem] font-bold leading-[1.35]'
                  : 'font-sans text-4xl sm:text-6xl lg:text-[4.2rem] font-bold leading-[1.1]'
              } tracking-tight text-[#22120C]`}
            >
              {isRtl ? (
                <>
                  <span className="block font-bold">من مصر إلى</span>
                  <span className="block font-bold">العالم،</span>
                  <span className="block font-normal italic text-[#E890A8] text-[clamp(1.8rem,3.8vw,2.5rem)] leading-[1.35] mt-2">
                    قطعة حلوة كل مرة.
                  </span>
                </>
              ) : (
                <>
                  <span className="block font-bold">From Egypt to</span>
                  <span className="block font-bold">the World,</span>
                  <span className="block font-normal italic text-[#E890A8] text-[clamp(2.2rem,4.5vw,3.8rem)] leading-tight mt-1">
                    one sweet bite every time.
                  </span>
                </>
              )}
            </h2>

            {/* Description Paragraph */}
            <p className="font-sans text-base sm:text-lg text-[#22120C]/75 font-normal leading-relaxed max-w-xl">
              {isRtl
                ? 'تمتد صادراتنا إلى أسواق عربية ودولية، حاملة مذاق توماكت من مصنعنا في مصر إلى موائد جديدة حول العالم.'
                : 'Our exports extend to Arab and international markets, delivering the authentic Toomakt taste from our Egyptian atelier to dining tables across the globe.'}
            </p>

            {/* Country Pills matching user screenshot */}
            <div className="pt-2">
              <div className="flex flex-wrap gap-2.5">
                {exportCountries.map((country) => (
                  <span
                    key={country.en}
                    className="px-4 py-2 rounded-full font-sans text-xs sm:text-[13px] font-normal bg-white text-[#22120C]/85 border border-[#22120C]/15 hover:border-[#E890A8] hover:text-[#E890A8] transition-colors shadow-xs"
                  >
                    {isRtl ? country.ar : country.en}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button matching user screenshot */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleActionClick}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#22120C] hover:bg-[#E890A8] text-white font-sans font-medium text-sm sm:text-base shadow-[0_12px_28px_rgba(34,18,12,0.18)] hover:shadow-[0_14px_32px_rgba(232,144,168,0.35)] transition-all duration-300 ease-out cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{isRtl ? 'تواصل لفرص التصدير والشراكات' : 'Contact for Export & Partnerships'}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingFigmaLoveLetter;
