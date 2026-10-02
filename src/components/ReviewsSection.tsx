import React, { useState } from 'react';
import { Star, ShieldCheck, HeartHandshake, CheckCircle2, MessageSquareHeart, Sparkles, ZoomIn, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ReviewsSection: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const reviews = [
    {
      name: t('review1_author'),
      city: t('review1_city'),
      quote: t('review1_quote'),
      rating: 5,
      flavor: isRtl ? 'توفي الفواكه المشكلة' : 'Fruity Candy & Orchard Toffee'
    },
    {
      name: t('review2_author'),
      city: t('review2_city'),
      quote: t('review2_quote'),
      rating: 5,
      flavor: isRtl ? 'صندوق الحصاد الفاخر' : 'Luxury Harvest Box'
    },
    {
      name: t('review3_author'),
      city: t('review3_city'),
      quote: t('review3_quote'),
      rating: 5,
      flavor: isRtl ? 'توفي زبدة نورماندي' : 'Normandy Butter Toffee'
    }
  ];

  return (
    <section id="reviews" className="py-24 bg-[#FAF6F0] relative overflow-hidden border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C26715] flex items-center gap-1.5 mb-2">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{t('reviews_badge')}</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#2B170E] tracking-tight leading-tight">
              {t('reviews_title')}
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5DACD] text-xs font-semibold text-[#2E7D32] shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            <span>{isRtl ? '98.7% نسبة رضا عملاء مؤكدة في مصر' : '98.7% Verified Confectionery Satisfaction'}</span>
          </div>
        </div>

        {/* 3 Verified Egyptian Customer Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9E0D4] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#DF9B35] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-[#4A3B32] italic leading-relaxed font-normal mb-5">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2EAE0] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2B170E]">
                    {rev.name}
                  </h4>
                  <span className="text-xs text-stone-500 font-mono">
                    {rev.city}
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-[#C26715] bg-[#FAF5EE] px-2.5 py-1 rounded-full border border-amber-200/60">
                  {rev.flavor}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlighted Social Proof Showcase Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E0D4] shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image Showcase with Zoom */}
            <div className="lg:col-span-5 relative group cursor-pointer" onClick={() => setIsZoomOpen(true)}>
              <div className="aspect-square sm:aspect-4/3 rounded-2xl overflow-hidden border border-[#EAE0D4] bg-[#FAF5EE] shadow-xs relative">
                <img
                  src="/images/toomakt/social_proof_reviews.webp"
                  alt="toomakt Customer Feedback & Social Proof"
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-[#2B170E] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5" />
                    {isRtl ? 'تكبير آراء العملاء' : 'Click to Enlarge'}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-center text-[11px] text-[#8C7B71] flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C26715]" />
                <span>{isRtl ? 'آراء حقيقية من محبي الحلويات في مصر' : 'Real customer feedback across Egypt'}</span>
              </div>
            </div>

            {/* Right Context & Feedback Highlights */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF4E8] text-[#C26715] text-xs font-bold uppercase tracking-wider">
                <MessageSquareHeart className="w-4 h-4" />
                <span>{isRtl ? 'توثيق تجارب الذواقة' : 'Verified Social Proof'}</span>
              </div>

              <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#2B170E] leading-snug">
                {isRtl
                  ? 'لماذا يفضل عشاق الحلويات في مصر توماكت؟'
                  : 'Why Confectionery Lovers in Egypt Choose toomakt'}
              </h3>

              <p className="text-sm text-[#735F52] leading-relaxed">
                {isRtl
                  ? 'من الزبدة الأوروبية الفاخرة التي تذوب بسلاسة دون أن تلتصق بالأسنان، إلى بيوريه الفاكهة الطبيعية 100% والتغليف المبرد الذي يصل بحالته المثالية حتى باب المنزل.'
                  : 'From 84% European cultured butter that dissolves cleanly on the palate without sticking to teeth, to 100% real fruit purées and insulated cooler bags delivered nationwide.'}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2B170E]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>{isRtl ? 'لا يلتصق بالأسنان إطلاقاً' : 'Never sticks to teeth'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2B170E]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>{isRtl ? 'شحن مبرد لـ 27 محافظة' : 'Cooler shipping across Egypt'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2B170E]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>{isRtl ? 'زبدة قشطة طبيعية 100%' : '100% European butter'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2B170E]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>{isRtl ? 'دفع عند الاستلام كاش' : 'Cash on delivery'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Zoom */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-4 overflow-hidden">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src="/images/toomakt/social_proof_reviews.webp"
              alt="Enlarged Proof"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};
