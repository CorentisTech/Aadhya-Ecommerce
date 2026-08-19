"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/mockData';

export type PageType = 'home' | 'numismatics' | 'wishlist' | 'checkout' | 'account';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface AppContextType {
  activePage: PageType;
  setPage: (page: PageType) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setAccountOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activePage, setPageInternal] = useState<PageType>('home');

  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // UI Drawer / Modal States
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isAccountOpen, setAccountOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const localCart = localStorage.getItem('aadhya_cart');
    if (localCart) setCart(JSON.parse(localCart));
    const localWishlist = localStorage.getItem('aadhya_wishlist');
    if (localWishlist) setWishlist(JSON.parse(localWishlist));
    setIsLoaded(true);
  }, []);

  // Persist State
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('aadhya_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('aadhya_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  // Smooth scroll to top on page change
  const setPage = (page: PageType) => {
    setPageInternal(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCartOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  };

  // Cart Handlers
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCart((prevCart) => {
      const matchIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (matchIndex > -1) {
        const newCart = [...prevCart];
        newCart[matchIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { product, quantity, selectedSize: size, selectedColor: color }];
    });
    setCartOpen(true); // Proactively slide open cart drawer
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        ) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Handlers
  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setPage,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setCartOpen,
        isSearchOpen,
        setSearchOpen,
        isAccountOpen,
        setAccountOpen,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
