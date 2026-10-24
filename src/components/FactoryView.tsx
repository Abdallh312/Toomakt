import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FactoryViewProps {
  onNavigateHome: () => void;
  onNavigateContact: () => void;
}

export const FactoryView: React.FC<FactoryViewProps> = ({
  onNavigateHome,
  onNavigateContact,
}) => {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const galleryImages = [
    { url: '/images/products/gallery/confection_img_1.jpg', labelAr: 'علب وأكياس توفي النعناع والفواكه', labelEn: 'Mint & Fruit Candy Packaging' },
    { url: '/images/products/gallery/confection_img_2.jpg', labelAr: 'برطمانات وأكياس إكلير الشوكولاتة', labelEn: 'Chocolate Eclairs In Jars & Pouches' },
    { url: '/images/products/gallery/confection_img_3.jpg', labelAr: 'بونبون زهرة الزبدة والشوكولاتة التراثي', labelEn: 'Heritage Zahra Butter Bonbons' },
    { url: '/images/products/gallery/confection_img_10.jpg', labelAr: 'مواصفات وفحص جودة حبات التوفي', labelEn: 'Toffee Quality Inspection Specs' },
    { url: '/images/products/gallery/confection_img_12.jpg', labelAr: 'تغليف الحلوى محكم الإغلاق عازل للرطوبة', labelEn: 'Hermetic Moisture-Proof Sealing' },
    { url: '/images/products/gallery/confection_img_14.jpg', labelAr: 'صناديق الشحن والكراتين المجهزة للتوزيع', labelEn: 'Finished Cartons Ready for Dispatch' },
  ];

  const facilitySpecs = [
    {
      metric: '28,000',
      unitAr: 'قدم مربع',
      unitEn: 'sq. ft.',
      titleAr: 'مساحة المجمع الصناعي',
      titleEn: 'Industrial Complex',
      descAr: 'مجمع تصنيع حديث بالعاشر من رمضان، مصمم وفق أرقى معايير الغرف النظيفة لصناعة الحلويات.',
      descEn: 'State-of-the-art facility in 10th of Ramadan City, engineered with sanitary confectionery cleanrooms.',
    },
    {
      metric: '118°C',
      unitAr: 'حرارة دقيقة',
      unitEn: 'Target Temp',
      titleAr: 'مراجل النحاس الأوروبية',
      titleEn: 'Copper Kettle Batching',
      descAr: 'طهي هادئ متحكم به بدقة يمنح الكراميل قواماً زبدياً ناعماً لا يلتصق بالأسنان أبداً.',
      descEn: 'Gentle, thermostatic simmering creating a soft butter chew that never clings to teeth.',
    },
    {
      metric: '1,200',
      unitAr: 'قطعة / دقيقة',
      unitEn: 'pcs / min',
      titleAr: 'خطوط التغليف المؤتمتة',
      titleEn: 'Automated Packaging',
      descAr: 'خطوط تغليف إيطالية وألمانية سريعة تضمن إحكام الإغلاق الفردي دون أي لمس بشري مباشر.',
      descEn: 'Italian and German packaging lines guaranteeing airtight seals with zero direct human contact.',
    },
    {
      metric: '100%',
      unitAr: 'معتمد',
      unitEn: 'Certified',
      titleAr: 'اعتماد سلامة الغذاء (NFSA)',
      titleEn: 'Food Safety NFSA',
      descAr: 'معتمد من الهيئة القومية لسلامة الغذاء بمصر وحاصل على شهادات الجودة وحلال وخلو من المواد المعدلة وراثياً.',
      descEn: 'Accredited by Egypt’s National Food Safety Authority, Halal certified, and completely GMO-free.',
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
            {isRtl ? 'المصنع والمعمل' : 'Manufacturing & Atelier'}
          </span>
        </div>

        {/* Hero Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="font-serif italic text-[#E890A8] text-lg sm:text-xl mb-3">
            {isRtl ? 'المجمع الصناعي · شركة الزهرة وتوماكت' : 'Industrial Complex · Al-Zahra & Toomakt'}
          </p>
          <h1 className={`${isRtl ? 'font-sans font-bold text-2xl sm:text-4xl lg:text-[2.6rem] leading-[1.35]' : 'font-serif font-normal text-4xl sm:text-5xl lg:text-6xl leading-[1.1]'} tracking-tight text-[#22120C]`}>
            {isRtl
              ? 'صِنَاعَةٌ مُتَقَدِّمَة: حَيْثُ تَلْتَقِي الصَّنْعَةُ اليَدَوِيَّةُ بِأَرْقَى التِّقْنِيَّاتِ الصِّنَاعِيَّة.'
              : 'Precision manufacturing: where artisanal craft meets modern food engineering.'}
          </h1>
          <p className="mt-6 text-sm sm:text-base text-[#22120C]/75 leading-relaxed font-light">
            {isRtl
              ? 'جولة موثقة داخل مصنعنا بمدينة العاشر من رمضان، مصر. خطوط إنتاج متطورة، مراجل نحاس أوربية، وأنظمة حقن قلوب القهوة والكراميل الذائبة بأعلى معايير سلامة الغذاء.'
              : 'A verified look inside our industrial complex in 10th of Ramadan City, Cairo. Precision copper kettle batching, cleanroom confectionery suites, and automated liquid-core injection lines.'}
          </p>
        </div>

        {/* Master Cinema Video Tour */}
        <div className="relative rounded-[32px] overflow-hidden border border-[#22120C]/10 shadow-[0_20px_60px_rgba(34,18,12,0.15)] bg-[#24130D] mb-16 sm:mb-24">
          <div
            data-cursor="play"
            data-cursor-label={isPlaying ? 'PAUSE' : 'PLAY'}
            onClick={toggleVideo}
            className="relative aspect-[16/9] sm:aspect-[21/9] w-full cursor-pointer group"
          >
            <video
              ref={videoRef}
              src="/videos/toomakt_factory_tour.mp4"
              poster="/images/hero/hero_factory_poster.webp"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover brightness-95 group-hover:scale-101 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#22120C]/90 via-[#22120C]/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 flex items-end justify-between">
              <div>
                <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-[#E890A8] block mb-1 font-semibold">
                  {isRtl ? 'فيلم الجولة الموثقة · جودة حقيقية' : 'DOCUMENTED FACTORY FILM · 100% AUTHENTIC'}
                </span>
                <p className="font-serif text-xl sm:text-3xl text-white font-normal">
                  {isRtl ? 'داخل خطوط تصنيع توماكت ومراجل النحاس' : 'Inside the toomakt Confectionery Kettles'}
                </p>
              </div>

              <button
                type="button"
                onClick={toggleVideo}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-[#22120C]/10 text-[#E890A8] flex items-center justify-center hover:bg-[#E890A8] hover:text-white transition-all cursor-pointer shadow-lg"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 4 Facility Engineering Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-24">
          {facilitySpecs.map((spec, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#22120C]/10 rounded-[24px] p-6 sm:p-7 hover:border-[#E890A8]/45 hover:shadow-[0_12px_30px_rgba(232,144,168,0.1)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-serif text-3xl sm:text-4xl font-normal text-[#E890A8]">
                    {spec.metric}
                  </span>
                  <span className="font-mono text-xs text-[#22120C]/50 uppercase font-semibold">
                    {isRtl ? spec.unitAr : spec.unitEn}
                  </span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-normal text-[#22120C] mb-2">
                  {isRtl ? spec.titleAr : spec.titleEn}
                </h3>
                <p className="text-xs text-[#22120C]/70 leading-relaxed font-light">
                  {isRtl ? spec.descAr : spec.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Real Plant Photography Gallery */}
        <div className="mb-16 sm:mb-24">
          <div className="mb-8">
            <p className="font-serif italic text-[#E890A8] text-lg mb-1">
              {isRtl ? 'صُوَرٌ حَقِيقِيَّةٌ مِنَ المَصْنَع' : 'Verified Packaging & Facility Archive'}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#22120C] font-normal">
              {isRtl ? 'سجل التغليف والإنتاج الموثق' : 'Authentic Production Archive'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden border border-[#22120C]/10 bg-[#FDF2F5] aspect-[4/3] group shadow-xs"
              >
                <img
                  src={img.url}
                  alt={isRtl ? img.labelAr : img.labelEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#22120C]/90 via-[#22120C]/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono text-[#E890A8] uppercase block mb-0.5 font-semibold">
                    0{idx + 1} · {isRtl ? 'أرشيف المعمل' : 'Facility Archive'}
                  </span>
                  <p className="font-serif text-sm font-normal leading-snug">
                    {isRtl ? img.labelAr : img.labelEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B2B / Private Label & Commercial Partnership Call to Action */}
        <div className="p-8 sm:p-12 rounded-[32px] bg-[#FDF2F5] border border-[#E890A8]/20 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left rtl:md:text-right">
          <div className="max-w-xl">
            <p className="font-serif italic text-[#E890A8] text-lg mb-1">
              {isRtl ? 'تَوْرِيدُ الشَّرِكَاتِ وَالفَنَادِقِ وَالتَّصْدِير' : 'B2B & Wholesale Concierge'}
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#22120C] font-normal">
              {isRtl ? 'هل ترغب في توريد كميات تجارية أو شراكة توزيع؟' : 'Interested in bulk distribution or bespoke corporate orders?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#22120C]/70 mt-2 font-light leading-relaxed">
              {isRtl
                ? 'نوفر برامج توريد مخصصة لشركات الطيران، الفنادق الفاخرة، والمتاجر الكبرى مع إمكانية التغليف المخصص وبأسعار تصنيع مباشرة من المعمل.'
                : 'We collaborate with boutique hotels, airlines, and premium retailers across Egypt and the Middle East with tailored volume rates and custom packaging.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateContact}
            className="group cursor-pointer flex items-center gap-2 shrink-0 bg-[#E890A8] text-white hover:bg-[#6AACE9] px-7 py-3.5 rounded-full font-serif font-medium shadow-[0_4px_14px_rgba(232,144,168,0.25)] hover:shadow-[0_6px_20px_rgba(106,172,233,0.35)] transition-all"
          >
            <span>{isRtl ? 'تواصل مع إدارة المبيعات والتوريد' : 'Contact Wholesale Team'}</span>
            <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FactoryView;
