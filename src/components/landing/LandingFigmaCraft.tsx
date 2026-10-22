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
      className="relative w-full bg-white text-[#22120C] py-20 sm:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-label="Vision, Mission and Values"
    >
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
        {/* Top Split: Vision & Mission Cards */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[#E890A8] font-semibold block">
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
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-[#22120C]/08 shadow-[0_12px_36px_rgba(34,18,12,0.04)] relative group hover:border-[#E890A8]/40 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E890A8]/15 text-[#E890A8] flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 stroke-[1.8]" />
              </div>
              <span className="text-xs font-mono tracking-widest uppercase text-[#E890A8] font-semibold block mb-2">
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
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-[#22120C]/08 shadow-[0_12px_36px_rgba(34,18,12,0.04)] relative group hover:border-[#6AACE9]/40 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#6AACE9]/15 text-[#6AACE9] flex items-center justify-center mb-6">
                <Target className="w-6 h-6 stroke-[1.8]" />
              </div>
              <span className="text-xs font-mono tracking-widest uppercase text-[#6AACE9] font-semibold block mb-2">
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
              <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[#E890A8] font-semibold block mb-2">
                {isRtl ? 'قِيَمُنَا الأَسَاسِيَّة' : 'OUR CORE VALUES'}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#22120C]">
                {isRtl ? 'الرَّكَائِزُ الَّتِي نَبْنِي عَلَيْهَا نَجَاحَنَا.' : 'The Pillars That Anchor Our Success.'}
              </h3>
            </div>
            <span className="text-xs font-mono text-[#E890A8] bg-[#E890A8]/20 border border-[#E890A8]/45 px-3 py-1 rounded-full self-start sm:self-auto font-medium shadow-xs">
              {isRtl ? '٦ قِيَمٍ رَاسِخَة' : '6 Core Principles'}
            </span>
          </div>

          <div className="relative">
            <div className="absolute bottom-6 left-5 top-6 w-px bg-gradient-to-b from-[#E890A8] via-[#6AACE9] to-[#E890A8] sm:left-1/2 sm:-translate-x-1/2" />
            <div className="space-y-5 sm:space-y-8">
              {values.map((value, idx) => {
                const Icon = value.icon;
                const isBlue = idx % 2 !== 0;
                return (
                  <motion.article
                    key={value.num}
                    initial={{ opacity: 0, y: 34, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ amount: 0.2, margin: '-8% 0px -8% 0px' }}
                    transition={{ duration: 0.65, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4 }}
                    className={`relative ml-10 overflow-hidden rounded-[1.5rem] border bg-white p-6 shadow-[0_10px_30px_rgba(34,18,12,0.04)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(34,18,12,0.1)] sm:ml-0 sm:w-[calc(50%-2rem)] sm:p-8 ${
                      idx % 2 === 0 ? 'sm:mr-auto' : 'sm:ml-auto'
                    }`}
                  >
                    <span
                      className={`absolute top-0 h-1 w-24 ${idx % 2 === 0 ? 'left-0' : 'right-0'}`}
                      style={{ backgroundColor: isBlue ? '#6AACE9' : '#E890A8' }}
                    />
                    <span
                      className={`absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white text-white shadow-md sm:flex ${
                        idx % 2 === 0 ? '-left-[3.05rem] sm:-right-[4.55rem] sm:left-auto' : '-left-[3.05rem] sm:-left-[4.55rem]'
                      }`}
                      style={{ backgroundColor: isBlue ? '#6AACE9' : '#E890A8' }}
                    >
                      <span className="font-mono text-[9px] font-bold">{value.num}</span>
                    </span>
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                        style={{
                          color: isBlue ? '#6AACE9' : '#E890A8',
                          backgroundColor: isBlue ? 'rgba(106,172,233,.13)' : 'rgba(232,144,168,.13)',
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#22120C]/35">
                        {isRtl ? 'قيمة أساسية' : 'Core value'}
                      </span>
                    </div>
                    <h4 className="mt-7 font-serif text-2xl leading-tight text-[#22120C] sm:text-3xl">
                      {isRtl ? value.titleAr : value.titleEn}
                    </h4>
                    <p className="mt-3 text-sm leading-7 text-[#22120C]/65 sm:text-base">
                      {isRtl ? value.descAr : value.descEn}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFigmaCraft;
