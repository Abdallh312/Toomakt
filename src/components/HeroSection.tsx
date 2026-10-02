import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onShopNow: () => void;
  onExploreProcess?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopNow,
  onExploreProcess,
}) => {
  const { isRtl } = useLanguage();

  const handleProcessClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreProcess) {
      onExploreProcess();
    } else {
      const el = document.getElementById('our-approach');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] pt-8 pb-16 md:pt-16 md:pb-24 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center text-left rtl:text-right"
          >
            {/* Subtle Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3C1322]" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63]">
                {isRtl ? 'حلوى توفي الفاكهة الحرفية' : 'ARTISANAL FRUIT TOFFEE'}
              </span>
            </div>

            {/* Editorial Serif Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.08] font-normal text-[#1A1A1A] tracking-tight mb-6">
              {isRtl ? (
                <>
                  فاكهة طبيعية،<br />
                  <span className="italic font-normal">صُنعت ببطء.</span>
                </>
              ) : (
                <>
                  Fruit,<br />
                  <span className="italic font-normal">slowly made.</span>
                </>
              )}
            </h1>

            {/* Thoughtful Description */}
            <p className="text-base sm:text-lg text-[#736B63] max-w-xl leading-relaxed mb-8 font-light">
              {isRtl
                ? 'حلوى توفي غنية بطبقات الفواكه الحقيقية ولمسة زبدية أوروبية نقية. أعدت بعناية لتجربة استثنائية مع كل قطعة.'
                : 'Layered fruit toffee with a clean finish. Made slowly in small batches for considered snacking.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                onClick={onShopNow}
                className="btn-primary"
              >
                <span>{isRtl ? 'تسوق المجموعة' : 'Shop the collection'}</span>
              </button>

              <button
                onClick={handleProcessClick}
                className="btn-link text-sm font-medium"
              >
                <span>{isRtl ? 'تعرف على طريقتنا ←' : 'Discover our process →'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-[#E8E2D7] grid grid-cols-3 gap-4">
              <div>
                <span className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                  {isRtl ? 'بيوريه طبيعي 100%' : '100% Real Fruit'}
                </span>
                <span className="block text-[11px] text-[#736B63] mt-0.5">
                  {isRtl ? 'منتقى بعناية' : 'Sun-ripened purées'}
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                  {isRtl ? 'زبدة أوروبية' : 'European Butter'}
                </span>
                <span className="block text-[11px] text-[#736B63] mt-0.5">
                  {isRtl ? 'قوام ناعم يذوب' : 'Rich golden caramel'}
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                  {isRtl ? 'دفعات صغيرة' : 'Small Batches'}
                </span>
                <span className="block text-[11px] text-[#736B63] mt-0.5">
                  {isRtl ? 'في معاملنا بالقاهرة' : 'Artisanal craft'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Framing Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D7] bg-[#FAF7F2] shadow-soft-lg group">
              <img
                src="/images/hero/hero_spec.jpg"
                alt="toomakt artisanal fruit toffee"
                className="w-full h-[400px] sm:h-[480px] lg:h-[540px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Minimal floating badge */}
              <div className="absolute bottom-6 left-6 rtl:left-auto rtl:right-6 bg-[#FAF7F2]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#E8E2D7] shadow-soft flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFD147]" />
                <span className="text-xs font-medium text-[#1A1A1A]">
                  {isRtl ? 'إصدار صيف 2026 الحرفي' : 'Atelier Release 2026'}
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
