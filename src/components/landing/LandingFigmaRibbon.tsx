import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LandingFigmaRibbon: React.FC = () => {
  const { isRtl } = useLanguage();

  const phrasesEn = [
    'PRIDE OF EGYPTIAN INDUSTRY',
    'HERITAGE OF ANCESTORS INHERITED BY GENERATIONS',
    'AL-ZAHRA FOOD INDUSTRIES · TOOMAKT',
    'MASTERS OF TOFFEE & FILLED BONBONS',
    'EXPORTING TO ARAB & GLOBAL MARKETS',
    'FAMILY LEGACY · SYRIA 1970 · EGYPT 2012',
  ];

  const phrasesAr = [
    'فَخْرُ الصِّنَاعَةِ المِصْرِيَّة',
    'تَارِيخُ الأَجْدَادِ يَتَوَارَثُهُ الأَبْنَاء',
    'شَرِكَةُ الزَّهْرَةِ لِلصِّنَاعَاتِ الغِذَائِيَّة · تُومَاكْت',
    'صِنَاعَةُ التُّوفِي وَالبُونْبُونِي المَحْشِيّ',
    'صَادِرَاتٌ لِأَسْوَاقٍ عَرَبِيَّةٍ وَدَوْلِيَّة',
    'إِرْثٌ عَائِلِيّ · سُورْيَا ١٩٧٠ · مِصْر ٢٠١٢',
  ];

  const phrases = isRtl ? phrasesAr : phrasesEn;

  return (
    <div
      className="relative w-full bg-[#E890A8] text-white py-4 sm:py-5 border-t border-b border-white/20 overflow-hidden shadow-xs"
      aria-label="Brand ribbon ticker"
    >
      <div className="flex w-full overflow-hidden select-none">
        <div className="flex shrink-0 animate-marquee items-center gap-12 whitespace-nowrap">
          {phrases.concat(phrases).map((phrase, idx) => (
            <div key={idx} className="flex items-center gap-8">
              <span className="font-mono text-xs sm:text-sm tracking-[0.25em] font-semibold text-white uppercase">
                {phrase}
              </span>
              <span className="text-white text-xs sm:text-sm font-serif">✳</span>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 animate-marquee2 items-center gap-12 whitespace-nowrap" aria-hidden="true">
          {phrases.concat(phrases).map((phrase, idx) => (
            <div key={`clone-${idx}`} className="flex items-center gap-8">
              <span className="font-mono text-xs sm:text-sm tracking-[0.25em] font-semibold text-white uppercase">
                {phrase}
              </span>
              <span className="text-white text-xs sm:text-sm font-serif">✳</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingFigmaRibbon;
