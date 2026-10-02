import React, { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={() => onSelectProduct(product)}
      className="group bg-white border border-[#E8E2D7] rounded-2xl overflow-hidden hover:border-[#1A1A1A] hover:shadow-soft-md transition-all flex flex-col justify-between cursor-pointer select-none"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2] border-b border-[#E8E2D7]/60">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Optional Tag / Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
            <span className="bg-[#FAF7F2]/90 backdrop-blur-sm text-[#1A1A1A] border border-[#E8E2D7] text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* Info & Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1A1A1A] group-hover:text-[#3C1322] transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          {showDescription && (
            <p className="text-xs sm:text-sm text-[#736B63] mt-1 font-light line-clamp-2 leading-relaxed">
              {product.tagline || product.description}
            </p>
          )}
        </div>

        {/* Price & Add to Bag Row */}
        <div className="pt-4 mt-4 border-t border-[#E8E2D7] flex items-center justify-between gap-3">
          <div>
            <span className="text-sm sm:text-base font-medium text-[#1A1A1A]">
              EGP {product.price.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
              justAdded
                ? 'bg-[#3C1322] text-[#FAF7F2] border-[#3C1322]'
                : isOutOfStock
                ? 'bg-[#F4EFEA] text-[#9B938A] border-[#E8E2D7] cursor-not-allowed'
                : 'border-[#E8E2D7] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF7F2] hover:border-[#1A1A1A]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{isRtl ? 'تمت الإضافة' : 'Added'}</span>
              </>
            ) : isOutOfStock ? (
              <span>{isRtl ? 'نفذت الكمية' : 'Sold out'}</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isRtl ? 'أضف للحقيبة' : 'Add to bag'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
