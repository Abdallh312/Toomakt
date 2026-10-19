import React, { useState } from 'react';
import { ShoppingBag, Star, Eye, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  showDescription?: boolean;
  isFeaturedSpan?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  showDescription = false,
  isFeaturedSpan = false,
  className = '',
}) => {
  const { addToCart } = useCart();
  const { isRtl, formatPrice } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const tastingNotes = isRtl
    ? (product.tasting_notes_ar || product.fruitNotes || [])
    : (product.tasting_notes_en || product.tasting_notes || product.fruitNotes || []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Find rich supplementary assets: 3D piece and lifestyle jar (never use spec cards)
  const pieceImage = (product.images || []).find((img) =>
    !img.includes('spec') && /piece|3d|strawberry_3d|lemon_3d|apple_3d|fruity_strawberry/i.test(img)
  );

  const jarImage = (product.images || []).find((img) =>
    !img.includes('spec') && /jar|shoot/i.test(img)
  );

  const secondaryImage =
    jarImage ||
    (product.images || []).find(
      (img) => img && img !== product.image && !/piece|3d|spec|card/i.test(img)
    ) ||
    (product.altImage && !product.altImage.includes('spec') ? product.altImage : undefined);

  // Curate image slideshow list (only clean packaging/jar/piece images)
  const imageGallery = [
    product.image,
    secondaryImage,
    pieceImage,
  ].filter(Boolean) as string[];

  // Deduplicate gallery
  const uniqueGallery = Array.from(new Set(imageGallery));
  const currentImage = uniqueGallery[activeImageIndex] || product.image;
  const currentWebp = currentImage.replace(/\.(jpe?g|png)$/i, '.webp');

  const weightLabel = isRtl
    ? (product.pack_quantity_ar || `${product.weight || '250g'}`)
    : (product.pack_quantity_en || `${product.weight || '250g'}`);

  // Calculate unit economics per piece if piece count is available
  const piecesCount = product.pieces_per_pack || product.pack_quantity_pieces;
  const unitPrice = piecesCount && piecesCount > 0 ? (product.price / piecesCount).toFixed(2) : null;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      data-cursor="view"
      data-cursor-label={isRtl ? 'عرض وتذوق' : 'VIEW'}
      className={`group cursor-pointer select-none flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl bg-white border border-[#22120C]/[0.08] p-3.5 sm:p-4.5 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(232,144,168,0.18)] hover:-translate-y-1.5 hover:border-[#E890A8]/60 relative ${
        isFeaturedSpan ? 'md:col-span-2' : ''
      } ${className}`}
    >
      {/* ─── TOP SECTION: IMAGE + LABELS + TITLE ─── */}
      <div className="flex flex-col space-y-3.5">
        {/* ─── IMAGE STAGE: Clean, Neutral, Harmonious Pedestal on Light Background ─── */}
        <div className="relative aspect-[4/3.8] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#22120C]/[0.04] p-5 sm:p-7 flex items-center justify-center transition-colors group-hover:bg-[#FFF9FB]">
          {/* Subtle Natural Ground Shadow */}
          <div className="absolute inset-x-12 bottom-4 h-6 bg-radial from-[#22120C]/[0.08] to-transparent rounded-full blur-md pointer-events-none transition-transform duration-500 group-hover:scale-110" />

          {/* Product Packaging Hero Image */}
          <picture className="w-full h-full flex items-center justify-center relative z-10 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1">
            {currentWebp && <source srcSet={currentWebp} type="image/webp" />}
            <img
              src={currentImage}
              alt={displayName}
              width="440"
              height="500"
              decoding="async"
              loading="lazy"
              className="w-[85%] h-[85%] object-contain filter drop-shadow-[0_10px_22px_rgba(34,18,12,0.10)] transition-all duration-300"
            />
          </picture>

          {/* Floating 3D Confection Inset (Bottom-Left in LTR / Bottom-Right in RTL) */}
          {pieceImage && (
            <div
              className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-[#E890A8]/45 px-2 py-1 rounded-full shadow-xs group-hover:scale-105 transition-all duration-300 pointer-events-none"
              title={isRtl ? 'حشوة سائلة طبيعية' : 'Natural liquid center piece'}
            >
              <div className="w-6 h-6 rounded-full bg-[#FAF5EE] p-0.5 border border-[#E890A8]/30 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={pieceImage}
                  alt=""
                  aria-hidden="true"
                  width="30"
                  height="30"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>
              <span className="text-[10px] font-sans font-medium text-[#22120C] hidden sm:inline whitespace-nowrap">
                {isRtl ? 'حشوة سائلة' : 'Liquid core'}
              </span>
            </div>
          )}

          {/* Gallery Indicator Dots */}
          {uniqueGallery.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center items-center gap-1.5 pointer-events-auto">
              <div className="bg-[#22120C]/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1.5">
                {uniqueGallery.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeImageIndex === idx
                        ? 'w-3.5 bg-white'
                        : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Top-Left: Terracotta & Rose Brand Badge */}
          {displayBadge && (
            <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-20">
              <div className="inline-flex items-center gap-1 bg-[#FAF5EE] text-[#963725] border border-[#E890A8]/50 text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full shadow-xs">
                <Sparkles className="w-3 h-3 text-[#E890A8]" />
                <span>{displayBadge}</span>
              </div>
            </div>
          )}

          {/* Top-Right: Action Buttons (Wishlist + Quick View) */}
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-20 flex items-center gap-1.5">
            {/* Quick View Eye Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              className="w-8 h-8 rounded-full bg-white text-[#22120C] border border-[#22120C]/10 flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-all hover:bg-[#6AACE9] hover:border-[#6AACE9] hover:text-white cursor-pointer"
              aria-label={isRtl ? 'نظرة سريعة' : 'Quick view'}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleWishlist}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                isWishlisted
                  ? 'bg-[#E890A8] text-white border border-[#E890A8]'
                  : 'bg-white text-[#22120C] border border-[#22120C]/10 hover:border-[#E890A8] hover:text-[#963725]'
              }`}
              aria-label={isRtl ? 'إضافة للمفضلة' : 'Add to wishlist'}
            >
              <Star className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center z-20">
              <span className="text-xs font-sans font-semibold text-[#22120C] bg-white px-3 py-1.5 rounded-full border border-[#22120C]/15 shadow-xs">
                {isRtl ? 'نفدت الكمية' : 'Out of Stock'}
              </span>
            </div>
          )}
        </div>

        {/* ─── PRODUCT METADATA ─── */}
        <div className="text-left rtl:text-right space-y-2">
          {/* Rating & Stock Indicator */}
          <div className="flex items-center justify-between text-[11px] font-sans text-[#736B63]">
            <div className="flex items-center gap-1 text-[#E4B072]">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-bold text-[#22120C]">
                {product.rating || '4.95'}
              </span>
              <span className="text-[#736B63]">
                ({product.reviewsCount || 120})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[#2E5C38] font-medium text-[10px]">
                {isRtl ? 'متوفر بالمصنع' : 'In stock'}
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-lg font-normal text-[#22120C] group-hover:text-[#963725] transition-colors leading-snug line-clamp-1">
            {displayName}
          </h3>

          {/* Tasting Notes Pills: Alternating Dual Secondary Colors (#E890A8 & #6AACE9) */}
          {tastingNotes.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {tastingNotes.slice(0, 2).map((note, idx) => {
                const isBlue = idx % 2 !== 0;
                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 text-[10px] font-sans text-[#736B63] bg-[#FAF5EE] border px-2 py-0.5 rounded-full ${
                      isBlue ? 'border-[#6AACE9]/35' : 'border-[#E890A8]/35'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isBlue ? '#6AACE9' : '#E890A8' }}
                    />
                    <span>{note}</span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Optional Tagline */}
          {(showDescription || displayTagline) && (
            <p className="text-xs font-sans text-[#736B63] font-light line-clamp-2 leading-relaxed pt-1">
              {displayTagline}
            </p>
          )}
        </div>
      </div>

      {/* ─── BOTTOM SECTION: PRICE + PACK SIZE + ACTION BUTTON ─── */}
      <div className="pt-3.5 mt-3 border-t border-[#22120C]/06 space-y-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#22120C]">
              {formatPrice(product.price)}
            </span>
            {unitPrice && (
              <span className="text-[11px] font-mono text-[#736B63]">
                ({unitPrice} {isRtl ? 'ج.م/قطعة' : 'EGP/pc'})
              </span>
            )}
          </div>

          {/* Weight / Pack Size */}
          <span className="text-[11px] font-mono text-[#736B63] bg-[#FAF5EE] border border-[#22120C]/08 px-2 py-0.5 rounded-md shrink-0">
            {weightLabel}
          </span>
        </div>

        {/* Primary Terracotta CTA Button */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-sans font-medium tracking-wide shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              justAdded
                ? 'bg-[#2E5C38] text-white shadow-sm'
                : 'bg-[#963725] hover:bg-[#822E1E] text-white active:scale-[0.98]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span className="font-semibold">{isRtl ? 'أُضيفت للحقيبة' : 'Added to bag'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-white/90" />
                <span>{isRtl ? 'أضف للحقيبة' : 'Add to bag'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;


