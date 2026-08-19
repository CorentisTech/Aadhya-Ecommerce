import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { ProductModal } from '@/components/ui/ProductModal';
import { AccountPage } from '@/components/ui/AccountPage';

export const metadata: Metadata = {
  title: "Aadhya | Indian Women's Fashion & Numismatics",
  description: "Discover Aadhya — contemporary Indian women's fashion and a curated world of coins, currency and numismatic treasures.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-brand-warmWhite text-brand-espresso flex flex-col selection:bg-brand-blush selection:text-brand-espresso">
        <AppProvider>
          {/* Header Navigation */}
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Footer & Newsletter */}
          <Footer />

          {/* Drawers and Overlays */}
          <CartDrawer />
          <SearchOverlay />
          <ProductModal />
          <AccountPage />
        </AppProvider>
      </body>
    </html>
  );
}
