import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ToastNotification } from './components/ToastNotification';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { SmoothScroll } from './components/SmoothScroll';
import { BrandIntroExperience } from './components/BrandIntroExperience';
import { HeroSection } from './components/HeroSection';
import { MoodSelectorSection } from './components/MoodSelectorSection';
import { OrbitCarouselSection } from './components/OrbitCarouselSection';
import { CustomBoxBuilderSection } from './components/CustomBoxBuilderSection';
import { BrandMissionSection } from './components/BrandMissionSection';
import { InternetChewingSection } from './components/InternetChewingSection';
import { CompanyIntroSection } from './components/CompanyIntroSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { ProductShowcaseSection } from './components/ProductShowcaseSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { BrandStorySection } from './components/BrandStorySection';
import { ProductLinesSection } from './components/ProductLinesSection';
import { CrowdFavoritesSection } from './components/CrowdFavoritesSection';
import { AnatomySection } from './components/AnatomySection';
import { ReviewsSection } from './components/ReviewsSection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';
import { WishlistModal } from './components/WishlistModal';
import { ShopAllView } from './components/ShopAllView';
import { TrackOrderView } from './components/TrackOrderView';
import { CMSPageView } from './components/CMSPageView';
import { NotFoundPage } from './components/NotFoundPage';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessView } from './components/OrderSuccessView';
import { WholesaleView } from './components/WholesaleView';
import { AdminLoginView } from './components/admin/AdminLoginView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product } from './types';

export const AppContent: React.FC = () => {
  const { toastNotification, dismissToast } = useCart();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('toomakt_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const checkAdminAuth = () => {
    return !!(localStorage.getItem('toomakt_admin_token') || sessionStorage.getItem('toomakt_admin_token'));
  };

  // Synchronize view with URL hash or path (e.g. #admin, #checkout, #shop, /notfound)
  useEffect(() => {
    const handleRoute = () => {
      const rawHash = window.location.hash.replace('#', '');
      const cleanHash = rawHash.startsWith('/') ? rawHash.slice(1) : rawHash;
      const rawPath = window.location.pathname.replace(/^\/|\/$/g, '');
      const route = cleanHash || rawPath;

      const knownViews = [
        'checkout',
        'order-success',
        'wholesale',
        'shop',
        'track',
        'our-story',
        'ingredients',
        'faq',
        'shipping'
      ];

      if (route === 'admin/login') {
        setCurrentView('admin/login');
      } else if (route === 'admin') {
        if (checkAdminAuth()) {
          setCurrentView('admin');
        } else {
          window.location.hash = '#admin/login';
          setCurrentView('admin/login');
        }
      } else if (knownViews.includes(route)) {
        setCurrentView(route);
      } else if (!route || route === 'home') {
        setCurrentView('home');
      } else {
        setCurrentView('404');
      }
    };
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
    };
  }, []);

  const handleNavigateView = (view: string) => {
    if (view === 'admin') {
      if (checkAdminAuth()) {
        setCurrentView('admin');
        window.location.hash = '#admin';
      } else {
        setCurrentView('admin/login');
        window.location.hash = '#admin/login';
      }
    } else {
      setCurrentView(view);
      window.location.hash = view === 'home' ? '' : `#${view}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (id: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      window.location.hash = '';
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
    <div className="min-h-screen bg-[#FAF6F0] text-[#2B170E] flex flex-col font-sans selection:bg-[#C26715] selection:text-white">
      {/* 1. Global Announcement Header Bar (for sub-views) */}
      {currentView !== 'home' && (
        <AnnouncementBar onNavigateView={handleNavigateView} />
      )}

      {/* 2. Brand Sticky Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onNavigateSection={handleNavigateSection}
        onNavigateView={handleNavigateView}
        currentView={currentView}
      />

      {/* 3. Main Dynamic Content Switcher */}
      <main className="flex-1">
        {currentView === 'shop' && (
          <ShopAllView onSelectProduct={(p) => setSelectedProduct(p)} />
        )}

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

        {currentView === 'wholesale' && (
          <WholesaleView onNavigateView={handleNavigateView} />
        )}

        {currentView === 'track' && (
          <TrackOrderView />
        )}

        {['our-story', 'ingredients', 'faq', 'shipping'].includes(currentView) && (
          <CMSPageView
            slug={currentView}
            onBackHome={() => handleNavigateView('home')}
            onNavigateView={handleNavigateView}
          />
        )}

        {currentView === '404' && (
          <NotFoundPage
            onNavigateHome={() => handleNavigateView('home')}
            onNavigateShop={() => handleNavigateView('shop')}
            onNavigateTrack={() => handleNavigateView('track')}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentView === 'home' && (
          <div id="store-content" className="relative">
            {/* 1. Global Announcement Header Bar */}
            <AnnouncementBar onNavigateView={handleNavigateView} />

            {/* 2. Hero Section: Today's Forecast: 100% Chance of Joy (Figma Frame 1) */}
            <HeroSection
              onShopNow={() => handleNavigateView('shop')}
              onExploreFlavors={() => handleNavigateSection('build-a-box')}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onDirectCheckout={() => handleNavigateView('checkout')}
            />

            {/* 3. Choose Your Mood, Not Just Your Flavor (Figma Frame 1 Section 2) */}
            <MoodSelectorSection
              onSelectProduct={(p) => setSelectedProduct(p)}
            />

            {/* 4. The Good Stuff, In Orbit (Figma Frame 1 Section 3) */}
            <OrbitCarouselSection
              onSelectProduct={(p) => setSelectedProduct(p)}
              onExploreCatalog={() => handleNavigateView('shop')}
            />

            {/* 5. Build A Box That Looks Like You (Figma Frame 1 Section 4) */}
            <CustomBoxBuilderSection />

            {/* 6. We Turn Fruit Into Little Weather Systems (Figma Frame 1 Section 5) */}
            <BrandMissionSection onNavigateStory={() => handleNavigateView('our-story')} />

            {/* 7. The Internet Is Chewing (Figma Frame 1 Section 6) */}
            <InternetChewingSection />
          </div>
        )}
      </main>

      {/* 4. Luxury Dark Cacao Footer */}
      <Footer onNavigateView={handleNavigateView} />

      {/* Slide-over Tasting Bag / Cart Drawer */}
      <CartDrawer onNavigateView={handleNavigateView} />

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNavigateView={handleNavigateView}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      {/* Global Toast Notification */}
      <ToastNotification toast={toastNotification} onClose={dismissToast} />

      {/* Floating Animated WhatsApp Concierge Button */}
      <motion.a
        href="https://wa.me/201000000000?text=Hello%20toomakt%20Atelier!%20I%20have%20an%20inquiry."
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20BD5A] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl flex items-center gap-2 transition-all cursor-pointer group select-none border-2 border-white/50 animate-float-gentle"
        title="Chat with toomakt Confectionery Concierge"
        aria-label="WhatsApp Concierge"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline font-bold text-xs">
          WhatsApp Concierge
        </span>
      </motion.a>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <CartProvider>
        <SmoothScroll>
          <AppContent />
        </SmoothScroll>
      </CartProvider>
    </LanguageProvider>
  );
};

export default App;
