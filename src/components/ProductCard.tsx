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
  const { isRtl, formatPrice } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);

  const stock = product.stock_quantity ?? (product.in_stock ? 50 : 0);
  const isOutOfStock = stock <= 0 || product.in_stock === false;

  const displayName = isRtl
    ? (product.name_ar || product.name)
    : (product.name_en || product.name);

  const displayTagline = isRtl
    ? (product.tagline_ar || product.tagline || product.description_ar || product.description)
    : (product.tagline_en || product.tagline || product.description_en || product.description);

  const displayBadge = isRtl
    ? (product.badge_ar || product.badge)
    : (product.badge_en || product.badge);

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
      className="group bg-white dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] rounded-2xl overflow-hidden hover:border-[#1A1A1A] dark:hover:border-[#E8BD6D] hover:shadow-soft-md transition-all flex flex-col justify-between cursor-pointer select-none"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2] dark:bg-[#120D11] border-b border-[#E8E2D7]/60 dark:border-[#33242E]">
        {(() => {
          const webpSrc = product.image ? product.image.replace(/\.(jpe?g|png)$/i, '.webp') : '';
          return (
            <picture className="w-full h-full block">
              {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
              <img
                src={product.image}
                alt={displayName}
                width="400"
                height="400"
                decoding="async"
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </picture>
          );
        })()}

        {/* Optional Tag / Badge */}
        {displayBadge && (
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
            <span className="bg-[#FAF7F2]/90 dark:bg-[#1B1419]/90 backdrop-blur-sm text-[#1A1A1A] dark:text-[#F7F3EC] border border-[#E8E2D7] dark:border-[#33242E] text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">
              {displayBadge}
            </span>
          </div>
        )}
      </div>

      {/* Info & Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] group-hover:text-[#3C1322] dark:group-hover:text-[#E8BD6D] transition-colors line-clamp-1">
              {displayName}
            </h3>
            {product.available_flavors && product.available_flavors.length > 1 && (
              <span className="text-[10px] font-medium text-[#3C1322] dark:text-[#E8BD6D] bg-[#FFD147]/30 dark:bg-[#E8BD6D]/15 border border-[#FFD147]/50 dark:border-[#E8BD6D]/30 px-2 py-0.5 rounded-full shrink-0">
                {product.available_flavors.length} {isRtl ? 'نكهات' : 'Flavors'}
              </span>
            )}
          </div>
          
          {showDescription && (
            <p className="text-xs sm:text-sm text-[#736B63] dark:text-[#C8BEB5] mt-1 font-light line-clamp-2 leading-relaxed">
              {displayTagline}
            </p>
          )}

          {/* Pack Quantity / Weight Detail */}
          {(product.pack_quantity || product.weight) && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#241A21] text-[#736B63] dark:text-[#C8BEB5] border border-[#E8E2D7] dark:border-[#33242E]">
                {isRtl
                  ? (product.pack_quantity_ar || product.pack_quantity || product.weight)
                  : (product.pack_quantity_en || product.pack_quantity || product.weight)}
              </span>
            </div>
          )}
        </div>

        {/* Price & Add to Bag Row */}
        <div className="pt-4 mt-4 border-t border-[#E8E2D7] dark:border-[#33242E] flex items-center justify-between gap-3">
          <div>
            <span className="text-sm sm:text-base font-semibold text-[#1A1A1A] dark:text-[#F7F3EC]">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
              justAdded
                ? 'bg-[#3C1322] dark:bg-[#E8BD6D] text-[#FAF7F2] dark:text-[#120D11] border-[#3C1322] dark:border-[#E8BD6D] shadow-[0_2px_10px_rgba(232,189,109,0.3)]'
                : isOutOfStock
                ? 'bg-[#F4EFEA] text-[#9B938A] border-[#E8E2D7] cursor-not-allowed'
                : 'border-[#E8E2D7] dark:border-[#33242E] text-[#1A1A1A] dark:text-[#F7F3EC] hover:bg-[#1A1A1A] hover:text-[#FAF7F2] dark:hover:bg-[#E8BD6D] dark:hover:text-[#120D11] dark:hover:border-[#E8BD6D]'
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
