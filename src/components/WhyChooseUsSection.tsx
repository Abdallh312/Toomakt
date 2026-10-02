import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WhyChooseUsSection: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const advantages = [
    {
      icon: Flame,
      image3d: '/images/3d_cutouts/6/1.webp',
      title: isRtl ? 'طهي بمراجل نحاسية 245°F' : 'Small-Batch Copper Simmer',
      description: isRtl
        ? 'طهي بطيء ومتقن عند 245°F في مراجل نحاسية فرنسية للحصول على ملمس مخملي يذوب فوراً دون التصاق.'
        : 'Slow-cooked at 245°F in traditional kettles to yield a silky, non-sticky chew that dissolves effortlessly.',
      accent: '#D58218'
    },
    {
      icon: Sparkles,
      image3d: '/images/3d_cutouts/1/2.webp',
      title: isRtl ? 'بيوريه فواكه طبيعية 100%' : '100% Real Fruit Purées',
      description: isRtl
        ? 'عصر بارد لثمار البساتين مع أحماض الفاكهة الطبيعية. خالي من الملونات أو النكهات الصناعية.'
        : 'Cold-macerated orchard harvest with natural fruit acids. No artificial colors, preservatives, or synthetic extracts.',
      accent: '#C2293E'
    },
    {
      icon: Truck,
      image3d: '/images/3d_cutouts/4/1.webp',
      title: isRtl ? 'توصيل مبرد لـ 27 محافظة' : 'Egypt-Wide Express Delivery',
      description: isRtl
        ? 'شحنات معزولة ومبردة تصل لباب منزلك في جميع محافظات مصر خلال 24-48 ساعة لضمان ذروة الطزاجة.'
        : 'Insulated cold-chain parcels dispatched across all 27 governorates within 24 to 48 hours to preserve peak freshness.',
      accent: '#006F9E'
    },
    {
      icon: ShieldCheck,
      image3d: '/images/3d_cutouts/8/1.webp',
      title: isRtl ? 'طلب آمن ودفع موثوق' : 'Verified & Secure Ordering',
      description: isRtl
        ? 'دفع فوري عبر إنستاباي أو عند الاستلام، مع تأكيد فوري عبر واتساب وفاتورة رسمية من المعمل.'
        : 'Seamless checkout supporting verified InstaPay transfer and Cash on Delivery, backed by an instant WhatsApp invoice.',
      accent: '#DF9B35'
    },
  ];

  return (
    <section className="py-24 bg-white relative border-b border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FAF6F0] text-[#8C4A15] border border-amber-200/60 mb-3"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C26715]" />
            <span>{isRtl ? 'ميزة المعمل الحرفي' : 'The Atelier Advantage'}</span>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-stone-900 tracking-tight leading-tight"
          >
            {isRtl ? 'لماذا يفضل عشاق الحلويات معمل توماكت؟' : 'Why Confectionery Lovers Choose toomakt'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-normal"
          >
            {isRtl
              ? 'كل قطعة تُصنع يدوياً لتعيد تعريف النعومة، وعمق النكهة، والنقاء الحرفي الأصيل.'
              : 'Every piece is crafted to set a new benchmark for softness, flavor depth, and artisan purity.'}
          </motion.p>
        </div>

        {/* 4 Cards Grid with 3D Cutout Enhancements & Spring Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{
                  y: -6,
                  transition: { type: 'spring', stiffness: 350, damping: 20 }
                }}
                className="p-6 rounded-2xl bg-[#FAF6F0] border border-stone-200/90 shadow-2xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#C26715] shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* 3D Cutout Floating preview */}
                    <div className="w-12 h-12 relative">
                      <motion.img
                        src={item.image3d}
                        alt={item.title}
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 3.5 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-full h-full object-contain filter drop-shadow(0 6px 10px rgba(0,0,0,0.18)) group-hover:scale-120 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-2 group-hover:text-[#C26715] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-mono font-semibold text-stone-500">
                  <span>{isRtl ? `معيار 0${index + 1}` : `Standard 0${index + 1}`}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.accent }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

