import React, { useState } from 'react';
import { Star, ShieldCheck, ZoomIn, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { REVIEWS } from '../data/toomaktData';

export const ReviewsSection: React.FC = () => {
  const { isRtl } = useLanguage();
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <section id="reviews" className="py-20 md:py-28 bg-[#FAF7F2] border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 text-left rtl:text-right">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#736B63] block mb-3">
              {isRtl ? 'آراء وتجارب' : 'TESTIMONIALS'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] tracking-tight">
              {isRtl ? 'محبوبة في جميع أنحاء القاهرة.' : 'Loved across Cairo.'}
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D7] text-xs text-[#736B63]">
            <ShieldCheck className="w-4 h-4 text-[#88C057]" />
            <span>{isRtl ? 'أكثر من 2,400 عميل موثق في مصر' : 'Over 2,400 verified client reviews'}</span>
          </div>
        </div>

        {/* 3 Verified Client Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D7] hover:border-[#1A1A1A] hover:shadow-soft transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#FFD147] mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-[#1A1A1A] font-light leading-relaxed mb-6">
                  "{rev.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E2D7] flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-normal text-[#1A1A1A]">
                    {rev.author}
                  </h4>
                  <span className="text-xs text-[#736B63]">
                    {rev.location}
                  </span>
                </div>

                <span className="text-[11px] text-[#736B63] bg-[#F4EFEA] px-2.5 py-1 rounded-full border border-[#E8E2D7]">
                  {rev.productTag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D7] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div
              className="lg:col-span-5 relative group cursor-pointer"
              onClick={() => setIsZoomOpen(true)}
            >
              <div className="aspect-4/3 rounded-xl overflow-hidden border border-[#E8E2D7] bg-[#FAF7F2] relative">
                <img
                  src="/images/toomakt/social_proof_reviews.webp"
                  alt="toomakt Customer Feedback"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-[#FAF7F2] text-[#1A1A1A] text-xs font-medium px-3.5 py-1.5 rounded-full shadow-soft flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5" />
                    {isRtl ? 'تكبير الصورة' : 'Click to enlarge'}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 text-left rtl:text-right">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#736B63] block mb-2">
                {isRtl ? 'شهادات حقيقية' : 'UNFILTERED FEEDBACK'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A1A] mb-3">
                {isRtl
                  ? 'من محبي الحلويات الحرفية في الزمالك والمعادي والتجمع.'
                  : 'From fruit toffee lovers in Zamalek, Maadi, and New Cairo.'}
              </h3>
              <p className="text-xs sm:text-sm text-[#736B63] font-light leading-relaxed mb-6">
                {isRtl
                  ? 'كل رسالة شكر وملاحظة من عملائنا تلهمنا لنستمر في صنع دفعاتنا بالصبر والحرص ذاتهما.'
                  : 'Every WhatsApp note, tagged unboxing, and repeat order fuels our kitchen to keep crafting each batch with the same meticulous care.'}
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-[#1A1A1A] font-medium">
                <div>✓ {isRtl ? 'توصيل خلال 24-48 ساعة' : '24-48h Delivery'}</div>
                <div>✓ {isRtl ? 'تغليف حراري واقٍ' : 'Climate-Packaged'}</div>
                <div>✓ {isRtl ? 'دفع عند الاستلام' : 'Pay on Delivery'}</div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-[#1A1A1A] shadow-soft"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src="/images/toomakt/social_proof_reviews.webp"
              alt="Full reviews proof"
              className="max-h-[85vh] w-auto object-contain rounded-xl mx-auto"
            />
          </div>
        </div>
      )}
    </section>
  );
};
