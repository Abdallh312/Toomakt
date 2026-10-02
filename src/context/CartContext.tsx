import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, BundleItem } from '../types';

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
  addToCart: (product: any, quantity?: number) => boolean;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
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
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('toomakt_cart_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Enforce 1-5 limit on loaded items
          return parsed.map((item: CartItem) => ({
            ...item,
            quantity: Math.min(5, Math.max(1, item.quantity || 1)),
            product: {
              ...item.product,
              pieces_per_pack: item.product.pieces_per_pack || 20
            }
          }));
        }
      }
    } catch {
      // Fallback
    }
    // Default starter pack for smooth first glance
    return [
      {
        product: {
          id: 'mango-sunbeam',
          name: 'Mango Sunbeam',
          price: 260.00,
          weight: '250g Pouch',
          image: '/images/products/mango_sunbeam.jpg',
          badge: 'BEST SELLER',
          pieces_per_pack: 24
        },
        quantity: 1
      }
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [cartLimitNotice, setCartLimitNotice] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<ToastData | null>(null);

  const freeShippingThreshold = 2000.00; // EGP matching Figma spec

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

  const addToCart = (product: any, quantity = 1): boolean => {
    let limitReached = false;
    let addedProductTitle = '';
    let addedProductPieces = 20;

    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        addedProductTitle = existing.product.name;
        addedProductPieces = existing.product.pieces_per_pack || 20;
        const nextQty = existing.quantity + quantity;
        if (nextQty > 5) {
          limitReached = true;
          setCartLimitNotice(`Maximum limit reached! Customers can order a maximum of 5 packs per item.`);
          showToast(
            'warning',
            'Order Limit: 5 Packs Max',
            'Retail customers can order up to 5 packs per item. Need bulk quantities?',
            'Wholesale Quotes',
            () => { window.location.hash = '#wholesale'; }
          );
          return prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: 5 }
              : item
          );
        }
        showToast(
          'success',
          'Added to Tasting Bag',
          `${existing.product.name} (+${quantity} Pack)`,
          'View Bag',
          () => setIsCartOpen(true)
        );
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: nextQty }
            : item
        );
      }

      // Safe limit for new item: 1 to 5 packs
      const safeQty = Math.min(5, Math.max(1, quantity));
      if (quantity > 5) {
        limitReached = true;
        setCartLimitNotice(`Order limit: Maximum 5 packs per item.`);
        showToast(
          'warning',
          'Order Limit: 5 Packs Max',
          'Retail customers can order up to 5 packs per item.',
          'Wholesale Quotes',
          () => { window.location.hash = '#wholesale'; }
        );
      }

      const newProduct = {
        id: product.id,
        name: 'name' in product ? product.name : (product as BundleItem).title,
        price: Number(product.price),
        weight: product.weight || '180g Pouch',
        image: product.image || product.image_url || '/images/canister.jpg',
        badge: product.badge,
        pieces_per_pack: product.pieces_per_pack || 20
      };

      addedProductTitle = newProduct.name;
      addedProductPieces = newProduct.pieces_per_pack;

      showToast(
        'success',
        'Added to Tasting Bag',
        `${newProduct.name} (${safeQty} Pack • ${newProduct.pieces_per_pack * safeQty} Pieces)`,
        'View Bag',
        () => setIsCartOpen(true)
      );

      return [...prev, { product: newProduct, quantity: safeQty }];
    });

    setIsCartOpen(true);
    return !limitReached;
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.product.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev =>
      prev
        .map(item => {
          if (item.product.id === id) {
            const newQty = item.quantity + delta;
            if (newQty > 5) {
              setCartLimitNotice(`Maximum limit is 5 packs per item. For larger bulk orders, please check our Wholesale page.`);
              showToast(
                'warning',
                '5 Packs Maximum Limit',
                'Maximum retail limit reached for this item.',
                'Wholesale Quotes',
                () => { window.location.hash = '#wholesale'; }
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
