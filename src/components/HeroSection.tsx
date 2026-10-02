import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal, TextReveal } from './ScrollReveal';

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
    <section className="relative overflow-hidden bg-[#FAF7F2] pt-8 pb-14 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left rtl:text-right">
            {/* Subtle Eyebrow */}
            <ScrollReveal delay={0.05} yOffset={15}>
              <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3C1322]" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63]">
                  {isRtl ? 'حلوى توفي الفاكهة الحرفية' : 'ARTISANAL FRUIT TOFFEE'}
                </span>
              </div>
            </ScrollReveal>

            {/* Editorial Serif Heading with Text Reveal */}
            <ScrollReveal delay={0.12} yOffset={20}>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.1] font-normal text-[#1A1A1A] tracking-tight mb-4 sm:mb-6">
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
            </ScrollReveal>

            {/* Thoughtful Description */}
            <ScrollReveal delay={0.2} yOffset={20}>
              <p className="text-sm sm:text-base md:text-lg text-[#736B63] max-w-xl leading-relaxed mb-6 sm:mb-8 font-light">
                {isRtl
                  ? 'حلوى توفي غنية بطبقات الفواكه الحقيقية ولمسة زبدية أوروبية نقية. أعدت بعناية لتجربة استثنائية مع كل قطعة.'
                  : 'Layered fruit toffee with a clean finish. Made slowly in small batches for considered snacking.'}
              </p>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal delay={0.28} yOffset={15}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
                <button
                  onClick={onShopNow}
                  className="btn-primary w-full sm:w-auto text-center cursor-pointer shadow-soft hover:shadow-soft-md"
                >
                  <span>{isRtl ? 'استكشف المنتجات' : 'Explore The Products'}</span>
                </button>

                <button
                  onClick={handleProcessClick}
                  className="btn-link text-sm font-medium justify-center sm:justify-start py-2 sm:py-0 cursor-pointer"
                >
                  <span>{isRtl ? 'تعرف على طريقتنا ←' : 'Discover our process →'}</span>
                </button>
              </div>
            </ScrollReveal>

            {/* Trust Badges */}
            <ScrollReveal delay={0.35} yOffset={15}>
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#E8E2D7] grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <span className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    {isRtl ? 'بيوريه طبيعي 100%' : '100% Real Fruit'}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-[#736B63] mt-0.5 font-light">
                    {isRtl ? 'منتقى بعناية' : 'Sun-ripened purées'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    {isRtl ? 'زبدة أوروبية' : 'European Butter'}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-[#736B63] mt-0.5 font-light">
                    {isRtl ? 'قوام ناعم يذوب' : 'Rich golden caramel'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    {isRtl ? 'دفعات صغيرة' : 'Small Batches'}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-[#736B63] mt-0.5 font-light">
                    {isRtl ? 'في معاملنا بالقاهرة' : 'Artisanal craft'}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Hero Framing Image */}
          <div className="lg:col-span-6 relative w-full">
            <ScrollReveal delay={0.15} yOffset={25}>
              <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D7] bg-[#FAF7F2] shadow-soft-lg group aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[520px] w-full">
                <img
                  src="/images/hero/hero_spec.jpg"
                  alt="toomakt artisanal fruit toffee"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Minimal floating badge */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 rtl:left-auto rtl:right-4 rtl:sm:right-6 bg-[#FAF7F2]/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#E8E2D7] shadow-soft flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFD147]" />
                  <span className="text-[11px] sm:text-xs font-medium text-[#1A1A1A]">
                    {isRtl ? 'إصدار صيف 2026 الحرفي' : 'Atelier Release 2026'}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};
