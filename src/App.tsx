import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { Marquee } from './components/home/Marquee';
import { Categories } from './components/home/Categories';
import { NewArrivals } from './components/home/NewArrivals';
import { AadhyaEdit } from './components/home/AadhyaEdit';
import { NumismaticsPromo } from './components/home/NumismaticsPromo';
import { Reviews } from './components/home/Reviews';
import { Footer } from './components/layout/Footer';
import { SearchOverlay } from './components/layout/SearchOverlay';
import { CartDrawer } from './components/layout/CartDrawer';
import { ProductModal } from './components/ui/ProductModal';
import { AccountPage } from './components/ui/AccountPage';
import { NumismaticsHome } from './components/numismatics/NumismaticsHome';
import { WishlistPage } from './components/ui/WishlistPage';
import { CheckoutPage } from './components/ui/CheckoutPage';
import { motion, AnimatePresence } from 'framer-motion';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return (
          <motion.div
            key="fashion-home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full"
          >
            {/* Hierarchy matching prompt guidelines:
                1. Header (Common Navbar)
                2. Hero Bestseller Showcase
                3. Animated Accent Marquee
                4. Shop by Category
                5. New Arrivals
                6. Curated featuredProducts (The Aadhya Edit)
                7. Numismatics Promotional Banner
                8. Curved Reviews Carousel
                9. Newsletter & Creative Footer (Footer wraps both) */}
            <Hero />
            <Marquee />
            <Categories />
            <NewArrivals />
            <AadhyaEdit />
            <NumismaticsPromo />
            <Reviews />
          </motion.div>
        );
      case 'numismatics':
        return (
          <motion.div
            key="numismatics-store"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full"
          >
            <NumismaticsHome />
          </motion.div>
        );
      case 'wishlist':
        return (
          <motion.div
            key="wishlist-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full"
          >
            <WishlistPage />
          </motion.div>
        );
      case 'checkout':
        return (
          <motion.div
            key="checkout-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full"
          >
            <CheckoutPage />
          </motion.div>
        );
      default:
        return (
          <div className="py-20 text-center text-brand-warmGray text-xs font-bold tracking-widest">
            PAGE UNDER CONSTRUCTION
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Shared Desktop & Mobile Nav Header */}
      <Navbar />

      {/* Pages Container with AnimatePresence Page Transition */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderActivePage()}
        </AnimatePresence>
      </main>

      {/* Shared Footer & Newsletter Panel */}
      <Footer />

      {/* Shared Slide-outs and Overlay Modals */}
      <SearchOverlay />
      <CartDrawer />
      <ProductModal />
      <AccountPage />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
