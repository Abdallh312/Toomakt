import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Globe2, Plane } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LandingFigmaLoveLetterProps {
  onDiscoverCollection: () => void;
}

export const LandingFigmaLoveLetter: React.FC<LandingFigmaLoveLetterProps> = ({
  onDiscoverCollection,
}) => {
  const { isRtl } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });
  const imageY = useTransform(progress, [0, 1], [90, -90]);
  const imageScale = useTransform(progress, [0, 0.5, 1], [1.12, 1, 1.1]);
  const copyY = useTransform(progress, [0, 0.5, 1], [70, 0, -35]);
  const routeX = useTransform(progress, [0, 1], ['-12%', '112%']);
  const sectionOpacity = useTransform(progress, [0, 0.12, 0.9, 1], [0.45, 1, 1, 0.55]);

  const exportCountries = [
    { en: 'Egypt', ar: 'مصر' },
    { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
    { en: 'Jordan', ar: 'الأردن' },
    { en: 'Yemen', ar: 'اليمن' },
    { en: 'Lebanon', ar: 'لبنان' },
    { en: 'Turkey', ar: 'تركيا' },
    { en: 'Romania', ar: 'رومانيا' },
  ];

  return (
    <motion.section
      ref={sectionRef}
      id="toffee-love-letter"
      style={{ opacity: sectionOpacity }}
      className="relative w-full overflow-hidden bg-[#f4f8fc] px-6 py-24 text-[#22120C] sm:px-10 sm:py-32 lg:px-16"
      aria-label="Export and Global Presence"
    >
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#E890A8]/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#6AACE9]/20 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #22120C 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-14 flex items-end justify-between gap-6 border-b border-[#22120C]/10 pb-6 sm:mb-20">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E890A8]">
              <span className="h-px w-10 bg-[#E890A8]" />
              {isRtl ? 'من مصر إلى العالم' : 'From Egypt to the world'}
            </p>
            <p className="mt-3 max-w-xl font-serif text-3xl leading-none tracking-tight sm:text-5xl">
              {isRtl ? 'نكهة تعرف طريقها.' : 'A taste that knows its way.'}
            </p>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[#22120C]/40 sm:block">
            06 / 09
          </span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <motion.div
            style={{ y: imageY }}
            className="relative mx-auto w-full max-w-[560px] lg:order-2"
          >
            <div className="relative aspect-[4/4.8] overflow-hidden rounded-[48%_48%_10%_10%/30%_30%_10%_10%] bg-[#22120C] shadow-[0_28px_70px_rgba(34,18,12,0.2)]">
              <motion.img
                style={{ scale: imageScale }}
                src="/images/figma/6454d035653cd755b879267e237582d369f27168.jpg"
                alt="Artisanal toffee confections prepared for international export"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#22120C]/70 via-transparent to-[#22120C]/10" />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{ duration: 0.7 }}
                className="absolute bottom-7 left-7 right-7 flex items-end justify-between text-white sm:bottom-9 sm:left-9 sm:right-9"
              >
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/60">
                    {isRtl ? 'صُنِعَ في مصر' : 'Made in Egypt'}
                  </span>
                  <p className="mt-2 font-serif text-2xl italic sm:text-3xl">
                    {isRtl ? 'حلوى تعبر الحدود.' : 'Sweetness without borders.'}
                  </p>
                </div>
                <Globe2 className="h-7 w-7 text-white/70" />
              </motion.div>
            </div>
            <motion.div
              animate={{ rotate: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#E890A8] text-white shadow-[0_12px_28px_rgba(232,144,168,0.35)] sm:-left-8"
            >
              <Plane className="h-6 w-6 -rotate-12" />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: copyY }}
            className={`lg:order-1 ${isRtl ? 'text-right' : 'text-left'}`}
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6AACE9]">
              {isRtl ? 'آفاق التصدير والانتشار الدولي' : 'Global horizons & export markets'}
            </span>
            <h2 className="mt-6 max-w-2xl font-serif text-5xl leading-[0.94] tracking-[-0.045em] sm:text-7xl">
              {isRtl ? (
                <>
                  من مصر إلى العالم،
                  <br />
                  <span className="italic text-[#E890A8]">قطعة حلوة كل مرة.</span>
                </>
              ) : (
                <>
                  From Egypt to the
                  <br />
                  <span className="italic text-[#E890A8]">world, one sweet bite.</span>
                </>
              )}
            </h2>
            <p className="mt-8 max-w-xl text-sm leading-7 text-[#22120C]/65 sm:text-base">
              {isRtl
                ? 'تمتد صادراتنا إلى أسواق عربية ودولية، حاملةً مذاق توماكت من مصنعنا في مصر إلى موائد جديدة حول العالم.'
                : 'Our exports carry the Toomakt taste from our Egyptian atelier to new tables across Arab and international markets.'}
            </p>

            <div className="relative mt-10 overflow-hidden border-y border-[#22120C]/10 py-5">
              <motion.div
                style={{ x: routeX }}
                className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#6AACE9] to-transparent"
              />
              <div className="relative flex flex-wrap gap-2">
                {exportCountries.map((country, index) => (
                  <motion.span
                    key={country.en}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.2 }}
                    transition={{ delay: index * 0.06, duration: 0.4 }}
                    whileHover={{ y: -4, backgroundColor: '#22120C', color: '#FFFFFF' }}
                    className="cursor-default rounded-full border border-[#22120C]/15 bg-[#f4f8fc] px-3.5 py-2 font-mono text-[10px] font-medium transition-colors"
                  >
                    {isRtl ? country.ar : country.en}
                  </motion.span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onDiscoverCollection}
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#22120C] px-7 py-4 text-sm font-medium text-white shadow-[0_12px_24px_rgba(34,18,12,0.16)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#E890A8]"
            >
              <span>{isRtl ? 'تواصل لفرص التصدير والشراكات' : 'Export & distribution enquiries'}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default LandingFigmaLoveLetter;
