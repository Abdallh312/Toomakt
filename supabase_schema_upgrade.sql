-- ==============================================================================
-- TOOMAKT CONFECTIONERY — PRODUCTION UPGRADE MIGRATION SCRIPT FOR SUPABASE
-- Run this in your Supabase SQL Editor (100% idempotent & safe to re-run).
-- ==============================================================================

-- 1. Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Upgrade toomakt_orders table with payment & delivery columns
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'instapay';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT DEFAULT '';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS payment_reviewed_by TEXT DEFAULT '';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS payment_reviewed_at TIMESTAMPTZ;
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS payment_rejection_reason TEXT DEFAULT '';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS governorate TEXT DEFAULT 'Cairo';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS shipping_city TEXT DEFAULT '';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS building_number TEXT DEFAULT '';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS apartment_floor TEXT DEFAULT '';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT DEFAULT '';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS internal_notes TEXT DEFAULT '';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS tracking_number TEXT DEFAULT '';
ALTER TABLE toomakt_orders ADD COLUMN IF NOT EXISTS timeline JSONB DEFAULT '[]'::jsonb;

-- Relax or update the status check constraint on toomakt_orders
DO $$
BEGIN
    ALTER TABLE toomakt_orders DROP CONSTRAINT IF EXISTS toomakt_orders_status_check;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

ALTER TABLE toomakt_orders ADD CONSTRAINT toomakt_orders_status_check
CHECK (status IN (
    'pending', 'waiting_for_payment', 'payment_review', 'confirmed', 'paid',
    'preparing', 'processing', 'packed', 'shipped', 'out_for_delivery',
    'delivered', 'cancelled', 'payment_rejected', 'refunded'
));

-- 3. Create toomakt_payment_confirmations table
CREATE TABLE IF NOT EXISTS toomakt_payment_confirmations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES toomakt_orders(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT DEFAULT '',
    order_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
    payment_method TEXT DEFAULT 'instapay',
    transfer_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    transfer_reference TEXT DEFAULT '',
    payment_screenshot TEXT DEFAULT '',
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    payment_status TEXT DEFAULT 'waiting_verification',
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    admin_reviewer TEXT DEFAULT '',
    admin_review_date TIMESTAMPTZ,
    admin_notes TEXT DEFAULT '',
    rejection_reason TEXT DEFAULT ''
);

-- 4. Create toomakt_notifications table
CREATE TABLE IF NOT EXISTS toomakt_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_order_id TEXT DEFAULT '',
    related_order_number TEXT DEFAULT '',
    related_product_id TEXT DEFAULT '',
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create toomakt_shipping_rates table
CREATE TABLE IF NOT EXISTS toomakt_shipping_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    governorate TEXT UNIQUE NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    estimated_delivery TEXT DEFAULT '1–3 Days',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create toomakt_global_settings table
CREATE TABLE IF NOT EXISTS toomakt_global_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT DEFAULT 'general',
    key TEXT UNIQUE NOT NULL,
    label TEXT DEFAULT '',
    value JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_payments_order ON toomakt_payment_confirmations(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_number ON toomakt_payment_confirmations(order_number);
CREATE INDEX IF NOT EXISTS idx_payments_verification ON toomakt_payment_confirmations(verification_status);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON toomakt_notifications(is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shipping_gov ON toomakt_shipping_rates(governorate);
CREATE INDEX IF NOT EXISTS idx_settings_key ON toomakt_global_settings(key);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE toomakt_payment_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE toomakt_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE toomakt_shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE toomakt_global_settings ENABLE ROW LEVEL SECURITY;

-- Public / Service role policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public insert payment confirmations" ON toomakt_payment_confirmations;
    DROP POLICY IF EXISTS "Public read payment confirmations" ON toomakt_payment_confirmations;
    DROP POLICY IF EXISTS "Service role full access payment confirmations" ON toomakt_payment_confirmations;

    DROP POLICY IF EXISTS "Public read shipping rates" ON toomakt_shipping_rates;
    DROP POLICY IF EXISTS "Service role full access shipping rates" ON toomakt_shipping_rates;

    DROP POLICY IF EXISTS "Public read settings" ON toomakt_global_settings;
    DROP POLICY IF EXISTS "Service role full access settings" ON toomakt_global_settings;

    DROP POLICY IF EXISTS "Service role full access notifications" ON toomakt_notifications;
    DROP POLICY IF EXISTS "Public create notifications" ON toomakt_notifications;
    DROP POLICY IF EXISTS "Public read notifications" ON toomakt_notifications;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public insert payment confirmations" ON toomakt_payment_confirmations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read payment confirmations" ON toomakt_payment_confirmations FOR SELECT USING (true);
CREATE POLICY "Service role full access payment confirmations" ON toomakt_payment_confirmations FOR ALL TO service_role USING (true);

CREATE POLICY "Public read shipping rates" ON toomakt_shipping_rates FOR SELECT USING (active = true);
CREATE POLICY "Service role full access shipping rates" ON toomakt_shipping_rates FOR ALL TO service_role USING (true);

CREATE POLICY "Public read settings" ON toomakt_global_settings FOR SELECT USING (true);
CREATE POLICY "Service role full access settings" ON toomakt_global_settings FOR ALL TO service_role USING (true);

CREATE POLICY "Public create notifications" ON toomakt_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read notifications" ON toomakt_notifications FOR SELECT USING (true);
CREATE POLICY "Service role full access notifications" ON toomakt_notifications FOR ALL TO service_role USING (true);

-- 9. Seed 27 Egyptian Governorates into toomakt_shipping_rates
INSERT INTO toomakt_shipping_rates (governorate, price, estimated_delivery, active) VALUES
('Cairo', 45.00, 'Same Day – 24 Hours', true),
('Giza', 45.00, 'Same Day – 24 Hours', true),
('Alexandria', 55.00, '1–2 Business Days', true),
('Qalyubia', 50.00, '1–2 Business Days', true),
('Sharqia', 60.00, '1–2 Business Days', true),
('Dakahlia', 60.00, '1–2 Business Days', true),
('Gharbia', 60.00, '1–2 Business Days', true),
('Monufia', 60.00, '1–2 Business Days', true),
('Beheira', 65.00, '1–3 Business Days', true),
('Kafr El Sheikh', 65.00, '1–3 Business Days', true),
('Damietta', 65.00, '1–3 Business Days', true),
('Port Said', 65.00, '1–3 Business Days', true),
('Ismailia', 65.00, '1–3 Business Days', true),
('Suez', 65.00, '1–3 Business Days', true),
('Beni Suef', 75.00, '2–3 Business Days', true),
('Faiyum', 70.00, '2–3 Business Days', true),
('Minya', 80.00, '2–3 Business Days', true),
('Asyut', 85.00, '2–4 Business Days', true),
('Sohag', 90.00, '2–4 Business Days', true),
('Qena', 95.00, '2–4 Business Days', true),
('Luxor', 100.00, '3–5 Business Days', true),
('Aswan', 110.00, '3–5 Business Days', true),
('Red Sea', 120.00, '3–5 Business Days', true),
('South Sinai', 120.00, '3–5 Business Days', true),
('North Sinai', 130.00, '3–5 Business Days', true),
('Matrouh', 110.00, '3–5 Business Days', true),
('New Valley', 130.00, '3–5 Business Days', true)
ON CONFLICT (governorate) DO UPDATE SET
    price = EXCLUDED.price,
    estimated_delivery = EXCLUDED.estimated_delivery,
    active = EXCLUDED.active;

-- 10. Seed Default Global Settings
INSERT INTO toomakt_global_settings (category, key, label, value) VALUES
('payments', 'instapay_settings', 'InstaPay Transfer Settings', '{"address": "toomakt@instapay", "account_name": "toomakt Confectionery", "phone": "01000000000", "bank_name": "CIB Egypt", "instructions": "Transfer exact order total via InstaPay app using address or mobile number, then submit transaction screenshot."}'::jsonb),
('messaging', 'whatsapp_settings', 'WhatsApp Notification & Support', '{"phone": "201000000000", "business_name": "toomakt Atelier", "auto_invoice_on_preparing": true, "prefix": "https://wa.me/"}'::jsonb),
('shipping', 'shipping_rules', 'Shipping & Delivery Configuration', '{"default_fee": 50.0, "free_shipping_threshold": 500.0, "is_free_shipping_enabled": true}'::jsonb),
('analytics', 'tracking_pixels', 'Tracking & Pixel Configuration', '{"meta_pixel_id": "", "google_analytics_id": "", "google_tag_manager_id": "", "enabled": true}'::jsonb),
('seo', 'seo_global', 'Global SEO & OpenGraph Configuration', '{"site_name": "toomakt Confectionery", "title_template": "%s | toomakt Egypt", "meta_description": "Artisanal French fruit-infused toffee handcrafted in Egypt with copper kettles.", "og_image": "/images/canister.jpg"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value;
