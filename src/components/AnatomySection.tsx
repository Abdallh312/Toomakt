import React, { useState } from 'react';
import { Apple, Milk, Sparkles, ShieldCheck, Flame, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const AnatomySection: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const [activeStepIndex, setActiveStepIndex] = useState(1);

  const pillars = [
    {
      step: isRtl ? 'المرحلة 01 • المصدر' : 'STEP 01 • SOURCING',
      title: isRtl ? 'بيوريه فواكه البساتين' : 'Real Orchard Fruit',
      description: isRtl
        ? 'بيوريه معصور على البارد من فواكه طبيعية طازجة. خالي تماماً من الألوان الصناعية أو المستخلصات الكيميائية.'
        : 'Cold-pressed purées made from peak-harvest fruit. Zero artificial dyes, synthetic extracts, or powdered flavorings.',
      highlight: isRtl ? 'تركيز بطيء للفاكهة الكاملة' : 'Whole fruit slow-reduction',
      icon: Apple,
      accent: '#C2293E'
    },
    {
      step: isRtl ? 'المرحلة 02 • الطهي' : 'STEP 02 • ALCHEMY',
      title: isRtl ? 'زبدة قشطة أوروبية' : 'Grass-Fed Butter',
      description: isRtl
        ? 'زبدة أوروبية فاخرة تُطهى ببطء فائق في مراجل نحاسية عند 245°F لاكتساب كراميل زبدي أصيل دون أن يعلق بالأسنان.'
        : 'Cultured dairy churned from pasture-grazed herds, slowly simmered in copper kettles at 245°F for authentic toasted caramel depth.',
      highlight: isRtl ? '84% نسبة دسم طبيعي' : '84% butterfat European grade',
      icon: Milk,
      accent: '#C26715'
    },
    {
      step: isRtl ? 'المرحلة 03 • التناغم' : 'STEP 03 • THE BALANCE',
      title: isRtl ? 'بلورات زهرة الملح' : 'Fleur de Sel Flakes',
      description: isRtl
        ? 'بلورات ملح طبيعية رقيقة تُضاف للمزيج الساخن لإبراز الحلاوة الطبيعية وتوليد قوام متوازن وساحر.'
        : 'Delicate mineral crystals hand-sprinkled into the hot batch to amplify natural sweetness and deliver a gentle balance.',
      highlight: isRtl ? 'بلورات ملح بحري طبيعية' : 'Hand-harvested sea minerals',
      icon: Sparkles,
      accent: '#DF9B35'
    },
    {
      step: isRtl ? 'المرحلة 04 • النقاء' : 'STEP 04 • CLEAN LABEL',
      title: isRtl ? 'صفر مواد حافظة' : 'Zero Preservatives',
      description: isRtl
        ? 'حفظ طبيعي نقي يعتمد كلياً على كراميل السكر الذهبي. خالي من الجلوتين، غير معدل وراثياً ومصنوع في دفعات محدودة.'
        : 'Naturally preserved strictly through golden cane sugar caramelization. Gluten-free, non-GMO, and crafted in micro batches.',
      highlight: isRtl ? 'نقاء حرفي 100%' : '100% Non-GMO Verified',
      icon: ShieldCheck,
      accent: '#2E7D32'
    }
  ];

  const chewStages = [
    {
      time: t('anatomy_stage1_time'),
      title: t('anatomy_stage1_title'),
      description: t('anatomy_stage1_desc'),
      accent: '#DF9B35'
    },
    {
      time: t('anatomy_stage2_time'),
      title: t('anatomy_stage2_title'),
      description: t('anatomy_stage2_desc'),
      accent: '#E89228'
    },
    {
      time: t('anatomy_stage3_time'),
      title: t('anatomy_stage3_title'),
      description: t('anatomy_stage3_desc'),
      accent: '#C2293E'
    },
    {
      time: t('anatomy_stage4_time'),
      title: t('anatomy_stage4_title'),
      description: t('anatomy_stage4_desc'),
      accent: '#C26715'
    }
  ];

  return (
    <section id="anatomy" className="py-24 bg-[#FAF6F0] relative overflow-hidden border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C26715] flex items-center justify-center gap-2 mb-3"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{t('anatomy_badge')}</span>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-black text-[#2B170E] tracking-tight leading-tight"
          >
            {t('anatomy_title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-[#6E5D52] leading-relaxed"
          >
            {t('anatomy_subtitle')}
          </motion.p>
        </div>

        {/* 4 Pillars Cards with Spring Hover Physics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{
                  y: -7,
                  transition: { type: 'spring', stiffness: 350, damping: 20 }
                }}
                className="bg-white rounded-2xl p-6 border border-[#E9E0D4] shadow-xs hover:shadow-xl hover:border-[#D5C1AE] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#8C7B71] uppercase">
                      {pillar.step}
                    </span>
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: pillar.accent }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#2B170E] group-hover:text-[#C26715] transition-colors leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#6B5A50] leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F5EDE3]">
                  <span className="text-[10px] font-semibold text-[#8C7B71] block">
                    {pillar.highlight}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* The 45-Second Interactive Sensory Journey */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#2B170E] text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 block mb-2">
              {isRtl ? 'تطور النكهة خلال 45 ثانية' : '45-Second Sensory Evolution'}
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              {isRtl ? 'كيف يذوب توفي توماكت داخل الفم دون التصاق؟' : 'How toomakt Dissolves Cleanly on the Palate'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {chewStages.map((stage, sIdx) => (
              <motion.div
                key={sIdx}
                onClick={() => setActiveStepIndex(sIdx)}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                  activeStepIndex === sIdx
                    ? 'bg-white/15 border-amber-400/80 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {stage.time}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: stage.accent }}
                  />
                </div>
                <h4 className="font-serif font-bold text-base text-white mb-2 leading-snug">
                  {stage.title}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-normal">
                  {stage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

