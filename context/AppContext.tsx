'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, CartItem, Order, UserProfile, FlowerColor, FlowerSize, PaymentMethod, ProductCategory } from '@/types';
import { getPopularBouquets } from '@/lib/data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  // User & Auth
  user: UserProfile | null;
  isGuest: boolean;
  isLoadingAuth: boolean;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUserProfile: (updated: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; error?: string; url?: string }>;

  // Products
  products: Product[];
  popularProducts: Product[];
  paymentMethods: PaymentMethod[];
  categories: ProductCategory[];

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Cart
  cart: CartItem[];
  addToCart: (item: {
    product: Product;
    color: FlowerColor;
    size?: FlowerSize;
    greetingCardText: string;
    quantity?: number;
  }) => boolean;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Promise<Order | null>;
  cancelOrder: (orderId: string) => void;

  // Navigation & Modals
  activeTab: 'home' | 'wishlist' | 'cart' | 'orders' | 'profile';
  setActiveTab: (tab: 'home' | 'wishlist' | 'cart' | 'orders' | 'profile') => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;

  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;

  // Toasts
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  isSupabaseOnline: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  USER: 'kyu_florist_auth_user',
  WISHLIST: 'kyu_florist_wishlist',
  CART: 'kyu_florist_cart',
  ORDERS: 'kyu_florist_orders',
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [activeTab, setActiveTab] = useState<'home' | 'wishlist' | 'cart' | 'orders' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('Masuk untuk melanjutkan');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [isSupabaseOnline] = useState<boolean>(isSupabaseConfigured);

  const isGuest = user === null;

  const fetchCatalog = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) return;

    const [{ data: productRows, error: productError }, { data: paymentRows, error: paymentError }, { data: categoryRows, error: categoryError }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('payment_methods').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      supabase.from('product_categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    ]);

    if (!productError && productRows) {
      setProducts(productRows.map((row) => ({
        id: row.id,
        name: row.name,
        tagline: row.tagline ?? '',
        description: row.description ?? '',
        price: Number(row.price),
        originalPrice: row.original_price == null ? undefined : Number(row.original_price),
        category: row.category,
        image: row.image ?? '',
        images: row.images ?? [],
        colors: row.colors ?? [],
        showColors: row.show_colors !== false,
        showSizes: row.show_sizes !== false,
        tags: row.tags ?? [],
        stock: Number(row.stock ?? 0),
        rating: Number(row.rating ?? 0),
        reviewsCount: Number(row.reviews_count ?? 0),
        orderCount: Number(row.order_count ?? 0),
        viewsCount: Number(row.views_count ?? 0),
        isBestSeller: Boolean(row.is_best_seller),
      })));
    }
    if (!paymentError && paymentRows) {
      setPaymentMethods(paymentRows.map((row) => ({
        id: row.id,
        bankName: row.bank_name,
        accountNumber: row.account_number,
        accountHolder: row.account_holder,
        logo: row.logo ?? '',
        color: row.color ?? '#64748B',
        isActive: row.is_active,
        sortOrder: row.sort_order,
      })));
    }
    if (!categoryError && categoryRows) {
      setCategories(categoryRows.map((row): ProductCategory => ({
        id: row.id, name: row.name, iconName: row.icon_name ?? 'Flower',
        sortOrder: Number(row.sort_order ?? 0), isActive: Boolean(row.is_active),
      })));
    }
  }, []);

  // Toast System
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openAuthModal = (reason: string = 'Masuk untuk mengakses fitur ini') => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Fetch or sync user profile from Supabase Database
  const fetchUserProfileFromSupabase = useCallback(async (userId: string, email: string) => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data && !error) {
        const loadedUser: UserProfile = {
          id: data.id,
          name: data.name || email.split('@')[0],
          email: data.email || email,
          phone: data.phone || '',
          avatarUrl: data.avatar_url || '',
          address: data.address || '',
          districtCity: data.district_city || 'Denpasar Utara, Kota Denpasar, Bali',
          postalCode: data.postal_code || '80115',
        };
        setUser(loadedUser);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(loadedUser));
        return loadedUser;
      } else {
        // Create initial profile row
        const initialProfile: UserProfile = {
          id: userId,
          name: email.split('@')[0],
          email: email,
          phone: '',
          avatarUrl: '',
          address: '',
          districtCity: 'Denpasar Utara, Kota Denpasar, Bali',
          postalCode: '80115',
        };
        await supabase.from('profiles').upsert({
          id: userId,
          email: email,
          name: initialProfile.name,
        });
        setUser(initialProfile);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(initialProfile));
        return initialProfile;
      }
    } catch (e) {
      console.error('Error fetching profile from Supabase:', e);
      return null;
    }
  }, []);

  // Fetch user Wishlist & Orders from Supabase
  const syncUserData = useCallback(async (userId: string) => {
    if (!supabase) return;
    try {
      // Wishlists
      const { data: wishData } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', userId);
      if (wishData) {
        const pids = wishData.map((w: { product_id: string }) => w.product_id);
        setWishlist(pids);
        localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(pids));
      }

      // Orders
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (orderData && orderData.length > 0) {
        const formattedOrders: Order[] = orderData.map((o) => ({
          id: o.id,
          orderNumber: o.order_number,
          createdAt: o.created_at,
          items: o.items,
          shippingAddress: {
            recipientName: o.recipient_name,
            phoneNumber: o.recipient_phone,
            fullAddress: o.full_address,
            districtCity: o.district_city,
            postalCode: o.postal_code,
            notes: o.shipping_notes,
          },
          shippingMethod: o.shipping_method,
          shippingCost: Number(o.shipping_cost),
          branch: o.branch,
          paymentBank: o.payment_bank,
          paymentStatus: o.payment_status,
          subtotal: Number(o.subtotal),
          totalAmount: Number(o.total_amount),
          status: o.status,
          estimatedDelivery: o.shipping_method === 'Same Day' ? 'Hari ini' : '1-2 Hari',
        }));
        setOrders(formattedOrders);
        localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(formattedOrders));
      }
    } catch (e) {
      console.error('Error syncing user data:', e);
    }
  }, []);

  // Supabase Auth listener & Initial Auth check
  useEffect(() => {
    fetchCatalog();
    const initAuth = async () => {
      setIsLoadingAuth(true);
      if (supabase && isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await fetchUserProfileFromSupabase(session.user.id, session.user.email || '');
            await syncUserData(session.user.id);
          } else {
            // Check local fallback
            const localUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
            if (localUser) {
              setUser(JSON.parse(localUser));
            } else {
              setUser(null);
            }
          }
        } catch (err) {
          console.error('Supabase getSession error', err);
        }
      } else {
        const localUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
        if (localUser) {
          setUser(JSON.parse(localUser));
        } else {
          setUser(null);
        }
      }
      setIsLoadingAuth(false);
    };

    initAuth();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await fetchUserProfileFromSupabase(session.user.id, session.user.email || '');
          await syncUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setWishlist([]);
          setCart([]);
          setOrders([]);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.WISHLIST);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.CART);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.ORDERS);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [fetchCatalog, fetchUserProfileFromSupabase, syncUserData]);

  // Send Email OTP
  const sendEmailOtp = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes('@')) {
      const err = 'Masukkan alamat email yang valid.';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    if (!supabase || !isSupabaseConfigured) {
      const err = 'Supabase belum terkonfigurasi. Cek .env.local';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        showToast(error.message, 'error');
        return { success: false, error: error.message };
      }

      showToast('Kode OTP 6-digit telah dikirim ke email Anda ✉️', 'success');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengirim OTP';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Verify Email OTP
  const verifyEmailOtp = async (email: string, token: string): Promise<{ success: boolean; error?: string }> => {
    if (!token || token.length < 6) {
      const err = 'Kode OTP harus 6 digit angka.';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    if (!supabase || !isSupabaseConfigured) {
      const err = 'Supabase belum terkonfigurasi.';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type: 'email',
      });

      if (error || !data.user) {
        const msg = error ? error.message : 'Verifikasi OTP gagal.';
        showToast(msg, 'error');
        return { success: false, error: msg };
      }

      const profile = await fetchUserProfileFromSupabase(data.user.id, data.user.email || email);
      if (profile) {
        await syncUserData(data.user.id);
      }

      showToast('Login berhasil! Selamat datang di KyuFlorist 🌸', 'success');
      closeAuthModal();
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal verifikasi OTP';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Sign Out
  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setWishlist([]);
    setCart([]);
    setOrders([]);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.WISHLIST);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CART);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ORDERS);
    showToast('Berhasil keluar (Mode Tamu Aktif)', 'info');
    setActiveTab('home');
  };

  // User Profile CRUD
  const updateUserProfile = async (updated: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      openAuthModal('Masuk untuk menyimpan profil');
      return { success: false, error: 'Silakan login terlebih dahulu' };
    }

    try {
      const newUser = { ...user, ...updated };
      setUser(newUser);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(newUser));

      if (supabase && isSupabaseConfigured) {
        await supabase.from('profiles').upsert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          avatar_url: newUser.avatarUrl,
          address: newUser.address,
          district_city: newUser.districtCity,
          postal_code: newUser.postalCode,
          updated_at: new Date().toISOString(),
        });
      }

      showToast('Profil berhasil diperbarui ✨', 'success');
      return { success: true };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Gagal memperbarui profil';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Upload Avatar with Max 1MB Validation
  const uploadAvatar = async (file: File): Promise<{ success: boolean; error?: string; url?: string }> => {
    if (!user) {
      openAuthModal('Masuk untuk mengganti foto profil');
      return { success: false, error: 'Silakan login terlebih dahulu' };
    }

    const MAX_SIZE = 1 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const errMsg = 'Ukuran foto maksimal 1MB. Ukuran file saat ini: ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }

    if (!file.type.startsWith('image/')) {
      const errMsg = 'File harus berformat gambar (JPG, PNG, WEBP).';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Url = reader.result as string;
        await updateUserProfile({ avatarUrl: base64Url });
        showToast('Foto profil berhasil diubah! 📸', 'success');
        resolve({ success: true, url: base64Url });
      };
      reader.onerror = () => {
        showToast('Gagal memproses file foto', 'error');
        resolve({ success: false, error: 'Gagal memproses file' });
      };
      reader.readAsDataURL(file);
    });
  };

  // Wishlist Functions (Guest Protected)
  const toggleWishlist = async (productId: string) => {
    if (isGuest) {
      openAuthModal('Masuk untuk menyimpan buket ke Wishlist Favorit ❤️');
      return;
    }

    const exists = wishlist.includes(productId);
    const updated = exists ? wishlist.filter(id => id !== productId) : [...wishlist, productId];
    setWishlist(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(updated));

    if (exists) {
      showToast('Dihapus dari Wishlist 💔', 'info');
    } else {
      showToast('Ditambahkan ke Wishlist favorit! 💖', 'success');
    }

    if (supabase && isSupabaseConfigured && user) {
      try {
        if (exists) {
          await supabase.from('wishlists').delete().match({ user_id: user.id, product_id: productId });
        } else {
          await supabase.from('wishlists').upsert({ user_id: user.id, product_id: productId });
        }
      } catch (err) {
        console.error('Wishlist sync error:', err);
      }
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart Functions (Guest Protected)
  const addToCart = ({
    product,
    color,
    size,
    greetingCardText,
    quantity = 1,
  }: {
    product: Product;
    color: FlowerColor;
    size?: FlowerSize;
    greetingCardText: string;
    quantity?: number;
  }): boolean => {
    if (isGuest) {
      openAuthModal('Masuk untuk menambahkan buket ke Keranjang Belanja 🛍️');
      return false;
    }

    const finalPrice = color.price || product.price;
    const cleanGreeting = greetingCardText.slice(0, 100);

    const cartItemId = `cart_${product.id}_${color.name}_${cleanGreeting ? btoa(encodeURIComponent(cleanGreeting)).substring(0, 10) : 'none'}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === cartItemId);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          color,
          size,
          sizeMultiplier: 1,
          finalPrice,
          greetingCardText: cleanGreeting,
          quantity,
          addedAt: new Date().toISOString(),
        };
        updated = [newItem, ...prev];
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(updated));
      return updated;
    });

    showToast(`"${product.name}" berhasil masuk ke keranjang! 🛍️`, 'success');
    return true;
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      const updated = prev
        .map(item => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== cartItemId);
      localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(updated));
      return updated;
    });
    showToast('Produk dihapus dari keranjang', 'info');
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CART);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders Functions (Guest Protected)
  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<Order | null> => {
    if (isGuest || !user) {
      openAuthModal('Masuk untuk menyelesaikan pesanan');
      return null;
    }

    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const orderUuid =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });

    const newOrder: Order = {
      ...orderData,
      id: orderUuid,
      orderNumber: `KYU-${randomCode}`,
      createdAt: new Date().toISOString(),
      status: 'Menunggu Pembayaran',
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    });
    clearCart();

    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('orders').insert({
          id: newOrder.id,
          order_number: newOrder.orderNumber,
          user_id: user.id,
          recipient_name: newOrder.shippingAddress.recipientName,
          recipient_phone: newOrder.shippingAddress.phoneNumber,
          full_address: newOrder.shippingAddress.fullAddress,
          district_city: newOrder.shippingAddress.districtCity,
          postal_code: newOrder.shippingAddress.postalCode,
          shipping_notes: newOrder.shippingAddress.notes || '',
          shipping_method: newOrder.shippingMethod,
          shipping_cost: newOrder.shippingCost,
          branch: newOrder.branch,
          payment_bank: newOrder.paymentBank,
          payment_status: newOrder.paymentStatus,
          subtotal: newOrder.subtotal,
          total_amount: newOrder.totalAmount,
          status: newOrder.status,
          items: newOrder.items,
        });

        if (error) {
          console.error('Supabase order insert error:', error);
        }
      } catch (err) {
        console.error('Error saving order to Supabase:', err);
      }
    }

    return newOrder;
  };

  const cancelOrder = async (orderId: string) => {
    setOrders(prev => {
      const updated = prev.map(ord => (ord.id === orderId ? { ...ord, status: 'Dibatalkan' as const } : ord));
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    });

    if (supabase && isSupabaseConfigured) {
      await supabase.from('orders').update({ status: 'Dibatalkan' }).eq('id', orderId);
    }
    showToast('Pesanan dibatalkan', 'info');
  };

  const openProductModal = (product: Product) => setSelectedProduct(product);
  const closeProductModal = () => setSelectedProduct(null);

  const openCheckout = () => {
    if (isGuest) {
      openAuthModal('Masuk untuk melanjutkan ke pembayaran checkout');
      return;
    }
    if (cart.length === 0) {
      showToast('Keranjang Anda masih kosong 🛒', 'info');
      return;
    }
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const popularProducts = getPopularBouquets(products);

  return (
    <AppContext.Provider
      value={{
        user,
        isGuest,
        isLoadingAuth,
        sendEmailOtp,
        verifyEmailOtp,
        signOut,
        updateUserProfile,
        uploadAvatar,
        products,
        popularProducts,
        paymentMethods,
        categories,
        wishlist,
        toggleWishlist,
        isInWishlist,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemsCount,
        orders,
        createOrder,
        cancelOrder,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        openProductModal,
        closeProductModal,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        toasts,
        showToast,
        removeToast,
        isSupabaseOnline,
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
