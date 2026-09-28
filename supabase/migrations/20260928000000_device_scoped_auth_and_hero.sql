-- Migration: Device-Scoped Auth, User Devices, Wishlist, Cart & Hero Products
-- Implements Phase 7, 15, 16, 17, 24, 25 of AADHYA Specifications

-- ==============================================================================
-- 1. HERO PRODUCTS SUPPORT
-- ==============================================================================

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_hero BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS hero_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_products_hero 
ON products(department, is_hero, hero_order) 
WHERE is_hero = true;

-- Seed initial hero items for Fashion domain (first 4 active fashion bestsellers)
UPDATE products 
SET is_hero = true, hero_order = 1 
WHERE product_no = 'FP-101' AND department = 'fashion';

UPDATE products 
SET is_hero = true, hero_order = 2 
WHERE product_no = 'FP-102' AND department = 'fashion';

UPDATE products 
SET is_hero = true, hero_order = 3 
WHERE product_no = 'FP-103' AND department = 'fashion';

UPDATE products 
SET is_hero = true, hero_order = 4 
WHERE product_no = 'FP-104' AND department = 'fashion';

-- ==============================================================================
-- 2. USER DEVICES (Device-Specific Identity Registration)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    device_name VARCHAR(100) DEFAULT 'Web Browser',
    user_agent TEXT,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_devices_user_device_key UNIQUE (user_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_user_devices_user ON user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_device ON user_devices(device_id);

ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own devices" ON user_devices;
CREATE POLICY "Users can manage own devices" ON user_devices 
    FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- 3. WISHLISTS (Device Scoped + Variant Support)
-- ==============================================================================

ALTER TABLE wishlists ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE wishlists ADD COLUMN IF NOT EXISTS device_id VARCHAR(100);
ALTER TABLE wishlists ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE;

UPDATE wishlists SET device_id = 'default_device' WHERE device_id IS NULL;
ALTER TABLE wishlists ALTER COLUMN device_id SET NOT NULL;

-- Ensure primary key is id
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'wishlists' AND constraint_type = 'PRIMARY KEY' AND constraint_name = 'wishlists_pkey'
    ) THEN
        ALTER TABLE wishlists DROP CONSTRAINT wishlists_pkey;
    END IF;
END $$;

ALTER TABLE wishlists ADD PRIMARY KEY (id);

-- Add unique constraint for (user_id, device_id, product_id, variant_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'wishlists' AND constraint_name = 'wishlists_user_device_product_variant_key'
    ) THEN
        ALTER TABLE wishlists ADD CONSTRAINT wishlists_user_device_product_variant_key 
        UNIQUE NULLS NOT DISTINCT (user_id, device_id, product_id, variant_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_wishlists_user_device ON wishlists(user_id, device_id);

-- RLS for wishlists
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlists;
CREATE POLICY "Users can manage own wishlist" ON wishlists 
    FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. CARTS (Device Scoped)
-- ==============================================================================

ALTER TABLE carts ADD COLUMN IF NOT EXISTS device_id VARCHAR(100);
UPDATE carts SET device_id = 'default_device' WHERE device_id IS NULL;
ALTER TABLE carts ALTER COLUMN device_id SET NOT NULL;

-- Drop old single-user unique constraint if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'carts' AND constraint_name = 'carts_user_id_key'
    ) THEN
        ALTER TABLE carts DROP CONSTRAINT carts_user_id_key;
    END IF;
END $$;

-- Add user + device constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'carts' AND constraint_name = 'carts_user_device_key'
    ) THEN
        ALTER TABLE carts ADD CONSTRAINT carts_user_device_key UNIQUE (user_id, device_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_carts_user_device ON carts(user_id, device_id);

-- RLS for carts & cart_items
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own cart" ON carts;
CREATE POLICY "Users can manage own cart" ON carts 
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own cart items" ON cart_items;
CREATE POLICY "Users can manage own cart items" ON cart_items 
    FOR ALL USING (
        cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
    );

-- ==============================================================================
-- 5. ADDRESSES & ORDERS RLS VERIFICATION
-- ==============================================================================

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own addresses" ON addresses;
CREATE POLICY "Users can manage own addresses" ON addresses 
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders 
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items 
    FOR ALL USING (
        order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
    );
