import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Plus,
  Minus,
  Package,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Truck,
  Check,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

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
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { t, isRtl, formatPrice } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    setQuantity(1);
    setJustAdded(false);
    if (product) {
      api.getProducts().then(all => {
        const others = all.filter(p => String(p.id) !== String(product.id)).slice(0, 3);
        setRelatedProducts(others);
      }).catch(() => {});
    }
  }, [product?.id]);

  if (!product) return null;

  const piecesPerPack = product.pieces_per_pack || 20;
  const stock = product.stock_quantity ?? (product.in_stock ? 50 : 0);
  const lowThreshold = product.low_stock_threshold ?? 15;
  const isOutOfStock = stock <= 0 || product.in_stock === false;
  const isLowStock = stock > 0 && stock <= lowThreshold;
  const maxAllowedQty = Math.min(5, Math.max(1, stock));

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
      window.location.hash = '#checkout';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#FFFDF5] rounded-3xl border-3 border-[#1F1127] shadow-neo-xl overflow-hidden my-6 z-10"
        >
          {/* Header Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#FFE842] border-2 border-[#1F1127] text-[#1F1127] hover:bg-[#FF5E2B] hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-neo-sm"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* LEFT: Product Visual Gallery */}
            <div className="md:col-span-6 bg-stone-50 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
              <div className="relative aspect-square rounded-2xl bg-white border border-stone-200/80 overflow-hidden p-6 flex items-center justify-center shadow-xs">
                <img
                  src={product.image || '/images/canister.jpg'}
                  alt={product.name}
                  className="w-full h-full object-contain hover:scale-104 transition-transform duration-500"
                />

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {isOutOfStock ? (
                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-stone-900 text-white">
                      Out of stock
                    </span>
                  ) : isLowStock ? (
                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      Only {stock} packs remaining
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Confection Guarantee Strip */}
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-stone-600">
                <div className="p-3 bg-white rounded-xl border border-stone-200/80 flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#C26715] shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900 block">{piecesPerPack} Pieces</span>
                    <span className="text-[11px] text-stone-500">{product.weight || '250g Pouch'}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200/80 flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#C26715] shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900 block">Fast Courier</span>
                    <span className="text-[11px] text-stone-500">All 27 Governorates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Product Specs & Actions */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold uppercase tracking-wider text-[#C26715]">
                    {product.category_name || 'Confectionery'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-stone-800">{product.rating || 4.98}</span>
                    <span className="text-stone-400">({product.reviewsCount || 1420})</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-snug">
                  {product.name}
                </h2>

                {/* Price Display */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono text-stone-900">
                    {formatPrice(Number(product.price))}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    {isRtl ? 'للعبوة الواحدة' : 'per luxury pack'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-600 leading-relaxed font-normal">
                  {product.description || product.tagline || 'Artisanal soft toffee slowly kettle-boiled with grass-fed European butter and whole fruit extracts.'}
                </p>

                {/* Specifications Grid */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-500">{isRtl ? 'نوع التغليف' : 'Packaging'}</span>
                    <span className="font-semibold text-stone-900">{product.weight || (isRtl ? 'عبوة فاخرة 250 جم' : '250g Luxury Pouch')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-500">{isRtl ? 'عدد القطع' : 'Piece Count'}</span>
                    <span className="font-semibold text-stone-900">{piecesPerPack} {isRtl ? 'قطعة مغلفة' : 'Individually Wrapped'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-500">{isRtl ? 'المخزون المتوفر' : 'Available Stock'}</span>
                    <span className="font-semibold text-stone-900">{isOutOfStock ? (isRtl ? 'غير متوفر' : '0 units') : `${stock} ${isRtl ? 'عبوة جاهزة' : 'packs available'}`}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{isRtl ? 'ضمان التوصيل' : 'Delivery Guarantee'}</span>
                    <span className="font-semibold text-emerald-700">{isRtl ? 'شحن مبرد لجميع المحافظات' : 'Insulated Cold Shipping (Egypt)'}</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-stone-700">
                      {isRtl ? 'الكمية:' : 'Quantity:'}
                    </span>
                    <div className="inline-flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold font-mono text-stone-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.min(maxAllowedQty, q + 1))}
                        disabled={quantity >= maxAllowedQty}
                        className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Row */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                {isOutOfStock ? (
                  <div className="p-3 bg-stone-100 border border-stone-200 text-stone-500 rounded-xl text-center text-xs font-semibold">
                    {isRtl ? 'المنتج غير متوفر حالياً. يتم طهي دفعة جديدة في المراجل النحاسية.' : 'Currently out of stock. New copper kettle batch being prepared.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`btn-neo py-3.5 px-4 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                        justAdded
                          ? 'bg-[#C4E86E] text-[#1F1127]'
                          : 'bg-[#FFFDF5] text-[#1F1127] hover:bg-[#FFE842]'
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <Check className="w-4 h-4 text-[#1F1127]" />
                          <span>{t('btn_added')}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>{t('btn_add_to_cart')}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="btn-neo bg-[#FF5E2B] text-white py-3.5 px-4 text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-[#ff480e] shadow-neo flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-current text-white" />
                      <span>{t('btn_buy_now')} • {formatPrice(product.price * quantity)}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products Footer */}
          {relatedProducts.length > 0 && (
            <div className="p-6 bg-stone-50 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                You May Also Enjoy
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {relatedProducts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct && onSelectProduct(rel)}
                    className="bg-white p-3 rounded-xl border border-stone-200 hover:border-[#C26715] transition-all cursor-pointer group flex items-center gap-3"
                  >
                    <img
                      src={rel.image || '/images/canister.jpg'}
                      alt={rel.name}
                      className="w-10 h-10 object-contain rounded-md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-stone-900 truncate group-hover:text-[#C26715] transition-colors">
                        {rel.name}
                      </div>
                      <div className="text-[11px] font-mono text-stone-500">
                        {Number(rel.price).toFixed(2)} EGP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
