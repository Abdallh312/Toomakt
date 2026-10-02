import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Award,
  ShieldCheck,
  Truck,
  HelpCircle,
  Apple,
  ChevronDown,
  CheckCircle2,
  Package,
  Droplets,
  Flame,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface CMSPageViewProps {
  slug: string;
  onBackHome: () => void;
  onNavigateView?: (view: string) => void;
}

export const CMSPageView: React.FC<CMSPageViewProps> = ({
  slug,
  onBackHome,
  onNavigateView
}) => {
  const { isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(slug || 'our-story');
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  // Sync tab with slug if slug changes externally
  React.useEffect(() => {
    if (slug) setActiveTab(slug === 'about' ? 'our-story' : slug);
  }, [slug]);

  const tabs = [
    { id: 'our-story', label: isRtl ? 'قصتنا وحرفتنا' : 'Our Story & Craft', icon: Sparkles },
    { id: 'ingredients', label: isRtl ? 'المكونات والنقاء' : 'Pure Ingredients', icon: Apple },
    { id: 'shipping', label: isRtl ? 'الشحن المبرد المعزول' : 'Cold-Chain Delivery', icon: Truck },
    { id: 'faq', label: isRtl ? 'الأسئلة الشائعة' : 'Frequently Asked', icon: HelpCircle }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onNavigateView) {
      onNavigateView(tabId);
    }
  };

  const chewStages = [
    {
      sec: '00 - 10s',
      title: isRtl ? 'اللمسة الأولى وانفجار الفاكهة' : 'FIRST TOUCH & ACID BURST',
      desc: isRtl
        ? 'انفجار فوري من طعم بيوريه الفاكهة الطبيعية. البكتين الطبيعي العالي يمنح حموضة أصيلة دون أي لدغة كيميائية.'
        : 'Immediate explosion of pure sun-ripened orchard fruit. High natural fruit pectin delivers an authentic brightness with zero artificial sharpness.'
    },
    {
      sec: '10 - 25s',
      title: isRtl ? 'ذوبان الزبدة الأوروبية المحمصة' : 'BROWNED BUTTER MELT',
      desc: isRtl
        ? 'يلين التوفي بلطف عند حرارة الفم. تنتشر زبدة النورماندي بنسبة دسم 84% عبر لسانك في موجة دافئة وناعمة.'
        : 'The chew gently yields at human body temperature. European sweet butter diffuses across your palate in a rich, nutty butterscotch wave.'
    },
    {
      sec: '25 - 40s',
      title: isRtl ? 'الكراميل الذهبي وزهرة الملح' : 'TOASTED CARAMEL & FLEUR DE SEL',
      desc: isRtl
        ? 'حبيبات رقيقة من زهرة الملح البحري تكسر حلاوة الكراميل، لتطلق نغمات توفي محمصة ودافئة.'
        : 'Delicate flakes of hand-harvested sea salt slice through the caramel sweetness, unlocking deep toasted undertones.'
    },
    {
      sec: '40 - 45s',
      title: isRtl ? 'نهاية نظيفة • لا التصاق بالأسنان' : 'CLEAN FINISH • ZERO RESIDUE',
      desc: isRtl
        ? 'يذوب التوفي تماماً دون أن يلتصق بالأسنان، تاركاً إحساساً منعشاً بطعم الفاكهة الطبيعية.'
        : 'The toffee dissolves completely without sticking to enamel or dental work, leaving a refreshed fruit aftertaste.'
    }
  ];

  const ingredientsList = [
    {
      name: isRtl ? 'فواكه البساتين الطبيعية' : 'Real Orchard Fruits',
      source: isRtl ? 'بيوريه فاكهة كاملة 100%' : 'Cold-Pressed Whole Purées',
      badge: '100% PURE',
      desc: isRtl
        ? 'مانجو ألفونسو راتناجيري، فراولة ألبية برية، برتقال دموي صقلي، وليمون متوسطي. لا مستخلصات ولا ملونات صناعية.'
        : 'Ratnagiri Alphonso mangoes, wild alpine strawberries, Sicilian blood oranges, and sun-warmed limes. Zero artificial extracts.'
    },
    {
      name: isRtl ? 'الزبدة الأوروبية الفاخرة' : 'European Cultured Butter',
      source: isRtl ? 'زبدة نورماندي 84% دسم' : 'Normandy 84% Butterfat',
      badge: 'ARTISANAL',
      desc: isRtl
        ? 'مخضوضة ببطء من قشطة مزارع فرنسية طبيعية. تمنح التوفي قواماً حريراً ونكهة كراميل جوزية غنية.'
        : 'Slow-churned from cultured sweet cream. Provides the silk texture and rich butterscotch finish that sets toomakt apart.'
    },
    {
      name: isRtl ? 'سكر القصب النقي والبكتين' : 'Pure Cane Sugar & Citrus Pectin',
      source: isRtl ? 'بدون شراب الذرة المعدل' : 'Zero High-Fructose Corn Syrup',
      badge: 'CLEAN LABEL',
      desc: isRtl
        ? 'نعتمد فقط على بلورات سكر القصب الطبيعي وبكتين قشور الحمضيات للتماسك، دون شراب جلوكوز صناعي.'
        : 'We use exclusively crystalline cane sugar and natural citrus pectin for structure, never glucose syrup.'
    },
    {
      name: isRtl ? 'زهرة الملح البحري' : 'Breton Fleur de Sel',
      source: isRtl ? 'ملح بحري مجفف بالشمس' : 'Sun-Dried Sea Salt',
      badge: 'MINERAL RICH',
      desc: isRtl
        ? 'بلورات ملح طبيعية غنية بالمعادن تجمع يدوياً من أحواض الملح لتوازن السكر وتبرز حموضة الفواكه.'
        : 'Delicate mineral-rich salt flakes gathered by hand to balance caramel sweetness and elevate fruit acidity.'
    }
  ];

  const faqs = [
    {
      q: isRtl ? 'ما الذي يجعل توفي توماكت مختلفاً عن الحلوى العادية؟' : 'What makes toomakt fundamentally different from commercial candy?',
      a: isRtl
        ? 'حلوى توماكت مصنوعة ببطء من بيوريه الفاكهة الطبيعية الكاملة والزبدة الأوروبية، دون أي قطرة من شراب الذرة عالي الفركتوز أو الزيوت المهدرجة أو النكهات المصنعة. النتيجة هي حلوى نظيفة تذوب برفق دون أن تلتصق بالأسنان.'
        : 'toomakt is handcrafted slowly in copper cauldrons with 100% whole fruit purée and 84% European butterfat. We never use corn syrup, palm oil, or artificial flavorings. The result is a clean, non-sticky chew that honors true fruit acidity.'
    },
    {
      q: isRtl ? 'كم تبلغ مدة صلاحية الحلوى وكيف يتم تخزينها؟' : 'What is the shelf life and how should toomakt confections be stored?',
      a: isRtl
        ? 'نظراً لاعتمادنا على الزبدة الطبيعية والفواكه النقية، فإن صلاحية المنتج هي 6 أشهر من تاريخ التحضير المطبوع على العبوة. ننصح بحفظها في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة (18-22 درجة مئوية).'
        : 'Because we use fresh European butter and real fruit, our sealed pouches are best enjoyed within 6 months. Store in a cool, dry place away from direct sunlight (18-22°C).'
    },
    {
      q: isRtl ? 'هل تشحنون لجميع المحافظات وكيف تضمنون وصولها طازجة؟' : 'Do you ship to all Egyptian governorates, and how is quality preserved in transit?',
      a: isRtl
        ? 'نعم، نشحن إلى جميع محافظات مصر الـ 27 عبر صناديق شحن مبردة ومعزولة حرارياً تحتوي على عبوات تبريد آمنة. يصل طلبك خلال 24-48 ساعة داخل القاهرة والإسكندرية، وخلال 2-3 أيام لباقي المحافظات.'
        : 'Yes, we deliver to all 27 Egyptian governorates in custom insulated climate boxes with frozen non-toxic gel packs. Delivery takes 24-48 hours in Cairo, Giza, and Alexandria, and 2-3 days nationwide.'
    },
    {
      q: isRtl ? 'هل توجد لديكم خيارات مخصصة لهدايا الشركات وحفلات الزفاف؟' : 'Do you offer bespoke gift packaging for weddings or corporate events?',
      a: isRtl
        ? 'بالتأكيد! نوفر خدمة التغليف المخصص مع وضع شعار شركتك أو بطاقات إهداء مطبوعة يدوياً، وصناديق هدايا كتانية فاخرة. يمكنك التواصل مع مستشار الحلويات عبر صفحة اتصل بنا أو عبر واتساب مباشرة.'
        : 'Yes! We create bespoke packaging with custom sleeves, embossed linen boxes, and personalized gift notes for corporate clients, weddings, and VIP events. Connect with us on our Contact page or directly on WhatsApp.'
    }
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#1A1A1A] min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackHome}
            className="btn-secondary text-xs flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isRtl ? 'العودة للرئيسية' : 'RETURN TO ATELIER'}</span>
          </button>
          
          <span className="text-xs text-[#736B63] font-light">
            {isRtl ? 'معمل توماكت · القاهرة' : 'toomakt Confectionery Atelier · Cairo'}
          </span>
        </div>

        {/* Page Editorial Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold text-[#736B63] uppercase tracking-widest block mb-2">
            {isRtl ? 'عن توماكت' : 'ABOUT TOOMAKT'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#1A1A1A] tracking-tight mb-4">
            {isRtl ? 'حلاوة أهدأ، صُنعت ببطء.' : 'A quieter kind of sweet.'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#736B63] font-light max-w-2xl mx-auto leading-relaxed">
            {isRtl
              ? 'تأسست توماكت في القاهرة انطلاقاً من رغبة واحدة: إعادة ابتكار حلوى التوفي باستخدام الفواكه الطبيعية والزبدة النقية دون أي اختصارات صناعية.'
              : 'Born in Cairo from a singular obsession: to slow down confectionery, replacing corn syrup and artificial dyes with real fruit purée and European butter.'}
          </p>
        </div>

        {/* Responsive Tab Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 sm:mb-16 p-1.5 rounded-full bg-[#F4EFEA] border border-[#E8E2D7] max-w-2xl mx-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1A1A] text-[#FAF7F2] shadow-soft'
                    : 'text-[#736B63] hover:text-[#1A1A1A] hover:bg-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OUR STORY & CRAFT */}
        {activeTab === 'our-story' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12 sm:space-y-16"
          >
            {/* Story Narrative Box */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#E8E2D7] shadow-soft">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#736B63] block mb-2">
                {isRtl ? 'الفلسفة التأسيسية' : 'FOUNDING PHILOSOPHY'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A] mb-6 font-normal">
                {isRtl ? 'لماذا رفضنا الطريقة السهلة؟' : 'Why we rejected the shortcuts.'}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#736B63] font-light leading-relaxed">
                <p>
                  {isRtl
                    ? 'في عالم امتلأت فيه الحلوى بشراب الذرة عالي الفركتوز، وزيت النخيل المهدرج، والنكهات الاصطناعية التي تلتصق بالأسنان، بدأنا في معملنا بالقاهرة برؤية مغايرة: العودة إلى قدور النحاس الثقيلة، والفاكهة الطبيعية الكاملة، وزبدة النورماندي ذات النسبة العالية من الدسم.'
                    : 'In an industry dominated by glucose syrups, hydrogenated palm oils, and tooth-sticking synthetic colorants, toomakt was created to prove that confectionery can be quiet, thoughtful, and deeply satisfying.'}
                </p>
                <p>
                  {isRtl
                    ? 'كل دفعة تُطهى على نار هادئة حتى تصل لدرجة الحرارة الدقيقة التي تحافظ على حموضة الفواكه الطبيعية وتطلق نغمات الكراميل الدافئة. لا تعجل في التبريد، ولا إضافات تخفي طعم المكونات الأصلية.'
                    : 'Each small batch is slow-simmered at exactly 245°F in genuine French copper cauldrons, allowing whole fruit purées to caramelize alongside cultured European butter. We let the toffee rest and cool slowly so each piece yields tenderly with zero tooth-stickiness.'}
                </p>
              </div>
            </div>

            {/* The 4-Stage Tasting Evolution */}
            <div className="bg-[#F4EFEA] rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#E8E2D7]">
              <div className="max-w-2xl mb-8">
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#736B63] block mb-2">
                  {isRtl ? 'علم التذوق' : 'THE 45-SECOND TASTING EVOLUTION'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal">
                  {isRtl ? 'كيف تتفتح النكهة في فمك' : 'How the chew unfolds.'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {chewStages.map((stg) => (
                  <div key={stg.sec} className="bg-white rounded-2xl p-5 border border-[#E8E2D7] shadow-soft flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-xs font-semibold text-[#3C1322] block mb-2">
                        {stg.sec}
                      </span>
                      <h4 className="font-serif text-sm font-medium text-[#1A1A1A] mb-2">
                        {stg.title}
                      </h4>
                      <p className="text-xs text-[#736B63] font-light leading-relaxed">
                        {stg.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: PURE INGREDIENTS */}
        {activeTab === 'ingredients' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ingredientsList.map((ing) => (
                <div key={ing.name} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D7] shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-medium text-[#736B63] uppercase">
                        {ing.source}
                      </span>
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#3C1322] border border-[#E8E2D7]">
                        {ing.badge}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-[#1A1A1A] mb-2 font-normal">
                      {ing.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#736B63] font-light leading-relaxed">
                      {ing.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Zero Promise Banner */}
            <div className="bg-[#F4EFEA] rounded-2xl p-6 sm:p-8 border border-[#E8E2D7] text-center max-w-2xl mx-auto">
              <h4 className="font-serif text-lg text-[#1A1A1A] mb-3 font-normal">
                {isRtl ? 'عهد النقاء من معمل توماكت' : 'Our Clean Label Promise'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#736B63] font-light">
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D7]">
                  <span className="block font-medium text-[#1A1A1A] mb-0.5">0%</span>
                  <span>{isRtl ? 'شراب ذرة' : 'Corn Syrup'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D7]">
                  <span className="block font-medium text-[#1A1A1A] mb-0.5">0%</span>
                  <span>{isRtl ? 'زيت نخيل' : 'Palm Oil'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D7]">
                  <span className="block font-medium text-[#1A1A1A] mb-0.5">0%</span>
                  <span>{isRtl ? 'ملونات صناعية' : 'Artificial Dyes'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D7]">
                  <span className="block font-medium text-[#1A1A1A] mb-0.5">0%</span>
                  <span>{isRtl ? 'مواد حافظة' : 'Preservatives'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: COLD-CHAIN DELIVERY */}
        {activeTab === 'shipping' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#E8E2D7] shadow-soft">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#736B63] block mb-2">
                {isRtl ? 'الشحن المبرد المعزول' : 'CLIMATE-PROTECTED LOGISTICS'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] mb-4 font-normal">
                {isRtl ? 'نصلك بحالة مثالية في أي مكان بمصر.' : 'Pristine delivery to all 27 governorates.'}
              </h2>
              <p className="text-sm sm:text-base text-[#736B63] font-light leading-relaxed mb-8 max-w-2xl">
                {isRtl
                  ? 'بسبب احتوائها على زبدة نقية وفواكه طبيعية، نضع كل عبوة داخل صناديق شحن حرارية معزولة مع عبوات تبريد آمنة لضمان وصول التوفي بالقوام الأصلي نفسه حتى في أشد أيام الصيف حرارة.'
                  : 'Because our confections are rich in genuine butter and fruit purée, every shipment leaves our Cairo kitchen in insulated thermal boxes with food-safe cooling packs, ensuring factory-fresh texture upon arrival.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E8E2D7]">
                <div>
                  <h4 className="font-serif text-base text-[#1A1A1A] mb-1 font-normal">
                    {isRtl ? 'القاهرة والجيزة' : 'Cairo & Giza'}
                  </h4>
                  <p className="text-xs text-[#736B63] font-light">
                    {isRtl ? 'توصيل خلال 24 - 48 ساعة بواسطة مندوب المعمل' : '24-48h direct courier delivery.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#1A1A1A] mb-1 font-normal">
                    {isRtl ? 'الإسكندرية والدلتا' : 'Alexandria & Delta'}
                  </h4>
                  <p className="text-xs text-[#736B63] font-light">
                    {isRtl ? 'توصيل خلال 48 ساعة في صناديق معزولة' : '48h express climate shipping.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#1A1A1A] mb-1 font-normal">
                    {isRtl ? 'الصعيد والقناة وسيناء' : 'Upper Egypt, Canal & Sinai'}
                  </h4>
                  <p className="text-xs text-[#736B63] font-light">
                    {isRtl ? 'توصيل خلال 2-3 أيام مع ضمان الجودة' : '2-3 business days guaranteed.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: FREQUENTLY ASKED QUESTIONS */}
        {activeTab === 'faq' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 max-w-3xl mx-auto"
          >
            {faqs.map((faq, idx) => {
              const isOpen = activeAccordion === idx;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden transition-all shadow-soft"
                >
                  <button
                    onClick={() => setActiveAccordion(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left rtl:text-right flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-serif text-base sm:text-lg font-normal text-[#1A1A1A]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#736B63] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#3C1322]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#736B63] font-light leading-relaxed border-t border-[#E8E2D7]/60 pt-4"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Bottom CTA to Shop */}
        <div className="mt-16 text-center pt-8 border-t border-[#E8E2D7]">
          <p className="text-xs text-[#736B63] mb-4 font-light">
            {isRtl ? 'هل ترغب في تذوق حلوى توماكت بنفسك؟' : 'Ready to taste the slow craft difference?'}
          </p>
          <button
            onClick={() => onNavigateView && onNavigateView('shop')}
            className="btn-primary text-xs"
          >
            <span>{isRtl ? 'استكشف تشكيلة المتجر' : 'Explore The Collection'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
