import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { APPROACH_PILLARS } from '../data/toomaktData';
import { ScrollReveal } from './ScrollReveal';

interface BrandMissionSectionProps {
  onNavigateStory?: () => void;
}

export const BrandMissionSection: React.FC<BrandMissionSectionProps> = ({ onNavigateStory }) => {
  const { isRtl } = useLanguage();

  return (
    <section id="our-approach" className="py-16 sm:py-20 md:py-28 bg-[#FAF7F2] dark:bg-[#120D11] border-b border-[#E8E2D7] dark:border-[#33242E] scroll-mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Scroll Reveal */}
        <ScrollReveal yOffset={20}>
          <div className="text-left rtl:text-right mb-10 sm:mb-14 md:mb-18 max-w-2xl">
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] dark:text-[#C8BEB5] block mb-3">
              {isRtl ? 'طريقتنا الحرفية' : 'OUR APPROACH'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] tracking-tight leading-tight">
              {isRtl ? 'حلاوة أهدأ وأعمق.' : 'A quieter kind of sweet.'}
            </h2>
          </div>
        </ScrollReveal>

        {/* 3 Value Pillars with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {APPROACH_PILLARS.map((pillar, idx) => (
            <ScrollReveal key={pillar.number} delay={idx * 0.15} yOffset={25}>
              <div
                className="bg-[#F4EFEA] dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#1A1A1A] dark:hover:border-[#E8BD6D] hover:shadow-soft transition-all h-full"
              >
                <div>
                  <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#736B63]/60 dark:text-[#C8BEB5]/60 block mb-4 sm:mb-6">
                    {pillar.number}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] mb-3">
                    {isRtl ? pillar.arabicTitle : pillar.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#736B63] dark:text-[#C8BEB5] leading-relaxed font-light">
                    {isRtl ? pillar.arabicDescription : pillar.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
