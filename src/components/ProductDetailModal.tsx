import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ChevronLeft,
  ChevronRight,
  Boxes,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/navigation';
import {
  getProductDisplayName,
  getFlavorDisplayName,
} from '../utils/productLocalization';

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
  const { isRtl, formatPrice } = useLanguage();
  const [customerQuantity, setCustomerQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  // Cache last non-null product so exit animation retains content smoothly
  const lastProductRef = useRef<Product | null>(null);
  if (product) {
    lastProductRef.current = product;
  }
  const currentProduct = product || lastProductRef.current;

  const flavorsList: string[] = currentProduct?.available_flavors && currentProduct.available_flavors.length > 0
    ? currentProduct.available_flavors
    : (currentProduct?.fruitNotes && currentProduct.fruitNotes.length > 0 ? [currentProduct.name, ...currentProduct.fruitNotes.slice(0, 2)] : [currentProduct?.name || 'Original']);

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

  useEffect(() => {
    if (product) {
      window.dispatchEvent(new CustomEvent('toomakt:modal-open'));
      document.body.style.overflow = 'hidden';
    } else {
      window.dispatchEvent(new CustomEvent('toomakt:modal-close'));
      document.body.style.overflow = '';
    }
    return () => {
      window.dispatchEvent(new CustomEvent('toomakt:modal-close'));
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const displayName = getProductDisplayName(product, isRtl);

  const displayTagline = isRtl
    ? (product.tagline_ar || product.tagline)
    : (product.tagline_en || product.tagline);

  const displayDescription = isRtl
    ? (product.description_ar || product.description || displayTagline)
    : (product.description_en || product.description || displayTagline);

  const displayBadge = isRtl
    ? (product.badge_ar || product.badge)
    : (product.badge_en || product.badge);

  const baseImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || '/images/products/cappuccino_candies_thumb_isolated.png'];

  const flavorImageUrls = product.flavor_images ? Object.values(product.flavor_images) : [];
  const images = Array.from(new Set([...baseImages, ...flavorImageUrls]));
  const activeImage = images[selectedImageIndex] || images[0];

  const stock = product.stock_quantity ?? (product.in_stock ? 50 : 0);
  const isOutOfStock = stock <= 0 || product.in_stock === false || product.status === 'out_of_stock';

  const boxQuantity = product.box_quantity ?? 12;
  const displayBoxQuantityLabel = isRtl
    ? (product.box_quantity_label_ar || product.box_quantity_label || `${boxQuantity} كيس / كرتونة`)
    : (product.box_quantity_label_en || product.box_quantity_label || `${boxQuantity} Bags / Carton`);

  const displayPackQuantity = isRtl
    ? (product.pack_quantity_ar || product.pack_quantity || `${product.weight || '250g'} كيس`)
    : (product.pack_quantity_en || product.pack_quantity || `${product.weight || '250g'} Bag`);

  const sku = product.sku || `TMK-${(product.slug || product.name || 'CONFECTION').slice(0, 8).toUpperCase()}`;

  const defaultTastingNotes = Array.isArray(product.tasting_notes) && product.tasting_notes.length > 0
    ? product.tasting_notes
    : (Array.isArray(product.fruitNotes) && product.fruitNotes.length > 0 ? product.fruitNotes : ['Natural Ingredients', 'Pure Sweet Butter']);

  const displayTastingNotes = isRtl
    ? (Array.isArray(product.tasting_notes_ar) && product.tasting_notes_ar.length > 0 ? product.tasting_notes_ar : defaultTastingNotes)
    : (Array.isArray(product.tasting_notes_en) && product.tasting_notes_en.length > 0 ? product.tasting_notes_en : defaultTastingNotes);

  const handleSelectFlavor = (flv: string) => {
    setSelectedFlavor(flv);
    if (product.flavor_images && product.flavor_images[flv]) {
      const targetImg = product.flavor_images[flv];
      const imgIdx = images.indexOf(targetImg);
      if (imgIdx !== -1) {
        setSelectedImageIndex(imgIdx);
        return;
      }
    }
    const flvIdx = flavorsList.indexOf(flv);
    if (flvIdx !== -1 && images[flvIdx]) {
      setSelectedImageIndex(flvIdx);
    }
  };

  const handleSelectThumbnail = (idx: number) => {
    setSelectedImageIndex(idx);
    const clickedImg = images[idx];
    if (product.flavor_images) {
      const matchingFlavor = Object.keys(product.flavor_images).find(
        (f) => product.flavor_images![f] === clickedImg
      );
      if (matchingFlavor) {
        setSelectedFlavor(matchingFlavor);
        return;
      }
    }
    if (flavorsList[idx]) {
      setSelectedFlavor(flavorsList[idx]);
    }
  };

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
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-3 sm:p-6" data-lenis-prevent>
      {/* Soft Warm Dim Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#22120C]/65 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container: Solid White Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl bg-white text-[#22120C] rounded-[32px] border border-[#22120C]/12 shadow-[0_30px_90px_rgba(34,18,12,0.18)] overflow-hidden my-4 z-10 max-h-[92vh] flex flex-col"
        >
          {/* Header Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2.5 rounded-full text-[#22120C]/60 hover:text-[#22120C] hover:bg-[#22120C]/8 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* LEFT: GALLERY WITH CLEAN ISOLATED IMAGE */}
            <div className="md:col-span-6 bg-[#FDF2F5] p-6 sm:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#22120C]/10">
              <div className="space-y-4">
                {/* Main Showcase Image Stage */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-transparent group flex items-center justify-center p-4 sm:p-7">
                  {/* Subtle ambient spotlight behind the product */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,144,168,0.15),transparent_70%)] pointer-events-none" />

                  {/* Soft ground contact shadow */}
                  <div className="absolute inset-x-12 bottom-4 h-6 bg-radial from-[#22120C]/[0.12] to-transparent rounded-full blur-md pointer-events-none" />

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={displayName}
                      initial={{ opacity: 0.2, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.2 }}
                      transition={{ duration: 0.22 }}
                      className="w-full h-full object-contain mix-blend-multiply relative z-10"
                    />
                  </AnimatePresence>

                  {/* Ribbon Badge */}
                  {displayBadge && (
                    <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 z-20">
                      <span className="bg-white/95 backdrop-blur-sm text-[#E890A8] border border-[#E890A8]/30 text-[10px] font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                        {displayBadge}
                      </span>
                    </div>
                  )}

                  {/* Prev / Next Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-[#22120C] border border-[#22120C]/10 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:border-[#E890A8] cursor-pointer z-20"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-[#22120C] border border-[#22120C]/10 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:border-[#E890A8] cursor-pointer z-20"
                        title="Next Image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                    {images.map((img, idx) => {
                      const isSelected = idx === selectedImageIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectThumbnail(idx)}
                          className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border cursor-pointer transition-all p-1.5 bg-white ${
                            isSelected
                              ? 'border-[#E890A8] ring-2 ring-[#E890A8]/30 scale-105'
                              : 'border-[#22120C]/10 opacity-70 hover:opacity-100 hover:border-[#E890A8]/40'
                          }`}
                        >
                          <img src={img} alt={`${displayName} view ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: DETAILS WITH SOLID WHITE CARD */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-4">
                {/* Category & SKU */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#E890A8] font-semibold">
                      {typeof product.category === 'object' && product.category !== null
                        ? ((product.category as any).name || (product.category as any).slug)
                        : (product.category_name || product.category || 'Atelier Collection')}
                    </span>
                    <span className="text-[10px] text-[#22120C]/30">•</span>
                    <span className="font-mono text-[10px] text-[#22120C]/50">
                      {sku}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-[#22120C] leading-tight">
                  {displayName}
                </h2>

                {/* Price & Unit */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl sm:text-3xl font-serif text-[#E890A8] font-semibold">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-[#22120C]/60 font-mono">
                    / {displayPackQuantity}
                  </span>
                </div>

                {/* Packaging specs */}
                <div className="p-4 rounded-2xl bg-[#FDF2F5] border border-[#E890A8]/20 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#E890A8] font-semibold">
                    <Boxes className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'مواصفات التعبئة والتغليف' : 'Packaging Specifications'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-[#22120C]/8">
                      <span className="text-[10px] font-mono text-[#22120C]/50 block uppercase tracking-wider mb-0.5">
                        {isRtl ? 'الكرتونة' : 'Box Quantity'}
                      </span>
                      <span className="font-serif font-normal text-[#22120C] text-sm">
                        {displayBoxQuantityLabel}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#22120C]/8">
                      <span className="text-[10px] font-mono text-[#22120C]/50 block uppercase tracking-wider mb-0.5">
                        {isRtl ? 'محتوى العبوة' : 'Pack Content'}
                      </span>
                      <span className="font-serif font-normal text-[#22120C] text-sm">
                        {displayPackQuantity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#22120C]/75 font-light leading-relaxed">
                  {displayDescription}
                </p>

                {/* Flavor / Variant Selector */}
                {flavorsList.length > 0 && (
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-[#22120C]/60 uppercase tracking-wider">
                        {isRtl ? 'النكهة' : 'Flavor'}
                      </span>
                      <span className="text-[11px] font-mono text-[#E890A8] bg-[#E890A8]/10 border border-[#E890A8]/25 px-2.5 py-0.5 rounded-full font-semibold">
                        {getFlavorDisplayName(selectedFlavor, isRtl)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {flavorsList.map((flv) => {
                        const isSelected = selectedFlavor === flv;
                        return (
                          <button
                            key={flv}
                            type="button"
                            onClick={() => handleSelectFlavor(flv)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-[#E890A8] text-white shadow-sm font-semibold'
                                : 'bg-white text-[#22120C] border border-[#22120C]/10 hover:border-[#E890A8]/40'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            <span>{getFlavorDisplayName(flv, isRtl)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tasting Notes */}
                {displayTastingNotes.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-mono text-[#22120C]/60 uppercase tracking-wider block mb-1.5">
                      {isRtl ? 'ملاحظات النكهة والمذاق' : 'Tasting Notes'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {displayTastingNotes.map((note, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-3 py-1 rounded-full bg-[#FDF2F5] border border-[#E890A8]/20 text-[#22120C]/75 font-mono"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Actions & Customer Quantity */}
              <div className="space-y-3 pt-4 border-t border-[#22120C]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#22120C] font-semibold block">
                      {isRtl ? 'الكمية' : 'Quantity'}
                    </span>
                    <span className="text-[10px] text-[#22120C]/50 font-mono">
                      {customerQuantity} × {displayPackQuantity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white border border-[#22120C]/10 rounded-full px-3 py-1">
                    <button
                      onClick={() => setCustomerQuantity(Math.max(1, customerQuantity - 1))}
                      disabled={customerQuantity <= 1}
                      className="text-[#22120C]/60 hover:text-[#22120C] disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-semibold w-4 text-center text-[#22120C]">
                      {customerQuantity}
                    </span>
                    <button
                      onClick={() => setCustomerQuantity(Math.min(10, customerQuantity + 1))}
                      disabled={customerQuantity >= 10}
                      className="text-[#22120C]/60 hover:text-[#22120C] disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 py-3 text-xs font-mono font-bold tracking-wider uppercase rounded-full bg-[#E890A8] hover:bg-[#6AACE9] text-white flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(232,144,168,0.3)] hover:shadow-[0_6px_20px_rgba(106,172,233,0.35)] disabled:opacity-50 transition-all"
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>{isRtl ? 'تمت الإضافة للحقيبة' : 'Added to Bag'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'أضف للحقيبة' : 'Add to Bag'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex-1 py-3 text-xs font-mono font-semibold tracking-wider uppercase rounded-full border border-[#6AACE9] text-[#6AACE9] hover:bg-[#6AACE9] hover:text-white cursor-pointer disabled:opacity-50 transition-all"
                  >
                    {isRtl ? 'شراء فوري' : 'Buy Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
  );
};

export default ProductDetailModal;
