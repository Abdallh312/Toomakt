import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, BundleItem } from '../types';
import { navigateTo } from '../utils/navigation';
import { findCatalogProduct } from '../utils/productLocalization';
import { api } from '../services/api';

export interface ToastData {
  id?: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity?: number, selectedFlavor?: string) => boolean;
  removeFromCart: (id: string, selectedFlavor?: string) => void;
  updateQuantity: (id: string, delta: number, selectedFlavor?: string) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
  defaultShippingFee: number;
  promoApplied: boolean;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  discountAmount: number;
  cartLimitNotice: string | null;
  clearNotice: () => void;
  toastNotification: ToastData | null;
  showToast: (type: 'success' | 'warning' | 'info', title: string, message: string, actionLabel?: string, onAction?: () => void, duration?: number) => void;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(500.00); // Real Egyptian threshold (500 EGP)
  const defaultShippingFee = 45.00; // Real Egyptian Cairo/Giza standard delivery fee

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('toomakt_cart_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if it's the old auto-seeded default starter pack
          const isLegacyStarter =
            parsed.length === 1 &&
            parsed[0]?.product?.id === 'mango-sunbeam' &&
            !localStorage.getItem('toomakt_cart_user_added');

          if (!isLegacyStarter) {
            // Enforce 1-5 limit on loaded items and rehydrate missing localized names
            return parsed.map((item: CartItem) => {
              const master = findCatalogProduct(item.product);
              return {
                ...item,
                quantity: Math.min(5, Math.max(1, item.quantity || 1)),
                product: {
                  ...item.product,
                  name_en: item.product.name_en || master?.name_en || item.product.name,
                  name_ar: item.product.name_ar || master?.name_ar || item.product.name,
                  pack_quantity_en: item.product.pack_quantity_en || master?.pack_quantity_en || item.product.pack_quantity,
                  pack_quantity_ar: item.product.pack_quantity_ar || master?.pack_quantity_ar || item.product.pack_quantity,
                  box_quantity_label_en: item.product.box_quantity_label_en || master?.box_quantity_label_en,
                  box_quantity_label_ar: item.product.box_quantity_label_ar || master?.box_quantity_label_ar,
                  badge_en: item.product.badge_en || master?.badge_en,
                  badge_ar: item.product.badge_ar || master?.badge_ar,
                  pieces_per_pack: item.product.pieces_per_pack || master?.pieces_per_pack || 50,
                  available_flavors: item.product.available_flavors || master?.available_flavors,
                }
              };
            });
          } else {
            // Clean legacy mock item from storage
            localStorage.removeItem('toomakt_cart_items');
          }
        }
      }
    } catch {
      // Fallback
    }
    // Cart is empty by default until customer explicitly adds items
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [cartLimitNotice, setCartLimitNotice] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<ToastData | null>(null);

  // Sync real store settings from Supabase if available
  useEffect(() => {
    let isMounted = true;
    api.getGlobalSettings().then(settings => {
      if (isMounted && settings?.free_shipping_threshold) {
        setFreeShippingThreshold(Number(settings.free_shipping_threshold) || 500.00);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('toomakt_cart_items', JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  const clearNotice = () => setCartLimitNotice(null);
  const dismissToast = () => setToastNotification(null);

  const showToast = (
    type: 'success' | 'warning' | 'info',
    title: string,
    message: string,
    actionLabel?: string,
    onAction?: () => void,
    duration = 4500
  ) => {
    setToastNotification({
      id: String(Date.now()),
      type,
      title,
      message,
      actionLabel,
      onAction,
      duration
    });
  };

  const addToCart = (product: any, quantity = 1, selectedFlavor?: string): boolean => {
    let limitReached = false;
    const master = findCatalogProduct(product);
    const targetFlavor = selectedFlavor || product.selected_flavor || (Array.isArray(product.available_flavors) && product.available_flavors.length > 0 ? product.available_flavors[0] : (master?.available_flavors?.[0] || undefined));

    try {
      localStorage.setItem('toomakt_cart_user_added', 'true');
    } catch {}

    setItems(prev => {
      const existing = prev.find(item =>
        item.product.id === product.id && (targetFlavor ? item.selected_flavor === targetFlavor : true)
      );
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > 5) {
          limitReached = true;
          setCartLimitNotice(`Maximum limit reached! Customers can order a maximum of 5 packs per item.`);
          showToast(
            'warning',
            'Order Limit: 5 Packs Max',
            'Retail customers can order up to 5 packs per item. Need bulk quantities?',
            'Wholesale Quotes',
            () => { navigateTo('wholesale'); }
          );
          return prev.map(item =>
            (item.product.id === product.id && (targetFlavor ? item.selected_flavor === targetFlavor : true))
              ? { ...item, quantity: 5 }
              : item
          );
        }
        return prev.map(item =>
          (item.product.id === product.id && (targetFlavor ? item.selected_flavor === targetFlavor : true))
            ? { ...item, quantity: nextQty }
            : item
        );
      }

      // Safe limit for new item: 1 to 5 packs
      const safeQty = Math.min(5, Math.max(1, quantity));
      if (quantity > 5) {
        limitReached = true;
        setCartLimitNotice(`Order limit: Maximum 5 packs per item.`);
      }

      const newProduct = {
        ...product,
        id: product.id,
        slug: product.slug || master?.slug,
        sku: product.sku || master?.sku,
        name: product.name || master?.name || (product as BundleItem).title,
        name_en: product.name_en || master?.name_en || product.name || (product as BundleItem).title,
        name_ar: product.name_ar || master?.name_ar || product.name || (product as BundleItem).title,
        price: Number(product.price),
        weight: product.weight || master?.weight || '236g',
        pack_quantity: product.pack_quantity || master?.pack_quantity || '236g Bag',
        pack_quantity_en: product.pack_quantity_en || master?.pack_quantity_en || product.pack_quantity || '236g Bag',
        pack_quantity_ar: product.pack_quantity_ar || master?.pack_quantity_ar || product.pack_quantity || '236 جم كيس',
        box_quantity_label: product.box_quantity_label || master?.box_quantity_label,
        box_quantity_label_en: product.box_quantity_label_en || master?.box_quantity_label_en,
        box_quantity_label_ar: product.box_quantity_label_ar || master?.box_quantity_label_ar,
        image: product.image || product.image_url || master?.image || '/images/products/cappuccino_candies_thumb_isolated.png',
        badge: product.badge || master?.badge,
        badge_en: product.badge_en || master?.badge_en,
        badge_ar: product.badge_ar || master?.badge_ar,
        pieces_per_pack: product.pieces_per_pack || master?.pieces_per_pack || 50,
        available_flavors: product.available_flavors || master?.available_flavors
      };

      return [...prev, { product: newProduct, quantity: safeQty, selected_flavor: targetFlavor }];
    });

    setIsCartOpen(true);
    return !limitReached;
  };

  const removeFromCart = (id: string, selectedFlavor?: string) => {
    setItems(prev =>
      prev.filter(item => {
        if (selectedFlavor !== undefined) {
          return !(item.product.id === id && item.selected_flavor === selectedFlavor);
        }
        return item.product.id !== id;
      })
    );
  };

  const updateQuantity = (id: string, delta: number, selectedFlavor?: string) => {
    setItems(prev =>
      prev
        .map(item => {
          const isMatch = selectedFlavor !== undefined
            ? (item.product.id === id && item.selected_flavor === selectedFlavor)
            : (item.product.id === id);

          if (isMatch) {
            const newQty = item.quantity + delta;
            if (newQty > 5) {
              setCartLimitNotice(`Maximum limit is 5 packs per item. For larger bulk orders, please check our Wholesale page.`);
              showToast(
                'warning',
                '5 Packs Maximum Limit',
                'Maximum retail limit reached for this item.',
                'Wholesale Quotes',
                () => { navigateTo('wholesale'); }
              );
              return { ...item, quantity: 5 };
            }
            if (newQty <= 0) {
              return null;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem('toomakt_cart_items');
    } catch {
      // Ignore
    }
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = promoApplied ? rawSubtotal * 0.1 : 0;
  const subtotal = rawSubtotal - discountAmount;

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'TOOMAKT10' || cleanCode === 'SWEET10') {
      setPromoApplied(true);
      setPromoCode(cleanCode);
      return true;
    }
    return false;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        freeShippingThreshold,
        amountToFreeShipping,
        defaultShippingFee,
        promoApplied,
        promoCode,
        applyPromoCode,
        discountAmount,
        cartLimitNotice,
        clearNotice,
        toastNotification,
        showToast,
        dismissToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
