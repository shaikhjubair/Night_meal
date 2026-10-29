-- ==============================================================================
-- NIGHTSHIFT EXPRESS - SUPABASE POSTGRESQL SCHEMA
-- On-Demand Late-Night Delivery Platform (10 PM - 4 AM)
-- Built for Next.js App Router with Supabase Auth, RLS, and Realtime WebSockets
-- Currency: Bangladeshi Taka (BDT / TK)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES & ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'admin', 'staff', 'rider', 'store');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('Preparing', 'Ready for pickup', 'On the way', 'Delivered', 'Cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE delivery_status AS ENUM ('offered', 'accepted', 'picked-up', 'delivered');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. PROFILES TABLE (Linked directly to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT 'Night Owl Customer',
  role user_role NOT NULL DEFAULT 'customer',
  preferred_block VARCHAR(2) NOT NULL DEFAULT 'G',
  is_active BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. STORES / VENDORS TABLE
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Food', 'Drinks', 'Pharmacy', 'Groceries', 'Smoking', 'Sports Cravings')),
  description TEXT,
  commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 8.00 CHECK (commission_rate >= 0 AND commission_rate <= 50),
  payout_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (payout_balance >= 0),
  is_open BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(2, 1) NOT NULL DEFAULT 4.9,
  eta_range VARCHAR(30) NOT NULL DEFAULT '20–30 min',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. PRODUCTS / MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Food', 'Drinks', 'Pharmacy', 'Groceries', 'Smoking', 'Sports Cravings')),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0), -- Price in TK (৳)
  stock INTEGER NOT NULL DEFAULT 10 CHECK (stock >= 0),
  eta VARCHAR(30) NOT NULL DEFAULT '20–30 min',
  rating NUMERIC(2, 1) NOT NULL DEFAULT 4.8,
  badge TEXT,
  age_restricted BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- Human-readable format, e.g. 'NS-9060'
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  store_id UUID NOT NULL REFERENCES public.stores(id),
  vendor_name TEXT NOT NULL,
  delivery_block VARCHAR(2) NOT NULL CHECK (delivery_block IN ('A', 'G', 'H', 'I', 'J', 'K', 'L', 'M')),
  status order_status NOT NULL DEFAULT 'Preparing',
  items_summary TEXT NOT NULL,
  
  -- Financial calculations in Bangladeshi Taka (TK / BDT)
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(6, 2) NOT NULL CHECK (delivery_fee IN (50.00, 60.00, 70.00, 80.00)),
  platform_fee_rate NUMERIC(5, 2) NOT NULL DEFAULT 8.00,
  platform_fee_amount NUMERIC(12, 2) NOT NULL CHECK (platform_fee_amount >= 0),
  vendor_payout_amount NUMERIC(12, 2) NOT NULL CHECK (vendor_payout_amount >= 0),
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'BDT',
  
  placed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  eta VARCHAR(30) NOT NULL DEFAULT '20–28 min',
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ORDER ITEMS (LINE ITEMS) TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. DELIVERIES TABLE (Rider Assignments & Live GPS Telemetry)
CREATE TABLE IF NOT EXISTS public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  rider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rider_name TEXT DEFAULT 'Unassigned',
  status delivery_status NOT NULL DEFAULT 'offered',
  rider_pay NUMERIC(10, 2) NOT NULL DEFAULT 150.00 CHECK (rider_pay >= 0),
  
  -- Real-time GPS Telemetry Coordinates for Dhaka Block navigation
  current_latitude DOUBLE PRECISION NOT NULL DEFAULT 23.7925,
  current_longitude DOUBLE PRECISION NOT NULL DEFAULT 90.4078,
  current_speed_kmh NUMERIC(5, 1) NOT NULL DEFAULT 0.0,
  current_bearing INTEGER NOT NULL DEFAULT 45,
  distance_remaining_km NUMERIC(5, 2) NOT NULL DEFAULT 1.80,
  eta_minutes INTEGER NOT NULL DEFAULT 15,
  last_gps_update TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. DELIVERY BLOCK FEE HELPER FUNCTION
CREATE OR REPLACE FUNCTION public.get_block_fee(block_code VARCHAR(2))
RETURNS NUMERIC AS $$
BEGIN
  CASE block_code
    WHEN 'A' THEN RETURN 50.00;
    WHEN 'G' THEN RETURN 50.00;
    WHEN 'H' THEN RETURN 60.00;
    WHEN 'I' THEN RETURN 60.00;
    WHEN 'J' THEN RETURN 70.00;
    WHEN 'K' THEN RETURN 70.00;
    WHEN 'L' THEN RETURN 80.00;
    WHEN 'M' THEN RETURN 80.00;
    ELSE RETURN 50.00;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 10. NIGHT WINDOW CHECK FUNCTION (10 PM to 4 AM Bangladesh Time UTC+6)
CREATE OR REPLACE FUNCTION public.is_night_window_open()
RETURNS BOOLEAN AS $$
DECLARE
  dhaka_hour INTEGER;
BEGIN
  -- Extract hour in Asia/Dhaka time zone
  dhaka_hour := EXTRACT(HOUR FROM timezone('Asia/Dhaka', now()));
  RETURN (dhaka_hour >= 22 OR dhaka_hour < 4);
END;
$$ LANGUAGE plpgsql STABLE;

-- 11. AUTOMATIC PROFILE CREATION ON SUPABASE AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  raw_role user_role := 'customer';
BEGIN
  -- Parse role from user metadata if provided
  IF new.raw_user_meta_data->>'role' IS NOT NULL THEN
    raw_role := (new.raw_user_meta_data->>'role')::user_role;
  END IF;

  INSERT INTO public.profiles (id, phone, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.phone, new.raw_user_meta_data->>'phone', 'Unknown'),
    COALESCE(new.raw_user_meta_data->>'full_name', 'Night Owl User'),
    raw_role
  )
  ON CONFLICT (id) DO UPDATE
  SET phone = EXCLUDED.phone,
      full_name = EXCLUDED.full_name;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 12. AUTOMATIC FINANCIAL CALCULATION TRIGGER ON ORDER INSERT
CREATE OR REPLACE FUNCTION public.calculate_order_financials()
RETURNS TRIGGER AS $$
BEGIN
  -- Verify block fee match
  NEW.delivery_fee := public.get_block_fee(NEW.delivery_block);
  
  -- Calculate platform commission (e.g. 8%) and vendor payout
  NEW.platform_fee_amount := ROUND((NEW.subtotal * (NEW.platform_fee_rate / 100.0)), 2);
  NEW.vendor_payout_amount := NEW.subtotal - NEW.platform_fee_amount;
  NEW.total_amount := NEW.subtotal + NEW.delivery_fee;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calculate_order_financials ON public.orders;
CREATE TRIGGER trg_calculate_order_financials
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.calculate_order_financials();

-- 13. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- 14. ROW LEVEL SECURITY POLICIES

-- PROFILES
CREATE POLICY "Public profiles are readable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- STORES & PRODUCTS
CREATE POLICY "Stores are readable by everyone"
  ON public.stores FOR SELECT USING (true);

CREATE POLICY "Store owners and admins can update stores"
  ON public.stores FOR ALL TO authenticated
  USING (
    owner_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

CREATE POLICY "Products are readable by everyone"
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Store owners and staff can manage products"
  ON public.products FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = products.store_id AND (stores.owner_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')))
    )
  );

-- ORDERS
CREATE POLICY "Customers can read own orders"
  ON public.orders FOR SELECT TO authenticated
  USING (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')) OR
    EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.deliveries WHERE deliveries.order_id = orders.id AND deliveries.rider_id = auth.uid())
  );

CREATE POLICY "Customers can insert orders during night hours"
  ON public.orders FOR INSERT TO authenticated
  WITH CHECK (
    customer_id = auth.uid()
  );

CREATE POLICY "Staff, admins, and vendors can update order status"
  ON public.orders FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')) OR
    EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid())
  );

-- DELIVERIES (GPS Tracking)
CREATE POLICY "Deliveries readable by customer, rider, store, and staff"
  ON public.deliveries FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Riders can update their GPS and delivery status"
  ON public.deliveries FOR UPDATE TO authenticated
  USING (
    rider_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

CREATE POLICY "Staff can insert deliveries"
  ON public.deliveries FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

-- 15. ENABLE REALTIME ON DELIVERIES & ORDERS
-- Add tables to supabase_realtime publication for WebSocket streaming
ALTER PUBLICATION supabase_realtime ADD TABLE public.deliveries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
