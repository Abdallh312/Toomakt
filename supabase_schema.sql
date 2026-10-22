-- ==============================================================================
-- TOOMAKT CONFECTIONERY — SUPABASE DATABASE SCHEMA (100% AUTO-GENERATED UUIDs)
-- Guaranteed ZERO duplicate key errors.
-- Select all (Ctrl+A) and click "Run" in Supabase SQL Editor.
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables if re-running
DROP TABLE IF EXISTS toomakt_order_items CASCADE;
DROP TABLE IF EXISTS toomakt_orders CASCADE;
DROP TABLE IF EXISTS toomakt_reviews CASCADE;
DROP TABLE IF EXISTS toomakt_bundles CASCADE;
DROP TABLE IF EXISTS toomakt_products CASCADE;
DROP TABLE IF EXISTS toomakt_categories CASCADE;
DROP TABLE IF EXISTS toomakt_promo_codes CASCADE;
DROP TABLE IF EXISTS toomakt_subscribers CASCADE;

-- 3. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. TABLE SCHEMAS
-- ==============================================================================

-- Categories
CREATE TABLE toomakt_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE toomakt_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES toomakt_categories(id) ON DELETE SET NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2),
    weight TEXT DEFAULT '180g Pouch',
    badge TEXT,
    badge_type TEXT DEFAULT 'gold',
    accent_color TEXT DEFAULT '#C26715',
    light_bg_color TEXT DEFAULT '#FAF5EE',
    image_url TEXT NOT NULL,
    chewiness NUMERIC(3, 1) DEFAULT 10.0,
    fruit_impact_label TEXT DEFAULT 'Fruit Tartness',
    fruit_impact_score NUMERIC(3, 1) DEFAULT 9.0,
    fruit_notes JSONB DEFAULT '[]'::jsonb,
    ingredients JSONB DEFAULT '[]'::jsonb,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INT DEFAULT 100 CHECK (stock_quantity >= 0),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_toomakt_products_updated_at
BEFORE UPDATE ON toomakt_products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Curated Bundles
CREATE TABLE toomakt_bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'Curated Gift Box',
    badge TEXT,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    weight TEXT DEFAULT '450G LUXURY TIN',
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    image_url TEXT NOT NULL,
    perk_note TEXT,
    is_grand_feature BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE toomakt_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES toomakt_products(id) ON DELETE SET NULL,
    product_tag TEXT NOT NULL,
    author TEXT NOT NULL,
    location TEXT NOT NULL,
    role TEXT DEFAULT 'Verified Buyer',
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo Codes
CREATE TABLE toomakt_promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_percent NUMERIC(5, 2) DEFAULT 10.0 CHECK (discount_percent > 0 AND discount_percent <= 100),
    is_active BOOLEAN DEFAULT true,
    max_uses INT,
    times_used INT DEFAULT 0,
    min_order_amount NUMERIC(10, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE toomakt_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount_amount NUMERIC(10, 2) DEFAULT 0.0 CHECK (discount_amount >= 0),
    shipping_fee NUMERIC(10, 2) DEFAULT 0.0 CHECK (shipping_fee >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    promo_code TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_toomakt_orders_updated_at
BEFORE UPDATE ON toomakt_orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Order Items
CREATE TABLE toomakt_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES toomakt_orders(id) ON DELETE CASCADE,
    item_type TEXT DEFAULT 'product',
    item_id TEXT NOT NULL,
    name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- Newsletter Subscribers
CREATE TABLE toomakt_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'footer',
    promo_code_issued TEXT DEFAULT 'TOOMAKT10',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX idx_products_category ON toomakt_products(category_id);
CREATE INDEX idx_products_slug ON toomakt_products(slug);
CREATE INDEX idx_bundles_slug ON toomakt_bundles(slug);
CREATE INDEX idx_reviews_product ON toomakt_reviews(product_id);
CREATE INDEX idx_orders_number ON toomakt_orders(order_number);
CREATE INDEX idx_orders_email ON toomakt_orders(customer_email);
CREATE INDEX idx_order_items_order ON toomakt_order_items(order_id);
CREATE INDEX idx_promo_codes_code ON toomakt_promo_codes(code);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE toomakt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE toomakt_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE toomakt_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE toomakt_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE toomakt_promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE toomakt_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE toomakt_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE toomakt_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON toomakt_categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON toomakt_products FOR SELECT USING (true);
CREATE POLICY "Public read bundles" ON toomakt_bundles FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON toomakt_reviews FOR SELECT USING (is_featured = true);
CREATE POLICY "Public read promo codes" ON toomakt_promo_codes FOR SELECT USING (is_active = true);

CREATE POLICY "Public create orders" ON toomakt_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own orders" ON toomakt_orders FOR SELECT USING (true);
CREATE POLICY "Public create order items" ON toomakt_order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read order items" ON toomakt_order_items FOR SELECT USING (true);
CREATE POLICY "Public subscribe newsletter" ON toomakt_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role full access categories" ON toomakt_categories FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access products" ON toomakt_products FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access bundles" ON toomakt_bundles FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access reviews" ON toomakt_reviews FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access promo" ON toomakt_promo_codes FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access orders" ON toomakt_orders FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access order items" ON toomakt_order_items FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access subscribers" ON toomakt_subscribers FOR ALL TO service_role USING (true);

-- ==============================================================================
-- 7. INITIAL SEED DATA (IDs Generated Automatically by PostgreSQL)
-- ==============================================================================

-- 7.1 Categories
INSERT INTO toomakt_categories (name, slug, description, display_order) VALUES
('Mango', 'mango', 'Artisanal sun-ripened Alphonso mango fruit toffees.', 1),
('Berry', 'berry', 'Wild alpine strawberries, mountain raspberries and cream.', 2),
('Citrus', 'citrus', 'Cold-pressed Mediterranean lemons, limes and blood orange.', 3),
('Gift boxes', 'gift-boxes', 'Luxury presentation boxes and artisan reserve collections.', 4)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- 7.2 Products (6 Official Figma Production Items)
INSERT INTO toomakt_products (
    name, slug, category_id, tagline, description, price, weight, badge, badge_type,
    accent_color, light_bg_color, image_url, chewiness, fruit_impact_label, fruit_impact_score,
    fruit_notes, ingredients, is_featured
) VALUES
(
    'Mango Sunbeam',
    'mango-sunbeam',
    (SELECT id FROM toomakt_categories WHERE slug = 'mango' LIMIT 1),
    'Creamy, bright, buttery finish.',
    'Pure Alphonso mango purée slow-simmered with Normandy sweet cream butter into an explosive sunny chew.',
    260.00,
    '250g Pouch',
    'BEST SELLER',
    'gold',
    '#FFD147',
    '#FFFDF5',
    '/images/products/mango_sunbeam.jpg',
    9.8,
    'Fruit Density',
    9.9,
    '["Alphonso Mango Purée", "Normandy Sweet Butter", "Tahitian Vanilla", "Citrus Zing"]'::jsonb,
    '["Alphonso mango purée", "Grass-fed butter (84% butterfat)", "Cane sugar", "Maldon sea salt flakes"]'::jsonb,
    true
),
(
    'Berry Afterglow',
    'berry-afterglow',
    (SELECT id FROM toomakt_categories WHERE slug = 'berry' LIMIT 1),
    'Layered berries, delicate cream.',
    'Cold-macerated wild alpine strawberries, raspberries, and dark forest berries swirling in velvety cultured sweet cream.',
    220.00,
    '250g Pouch',
    'POPULAR',
    'berry',
    '#C84B5B',
    '#FFF8F9',
    '/images/products/berry_afterglow.jpg',
    10.0,
    'Berry Burst',
    9.9,
    '["Wild Alpine Strawberries", "Tart Forest Raspberries", "Cultured European Cream"]'::jsonb,
    '["Alpine strawberry reduction", "Wild raspberry puree", "Cultured cream", "Slow-cooked caramel"]'::jsonb,
    true
),
(
    'Citrus Comet',
    'citrus-comet',
    (SELECT id FROM toomakt_categories WHERE slug = 'citrus' LIMIT 1),
    'Bright citrus, sparkling acidity.',
    'A dazzling spark of cold-pressed Mediterranean lemons, sun-warmed limes, and slow-churned butter toffee.',
    210.00,
    '250g Pouch',
    'FRESH PICK',
    'limited',
    '#88C057',
    '#F7FCF2',
    '/images/products/citrus_comet.jpg',
    9.6,
    'Citrus Spark',
    9.8,
    '["Sicilian Lemon Zest", "Mediterranean Lime Purée", "Whipped Sweet Butter"]'::jsonb,
    '["Cold-pressed lemon oil", "Lime purée", "Browned butter toffee", "Sea salt"]'::jsonb,
    true
),
(
    'Sun Chaser Box',
    'sun-chaser-box',
    (SELECT id FROM toomakt_categories WHERE slug = 'gift-boxes' LIMIT 1),
    'A bright gathering of fruit-forward favorites.',
    'A curated deluxe gift collection featuring our finest fruit toffees in a keepsake gold-embossed presentation box.',
    1190.00,
    '1000g Deluxe Box',
    'DELUXE BOX',
    'gold',
    '#D4AF37',
    '#FCFAF2',
    '/images/products/sun_chaser_box.jpg',
    9.8,
    'Full Spectrum',
    10.0,
    '["Mango Sunbeam", "Berry Afterglow", "Citrus Comet", "Pecan Toffee"]'::jsonb,
    '["Assorted fruit purées", "European butter", "Cane sugar", "Madagascar vanilla"]'::jsonb,
    true
),
(
    'Orchard Reserve',
    'orchard-reserve',
    (SELECT id FROM toomakt_categories WHERE slug = 'gift-boxes' LIMIT 1),
    'Deep stone fruit, crisp caramel nuance.',
    'Hand-selected autumn orchard plums, apricots, and caramelized honey cream in an artisan wooden keepsake box.',
    820.00,
    '750g Keepsake Box',
    'ARTISAN RESERVE',
    'primary',
    '#8D6E63',
    '#FBF8F5',
    '/images/products/orchard_reserve.jpg',
    9.7,
    'Rich Orchard',
    9.9,
    '["Sun-Dried Apricots", "Spiced Damson Plum", "Wild Clover Honey Butter"]'::jsonb,
    '["Dried apricot concentrate", "Plum puree", "Clover honey", "Cultured butter"]'::jsonb,
    false
),
(
    'Evening Citrus',
    'evening-citrus',
    (SELECT id FROM toomakt_categories WHERE slug = 'citrus' LIMIT 1),
    'Blood orange, bergamot, dark molasses.',
    'Late-harvest Sicilian blood orange and floral bergamot infused with golden clover honey and browned butter toffee.',
    310.00,
    '250g Pouch',
    'LIMITED EDITION',
    'limited',
    '#D35400',
    '#FDF6F0',
    '/images/products/evening_citrus.jpg',
    9.8,
    'Dark Citrus',
    9.9,
    '["Sicilian Blood Orange", "Calabrian Bergamot", "Raw Cane Molasses"]'::jsonb,
    '["Blood orange reduction", "Bergamot essence", "Dark cane sugar", "French butter"]'::jsonb,
    false
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    weight = EXCLUDED.weight,
    image_url = EXCLUDED.image_url,
    category_id = EXCLUDED.category_id;
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    weight = EXCLUDED.weight,
    badge = EXCLUDED.badge,
    badge_type = EXCLUDED.badge_type,
    accent_color = EXCLUDED.accent_color,
    light_bg_color = EXCLUDED.light_bg_color,
    image_url = EXCLUDED.image_url,
    chewiness = EXCLUDED.chewiness,
    fruit_impact_label = EXCLUDED.fruit_impact_label,
    fruit_impact_score = EXCLUDED.fruit_impact_score,
    fruit_notes = EXCLUDED.fruit_notes,
    ingredients = EXCLUDED.ingredients,
    is_featured = EXCLUDED.is_featured;

-- 7.3 Bundles
INSERT INTO toomakt_bundles (
    title, slug, category, badge, description, price, weight, rating, review_count,
    image_url, perk_note, is_grand_feature
) VALUES
(
    'The Grand Fruit & Toffee Carousel',
    'the-grand-fruit-toffee-carousel',
    'CONFECTION OF THE YEAR',
    '94% of first-time buyers select this',
    'Our bespoke gilded collector''s canister packed with all 12 artisanal fruit-marbled toffee chews. Individually wrapped in high-gloss foil with ribbon closure.',
    42.00,
    '450G LUXURY TIN',
    4.98,
    1280,
    '/images/carousel.jpg',
    'Includes Gold Foil Gift Bag & Tasting Menu',
    true
),
(
    'Artisan Pulled Berry Swirls',
    'artisan-pulled-berry-swirls',
    'Tasting Trio',
    NULL,
    'Triple-folded blackberry, raspberry & blueberry golden toffee squares in a commemorative wooden slide-box.',
    18.00,
    '220g Box',
    5.00,
    420,
    '/images/chew_sample.jpg',
    NULL,
    false
),
(
    'Summer Tropical Duo',
    'summer-tropical-duo',
    'Limited Edition • Only 140 Bundles Left',
    NULL,
    'Mango Zing + Passionfruit Blossom twin pouches in signature gold zip closure.',
    32.00,
    '2 x 180g Pouches',
    4.94,
    260,
    '/images/marbling.jpg',
    NULL,
    false
),
(
    'Pocket Chews 6-Pack',
    'pocket-chews-6-pack',
    'Pocket Tins • Perfect for Gifting',
    NULL,
    'Individually sealed purse-ready slider tins. One of each core harvest recipe.',
    24.00,
    '6 x 40g Tins',
    4.97,
    512,
    '/images/canister.jpg',
    NULL,
    false
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    badge = EXCLUDED.badge,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    weight = EXCLUDED.weight,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    image_url = EXCLUDED.image_url,
    perk_note = EXCLUDED.perk_note,
    is_grand_feature = EXCLUDED.is_grand_feature;

-- 7.4 Reviews
INSERT INTO toomakt_reviews (
    author, location, role, rating, title, content, product_tag, is_verified, is_featured
) VALUES
(
    'Camilla Montgomery',
    'Austin, TX',
    'Verified Collector',
    5,
    '“Ruined all normal candy for me.”',
    'The real fruit swirl is completely unreal. You can actually taste real strawberry seeds and that heavy slow-cooked European butter. My entire studio ordered a box the next morning.',
    'Strawberry Burst',
    true,
    true
),
(
    'Julian Levesque',
    'Brooklyn, NY',
    'Verified Confectioner',
    5,
    '“The packaging alone is museum grade.”',
    'The luxury cylinder canister feels like something you’d purchase at an exclusive Parisian boutique. The toffee is velvety, stretchy without being gummy, and the Mango Zing is pure culinary joy.',
    'The Grand Tin',
    true,
    true
),
(
    'Sarah Al-Mansoor',
    'Seattle, WA',
    'Verified Buyer',
    5,
    '“Addictive texture and real fruit notes.”',
    'You don’t get that chemical back-taste typical to chewy candies. It feels like biting into sweet orchard preserves enveloped in toasted golden caramel. Ordered four more bags for summer gifting.',
    'Blueberry Velvet',
    true,
    true
);

-- 7.5 Promo Codes
INSERT INTO toomakt_promo_codes (code, discount_percent, is_active, min_order_amount) VALUES
('TOOMAKT10', 10.0, true, 0.0),
('SWEET10', 10.0, true, 0.0),
('SUMMER15', 15.0, true, 40.0)
ON CONFLICT (code) DO UPDATE SET
    discount_percent = EXCLUDED.discount_percent,
    is_active = EXCLUDED.is_active,
    min_order_amount = EXCLUDED.min_order_amount;
