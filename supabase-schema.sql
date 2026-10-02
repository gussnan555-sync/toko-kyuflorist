-- KyuFlorist Supabase Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/tlcjmaopbsjblnrtrdxl/sql

-- 1. Create Profiles Table (Linked to Supabase Auth user id)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'User KyuFlorist',
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  address TEXT DEFAULT '',
  district_city TEXT DEFAULT 'Jakarta Selatan, DKI Jakarta',
  postal_code TEXT DEFAULT '12190',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trigger to automatically create a profile row when a user logs in via Email OTP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Create Wishlists Table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  full_address TEXT NOT NULL,
  district_city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  shipping_notes TEXT,
  shipping_method TEXT NOT NULL,
  shipping_cost NUMERIC NOT NULL,
  branch TEXT NOT NULL,
  payment_bank JSONB NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Belum Bayar',
  subtotal NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Menunggu Pembayaran',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Catalog products and payment methods managed from the admin panel
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  category TEXT NOT NULL DEFAULT 'Bouquet',
  image TEXT NOT NULL DEFAULT '',
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  show_colors BOOLEAN NOT NULL DEFAULT TRUE,
  show_sizes BOOLEAN NOT NULL DEFAULT TRUE,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  stock INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC NOT NULL DEFAULT 0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  order_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS show_colors BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS show_sizes BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Flower',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.product_categories (name, icon_name, sort_order)
VALUES
  ('Bouquet', 'Flower', 1),
  ('Box Flower', 'Gift', 2),
  ('Vase Flower', 'Flower', 3),
  ('Wedding', 'HeartHandshake', 4),
  ('Special Event', 'Sparkles', 5)
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  logo TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#64748B',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product image storage. Files are uploaded by admins and publicly readable by customers.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view active product categories" ON public.product_categories;
CREATE POLICY "Anyone can view active product categories"
ON public.product_categories FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can view active payment methods" ON public.payment_methods;
CREATE POLICY "Anyone can view active payment methods" ON public.payment_methods FOR SELECT USING (is_active = true);

-- 6. RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users and Admins can view profiles" ON public.profiles;
CREATE POLICY "Users and Admins can view profiles" 
ON public.profiles FOR SELECT 
USING (
  auth.uid() = id 
  OR EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  OR (SELECT auth.role()) = 'service_role'
);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlists;
CREATE POLICY "Users can manage own wishlist" 
ON public.wishlists FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view and create own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins and users order access" ON public.orders;
CREATE POLICY "Admins and users order access" 
ON public.orders FOR ALL 
USING (
  auth.uid() = user_id 
  OR EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  OR (SELECT auth.role()) = 'service_role'
);

-- 7. Supabase Storage Bucket for Profile Avatars
-- In Supabase Dashboard -> Storage:
-- 1. Create a new public bucket: 'avatars'
-- 2. Set file size limit: 1048576 bytes (1 MB)
-- 3. Allowed MIME types: image/jpeg, image/png, image/webp
