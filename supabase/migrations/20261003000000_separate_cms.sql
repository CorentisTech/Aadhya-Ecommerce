-- Migration: Separate CMS, Strips, Reviews

-- 1. Insert/Update Website Settings for 'fashion' and 'coins'
INSERT INTO website_settings (id, brand_name, contact_email) 
VALUES ('fashion', 'AADHYA', 'fashion@aadhya.co')
ON CONFLICT (id) DO NOTHING;

INSERT INTO website_settings (id, brand_name, contact_email) 
VALUES ('coins', 'AADHYA Coins & Notes', 'coins@aadhya.co')
ON CONFLICT (id) DO NOTHING;

-- Optionally, copy data from 'default' if it exists and fashion is empty?
-- Just to be safe, we will leave default and just use fashion/coins in the app.

-- 2. Website Strips Table
CREATE TABLE IF NOT EXISTS website_strips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department VARCHAR(20) NOT NULL, -- 'fashion' or 'coins'
    strip_type VARCHAR(20) NOT NULL, -- 'marquee', 'offer', 'info'
    text_content JSONB DEFAULT '[]'::jsonb, 
    link_url TEXT,
    bg_color VARCHAR(30),
    text_color VARCHAR(30),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Featured Reviews Table
CREATE TABLE IF NOT EXISTS featured_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department VARCHAR(20) NOT NULL, -- 'fashion' or 'coins'
    reviewer_name VARCHAR(100),
    reviewer_location VARCHAR(100),
    rating INTEGER DEFAULT 5,
    review_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
