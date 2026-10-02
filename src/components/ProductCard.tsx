import React, { useState } from 'react';
import { Plus, Check, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  showDescription?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  showDescription = true,
}) => {
  const { addToCart } = useCart();
  const { isRtl } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);

  const stock = product.stock_quantity ?? (product.in_stock ? 50 : 0);
  const isOutOfStock = stock <= 0 || product.in_stock === false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const isDarkCard = product.cardBgColor === '#1F1127';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={() => onSelectProduct(product)}
      className={`group rounded-2xl border-2 border-[#1F1127] shadow-neo hover:shadow-neo-lg transition-all p-5 flex flex-col justify-between cursor-pointer select-none overflow-hidden min-h-[360px] ${
        isDarkCard ? 'text-white' : 'text-[#1F1127]'
      }`}
      style={{ backgroundColor: product.cardBgColor || '#FFE842' }}
    >
      {/* Top Tag & 45S Chew */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`badge-neo text-[10px] px-2.5 py-0.5 ${
            isDarkCard ? 'bg-[#FFE842] text-[#1F1127]' : 'bg-[#1F1127] text-white'
          }`}
        >
          {product.badge || 'WEATHER BITE'}
        </span>
        <span className="text-[10px] font-mono font-bold opacity-75">
          45S CHEW
        </span>
      </div>

      {/* Candy Image Stage */}
      <div className="relative aspect-4/3 rounded-xl border-2 border-[#1F1127] bg-[#FFFDF5] p-3 flex items-center justify-center overflow-hidden mb-4 shadow-neo-sm group-hover:scale-102 transition-transform">
        <img
          src={product.image || '/images/canister.jpg'}
          alt={product.name}
          className="w-full h-full object-contain filter drop-shadow group-hover:rotate-2 transition-transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#1F1127]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="badge-neo bg-[#FFFDF5] text-[#1F1127] text-[10px]">
            <Eye className="w-3 h-3 mr-1" />
            QUICK VIEW
          </span>
        </div>
      </div>

      {/* Product Name & Tagline */}
      <div className="flex-1">
        <h3 className="font-display text-lg sm:text-xl font-black uppercase leading-tight line-clamp-1">
          {product.name}
        </h3>
        {showDescription && (
          <p className="text-xs font-bold mt-1 line-clamp-2 opacity-80 leading-relaxed">
            {product.tagline || product.description}
          </p>
        )}
      </div>

      {/* Price & Action Row */}
      <div className="pt-3 mt-3 border-t-2 border-[#1F1127] flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider opacity-70 block">
            PRICE
          </span>
          <span className="font-display font-black text-base sm:text-lg">
            {product.price} EGP
          </span>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`w-9 h-9 rounded-full border-2 border-[#1F1127] flex items-center justify-center transition-all cursor-pointer ${
            justAdded
              ? 'bg-[#C4E86E] text-[#1F1127]'
              : isDarkCard
              ? 'bg-[#FFE842] text-[#1F1127] hover:bg-white'
              : 'bg-[#1F1127] text-white hover:bg-[#FF5E2B] shadow-neo-sm'
          }`}
          title="Add to Bag"
        >
          {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
};
