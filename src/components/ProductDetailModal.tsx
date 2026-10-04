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
  Truck,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Package,
  Scale,
  Sparkles
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
  const [customerQuantity, setCustomerQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const flavorsList: string[] = product?.available_flavors && product.available_flavors.length > 0
    ? product.available_flavors
    : (product?.fruitNotes && product.fruitNotes.length > 0 ? [product.name, ...product.fruitNotes.slice(0, 2)] : [product?.name || 'Original']);

  const [selectedFlavor, setSelectedFlavor] = useState<string>(() => flavorsList[0] || 'Original');

  useEffect(() => {
    setCustomerQuantity(1);
    setSelectedImageIndex(0);
    setJustAdded(false);
    if (product) {
      const flvs = product.available_flavors && product.available_flavors.length > 0
        ? product.available_flavors
        : (product.fruitNotes && product.fruitNotes.length > 0 ? [product.name, ...product.fruitNotes.slice(0, 2)] : [product.name]);
      setSelectedFlavor(flvs[0] || product.name);
    }
  }, [product?.id]);

  if (!product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || '/images/products/mango_sunbeam.jpg'];

  const activeImage = images[selectedImageIndex] || images[0];

  const stock = product.stock_quantity ?? (product.in_stock ? 50 : 0);
  const isOutOfStock = stock <= 0 || product.in_stock === false || product.status === 'out_of_stock';

  const boxQuantity = product.box_quantity ?? 10;
  const boxQuantityLabel = product.box_quantity_label || `${boxQuantity} Boxes / Carton`;
  const packQuantity = product.pack_quantity || `${product.weight || '250g'} Pouch`;
  const weightStr = product.weight || '250g';
  const sku = product.sku || `TMK-${(product.slug || product.name || 'CONFECTION').slice(0, 8).toUpperCase()}`;

  const tastingNotes = Array.isArray(product.tasting_notes) && product.tasting_notes.length > 0
    ? product.tasting_notes
    : (Array.isArray(product.fruitNotes) && product.fruitNotes.length > 0 ? product.fruitNotes : ['Wild Orchard Fruits', 'European Sweet Butter']);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, customerQuantity, selectedFlavor);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 1200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, customerQuantity, selectedFlavor);
    onClose();
    if (onNavigateView) {
      onNavigateView('checkout');
    } else {
      navigateTo('checkout');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#FAF7F2] dark:bg-[#0C080A] rounded-2xl border border-[#E8E2D7] dark:border-[#2A1622] shadow-2xl overflow-hidden my-4 z-10 max-h-[92vh] flex flex-col"
        >
          {/* Header Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2 rounded-full text-[#736B63] dark:text-[#B0A396] hover:text-[#1A1A1A] dark:hover:text-[#FAF5EE] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* ======================================================== */}
            {/* LEFT: MULTI-IMAGE GALLERY WITH THUMBNAILS & TRANSITION  */}
            {/* ======================================================== */}
            <div className="md:col-span-6 bg-white dark:bg-[#140C12] p-5 sm:p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E2D7] dark:border-[#2A1622]">
              <div className="space-y-4">
                {/* Main Showcase Image */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#0C080A] border border-[#E8E2D7]/80 dark:border-[#2A1622] group shadow-xs flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={product.name}
                      initial={{ opacity: 0.2, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.2 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full object-contain p-3"
                    />
                  </AnimatePresence>

                  {/* Ribbon Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                      <span className="bg-[#FAF7F2]/95 dark:bg-[#140C12]/95 backdrop-blur-sm text-[#1A1A1A] dark:text-[#FAF5EE] border border-[#E8E2D7] dark:border-[#381B2D] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Prev / Next Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 dark:bg-black/60 text-[#1A1A1A] dark:text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 dark:bg-black/60 text-[#1A1A1A] dark:text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                        title="Next Image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                    {images.map((img, idx) => {
                      const isSelected = idx === selectedImageIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border cursor-pointer transition-all bg-white dark:bg-[#0C080A] ${
                            isSelected
                              ? 'border-[#8B2D5C] ring-2 ring-[#8B2D5C]/30 scale-102'
                              : 'border-[#E8E2D7] dark:border-[#2A1622] hover:border-[#736B63] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quality Badges */}
              <div className="flex items-center justify-between text-[11px] text-[#736B63] dark:text-[#B0A396] pt-4 mt-4 border-t border-[#E8E2D7]/60 dark:border-[#2A1622]">
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#3C1322] dark:text-[#E8BDD4]" />
                  <span>{isRtl ? 'شحن سريع للقاهرة والمحافظات' : 'Fast Courier Delivery'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-[#88C057]" />
                  <span>{isRtl ? 'بيوريه فاكهة طبيعي 100%' : '100% Real Fruit Purée'}</span>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* RIGHT: STRUCTURED PRODUCT INFORMATION & ORDER CONTROLS   */}
            {/* ======================================================== */}
            <div className="md:col-span-6 p-5 sm:p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Category, Rating & SKU */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase tracking-wider text-[#3C1322] dark:text-[#E8BDD4]">
                      {product.category || 'Atelier Collection'}
                    </span>
                    <span className="text-[10px] text-[#A89F91]">•</span>
                    <span className="font-mono text-[10px] text-[#736B63] dark:text-[#B0A396]">
                      {sku}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#736B63] dark:text-[#B0A396]">
                    <Star className="w-3.5 h-3.5 text-[#FFD147] fill-current" />
                    <span className="font-medium text-[#1A1A1A] dark:text-[#FAF5EE]">{product.rating || 4.98}</span>
                    <span>({product.reviewsCount || 1420})</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#1A1A1A] dark:text-[#FAF5EE]">
                  {product.name}
                </h2>

                {/* Price & Unit */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] dark:text-[#FAF5EE]">
                    EGP {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#736B63] dark:text-[#B0A396]">
                    / {packQuantity}
                  </span>
                </div>

                {/* ======================================================== */}
                {/* QUANTITY SYSTEM: BOX QTY vs PACK QTY vs ORDER QTY       */}
                {/* ======================================================== */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3C1322] dark:text-[#E8BDD4]">
                    <Boxes className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'المواصفات وهيكل التعبئة والتغليف' : 'Packaging & Quantity Specifications'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-[#FAF5EE] dark:bg-[#1A0E18] border border-[#E8E2D7]/60 dark:border-[#2E1826]">
                      <span className="text-[10px] text-[#736B63] dark:text-[#B0A396] block uppercase tracking-wider">
                        {isRtl ? 'الكرتونة (Box Qty)' : 'Box Quantity'}
                      </span>
                      <span className="font-semibold text-[#1A1A1A] dark:text-[#FAF5EE]">
                        {boxQuantityLabel}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-[#FAF5EE] dark:bg-[#1A0E18] border border-[#E8E2D7]/60 dark:border-[#2E1826]">
                      <span className="text-[10px] text-[#736B63] dark:text-[#B0A396] block uppercase tracking-wider">
                        {isRtl ? 'محتوى العبوة (Pack Qty)' : 'Pack Content / Weight'}
                      </span>
                      <span className="font-semibold text-[#1A1A1A] dark:text-[#FAF5EE]">
                        {packQuantity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#736B63] dark:text-[#B0A396] font-light leading-relaxed">
                  {product.description || product.tagline}
                </p>

                {/* Flavor / Variant Selector */}
                {flavorsList.length > 0 && (
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-semibold text-[#736B63] dark:text-[#B0A396] uppercase tracking-wider">
                        {isRtl ? 'اختر النكهة' : 'FLAVOR / VARIANT'}
                      </span>
                      <span className="text-[11px] font-medium text-[#3C1322] dark:text-[#E8BDD4] bg-[#FFD147]/30 dark:bg-[#FFD147]/20 px-2 py-0.5 rounded-full">
                        {selectedFlavor}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {flavorsList.map((flv) => {
                        const isSelected = selectedFlavor === flv;
                        return (
                          <button
                            key={flv}
                            type="button"
                            onClick={() => setSelectedFlavor(flv)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-[#3C1322] text-[#FAF7F2] dark:bg-[#FAF5EE] dark:text-[#1A1A1A] shadow-soft scale-[1.02]'
                                : 'bg-[#FAF5EE] dark:bg-[#1A0E18] text-[#1A1A1A] dark:text-[#FAF5EE] border border-[#E8E2D7] dark:border-[#2A1622] hover:border-[#1A1A1A]'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FFD147]" />}
                            <span>{flv}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tasting Notes */}
                {tastingNotes.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-semibold text-[#736B63] dark:text-[#B0A396] uppercase tracking-wider block mb-1.5">
                      {isRtl ? 'ملاحظات التذوق' : 'TASTING NOTES'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tastingNotes.map((note, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-[#FAF5EE] dark:bg-[#1A0E18] border border-[#E8E2D7] dark:border-[#2A1622] text-[#1A1A1A] dark:text-[#FAF5EE]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Actions & Customer Quantity */}
              <div className="space-y-3 pt-4 border-t border-[#E8E2D7] dark:border-[#2A1622]">
                {/* Customer Quantity Stepper */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#1A1A1A] dark:text-[#FAF5EE] font-medium block">
                      {isRtl ? 'الكمية المطلوبة' : 'Customer Order Quantity'}
                    </span>
                    <span className="text-[10px] text-[#736B63] dark:text-[#B0A396]">
                      {isRtl ? `طلب ${customerQuantity} عبوة (${packQuantity})` : `Order ${customerQuantity} units (${packQuantity})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] rounded-full px-3 py-1">
                    <button
                      onClick={() => setCustomerQuantity(Math.max(1, customerQuantity - 1))}
                      disabled={customerQuantity <= 1}
                      className="text-[#736B63] hover:text-[#1A1A1A] dark:hover:text-[#FAF5EE] disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-semibold w-4 text-center text-[#1A1A1A] dark:text-[#FAF5EE]">
                      {customerQuantity}
                    </span>
                    <button
                      onClick={() => setCustomerQuantity(Math.min(10, customerQuantity + 1))}
                      disabled={customerQuantity >= 10}
                      className="text-[#736B63] hover:text-[#1A1A1A] dark:hover:text-[#FAF5EE] disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 btn-primary py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'تمت الإضافة للحقيبة' : 'Added to bag'}</span>
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
                    className="flex-1 btn-secondary py-2.5 text-xs font-medium cursor-pointer disabled:opacity-50"
                  >
                    {isRtl ? 'شراء فوري' : 'Buy now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
