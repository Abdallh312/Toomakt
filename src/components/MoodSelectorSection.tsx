import React, { useState } from 'react';
import { Sparkles, Sun, Heart, Zap, Palmtree, Plus, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';
import { FLAVOR_VAULT_PRODUCTS } from '../data/toomaktData';

interface MoodSelectorSectionProps {
  onSelectProduct: (p: Product) => void;
}

interface MoodOption {
  id: string;
  label: string;
  arabicLabel: string;
  icon: React.ElementType;
  productId: string;
  color: string;
  angle: number;
}

export const MoodSelectorSection: React.FC<MoodSelectorSectionProps> = ({ onSelectProduct }) => {
  const { addToCart } = useCart();
  const { isRtl } = useLanguage();
  const [selectedMoodId, setSelectedMoodId] = useState<string>('sunbeam');
  const [justAdded, setJustAdded] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const moods: MoodOption[] = [
    {
      id: 'sunbeam',
      label: 'NEED A SUNBEAM',
      arabicLabel: 'محتاج شعاع شمس',
      icon: Sun,
      productId: 'mango-sunbeam',
      color: '#FFE842',
      angle: 0
    },
    {
      id: 'love-note',
      label: 'SEND A LOVE NOTE',
      arabicLabel: 'ابعت رسالة حب',
      icon: Heart,
      productId: 'berry-afterglow',
      color: '#FF4D8D',
      angle: 90
    },
    {
      id: 'wake-tongue',
      label: 'WAKE UP YOUR TONGUE',
      arabicLabel: 'صحّي حواسك',
      icon: Zap,
      productId: 'citrus-comet',
      color: '#C4E86E',
      angle: 180
    },
    {
      id: 'tropical',
      label: 'GO FULL TROPICAL',
      arabicLabel: 'عيش الأجواء الاستوائية',
      icon: Palmtree,
      productId: 'pineapple-frequency',
      color: '#4AD4DA',
      angle: 270
    }
  ];

  const currentMood = moods.find(m => m.id === selectedMoodId) || moods[0];
  const currentProduct = FLAVOR_VAULT_PRODUCTS.find(p => p.id === currentMood.productId) || FLAVOR_VAULT_PRODUCTS[0];

  const handleSelectMood = (mood: MoodOption) => {
    setSelectedMoodId(mood.id);
    setWheelRotation(prev => prev + 360 - mood.angle);
  };

  const handleSpinRandom = () => {
    const nextIdx = (moods.findIndex(m => m.id === selectedMoodId) + 1) % moods.length;
    const nextMood = moods[nextIdx];
    setSelectedMoodId(nextMood.id);
    setWheelRotation(prev => prev + 180);
  };

  const handleAddCurrent = () => {
    addToCart(currentProduct, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <section id="mood-selector" className="py-16 sm:py-24 bg-[#F5EFE6] border-b-2 border-[#1F1127] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="badge-neo bg-[#FFE842] text-[#1F1127] mb-3">
            {isRtl ? 'اختر حالتك المزاجية' : 'MOOD FORECAST'}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-[#1F1127] tracking-tight uppercase leading-tight">
            {isRtl ? 'اختر مزاجك، مش بس نكهتك.' : 'CHOOSE YOUR MOOD, NOT JUST YOUR FLAVOR.'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: 4 Interactive Mood Pills Stack */}
          <div className="lg:col-span-6 flex flex-col gap-3.5 sm:gap-4">
            {moods.map((mood) => {
              const isSelected = mood.id === selectedMoodId;
              const Icon = mood.icon;

              return (
                <motion.button
                  key={mood.id}
                  type="button"
                  onClick={() => handleSelectMood(mood)}
                  whileHover={{ scale: 1.02, x: isRtl ? -4 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 sm:py-5 px-6 rounded-2xl border-2 border-[#1F1127] text-left sm:text-base font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'shadow-neo-lg translate-x-1'
                      : 'bg-[#FFFDF5] text-[#1F1127] shadow-neo-sm hover:bg-white'
                  }`}
                  style={{
                    backgroundColor: isSelected ? mood.color : '#FFFDF5',
                    color: isSelected && mood.id === 'love-note' ? '#FFFFFF' : '#1F1127'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full border-2 border-[#1F1127] flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#1F1127] text-[#FFE842]' : 'bg-[#F5EFE6] text-[#1F1127]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm sm:text-base font-display">
                      {isRtl ? mood.arabicLabel : mood.label}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-[#1F1127] ${
                      isSelected ? 'bg-[#1F1127] text-white' : 'bg-[#F5EFE6] text-[#1F1127]'
                    }`}
                  >
                    {isSelected ? 'ACTIVE' : 'SELECT'}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Right Column: Interactive Flavor Wheel Dial & Matched Flavor Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* The Multi-Segment Wheel */}
            <div className="relative w-64 sm:w-76 h-64 sm:h-76 flex items-center justify-center mb-8">
              {/* Rotating Pie Circle */}
              <motion.div
                animate={{ rotate: wheelRotation }}
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                className="w-full h-full rounded-full border-3 border-[#1F1127] shadow-neo-lg overflow-hidden relative"
                style={{
                  background: 'conic-gradient(#FFE842 0deg 90deg, #FF4D8D 90deg 180deg, #C4E86E 180deg 270deg, #4AD4DA 270deg 360deg)'
                }}
              >
                {/* Cross Grid Lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[2px] bg-[#1F1127]" />
                  <div className="h-full w-[2px] bg-[#1F1127] absolute" />
                </div>
              </motion.div>

              {/* Center "PICK A MOOD" Spin Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleSpinRandom}
                className="absolute z-20 w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-[#FFFDF5] border-3 border-[#1F1127] shadow-neo flex flex-col items-center justify-center text-center p-2 cursor-pointer hover:bg-[#FFE842] transition-colors"
                title="Click to Spin Mood Wheel"
              >
                <Sparkles className="w-4 h-4 text-[#FF5E2B] mb-0.5" />
                <span className="font-display font-black text-[11px] sm:text-xs text-[#1F1127] uppercase leading-tight">
                  {isRtl ? 'لف العجلة' : 'PICK A MOOD'}
                </span>
                <span className="text-[9px] font-bold text-[#FF5E2B] uppercase">
                  TAP TO SPIN
                </span>
              </motion.button>
            </div>

            {/* Matched Product Preview Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-md p-5 rounded-2xl border-2 border-[#1F1127] shadow-neo flex items-center justify-between gap-4"
                style={{ backgroundColor: currentMood.color }}
              >
                <div className="flex-1">
                  <span className="badge-neo bg-[#1F1127] text-white text-[9px] py-0.5 px-2 mb-1.5">
                    MATCHED FORECAST
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-black text-[#1F1127] uppercase leading-tight">
                    {currentProduct.name}
                  </h3>
                  <p className="text-xs font-bold text-[#1F1127]/80 line-clamp-1 mt-0.5">
                    {currentProduct.tagline}
                  </p>
                  <span className="inline-block mt-2 font-display font-black text-sm text-[#1F1127]">
                    {currentProduct.price} EGP
                  </span>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAddCurrent}
                    className="btn-neo bg-[#1F1127] text-white px-3.5 py-2 text-xs flex items-center gap-1.5 hover:bg-[#FF5E2B] cursor-pointer"
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C4E86E]" />
                        <span>ADDED!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD TO BAG</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectProduct(currentProduct)}
                    className="text-[11px] font-bold text-[#1F1127] hover:underline flex items-center justify-center gap-1"
                  >
                    <span>VIEW DETAILS</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
};
