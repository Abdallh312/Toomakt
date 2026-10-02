import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Flame,
  Award,
  ShieldCheck,
  Clock,
  Truck,
  HelpCircle,
  Apple,
  Milk,
  ChevronDown,
  CheckCircle2,
  ChevronRight,
  Package,
  Heart,
  Droplets
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
  const [activeChewStage, setActiveChewStage] = useState<number>(0);

  // Sync tab with slug if slug changes externally
  React.useEffect(() => {
    if (slug) setActiveTab(slug);
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
      title: 'FIRST TOUCH & ACID BURST',
      color: 'bg-[#FFE842]',
      desc: 'Immediate explosion of pure cold-pressed orchard fruit. High natural fruit pectin delivers an authentic tartness with zero chemical sharpness.'
    },
    {
      sec: '10 - 25s',
      title: 'BROWNED BUTTER MELT',
      color: 'bg-[#FF5E2B] text-white',
      desc: 'The chew gently softens at human body temperature. European 84% butterfat diffuses across your palate in a rich, nutty butterscotch wave.'
    },
    {
      sec: '25 - 40s',
      title: 'TOASTED CARAMEL & FLEUR DE SEL',
      color: 'bg-[#C4E86E]',
      desc: 'Flakes of hand-harvested Breton sea salt slice through the caramel sweetness, unlocking deep toasted undertones.'
    },
    {
      sec: '40 - 45s',
      title: 'CLEAN FINISH • ZERO RESIDUE',
      color: 'bg-[#4AD4DA]',
      desc: 'The toffee dissolves completely without sticking to enamel or dental work, leaving a refreshed fruit aftertaste.'
    }
  ];

  const timelineMilestones = [
    {
      year: '2021',
      title: 'THE COPPER ATELIER IS FOUNDED',
      badge: 'CAIRO, EGYPT',
      desc: 'Frustrated by commercial candy loaded with palm oil and synthetic flavorings, our pastry chefs imported genuine French copper cauldrons to master slow-boiled fruit toffee.'
    },
    {
      year: '2022',
      title: 'THE 45-SECOND SIGNATURE CHEW',
      badge: 'BREAKTHROUGH',
      desc: 'After 180 test batches, we perfected the proprietary cooking curve at 245°F, combining Brittany cultured butter with whole fruit purées for a guaranteed non-sticky bite.'
    },
    {
      year: '2023',
      title: 'COLD-CHAIN NATIONWIDE SHIPPING',
      badge: 'LOGISTICS',
      desc: 'We engineered custom insulated thermal shipping boxes with frozen non-toxic gel packs, allowing fresh atelier shipments to arrive pristine across all 27 Egyptian governorates.'
    },
    {
      year: '2024 - 2026',
      title: 'THE FRUIT WEATHER UNIVERSE',
      badge: 'TODAY',
      desc: 'Reimagining the confectionery experience through mood-based flavor profiles, personalized weather boxes, and sustainable small-batch production.'
    }
  ];

  const ingredientsList = [
    {
      name: 'Real Orchard Fruits',
      source: 'Cold-Pressed Whole Purées',
      badge: '100% PURE',
      color: 'bg-[#FFE842]',
      desc: 'Ratnagiri Alphonso mangoes, wild Mara des Bois strawberries, Moro blood oranges, and sun-ripened passion fruit. No artificial colors or extracts.'
    },
    {
      name: '84% Grass-Fed Butter',
      source: 'European Pasture Herds',
      badge: 'DAIRY PURITY',
      color: 'bg-[#FF5E2B] text-white',
      desc: 'Slow-churned to 84% butterfat for a velvety mouthfeel and natural toasted caramel notes. Absolutely zero hydrogenated palm or vegetable oils.'
    },
    {
      name: 'Guérande Fleur de Sel',
      source: 'Breton Salt Marshes',
      badge: 'MINERAL CRUNCH',
      color: 'bg-[#C4E86E]',
      desc: 'Delicate mineral salt crystals hand-sprinkled into the kettle to balance sweet cane caramel and amplify natural orchard acids.'
    },
    {
      name: 'Natural Botanicals',
      source: 'Clean Plant Colorants',
      badge: 'ZERO RED-40',
      color: 'bg-[#FF4D8D] text-white',
      desc: 'Every vibrant shade is derived solely from beetroot juice, turmeric roots, spirulina, and concentrated purple carrot.'
    }
  ];

  const faqItems = [
    {
      q: 'Will toomakt toffee stick to teeth or dental work?',
      a: 'Never. Unlike commercial high-fructose chews, toomakt toffee is made with high-ratio 84% butterfat and micro-aerated on steel tables. It melts cleanly against body heat in approximately 45 seconds without sticking.'
    },
    {
      q: 'How does nationwide thermal delivery work during warm months?',
      a: 'Every parcel is packed inside an insulated thermal container with reusable frozen food-grade gel packs. We monitor Egyptian ambient temperatures to guarantee your box arrives fresh and firm.'
    },
    {
      q: 'What is the shelf life and recommended storage?',
      a: 'Because we use real fruit and fresh butter without artificial chemical stabilizers, enjoy within 90 days. Store in a cool, dry pantry away from direct sun. Do not refrigerate, as condensation alters the chew texture.'
    },
    {
      q: 'Can I customize a box for corporate gifting or wedding favors?',
      a: 'Yes! Visit our Wholesale page or use the "Build a Box" tool to personalize sleeve names, select specific flavor ratios, or arrange custom wax-sealed packaging.'
    },
    {
      q: 'Is toomakt gluten-free and Halal?',
      a: 'Yes, all our fruit toffees are 100% gluten-free, crafted with pure cane sugar, fruit, cultured butter, and pectin. All ingredients are certified Halal.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#1F1127] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#FFE842] selection:text-[#1F1127]">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackHome}
            className="btn-neo bg-[#FFFDF5] text-[#1F1127] px-4 py-2 text-xs font-black uppercase flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isRtl ? 'العودة للرئيسية' : 'Back to Storefront'}</span>
          </button>

          <span className="badge-neo bg-[#FFE842] text-[#1F1127] text-[10px]">
            ATELIER JOURNAL NO. 08
          </span>
        </div>

        {/* Tab Switcher Pills */}
        <div className="card-neo bg-[#FFFDF5] p-2 sm:p-3 flex flex-wrap gap-2 justify-center">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl border-2 border-[#1F1127] text-xs font-black uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#1F1127] text-white shadow-neo-sm translate-y-[-1px]'
                    : 'bg-[#F5EFE6] hover:bg-[#FFE842] text-[#1F1127]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#FFE842]' : 'text-[#1F1127]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OUR STORY & CRAFT */}
        {/* ========================================================================= */}
        {activeTab === 'our-story' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Story Hero Card */}
            <div className="card-neo bg-[#FFFDF5] p-6 sm:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5E2B] text-white text-[10px] font-black uppercase tracking-wider border border-[#1F1127]">
                <Flame className="w-3.5 h-3.5 text-white" />
                <span>THE TOOMAKT PHILOSOPHY</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl text-[#1F1127] uppercase tracking-tight leading-none">
                {isRtl ? 'أعدنا الفاكهة للحلوى، والكراميل لأصله.' : 'WE PUT REAL FRUIT BACK INTO CANDY.'}
              </h1>

              <div className="text-sm sm:text-base font-bold text-[#1F1127]/80 space-y-4 leading-relaxed">
                <p>
                  Most modern commercial fruit chews contain zero actual fruit. They are made by coloring corn syrup with artificial petroleum dyes and binding it with industrial palm oil.
                </p>
                <p>
                  At <strong>toomakt</strong>, we returned to classical 18th-century French confectionery traditions. We cook peak-season fruit purées in heavy copper cauldrons with grass-fed European cultured butter until every batch transforms into rich, melt-in-your-mouth fruit weather systems.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t-2 border-[#1F1127]">
                <div>
                  <span className="font-display font-black text-3xl text-[#FF5E2B] block">100%</span>
                  <span className="text-[11px] font-bold text-[#1F1127]/70 uppercase">Real Orchard Fruit</span>
                </div>
                <div>
                  <span className="font-display font-black text-3xl text-[#FFE842] block">84%</span>
                  <span className="text-[11px] font-bold text-[#1F1127]/70 uppercase">European Butterfat</span>
                </div>
                <div>
                  <span className="font-display font-black text-3xl text-[#C4E86E] block">45s</span>
                  <span className="text-[11px] font-bold text-[#1F1127]/70 uppercase">Signature Chew Curve</span>
                </div>
                <div>
                  <span className="font-display font-black text-3xl text-[#4AD4DA] block">27</span>
                  <span className="text-[11px] font-bold text-[#1F1127]/70 uppercase">Egypt Governorates</span>
                </div>
              </div>
            </div>

            {/* Interactive 45-Second Signature Chew Curve */}
            <div className="card-neo bg-[#FFFDF5] p-6 sm:p-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 border-[#1F1127]">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5E2B]">
                    SENSORY ENGINEERING
                  </span>
                  <h2 className="font-display font-black text-2xl text-[#1F1127] uppercase">
                    The 45-Second Signature Chew Curve
                  </h2>
                </div>
                <span className="badge-neo bg-[#C4E86E] text-[#1F1127] text-xs">
                  Zero Stick Guarantee
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {chewStages.map((stage, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveChewStage(idx)}
                    className={`card-neo p-4 space-y-3 cursor-pointer transition-all ${
                      activeChewStage === idx ? `${stage.color} shadow-neo` : 'bg-[#FAF6F0] hover:bg-[#FFE842]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-sm uppercase">
                        {stage.sec}
                      </span>
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-display font-black text-xs uppercase leading-snug">
                      {stage.title}
                    </h3>
                    <p className="text-[11px] font-bold opacity-80 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Atelier Heritage Timeline */}
            <div className="card-neo bg-[#FFFDF5] p-6 sm:p-10 space-y-6">
              <h2 className="font-display font-black text-2xl text-[#1F1127] uppercase pb-4 border-b-2 border-[#1F1127]">
                When We Started (2021 - 2026)
              </h2>

              <div className="space-y-6">
                {timelineMilestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#F5EFE6] border-2 border-[#1F1127] shadow-neo-sm flex flex-col sm:flex-row sm:items-start gap-4"
                  >
                    <div className="w-20 shrink-0 font-display font-black text-3xl text-[#FF5E2B]">
                      {m.year}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black text-base uppercase text-[#1F1127]">
                          {m.title}
                        </h3>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#1F1127] text-white">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#1F1127]/80 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INGREDIENTS & SOURCING */}
        {/* ========================================================================= */}
        {activeTab === 'ingredients' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="badge-neo bg-[#FFE842] text-[#1F1127]">
                ZERO ARTIFICIAL DYES • ZERO PALM OIL
              </span>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-[#1F1127] uppercase">
                Pure Ingredients Without Compromise
              </h1>
              <p className="text-xs sm:text-sm font-bold text-[#1F1127]/80 leading-relaxed">
                We believe you should be able to read our entire ingredient list without a chemistry degree.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ingredientsList.map((item, idx) => (
                <div key={idx} className="card-neo bg-[#FFFDF5] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full border-2 border-[#1F1127] text-[10px] font-black uppercase ${item.color}`}>
                      {item.badge}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#1F1127]/60">
                      {item.source}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl text-[#1F1127] uppercase">
                    {item.name}
                  </h3>

                  <p className="text-xs font-bold text-[#1F1127]/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Purity Comparison Table */}
            <div className="card-neo bg-[#FFFDF5] p-6 sm:p-8 space-y-4">
              <h3 className="font-display font-black text-xl text-[#1F1127] uppercase pb-2 border-b-2 border-[#1F1127]">
                How toomakt Compares to Industrial Candies
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold">
                  <thead>
                    <tr className="border-b-2 border-[#1F1127] text-[10px] uppercase text-[#1F1127]/70">
                      <th className="py-2.5">Attribute</th>
                      <th className="py-2.5 text-[#FF5E2B]">toomakt Atelier</th>
                      <th className="py-2.5 text-[#1F1127]/50">Mass Market Chews</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1127]/10">
                    <tr>
                      <td className="py-3">Fruit Source</td>
                      <td className="py-3 text-[#1F1127] flex items-center gap-1.5 font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        100% Whole Orchard Purée
                      </td>
                      <td className="py-3 text-[#1F1127]/60">Synthetic Flavors & Corn Syrup</td>
                    </tr>
                    <tr>
                      <td className="py-3">Fat & Melt Quality</td>
                      <td className="py-3 text-[#1F1127] flex items-center gap-1.5 font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        84% European Cultured Butter
                      </td>
                      <td className="py-3 text-[#1F1127]/60">Hydrogenated Palm / Soybean Oil</td>
                    </tr>
                    <tr>
                      <td className="py-3">Chew Finish</td>
                      <td className="py-3 text-[#1F1127] flex items-center gap-1.5 font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Non-Sticky 45s Clean Melt
                      </td>
                      <td className="py-3 text-[#1F1127]/60">Sticks to teeth & fillings</td>
                    </tr>
                    <tr>
                      <td className="py-3">Colorants</td>
                      <td className="py-3 text-[#1F1127] flex items-center gap-1.5 font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Beetroot, Turmeric, Spirulina
                      </td>
                      <td className="py-3 text-[#1F1127]/60">Red-40, Yellow-5, Titanium Dioxide</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: COLD-CHAIN DELIVERY */}
        {/* ========================================================================= */}
        {activeTab === 'shipping' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="card-neo bg-[#FFFDF5] p-6 sm:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4AD4DA] border-2 border-[#1F1127] text-xs font-black uppercase">
                <Truck className="w-3.5 h-3.5" />
                <span>NATIONWIDE CLIMATE CONTROL</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl text-[#1F1127] uppercase leading-none">
                Insulated Express Courier Delivery
              </h1>

              <p className="text-xs sm:text-sm font-bold text-[#1F1127]/80 max-w-2xl leading-relaxed">
                Fine butter toffee cannot endure Egyptian heat in a regular cardboard box. That is why every toomakt package is enclosed in custom thermal insulation with frozen gel packs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t-2 border-[#1F1127]">
                <div className="p-4 bg-[#F5EFE6] rounded-xl border-2 border-[#1F1127] space-y-1">
                  <span className="font-display font-black text-xl text-[#FF5E2B] block">Cairo & Giza</span>
                  <span className="text-xs font-bold text-[#1F1127] block">Same-Day / Next-Day Delivery</span>
                  <span className="text-[10px] text-[#1F1127]/60 font-bold block">Free over EGP 2,500</span>
                </div>
                <div className="p-4 bg-[#F5EFE6] rounded-xl border-2 border-[#1F1127] space-y-1">
                  <span className="font-display font-black text-xl text-[#FFE842] block">Alexandria & Delta</span>
                  <span className="text-xs font-bold text-[#1F1127] block">24 - 48 Hours Express</span>
                  <span className="text-[10px] text-[#1F1127]/60 font-bold block">Thermal Gel Pack Protected</span>
                </div>
                <div className="p-4 bg-[#F5EFE6] rounded-xl border-2 border-[#1F1127] space-y-1">
                  <span className="font-display font-black text-xl text-[#C4E86E] block">Red Sea & Upper Egypt</span>
                  <span className="text-xs font-bold text-[#1F1127] block">48 - 72 Hours Guaranteed</span>
                  <span className="text-[10px] text-[#1F1127]/60 font-bold block">Reinforced Cooler Packing</span>
                </div>
              </div>
            </div>

            {/* Insulation Anatomy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="card-neo bg-[#C4E86E] p-6 space-y-3">
                <span className="font-display font-black text-xs uppercase text-[#1F1127]">
                  ECO THERMAL SHIELD
                </span>
                <h3 className="font-display font-black text-xl text-[#1F1127] uppercase">
                  100% Recyclable Plant-Fiber Liners
                </h3>
                <p className="text-xs font-bold text-[#1F1127]/80 leading-relaxed">
                  Our box liners are made of biodegradable paper fluff that reflects ambient radiant heat while keeping chilled internal temperatures stable for up to 72 hours.
                </p>
              </div>

              <div className="card-neo bg-[#4AD4DA] p-6 space-y-3">
                <span className="font-display font-black text-xs uppercase text-[#1F1127]">
                  TEMPERATURE BUFFER
                </span>
                <h3 className="font-display font-black text-xl text-[#1F1127] uppercase">
                  Food-Grade Reusable Gel Packs
                </h3>
                <p className="text-xs font-bold text-[#1F1127]/80 leading-relaxed">
                  Non-toxic frozen gel packs keep your toffee firm and cool during transit. Re-freeze them at home for picnics, lunchboxes, or grocery trips.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FAQ */}
        {/* ========================================================================= */}
        {activeTab === 'faq' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-neo bg-[#FFFDF5] p-6 sm:p-10 space-y-6"
          >
            <div className="pb-4 border-b-2 border-[#1F1127]">
              <span className="badge-neo bg-[#FFE842] text-[#1F1127] mb-2">
                ANSWERS TO FREQUENT INQUIRIES
              </span>
              <h1 className="font-display font-black text-2xl sm:text-4xl text-[#1F1127] uppercase">
                Frequently Asked Questions
              </h1>
            </div>

            <div className="space-y-3">
              {faqItems.map((item, idx) => {
                const isOpen = activeAccordion === idx;
                return (
                  <div
                    key={idx}
                    className="card-neo bg-[#F5EFE6] overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveAccordion(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none font-display font-black text-sm uppercase text-[#1F1127]"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#1F1127] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#FF5E2B]' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 sm:px-5 pb-5 text-xs font-bold text-[#1F1127]/80 leading-relaxed border-t-2 border-[#1F1127]/10 pt-3"
                        >
                          {item.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Global Bottom CTA across all tabs */}
        <div className="card-neo bg-[#1F1127] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display font-black text-xl text-[#FFE842] uppercase">
              Ready to taste the Fruit Weather?
            </h3>
            <p className="text-xs font-bold text-[#F5EFE6]/70">
              Explore all 9 seasonal batches or build your own custom forecast box today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateView && onNavigateView('shop')}
              className="btn-neo bg-[#FFE842] text-[#1F1127] px-6 py-3 text-xs font-black uppercase cursor-pointer"
            >
              Shop Taste Lab
            </button>
            <button
              onClick={() => onNavigateView && onNavigateView('wholesale')}
              className="btn-neo bg-[#FF5E2B] text-white px-6 py-3 text-xs font-black uppercase cursor-pointer"
            >
              Wholesale Portal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
