-- Migration: Initial Schema for AADHYA Ecommerce
-- Generated based on Frontend Data Model Audit

-- ==============================================================================
-- PHASE 1: ENUMS & CUSTOM TYPES
-- ==============================================================================

CREATE TYPE department_type AS ENUM ('fashion', 'numismatics');
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE payment_method AS ENUM ('CARD', 'UPI', 'NET_BANKING', 'COD');

-- ==============================================================================
-- PHASE 2: USER PROFILES & ROLES
-- ==============================================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar VARCHAR(10) CHECK (avatar IN ('male', 'female')),
    role user_role DEFAULT 'customer'::user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    full_name VARCHAR(200),
    email VARCHAR(255),
    street_name VARCHAR(255),
    address_line1 VARCHAR(255),
    landmark VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    alt_phone VARCHAR(20),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- PHASE 3: CATALOG - SHARED BASE
-- ==============================================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    visual_type VARCHAR(50),
    visual_color VARCHAR(30),
    image_url TEXT,
    department department_type NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_no VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    department department_type NOT NULL,
    description TEXT,
    visual_type VARCHAR(50),
    visual_color VARCHAR(30),
    visual_pattern VARCHAR(50),
    
    -- Shared Pricing & Editorial
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    base_mrp DECIMAL(10,2) NOT NULL CHECK (base_mrp >= base_price),
    base_discount SMALLINT DEFAULT 0 CHECK (base_discount >= 0 AND base_discount <= 100),
    
    is_bestseller BOOLEAN DEFAULT false,
    avg_rating DECIMAL(2,1) DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    return_policy TEXT,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Variants (for handling colors/sizes/SKUs)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    
    -- Variant specific pricing (overrides base if set)
    price DECIMAL(10,2) CHECK (price >= 0),
    mrp DECIMAL(10,2) CHECK (mrp >= price OR mrp IS NULL),
    discount SMALLINT CHECK (discount >= 0 AND discount <= 100),
    
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media
CREATE TABLE product_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE, -- Optional, if tied to specific color/variant
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) DEFAULT 'image',
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    color_name VARCHAR(50), -- Used to map imagesByColor
    color_hex VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- PHASE 4: DOMAIN-SPECIFIC PRODUCT TABLES
-- ==============================================================================

-- Fashion
CREATE TABLE fashion_product_details (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    fabric VARCHAR(100),
    pattern VARCHAR(50),
    neck_type VARCHAR(50),
    sleeves VARCHAR(50),
    occasion VARCHAR(100),
    length VARCHAR(50),
    pack_of VARCHAR(20),
    fit VARCHAR(50),
    model_info TEXT,
    return_time VARCHAR(50),
    fabric_care TEXT[],
    details TEXT[]
);

-- Fashion variant details (color/size specific)
CREATE TABLE fashion_variant_details (
    variant_id UUID PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
    color VARCHAR(50),
    color_hex VARCHAR(30),
    size VARCHAR(20)
);

-- Fashion Size Guide
CREATE TABLE product_size_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(20) NOT NULL,
    bust VARCHAR(20),
    waist VARCHAR(20),
    hip VARCHAR(20),
    length VARCHAR(20)
);

-- Numismatics
CREATE TABLE numismatic_product_details (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    rarity VARCHAR(50),
    era VARCHAR(100),
    year VARCHAR(50),
    denomination VARCHAR(100),
    material VARCHAR(100),
    weight VARCHAR(50),
    condition VARCHAR(50),
    mint VARCHAR(100),
    shipping_charges VARCHAR(50),
    collection_label VARCHAR(100)
);

-- Constraint functions to ensure domain separation
CREATE OR REPLACE FUNCTION check_fashion_domain() RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT department FROM products WHERE id = NEW.product_id) != 'fashion' THEN
        RAISE EXCEPTION 'Product must be in fashion department';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_fashion_domain
BEFORE INSERT OR UPDATE ON fashion_product_details
FOR EACH ROW EXECUTE FUNCTION check_fashion_domain();

CREATE OR REPLACE FUNCTION check_numismatic_domain() RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT department FROM products WHERE id = NEW.product_id) != 'numismatics' THEN
        RAISE EXCEPTION 'Product must be in numismatics department';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_numismatic_domain
BEFORE INSERT OR UPDATE ON numismatic_product_details
FOR EACH ROW EXECUTE FUNCTION check_numismatic_domain();

-- ==============================================================================
-- PHASE 5: CART & WISHLIST
-- ==============================================================================

CREATE TABLE wishlists (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    selected_size VARCHAR(20),
    selected_color VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cart_id, product_id, variant_id, selected_size, selected_color)
);

-- ==============================================================================
-- PHASE 6: ORDERS & REVIEWS
-- ==============================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    shipping_address_id UUID REFERENCES addresses(id) ON DELETE RESTRICT,
    status order_status DEFAULT 'PENDING'::order_status,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    promo_code VARCHAR(50),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method,
    payment_status payment_status DEFAULT 'PENDING'::payment_status,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL, -- Frozen at purchase time
    selected_size VARCHAR(20),
    selected_color VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- PHASE 7: AUTOMATIC TIMESTAMPS
-- ==============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==============================================================================
-- PHASE 8: INDEXES (Performance)
-- ==============================================================================

CREATE INDEX idx_products_department ON products(department);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_categories_department ON categories(department);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id) WHERE is_approved = true;

-- ==============================================================================
-- PHASE 9: ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Products/Categories (Public Read, Admin Write)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE fashion_product_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE numismatic_product_details ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Addresses: Users can CRUD own addresses
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);

-- Wishlist: Users can CRUD own wishlist
CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- Cart: Users can CRUD own cart
CREATE POLICY "Users can manage own cart" ON carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
);

-- Orders: Users can read own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);
-- Note: Order creation is typically done via a secure server-side API (Service Role) 
-- to prevent users from manipulating pricing or order details directly via frontend RPC.

-- Reviews: Public can read approved, Users can manage own
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view all own reviews" ON reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Products/Catalog: Public can read active
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view product media" ON product_media FOR SELECT USING (true);
CREATE POLICY "Public can view fashion details" ON fashion_product_details FOR SELECT USING (true);
CREATE POLICY "Public can view numismatic details" ON numismatic_product_details FOR SELECT USING (true);

-- Admin Access: Using a helper function to bypass RLS for admins
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin ALL policies to every table
CREATE POLICY "Admins have full access" ON profiles FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access" ON products FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access" ON product_variants FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access" ON product_media FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access" ON fashion_product_details FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access" ON numismatic_product_details FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access" ON orders FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access" ON order_items FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access" ON reviews FOR ALL USING (is_admin());

-- ==============================================================================
-- PHASE 10: INVENTORY FUNCTIONS
-- ==============================================================================

-- Function to safely reserve stock when an order is created
CREATE OR REPLACE FUNCTION reserve_stock(p_variant_id UUID, p_quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    SELECT stock_quantity INTO current_stock 
    FROM product_variants 
    WHERE id = p_variant_id FOR UPDATE;
    
    IF current_stock >= p_quantity THEN
        UPDATE product_variants 
        SET stock_quantity = stock_quantity - p_quantity 
        WHERE id = p_variant_id;
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
