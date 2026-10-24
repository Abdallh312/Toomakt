import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  Factory,
  Building2,
  MapPin,
  Phone,
  Sparkles,
  ArrowUpRight,
  Clock,
  Navigation,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LandingFigmaTrailProps {
  onAskBranches: () => void;
  onSelectBranchStop?: (stopId: string) => void;
}

export const LandingFigmaTrail: React.FC<LandingFigmaTrailProps> = ({
  onAskBranches,
}) => {
  const { isRtl } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 25, restDelta: 0.001 });
  const headerY = useTransform(progress, [0, 1], [35, -20]);
  const branchY = useTransform(progress, [0, 1], [55, -30]);
  const routeScale = useTransform(progress, [0.12, 0.86], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="our-branches-trail"
      className="relative w-full bg-white text-[#22120C] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-label="Toomakt Branches"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Section Header */}
        <motion.div style={{ y: headerY }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#22120C]/10">
          <div className="space-y-3.5 sm:space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] sm:text-xs font-mono uppercase text-[#E890A8] font-semibold block ${isRtl ? 'tracking-normal' : 'tracking-[0.25em]'}`}>
                {isRtl ? 'فُرُوعُ وَمَرَافِقُ تُومَاكْت' : 'TOOMAKT BRANCHES & ATELIER'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#E890A8] bg-[#E890A8]/20 border border-[#E890A8]/40 px-2.5 py-0.5 rounded-full font-medium">
                <Sparkles className="w-3 h-3 text-[#E890A8]" />
                <span>{isRtl ? 'فرع حالي · وفرع قادم' : '1 Active · 1 Coming Soon'}</span>
              </span>
            </div>

            <h2 className={`${isRtl ? 'font-sans font-bold text-2xl sm:text-3xl lg:text-4xl leading-[1.35]' : 'font-serif font-normal text-3xl sm:text-4xl lg:text-5xl leading-[1.15]'} tracking-tight text-[#22120C]`}>
              {isRtl ? 'فَرْعُنَا الحَالِي.. وَقَرِيباً فَرْعُنَا الثَّانِي.' : 'Our Flagship Branch.. And Coming Soon.'}
            </h2>
            <p className="text-xs sm:text-sm text-[#736B63] font-light max-w-xl pt-1">
              {isRtl
                ? 'نرحب بكم في فرعنا ومصنعنا الرئيسي بمدينة العاشر من رمضان، وترقبوا افتتاح فرعنا الثاني في القاهرة قريباً.'
                : 'Serving you at our flagship 10th of Ramadan plant, with our second Cairo branch opening soon.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onAskBranches}
            className="inline-flex items-center gap-2 self-start sm:self-auto px-6 py-3 rounded-full border border-[#22120C]/20 hover:border-[#6AACE9] hover:bg-[#6AACE9]/10 hover:text-[#6AACE9] text-[#22120C] text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer group"
          >
            <span>{isRtl ? 'تَوَاصَلْ مَعَ الإِدَارَة' : 'Contact Management'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#6AACE9]" />
          </button>
        </motion.div>

        {/* ─── 2 GRAND BRANCH CARDS: 1 CURRENT ACTIVE (SKY AZURE) & 1 COMING SOON (SWEET ROSE) ─── */}
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10 items-stretch">
          <motion.div
            style={{ scaleX: routeScale }}
            className="pointer-events-none absolute left-[8%] right-[8%] top-1/2 z-0 hidden h-px origin-left bg-gradient-to-r from-[#6AACE9] via-[#E890A8] to-[#6AACE9] md:block"
          />
          {/* Branch 1: Current Flagship Branch (10th of Ramadan - Styled with Confection Sky Azure #6AACE9) */}
          <motion.div
            style={{ y: branchY }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="group relative z-10 p-8 sm:p-10 rounded-3xl bg-white border border-[#22120C]/10 hover:border-[#6AACE9]/60 shadow-[0_12px_36px_rgba(34,18,12,0.05)] hover:shadow-[0_20px_45px_rgba(106,172,233,0.18)] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Card Header: Icon + Status Badge */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#6AACE9]/15 text-[#6AACE9] flex items-center justify-center transition-all group-hover:scale-105 group-hover:bg-[#6AACE9]/25">
                  <Factory className="w-7 h-7 stroke-[1.6]" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#6AACE9]/40 text-[#6AACE9] text-[11px] font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#6AACE9] animate-pulse" />
                  <span>{isRtl ? 'الفرع الرئيسي (مفتوح حالياً)' : 'FLAGSHIP · OPEN NOW'}</span>
                </div>
              </div>

              {/* Branch Name & Address */}
              <div>
                <span className="text-[10px] font-mono text-[#6AACE9] uppercase tracking-widest font-bold block mb-1">
                  {isRtl ? 'الفرع الأول · المجمع الصناعي والتصدير' : 'BRANCH 01 · INDUSTRIAL PLANT & EXPORTS'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#22120C] font-normal leading-snug">
                  {isRtl ? 'فرع ومصنع العاشر من رمضان' : '10th of Ramadan Flagship Complex'}
                </h3>
                <p className="text-xs sm:text-sm text-[#736B63] font-light leading-relaxed mt-2.5">
                  {isRtl
                    ? 'المنطقة الصناعية الثانية، شارع العروبة، بجوار الدفاع المدني، مدينة العاشر من رمضان، محافظة الشرقية، مصر.'
                    : '2nd Industrial Zone, Al-Orouba St., Next to Civil Defense, 10th of Ramadan City, Sharqia Governorate, Egypt.'}
                </p>
              </div>

              {/* Working Hours & Telephone */}
              <div className="space-y-2 pt-4 border-t border-[#22120C]/08 text-xs font-sans text-[#22120C]/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#6AACE9] shrink-0" />
                  <span>{isRtl ? 'السبت - الخميس: ٨:٠٠ ص - ٦:٠٠ م (مفتوح للعملاء والطلبات)' : 'Sat - Thu: 8:00 AM - 6:00 PM (Serving Clients & Orders)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#E890A8] shrink-0" />
                  <a href="tel:01024542139" className="font-mono font-bold text-[#E890A8] hover:underline" dir="ltr">
                    01024542139
                  </a>
                  <span className="text-[#736B63]">({isRtl ? 'الخط الساخن المباشر' : 'Direct Hotline'})</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-[#22120C]/08 flex flex-wrap items-center gap-3">
              <a
                href="tel:01024542139"
                className="btn-primary flex-1 py-3 px-5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 text-center"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{isRtl ? 'اتصال بالفرع: 01024542139' : 'Call Branch: 01024542139'}</span>
              </a>
              <a
                href="https://maps.google.com/?q=10th+of+Ramadan+City+Industrial+Zone"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-full border border-[#22120C]/20 hover:border-[#6AACE9] text-xs font-mono font-semibold text-[#22120C] hover:text-[#6AACE9] flex items-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#6AACE9]" />
                <span>{isRtl ? 'الموقع' : 'Directions'}</span>
              </a>
            </div>
          </motion.div>

          {/* Branch 2: Second Branch Coming Soon (Cairo - Styled with Sweet Rose #E890A8) */}
          <motion.div
            style={{ y: branchY }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative z-10 p-8 sm:p-10 rounded-3xl bg-[#FFFBFD] border-2 border-[#E890A8]/45 hover:border-[#E890A8] shadow-[0_12px_36px_rgba(232,144,168,0.10)] hover:shadow-[0_20px_45px_rgba(232,144,168,0.22)] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Card Header: Icon + Sweet Rose Status Badge */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#E890A8]/20 text-[#E890A8] flex items-center justify-center transition-all group-hover:scale-105">
                  <Building2 className="w-7 h-7 stroke-[1.6]" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E890A8]/25 border border-[#E890A8]/60 text-[#E890A8] text-[11px] font-mono font-bold tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#E890A8]" />
                  <span>{isRtl ? 'الفرع الثاني (قريباً)' : 'BRANCH 02 · COMING SOON'}</span>
                </div>
              </div>

              {/* Branch Name & Address */}
              <div>
                <span className="text-[10px] font-mono text-[#E890A8] uppercase tracking-widest font-bold block mb-1">
                  {isRtl ? 'الفرع الثاني · التوسع القادم' : 'BRANCH 02 · NEXT EXPANSION'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#22120C] font-normal leading-snug">
                  {isRtl ? 'فرع القاهرة (التجمع الخامس / مصر الجديدة)' : 'Cairo Flagship Atelier (Coming Soon)'}
                </h3>
                <p className="text-xs sm:text-sm text-[#736B63] font-light leading-relaxed mt-2.5">
                  {isRtl
                    ? 'القاهرة، جمهورية مصر العربية — التجهيزات الفنية والمعمارية جارية لافتتاح صالة عرض وتذوق تليق بضيوف وعشاق توماكت.'
                    : 'Cairo Governorate, Egypt — Final architectural preparations underway for our new tasting lounge and luxury gifting showroom.'}
                </p>
              </div>

              {/* Status Note */}
              <div className="p-4 rounded-2xl bg-white border border-[#E890A8]/30 space-y-1 text-xs text-[#22120C]">
                <div className="flex items-center gap-2 font-semibold text-[#E890A8]">
                  <Sparkles className="w-3.5 h-3.5 text-[#E890A8]" />
                  <span>{isRtl ? 'ترقبوا الافتتاح الرسمي قريباً' : 'Official Grand Opening Coming Soon'}</span>
                </div>
                <p className="text-[11px] text-[#736B63] leading-relaxed">
                  {isRtl
                    ? 'سيتم الإعلان عن موعد الافتتاح واستقبال أولى الطلبيات الخاصة قريباً عبر موقعنا الرسمي.'
                    : 'Stay tuned for the official launch date and priority tasting reservations.'}
                </p>
              </div>
            </div>

            {/* Inquire CTA */}
            <div className="pt-6 mt-6 border-t border-[#22120C]/08 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/201024542139?text=Hello%20Toomakt,%20I%20want%20to%20inquire%20about%20the%20Cairo%20branch!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-5 rounded-full bg-white hover:bg-[#E890A8]/20 border border-[#E890A8]/50 text-xs font-semibold text-[#E890A8] flex items-center justify-center gap-2 transition-colors text-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E890A8]" />
                <span>{isRtl ? 'استفسر عن موعد الافتتاح عبر واتساب' : 'Inquire via WhatsApp'}</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Official Corporate Identification Dossier Box */}
        <div className="p-7 sm:p-9 rounded-3xl bg-white border border-[#22120C]/08 shadow-[0_10px_30px_rgba(34,18,12,0.04)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#22120C]/50 uppercase tracking-widest block font-semibold">
                {isRtl ? 'الاسم القانوني للشركة' : 'LEGAL ENTITY'}
              </span>
              <p className="font-serif text-base text-[#22120C] font-normal">
                {isRtl ? 'الزهرة عبد العزيز محمد الخالد وشركاؤه' : 'Al-Zahra Abdulaziz M. Al-Khaled & Co.'}
              </p>
              <span className="text-xs text-[#E890A8] font-mono block">
                {isRtl ? 'شركة الزهرة للصناعات الغذائية' : 'Al-Zahra Food Industries'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#22120C]/50 uppercase tracking-widest block font-semibold">
                {isRtl ? 'العلامة التجارية' : 'REGISTERED TRADEMARK'}
              </span>
              <p className="font-serif text-lg text-[#E890A8] font-bold">
                TOOMAKT – توماكت
              </p>
              <span className="text-xs text-[#22120C]/65 font-sans block">
                {isRtl ? 'صناعة الحلويات، التوفي والبونبوني المحشي' : 'Toffee & Filled Bonbons'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#22120C]/50 uppercase tracking-widest block font-semibold">
                {isRtl ? 'بداية النشاط والتوسع' : 'CHRONOLOGY'}
              </span>
              <p className="font-serif text-base text-[#22120C]">
                {isRtl ? 'سوريا ١٩٧٠ · مصر ٢٠١٢' : 'Syria 1970 · Egypt 2012'}
              </p>
              <span className="text-xs text-[#22120C]/65 font-sans block">
                {isRtl ? 'تاريخ الأجداد يتوارثه الأبناء' : 'Ancestral Heritage Preserved'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#22120C]/50 uppercase tracking-widest block font-semibold">
                {isRtl ? 'عنوان المصنع الرسمي الحالي' : 'CURRENT FACTORY ADDRESS'}
              </span>
              <p className="font-sans text-xs text-[#22120C]/80 leading-relaxed">
                {isRtl
                  ? 'مصر، محافظة الشرقية، مدينة العاشر من رمضان، المنطقة الصناعية الثانية، شارع العروبة، بجوار الدفاع المدني.'
                  : 'Egypt, Sharqia Governorate, 10th of Ramadan City, 2nd Industrial Zone, Al-Orouba St., next to Civil Defense.'}
              </p>
            </div>
          </div>

          {/* Quick Hotline Strip */}
          <div className="mt-6 pt-5 border-t border-[#22120C]/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono text-[#22120C]/60 uppercase tracking-wider font-semibold">
                {isRtl ? 'أرقام الاتصال الرسمية:' : 'OFFICIAL CONTACT LINES:'}
              </span>
              <a
                href="tel:01024542139"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E890A8] text-white text-xs font-mono font-bold shadow-xs hover:bg-[#6AACE9] transition-colors"
              >
                <Phone className="w-3 h-3 text-white" />
                <span className="font-sans font-bold">{isRtl ? 'الرئيسي:' : 'Main:'}</span>
                <span dir="ltr">01024542139</span>
              </a>
              <a
                href="tel:+201095288014"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#6AACE9]/15 text-xs font-mono text-[#22120C]/80 hover:text-[#6AACE9] transition-colors border border-[#22120C]/08"
              >
                <Phone className="w-3 h-3 text-[#6AACE9]" />
                <span dir="ltr">+20 10 95288014</span>
              </a>
              <a
                href="tel:+201277664957"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#E890A8]/20 text-xs font-mono text-[#22120C]/80 hover:text-[#E890A8] transition-colors border border-[#22120C]/08"
              >
                <Phone className="w-3 h-3 text-[#E890A8]" />
                <span dir="ltr">+20 12 77664957</span>
              </a>
            </div>

            <a
              href="https://wa.me/201024542139?text=Hello%20Al-Zahra%20Toomakt!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 hover:text-emerald-800 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isRtl ? 'واتساب مباشر: 01024542139' : 'WhatsApp Hotline: 01024542139'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFigmaTrail;
