import React from 'react';
import { ArrowRight, ArrowLeft, Truck, ShieldCheck, Sparkles, Building2, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface BrandInvitationSectionProps {
  onShopProducts: () => void;
  onContactWholesale?: () => void;
}

export const BrandInvitationSection: React.FC<BrandInvitationSectionProps> = ({
  onShopProducts,
  onContactWholesale,
}) => {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 sm:py-24 md:py-32 bg-[#FAF7F2] border-b border-[#E8E2D7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal yOffset={30}>
          <div className="bg-[#F4EFEA] rounded-3xl border border-[#E8E2D7] p-8 sm:p-14 lg:p-16 relative overflow-hidden text-center sm:text-left rtl:sm:text-right shadow-soft">
            
            {/* Subtle Ambient Background Gradient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFECCC]/30 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              <div className="lg:col-span-7">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E2D7] text-xs font-semibold text-[#736B63] mb-6 shadow-soft">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3C1322]" />
                  <span>{isRtl ? 'حلوى صنعت لتؤكل بتمهل' : 'CONSIDERED CONFECTIONERY'}</span>
                </div>

                {/* Headline */}
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#1A1A1A] tracking-tight leading-tight mb-4">
                  {isRtl ? (
                    <>
                      طعم الفاكهة الحقيقية،<br />
                      <span className="italic font-normal">في أهدأ وأرقى صورة.</span>
                    </>
                  ) : (
                    <>
                      Confectionery made for<br />
                      <span className="italic font-normal">considered moments.</span>
                    </>
                  )}
                </h2>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-[#736B63] font-light leading-relaxed max-w-xl mb-8">
                  {isRtl
                    ? 'استمتع بتجربة التوفي الفاخر المصنوع ببطء من بيوريه الفاكهة الطبيعية وزبدة النورماندي. دفعات طازجة تُشحن مباشرة من معملنا في القاهرة.'
                    : 'Experience the quiet luxury of pure fruit purée and European butter slow-simmered in small copper batches in Cairo, Egypt.'}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    type="button"
                    onClick={onShopProducts}
                    className="btn-primary group flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shadow-soft hover:shadow-soft-md"
                  >
                    <span>{isRtl ? 'تسوق المنتجات الآن' : 'Shop Products Collection'}</span>
                    <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </button>

                  {onContactWholesale && (
                    <button
                      type="button"
                      onClick={onContactWholesale}
                      className="btn-secondary flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-xs"
                    >
                      <Building2 className="w-4 h-4 text-[#736B63]" />
                      <span>{isRtl ? 'هدايا الشركات والطلبات الخاصة' : 'Corporate Gifting & Inquiries'}</span>
                    </button>
                  )}
                </div>

                {/* Guarantees */}
                <div className="mt-10 pt-6 border-t border-[#E8E2D7] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#736B63] font-light">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Truck className="w-4 h-4 text-[#3C1322] shrink-0" />
                    <span>{isRtl ? 'شحن مبرد لكل محافظات مصر' : 'Climate delivery across Egypt'}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Package className="w-4 h-4 text-[#3C1322] shrink-0" />
                    <span>{isRtl ? 'تغليف هدايا فاخر ومحكم' : 'Individually sealed pieces'}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <ShieldCheck className="w-4 h-4 text-[#3C1322] shrink-0" />
                    <span>{isRtl ? 'ضمان رضا العملاء 100%' : '100% Quality guarantee'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Real Drive Confections Showcase */}
              <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="relative group p-2.5 bg-white rounded-3xl border border-[#E8E2D7] shadow-soft-lg overflow-hidden max-w-[380px]"
                >
                  <img
                    src="/images/drive_products/01_cappuccino_candies_shop.jpg"
                    alt="TooMakt Confectionery Collection"
                    className="w-full h-auto object-cover rounded-2xl filter group-hover:scale-102 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-5 right-5 rtl:right-auto rtl:left-5 bg-[#FAF7F2]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E2D7] text-[11px] font-mono uppercase tracking-wider text-[#3C1322] shadow-soft flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#FFD147]" />
                    <span>{isRtl ? 'دفعات طازجة من المعمل' : 'Fresh Cairo Batches'}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
