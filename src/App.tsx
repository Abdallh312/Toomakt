import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { SmoothScroll } from './components/SmoothScroll';
import { LandingPageView } from './components/landing/LandingPageView';
import { FactoryView } from './components/FactoryView';
import { AboutView } from './components/AboutView';
import { ContactWholesaleView } from './components/ContactWholesaleView';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShopAllView } from './components/ShopAllView';
import { BundlesView } from './components/BundlesView';
import { TrackOrderView } from './components/TrackOrderView';
import { CMSPageView } from './components/CMSPageView';
import { LegalPoliciesView } from './components/LegalPoliciesView';
import { NotFoundPage } from './components/NotFoundPage';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessView } from './components/OrderSuccessView';
import { AlertManagerView } from './components/AlertManagerView';
import { AdminLoginView } from './components/admin/AdminLoginView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BrandPreloader } from './components/BrandPreloader';
import { Product } from './types';
import { initSeoAndTracking } from './services/seoTracking';
import { seo } from './services/seo';
import { getCleanRoute, navigateTo } from './utils/navigation';
import { api } from './services/api';
import { PaymobService } from './services/paymob';
import { useLanguage } from './context/LanguageContext';
import { PRODUCTS, AUTHENTIC_FAQS } from './data/toomaktData';

export const AppContent: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('toomakt_last_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.order_number && (parsed.order_number.includes('838446') || parsed.order_number.includes('mock') || parsed.order_number.includes('348395'))) {
          localStorage.removeItem('toomakt_last_order');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initialize SEO and tracking pixels
  useEffect(() => {
    const cleanup = initSeoAndTracking();
    return cleanup;
  }, []);

  // Dynamic Page-level and Product-level SEO Metadata
  useEffect(() => {
    if (selectedProduct) {
      const prodName = isRtl
        ? (selectedProduct.name_ar || selectedProduct.name)
        : (selectedProduct.name_en || selectedProduct.name);
      const prodDesc = isRtl
        ? (selectedProduct.description_ar || selectedProduct.description || selectedProduct.tagline_ar || selectedProduct.tagline)
        : (selectedProduct.description_en || selectedProduct.description || selectedProduct.tagline_en || selectedProduct.tagline);
      const prodSlug = selectedProduct.slug || selectedProduct.id;

      seo.updateMeta({
        title: isRtl
          ? `${prodName} — حلويات توفي فاخرة | توماكت مصر`
          : `${prodName} — Handcrafted Fruit Toffee Egypt | toomakt`,
        description: prodDesc,
        keywords: isRtl
          ? `${prodName}, توفي فاخر, حلويات القاهرة, ${selectedProduct.flavor_ar || selectedProduct.flavor || ''}, حلويات مصر`
          : `${prodName}, fruit toffee egypt, gourmet confectionery cairo, ${selectedProduct.flavor_en || selectedProduct.flavor || ''}`,
        image: selectedProduct.image || '/images/hero/hero_spec.jpg',
        url: `/products/${prodSlug}`,
        type: 'product',
        language,
        productData: {
          name: prodName,
          description: prodDesc,
          image: selectedProduct.image || '/images/hero/hero_spec.jpg',
          price: selectedProduct.price,
          sku: selectedProduct.sku,
          inStock: selectedProduct.in_stock !== false,
          brand: 'toomakt',
          category: selectedProduct.category,
          rating: selectedProduct.rating,
          reviewCount: selectedProduct.reviewsCount,
        },
        breadcrumbs: [
          { name: isRtl ? 'الرئيسية' : 'Home', url: '/' },
          { name: isRtl ? 'التشكيلة' : 'Collection', url: '/shop' },
          { name: prodName, url: `/products/${prodSlug}` },
        ],
      });
      return;
    }

    const pageMetaMap: Record<
      string,
      { title: string; desc: string; path: string; noindex?: boolean; isCategory?: boolean }
    > = {
      home: {
        title: isRtl
          ? 'توماكت — فاكهة طبيعية مطهوة ببطء | أرقى حلوى توفي فرنسية بمصر'
          : 'toomakt — Fruit, slowly made. | Artisanal Fruit Toffee Egypt | توماكت',
        desc: isRtl
          ? 'توماكت (toomakt) تصنع أفخر حلوى توفي فرنسية في القاهرة، مصر. مطهوة ببطء في مراجل نحاسية من بيوريه الفاكهة الطبيعية 100% والزبدة الأوروبية الفاخرة. شحن مبرد لجميع محافظات مصر.'
          : 'toomakt (توماكت) creates artisanal French fruit toffee in Cairo, Egypt. Handcrafted with 100% natural fruit purées, browned butter, and sea salt. Express climate delivery across Egypt.',
        path: '',
      },
      shop: {
        title: isRtl
          ? 'تشكيلة الحلويات الفاخرة — توفي وبونبون وإكلير | توماكت مصر'
          : 'The Collection — Handcrafted Fruit Toffees & Bonbons | toomakt Egypt',
        desc: isRtl
          ? 'استكشف تشكيلة توماكت الكاملة: توفي الفواكه الطبيعية، توفي زبدة نورماندي، بونبون كابتشينو، وإكلير الشوكولاتة البلجيكية. شحن لـ 27 محافظة.'
          : 'Browse toomakt artisanal confections. Handcrafted in small batches with real Alphonso mango, wild berries, and Mediterranean citrus.',
        path: 'shop',
        isCategory: true,
      },
      bundles: {
        title: isRtl
          ? 'صناديق الهدايا والمجموعات الحصرية — معمل توماكت القاهرة'
          : 'Curated Gift Boxes & Keepsake Tins — toomakt Atelier Cairo',
        desc: isRtl
          ? 'صناديق هدايا فاخرة ومجموعات تذوق راقية في علب أنيقة محفورة، مثالية للإهداء والمناسبات السعيدة في مصر.'
          : 'Explore luxury presentation gift boxes, holiday tasting collections, and artisanal toffee canisters from toomakt Cairo atelier.',
        path: 'bundles',
      },
      factory: {
        title: isRtl
          ? 'المصنع والمجمع الصناعي بالعاشر من رمضان — شركة الزهرة وتوماكت'
          : 'Manufacturing & Industrial Complex — Al-Zahra & toomakt Cairo',
        desc: isRtl
          ? 'جولة موثقة داخل خطوط إنتاج ومراجل النحاس لصناعة التوفي الفاخر بالعاشر من رمضان. معتمد من الهيئة القومية لسلامة الغذاء (NFSA).'
          : 'Tour our 28,000 sq ft confectionery complex in Cairo. European copper cauldrons, automated cleanrooms, and NFSA-grade food safety.',
        path: 'factory',
      },
      about: {
        title: isRtl
          ? 'قصتنا وحرفتنا وتاريخ النشأة — معمل حلويات توماكت القاهرة'
          : 'Our Craft Heritage & Story — toomakt Confectionery Atelier',
        desc: isRtl
          ? 'اكتشف قصة توماكت: طهي هادئ في مراجل نحاسية فرنسية، بيوريه فواكه البساتين 100%، والزبدة الأوروبية الطبيعية بالقاهرة.'
          : 'Discover the story behind toomakt: slow copper-kettle caramelization, pure fruit purées, and European butter in Cairo.',
        path: 'about',
      },
      contact: {
        title: isRtl
          ? 'تواصل مع معمل توماكت — طلبات الجملة وهدايا الشركات والمناسبات'
          : 'Connect with toomakt — Bespoke Gifting & Wholesale Concierge',
        desc: isRtl
          ? 'تواصل مع مستشار حلويات توماكت عبر واتساب أو الهاتف لطلبات الجملة، هدايا المؤتمرات والشركات، وتوريد الفنادق.'
          : 'Connect directly with our Cairo atelier for corporate gifting, hotel amenities, and bulk confectionery distribution.',
        path: 'contact',
      },
      'our-story': {
        title: isRtl
          ? 'قصتنا وحرفتنا وتاريخ النشأة — معمل حلويات توماكت القاهرة'
          : 'Our Craft Heritage & Story — toomakt Confectionery Atelier',
        desc: isRtl
          ? 'اكتشف قصة توماكت: طهي هادئ في مراجل نحاسية فرنسية، بيوريه فواكه البساتين 100%، والزبدة الأوروبية الطبيعية بالقاهرة.'
          : 'Discover the story behind toomakt: slow copper-kettle caramelization, pure fruit purées, and European butter in Cairo.',
        path: 'our-story',
      },
      ingredients: {
        title: isRtl
          ? 'المكونات النقية والنقاء الطبيعي — معمل حلويات توماكت'
          : 'Botanical Quality & Pure Ingredients — toomakt Egypt',
        desc: isRtl
          ? 'تعرف على مكوناتنا النقية: بيوريه الفاكهة الطبيعية 100%، زبدة القشطة الأوروبية بنسبة 84% دسم، وبدون شراب الذرة المصنع.'
          : 'Learn about our 100% real fruit purées, European cultured butter, and clean formula without synthetic preservatives.',
        path: 'ingredients',
      },
      wholesale: {
        title: isRtl
          ? 'توريد الشركات والفنادق وهدايا كبار العملاء — توماكت مصر'
          : 'Wholesale & Corporate Gifting Concierge — toomakt Cairo',
        desc: isRtl
          ? 'برامج توريد حصرية للفنادق الفاخرة، كافيهات البوتيك، هدايا الشركات الكبرى وحفلات الزفاف في مصر.'
          : 'Partner with toomakt for boutique hospitality supply, bespoke corporate gifting, weddings, and luxury events in Egypt.',
        path: 'wholesale',
      },
      faq: {
        title: isRtl
          ? 'الأسئلة الشائعة — صلاحية التوفي والشحن والتخزين | توماكت'
          : 'Frequently Asked Questions — toomakt Confectionery',
        desc: isRtl
          ? 'إجابات شاملة عن صلاحية التوفي الفاخر، طريقة التخزين المثالية، الشحن المبرد، ومكونات حلويات توماكت.'
          : 'Answers to frequently asked questions about shipping, storage, temperature care, ingredients, and allergen information.',
        path: 'faq',
      },
      shipping: {
        title: isRtl
          ? 'الشحن المبرد وسياسة التوصيل لـ 27 محافظة — توماكت'
          : 'Climate-Controlled Shipping & Delivery — toomakt Egypt',
        desc: isRtl
          ? 'شحن مبرد ومعزول حرارياً مع عبوات جل تبريد يغطي جميع المحافظات المصرية. توصيل سريع والدفع عند الاستلام.'
          : 'Fast, temperature-protected delivery across all 27 Egyptian governorates. Cash on delivery and InstaPay supported.',
        path: 'shipping',
      },
      'shipping-policy': {
        title: isRtl
          ? 'سياسة الشحن والتوصيل المبرد لـ 27 محافظة — توماكت'
          : 'Delivery & Shipping Policy — toomakt Confectionery Egypt',
        desc: isRtl
          ? 'سياسة الشحن والتوصيل المبرد مع أسعار الشحن ومواعيد التوصيل لجميع محافظات جمهورية مصر العربية.'
          : 'Official shipping and climate-controlled delivery terms and rates across Egypt.',
        path: 'shipping-policy',
      },
      privacy: {
        title: isRtl
          ? 'سياسة الخصوصية وحماية البيانات — شركة توماكت'
          : 'Privacy & Data Protection Policy — toomakt Egypt',
        desc: isRtl
          ? 'سياسة خصوصية البيانات وأمان المدفوعات الإلكترونية عبر Paymob لشركة توماكت للحلويات والكراميل.'
          : 'Privacy policy and secure transaction protection by toomakt Confectionery Atelier.',
        path: 'privacy',
      },
      'privacy-policy': {
        title: isRtl
          ? 'سياسة الخصوصية وحماية البيانات — شركة توماكت'
          : 'Privacy & Data Protection Policy — toomakt Egypt',
        desc: isRtl
          ? 'سياسة خصوصية البيانات وأمان المدفوعات الإلكترونية عبر Paymob لشركة توماكت للحلويات والكراميل.'
          : 'Privacy policy and secure transaction protection by toomakt Confectionery Atelier.',
        path: 'privacy-policy',
      },
      refund: {
        title: isRtl
          ? 'سياسة الاسترجاع والاستبدال وإلغاء الطلب — توماكت'
          : 'Refund, Return & Cancellation Policy — toomakt Egypt',
        desc: isRtl
          ? 'سياسة استرجاع واستبدال المنتجات الغذائية وإلغاء الطلبات المتوافقة مع قانون حماية المستهلك المصري.'
          : 'Official 14-day refund and order cancellation terms under Egyptian Consumer Protection Law.',
        path: 'refund',
      },
      'refund-policy': {
        title: isRtl
          ? 'سياسة الاسترجاع والاستبدال وإلغاء الطلب — توماكت'
          : 'Refund, Return & Cancellation Policy — toomakt Egypt',
        desc: isRtl
          ? 'سياسة استرجاع واستبدال المنتجات الغذائية وإلغاء الطلبات المتوافقة مع قانون حماية المستهلك المصري.'
          : 'Official 14-day refund and order cancellation terms under Egyptian Consumer Protection Law.',
        path: 'refund-policy',
      },
      terms: {
        title: isRtl
          ? 'الشروط والأحكام وسياسة البيع — شركة توماكت'
          : 'Terms & Conditions of Sale — toomakt Egypt',
        desc: isRtl
          ? 'شروط الاستخدام وأحكام البيع والدفع الإلكتروني لشركة توماكت للحلويات والكراميل.'
          : 'Official terms and conditions governing purchases and electronic payments.',
        path: 'terms',
      },
      'terms-of-service': {
        title: isRtl
          ? 'الشروط والأحكام وسياسة البيع — شركة توماكت'
          : 'Terms & Conditions of Sale — toomakt Egypt',
        desc: isRtl
          ? 'شروط الاستخدام وأحكام البيع والدفع الإلكتروني لشركة توماكت للحلويات والكراميل.'
          : 'Official terms and conditions governing purchases and electronic payments.',
        path: 'terms-of-service',
      },
      track: {
        title: isRtl
          ? 'تتبع شحنة الطلب — معمل حلويات توماكت'
          : 'Track Your Confectionery Order — toomakt Egypt',
        desc: isRtl
          ? 'تابع مسار توصيل طلبك ورقم الشحنة وموعد وصول مندوب التوصيل في مصر.'
          : 'Track your toomakt order status, courier dispatch updates, and delivery schedule across Egypt.',
        path: 'track',
        noindex: true,
      },
      checkout: {
        title: isRtl
          ? 'إتمام الطلب والدفع الآمن — معمل حلويات توماكت'
          : 'Secure Checkout — toomakt Confectionery',
        desc: isRtl
          ? 'أكمل طلبك بالدفع عند الاستلام أو عبر إنستاباي. شحن مباشر من معمل القاهرة.'
          : 'Complete your order with Cash on Delivery or InstaPay. Direct dispatch from our Cairo atelier.',
        path: 'checkout',
        noindex: true,
      },
      'order-success': {
        title: isRtl
          ? 'تم تأكيد طلبك بنجاح — معمل حلويات توماكت'
          : 'Order Confirmed — toomakt Confectionery',
        desc: isRtl
          ? 'شكراً لطلبك! يتم تحضير شحنتك الطازجة في معملنا بالقاهرة.'
          : 'Thank you for your order! Your freshly prepared toffee parcel is being packed at our Cairo atelier.',
        path: 'order-success',
        noindex: true,
      },
      alerts: {
        title: isRtl ? 'إدارة التنبيهات والإشعارات' : 'Alerts & Announcements Manager',
        desc: 'Internal announcements telemetry manager.',
        path: 'alerts',
        noindex: true,
      },
      '404': {
        title: isRtl
          ? 'الصفحة غير موجودة (404) — معمل حلويات توماكت'
          : 'Page Not Found (404) — toomakt Confectionery',
        desc: isRtl
          ? 'عذراً، الصفحة المطلوبة غير متوفرة. تصفح تشكيلة الحلويات الفاخرة أو عد للصفحة الرئيسية.'
          : 'The page you requested could not be found. Explore our confections or return to the atelier homepage.',
        path: '404',
        noindex: true,
      },
    };

    const currentMeta = pageMetaMap[currentView] || pageMetaMap['404'] || pageMetaMap.home;
    const pageTitle = currentMeta.title;
    const pageBreadcrumbs = currentMeta.path && currentMeta.path !== '404'
      ? [
          { name: isRtl ? 'الرئيسية' : 'Home', url: '/' },
          { name: pageTitle.split('—')[0].trim(), url: `/${currentMeta.path}` },
        ]
      : [{ name: isRtl ? 'الرئيسية' : 'Home', url: '/' }];

    seo.updateMeta({
      title: pageTitle,
      description: currentMeta.desc,
      url: currentMeta.path ? `/${currentMeta.path}` : '/',
      type: 'website',
      language,
      noindex: currentMeta.noindex || false,
      categoryData: currentMeta.isCategory ? {
        name: isRtl ? 'تشكيلة الحلويات الفاخرة' : 'The Confectionery Collection',
        description: currentMeta.desc,
        url: '/shop'
      } : undefined,
      faqs: currentView === 'faq' ? AUTHENTIC_FAQS.map(f => ({
        question: isRtl ? f.q_ar : f.q_en,
        answer: isRtl ? f.a_ar : f.a_en
      })) : undefined,
      breadcrumbs: pageBreadcrumbs,
    });
  }, [currentView, selectedProduct, language, isRtl]);

  // Detect Paymob transaction response return parameters (e.g. ?success=true&id=548042800)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const successParam = searchParams.get('success');
    const txnId = searchParams.get('id');
    const paymobOrderId = searchParams.get('order');
    const merchantOrderId = searchParams.get('merchant_order_id') || searchParams.get('special_reference');

    if (successParam === 'true' || (txnId && searchParams.has('pending'))) {
      const verifyAndLoad = async () => {
        try {
          const verifyRes = await PaymobService.verifyPayment({
            transactionId: txnId || undefined,
            paymobOrderId: paymobOrderId || undefined,
            orderNumber: merchantOrderId || undefined,
          });

          if (verifyRes.isPaid) {
            const targetOrderNum = verifyRes.orderNumber || merchantOrderId;
            let loadedOrder: any = null;
            if (targetOrderNum) {
              loadedOrder = await api.trackOrder(targetOrderNum);
            }

            if (!loadedOrder) {
              // Construct order summary from verification data
              loadedOrder = {
                order_number: targetOrderNum || `ORD-PAYMOB-${txnId || 'PAID'}`,
                total_amount: verifyRes.paidAmountCents ? (verifyRes.paidAmountCents / 100) : 0,
                payment_method: 'card',
                payment_status: 'paid',
                status: 'processing',
                customer_name: 'Valued Customer',
                created_at: new Date().toISOString(),
              };
            }

            setLastOrder(loadedOrder);
            try {
              localStorage.setItem('toomakt_last_order', JSON.stringify(loadedOrder));
            } catch (e) {}

            // Navigate to order-success and clean URL
            setCurrentView('order-success');
            window.history.replaceState({}, '', '/order-success');
          }
        } catch (e) {
          console.error('Error verifying Paymob return URL:', e);
        }
      };

      verifyAndLoad();
    } else if (successParam === 'false') {
      setCurrentView('checkout');
      window.history.replaceState({}, '', '/checkout');
    }
  }, []);

  const checkAdminAuth = () => {
    return !!(localStorage.getItem('toomakt_admin_token') || sessionStorage.getItem('toomakt_admin_token'));
  };

  // Synchronize view with clean URL path without '#'
  useEffect(() => {
    const handleRoute = () => {
      const route = getCleanRoute();
      const urlParams = new URLSearchParams(window.location.search);
      const queryProduct = urlParams.get('product');

      // 1. Deep Product Route Handling (/products/:slug, /product/:slug, or ?product=:slug)
      if (
        route.startsWith('products/') ||
        route.startsWith('product/') ||
        (queryProduct && (route === 'shop' || route === 'products'))
      ) {
        const slug = (queryProduct || route.replace(/^(products|product)\//, '')).trim();

        // 301 Canonical redirect from /product/ to /products/
        if (route.startsWith('product/') || queryProduct) {
          try {
            window.history.replaceState(null, '', `/products/${slug}`);
          } catch {}
        }

        const found = PRODUCTS.find(
          (p) =>
            p.id === slug ||
            p.slug === slug ||
            (p.sku && p.sku.toLowerCase() === slug.toLowerCase())
        );

        if (found) {
          setSelectedProduct(found);
          setCurrentView('shop');
          return;
        } else {
          // Check asynchronous products from API if needed
          api.getProducts().then((list) => {
            const asyncFound = (list || []).find(
              (p) =>
                p.id === slug ||
                p.slug === slug ||
                (p.sku && p.sku.toLowerCase() === slug.toLowerCase())
            );
            if (asyncFound) {
              setSelectedProduct(asyncFound);
              setCurrentView('shop');
            } else {
              setSelectedProduct(null);
              setCurrentView('404');
            }
          }).catch(() => {
            setSelectedProduct(null);
            setCurrentView('404');
          });
          return;
        }
      }

      // 2. Category Route Handling (/categories/:slug or /category/:slug)
      if (route.startsWith('categories/') || route.startsWith('category/')) {
        const catSlug = route.replace(/^(categories|category)\//, '').trim();
        if (route.startsWith('category/')) {
          try {
            window.history.replaceState(null, '', `/categories/${catSlug}`);
          } catch {}
        }
        setSelectedProduct(null);
        setCurrentView('shop');
        return;
      }

      // If user navigated away from product modal, clear selectedProduct
      setSelectedProduct(null);

      const knownViews = [
        'checkout',
        'order-success',
        'wholesale',
        'contact',
        'shop',
        'products',
        'bundles',
        'gifts',
        'track',
        'our-story',
        'about',
        'ingredients',
        'faq',
        'shipping',
        'shipping-policy',
        'delivery',
        'privacy',
        'privacy-policy',
        'terms',
        'terms-of-service',
        'refund',
        'refund-policy',
        'cancellation',
        'legal',
        'alerts',
        'announcements',
      ];

      if (route === 'admin/login') {
        setCurrentView('admin/login');
      } else if (route === 'admin') {
        if (checkAdminAuth()) {
          setCurrentView('admin');
        } else {
          navigateTo('admin/login', { replace: true });
          setCurrentView('admin/login');
        }
      } else if (route === 'products' || route === 'shop') {
        setCurrentView('shop');
      } else if (route === 'bundles' || route === 'gifts') {
        setCurrentView('bundles');
      } else if (route === 'about' || route === 'our-story') {
        setCurrentView('our-story');
      } else if (route === 'contact' || route === 'wholesale') {
        setCurrentView('wholesale');
      } else if (route === 'alerts' || route === 'announcements') {
        setCurrentView('alerts');
      } else if (knownViews.includes(route)) {
        setCurrentView(route);
      } else if (!route || route === 'home') {
        setCurrentView('home');
      } else {
        setCurrentView('404');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => {
      window.removeEventListener('popstate', handleRoute);
    };
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    const slug = product.slug || product.id;
    if (window.location.pathname !== `/products/${slug}`) {
      window.history.pushState(null, '', `/products/${slug}`);
    }
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    const target = currentView === 'home' ? '/' : `/${currentView}`;
    if (window.location.pathname.startsWith('/products/') || window.location.pathname.startsWith('/product/')) {
      window.history.pushState(null, '', target);
    }
  };

  const handleNavigateView = (view: string) => {
    setSelectedProduct(null);
    let target = view;
    if (view === 'products') target = 'shop';
    if (view === 'gifts') target = 'bundles';
    if (view === 'about') target = 'our-story';
    if (view === 'contact') target = 'wholesale';
    if (view === 'announcements') target = 'alerts';

    if (target === 'admin') {
      if (checkAdminAuth()) {
        setCurrentView('admin');
        navigateTo('admin');
      } else {
        setCurrentView('admin/login');
        navigateTo('admin/login');
      }
    } else {
      setCurrentView(target);
      navigateTo(target === 'home' ? '' : target);
    }
  };

  const handleNavigateSection = (id: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      navigateTo('');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1. If in admin login view
  if (currentView === 'admin/login') {
    return (
      <AdminLoginView
        onLoginSuccess={() => handleNavigateView('admin')}
        onBackToShop={() => handleNavigateView('home')}
      />
    );
  }

  // 2. If in admin mode, require authentication
  if (currentView === 'admin') {
    if (!checkAdminAuth()) {
      return (
        <AdminLoginView
          onLoginSuccess={() => handleNavigateView('admin')}
          onBackToShop={() => handleNavigateView('home')}
        />
      );
    }
    return (
      <AdminDashboard
        onBackToStore={() => handleNavigateView('home')}
        onLogout={() => {
          localStorage.removeItem('toomakt_admin_token');
          sessionStorage.removeItem('toomakt_admin_token');
          handleNavigateView('admin/login');
        }}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-white font-sans selection:bg-[#E890A8] selection:text-white flex flex-col">
      {/* Brand Luxury Initial & Refresh Preloader with Smooth 3D Animated Transition */}
      <BrandPreloader minDurationMs={850} />

      {/* Desktop custom cursor */}
      <CustomCursor />

      {/* Website Full-Bleed Container */}
      <div className="flex-1 w-full flex flex-col">
        {/* Brand Sticky Navbar — visible on ALL pages */}
        <div className="no-print">
          <Navbar
            onNavigateSection={handleNavigateSection}
            onNavigateView={handleNavigateView}
            currentView={currentView}
            onSearchQuery={(q) => {
              handleNavigateView('shop');
              window.dispatchEvent(new CustomEvent('toomakt:search', { detail: q }));
            }}
          />
        </div>

        {/* Main Dynamic Content Switcher */}
        <main className="main-content-layer flex-1 w-full max-w-full overflow-x-hidden">
          {/* PAGE 1: DEDICATED BRAND INTRODUCTION LANDING PAGE */}
          {currentView === 'home' && (
            <LandingPageView
              onNavigateView={handleNavigateView}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {/* PAGE 2: SEPARATE DEDICATED PRODUCTS EXPERIENCE */}
          {(currentView === 'shop' || currentView === 'products') && (
            <ShopAllView
              onSelectProduct={handleSelectProduct}
              onNavigateHome={() => handleNavigateView('home')}
            />
          )}

          {/* PAGE 3: DEDICATED FACTORIES & MANUFACTURING PAGE */}
          {(currentView === 'factory' || currentView === 'manufacturing') && (
            <FactoryView
              onNavigateHome={() => handleNavigateView('home')}
              onNavigateContact={() => handleNavigateView('contact')}
            />
          )}

          {/* PAGE 4: DEDICATED ABOUT US & CRAFT HERITAGE PAGE */}
          {(currentView === 'about' || currentView === 'our-story') && (
            <AboutView
              onNavigateHome={() => handleNavigateView('home')}
              onNavigateShop={() => handleNavigateView('shop')}
              onNavigateFactory={() => handleNavigateView('factory')}
            />
          )}

          {/* PAGE 5: DEDICATED CONTACT US & WHOLESALE CONCIERGE */}
          {(currentView === 'contact' || currentView === 'wholesale') && (
            <ContactWholesaleView
              onNavigateHome={() => handleNavigateView('home')}
              onNavigateShop={() => handleNavigateView('shop')}
            />
          )}

          {/* PAGE 6: CURATED BUNDLES FROM DATABASE */}
          {(currentView === 'bundles' || currentView === 'gifts') && (
            <BundlesView onNavigateHome={() => handleNavigateView('home')} />
          )}

          {/* LEGAL & COMPLIANCE POLICIES (PAYMOB VERIFIED) */}
          {[
            'privacy',
            'privacy-policy',
            'terms',
            'terms-of-service',
            'shipping',
            'shipping-policy',
            'delivery',
            'refund',
            'refund-policy',
            'cancellation',
            'legal',
          ].includes(currentView) && (
            <LegalPoliciesView
              initialTab={currentView}
              onBackHome={() => handleNavigateView('home')}
              onNavigateView={handleNavigateView}
            />
          )}

          {/* CMS UTILITY PAGES */}
          {['ingredients', 'faq'].includes(currentView) && (
            <CMSPageView
              slug={currentView}
              onBackHome={() => handleNavigateView('home')}
              onNavigateView={handleNavigateView}
            />
          )}

          {/* DEDICATED ALERT SYSTEM MANAGEMENT PAGE */}
          {(currentView === 'alerts' || currentView === 'announcements') && (
            <AlertManagerView
              onBackToStore={() => handleNavigateView('home')}
              onNavigateView={handleNavigateView}
            />
          )}

          {/* UTILITY VIEWS: CHECKOUT, ORDER SUCCESS, TRACKING */}
          {currentView === 'checkout' && (
            <CheckoutView
              onOrderSuccess={(ord) => {
                setLastOrder(ord);
                try {
                  localStorage.setItem('toomakt_last_order', JSON.stringify(ord));
                } catch (e) {}
                handleNavigateView('order-success');
              }}
              onTrackOrder={(ord) => {
                setLastOrder(ord);
                try {
                  localStorage.setItem('toomakt_last_order', JSON.stringify(ord));
                } catch (e) {}
                handleNavigateView('track');
              }}
              onBackToShop={() => handleNavigateView('shop')}
            />
          )}

          {/* ORDER SUCCESS VIEW */}
          {currentView === 'order-success' && (
            <OrderSuccessView
              order={lastOrder}
              onContinueShopping={() => handleNavigateView('shop')}
              onTrackOrder={(_orderNum) => {
                handleNavigateView('track');
              }}
            />
          )}

          {/* TRACK ORDER VIEW */}
          {currentView === 'track' && (
            <TrackOrderView
              onBackToShop={() => handleNavigateView('shop')}
            />
          )}

          {/* 404 NOT FOUND VIEW */}
          {currentView === '404' && (
            <NotFoundPage
              onNavigateHome={() => handleNavigateView('home')}
              onNavigateShop={() => handleNavigateView('shop')}
              onNavigateTrack={() => handleNavigateView('track')}
              onOpenSearch={() => handleNavigateView('shop')}
            />
          )}
        </main>
      </div>

      {/* Behind-The-Page Reveal Footer — shows on ALL pages */}
      <Footer
        onNavigateView={handleNavigateView}
        onNavigateSection={handleNavigateSection}
      />

      {/* Slide-over Tasting Bag / Cart Drawer */}
      <div className="no-print">
        <CartDrawer onNavigateView={handleNavigateView} />
      </div>

      {/* Modals: Product Detail Modal ONLY */}
      <div className="no-print">
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseProductModal}
          onNavigateView={handleNavigateView}
        />
      </div>

      {/* Floating Scroll to Top Button (from reference image) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="no-print fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-xl hover:scale-108 active:scale-95 transition-all cursor-pointer border border-white/20"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Animated WhatsApp Concierge Button */}
      <motion.a
        href="https://wa.me/201024542139?text=Hello%20toomakt%20Atelier!%20I%20have%20an%20inquiry."
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="no-print fixed bottom-6 left-6 rtl:left-auto rtl:right-6 z-40 bg-[#E890A8] hover:bg-[#6AACE9] text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-[0_6px_20px_rgba(232,144,168,0.35)] hover:shadow-[0_6px_20px_rgba(106,172,233,0.4)] flex items-center gap-2 transition-all cursor-pointer group select-none border border-white/20 font-mono text-xs uppercase tracking-wider"
        title="Chat with toomakt Concierge"
        aria-label="WhatsApp Concierge"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline font-medium text-[11px]">
          Concierge
        </span>
      </motion.a>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <SmoothScroll>
            <AppContent />
          </SmoothScroll>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
