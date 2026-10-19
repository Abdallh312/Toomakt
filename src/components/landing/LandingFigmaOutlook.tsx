import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Award, Sparkles, Building, Globe } from 'lucide-react';

export const LandingFigmaOutlook: React.FC = () => {
  const { isRtl } = useLanguage();

  return (
    <section
      id="a-sweeter-outlook"
      className="relative w-full bg-[#FAF5EE] text-[#22120C] py-20 sm:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-label="About Al-Zahra and Toomakt"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Visual Story Frame + Authentic Heritage Stamp */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[440px] aspect-square"
          >
            {/* Circular Image Container with Soft Luxury Shadow */}
            <div className="w-full h-full rounded-full overflow-hidden shadow-[0_24px_50px_rgba(34,18,12,0.14)] border-4 border-white/80 relative group">
              <img
                src="/images/figma/e453f2f4a97917cec1153a363a37d08bb43b32ad.jpg"
                alt="Two hands passing a golden wrapped confection over a wooden cafe table"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                loading="lazy"
              />
            </div>

            {/* Overlaid Gold Circular Stamp */}
            <motion.div
              initial={{ scale: 0, rotate: 15 }}
              whileInView={{ scale: 1, rotate: 8 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.3 }}
              className="absolute -bottom-2 -right-2 sm:bottom-4 sm:-right-4 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#E4B880] text-[#22120C] flex flex-col items-center justify-center text-center p-3 shadow-[0_12px_32px_rgba(34,18,12,0.18)] border-2 border-[#FAF5EE]/60 pointer-events-none select-none"
            >
              <span className="font-serif italic font-bold text-xs sm:text-sm leading-tight">
                {isRtl ? (
                  <>
                    تاريخ الأجداد
                    <br />
                    يتوارثه الأبناء
                  </>
                ) : (
                  <>
                    Heritage of
                    <br />
                    Generations
                  </>
                )}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase opacity-75 mt-1 block">
                1970 · 2012
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: Company Story & Manifesto */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-7">
          <div className="space-y-2">
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[#963725] font-semibold block">
              {isRtl ? 'مَنْ نَحْنُ · شَرِكَةُ الزَّهْرَةِ لِلصِّنَاعَاتِ الغِذَائِيَّة' : 'WHO WE ARE · AL-ZAHRA FOOD INDUSTRIES'}
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.75rem] font-normal tracking-tight text-[#22120C] leading-[1.1]">
              {isRtl ? (
                <>
                  تَارِيخُ الأَجْدَادِ{' '}
                  <span className="italic font-light text-[#963725]">
                    يَتَوَارَثُهُ الأَبْنَاء.
                  </span>
                </>
              ) : (
                <>
                  A Generational Legacy,{' '}
                  <span className="italic font-light text-[#963725]">
                    Inherited Across Decades.
                  </span>
                </>
              )}
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#22120C]/80 font-light leading-relaxed max-w-2xl">
            <p>
              {isRtl
                ? 'منذ عام 1970، بدأت حكاية شركة الزهرة في سوريا، حاملةً إرثًا عائليًا وخبرة متوارثة في صناعة الحلويات عبر الأجيال. وفي عام 2012، امتدت مسيرتنا إلى مصر بافتتاح فرعنا بمدينة العاشر من رمضان، لنواصل رحلتنا في عالم الحلويات تحت علامتنا التجارية TOOMAKT – توماكت.'
                : 'Since 1970, the story of Al-Zahra began in Syria, carrying a family legacy and generational expertise in confectionery. In 2012, our journey expanded to Egypt with our manufacturing facility in 10th of Ramadan City, continuing our path under our trademark TOOMAKT.'}
            </p>

            <p>
              {isRtl
                ? 'نتخصص في صناعة التوفي والبونبوني المحشي، ونحرص على تقديم تشكيلة متنوعة من المنتجات والنكهات التي تجمع بين المذاق المميز وجودة التصنيع والأسعار المناسبة، لتلبية احتياجات مختلف العملاء والأسواق.'
                : 'We specialize in crafting toffees and filled bonbons, offering a wide array of products and flavors uniting distinguished taste, manufacturing excellence, and accessible value to satisfy all clients and markets.'}
            </p>

            <p>
              {isRtl
                ? 'في الزهرة، لا نصنع الحلويات فحسب، بل نواصل حكاية عائلية بدأت منذ عقود، وننقل خبرتها من جيل إلى جيل، بطموح مستمر نحو التطور والانتشار.'
                : 'At Al-Zahra, we do not merely make confectionery — we advance a family story started decades ago, transferring expertise from generation to generation with relentless ambition for growth.'}
            </p>
          </div>

          {/* Slogan Signature */}
          <div className="pt-2 border-t border-[#22120C]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="font-serif italic text-xl sm:text-2xl text-[#963725] tracking-wide block">
              {isRtl ? 'الزهرة – تاريخ الأجداد يتوارثه الأبناء.' : 'Al-Zahra – Heritage of Ancestors, Inherited by Generations.'}
            </span>

            <span className="text-xs font-mono text-[#963725] bg-[#E890A8]/15 border border-[#E890A8]/40 px-3 py-1 rounded-full font-medium shadow-xs">
              {isRtl ? 'فخر الصناعة المصرية' : 'Pride of Egyptian Industry'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFigmaOutlook;
