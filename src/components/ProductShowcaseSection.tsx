import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, Check, ArrowRight, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductShowcaseSectionProps {
  onSelectProduct?: (product: Product) => void;
  onExploreCatalog?: () => void;
}

interface ShowcaseItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  accentColor: string;
  chewiness: number;
  intensity: number;
  butterfat: string;
  keyIngredients: string[];
}

export const ProductShowcaseSection: React.FC<ProductShowcaseSectionProps> = ({
  onSelectProduct,
  onExploreCatalog,
}) => {
  const { addToCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'fruit-candy-pouch',
      name: 'Fruity Candy & Orchard Toffee',
      category: 'Fruit Toffee & Fruity Candy',
      tagline: 'Vibrant layers of sun-ripened strawberry, mango nectar, and citrus folded in soft caramel.',
      description:
        'Cooked slowly with pure fruit purée to retain authentic fruit acids, then layered with sweet cream to achieve our signature 45-second multi-stage sensory chew.',
      price: 22.00,
      image: '/images/toomakt/cat_fruity_candy.webp',
      accentColor: '#C2293E',
      chewiness: 9.6,
      intensity: 9.9,
      butterfat: '82% Normandy Sweet Cream',
      keyIngredients: ['Wild Alpine Strawberry', 'Alphonso Mango', 'Cold-Pressed Blood Orange', 'Fleur de Sel'],
    },
    {
      id: 'butter-milk-pouch',
      name: 'Butter & Milk Velvet Toffee',
      category: 'Traditional Confiserie',
      tagline: 'Crisp, velvety soft milk toffee crafted with slow-simmered browned butter.',
      description:
        'A nostalgic masterwork combining European butterfat, brown sugar caramelization, and Madagascar vanilla beans for a melt-in-your-mouth richness that never sticks.',
      price: 24.00,
      image: '/images/toomakt/cat_butter_milk_toffee.webp',
      accentColor: '#D97724',
      chewiness: 9.9,
      intensity: 9.4,
      butterfat: '84% Grass-Fed Butter',
      keyIngredients: ['Browned European Butter', 'Madagascar Bourbon Vanilla', 'Golden Cane Sugar', 'Sea Salt'],
    },
    {
      id: 'coffee-cappuccino-pouch',
      name: 'Roasted Arabica & Cappuccino Bonbon',
      category: 'Barista Reserve',
      tagline: 'Slow-roasted Arabica coffee extracts blended into decadent caramelized toffee.',
      description:
        'Crafted for espresso connoisseurs. Notes of freshly pulled dark roast coffee softened with silky dairy cream and dark demerara sugar.',
      price: 26.00,
      image: '/images/toomakt/cat_coffee_cappuccino.webp',
      accentColor: '#6B3E26',
      chewiness: 9.5,
      intensity: 9.8,
      butterfat: '83% Cultured Cream',
      keyIngredients: ['100% Arabica Roast', 'Steamed Whole Milk', 'Demerara Caramel', 'Hazelnut Essence'],
    },
    {
      id: 'eclairs-peanut-box',
      name: 'Molten Chocolate & Stuffed Peanut Eclairs',
      category: 'Stuffed Reserve Box',
      tagline: 'Decadent chocolate-stuffed toffee eclairs layered with crunchy roasted peanut praline.',
      description:
        'An indulgent pairing of Belgian dark chocolate ganache encased within a soft caramel shell, finished with toasted whole-nut peanut crunch.',
      price: 28.00,
      image: '/images/toomakt/cat_eclairs_peanut.webp',
      accentColor: '#7B2027',
      chewiness: 9.7,
      intensity: 9.7,
      butterfat: '84% Belgian Dark Cacao',
      keyIngredients: ['54% Dark Chocolate Core', 'Slow-Roasted Peanut Praline', 'Soft Caramel Shell', 'Vanilla'],
    },
  ];

  const current = showcaseItems[activeIndex];

  const handleQuickAdd = () => {
    const mockProduct: Product = {
      id: current.id,
      name: current.name,
      tagline: current.tagline,
      description: current.description,
      price: current.price,
      weight: '250g Pouch',
      category: 'fruits',
      rating: 4.97,
      reviewsCount: 220,
      chewiness: current.chewiness,
      fruitImpact: { label: 'Sensory', score: current.intensity },
      fruitNotes: current.keyIngredients,
      image: current.image,
      accentColor: current.accentColor,
      lightBgColor: '#FAF5EE',
      stock_quantity: 80,
    };
    addToCart(mockProduct, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <section className="py-24 bg-[#FAF6F0] relative border-b border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C26715]" />
            <span>Interactive Sensory Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#2B170E] tracking-tight leading-tight">
            The Signature Lines
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 font-normal">
            Explore each confection line crafted with distinct culinary profiles.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {showcaseItems.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'bg-white border-stone-400/80 shadow-md ring-1 ring-stone-900/10'
                    : 'bg-white/60 hover:bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div className="text-[10px] uppercase font-mono tracking-wider text-stone-400 font-semibold mb-1">
                  Line 0{index + 1}
                </div>
                <div
                  className={`font-serif font-bold text-sm sm:text-base transition-colors line-clamp-1 ${
                    isActive ? 'text-stone-900' : 'text-stone-700'
                  }`}
                >
                  {item.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Layout */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 lg:p-12 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
            >
              {/* Product Visual Stage */}
              <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-10 bg-stone-50 rounded-2xl border border-stone-100 relative">
                <motion.img
                  key={current.image}
                  src={current.image}
                  alt={current.name}
                  initial={{ scale: 0.94, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="max-h-80 sm:max-h-96 w-auto object-contain drop-shadow-lg"
                />
                <span className="absolute top-4 left-4 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-white border border-stone-200 text-stone-600">
                  {current.category}
                </span>
              </div>

              {/* Product Details Column */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 leading-tight">
                    {current.name}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                    {current.tagline}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm text-stone-500 leading-relaxed font-normal">
                    {current.description}
                  </p>
                </div>

                {/* Sensory Progress Indicators */}
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                      <span>Chewiness Index</span>
                      <span className="font-mono">{current.chewiness} / 10</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-stone-900 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${current.chewiness * 10}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                      <span>Flavor Intensity</span>
                      <span className="font-mono">{current.intensity} / 10</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#C26715] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${current.intensity * 10}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold pt-1 text-stone-600">
                    <span>Dairy / Butterfat Base</span>
                    <span className="font-mono font-bold text-stone-900">{current.butterfat}</span>
                  </div>
                </div>

                {/* Key Ingredients Tags */}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold mb-2">
                    Key Flavor Notes
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {current.keyIngredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200/80"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
                      {current.price.toFixed(2)}{' '}
                      <span className="text-xs font-sans font-semibold text-stone-500">EGP</span>
                    </div>
                    <span className="text-[11px] text-stone-500">250g Signature Pack</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleQuickAdd}
                      className={`px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center gap-2 cursor-pointer ${
                        justAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-900 hover:bg-[#C26715] text-white'
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>

                    {onExploreCatalog && (
                      <button
                        type="button"
                        onClick={onExploreCatalog}
                        className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>All Lines</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C26715]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
