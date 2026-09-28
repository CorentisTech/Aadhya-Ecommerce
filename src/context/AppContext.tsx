"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../data/mockData';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getDeviceId, getDeviceName } from '@/utils/device';

export type PageType = 'home' | 'numismatics' | 'wishlist' | 'checkout' | 'account';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface UserDetails {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  zip: string;
  state: string;
  city: string;
  landmark?: string;
  streetName: string;
  otherPhone?: string;
  avatar: 'male' | 'female';
  role?: string;
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
  
  // Real Auth & Device Scoped states
  user: UserDetails | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  loginUser: (email: string) => void;
  logoutUser: () => Promise<void>;
  registerUser: (details: UserDetails) => void;
  updateUserDetails: (details: Partial<UserDetails>) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

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

  // Supabase Auth & Profile States
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Fetch real device-scoped data from Supabase backend
  const syncServerData = useCallback(async () => {
    try {
      const deviceId = getDeviceId();
      const deviceName = getDeviceName();

      // 1. Register or update device heartbeat
      await fetch('/api/auth/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, deviceName }),
      }).catch(() => null);

      // 2. Fetch authenticated profile
      const profileRes = await fetch('/api/profile').catch(() => null);
      if (profileRes && profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData?.user) {
          setUser(profileData.user);
          setIsLoggedIn(true);
        }
      }

      // 3. Fetch device-scoped cart
      const cartRes = await fetch(`/api/cart?deviceId=${encodeURIComponent(deviceId)}`, {
        headers: { 'x-device-id': deviceId },
      }).catch(() => null);

      if (cartRes && cartRes.ok) {
        const cartData = await cartRes.json();
        if (Array.isArray(cartData?.items)) {
          const mappedCart: CartItem[] = cartData.items.map((item: any) => ({
            product: {
              id: item.product_id,
              productNo: item.product_no || '',
              name: item.name,
              slug: item.slug || item.product_id,
              department: item.department || 'fashion',
              price: Number(item.verifiedPrice || item.base_price || 0),
              mrp: Number(item.base_mrp || item.base_price || 0),
              discount: Number(item.base_discount || 0),
              image: item.image_url || '/images/placeholder.jpg',
              images: item.image_url ? [item.image_url] : ['/images/placeholder.jpg'],
              inStock: true,
              category: 'General',
              description: '',
              fabric: '',
              fabricCare: [],
              sizes: [],
              colors: [],
              rating: 5,
              reviewsCount: 0,
              badge: undefined,
              tags: [],
            } as Product,
            quantity: item.quantity,
            selectedSize: item.selected_size,
            selectedColor: item.selected_color,
          }));
          setCart(mappedCart);
        }
      }

      // 4. Fetch device-scoped wishlist
      const wishRes = await fetch(`/api/wishlist?deviceId=${encodeURIComponent(deviceId)}`, {
        headers: { 'x-device-id': deviceId },
      }).catch(() => null);

      if (wishRes && wishRes.ok) {
        const wishData = await wishRes.json();
        if (Array.isArray(wishData)) {
          const mappedWishlist: Product[] = wishData.map((item: any) => ({
            id: item.product_id || item.id,
            productNo: item.product_no || '',
            name: item.name,
            slug: item.slug || item.id,
            department: item.department || 'fashion',
            price: Number(item.base_price || 0),
            mrp: Number(item.base_mrp || item.base_price || 0),
            discount: Number(item.base_discount || 0),
            image: item.image_url || '/images/placeholder.jpg',
            images: item.image_url ? [item.image_url] : ['/images/placeholder.jpg'],
            inStock: true,
            category: 'General',
            description: '',
            fabric: '',
            fabricCare: [],
            sizes: [],
            colors: [],
            rating: Number(item.avg_rating || 5),
            reviewsCount: Number(item.reviews_count || 0),
            badge: undefined,
            tags: [],
          } as Product));
          setWishlist(mappedWishlist);
        }
      }
    } catch (err) {
      console.error('Failed to sync server data:', err);
    }
  }, []);

  // Initialize Supabase session & listeners
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user) {
          setIsLoggedIn(true);
          await syncServerData();
        } else {
          // Read local guest cart/wishlist for non-authenticated guests
          try {
            const localCart = localStorage.getItem('aadhya_cart');
            if (localCart) setCart(JSON.parse(localCart));
            const localWishlist = localStorage.getItem('aadhya_wishlist');
            if (localWishlist) setWishlist(JSON.parse(localWishlist));
          } catch {
            // ignore JSON error
          }
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth session error:', err);
      } finally {
        if (isMounted) {
          setAuthLoading(false);
          setIsLoaded(true);
        }
      }
    };

    checkSession();

    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          setIsLoggedIn(true);
          await syncServerData();
        }
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUser(null);
        setCart([]);
        setWishlist([]);
        try {
          localStorage.removeItem('aadhya_user');
          localStorage.removeItem('aadhya_cart');
          localStorage.removeItem('aadhya_wishlist');
        } catch {
          // ignore
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [syncServerData]);

  // Persist guest Cart and Wishlist to localStorage when not authenticated
  useEffect(() => {
    if (isLoaded && !isLoggedIn) {
      try {
        localStorage.setItem('aadhya_cart', JSON.stringify(cart));
      } catch {}
    }
  }, [cart, isLoaded, isLoggedIn]);

  useEffect(() => {
    if (isLoaded && !isLoggedIn) {
      try {
        localStorage.setItem('aadhya_wishlist', JSON.stringify(wishlist));
      } catch {}
    }
  }, [wishlist, isLoaded, isLoggedIn]);

  // Synchronize activePage automatically whenever pathname changes
  useEffect(() => {
    if (pathname?.includes('/numismatics')) {
      setPageInternal('numismatics');
    } else if (pathname === '/') {
      setPageInternal('home');
    } else if (pathname?.includes('/wishlist')) {
      setPageInternal('wishlist');
    } else if (pathname?.includes('/checkout')) {
      setPageInternal('checkout');
    } else if (pathname?.includes('/account')) {
      setPageInternal('account');
    }
  }, [pathname]);

  const setPage = (page: PageType) => {
    setPageInternal(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCartOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);

    if (page === 'home') {
      router.push('/');
    } else if (page === 'numismatics') {
      router.push('/numismatics');
    } else if (page === 'wishlist') {
      router.push('/wishlist');
    } else if (page === 'checkout') {
      router.push('/checkout');
    } else if (page === 'account') {
      router.push('/account');
    }
  };

  // Cart Handlers with Backend Sync
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
    setCartOpen(true);

    if (isLoggedIn) {
      const deviceId = getDeviceId();
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-device-id': deviceId },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          size,
          color,
          deviceId,
        }),
      }).catch((err) => console.error('Add to cart API error:', err));
    }
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

    if (isLoggedIn) {
      const deviceId = getDeviceId();
      const params = new URLSearchParams({
        productId,
        deviceId,
        ...(size ? { size } : {}),
        ...(color ? { color } : {}),
      });
      fetch(`/api/cart?${params.toString()}`, {
        method: 'DELETE',
        headers: { 'x-device-id': deviceId },
      }).catch((err) => console.error('Remove from cart API error:', err));
    }
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

    if (isLoggedIn) {
      const deviceId = getDeviceId();
      fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-device-id': deviceId },
        body: JSON.stringify({
          productId,
          quantity,
          size,
          color,
          deviceId,
        }),
      }).catch((err) => console.error('Update cart API error:', err));
    }
  };

  const clearCart = () => {
    setCart([]);
    if (isLoggedIn) {
      const deviceId = getDeviceId();
      fetch(`/api/cart?clearAll=true&deviceId=${encodeURIComponent(deviceId)}`, {
        method: 'DELETE',
        headers: { 'x-device-id': deviceId },
      }).catch((err) => console.error('Clear cart API error:', err));
    }
  };

  // Wishlist Handlers with Backend Sync
  const toggleWishlist = (product: Product) => {
    const currentlyInWishlist = wishlist.some((item) => item.id === product.id);
    
    setWishlist((prevWishlist) => {
      if (currentlyInWishlist) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });

    if (isLoggedIn) {
      const deviceId = getDeviceId();
      if (currentlyInWishlist) {
        fetch(`/api/wishlist?productId=${encodeURIComponent(product.id)}&deviceId=${encodeURIComponent(deviceId)}`, {
          method: 'DELETE',
          headers: { 'x-device-id': deviceId },
        }).catch((err) => console.error('Wishlist delete API error:', err));
      } else {
        fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-device-id': deviceId },
          body: JSON.stringify({
            productId: product.id,
            deviceId,
          }),
        }).catch((err) => console.error('Wishlist add API error:', err));
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Auth Functions
  const loginUser = (email: string) => {
    // Optimistic fallback for backward compatibility
    setUser((prev) => prev || {
      email,
      firstName: email.split('@')[0],
      lastName: '',
      phone: '',
      address: '',
      zip: '',
      state: '',
      city: '',
      streetName: '',
      avatar: 'female',
    });
    setIsLoggedIn(true);
  };

  const logoutUser = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Sign out error:', e);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setCart([]);
      setWishlist([]);
      try {
        localStorage.removeItem('aadhya_user');
        localStorage.removeItem('aadhya_cart');
        localStorage.removeItem('aadhya_wishlist');
      } catch {}
    }
  };

  const registerUser = (details: UserDetails) => {
    setUser(details);
    setIsLoggedIn(true);
  };

  const updateUserDetails = async (details: Partial<UserDetails>) => {
    setUser((prev) => (prev ? { ...prev, ...details } : (details as UserDetails)));
    if (isLoggedIn) {
      try {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(details),
        });
      } catch (err) {
        console.error('Failed to update user profile on server:', err);
      }
    }
  };

  const deleteUserAccount = async () => {
    await logoutUser();
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
        user,
        isLoggedIn,
        authLoading,
        loginUser,
        logoutUser,
        registerUser,
        updateUserDetails,
        deleteUserAccount,
        refreshUserData: syncServerData,
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
