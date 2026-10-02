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
('Berries & Stone Fruit', 'berries', 'Alpine strawberries, wild blueberries, and stone fruit reductions.', 1),
('Tropical Sunshine', 'tropical', 'Ratnagiri Alphonso mango, passionfruit, and island sunshine.', 2),
('Citrus & Tart Orchard', 'citrus', 'Sicilian blood orange, Amalfi lemon flavedo, and crisp Granny Smith apples.', 3),
('Curated Gift Boxes & Tins', 'gifts', 'Commemorative gilded canisters, carousel gift boxes, and taster towers.', 4)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- 7.2 Products (Using Subqueries for Foreign Keys & Auto UUIDs)
INSERT INTO toomakt_products (
    name, slug, category_id, tagline, description, price, weight, badge, badge_type,
    accent_color, light_bg_color, image_url, chewiness, fruit_impact_label, fruit_impact_score,
    fruit_notes, ingredients, is_featured
) VALUES
(
    'The Summer Fruit Canister',
    'the-summer-fruit-canister',
    (SELECT id FROM toomakt_categories WHERE slug = 'berries' LIMIT 1),
    'Sun-ripened strawberry & Alphonso mango toffee pearls.',
    'Our signature gilded tin canister filled with freshly pulled toffee pearls layered with 100% natural fruit purées. Keeps candies exceptionally tender.',
    28.00,
    '250g Cylindrical Tin',
    'IN STOCK • FRESH BATCH',
    'gold',
    '#C26715',
    '#FFF8F2',
    '/images/canister.jpg',
    9.8,
    'Fruit Density',
    9.9,
    '["Wild Alpine Strawberry", "Alphonso Mango Nectar", "Browned Butter Toffee", "Maldon Flake Salt"]'::jsonb,
    '["Whole pure strawberry purée", "Alphonso mango pulp", "Grass-fed butter (84% butterfat)", "Cane sugar", "Maldon sea salt flakes"]'::jsonb,
    true
),
(
    'Strawberry Burst',
    'strawberry-burst',
    (SELECT id FROM toomakt_categories WHERE slug = 'berries' LIMIT 1),
    'Wild Alpine strawberries & silky Tahitian vanilla cream toffee swirl.',
    'Cold-macerated wild alpine strawberries folded into warm Normandy butter caramel. Every piece has a crimson fruit core with golden toffee ribbons.',
    16.00,
    '180g Pouch',
    'BERRY BEST SELLER',
    'berry',
    '#C2293E',
    '#FDF0F2',
    '/images/chew_sample.jpg',
    10.0,
    'Fruit Tartness',
    8.5,
    '["Alpine Mara Strawberries", "Tahitian Vanilla Pods", "European Cream", "Pink Himalayan Salt"]'::jsonb,
    '["Alpine strawberry reduction", "Cultured cream", "Slow-cooked caramel", "Tahitian vanilla beans"]'::jsonb,
    true
),
(
    'Mango Zing',
    'mango-zing',
    (SELECT id FROM toomakt_categories WHERE slug = 'tropical' LIMIT 1),
    'Alphonso mango sunshine swirl with smoked sea-salt butterscotch caramel.',
    'Rich tropical nectar from Ratnagiri Alphonso mangoes balances the deep sweet crunch of golden caramel and flake salt. Melts into luscious sunshine.',
    16.00,
    '180g Pouch',
    'TRENDING DROP',
    'gold',
    '#E58B12',
    '#FEF7EC',
    '/images/marbling.jpg',
    9.5,
    'Fruit Zing',
    9.5,
    '["Alphonso Mango Puree", "Smoked Sea Salt", "Cultured Butterscotch", "Saffron Blossom"]'::jsonb,
    '["Alphonso mango nectar", "Cane sugar", "French butter", "Smoked Maldon sea salt"]'::jsonb,
    true
),
(
    'Blueberry Velvet',
    'blueberry-velvet',
    (SELECT id FROM toomakt_categories WHERE slug = 'berries' LIMIT 1),
    'Deep mountain wild berry reduction enveloped in a slow-pulled toffee chew.',
    'High-altitude Nordic bilberries cooked down in small copper vats, swirled through deep caramelized brown sugar butter. Luscious, deep, and velvet.',
    16.00,
    '180g Pouch',
    'CHEF RESERVE',
    'primary',
    '#3B3868',
    '#F2F2FC',
    '/images/carousel.jpg',
    10.0,
    'Fruit Richness',
    9.0,
    '["Wild Arctic Bilberries", "Lavender Blossom Honey", "Brown Sugar Caramel", "Jersey Cream"]'::jsonb,
    '["Wild bilberry purée", "Jersey whole cream", "Dark cane sugar", "Pure butter"]'::jsonb,
    false
),
(
    'Citrus Tang',
    'citrus-tang',
    (SELECT id FROM toomakt_categories WHERE slug = 'citrus' LIMIT 1),
    'Blood orange zest & browned butter toffee infused with Sicilian lemon.',
    'Hand-zested Sicilian lemons and sun-drenched Moro blood oranges create a vibrant citrus prickle that cuts luxuriously through nutty browned butter.',
    16.00,
    '180g Pouch',
    'ZESTY BRIGHT',
    'gold',
    '#D65A20',
    '#FEF3EC',
    '/images/marbling.jpg',
    9.0,
    'Citrus Punch',
    9.8,
    '["Sicilian Blood Orange", "Amalfi Lemon Rind", "Browned Butter", "Flake Salt"]'::jsonb,
    '["Cold-pressed blood orange oil", "Lemon flavedo", "Toasted butter caramel"]'::jsonb,
    false
),
(
    'Crisp Apple',
    'crisp-apple',
    (SELECT id FROM toomakt_categories WHERE slug = 'citrus' LIMIT 1),
    'Tart Granny Smith tang perfectly balanced with honeyed salted butterscotch.',
    'Crisp autumn orchard apples pressed into a golden tart concentrate, swirled with old-fashioned butterscotch and a sprinkle of fleur de sel.',
    16.00,
    '180g Pouch',
    'AUTUMN HARVEST',
    'primary',
    '#7B8838',
    '#F4F7EB',
    '/images/chew_sample.jpg',
    10.0,
    'Tartness',
    9.2,
    '["Granny Smith Apples", "Honeyed Butterscotch", "Cinnamon Bark", "Maldon Salt"]'::jsonb,
    '["Granny Smith apple cider reduction", "Honeyed butterscotch", "Sea salt"]'::jsonb,
    false
)
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
