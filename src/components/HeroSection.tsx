import React, { useState } from 'react';
import {
  ArrowRight,
  Sun,
  Sparkles,
  ShoppingBag,
  Plus,
  Check,
  CloudSun,
  Flame,
  Zap,
  RotateCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';
import { FLAVOR_VAULT_PRODUCTS } from '../data/toomaktData';

interface HeroSectionProps {
  onShopNow: () => void;
  onExploreFlavors: () => void;
  onSelectProduct: (p: Product) => void;
  onDirectCheckout?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopNow,
  onExploreFlavors,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { isRtl } = useLanguage();
  const [activeBubble, setActiveBubble] = useState<string>('mango-sunbeam');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const heroFlavors = [
    {
      id: 'mango-sunbeam',
      name: isRtl ? 'مانجو سن بيم' : 'Mango Sunbeam',
      tagline: isRtl ? 'زبدية، ذهبية، مشرقة' : 'buttery, golden, bright',
      price: 220,
      color: '#FFE842',
      textColor: '#1F1127',
      position: 'top-right',
      orbitDeg: 45,
      product: FLAVOR_VAULT_PRODUCTS.find(p => p.id === 'mango-sunbeam') || FLAVOR_VAULT_PRODUCTS[0]
    },
    {
      id: 'berry-afterglow',
      name: isRtl ? 'بيري أفترجلو' : 'Berry Afterglow',
      tagline: isRtl ? 'عصارية، برية، لا تقاوم' : 'juicy, tart, wild',
      price: 230,
      color: '#FF4D8D',
      textColor: '#FFFFFF',
      position: 'bottom-left',
      orbitDeg: 210,
      product: FLAVOR_VAULT_PRODUCTS.find(p => p.id === 'berry-afterglow') || FLAVOR_VAULT_PRODUCTS[1]
    },
    {
      id: 'citrus-comet',
      name: isRtl ? 'سترس كوميت' : 'Citrus Comet',
      tagline: isRtl ? 'منعشة، فوارة بالحمضيات' : 'zesty, sparkling',
      price: 210,
      color: '#C4E86E',
      textColor: '#1F1127',
      position: 'bottom-right',
      orbitDeg: 330,
      product: FLAVOR_VAULT_PRODUCTS.find(p => p.id === 'citrus-comet') || FLAVOR_VAULT_PRODUCTS[2]
    }
  ];

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p, 1);
    setJustAddedId(p.id);
    setTimeout(() => setJustAddedId(null), 1600);
  };

  const selectedFlavor = heroFlavors.find(f => f.id === activeBubble) || heroFlavors[0];

  return (
    <section className="relative bg-[#F5EFE6] pt-8 sm:pt-14 pb-14 overflow-hidden border-b-2 border-[#1F1127]">
      {/* Decorative Background Dotted Pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1F1127 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE842] border-2 border-[#1F1127] shadow-neo-sm mb-6 select-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF5E2B]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#1F1127]">
                {isRtl ? 'إصدارات جديدة / معمل النكهات' : 'NEW ARRIVALS / TASTE LAB'}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl xl:text-7xl font-black text-[#1F1127] leading-[0.98] tracking-tight uppercase mb-5"
            >
              {isRtl ? (
                <>
                  توقع اليوم: <br />
                  <span className="text-[#FF5E2B]">نسبة الفرح 100%</span>
                </>
              ) : (
                <>
                  TODAY'S FORECAST: <br />
                  <span className="text-[#FF5E2B]">100% CHANCE</span> <br />
                  OF JOY.
                </>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl font-bold text-[#1F1127]/80 max-w-lg mb-8 leading-snug"
            >
              {isRtl
                ? 'فاكهة طبيعية 100%. مضغة مخملية طرية تدوم 45 ثانية. بدون أي نكهات صناعية أو مكونات مملة.'
                : 'Real fruit. Soft-chew. Zero boring bites.'}
            </motion.p>

            {/* Dual CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3.5 sm:gap-4 w-full sm:w-auto mb-8"
            >
              {/* Primary CTA */}
              <button
                type="button"
                onClick={onShopNow}
                className="btn-neo bg-[#FF5E2B] text-white px-7 py-3.5 text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#ff480e] cursor-pointer shadow-neo"
              >
                <span>{isRtl ? 'ادخل معمل النكهات' : 'ENTER THE TASTE LAB'}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={onExploreFlavors}
                className="btn-neo bg-[#FFFDF5] text-[#1F1127] px-7 py-3.5 text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#FFE842] cursor-pointer shadow-neo"
              >
                <span>{isRtl ? 'كيف نصنعها' : "SEE HOW IT'S MADE"}</span>
              </button>
            </motion.div>

            {/* Quick Guarantees Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-extrabold text-[#1F1127] uppercase tracking-wider">
              <span className="px-3 py-1 rounded-full bg-[#FFFDF5] border border-[#1F1127]">
                {isRtl ? 'شحن مبرد 100%' : '100% COOLER PACKED'}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFFDF5] border border-[#1F1127]">
                {isRtl ? 'زبدة أوروبية فاخرة' : 'CULTURED BUTTER'}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFFDF5] border border-[#1F1127]">
                {isRtl ? 'بيوريه فاكهة نقي' : 'REAL FRUIT PURÉE'}
              </span>
            </div>
          </div>

          {/* Right Column: The Fruit Weather System Interactive Graphic */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] sm:min-h-[490px]">
            {/* Background Orbital Rings (Dashed Neo SVG) */}
            <svg
              className="absolute w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] pointer-events-none opacity-40 animate-spin"
              style={{ animationDuration: '60s' }}
              viewBox="0 0 500 500"
            >
              <circle
                cx="250"
                cy="250"
                r="220"
                fill="none"
                stroke="#1F1127"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
              <circle
                cx="250"
                cy="250"
                r="150"
                fill="none"
                stroke="#1F1127"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Center Yellow Sun Weather Dial */}
            <motion.div
              whileHover={{ scale: 1.04, rotate: 2 }}
              className="relative z-10 w-44 sm:w-52 h-44 sm:h-52 rounded-full bg-[#FFE842] border-3 border-[#1F1127] shadow-neo-lg flex flex-col items-center justify-center p-4 text-center select-none cursor-pointer"
              onClick={() => onSelectProduct(selectedFlavor.product)}
            >
              {/* Sun Radiance Ticks */}
              <div className="absolute inset-1 rounded-full border border-dashed border-[#1F1127]/30 pointer-events-none" />

              <span className="text-[10px] font-black uppercase tracking-widest text-[#1F1127] mb-1">
                {isRtl ? 'مؤشر الفرح' : 'UV INDEX 08'}
              </span>

              <div className="flex items-center gap-1 my-1">
                <Sun className="w-8 h-8 text-[#FF5E2B] animate-spin" style={{ animationDuration: '18s' }} />
                <span className="text-3xl sm:text-4xl font-black text-[#1F1127] font-display">
                  100%
                </span>
              </div>

              <span className="text-xs font-black uppercase tracking-wider text-[#1F1127]">
                {isRtl ? 'فرح عالي جداً' : 'HIGH JOY'}
              </span>

              <span className="mt-1 text-[10px] font-bold text-[#FF5E2B] underline decoration-2 cursor-pointer">
                {isRtl ? 'عرض التفاصيل' : 'TAP TO INSPECT'}
              </span>
            </motion.div>

            {/* Floating Orbiting Flavor Circles */}
            {/* 1. Mango Sunbeam (Top Right) */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0]
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              onClick={() => {
                setActiveBubble('mango-sunbeam');
                onSelectProduct(heroFlavors[0].product);
              }}
              className="absolute -top-4 sm:top-2 right-2 sm:right-6 z-20 cursor-pointer group"
            >
              <div className="w-28 sm:w-34 h-28 sm:h-34 rounded-full bg-[#FFE842] border-2 border-[#1F1127] shadow-neo flex flex-col items-center justify-center p-2 text-center transition-transform group-hover:scale-108">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#1F1127] opacity-75">
                  NO. 01
                </span>
                <span className="font-display font-black text-xs sm:text-sm text-[#1F1127] uppercase leading-tight line-clamp-1">
                  Mango Sunbeam
                </span>
                <span className="text-[10px] font-extrabold text-[#FF5E2B] mt-0.5">
                  220 EGP
                </span>
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(heroFlavors[0].product, e)}
                  className="mt-1 w-6 h-6 rounded-full bg-[#1F1127] text-white flex items-center justify-center text-xs hover:bg-[#FF5E2B] transition-colors"
                  title="Add to Bag"
                >
                  {justAddedId === 'mango-sunbeam' ? <Check className="w-3.5 h-3.5 text-[#C4E86E]" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>
            </motion.div>

            {/* 2. Berry Afterglow (Bottom Left) */}
            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: [0, -2, 0]
              }}
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5
              }}
              onClick={() => {
                setActiveBubble('berry-afterglow');
                onSelectProduct(heroFlavors[1].product);
              }}
              className="absolute bottom-2 sm:bottom-4 left-0 sm:left-4 z-20 cursor-pointer group"
            >
              <div className="w-28 sm:w-34 h-28 sm:h-34 rounded-full bg-[#FF4D8D] border-2 border-[#1F1127] shadow-neo flex flex-col items-center justify-center p-2 text-center transition-transform group-hover:scale-108 text-white">
                <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.2 bg-[#1F1127] text-[#FFE842] rounded-full mb-0.5">
                  POPULAR
                </span>
                <span className="font-display font-black text-xs sm:text-sm uppercase leading-tight line-clamp-1">
                  Berry Afterglow
                </span>
                <span className="text-[10px] font-extrabold text-white mt-0.5">
                  230 EGP
                </span>
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(heroFlavors[1].product, e)}
                  className="mt-1 w-6 h-6 rounded-full bg-[#1F1127] text-white flex items-center justify-center text-xs hover:bg-[#FFE842] hover:text-[#1F1127] transition-colors"
                  title="Add to Bag"
                >
                  {justAddedId === 'berry-afterglow' ? <Check className="w-3.5 h-3.5 text-[#C4E86E]" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>
            </motion.div>

            {/* 3. Citrus Comet (Bottom Right) */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 1.5, 0]
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.2
              }}
              onClick={() => {
                setActiveBubble('citrus-comet');
                onSelectProduct(heroFlavors[2].product);
              }}
              className="absolute bottom-4 sm:bottom-6 right-4 sm:right-10 z-20 cursor-pointer group"
            >
              <div className="w-26 sm:w-32 h-26 sm:h-32 rounded-full bg-[#C4E86E] border-2 border-[#1F1127] shadow-neo flex flex-col items-center justify-center p-2 text-center transition-transform group-hover:scale-108 text-[#1F1127]">
                <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.2 bg-[#FF5E2B] text-white rounded-full mb-0.5">
                  DROP
                </span>
                <span className="font-display font-black text-xs sm:text-sm uppercase leading-tight line-clamp-1">
                  Citrus Comet
                </span>
                <span className="text-[10px] font-extrabold text-[#1F1127] mt-0.5">
                  210 EGP
                </span>
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(heroFlavors[2].product, e)}
                  className="mt-1 w-6 h-6 rounded-full bg-[#1F1127] text-white flex items-center justify-center text-xs hover:bg-[#FF5E2B] transition-colors"
                  title="Add to Bag"
                >
                  {justAddedId === 'citrus-comet' ? <Check className="w-3.5 h-3.5 text-[#C4E86E]" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>
            </motion.div>

          </div>

        </div>
      </div>

      {/* Frame 1 Bottom Marquee Strip (Black ribbon with yellow/cream repeating text) */}
      <div className="mt-12 bg-[#1F1127] text-[#FFE842] py-3.5 border-y-2 border-[#1F1127] overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap font-display text-xs sm:text-sm font-black tracking-widest uppercase">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-6">
              <span className="text-[#FFE842]">CHEWY</span>
              <span className="text-[#F5EFE6]">•</span>
              <span className="text-[#FF5E2B]">BRIGHT</span>
              <span className="text-[#F5EFE6]">•</span>
              <span className="text-[#C4E86E]">BUTTERY</span>
              <span className="text-[#F5EFE6]">•</span>
              <span className="text-[#FF4D8D]">FRUITY</span>
              <span className="text-[#F5EFE6]">•</span>
              <span className="text-[#4AD4DA]">SMALL-BATCH</span>
              <span className="text-[#F5EFE6]">•</span>
              <span className="text-[#FFE842]">MADE TO SHARE</span>
              <span className="text-[#F5EFE6]">•</span>
              <span className="text-[#F5EFE6]">HANDMADE IN CAIRO</span>
              <span className="text-[#F5EFE6]">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
