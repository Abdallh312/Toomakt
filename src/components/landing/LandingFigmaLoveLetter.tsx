import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe2, Plane } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LandingFigmaLoveLetterProps {
  onDiscoverCollection: () => void;
}

export const LandingFigmaLoveLetter: React.FC<LandingFigmaLoveLetterProps> = ({
  onDiscoverCollection,
}) => {
  const { isRtl } = useLanguage();

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
    <section
      id="toffee-love-letter"
      className="relative w-full bg-white text-[#22120C] py-12 sm:py-20 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-label="Export and Global Presence"
    >
      <div className="max-w-7xl mx-auto rounded-3xl sm:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#6AACE9] to-[#E890A8] shadow-[0_20px_50px_rgba(106,172,233,0.25)] border border-white/30 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px] lg:min-h-[580px]">
          {/* Left Column: Macro Photograph */}
          <div className="lg:col-span-6 relative h-[360px] sm:h-[460px] lg:h-auto overflow-hidden group">
            <img
              src="/images/figma/6454d035653cd755b879267e237582d369f27168.jpg"
              alt="Artisanal toffee confections prepared for international export packaging"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            <div className="absolute top-6 left-6 rtl:left-auto rtl:right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 flex items-center gap-2 shadow-sm">
              <Globe2 className="w-3.5 h-3.5 text-[#6AACE9]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#22120C] font-semibold">
                {isRtl ? 'صادرات دولية معتمدة' : 'GLOBAL EXPORT CERTIFIED'}
              </span>
            </div>
          </div>

          {/* Right Column: Content Stage */}
          <div className="lg:col-span-6 flex flex-col justify-center py-14 sm:py-20 px-8 sm:px-14 lg:px-16 space-y-6">
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-white/85 font-semibold block">
              {isRtl ? 'آفَاقُ التَّصْدِيرِ وَالانْتِشَارِ الدَّوْلِيّ' : 'GLOBAL HORIZONS & EXPORT MARKETS'}
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-normal tracking-tight text-white leading-[1.08]">
              {isRtl ? (
                <>
                  مِنْ مِصْرَ إِلَى العَالَم:
                  <br />
                  <span className="italic font-light">حُلْوَانَا تَصِلُ لِقُلُوبِ المَلَايِين.</span>
                </>
              ) : (
                <>
                  From Egypt to the World:
                  <br />
                  <span className="italic font-light">Reaching Millions Globally.</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed max-w-lg">
              {isRtl
                ? 'وانطلاقًا من رؤيتنا للتوسع والوصول إلى أسواق جديدة، تمتد صادراتنا إلى عدد من الدول، منها اليمن والأردن وتركيا ولبنان والمملكة العربية السعودية ورومانيا، إلى جانب حضورنا القوي في السوق المصري.'
                : 'Driven by our vision to reach new horizons, our exports span across Saudi Arabia, Jordan, Yemen, Lebanon, Turkey, and Romania, alongside our deeply established presence in the Egyptian market.'}
            </p>

            {/* Country Tags */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/80 font-semibold block">
                {isRtl ? 'أَسْوَاقُ التَّصْدِيرِ النَّشِطَة:' : 'ACTIVE EXPORT DESTINATIONS:'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {exportCountries.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full border border-white/30 text-[11px] font-mono tracking-wide text-white bg-white/20 backdrop-blur-xs font-medium"
                  >
                    {isRtl ? c.ar : c.en}
                  </span>
                ))}
              </div>
            </div>

            {/* Pill CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onDiscoverCollection}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-[#6AACE9] hover:bg-[#E890A8] hover:text-white transition-all text-xs sm:text-sm font-sans font-medium cursor-pointer group shadow-md"
              >
                <span>{isRtl ? 'تواصل لفرص التصدير والشراكات' : 'Export & Distribution Enquiries'}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFigmaLoveLetter;
