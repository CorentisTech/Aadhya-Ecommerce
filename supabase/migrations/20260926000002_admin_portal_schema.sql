-- Migration: Admin Portal Extended Schema
-- Website Settings, Banners, Offers, Support Tickets, Audit Logs, and Order Shipping Tracking

-- 1. Enhance Orders with shipping/tracking and lifecycle details
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS courier VARCHAR(100),
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;

-- 2. Website Settings (CMS)
CREATE TABLE IF NOT EXISTS website_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    brand_name VARCHAR(100) DEFAULT 'AADHYA',
    logo_url TEXT,
    contact_email VARCHAR(255) DEFAULT 'contact@aadhya.co',
    contact_phone VARCHAR(50) DEFAULT '+91 98765 43210',
    contact_address TEXT DEFAULT '123 Heritage Boulevard, Luxury Avenue, Mumbai, India',
    privacy_policy TEXT DEFAULT 'At AADHYA, we value your privacy and are committed to protecting your personal data...',
    refund_policy TEXT DEFAULT 'We offer a seamless 7-day return and exchange policy on eligible fashion and numismatic purchases...',
    terms_conditions TEXT DEFAULT 'Welcome to AADHYA. By accessing our platform, you agree to comply with our terms of service...',
    shipping_policy TEXT DEFAULT 'Standard delivery takes 3-5 business days across India. Free shipping on orders above ₹5,000.',
    social_links JSONB DEFAULT '{"instagram": "https://instagram.com/aadhya", "facebook": "https://facebook.com/aadhya", "youtube": "https://youtube.com/aadhya", "pinterest": "https://pinterest.com/aadhya"}'::jsonb,
    quick_links JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial website settings
INSERT INTO website_settings (id, brand_name, contact_email, contact_phone, contact_address)
VALUES ('default', 'AADHYA', 'support@aadhya.co', '+91 98765 43210', '123 Heritage Boulevard, Mumbai, India')
ON CONFLICT (id) DO NOTHING;

-- 3. Promotional Banners
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    cta_text VARCHAR(100) DEFAULT 'EXPLORE NOW',
    cta_link TEXT DEFAULT '/catalog',
    department VARCHAR(20) DEFAULT 'global', -- 'fashion', 'numismatics', 'global'
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Promotional Offers
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage INTEGER CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    discount_amount DECIMAL(10,2) CHECK (discount_amount >= 0),
    department VARCHAR(20) DEFAULT 'global',
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial offer
INSERT INTO offers (title, code, discount_percentage, department, is_active)
VALUES ('Festive Welcome Offer', 'AD10', 10, 'global', true)
ON CONFLICT (code) DO NOTHING;

-- 5. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General Inquiry',
    related_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(30) DEFAULT 'OPEN',
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Ticket Messages (Conversation history)
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    sender_name VARCHAR(200) NOT NULL,
    sender_role VARCHAR(20) DEFAULT 'customer',
    message TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_name VARCHAR(200),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for updated_at
CREATE TRIGGER update_website_settings_updated_at BEFORE UPDATE ON website_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public / Customer Policies
CREATE POLICY "Public can view website settings" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Public can view active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active offers" ON offers FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own support tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create support tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can view own ticket messages" ON ticket_messages FOR SELECT USING (
    ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid())
);
CREATE POLICY "Users can send ticket messages" ON ticket_messages FOR INSERT WITH CHECK (
    ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid())
);

-- Admin Full Access Policies
CREATE POLICY "Admins full access website_settings" ON website_settings FOR ALL USING (is_admin());
CREATE POLICY "Admins full access banners" ON banners FOR ALL USING (is_admin());
CREATE POLICY "Admins full access offers" ON offers FOR ALL USING (is_admin());
CREATE POLICY "Admins full access support_tickets" ON support_tickets FOR ALL USING (is_admin());
CREATE POLICY "Admins full access ticket_messages" ON ticket_messages FOR ALL USING (is_admin());
CREATE POLICY "Admins full access audit_logs" ON audit_logs FOR ALL USING (is_admin());
