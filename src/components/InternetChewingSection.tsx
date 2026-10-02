import React from 'react';
import { Star, MessageCircle, Heart, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const InternetChewingSection: React.FC = () => {
  const { isRtl } = useLanguage();

  const reviews = [
    {
      id: 1,
      quote: '“The mango one tastes like a holiday.”',
      arabicQuote: '“نكهة المانجو طعمها زي إجازة على البحر.”',
      author: 'Maya',
      location: 'Cairo',
      badge: 'MANGO SUNBEAM',
      badgeColor: '#FFE842',
      stars: 5
    },
    {
      id: 2,
      quote: '“The box arrived looking like a tiny party.”',
      arabicQuote: '“البوكس وصل كأنه حفلة صغيرة مبهجة.”',
      author: 'Omar',
      location: 'Alexandria',
      badge: 'THE SUN CHASER',
      badgeColor: '#FF5E2B',
      stars: 5
    },
    {
      id: 3,
      quote: '“I bought it for a gift. Kept it.”',
      arabicQuote: '“اشتريته عشان أهديه لحد، أكلته كله ومقدرتش أقاوم.”',
      author: 'Lina',
      location: 'Giza',
      badge: 'BERRY AFTERGLOW',
      badgeColor: '#FF4D8D',
      stars: 5
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#C4E86E] text-[#1F1127] border-b-2 border-[#1F1127] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="badge-neo bg-[#1F1127] text-[#FFE842] mb-3">
            {isRtl ? 'آراء مجتمع توماكت' : 'COMMUNITY FEEDBACK'}
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#1F1127] leading-tight">
            {isRtl ? 'الإنترنت يتذوق ويمضغ بنهم.' : 'THE INTERNET IS CHEWING.'}
          </h2>
          <p className="mt-2 text-base sm:text-lg font-bold text-[#1F1127]/80">
            {isRtl ? 'آراء حقيقية من متذوقي الحلويات في القاهرة والإسكندرية والمحافظات' : 'Real bites, real reviews from candy lovers across Egypt.'}
          </p>
        </div>

        {/* 3 Speech-Bubble Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <motion.div
              key={rev.id}
              whileHover={{ y: -6, rotate: rev.id % 2 === 0 ? 1 : -1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-[#FFFDF5] rounded-2xl border-2 border-[#1F1127] shadow-neo hover:shadow-neo-lg transition-all p-6 sm:p-7 flex flex-col justify-between relative cursor-default"
            >
              {/* Star Rating & Flavor Badge */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FF5E2B] text-[#1F1127]" />
                    ))}
                  </div>

                  <span
                    className="badge-neo text-[9px] px-2 py-0.5"
                    style={{ backgroundColor: rev.badgeColor }}
                  >
                    {rev.badge}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="font-display text-xl sm:text-2xl font-black text-[#1F1127] leading-snug tracking-tight mb-6">
                  {isRtl ? rev.arabicQuote : rev.quote}
                </p>
              </div>

              {/* Author & Verification */}
              <div className="pt-4 border-t-2 border-[#1F1127]/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1F1127] text-[#FFE842] font-display font-black text-xs flex items-center justify-center border border-[#1F1127]">
                    {rev.author[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-sm text-[#1F1127]">
                      {rev.author}
                    </span>
                    <span className="text-[10px] font-mono text-[#1F1127]/60">
                      {rev.location}, Egypt
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#FF5E2B] uppercase">
                  VERIFIED BITE
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
