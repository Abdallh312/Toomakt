import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { SmoothScroll } from './components/SmoothScroll';
import { HeroSection } from './components/HeroSection';
import { BrandMissionSection } from './components/BrandMissionSection';
import { BrandFlavorShowcaseSection } from './components/BrandFlavorShowcaseSection';
import { BrandStorySection } from './components/BrandStorySection';
import { ReviewsSection } from './components/ReviewsSection';
import { BrandInvitationSection } from './components/BrandInvitationSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShopAllView } from './components/ShopAllView';
import { BundlesView } from './components/BundlesView';
import { TrackOrderView } from './components/TrackOrderView';
import { CMSPageView } from './components/CMSPageView';
import { NotFoundPage } from './components/NotFoundPage';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessView } from './components/OrderSuccessView';
import { WholesaleView } from './components/WholesaleView';
import { AlertManagerView } from './components/AlertManagerView';
import { AdminLoginView } from './components/admin/AdminLoginView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product } from './types';
import { initSeoAndTracking } from './services/seoTracking';
import { getCleanRoute, navigateTo } from './utils/navigation';

export const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('toomakt_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Initialize SEO and tracking pixels
  useEffect(() => {
    const cleanup = initSeoAndTracking();
    return cleanup;
  }, []);

  const checkAdminAuth = () => {
    return !!(localStorage.getItem('toomakt_admin_token') || sessionStorage.getItem('toomakt_admin_token'));
  };

  // Synchronize view with clean URL path without '#'
  useEffect(() => {
    const handleRoute = () => {
      const route = getCleanRoute();

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
        'alerts',
        'announcements'
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

  const handleNavigateView = (view: string) => {
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#3C1322] selection:text-white">
      {/* 1. Global Announcement Header Bar */}
      <AnnouncementBar onNavigateView={handleNavigateView} />

      {/* 2. Brand Sticky Navbar (Redesigned, Professional, Inline Search, No Wishlist) */}
      <Navbar
        onNavigateSection={handleNavigateSection}
        onNavigateView={handleNavigateView}
        currentView={currentView}
        onSearchQuery={(q) => {
          handleNavigateView('shop');
          window.dispatchEvent(new CustomEvent('toomakt:search', { detail: q }));
        }}
      />

      {/* 3. Main Dynamic Content Switcher */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* PAGE 1: DEDICATED BRAND INTRODUCTION LANDING PAGE */}
        {currentView === 'home' && (
          <div id="brand-landing" className="relative w-full">
            {/* Brand Hero Introduction */}
            <HeroSection
              onShopNow={() => handleNavigateView('shop')}
              onExploreProcess={() => handleNavigateSection('our-approach')}
            />

            {/* Our Approach (3 Numbered Craft Pillars) */}
            <BrandMissionSection onNavigateStory={() => handleNavigateView('our-story')} />

            {/* Tasting Palette: 4 Flavor Family Showcase with CTA to Products Page */}
            <BrandFlavorShowcaseSection
              onExploreProducts={() => handleNavigateView('shop')}
            />

            {/* Atelier Process & The Toomakt Ritual with Autoplaying Video */}
            <BrandStorySection onReadMore={() => handleNavigateView('our-story')} />

            {/* Verified Client Feedback & Social Proof */}
            <ReviewsSection />

            {/* Closing Brand Invitation & Direct Shop CTA */}
            <BrandInvitationSection
              onShopProducts={() => handleNavigateView('shop')}
              onContactWholesale={() => handleNavigateView('wholesale')}
            />
          </div>
        )}

        {/* PAGE 2: SEPARATE DEDICATED PRODUCTS EXPERIENCE */}
        {(currentView === 'shop' || currentView === 'products') && (
          <ShopAllView
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateHome={() => handleNavigateView('home')}
          />
        )}

        {/* PAGE 2b: CURATED BUNDLES FROM DATABASE */}
        {(currentView === 'bundles' || currentView === 'gifts') && (
          <BundlesView onNavigateHome={() => handleNavigateView('home')} />
        )}

        {/* PAGE 3: ABOUT / CRAFT & INGREDIENTS */}
        {['our-story', 'about', 'ingredients', 'faq', 'shipping'].includes(currentView) && (
          <CMSPageView
            slug={currentView === 'about' ? 'our-story' : currentView}
            onBackHome={() => handleNavigateView('home')}
            onNavigateView={handleNavigateView}
          />
        )}

        {/* PAGE 4: CONTACT / WHOLESALE & CORPORATE GIFTING */}
        {(currentView === 'wholesale' || currentView === 'contact') && (
          <WholesaleView onNavigateView={handleNavigateView} />
        )}

        {/* PAGE 5: DEDICATED ALERT SYSTEM MANAGEMENT PAGE */}
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
            onBackToShop={() => handleNavigateView('shop')}
          />
        )}

        {currentView === 'order-success' && (
          <OrderSuccessView
            order={lastOrder}
            onContinueShopping={() => handleNavigateView('shop')}
          />
        )}

        {currentView === 'track' && (
          <TrackOrderView />
        )}

        {currentView === '404' && (
          <NotFoundPage
            onNavigateHome={() => handleNavigateView('home')}
            onNavigateShop={() => handleNavigateView('shop')}
            onNavigateTrack={() => handleNavigateView('track')}
            onOpenSearch={() => handleNavigateView('shop')}
          />
        )}
      </main>

      {/* 4. Luxury Dark Cacao Footer */}
      <Footer onNavigateView={handleNavigateView} />

      {/* Slide-over Tasting Bag / Cart Drawer */}
      <CartDrawer onNavigateView={handleNavigateView} />

      {/* Modals: Product Detail Modal ONLY (No Wishlist, No Search Modal Window) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNavigateView={handleNavigateView}
      />

      {/* Floating Animated WhatsApp Concierge Button */}
      <motion.a
        href="https://wa.me/201016869608?text=Hello%20toomakt%20Atelier!%20I%20have%20an%20inquiry."
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 bg-[#3C1322] hover:bg-[#280A15] text-[#FAF7F2] p-3 sm:px-4 sm:py-2.5 rounded-full shadow-soft-lg flex items-center gap-2 transition-all cursor-pointer group select-none border border-[#FAF7F2]/20"
        title="Chat with toomakt Concierge"
        aria-label="WhatsApp Concierge"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline font-medium text-xs tracking-wider">
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
