import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Sparkles, Star, Award, Heart, Globe } from 'lucide-react';
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

  return (
    <section
      id="welcome-to-toomakt"
      className="relative w-full bg-[#FAF5EE] text-[#22120C] pt-24 sm:pt-32 pb-20 sm:pb-28 px-6 sm:px-10 lg:px-16 overflow-hidden transition-colors"
      aria-label="Welcome to Toomakt"
    >
      {/* Soothing Ambient Light Pools with Dual Secondary Tones: Sweet Rose (#E890A8) & Sky Azure (#6AACE9) */}
      <div
        className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full pointer-events-none opacity-50 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(232, 144, 168, 0.22) 0%, rgba(250, 245, 238, 0) 70%)',
        }}
      />
      <div
        className="absolute top-1/3 left-10 w-[420px] h-[420px] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(106, 172, 233, 0.20) 0%, rgba(250, 245, 238, 0) 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(150, 55, 37, 0.10) 0%, rgba(250, 245, 238, 0) 70%)',
        }}
      />

      {/* Gentle Linen Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #22120C 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Hero Body Composition */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* Left Column: Headline, Narrative & CTA */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-7">
          {/* Eyebrow Pill: فخر الصناعة المصرية with Sweet Rose Accent */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E890A8]/15 border border-[#E890A8]/45 text-[#963725] text-[11px] sm:text-xs font-mono font-semibold tracking-widest uppercase shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E890A8]" />
            <span>
              {isRtl
                ? 'فَخْرُ الصِّنَاعَةِ المِصْرِيَّة · شَرِكَةُ الزَّهْرَةِ لِلصِّنَاعَاتِ الغِذَائِيَّة'
                : 'PRIDE OF EGYPTIAN INDUSTRY · AL-ZAHRA FOOD INDUSTRIES'}
            </span>
          </motion.div>

          {/* Monumental Headline: تاريخ الأجداد يتوارثه الأبناء */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl lg:text-[5rem] font-normal tracking-tight text-[#22120C] leading-[1.06]"
          >
            {isRtl ? (
              <>
                تَارِيخُ الأَجْدَادِ
                <br />
                <span className="italic font-light text-[#963725]">
                  يَتَوَارَثُهُ الأَبْنَاء.
                </span>
              </>
            ) : (
              <>
                Heritage of Ancestors,
                <br />
                <span className="italic font-light text-[#963725]">
                  Inherited by Generations.
                </span>
              </>
            )}
          </motion.h1>

          {/* Authentic Narrative Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-[#22120C]/80 font-light leading-relaxed max-w-xl"
          >
            {isRtl
              ? 'شركة الزهرة للصناعات الغذائية، صاحبة العلامة التجارية TOOMAKT – توماكت، هي شركة عائلية بدأت مسيرتها في سوريا عام 1970، وافتتحت فرعها في مصر عام 2012 بمدينة العاشر من رمضان. نتخصص في صناعة التوفي والبونبوني المحشي، ونقدم منتجات تجمع بين المذاق المميز والجودة العالية والأسعار المناسبة، مع امتداد صادراتنا إلى أسواق عربية ودولية.'
              : 'Al-Zahra Food Industries, owner of the TOOMAKT brand, is a family enterprise founded in Syria in 1970 and established in Egypt in 2012 (10th of Ramadan City). Specialized in crafting premium toffees and filled bonbons uniting distinguished taste, certified quality, and accessible value across global export markets.'}
          </motion.p>

          {/* 3 Authentic Trust Chips with Dual Secondary Colors */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-sans text-[#22120C]/75"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 border border-[#E890A8]/30 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#E890A8]" />
              <span>{isRtl ? 'توفي وبونبوني محشي فاخر' : 'Premium Toffee & Filled Bonbons'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 border border-[#6AACE9]/40 shadow-xs">
              <Globe className="w-3 h-3 text-[#6AACE9]" />
              <span className="font-medium text-[#22120C]">{isRtl ? 'صادرات لأسواق عربية ودولية' : 'Arab & Global Exports'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 border border-[#963725]/20 shadow-xs">
              <Heart className="w-3 h-3 text-[#963725]" />
              <span>{isRtl ? 'إرث عائلي متوارث منذ ١٩٧٠' : 'Family Heritage Since 1970'}</span>
            </span>
          </motion.div>

          {/* CTA & Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-3 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6"
          >
            <button
              type="button"
              onClick={onExploreSweets}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#963725] hover:bg-[#822E1E] text-[#FAF5EE] font-medium text-sm sm:text-base shadow-[0_8px_24px_rgba(150,55,37,0.22)] hover:shadow-[0_12px_32px_rgba(232,144,168,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer group will-change-transform"
            >
              <span>{isRtl ? 'تصفح منتجات توماكت' : 'Explore our sweets'}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateSection('meet-your-sweet-side')}
              className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full border border-[#22120C]/15 hover:border-[#6AACE9] hover:bg-[#F0F7FD] text-[#22120C] text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-300 ease-out cursor-pointer group"
            >
              <ArrowDown className="w-3.5 h-3.5 text-[#6AACE9] transition-transform group-hover:translate-y-0.5" />
              <span>{isRtl ? 'اِسْتَكْشِفِ التَّشْكِيلَة' : 'EXPLORE COLLECTION'}</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Hero Confectionery Showcase Canvas */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative w-full max-w-[480px]"
          >
            {/* Elegant Luxury Frame with Soft Shadow */}
            <div className="relative rounded-3xl sm:rounded-[2.5rem] p-2.5 sm:p-3.5 bg-white/70 backdrop-blur-md border border-[#22120C]/08 shadow-[0_24px_60px_-15px_rgba(34,18,12,0.10)] group">
              <div className="relative aspect-[4/4.5] sm:aspect-square w-full rounded-2xl sm:rounded-[2rem] overflow-hidden bg-[#FAF5EE]">
                <img
                  src="/images/figma/c736dc6cdbf982bcd40416b1b8b770e8459665ca.jpg"
                  alt="TOOMAKT authentic confectionery still life"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  loading="eager"
                />

                {/* Subtle soft warm inner glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#22120C]/35 via-transparent to-transparent pointer-events-none" />

                {/* Floating Heritage Badge in top right */}
                <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#22120C]/08 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-[#22120C]/80 font-medium">
                    {isRtl ? 'سُورْيَا ١٩٧٠ · مِصْر ٢٠١٢' : 'SYRIA 1970 · EGYPT 2012'}
                  </span>
                </div>

                {/* Bottom Trust Note: Exports & 10th of Ramadan */}
                <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-[#22120C]/08 shadow-sm text-[#22120C]">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#963725]" />
                    <span className="text-xs font-mono font-bold text-[#22120C]">TOOMAKT</span>
                  </div>
                  <span className="text-[11px] font-sans text-[#22120C]/75 font-light">
                    {isRtl ? 'العاشر من رمضان · صادرات لأكثر من ٦ دول' : '10th of Ramadan · 6+ Global Markets'}
                  </span>
                </div>
              </div>
            </div>

            {/* Overlaid Terracotta Seal ("تاريخ الأجداد يتوارثه الأبناء") */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: -10 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 sm:bottom-2 sm:-left-6 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#963725] text-[#FAF5EE] flex items-center justify-center text-center p-3 shadow-[0_12px_28px_rgba(150,55,37,0.32)] border-2 border-[#FAF5EE]/30 pointer-events-none select-none"
            >
              <span className="font-serif italic text-xs sm:text-sm leading-tight">
                {isRtl ? (
                  <>
                    الزَّهْرَة
                    <br />
                    تُومَاكْت
                    <br />
                    <span className="text-[9px] font-mono opacity-80 not-italic block mt-0.5">١٩٧٠</span>
                  </>
                ) : (
                  <>
                    Al-Zahra
                    <br />
                    TOOMAKT
                    <br />
                    <span className="text-[9px] font-mono opacity-80 not-italic block mt-0.5">Est. 1970</span>
                  </>
                )}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingFigmaHero;
