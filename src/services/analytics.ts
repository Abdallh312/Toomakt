// toomakt Unified Analytics & Tracking Engine
// Supports Meta Pixel (fbq), Google Analytics 4 (gtag), and Google Tag Manager (dataLayer)

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface AnalyticsConfig {
  metaPixelId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  enabled?: boolean;
}

class AnalyticsService {
  private config: AnalyticsConfig = {
    metaPixelId: (import.meta.env.VITE_META_PIXEL_ID || '').trim(),
    googleAnalyticsId: (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim(),
    googleTagManagerId: (import.meta.env.VITE_GTM_ID || '').trim(),
    enabled: true,
  };

  private firedPurchases = new Set<string>();
  private initialized = false;

  public updateConfig(newConfig: Partial<AnalyticsConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.init();
  }

  public init() {
    if (typeof window === 'undefined' || !this.config.enabled) return;

    // 1. Meta Pixel
    if (this.config.metaPixelId && !window.fbq) {
      try {
        const n: any = (window.fbq = function (...args: any[]) {
          n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
        });
        if (!window._fbq) window._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];

        const t = document.createElement('script');
        t.async = true;
        t.src = 'https://connect.facebook.net/en_US/fbevents.js';
        const s = document.getElementsByTagName('script')[0];
        s.parentNode?.insertBefore(t, s);

        window.fbq('init', this.config.metaPixelId);
        window.fbq('track', 'PageView');
      } catch (e) {
        console.warn('Meta Pixel initialization warning:', e);
      }
    }

    // 2. Google Analytics (gtag.js)
    if (this.config.googleAnalyticsId && !window.gtag) {
      try {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function (...args: any[]) {
          window.dataLayer?.push(args);
        };
        window.gtag('js', new Date());
        window.gtag('config', this.config.googleAnalyticsId, { send_page_view: false });

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
        document.head.appendChild(script);
      } catch (e) {
        console.warn('Google Analytics initialization warning:', e);
      }
    }

    // 3. Google Tag Manager
    if (this.config.googleTagManagerId) {
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        const gtmScript = document.createElement('script');
        gtmScript.async = true;
        gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${this.config.googleTagManagerId}`;
        document.head.appendChild(gtmScript);
      } catch (e) {
        console.warn('GTM initialization warning:', e);
      }
    }

    this.initialized = true;
  }

  // --- E-Commerce Events ---

  public trackPageView(path = window.location.pathname) {
    if (typeof window === 'undefined') return;
    try {
      if (window.fbq && this.config.metaPixelId) {
        window.fbq('track', 'PageView');
      }
      if (window.gtag && this.config.googleAnalyticsId) {
        window.gtag('event', 'page_view', { page_path: path });
      }
      window.dataLayer?.push({ event: 'page_view', page: path });
    } catch (e) {
      console.warn('Analytics PageView error:', e);
    }
  }

  public trackViewContent(product: { id: string; name: string; price: number | string; category?: string }) {
    if (typeof window === 'undefined') return;
    const price = Number(product.price) || 0;
    try {
      if (window.fbq && this.config.metaPixelId) {
        window.fbq('track', 'ViewContent', {
          content_name: product.name,
          content_ids: [product.id],
          content_type: 'product',
          value: price,
          currency: 'EGP',
        });
      }
      if (window.gtag && this.config.googleAnalyticsId) {
        window.gtag('event', 'view_item', {
          currency: 'EGP',
          value: price,
          items: [{ item_id: product.id, item_name: product.name, price }],
        });
      }
      window.dataLayer?.push({
        event: 'view_item',
        ecommerce: {
          items: [{ item_id: product.id, item_name: product.name, price, item_category: product.category }],
        },
      });
    } catch (e) {
      console.warn('Analytics ViewContent error:', e);
    }
  }

  public trackSearch(query: string) {
    if (typeof window === 'undefined' || !query.trim()) return;
    try {
      if (window.fbq && this.config.metaPixelId) {
        window.fbq('track', 'Search', { search_string: query });
      }
      if (window.gtag && this.config.googleAnalyticsId) {
        window.gtag('event', 'search', { search_term: query });
      }
      window.dataLayer?.push({ event: 'search', search_term: query });
    } catch (e) {
      console.warn('Analytics Search error:', e);
    }
  }

  public trackAddToCart(item: { id: string; name: string; price: number | string; quantity: number }) {
    if (typeof window === 'undefined') return;
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    const total = price * qty;
    try {
      if (window.fbq && this.config.metaPixelId) {
        window.fbq('track', 'AddToCart', {
          content_name: item.name,
          content_ids: [item.id],
          content_type: 'product',
          value: total,
          currency: 'EGP',
        });
      }
      if (window.gtag && this.config.googleAnalyticsId) {
        window.gtag('event', 'add_to_cart', {
          currency: 'EGP',
          value: total,
          items: [{ item_id: item.id, item_name: item.name, price, quantity: qty }],
        });
      }
      window.dataLayer?.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: 'EGP',
          value: total,
          items: [{ item_id: item.id, item_name: item.name, price, quantity: qty }],
        },
      });
    } catch (e) {
      console.warn('Analytics AddToCart error:', e);
    }
  }

  public trackInitiateCheckout(items: any[], subtotal: number) {
    if (typeof window === 'undefined') return;
    try {
      if (window.fbq && this.config.metaPixelId) {
        window.fbq('track', 'InitiateCheckout', {
          num_items: items.length,
          value: subtotal,
          currency: 'EGP',
        });
      }
      if (window.gtag && this.config.googleAnalyticsId) {
        window.gtag('event', 'begin_checkout', {
          currency: 'EGP',
          value: subtotal,
          items: items.map(it => ({
            item_id: it.id || it.product?.id,
            item_name: it.name || it.product?.name,
            price: it.price || it.product?.price,
            quantity: it.quantity,
          })),
        });
      }
      window.dataLayer?.push({ event: 'begin_checkout', value: subtotal, currency: 'EGP' });
    } catch (e) {
      console.warn('Analytics InitiateCheckout error:', e);
    }
  }

  public trackAddPaymentInfo(paymentMethod: string, total: number) {
    if (typeof window === 'undefined') return;
    try {
      if (window.fbq && this.config.metaPixelId) {
        window.fbq('track', 'AddPaymentInfo', {
          payment_type: paymentMethod,
          value: total,
          currency: 'EGP',
        });
      }
      if (window.gtag && this.config.googleAnalyticsId) {
        window.gtag('event', 'add_payment_info', {
          payment_type: paymentMethod,
          value: total,
          currency: 'EGP',
        });
      }
      window.dataLayer?.push({ event: 'add_payment_info', payment_type: paymentMethod, value: total });
    } catch (e) {
      console.warn('Analytics AddPaymentInfo error:', e);
    }
  }

  public trackPurchase(order: any) {
    if (typeof window === 'undefined' || !order || !order.order_number) return;

    // Guard against duplicate purchase firing
    if (this.firedPurchases.has(order.order_number)) {
      return;
    }
    this.firedPurchases.add(order.order_number);

    const total = Number(order.total_amount) || 0;
    const items = order.items || [];

    try {
      if (window.fbq && this.config.metaPixelId) {
        window.fbq('track', 'Purchase', {
          value: total,
          currency: 'EGP',
          content_type: 'product',
          content_ids: items.map((i: any) => i.item_id || i.id),
          num_items: items.length,
        });
      }
      if (window.gtag && this.config.googleAnalyticsId) {
        window.gtag('event', 'purchase', {
          transaction_id: order.order_number,
          value: total,
          currency: 'EGP',
          tax: Number(order.tax_amount || 0),
          shipping: Number(order.shipping_fee || 0),
          items: items.map((i: any) => ({
            item_id: i.item_id || i.id,
            item_name: i.name || i.product_name_snapshot,
            price: Number(i.unit_price || 0),
            quantity: Number(i.quantity || 1),
          })),
        });
      }
      window.dataLayer?.push({
        event: 'purchase',
        ecommerce: {
          transaction_id: order.order_number,
          value: total,
          currency: 'EGP',
          shipping: Number(order.shipping_fee || 0),
          items: items.map((i: any) => ({
            item_id: i.item_id || i.id,
            item_name: i.name || i.product_name_snapshot,
            price: Number(i.unit_price || 0),
            quantity: Number(i.quantity || 1),
          })),
        },
      });
    } catch (e) {
      console.warn('Analytics Purchase error:', e);
    }
  }

  public trackLead(leadInfo: { email?: string; phone?: string; source: string }) {
    if (typeof window === 'undefined') return;
    try {
      if (window.fbq && this.config.metaPixelId) {
        window.fbq('track', 'Lead', { content_category: leadInfo.source });
      }
      if (window.gtag && this.config.googleAnalyticsId) {
        window.gtag('event', 'generate_lead', { currency: 'EGP', value: 0 });
      }
      window.dataLayer?.push({ event: 'generate_lead', source: leadInfo.source });
    } catch (e) {
      console.warn('Analytics Lead error:', e);
    }
  }
}

export const analytics = new AnalyticsService();
