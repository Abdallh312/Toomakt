import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LandingFigmaRibbon: React.FC = () => {
  const { isRtl } = useLanguage();

  const phrasesEn = [
    'PROUDLY CRAFTED IN EGYPT',
    'ANCESTRAL HERITAGE PRESERVED',
    'AL-ZAHRA CONFECTIONERY INDUSTRIES · TOOMAKT',
    'MASTERS OF TOFFEE & FILLED BONBONS',
    'EXPORTING TO ARAB & GLOBAL MARKETS',
    'FAMILY LEGACY · SYRIA 1970 · EGYPT 2012',
  ];

  const phrasesAr = [
    'فَخُوراً بِالصِّنَاعَةِ المِصْرِيَّةِ',
    'تَارِيخُ الأَجْدَادِ يَتَوَارَثُهُ الأَبْنَاءُ',
    'شَرِكَةُ الزَّهْرَةِ لِلصِّنَاعَاتِ الغِذَائِيَّةِ · تُومَاكْت',
    'صِنَاعَةُ التُّوفِي وَالبُونْبُونِي المَحْشِيّ',
    'صَادِرَاتٌ لِأَسْوَاقٍ عَرَبِيَّةٍ وَدَوْلِيَّة',
    'إِرْثٌ عَائِلِيّ · سُورْيَا ١٩٧٠ · مِصْر ٢٠١٢',
  ];

  const phrases = isRtl ? phrasesAr : phrasesEn;

  return (
    <div
      className="relative w-full bg-[#E890A8] text-white py-3.5 sm:py-4 border-t border-b border-white/20 overflow-hidden shadow-xs select-none group"
      aria-label="Brand ribbon ticker"
    >
      <div className="flex w-full overflow-hidden" dir="ltr">
        {/* Track 1 */}
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10 whitespace-nowrap">
          {phrases.concat(phrases).map((phrase, idx) => (
            <div key={`track1-${idx}`} className="flex items-center gap-6 shrink-0" dir={isRtl ? 'rtl' : 'ltr'}>
              <span
                className={`font-sans text-xs sm:text-sm font-semibold text-white ${
                  isRtl ? 'tracking-normal' : 'tracking-[0.18em] uppercase'
                }`}
                style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
              >
                {phrase}
              </span>
              <span className="text-white/80 text-xs sm:text-sm font-serif select-none" aria-hidden="true">
                ✳
              </span>
            </div>
          ))}
        </div>

        {/* Track 2 (Identical for perfectly seamless continuous loop) */}
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10 whitespace-nowrap" aria-hidden="true">
          {phrases.concat(phrases).map((phrase, idx) => (
            <div key={`track2-${idx}`} className="flex items-center gap-6 shrink-0" dir={isRtl ? 'rtl' : 'ltr'}>
              <span
                className={`font-sans text-xs sm:text-sm font-semibold text-white ${
                  isRtl ? 'tracking-normal' : 'tracking-[0.18em] uppercase'
                }`}
                style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
              >
                {phrase}
              </span>
              <span className="text-white/80 text-xs sm:text-sm font-serif select-none" aria-hidden="true">
                ✳
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingFigmaRibbon;

