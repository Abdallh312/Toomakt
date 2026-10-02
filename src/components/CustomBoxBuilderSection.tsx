import React, { useState } from 'react';
import { Package, Sparkles, Check, Plus, ArrowRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FLAVOR_VAULT_PRODUCTS } from '../data/toomaktData';

export const CustomBoxBuilderSection: React.FC = () => {
  const { addToCart } = useCart();
  const { isRtl } = useLanguage();

  const bases = [
    { id: 'sun-chaser', name: 'THE SUN CHASER', arabic: 'صائد الشمس', price: 750, color: '#FFE842', desc: '4-flavor signature fruit forecast' },
    { id: 'sweet-talker', name: 'THE SWEET TALKER', arabic: 'عاشق الكراميل', price: 820, color: '#FFB088', desc: 'Buttery caramel & peach infusion' },
    { id: 'office-hero', name: 'THE OFFICE HERO', arabic: 'بطل المكتب', price: 980, color: '#C4E86E', desc: 'Generous sharing presentation' },
  ];

  const fruits = [
    { id: 'mango-sunbeam', name: 'Mango Sunbeam', color: '#FFE842' },
    { id: 'berry-afterglow', name: 'Berry Afterglow', color: '#FF4D8D' },
    { id: 'citrus-comet', name: 'Citrus Comet', color: '#C4E86E' },
    { id: 'peach-daydream', name: 'Peach Daydream', color: '#FFB088' },
    { id: 'guava-hotline', name: 'Guava Hotline', color: '#FF6B6B' },
    { id: 'pineapple-frequency', name: 'Pineapple Frequency', color: '#4AD4DA' },
  ];

  const [selectedBase, setSelectedBase] = useState(bases[0]);
  const [selectedFruits, setSelectedFruits] = useState<string[]>([
    'mango-sunbeam',
    'berry-afterglow',
    'citrus-comet',
    'peach-daydream'
  ]);
  const [boxName, setBoxName] = useState('SUNSHINE BATCH NO. 01');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFruit = (fruitId: string) => {
    if (selectedFruits.includes(fruitId)) {
      if (selectedFruits.length > 1) {
        setSelectedFruits(selectedFruits.filter(f => f !== fruitId));
      }
    } else {
      if (selectedFruits.length < 4) {
        setSelectedFruits([...selectedFruits, fruitId]);
      } else {
        // Replace oldest
        setSelectedFruits([...selectedFruits.slice(1), fruitId]);
      }
    }
  };

  const handleMakeBox = () => {
    setIsSubmitting(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const customBoxProduct = {
      id: `custom-box-${Date.now()}`,
      name: `${selectedBase.name}: "${boxName}"`,
      tagline: `Custom 4-pack: ${selectedFruits.join(', ')}`,
      description: `Personalized ${selectedBase.name} containing ${selectedFruits.length} handcrafted weather flavors.`,
      badge: 'CUSTOM BOX',
      price: selectedBase.price,
      weight: '1000g Custom Box',
      category: 'giftably' as const,
      rating: 5.0,
      reviewsCount: 1,
      chewiness: 9.8,
      fruitImpact: { label: 'Custom Blend', score: 10.0 },
      fruitNotes: selectedFruits,
      image: '/images/toomakt/hero_family_showcase.webp',
      accentColor: '#1F1127',
      lightBgColor: '#FF5E2B',
      isPopular: true
    };

    addToCart(customBoxProduct, 1);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <section id="build-a-box" className="py-16 sm:py-24 bg-[#FF5E2B] text-[#1F1127] border-b-2 border-[#1F1127] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="badge-neo bg-[#FFFDF5] text-[#1F1127] mb-3">
            {isRtl ? 'صمم على ذوقك' : 'CUSTOM LAB'}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase text-[#1F1127] leading-tight">
            {isRtl ? 'صمم بوكس يشبهك تماماً.' : 'BUILD A BOX THAT LOOKS LIKE YOU.'}
          </h2>
          <p className="mt-3 text-base sm:text-lg font-bold text-[#1F1127]/90 max-w-xl mx-auto">
            {isRtl
              ? 'اختر القاعدة، وزع نكهات الفواكه المفضلة، واكتب اسمك أو إهداءك على العلبة.'
              : 'Pick your base, choose your favorite fruit weather systems, and stamp your name on the box.'}
          </p>
        </div>

        {/* 3 Step Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          
          {/* Step 01: Pick A Base */}
          <div className="bg-[#FFFDF5] rounded-2xl border-2 border-[#1F1127] shadow-neo p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-black text-xs uppercase px-2.5 py-1 rounded-full bg-[#1F1127] text-[#FFE842]">
                  01 PICK A BASE
                </span>
                <Package className="w-5 h-5 text-[#1F1127]" />
              </div>

              <h3 className="font-display text-xl font-black uppercase text-[#1F1127] mb-4">
                {isRtl ? 'اختر حجم العلبة' : 'Choose Your Foundation'}
              </h3>

              <div className="flex flex-col gap-2.5">
                {bases.map((base) => {
                  const isSelected = selectedBase.id === base.id;
                  return (
                    <button
                      key={base.id}
                      type="button"
                      onClick={() => setSelectedBase(base)}
                      className={`w-full py-3 px-4 rounded-xl border-2 border-[#1F1127] text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFE842] shadow-neo-sm font-black translate-x-1'
                          : 'bg-[#F5EFE6] hover:bg-white font-bold'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs uppercase font-display text-[#1F1127]">
                          {isRtl ? base.arabic : base.name}
                        </span>
                        <span className="text-[10px] text-[#1F1127]/70 font-sans">
                          {base.desc}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-black text-[#1F1127]">
                        {base.price} EGP
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1F1127]/20 flex items-center justify-between text-xs font-bold text-[#1F1127]">
              <span>ACTIVE BASE:</span>
              <span className="font-mono font-black text-[#FF5E2B] bg-[#1F1127] px-2 py-0.5 rounded text-[11px] text-white">
                {selectedBase.name}
              </span>
            </div>
          </div>

          {/* Step 02: Add Your Fruit */}
          <div className="bg-[#FFFDF5] rounded-2xl border-2 border-[#1F1127] shadow-neo p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-black text-xs uppercase px-2.5 py-1 rounded-full bg-[#1F1127] text-[#FFE842]">
                  02 ADD YOUR FRUIT
                </span>
                <span className="text-xs font-mono font-black text-[#FF5E2B]">
                  {selectedFruits.length}/4 CHOSEN
                </span>
              </div>

              <h3 className="font-display text-xl font-black uppercase text-[#1F1127] mb-4">
                {isRtl ? 'اختر حتى 4 نكهات' : 'Select Up To 4 Bites'}
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {fruits.map((fruit) => {
                  const isSelected = selectedFruits.includes(fruit.id);
                  return (
                    <button
                      key={fruit.id}
                      type="button"
                      onClick={() => toggleFruit(fruit.id)}
                      className={`p-2.5 rounded-xl border-2 border-[#1F1127] text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'shadow-neo-sm font-black'
                          : 'opacity-70 hover:opacity-100 bg-[#F5EFE6]'
                      }`}
                      style={{
                        backgroundColor: isSelected ? fruit.color : '#F5EFE6'
                      }}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[10px] font-mono font-bold text-[#1F1127]">
                          {isSelected ? '✓ IN BOX' : '+ ADD'}
                        </span>
                      </div>
                      <span className="text-xs font-display font-black text-[#1F1127] uppercase leading-tight line-clamp-1">
                        {fruit.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Visual Box Slots */}
            <div className="mt-6 pt-4 border-t border-[#1F1127]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F1127] mb-1.5 block">
                BOX TRAY PREVIEW:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const fruitId = selectedFruits[slotIdx];
                  const fruit = fruits.find(f => f.id === fruitId);
                  return (
                    <div
                      key={slotIdx}
                      className="aspect-square rounded-lg border-2 border-[#1F1127] flex items-center justify-center text-[9px] font-black text-[#1F1127] uppercase text-center p-1"
                      style={{ backgroundColor: fruit ? fruit.color : '#E5DFD5' }}
                    >
                      {fruit ? fruit.name.split(' ')[0] : 'EMPTY'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 03: Name Your Box */}
          <div className="bg-[#FFFDF5] rounded-2xl border-2 border-[#1F1127] shadow-neo p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-black text-xs uppercase px-2.5 py-1 rounded-full bg-[#1F1127] text-[#FFE842]">
                  03 NAME YOUR BOX
                </span>
                <Sparkles className="w-5 h-5 text-[#FF5E2B]" />
              </div>

              <h3 className="font-display text-xl font-black uppercase text-[#1F1127] mb-4">
                {isRtl ? 'ضع توقيعك على العلبة' : 'Stamp Your Custom Sleeve'}
              </h3>

              <div className="space-y-3">
                <label className="text-xs font-bold text-[#1F1127] uppercase tracking-wider block">
                  {isRtl ? 'اسم البوكس أو الإهداء:' : 'Box Sleeve Name:'}
                </label>
                <input
                  type="text"
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value.toUpperCase().slice(0, 28))}
                  placeholder="e.g. MAYA'S SUNSHINE STASH"
                  className="w-full py-3 px-4 rounded-xl border-2 border-[#1F1127] bg-[#F5EFE6] font-display font-black text-xs sm:text-sm text-[#1F1127] uppercase focus:outline-none focus:bg-white shadow-neo-sm"
                />
              </div>

              {/* Sleeve Mockup Preview */}
              <div className="mt-5 p-4 rounded-xl border-2 border-[#1F1127] bg-[#1F1127] text-[#FFFDF5] text-center shadow-neo-sm">
                <span className="text-[9px] font-mono text-[#FFE842] uppercase tracking-widest block mb-1">
                  TOOMAKT CUSTOM ATELIER SLEEVE
                </span>
                <span className="font-display font-black text-sm sm:text-base text-white tracking-wider uppercase block">
                  "{boxName || 'UNTITLED BATCH'}"
                </span>
                <span className="text-[9px] text-[#C4E86E] font-bold block mt-1">
                  HANDMADE IN SMALL BATCHES • CAIRO
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1F1127]/20 flex items-center justify-between text-xs font-bold text-[#1F1127]">
              <span>TOTAL PRICE:</span>
              <span className="font-display font-black text-lg text-[#1F1127]">
                {selectedBase.price} EGP
              </span>
            </div>
          </div>

        </div>

        {/* Big Action Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleMakeBox}
            disabled={isSubmitting}
            className="btn-neo bg-[#1F1127] text-[#FFE842] hover:bg-black px-10 py-4 text-base sm:text-lg flex items-center gap-3 shadow-neo cursor-pointer select-none"
          >
            {isSubmitting ? (
              <>
                <Check className="w-5 h-5 text-[#C4E86E]" />
                <span>BOX CREATED & ADDED TO BAG!</span>
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                <span>{isRtl ? 'اصنع علبتي المخصصة' : 'MAKE MY BOX'}</span>
                <span className="text-white font-mono text-sm">({selectedBase.price} EGP)</span>
              </>
            )}
          </motion.button>
        </div>

      </div>
    </section>
  );
};
