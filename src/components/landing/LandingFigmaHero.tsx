import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Globe2, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LandingFigmaHeroProps {
  onExploreSweets: () => void;
  onNavigateSection: (id: string) => void;
  onContactClick: () => void;
}

export const LandingFigmaHero: React.FC<LandingFigmaHeroProps> = ({
  onExploreSweets,
  onNavigateSection,
}) => {
  const { isRtl } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  const contentY = useTransform(progress, [0, 1], [0, 130]);
  const contentOpacity = useTransform(progress, [0, 0.7], [1, 0]);
  const imageY = useTransform(progress, [0, 1], [0, -90]);
  const imageScale = useTransform(progress, [0, 1], [1.05, 1.18]);
  const imageX = useTransform(progress, [0, 1], [0, 32]);
  const glowX = useTransform(progress, [0, 1], [0, -80]);
  const cueOpacity = useTransform(progress, [0, 0.16], [1, 0]);

  const scrollToCollection = () => onNavigateSection('meet-your-sweet-side');

  return (
    <section
      ref={heroRef}
      id="welcome-to-toomakt"
      aria-label="Welcome to Toomakt"
      className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-[#f9f5f2] text-[#22120C]"
    >
      <motion.div
        style={{ x: glowX }}
        className="pointer-events-none absolute -left-32 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#E890A8]/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #22120C 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-72px)] max-w-[1600px] grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className={`relative flex flex-col justify-center px-6 pb-24 pt-28 sm:px-12 lg:px-[clamp(3rem,8vw,9rem)] lg:pb-20 lg:pt-20 ${isRtl ? 'text-right' : 'text-left'}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E890A8]"
          >
            <span className="h-px w-10 bg-[#E890A8]" />
            <span>{isRtl ? 'إرث حلو منذ ١٩٧٠' : 'A sweet legacy since 1970'}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl font-serif text-[clamp(3.4rem,7vw,7.4rem)] font-normal leading-[0.88] tracking-[-0.055em]"
          >
            {isRtl ? (
              <>
                حلاوةٌ
                <br />
                <span className="pr-8 italic text-[#E890A8] sm:pr-14">تُورَّث.</span>
              </>
            ) : (
              <>
                Heritage
                <br />
                <span className="pl-8 italic text-[#E890A8] sm:pl-14">worth sharing.</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 max-w-lg text-sm leading-7 text-[#22120C]/65 sm:text-base"
          >
            {isRtl
              ? 'نصنع التوفي والبونبوني المحشي بعناية، من وصفات عائلية تجمع بين المذاق الأصيل والجودة التي تصل إلى الأسواق العربية والدولية.'
              : 'Small-batch toffee and filled bonbons made with a family recipe, honest ingredients, and a taste that travels from Egypt to the world.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={onExploreSweets}
              className="group inline-flex items-center gap-3 rounded-full bg-[#22120C] px-6 py-3.5 text-sm font-medium text-white shadow-[0_12px_28px_rgba(34,18,12,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#E890A8]"
            >
              <span>{isRtl ? 'اكتشف تشكيلتنا' : 'Discover the collection'}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            <button
              type="button"
              onClick={scrollToCollection}
              className="group inline-flex items-center gap-2 rounded-full border border-[#22120C]/15 px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-1 hover:border-[#E890A8] hover:text-[#E890A8]"
            >
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-1" />
              <span>{isRtl ? 'تصفح القصة' : 'Explore the story'}</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#22120C]/10 pt-5 text-[10px] font-mono uppercase tracking-[0.12em] text-[#22120C]/50"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#E890A8]" />
              {isRtl ? 'توفي فاخر' : 'Premium toffee'}
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5 text-[#6AACE9]" />
              {isRtl ? 'أسواق عالمية' : 'Global markets'}
            </span>
            <span className="inline-flex items-center gap-2">
              <Heart className="h-3.5 w-3.5 text-[#E890A8]" />
              {isRtl ? 'صناعة عائلية' : 'Family made'}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: imageY }}
          className="relative min-h-[54svh] overflow-hidden lg:min-h-0"
        >
          <motion.img
            src="/images/figma/c736dc6cdbf982bcd40416b1b8b770e8459665ca.jpg"
            alt="TOOMAKT artisan confectionery"
            loading="eager"
            style={{ x: imageX, scale: imageScale }}
            className="absolute inset-[-4%] h-[108%] w-[108%] object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#22120C]/60 via-transparent to-[#22120C]/10" />
          <div className="absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-[#f9f5f2] to-transparent lg:block" />

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="absolute right-5 top-6 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#22120C] backdrop-blur-md sm:right-10 sm:top-10"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#E890A8]" />
            {isRtl ? 'سوريا ١٩٧٠ · مصر ٢٠١٢' : 'Syria 1970 · Egypt 2012'}
          </motion.div>

          <div className="absolute bottom-7 left-6 right-6 flex items-end justify-between text-white sm:bottom-10 sm:left-10 sm:right-10">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/65">
                {isRtl ? 'مصنوع بحب' : 'Made with heart'}
              </p>
              <p className="mt-2 font-serif text-2xl italic sm:text-3xl">
                {isRtl ? 'كل قطعة لها حكاية.' : 'Every piece has a story.'}
              </p>
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-white/65 sm:block">
              01 / 09
            </span>
          </div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        style={{ opacity: cueOpacity }}
        onClick={scrollToCollection}
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[#22120C]/55 transition-colors hover:text-[#E890A8] sm:bottom-7"
        aria-label={isRtl ? 'انتقل إلى المجموعة' : 'Scroll to the collection'}
      >
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.26em]">
          {isRtl ? 'مرر للاستكشاف' : 'Scroll to explore'}
        </span>
        <span className="relative h-8 w-px overflow-hidden bg-[#22120C]/20">
          <motion.span
            className="absolute left-0 top-0 h-1/2 w-full bg-[#E890A8]"
            animate={{ y: ['-100%', '220%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.button>
    </section>
  );
};

export default LandingFigmaHero;
