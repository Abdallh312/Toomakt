import React from 'react';
import { Sparkles, Sun, CloudRain, Flame, Heart, Smile, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface BrandMissionSectionProps {
  onNavigateStory?: () => void;
}

export const BrandMissionSection: React.FC<BrandMissionSectionProps> = ({ onNavigateStory }) => {
  const { isRtl } = useLanguage();

  const badges = [
    { text: 'REAL FRUIT', arabic: 'فاكهة طبيعية', color: '#FFE842', rotate: -3 },
    { text: 'BIG FEELING', arabic: 'شعور غامر', color: '#4AD4DA', rotate: 2 },
    { text: 'no fake candy here', arabic: 'بدون أي كاندي مزيف', color: '#FF4D8D', rotate: -2, textColor: '#FFFFFF' },
    { text: '84% EUROPEAN BUTTER', arabic: '84% زبدة أوروبية', color: '#C4E86E', rotate: 3 },
    { text: '45-SECOND CHEW', arabic: 'مضغة 45 ثانية', color: '#FFB088', rotate: -1 }
  ];

  return (
    <section id="company" className="py-20 sm:py-28 bg-[#F5EFE6] border-b-2 border-[#1F1127] relative overflow-hidden text-center scroll-mt-20">
      {/* Background Graphic Accents */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Top Mini Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F1127] text-[#FFE842] text-[11px] font-black uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#FFE842]" />
          <span>{isRtl ? 'فلسفة الطهي في توماكت' : 'THE TOOMAKT PHILOSOPHY'}</span>
        </div>

        {/* Section Headline */}
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-[#1F1127] uppercase tracking-tight leading-[1.05] mb-6">
          {isRtl ? (
            <>نحول الفاكهة الطبيعية إلى <br /><span className="text-[#FF5E2B]">أنظمة طقس صغيرة</span> مليئة بالفرح.</>
          ) : (
            <>WE TURN FRUIT INTO <br /><span className="text-[#FF5E2B]">LITTLE WEATHER SYSTEMS.</span></>
          )}
        </h2>

        {/* Description Paragraph */}
        <p className="text-lg sm:text-2xl font-bold text-[#1F1127]/80 leading-relaxed max-w-2xl mx-auto mb-10">
          {isRtl
            ? 'تُصنع توماكت يدوياً في دفعات محدودة بقدور نحاسية فرنسية، ببيوريه فواكه طبيعي 100%، كراميل الزبدة الفاخرة، وألوان حية كافية لتغيير مزاج الغرفة بأكملها.'
            : 'Toomakt is handmade in small batches with real fruit flavors, buttery caramel, and enough color to change the mood of a room.'}
        </p>

        {/* Playful Floating Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto mb-10">
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1, rotate: 0 }}
              whileTap={{ scale: 0.95 }}
              className="badge-neo cursor-pointer shadow-neo transition-all select-none text-xs sm:text-sm py-2 px-4.5"
              style={{
                backgroundColor: badge.color,
                color: badge.textColor || '#1F1127',
                transform: `rotate(${badge.rotate}deg)`
              }}
            >
              <span>{isRtl ? badge.arabic : badge.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Explore Full Story Link Button */}
        {onNavigateStory && (
          <div>
            <button
              onClick={onNavigateStory}
              className="btn-neo bg-[#1F1127] text-[#FFE842] hover:bg-[#FF5E2B] hover:text-white px-6 py-3 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-neo transition-all"
            >
              <span>{isRtl ? 'استكشف قصتنا ومراحل الطهي النحاسي' : 'EXPLORE OUR STORY & COPPER ATELIER CRAFT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
