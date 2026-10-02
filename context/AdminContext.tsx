'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { adminSupabase, checkIsAdmin } from '@/lib/admin-supabase';
import { Product, PaymentMethod, ProductCategory } from '@/types';

export interface AdminProfile {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
}

interface AdminContextType {
  adminUser: AdminProfile | null;
  isAdminLoading: boolean;
  isAdmin: boolean;
  adminSignIn: (email: string) => Promise<{ success: boolean; error?: string }>;
  adminVerifyOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  adminSignOut: () => Promise<void>;
  // Data
  allOrders: AdminOrder[];
  allProfiles: AdminCustomer[];
  isDataLoading: boolean;
  fetchAllData: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string, paymentStatus?: string) => Promise<{ success: boolean }>;
  deleteOrder: (orderId: string) => Promise<{ success: boolean }>;
  products: Product[];
  paymentMethods: PaymentMethod[];
  categories: ProductCategory[];
  uploadProductImages: (files: File[]) => Promise<{ success: boolean; error?: string; urls?: string[] }>;
  saveProduct: (product: Omit<Product, 'id'>, id?: string) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;
  savePaymentMethod: (method: Omit<PaymentMethod, 'id'>, id?: string) => Promise<{ success: boolean; error?: string }>;
  deletePaymentMethod: (methodId: string) => Promise<{ success: boolean; error?: string }>;
  saveCategory: (category: Omit<ProductCategory, 'id'>, id?: string) => Promise<{ success: boolean; error?: string }>;
  deleteCategory: (categoryId: string) => Promise<{ success: boolean; error?: string }>;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerEmail: string;
  customerName: string;
  recipientName: string;
  recipientPhone: string;
  fullAddress: string;
  districtCity: string;
  postalCode: string;
  shippingNotes: string;
  shippingMethod: string;
  shippingCost: number;
  branch: string;
  paymentBank: { bankName: string; accountNumber: string; accountHolder: string };
  paymentStatus: string;
  subtotal: number;
  totalAmount: number;
  status: string;
  items: AdminOrderItem[];
  userId: string;
}

export interface AdminOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  colorName: string;
  colorHex: string;
  size: string;
  price: number;
  quantity: number;
  greetingCardText?: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  districtCity: string;
  postalCode: string;
  avatarUrl: string;
  createdAt: string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [adminUser, setAdminUser] = useState<AdminProfile | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
  const [allProfiles, setAllProfiles] = useState<AdminCustomer[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const isAdmin = adminUser !== null;

  const fetchAllData = useCallback(async () => {
    if (!adminSupabase) return;
    setIsDataLoading(true);
    try {
      // Fetch all customer profiles first
      const { data: profilesData } = await adminSupabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const profileMap = new Map<string, AdminCustomer>();
      if (profilesData) {
        const mappedProfiles: AdminCustomer[] = profilesData.map((p) => {
          const cust: AdminCustomer = {
            id: p.id,
            name: p.name,
            email: p.email,
            phone: p.phone ?? '',
            address: p.address ?? '',
            districtCity: p.district_city ?? '',
            postalCode: p.postal_code ?? '',
            avatarUrl: p.avatar_url ?? '',
            createdAt: p.created_at,
          };
          profileMap.set(p.id, cust);
          return cust;
        });
        setAllProfiles(mappedProfiles);
      }

      // Fetch all orders without broken foreign key join
      const { data: ordersData, error: ordersError } = await adminSupabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders from Supabase:', ordersError);
      }

      if (ordersData && ordersData.length > 0) {
        const mapped: AdminOrder[] = ordersData.map((o) => {
          const profile = profileMap.get(o.user_id);
          return {
            id: o.id,
            orderNumber: o.order_number,
            createdAt: o.created_at,
            customerEmail: profile?.email ?? '',
            customerName: profile?.name || o.recipient_name,
            recipientName: o.recipient_name,
            recipientPhone: o.recipient_phone,
            fullAddress: o.full_address,
            districtCity: o.district_city,
            postalCode: o.postal_code,
            shippingNotes: o.shipping_notes ?? '',
            shippingMethod: o.shipping_method,
            shippingCost: Number(o.shipping_cost),
            branch: o.branch,
            paymentBank: o.payment_bank,
            paymentStatus: o.payment_status,
            subtotal: Number(o.subtotal),
            totalAmount: Number(o.total_amount),
            status: o.status,
            items: o.items ?? [],
            userId: o.user_id,
          };
        });
        setAllOrders(mapped);
      } else {
        // Fallback to localStorage orders if Supabase has no orders or during local testing
        try {
          const localOrdersRaw = typeof window !== 'undefined' ? localStorage.getItem('kyu_orders') : null;
          if (localOrdersRaw) {
            const parsed = JSON.parse(localOrdersRaw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const mappedLocal: AdminOrder[] = parsed.map((ord: any) => ({
                id: ord.id,
                orderNumber: ord.orderNumber,
                createdAt: ord.createdAt,
                customerEmail: ord.shippingAddress?.recipientName || 'Customer',
                customerName: ord.shippingAddress?.recipientName || 'Customer',
                recipientName: ord.shippingAddress?.recipientName || '',
                recipientPhone: ord.shippingAddress?.phoneNumber || '',
                fullAddress: ord.shippingAddress?.fullAddress || '',
                districtCity: ord.shippingAddress?.districtCity || ord.branch || '',
                postalCode: ord.shippingAddress?.postalCode || '',
                shippingNotes: ord.shippingAddress?.notes || '',
                shippingMethod: ord.shippingMethod || 'Ambil di Toko',
                shippingCost: Number(ord.shippingCost || 0),
                branch: ord.branch || 'Cabang Buluh Indah (Denpasar)',
                paymentBank: ord.paymentBank || { bankName: 'SEABANK', accountNumber: '', accountHolder: '' },
                paymentStatus: ord.paymentStatus || 'Belum Bayar',
                subtotal: Number(ord.subtotal || 0),
                totalAmount: Number(ord.totalAmount || 0),
                status: ord.status || 'Menunggu Pembayaran',
                items: ord.items || [],
                userId: ord.id,
              }));
              setAllOrders(mappedLocal);
            }
          }
        } catch (e) {
          console.error('Failed reading fallback local orders:', e);
        }
      }

      const { data: productData } = await adminSupabase.from('products').select('*').order('created_at', { ascending: false });
      if (productData) {
        setProducts(productData.map((p): Product => ({
          id: p.id, name: p.name, tagline: p.tagline ?? '', description: p.description ?? '',
          price: Number(p.price), originalPrice: p.original_price == null ? undefined : Number(p.original_price),
          category: p.category, image: p.image ?? '', images: p.images ?? [], colors: p.colors ?? [],
          tags: p.tags ?? [], stock: Number(p.stock ?? 0), rating: Number(p.rating ?? 0),
          reviewsCount: Number(p.reviews_count ?? 0), orderCount: Number(p.order_count ?? 0), viewsCount: Number(p.views_count ?? 0),
          showColors: p.show_colors !== false, showSizes: p.show_sizes !== false,
          isBestSeller: Boolean(p.is_best_seller),
        })));
      }

      const { data: paymentData } = await adminSupabase.from('payment_methods').select('*').order('sort_order', { ascending: true });
      if (paymentData) {
        setPaymentMethods(paymentData.map((p): PaymentMethod => ({
          id: p.id, bankName: p.bank_name, accountNumber: p.account_number, accountHolder: p.account_holder,
          logo: p.logo ?? '', color: p.color ?? '#64748B', isActive: p.is_active, sortOrder: p.sort_order,
        })));
      }

      const { data: categoryData } = await adminSupabase.from('product_categories').select('*').order('sort_order', { ascending: true });
      if (categoryData) {
        setCategories(categoryData.map((c): ProductCategory => ({
          id: c.id, name: c.name, iconName: c.icon_name ?? 'Flower',
          sortOrder: Number(c.sort_order ?? 0), isActive: Boolean(c.is_active),
        })));
      }
    } catch (err) {
      console.error('Admin fetchAllData error:', err);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    if (!adminSupabase) return { success: false };
    const updates: Record<string, string> = { status, updated_at: new Date().toISOString() };
    if (paymentStatus) updates.payment_status = paymentStatus;
    const { error } = await adminSupabase.from('orders').update(updates).eq('id', orderId);
    if (!error) {
      setAllOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status, ...(paymentStatus ? { paymentStatus } : {}) } : o)
      );
      return { success: true };
    }
    return { success: false };
  };

  const deleteOrder = async (orderId: string) => {
    if (!adminSupabase) return { success: false };
    const { error } = await adminSupabase.from('orders').delete().eq('id', orderId);
    if (!error) {
      setAllOrders(prev => prev.filter(o => o.id !== orderId));
      return { success: true };
    }
    return { success: false };
  };

  const uploadProductImages = async (files: File[]) => {
    if (!adminSupabase) return { success: false, error: 'Supabase belum dikonfigurasi' };
    if (files.length > 10) return { success: false, error: 'Maksimal 10 foto per produk.' };
    if (files.some(file => !file.type.startsWith('image/'))) {
      return { success: false, error: 'Semua file harus berupa foto.' };
    }
    if (files.some(file => file.size > 5 * 1024 * 1024)) {
      return { success: false, error: 'Ukuran setiap foto maksimal 5 MB.' };
    }

    const urls: string[] = [];
    for (const [index, file] of files.entries()) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `products/${Date.now()}-${index}-${crypto.randomUUID()}.${extension}`;
      const { error } = await adminSupabase.storage.from('product-images').upload(path, file, { upsert: false });
      if (error) return { success: false, error: `Gagal mengunggah ${file.name}: ${error.message}` };
      const { data } = adminSupabase.storage.from('product-images').getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return { success: true, urls };
  };

  const saveProduct = async (product: Omit<Product, 'id'>, id?: string) => {
    if (!adminSupabase) return { success: false, error: 'Supabase belum dikonfigurasi' };
    const payload = {
      name: product.name, tagline: product.tagline, description: product.description, price: product.price,
      original_price: product.originalPrice ?? null, category: product.category, image: product.image,
      images: product.images, colors: product.colors, tags: product.tags, stock: product.stock,
      show_colors: product.showColors !== false, show_sizes: product.showSizes !== false,
      rating: product.rating, reviews_count: product.reviewsCount, order_count: product.orderCount, views_count: product.viewsCount,
      is_best_seller: product.isBestSeller ?? false,
      updated_at: new Date().toISOString(),
    };
    const result = id
      ? await adminSupabase.from('products').update(payload).eq('id', id).select().single()
      : await adminSupabase.from('products').insert(payload).select().single();
    if (result.error || !result.data) return { success: false, error: result.error?.message ?? 'Gagal menyimpan produk' };
    const saved: Product = { ...product, id: result.data.id };
    setProducts(prev => id ? prev.map(p => p.id === id ? saved : p) : [saved, ...prev]);
    return { success: true };
  };

  const deleteProduct = async (productId: string) => {
    if (!adminSupabase) return { success: false, error: 'Supabase belum dikonfigurasi' };
    const { error } = await adminSupabase.from('products').delete().eq('id', productId);
    if (error) return { success: false, error: error.message };
    setProducts(prev => prev.filter(p => p.id !== productId));
    return { success: true };
  };

  const savePaymentMethod = async (method: Omit<PaymentMethod, 'id'>, id?: string) => {
    if (!adminSupabase) return { success: false, error: 'Supabase belum dikonfigurasi' };
    const payload = {
      bank_name: method.bankName, account_number: method.accountNumber, account_holder: method.accountHolder,
      logo: method.logo, color: method.color, is_active: method.isActive, sort_order: method.sortOrder,
      updated_at: new Date().toISOString(),
    };
    const result = id
      ? await adminSupabase.from('payment_methods').update(payload).eq('id', id).select().single()
      : await adminSupabase.from('payment_methods').insert(payload).select().single();
    if (result.error || !result.data) return { success: false, error: result.error?.message ?? 'Gagal menyimpan metode pembayaran' };
    const saved: PaymentMethod = { ...method, id: result.data.id };
    setPaymentMethods(prev => id ? prev.map(p => p.id === id ? saved : p) : [...prev, saved].sort((a, b) => a.sortOrder - b.sortOrder));
    return { success: true };
  };

  const deletePaymentMethod = async (methodId: string) => {
    if (!adminSupabase) return { success: false, error: 'Supabase belum dikonfigurasi' };
    const { error } = await adminSupabase.from('payment_methods').delete().eq('id', methodId);
    if (error) return { success: false, error: error.message };
    setPaymentMethods(prev => prev.filter(p => p.id !== methodId));
    return { success: true };
  };

  const saveCategory = async (category: Omit<ProductCategory, 'id'>, id?: string) => {
    if (!adminSupabase) return { success: false, error: 'Supabase belum dikonfigurasi' };
    const payload = {
      name: category.name.trim(), icon_name: category.iconName, sort_order: category.sortOrder,
      is_active: category.isActive, updated_at: new Date().toISOString(),
    };
    const result = id
      ? await adminSupabase.from('product_categories').update(payload).eq('id', id).select().single()
      : await adminSupabase.from('product_categories').insert(payload).select().single();
    if (result.error || !result.data) return { success: false, error: result.error?.message ?? 'Gagal menyimpan kategori' };
    const saved: ProductCategory = { ...category, id: result.data.id };
    setCategories(prev => id ? prev.map(item => item.id === id ? saved : item).sort((a, b) => a.sortOrder - b.sortOrder) : [...prev, saved].sort((a, b) => a.sortOrder - b.sortOrder));
    return { success: true };
  };

  const deleteCategory = async (categoryId: string) => {
    if (!adminSupabase) return { success: false, error: 'Supabase belum dikonfigurasi' };
    const { error } = await adminSupabase.from('product_categories').delete().eq('id', categoryId);
    if (error) return { success: false, error: error.message };
    setCategories(prev => prev.filter(category => category.id !== categoryId));
    return { success: true };
  };

  // Auth
  const adminSignIn = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!adminSupabase) return { success: false, error: 'Supabase belum dikonfigurasi' };
    const { error } = await adminSupabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: false }, // Only existing users can login
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const adminVerifyOtp = async (email: string, token: string): Promise<{ success: boolean; error?: string }> => {
    if (!adminSupabase) return { success: false, error: 'Supabase belum dikonfigurasi' };
    const { data, error } = await adminSupabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: 'email',
    });
    if (error || !data.user) return { success: false, error: error?.message ?? 'Verifikasi gagal' };

    // Check if this user is an admin
    const isAdminUser = await checkIsAdmin(data.user.id);
    if (!isAdminUser) {
      await adminSupabase.auth.signOut();
      return { success: false, error: 'Akun ini tidak memiliki akses admin.' };
    }

    // Fetch admin role from admin_users
    const { data: adminData } = await adminSupabase
      .from('admin_users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    const profile: AdminProfile = {
      id: data.user.id,
      email: data.user.email ?? email,
      role: (adminData?.role as 'super_admin' | 'admin') ?? 'admin',
    };
    setAdminUser(profile);
    localStorage.setItem('kyu_admin_user', JSON.stringify(profile));
    await fetchAllData();
    return { success: true };
  };

  const adminSignOut = async () => {
    if (adminSupabase) await adminSupabase.auth.signOut();
    setAdminUser(null);
    setAllOrders([]);
    setAllProfiles([]);
    localStorage.removeItem('kyu_admin_user');
  };

  // On mount: restore session
  useEffect(() => {
    const init = async () => {
      setIsAdminLoading(true);
      if (adminSupabase) {
        const { data: { session } } = await adminSupabase.auth.getSession();
        if (session?.user) {
          const isAdminUser = await checkIsAdmin(session.user.id);
          if (isAdminUser) {
            const { data: adminData } = await adminSupabase
              .from('admin_users')
              .select('role')
              .eq('id', session.user.id)
              .single();
            const profile: AdminProfile = {
              id: session.user.id,
              email: session.user.email ?? '',
              role: (adminData?.role as 'super_admin' | 'admin') ?? 'admin',
            };
            setAdminUser(profile);
            await fetchAllData();
          }
        }
      }
      setIsAdminLoading(false);
    };
    init();
  }, [fetchAllData]);

  return (
    <AdminContext.Provider value={{
      adminUser, isAdminLoading, isAdmin,
      adminSignIn, adminVerifyOtp, adminSignOut,
      allOrders, allProfiles, isDataLoading, fetchAllData,
      updateOrderStatus, deleteOrder,
      products, paymentMethods, categories, uploadProductImages, saveProduct, deleteProduct, savePaymentMethod, deletePaymentMethod,
      saveCategory, deleteCategory,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
};
