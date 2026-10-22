import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutViewProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onNavigateFactory: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigateHome,
  onNavigateShop,
  onNavigateFactory,
}) => {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const milestones = [
    {
      num: '1970',
      titleAr: 'تأسيس شركة الزهرة في سوريا',
      titleEn: 'Founding of Al-Zahra in Syria',
      descAr: 'انطلاق المسيرة العائلية في سوريا، حاملةً إرثاً عريقاً وخبرة متوارثة في صناعة الحلويات عبر الأجيال.',
      descEn: 'The family journey began in Syria, carrying generational expertise and passion for artisan confectionery.',
    },
    {
      num: '2012',
      titleAr: 'انطلاق النشاط في مصر وافتتاح مجمع العاشر من رمضان',
      titleEn: 'Expansion to Egypt & 10th of Ramadan Facility',
      descAr: 'افتتاح فرع الشركة بمصر بمدينة العاشر من رمضان ومواصلة رحلة الحلويات تحت العلامة التجارية TOOMAKT – توماكت.',
      descEn: 'Inaugurated our Egypt complex in 10th of Ramadan City, continuing our path under the TOOMAKT brand.',
    },
    {
      num: '2018',
      titleAr: 'الريادة في صناعة التوفي والبونبوني المحشي',
      titleEn: 'Masters of Toffee & Filled Bonbons',
      descAr: 'تطوير خطوط تصنيع التوفي والبونبوني المحشي بمذاق مميز وجودة تصنيع عالية وأسعار مناسبة.',
      descEn: 'Advancing specialized manufacturing lines for toffee and filled bonbons combining premium taste and accessible value.',
    },
    {
      num: '2021',
      titleAr: 'امتداد الصادرات إلى الأسواق العربية والدولية',
      titleEn: 'Export Expansion Across Global Markets',
      descAr: 'تصدير منتجات توماكت إلى المملكة العربية السعودية، الأردن، اليمن، لبنان، تركيا ورومانيا بالإضافة للسوق المصري.',
      descEn: 'Extending exports to Saudi Arabia, Jordan, Yemen, Lebanon, Turkey, and Romania alongside the Egyptian market.',
    },
    {
      num: '2026',
      titleAr: 'تاريخ الأجداد يتوارثه الأبناء — رؤية التوسع المستمر',
      titleEn: 'Ancestral Heritage Transmitted Across Generations',
      descAr: 'بناء شراكات طويلة الأمد مع تجار الجملة والموزعين والوكلاء في مصر وحول العالم.',
      descEn: 'Forging enduring trade partnerships with wholesalers, agents, and distributors worldwide.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white pt-28 sm:pt-36 pb-24 text-[#22120C]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#22120C]/60 mb-8">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-[#E890A8] transition-colors cursor-pointer"
          >
            {isRtl ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-[#E890A8] font-semibold">
            {isRtl ? 'قصتنا وحرفتنا' : 'Our Story & Heritage'}
          </span>
        </div>

        {/* Hero Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <p className="font-serif italic text-[#E890A8] text-lg sm:text-xl mb-3">
            {isRtl ? 'شركة الزهرة للصناعات الغذائية · فخر الصناعة المصرية' : 'Al-Zahra Food Industries · Pride of Egyptian Industry'}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#22120C] leading-[1.08] mb-6">
            {isRtl
              ? 'تَارِيخُ الأَجْدَادِ يَتَوَارَثُهُ الأَبْنَاء: حِكَايَةُ عِشْقٍ لِلحَلْوَى بَدَأَتْ مُنْذُ عَامِ ١٩٧٠.'
              : 'Ancestral heritage passed down through generations: confectionery passion since 1970.'}
          </h1>
          <p className="text-sm sm:text-base text-[#22120C]/75 leading-relaxed font-light">
            {isRtl
              ? 'منذ عام 1970، بدأت حكاية شركة الزهرة في سوريا، حاملةً إرثًا عائليًا وخبرة متوارثة في صناعة الحلويات عبر الأجيال. وفي عام 2012، امتدت مسيرتنا إلى مصر بافتتاح فرعنا بمدينة العاشر من رمضان، لنواصل رحلتنا في عالم الحلويات تحت علامتنا التجارية TOOMAKT – توماكت. نتخصص في صناعة التوفي والبونبوني المحشي بمذاق مميز وجودة تصنيع وأسعار تنافسية.'
              : 'Founded in Syria in 1970 and expanded to Egypt (10th of Ramadan City) in 2012, Al-Zahra crafts exquisite toffees and filled bonbons under our brand TOOMAKT — uniting ancestral heritage with modern manufacturing standards.'}
          </p>
        </div>

        {/* Key Philosophy Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20 sm:mb-28">
          <div className="bg-white border border-[#22120C]/10 rounded-[28px] p-8 hover:border-[#E890A8]/45 hover:shadow-[0_16px_40px_rgba(232,144,168,0.1)] transition-all">
            <span className="font-mono text-xs font-semibold text-[#E890A8] uppercase block mb-3">
              01 · {isRtl ? 'نقاء المكونات' : 'PURE BUTTERFAT'}
            </span>
            <h3 className="font-serif text-2xl font-normal text-[#22120C] mb-3">
              {isRtl ? '٨٤٪ دسم زبدة أوروبية' : '84% European Butterfat'}
            </h3>
            <p className="text-xs sm:text-sm text-[#22120C]/70 leading-relaxed font-light">
              {isRtl
                ? 'نرفض تماماً استخدام الزيوت المهدرجة أو زيوت النخيل الرخيصة. الزبدة الطبيعية النقية هي سر القوام الناعم الذي لا يلتصق أبداً.'
                : 'Zero palm oil, zero hydrogenated fats. Pure European creamery butterfat is the sole foundation of our velvety, non-sticky texture.'}
            </p>
          </div>

          <div className="bg-white border border-[#22120C]/10 rounded-[28px] p-8 hover:border-[#E890A8]/45 hover:shadow-[0_16px_40px_rgba(232,144,168,0.1)] transition-all">
            <span className="font-mono text-xs font-semibold text-[#E890A8] uppercase block mb-3">
              02 · {isRtl ? 'حلاوة الفواكه' : 'FRUIT PURÉE'}
            </span>
            <h3 className="font-serif text-2xl font-normal text-[#22120C] mb-3">
              {isRtl ? 'بيوريه فواكه البساتين ١٠٠٪' : '100% Orchard Fruit Purée'}
            </h3>
            <p className="text-xs sm:text-sm text-[#22120C]/70 leading-relaxed font-light">
              {isRtl
                ? 'فراولة برية، تفاح أخضر طازج، ليمون، وموز حقيقي يمنح الحلوى نكهة عميقة مع لمسة حموضة طبيعية منعشة تعيد توازن السكر.'
                : 'Wild strawberry, crisp green apple, zesty lemon, and real banana providing clean fruit acidity that cuts through sweetness.'}
            </p>
          </div>

          <div className="bg-white border border-[#22120C]/10 rounded-[28px] p-8 hover:border-[#E890A8]/45 hover:shadow-[0_16px_40px_rgba(232,144,168,0.1)] transition-all">
            <span className="font-mono text-xs font-semibold text-[#E890A8] uppercase block mb-3">
              03 · {isRtl ? 'القلب السائل' : 'MOLTEN FILLING'}
            </span>
            <h3 className="font-serif text-2xl font-normal text-[#22120C] mb-3">
              {isRtl ? 'حشوة سائلة طبيعية مركزة' : 'Rich Molten Centers'}
            </h3>
            <p className="text-xs sm:text-sm text-[#22120C]/70 leading-relaxed font-light">
              {isRtl
                ? 'مفاجأة تنتظر الحواس في قلب كل قطعة: سائل قهوة إيطالية محمصة، كراميل زبدة ذائب، أو شوكولاتة ناعمة غنية بالكاكاو.'
                : 'A sensory revelation at the core of each piece: liquid roasted espresso, warm melting caramel, or velvety cocoa cream.'}
            </p>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="mb-20 sm:mb-28">
          <div className="max-w-2xl mb-12">
            <p className="font-serif italic text-[#E890A8] text-lg mb-1">
              {isRtl ? 'مَحَطَّاتُ الرِّحْلَة' : 'The Milestones'}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#22120C] font-normal">
              {isRtl ? 'رحلة التطور من المرجل الأول إلى المعمل الرقمي' : 'From our first kettle to the modern atelier'}
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {milestones.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#22120C]/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#E890A8]/30 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-5">
                  <span className="font-serif text-2xl sm:text-3xl text-[#E890A8] font-normal shrink-0">
                    {item.num}
                  </span>
                  <div className="h-8 w-px bg-[#22120C]/15 hidden sm:block" />
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-[#22120C]">
                      {isRtl ? item.titleAr : item.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#22120C]/70 mt-1 font-light max-w-2xl leading-relaxed">
                      {isRtl ? item.descAr : item.descEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dual CTA Actions */}
        <div className="p-8 sm:p-12 rounded-[32px] bg-[#FDF2F5] border border-[#E890A8]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#22120C] font-normal">
              {isRtl ? 'اكتشف حلوياتنا أو شاهد مجمعنا الصناعي' : 'Explore the confections or tour the complex'}
            </h3>
            <p className="text-xs sm:text-sm text-[#22120C]/70 mt-1 font-light">
              {isRtl ? 'تصفح الأصناف الـ ١٤ أو شاهد فيلم الجولة الموثقة للمصنع.' : 'Browse all 14 confections or witness our production lines in motion.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateShop}
              className="px-6 py-3 rounded-full bg-[#E890A8] hover:bg-[#6AACE9] text-white font-medium text-xs font-mono uppercase tracking-wider group cursor-pointer flex items-center gap-2 shadow-sm transition-all"
            >
              <span>{isRtl ? 'متجر التشكيلة' : 'Shop Confections'}</span>
              <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </button>
            <button
              type="button"
              onClick={onNavigateFactory}
              className="px-6 py-3 rounded-full border border-[#22120C]/20 hover:border-[#6AACE9] hover:text-[#6AACE9] text-[#22120C] font-medium text-xs font-mono uppercase tracking-wider cursor-pointer flex items-center gap-2 transition-all"
            >
              <span>{isRtl ? 'المصنع' : 'Factory'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
