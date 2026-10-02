import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Leaf,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/navigation';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigateView?: (view: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onNavigateView,
}) => {
  const { addToCart } = useCart();
  const { isRtl } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setJustAdded(false);
  }, [product?.id]);

  if (!product) return null;

  const stock = product.stock_quantity ?? (product.in_stock ? 50 : 0);
  const isOutOfStock = stock <= 0 || product.in_stock === false;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 1200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    onClose();
    if (onNavigateView) {
      onNavigateView('checkout');
    } else {
      navigateTo('checkout');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-2xl border border-[#E8E2D7] shadow-2xl overflow-hidden my-6 z-10"
          >
            {/* Header Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2 rounded-full text-[#736B63] hover:text-[#1A1A1A] hover:bg-[#F4EFEA] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Product Visual */}
              <div className="md:col-span-6 bg-white p-6 sm:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E8E2D7]">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8E2D7]/60">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                      <span className="bg-[#FAF7F2]/90 backdrop-blur-sm text-[#1A1A1A] border border-[#E8E2D7] text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {product.badge}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details & Actions */}
              <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-xs text-[#736B63]">
                    <span className="font-semibold uppercase tracking-wider text-[#3C1322]">
                      {product.category || 'Atelier Collection'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#FFD147] fill-current" />
                      <span className="font-medium text-[#1A1A1A]">{product.rating || 4.98}</span>
                      <span>({product.reviewsCount || 1420})</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#1A1A1A]">
                    {product.name}
                  </h2>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-normal text-[#1A1A1A]">
                      EGP {product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#736B63]">
                      / {product.weight || '250g Pouch'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#736B63] font-light leading-relaxed">
                    {product.description || product.tagline}
                  </p>

                  {/* Fruit Notes */}
                  {product.fruitNotes && product.fruitNotes.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-semibold text-[#736B63] uppercase tracking-wider block mb-2">
                        {isRtl ? 'المكونات والنكهات البارزة' : 'TASTING NOTES'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.fruitNotes.map((note, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-[#F4EFEA] border border-[#E8E2D7] text-[#1A1A1A]"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions & Quantity */}
                <div className="space-y-3 pt-4 border-t border-[#E8E2D7]">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#736B63] font-medium">
                      {isRtl ? 'الكمية' : 'Quantity'}
                    </span>
                    <div className="flex items-center gap-3 bg-white border border-[#E8E2D7] rounded-full px-3 py-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="text-[#736B63] hover:text-[#1A1A1A] disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-semibold w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(5, quantity + 1))}
                        disabled={quantity >= 5}
                        className="text-[#736B63] hover:text-[#1A1A1A] disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className="flex-1 btn-primary py-2.5 text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      {justAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'تمت الإضافة' : 'Added to bag'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'أضف للحقيبة' : 'Add to bag'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={isOutOfStock}
                      className="flex-1 btn-secondary py-2.5 text-xs font-medium"
                    >
                      {isRtl ? 'شراء فوري' : 'Buy now'}
                    </button>
                  </div>

                  {/* Guarantees */}
                  <div className="flex items-center justify-between text-[11px] text-[#736B63] pt-2">
                    <div className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#3C1322]" />
                      <span>{isRtl ? 'توصيل سريع' : 'Fast Cairo courier'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-[#88C057]" />
                      <span>{isRtl ? 'مكونات نقية' : '100% Real fruit'}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
