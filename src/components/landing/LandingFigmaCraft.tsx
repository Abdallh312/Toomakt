import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Target, ShieldCheck, Heart, Sparkles, TrendingUp, Handshake, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LandingFigmaCraft: React.FC = () => {
  const { isRtl } = useLanguage();

  const values = [
    {
      num: '01',
      icon: Heart,
      titleEn: 'Family Heritage',
      titleAr: 'الإرث العائلي والخبرة المتوارثة',
      descEn: 'Authentic generational expertise in confectionery spanning from Syria 1970 to Egypt 2012.',
      descAr: 'خبرة عريقة متوارثة عبر الأجيال في صناعة الحلويات بدأت في سوريا عام 1970 وتواصلت في مصر.',
    },
    {
      num: '02',
      icon: ShieldCheck,
      titleEn: 'Product Quality',
      titleAr: 'الاهتمام بجودة المنتجات',
      descEn: 'Rigorous manufacturing standards, European recipes, and certified clean-label ingredients.',
      descAr: 'معايير تصنيع دقيقة ورقابة صحية صارمة تضمن أعلى درجات النقاء والسلامة الغذائية.',
    },
    {
      num: '03',
      icon: Sparkles,
      titleEn: 'Flavor Diversity',
      titleAr: 'التنوع في المنتجات والنكهات',
      descEn: 'A wide range of toffee, filled bonbons, and innovative fillings satisfying diverse palates.',
      descAr: 'تشكيلة غنية ومتجددة من التوفي والبونبوني المحشي بنكهات مبتكرة تلائم كافة الأذواق.',
    },
    {
      num: '04',
      icon: CheckCircle2,
      titleEn: 'Client Care',
      titleAr: 'الاهتمام بالعملاء وتلبية احتياجاتهم',
      descEn: 'Attentive responsiveness to consumer desires and tailored trade partner specifications.',
      descAr: 'الاستماع المستمر لتطلعات المستهلكين وتقديم حلول مرنة تلائم متطلبات الأسواق المختلفة.',
    },
    {
      num: '05',
      icon: TrendingUp,
      titleEn: 'Continuous Growth',
      titleAr: 'التطوير المستمر والتوسع في الأسواق',
      descEn: 'Ongoing investment in automated lines, expanded capacity, and entering new export countries.',
      descAr: 'تحديث دائم لخطوط الإنتاج والتوسع المستمر في الأسواق المحلية والدولية حول العالم.',
    },
    {
      num: '06',
      icon: Handshake,
      titleEn: 'Lasting Partnerships',
      titleAr: 'بناء شراكات طويلة الأمد',
      descEn: 'Solid, sustainable relationships with wholesalers, agents, and distributors worldwide.',
      descAr: 'علاقات عمل وثيقة ومستدامة قائمة على الثقة والمنفعة المتبادلة مع شبكة الموزعين والوكلاء.',
    },
  ];

  return (
    <section
      id="the-art-of-craft"
      className="relative w-full bg-[#FAF5EE] text-[#22120C] py-20 sm:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-label="Vision, Mission and Values"
    >
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
        {/* Top Split: Vision & Mission Cards */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[#963725] font-semibold block">
              {isRtl ? 'رُؤْيَتُنَا وَرِسَالَتُنَا' : 'OUR VISION & MISSION'}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#22120C]">
              {isRtl ? 'مَبَادِئُنَا الرَّاسِخَة، وَأُفُقُنَا المُسْتَقْبَلِيّ.' : 'Guiding Principles, Global Ambition.'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-[#22120C]/08 shadow-[0_12px_36px_rgba(34,18,12,0.04)] relative group hover:border-[#963725]/30 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#963725]/08 text-[#963725] flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 stroke-[1.8]" />
              </div>
              <span className="text-xs font-mono tracking-widest uppercase text-[#963725] font-semibold block mb-2">
                {isRtl ? 'رُؤْيَتُنَا' : 'OUR VISION'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#22120C] mb-4">
                {isRtl ? 'حُضُورٌ عَالَمِيّ لِعَلَامَةِ TOOMAKT' : 'Global Confectionery Leadership'}
              </h3>
              <p className="text-base sm:text-lg text-[#22120C]/75 font-light leading-relaxed">
                {isRtl
                  ? 'مواصلة التوسع في الأسواق المحلية والدولية، وتعزيز حضور العلامة التجارية TOOMAKT في عالم صناعة الحلويات.'
                  : 'Continuing our expansion across domestic and international markets, reinforcing the brand presence of TOOMAKT in the global confectionery sphere.'}
              </p>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-[#22120C]/08 shadow-[0_12px_36px_rgba(34,18,12,0.04)] relative group hover:border-[#963725]/30 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#963725]/08 text-[#963725] flex items-center justify-center mb-6">
                <Target className="w-6 h-6 stroke-[1.8]" />
              </div>
              <span className="text-xs font-mono tracking-widest uppercase text-[#963725] font-semibold block mb-2">
                {isRtl ? 'رِسَالَتُنَا' : 'OUR MISSION'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#22120C] mb-4">
                {isRtl ? 'المَذَاق، الجَوْدَة وَالسِّعْر المُنَاسِب' : 'Taste, Quality & Sustainable Value'}
              </h3>
              <p className="text-base sm:text-lg text-[#22120C]/75 font-light leading-relaxed">
                {isRtl
                  ? 'تقديم منتجات حلويات متنوعة تجمع بين المذاق المميز وجودة التصنيع والأسعار المناسبة، مع بناء علاقات مستدامة مع العملاء والشركاء.'
                  : 'Delivering diverse confectionery products uniting distinctive taste, manufacturing excellence, and competitive pricing, while forging sustainable partnerships.'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section: 6 Values Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#22120C]/10">
            <div>
              <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[#963725] font-semibold block mb-2">
                {isRtl ? 'قِيَمُنَا الأَسَاسِيَّة' : 'OUR CORE VALUES'}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#22120C]">
                {isRtl ? 'الرَّكَائِزُ الَّتِي نَبْنِي عَلَيْهَا نَجَاحَنَا.' : 'The Pillars That Anchor Our Success.'}
              </h3>
            </div>
            <span className="text-xs font-mono text-[#963725] bg-[#E58DA5]/20 border border-[#E58DA5]/40 px-3 py-1 rounded-full self-start sm:self-auto font-medium shadow-xs">
              {isRtl ? '٦ قِيَمٍ رَاسِخَة' : '6 Core Principles'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.num}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="p-7 rounded-3xl bg-white border border-[#22120C]/06 hover:border-[#E58DA5]/60 shadow-[0_6px_20px_rgba(34,18,12,0.03)] hover:shadow-[0_16px_36px_rgba(229,141,165,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl bg-[#963725]/08 text-[#963725] flex items-center justify-center">
                        <Icon className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <span className="font-mono text-xs text-[#22120C]/40 font-bold">{v.num}</span>
                    </div>

                    <h4 className="font-serif text-xl text-[#22120C] mb-2 leading-snug">
                      {isRtl ? v.titleAr : v.titleEn}
                    </h4>

                    <p className="text-xs sm:text-sm font-sans text-[#22120C]/70 font-light leading-relaxed">
                      {isRtl ? v.descAr : v.descEn}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFigmaCraft;
