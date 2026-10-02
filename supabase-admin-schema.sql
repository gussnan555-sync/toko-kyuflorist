-- Admin Users Table
-- Run this SQL in your Supabase SQL Editor after the main schema

-- 1. Create admin_users table (stores authorized admin email UIDs)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Only admin_users can read their own row (self-check)
DROP POLICY IF EXISTS "Admin users can read own row" ON public.admin_users;
CREATE POLICY "Admin users can read own row"
ON public.admin_users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all product categories" ON public.product_categories;
CREATE POLICY "Admins can view all product categories"
ON public.product_categories FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can insert product categories" ON public.product_categories;
CREATE POLICY "Admins can insert product categories"
ON public.product_categories FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can update product categories" ON public.product_categories;
CREATE POLICY "Admins can update product categories"
ON public.product_categories FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can delete product categories" ON public.product_categories;
CREATE POLICY "Admins can delete product categories"
ON public.product_categories FOR DELETE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- 4. Allow admins to manage the catalog and view inactive payment methods
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can view all payment methods" ON public.payment_methods;
CREATE POLICY "Admins can view all payment methods" ON public.payment_methods FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage payment methods" ON public.payment_methods;
CREATE POLICY "Admins can manage payment methods" ON public.payment_methods FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "Admins can update payment methods" ON public.payment_methods;
CREATE POLICY "Admins can update payment methods" ON public.payment_methods FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete payment methods" ON public.payment_methods;
CREATE POLICY "Admins can delete payment methods" ON public.payment_methods FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- 5. Allow admins to read ALL orders (admin override policy)
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- 6. Allow admins to update ALL orders (status changes, etc.)
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders"
ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- 7. Allow admins to read ALL profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- 8. Allow admins to update ALL profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- 9. HOW TO ADD YOUR FIRST ADMIN:
-- After you login via OTP on the customer site with your admin email,
-- copy your user UUID from auth.users and run:
-- INSERT INTO public.admin_users (id, email, role)
-- VALUES ('<your-user-uuid>', 'youremail@example.com', 'super_admin');
