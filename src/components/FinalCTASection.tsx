import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, ArrowLeft, Truck, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FinalCTASectionProps {
  onShopNow: () => void;
  onWholesale?: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onShopNow,
  onWholesale,
}) => {
  const { t, isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-[#FAF6F0] border border-stone-200/90 p-8 sm:p-14 lg:p-16 overflow-hidden shadow-sm"
        >
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

          {/* Floating 3D candy preview */}
          <div className="absolute bottom-6 right-6 w-24 h-24 sm:w-36 sm:h-36 opacity-30 pointer-events-none hidden md:block">
            <img
              src="/images/3d_cutouts/1/1.webp"
              alt="3D toomakt Chew"
              className="w-full h-full object-contain filter drop-shadow-xl"
            />
          </div>

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/5 border border-stone-300/80 text-xs font-semibold text-[#8C4A15] mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#C26715]" />
              <span>{isRtl ? 'دفعة المعمل الطازجة جاهزة الآن' : 'Fresh Atelier Batch Ready Now'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#2B170E] tracking-tight leading-tight">
              {t('cta_title')}
            </h2>

            <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              {t('cta_subtitle')}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onShopNow}
                className="px-6 py-3.5 rounded-xl bg-[#2B170E] hover:bg-[#C26715] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('cta_btn_shop')}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>

              {onWholesale && (
                <button
                  type="button"
                  onClick={onWholesale}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Building2 className="w-4 h-4 text-stone-600" />
                  <span>{t('cta_btn_wholesale')}</span>
                </button>
              )}
            </div>

            {/* Quick Guarantees */}
            <div className="mt-10 pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-6 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C26715]" />
                <span>{isRtl ? 'شحن مبرد عازل لـ 27 محافظة' : 'Insulated cold delivery to 27 governorates'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>{isRtl ? 'دفع عند الاستلام كاش' : 'Cash on delivery available'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
