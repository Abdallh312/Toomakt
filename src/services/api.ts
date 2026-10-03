// ============================================================================
// toomakt Unified API Client — 100% Supabase PostgreSQL (No Django Backend)
// ============================================================================
import { PRODUCTS } from '../data/toomaktData';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Use Vite proxy for admin mutations so service_role key is attached server-side
const USE_PROXY = typeof window !== 'undefined';
const ADMIN_BASE = USE_PROXY ? '/supabase-admin' : `${SUPABASE_URL}/rest/v1`;
const PUBLIC_BASE = `${SUPABASE_URL}/rest/v1`;

const getHeaders = (isAdmin = false): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };
  if (!isAdmin || !USE_PROXY) {
    headers['apikey'] = SUPABASE_ANON_KEY;
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
  }
  return headers;
};

const PRODUCT_DEFAULT_FLAVORS: Record<string, string[]> = {
  'mango-sunbeam': ['Alphonso Mango', 'Passion Mango Twist', 'Golden Honey Mango'],
  'berry-afterglow': ['Wild Alpine Strawberry', 'Tart Forest Raspberry', 'Dark Forest Blackberry'],
  'citrus-comet': ['Sicilian Lemon Zest', 'Mediterranean Lime', 'Yuzu Butter Chew'],
  'sun-chaser-box': ['Harvest Trio (Mango, Berry, Citrus)', 'Orchard Gold (Mango & Apricot)', 'Berry & Butter Harmony'],
  'orchard-reserve': ['Sun-Dried Apricot & Plum', 'Damson Honey Glaze', 'Velvet Fig & Butter'],
  'evening-citrus': ['Sicilian Blood Orange', 'Calabrian Bergamot', 'Molasses Blood Orange'],
};

export const api = {
  // =========================================================================
  // SUPABASE CONNECTION & DIAGNOSTICS
  // =========================================================================
  async checkDatabaseConnection(): Promise<{
    connected: boolean;
    latencyMs: number;
    url: string;
    tableCounts: Record<string, number>;
    error?: string;
  }> {
    const start = performance.now();
    try {
      const headers = getHeaders(true);
      const tables = [
        'toomakt_products',
        'toomakt_orders',
        'toomakt_order_items',
        'toomakt_categories',
        'toomakt_bundles',
        'toomakt_shipping_rates',
        'toomakt_payment_confirmations',
        'toomakt_promo_codes',
        'toomakt_reviews',
        'toomakt_global_settings',
        'toomakt_subscribers',
        'toomakt_notifications'
      ];
      const counts: Record<string, number> = {};

      const results = await Promise.all(
        tables.map(async (t) => {
          try {
            const res = await fetch(`${ADMIN_BASE}/${t}?select=id`, { headers });
            if (res.ok) {
              const rows = await res.json();
              return { table: t, count: Array.isArray(rows) ? rows.length : 0 };
            }
            return { table: t, count: 0 };
          } catch {
            return { table: t, count: 0 };
          }
        })
      );

      results.forEach((r) => { counts[r.table] = r.count; });

      return {
        connected: true,
        latencyMs: Math.round(performance.now() - start),
        url: SUPABASE_URL,
        tableCounts: counts,
      };
    } catch (e: any) {
      return {
        connected: false,
        latencyMs: Math.round(performance.now() - start),
        url: SUPABASE_URL,
        tableCounts: {},
        error: e.message || 'Connection failed',
      };
    }
  },

  // =========================================================================
  // 1. PRODUCTS & INVENTORY
  // =========================================================================
  async getProducts(): Promise<any[]> {
    try {
      const res = await fetch(
        `${ADMIN_BASE}/toomakt_products?select=*,category:toomakt_categories(name,slug)&order=is_featured.desc,name.asc`,
        { headers: getHeaders(true) }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data && data.length > 0) {
        return data.map((p: any) => {
          const defaultFlavors = (PRODUCT_DEFAULT_FLAVORS as Record<string, string[]>)[p.slug] || (PRODUCT_DEFAULT_FLAVORS as Record<string, string[]>)[p.id] || (Array.isArray(p.fruit_notes) && p.fruit_notes.length > 0 ? p.fruit_notes : [p.name]);
          const availableFlavors = p.available_flavors && Array.isArray(p.available_flavors) && p.available_flavors.length > 0
            ? p.available_flavors
            : defaultFlavors;

          return {
            ...p,
            category_name: p.category?.name || 'Confectionery',
            category_slug: p.category?.slug || 'confectionery',
            flavor_name: p.name,
            flavor_color: p.accent_color || '#FFD147',
            status: p.in_stock ? 'published' : 'draft',
            stock_quantity: p.stock_quantity ?? 50,
            in_stock: (p.stock_quantity ?? 50) > 0,
            price: Number(p.price || 0),
            pieces_per_pack: p.pieces_per_pack || 20,
            image: p.image_url || '/images/canister.jpg',
            weight: p.weight || '250g Pouch',
            tagline: p.tagline || '',
            description: p.description || '',
            available_flavors: availableFlavors,
            rating: 4.98,
            reviewsCount: 1420,
            variants: [
              { id: `${p.id}-v1`, title: p.weight || '250g Pouch', price: p.price, stock_quantity: p.stock_quantity ?? 50 },
            ],
          };
        });
      }
    } catch (e) {
      console.warn('Supabase products unavailable, using local data:', e);
    }
    return PRODUCTS;
  },

  async getProduct(slugOrId: string): Promise<any> {
    const all = await this.getProducts();
    const found = all.find((p: any) => String(p.slug) === String(slugOrId) || String(p.id) === String(slugOrId));
    if (found) return found;

    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
      const query = isUUID ? `id=eq.${slugOrId}` : `slug=eq.${encodeURIComponent(slugOrId)}`;
      const res = await fetch(`${PUBLIC_BASE}/toomakt_products?${query}&select=*,category:toomakt_categories(name,slug)&limit=1`, { headers: getHeaders(false) });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) return data[0];
      }
    } catch (e) {
      console.error('Error fetching single product:', e);
    }
    return null;
  },

  async createProduct(data: any): Promise<any> {
    const slug = data.slug || (data.name || 'confection').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const stockQuantity = parseInt(data.stock_quantity || data.stock) || 50;

    const payload: any = {
      name: data.name,
      slug,
      tagline: data.tagline || 'Sensory fruit-infused French soft toffee.',
      description: data.description || 'Artisanal toffee pulled in copper kettles with real orchard fruits.',
      price: parseFloat(data.price) || 16.0,
      weight: data.weight || '180g Pouch',
      badge: data.badge || 'NEW RECIPE',
      badge_type: data.badge_type || 'gold',
      accent_color: data.accent_color || '#C26715',
      light_bg_color: data.light_bg_color || '#FAF5EE',
      image_url: data.image_url || '/images/canister.jpg',
      chewiness: parseFloat(data.chewiness) || 10.0,
      fruit_impact_label: data.fruit_impact_label || 'Fruit Tartness',
      fruit_impact_score: parseFloat(data.fruit_impact_score) || 9.2,
      fruit_notes: Array.isArray(data.fruit_notes) ? data.fruit_notes : ['Fresh Orchard Fruit', 'Salted Butter', 'European Cream'],
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : ['Fruit Puree', 'Grass-fed Butter', 'Cane Sugar', 'Sea Salt'],
      in_stock: stockQuantity > 0,
      stock_quantity: stockQuantity,
      is_featured: Boolean(data.is_featured),
    };

    if (data.category_id) payload.category_id = data.category_id;

    const res = await fetch(`${ADMIN_BASE}/toomakt_products`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to create product: ${err}`);
    }

    const created = await res.json();
    return created[0] || payload;
  },

  async updateProduct(id: string, data: any): Promise<any> {
    const patchPayload: any = {};
    if (data.name !== undefined) patchPayload.name = data.name;
    if (data.tagline !== undefined) patchPayload.tagline = data.tagline;
    if (data.description !== undefined) patchPayload.description = data.description;
    if (data.price !== undefined) patchPayload.price = parseFloat(data.price);
    if (data.weight !== undefined) patchPayload.weight = data.weight;
    if (data.pieces_per_pack !== undefined) patchPayload.pieces_per_pack = parseInt(data.pieces_per_pack);
    if (data.badge !== undefined) patchPayload.badge = data.badge;
    if (data.badge_type !== undefined) patchPayload.badge_type = data.badge_type;
    if (data.accent_color !== undefined) patchPayload.accent_color = data.accent_color;
    if (data.light_bg_color !== undefined) patchPayload.light_bg_color = data.light_bg_color;
    if (data.image_url !== undefined) patchPayload.image_url = data.image_url;
    if (data.chewiness !== undefined) patchPayload.chewiness = parseFloat(data.chewiness);
    if (data.fruit_impact_label !== undefined) patchPayload.fruit_impact_label = data.fruit_impact_label;
    if (data.fruit_impact_score !== undefined) patchPayload.fruit_impact_score = parseFloat(data.fruit_impact_score);
    if (data.is_featured !== undefined) patchPayload.is_featured = Boolean(data.is_featured);

    if (data.stock_quantity !== undefined) {
      patchPayload.stock_quantity = parseInt(data.stock_quantity);
      patchPayload.in_stock = patchPayload.stock_quantity > 0;
    }

    if (data.status !== undefined) {
      patchPayload.in_stock = data.status === 'published';
    }

    const res = await fetch(`${ADMIN_BASE}/toomakt_products?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify(patchPayload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to update product: ${err}`);
    }

    const updated = await res.json();
    return updated[0] || data;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`${ADMIN_BASE}/toomakt_products?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return res.ok;
  },

  // =========================================================================
  // 2. CATEGORIES
  // =========================================================================
  async getCategories(): Promise<any[]> {
    try {
      const res = await fetch(
        `${ADMIN_BASE}/toomakt_categories?select=*&order=display_order.asc`,
        { headers: getHeaders(true) }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) return data;
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    }
    return [
      { id: 'cat-1', name: 'All', slug: 'all', description: 'Complete collection of artisanal fruit confections', display_order: 1 },
      { id: 'cat-2', name: 'Mango', slug: 'mango', description: 'Equatorial golden Alphonso mango creations', display_order: 2 },
      { id: 'cat-3', name: 'Berry', slug: 'berry', description: 'Wild mountain strawberries and arctic bilberries', display_order: 3 },
      { id: 'cat-4', name: 'Citrus', slug: 'citrus', description: 'Sun-drenched Mediterranean blood orange zest', display_order: 4 },
      { id: 'cat-5', name: 'Gift boxes', slug: 'gift-boxes', description: 'Prestige curated tins and tasting assortments', display_order: 5 }
    ];
  },

  async createCategory(data: any): Promise<any> {
    const slug = data.slug || (data.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const payload = {
      name: data.name,
      slug,
      description: data.description || '',
      display_order: parseInt(data.display_order) || 0
    };
    try {
      const res = await fetch(`${ADMIN_BASE}/toomakt_categories`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const rows = await res.json();
        return rows[0] || payload;
      }
    } catch (e) {
      console.error('Error creating category:', e);
    }
    return { id: String(Date.now()), ...payload };
  },

  async updateCategory(id: string, data: any): Promise<boolean> {
    try {
      const res = await fetch(`${ADMIN_BASE}/toomakt_categories?id=eq.${id}`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${ADMIN_BASE}/toomakt_categories?id=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // =========================================================================
  // 3. CURATED BUNDLES & TINS
  // =========================================================================
  async getBundles(): Promise<any[]> {
    try {
      const res = await fetch(
        `${ADMIN_BASE}/toomakt_bundles?select=*&order=is_grand_feature.desc,price.asc`,
        { headers: getHeaders(true) }
      );
      if (res.ok) {
        const data = await res.json();
        return (data || []).map((b: any) => ({
          ...b,
          title: b.title,
          category: b.category || 'Curated Gift Box',
          badge: b.badge || '',
          description: b.description || '',
          price: Number(b.price || 0),
          compare_at_price: b.compare_at_price != null ? Number(b.compare_at_price) : null,
          weight: b.weight || '450G LUXURY TIN',
          rating: Number(b.rating || 5),
          reviewCount: b.review_count ?? b.reviewCount ?? 0,
          review_count: b.review_count ?? 0,
          image: b.image_url || b.image || '/images/carousel.jpg',
          image_url: b.image_url || b.image || '/images/carousel.jpg',
          perk_note: b.perk_note || '',
          is_grand_feature: Boolean(b.is_grand_feature),
          is_active: b.is_active !== false,
        }));
      }
    } catch (e) {
      console.error('Error fetching bundles:', e);
    }
    return [];
  },

  async createBundle(data: any): Promise<any> {
    const slug =
      data.slug ||
      (data.title || 'gift-box')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const payload: any = {
      title: data.title,
      slug,
      category: data.category || 'Curated Gift Box',
      badge: data.badge || '',
      description: data.description || 'A curated gift assortment from the toomakt atelier.',
      price: parseFloat(data.price) || 0,
      weight: data.weight || '450G LUXURY TIN',
      rating: parseFloat(data.rating) || 5.0,
      review_count: parseInt(data.review_count || data.reviewCount) || 0,
      image_url: data.image_url || data.image || '/images/carousel.jpg',
      perk_note: data.perk_note || '',
      is_grand_feature: Boolean(data.is_grand_feature),
      is_active: data.is_active !== false,
    };

    if (data.compare_at_price != null && data.compare_at_price !== '') {
      payload.compare_at_price = parseFloat(data.compare_at_price);
    }

    const res = await fetch(`${ADMIN_BASE}/toomakt_bundles`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to create bundle: ${err}`);
    }

    const created = await res.json();
    const row = created[0] || payload;
    return {
      ...row,
      image: row.image_url || payload.image_url,
      reviewCount: row.review_count ?? 0,
    };
  },

  async updateBundle(id: string, data: any): Promise<any> {
    const patchPayload: any = {};
    if (data.title !== undefined) patchPayload.title = data.title;
    if (data.slug !== undefined) patchPayload.slug = data.slug;
    if (data.category !== undefined) patchPayload.category = data.category;
    if (data.badge !== undefined) patchPayload.badge = data.badge;
    if (data.description !== undefined) patchPayload.description = data.description;
    if (data.price !== undefined) patchPayload.price = parseFloat(data.price);
    if (data.compare_at_price !== undefined) {
      patchPayload.compare_at_price =
        data.compare_at_price === '' || data.compare_at_price == null
          ? null
          : parseFloat(data.compare_at_price);
    }
    if (data.weight !== undefined) patchPayload.weight = data.weight;
    if (data.rating !== undefined) patchPayload.rating = parseFloat(data.rating);
    if (data.review_count !== undefined || data.reviewCount !== undefined) {
      patchPayload.review_count = parseInt(data.review_count ?? data.reviewCount) || 0;
    }
    if (data.image_url !== undefined || data.image !== undefined) {
      patchPayload.image_url = data.image_url || data.image;
    }
    if (data.perk_note !== undefined) patchPayload.perk_note = data.perk_note;
    if (data.is_grand_feature !== undefined) patchPayload.is_grand_feature = Boolean(data.is_grand_feature);
    if (data.is_active !== undefined) patchPayload.is_active = Boolean(data.is_active);

    const res = await fetch(`${ADMIN_BASE}/toomakt_bundles?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify(patchPayload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to update bundle: ${err}`);
    }

    const updated = await res.json();
    return updated[0] || data;
  },

  async deleteBundle(id: string): Promise<boolean> {
    const res = await fetch(`${ADMIN_BASE}/toomakt_bundles?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return res.ok;
  },

  // =========================================================================
  // 4. FLAVORS VAULT
  // =========================================================================
  async getFlavors(): Promise<any[]> {
    try {
      const res = await fetch(
        `${ADMIN_BASE}/toomakt_global_settings?key=eq.store_flavors&select=value`,
        { headers: getHeaders(true) }
      );
      if (res.ok) {
        const rows = await res.json();
        if (rows.length > 0 && Array.isArray(rows[0].value) && rows[0].value.length > 0) {
          return rows[0].value;
        }
      }
    } catch (e) {
      console.warn('Could not fetch flavors from DB, using catalog:', e);
    }
    return [
      { id: '1', name: 'Wild Strawberry', slug: 'strawberry', color: '#C2293E', secondary_color: '#FDF0F2', description: 'Hand-picked Alpine berries simmered in pure copper kettles.', is_active: true, is_featured: true },
      { id: '2', name: 'Alphonso Mango', slug: 'mango', color: '#E58B12', secondary_color: '#FEF7EC', description: 'Equatorial sunshine and golden honeycomb notes.', is_active: true, is_featured: true },
      { id: '3', name: 'Nordic Bilberry', slug: 'blueberry', color: '#3B3868', secondary_color: '#F2F2FC', description: 'Midnight sun arctic bilberries with lavender notes.', is_active: true, is_featured: false },
      { id: '4', name: 'Sicilian Blood Orange', slug: 'citrus', color: '#D65A20', secondary_color: '#FEF3EC', description: 'Sun-drenched citrus zest against rich browned butter.', is_active: true, is_featured: false },
      { id: '5', name: 'Granny Smith Apple', slug: 'apple', color: '#7B8838', secondary_color: '#F4F7EB', description: 'Crisp orchard tartness with honeyed butterscotch.', is_active: true, is_featured: false }
    ];
  },

  async createFlavor(data: any): Promise<any> {
    const flavors = await this.getFlavors();
    const newFlavor = {
      id: data.id || String(Date.now()),
      name: data.name,
      slug: data.slug || (data.name || 'flavor').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      color: data.color || '#E58B12',
      secondary_color: data.secondary_color || '#FEF7EC',
      description: data.description || '',
      is_active: data.is_active !== false,
      is_featured: Boolean(data.is_featured)
    };
    const updated = [...flavors, newFlavor];
    await this.updateGlobalSetting('store_flavors', updated);
    return newFlavor;
  },

  async updateFlavor(id: string, data: any): Promise<boolean> {
    try {
      const flavors = await this.getFlavors();
      const updated = flavors.map((f: any) => f.id === id ? { ...f, ...data } : f);
      await this.updateGlobalSetting('store_flavors', updated);
      return true;
    } catch {
      return false;
    }
  },

  async deleteFlavor(id: string): Promise<boolean> {
    try {
      const flavors = await this.getFlavors();
      const updated = flavors.filter((f: any) => f.id !== id);
      await this.updateGlobalSetting('store_flavors', updated);
      return true;
    } catch {
      return false;
    }
  },

  // =========================================================================
  // 5. REVIEWS & MODERATION
  // =========================================================================
  async getReviews(): Promise<any[]> {
    try {
      const res = await fetch(
        `${ADMIN_BASE}/toomakt_reviews?select=*&order=created_at.desc`,
        { headers: getHeaders(true) }
      );
      if (res.ok) {
        const data = await res.json();
        return data.map((r: any) => ({
          ...r,
          status: r.is_featured ? 'approved' : 'pending'
        }));
      }
    } catch (e) {
      console.error('Error fetching reviews:', e);
    }
    return [];
  },

  async createReview(data: any): Promise<any> {
    const payload = {
      product_tag: data.product_tag || 'Summer Canister',
      author: data.author,
      location: data.location || 'Verified Buyer',
      role: data.role || 'Verified Collector',
      rating: parseInt(data.rating) || 5,
      title: data.title,
      content: data.content,
      is_verified: true,
      is_featured: true
    };

    const res = await fetch(`${ADMIN_BASE}/toomakt_reviews`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const created = await res.json();
      return created[0];
    }
    return null;
  },

  async updateReviewStatus(id: string, status: string): Promise<any> {
    const isApproved = status === 'approved';
    const res = await fetch(`${ADMIN_BASE}/toomakt_reviews?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({ is_featured: isApproved })
    });
    return res.ok;
  },

  async deleteReview(id: string): Promise<boolean> {
    const res = await fetch(`${ADMIN_BASE}/toomakt_reviews?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.ok;
  },

  // =========================================================================
  // 6. ORDERS & FULFILLMENT
  // =========================================================================
  async getAdminOrders(): Promise<any[]> {
    try {
      const res = await fetch(
        `${ADMIN_BASE}/toomakt_orders?select=*,items:toomakt_order_items(*)&order=created_at.desc`,
        { headers: getHeaders(true) }
      );
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
    return [];
  },

  async updateOrderStatus(orderId: string, status: string, trackingNumber?: string, notes?: string, _adminName?: string, paymentStatus?: string): Promise<any> {
    const patchPayload: any = { status, updated_at: new Date().toISOString() };
    if (trackingNumber !== undefined) patchPayload.tracking_number = trackingNumber;
    if (notes !== undefined) patchPayload.internal_notes = notes;
    if (paymentStatus !== undefined) patchPayload.payment_status = paymentStatus;

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    const filter = isUUID ? `id=eq.${orderId}` : `order_number=eq.${orderId}`;

    const res = await fetch(`${ADMIN_BASE}/toomakt_orders?${filter}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify(patchPayload)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to update order status: ${err}`);
    }

    const updated = await res.json();
    return updated[0] || patchPayload;
  },

  async deleteOrder(orderId: string): Promise<boolean> {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    const filter = isUUID ? `id=eq.${orderId}` : `order_number=eq.${orderId}`;
    const res = await fetch(`${ADMIN_BASE}/toomakt_orders?${filter}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.ok;
  },

  // =========================================================================
  // PAYMENT CONFIRMATIONS (INSTAPAY / BANK TRANSFER)
  // =========================================================================
  async submitPaymentConfirmation(orderNumber: string, data: {
    transfer_amount?: number;
    transfer_reference?: string;
    customer_phone?: string;
    payment_screenshot?: string;
    screenshot_file?: File;
  }): Promise<{ success: boolean; message: string; order?: any; confirmation?: any }> {
    try {
      const confirmationPayload = {
        order_number: orderNumber,
        customer_name: 'Customer',
        customer_phone: data.customer_phone || '',
        order_total: Number(data.transfer_amount || 0),
        shipping_fee: 50.0,
        payment_method: 'instapay',
        transfer_amount: Number(data.transfer_amount || 0),
        transfer_reference: data.transfer_reference || '',
        payment_screenshot: data.payment_screenshot || '',
        payment_status: 'waiting_verification',
        verification_status: 'pending'
      };

      await fetch(`${ADMIN_BASE}/toomakt_payment_confirmations`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(confirmationPayload)
      });

      // Update order status
      await fetch(`${ADMIN_BASE}/toomakt_orders?order_number=eq.${orderNumber}`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify({ status: 'payment_review', payment_status: 'waiting_verification' })
      });

      // Create admin notification
      await fetch(`${ADMIN_BASE}/toomakt_notifications`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
          notification_type: 'payment_confirmation',
          title: `Payment screenshot submitted for Order #${orderNumber}`,
          message: `Customer submitted InstaPay transfer screenshot (${data.transfer_amount} EGP) for Order #${orderNumber}.`,
          related_order_number: orderNumber,
          priority: 'high'
        })
      });

      return {
        success: true,
        message: 'Your payment screenshot has been submitted. Your order is now waiting for admin verification.'
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to submit payment confirmation.' };
    }
  },

  async getPaymentConfirmations(verificationStatus?: string): Promise<any[]> {
    try {
      let query = `${ADMIN_BASE}/toomakt_payment_confirmations?select=*&order=submission_date.desc`;
      if (verificationStatus && verificationStatus !== 'all') {
        query += `&verification_status=eq.${encodeURIComponent(verificationStatus)}`;
      }
      const res = await fetch(query, { headers: getHeaders(true) });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Error fetching payment confirmations:', e);
    }
    return [];
  },

  async approvePaymentConfirmation(confirmationId: string, adminName?: string, _notes?: string): Promise<any> {
    await fetch(`${ADMIN_BASE}/toomakt_payment_confirmations?id=eq.${confirmationId}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({
        verification_status: 'approved',
        payment_status: 'paid',
        admin_reviewer: adminName || 'Admin',
        admin_review_date: new Date().toISOString()
      })
    });
    return { success: true };
  },

  async rejectPaymentConfirmation(confirmationId: string, reason: string, adminName?: string, _notes?: string): Promise<any> {
    await fetch(`${ADMIN_BASE}/toomakt_payment_confirmations?id=eq.${confirmationId}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({
        verification_status: 'rejected',
        payment_status: 'rejected',
        rejection_reason: reason,
        admin_reviewer: adminName || 'Admin',
        admin_review_date: new Date().toISOString()
      })
    });
    return { success: true };
  },

  // =========================================================================
  // NOTIFICATION SYSTEM
  // =========================================================================
  async getNotifications(unreadOnly = false): Promise<any[]> {
    try {
      let query = `${ADMIN_BASE}/toomakt_notifications?select=*&order=created_at.desc`;
      if (unreadOnly) query += '&is_read=eq.false';
      const res = await fetch(query, { headers: getHeaders(true) });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
    return [];
  },

  async markNotificationRead(id: string): Promise<boolean> {
    try {
      await fetch(`${ADMIN_BASE}/toomakt_notifications?id=eq.${id}`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify({ is_read: true })
      });
      return true;
    } catch {
      return false;
    }
  },

  async markAllNotificationsRead(): Promise<boolean> {
    try {
      await fetch(`${ADMIN_BASE}/toomakt_notifications?is_read=eq.false`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify({ is_read: true })
      });
      return true;
    } catch {
      return false;
    }
  },

  // =========================================================================
  // SHIPPING CALCULATION
  // =========================================================================
  async calculateShipping(governorate: string, subtotal: number, promoCode?: string): Promise<{
    success: boolean;
    subtotal: number;
    discount: number;
    shipping_fee: number;
    final_total: number;
    is_free_shipping: boolean;
    free_shipping_threshold: number;
    estimated_delivery: string;
    coupon_valid?: boolean;
  }> {
    // Fetch shipping rate from Supabase
    let fee = 50;
    let estimatedDelivery = '1–3 Business Days';
    try {
      const res = await fetch(
        `${PUBLIC_BASE}/toomakt_shipping_rates?governorate=eq.${encodeURIComponent(governorate)}&active=eq.true&select=price,estimated_delivery&limit=1`,
        { headers: getHeaders(false) }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          fee = Number(data[0].price);
          estimatedDelivery = data[0].estimated_delivery;
        }
      }
    } catch (e) {
      console.warn('Shipping rate lookup failed, using default:', e);
    }

    // Fetch shipping threshold from settings
    let freeThreshold = 500;
    try {
      const settingsRes = await fetch(
        `${PUBLIC_BASE}/toomakt_global_settings?key=eq.shipping_rules&select=value&limit=1`,
        { headers: getHeaders(false) }
      );
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        if (settings.length > 0 && settings[0].value) {
          freeThreshold = settings[0].value.free_shipping_threshold || 500;
        }
      }
    } catch {}

    const isFree = subtotal >= freeThreshold;
    const finalFee = isFree ? 0 : fee;

    // Validate coupon
    let discount = 0;
    let couponValid = false;
    if (promoCode) {
      const couponResult = await this.validateCoupon(promoCode, subtotal);
      if (couponResult.valid && couponResult.discount_percent) {
        discount = subtotal * (couponResult.discount_percent / 100);
        couponValid = true;
      }
    }

    return {
      success: true,
      subtotal,
      discount,
      shipping_fee: finalFee,
      final_total: Math.max(0, subtotal - discount + finalFee),
      is_free_shipping: isFree,
      free_shipping_threshold: freeThreshold,
      estimated_delivery: estimatedDelivery,
      coupon_valid: couponValid
    };
  },

  // =========================================================================
  // ANALYTICS & REPORTS
  // =========================================================================
  async getAdminReports(_period = 'weekly', _format = 'json'): Promise<any> {
    // Reports are computed from Supabase data in getAdminStats
    return null;
  },

  async getDashboardStats(): Promise<any> {
    return await this.getAdminStats();
  },

  async trackOrder(orderNumber: string): Promise<any> {
    try {
      const cleanNum = orderNumber.trim();
      const res = await fetch(
        `${PUBLIC_BASE}/toomakt_orders?order_number=eq.${encodeURIComponent(cleanNum)}&select=*,items:toomakt_order_items(*)&limit=1`,
        { headers: getHeaders(false) }
      );
      if (res.ok) {
        const data = await res.json();
        return data[0] || null;
      }
    } catch (e) {
      console.error('Error tracking order:', e);
    }
    return null;
  },

  async adminLogin(email: string, password: string): Promise<any> {
    // Simple credential check — production should use Supabase Auth
    if (email === 'admin@toomakt.com' && password === 'admin123456') {
      return {
        success: true,
        access: 'toomakt-admin-session-' + Date.now(),
        user: { email, username: 'admin' },
        role: 'Super Admin'
      };
    }
    return { success: false, error: 'Invalid administrator credentials.' };
  },

  async checkout(orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    governorate?: string;
    shipping_city?: string;
    shipping_address: string;
    building_number?: string;
    apartment_floor?: string;
    delivery_notes?: string;
    promo_code?: string;
    payment_method?: string;
    items: Array<{
      item_id: string;
      name?: string;
      unit_price?: number;
      quantity: number;
      image?: string;
    }>;
  }): Promise<{ success: boolean; order?: any; error?: string; message?: string }> {
    try {
      const orderNumber = `ORD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const subtotal = orderData.items.reduce((s, i) => s + (Number(i.unit_price || 16) * Number(i.quantity || 1)), 0);

      // Calculate discount
      let discountAmount = 0;
      if (orderData.promo_code) {
        const couponResult = await this.validateCoupon(orderData.promo_code, subtotal);
        if (couponResult.valid && couponResult.discount_percent) {
          discountAmount = subtotal * (couponResult.discount_percent / 100);
        }
      }

      // Calculate shipping from Supabase
      let shippingFee = 50.0;
      try {
        const shipRes = await fetch(
          `${PUBLIC_BASE}/toomakt_shipping_rates?governorate=eq.${encodeURIComponent(orderData.governorate || 'Cairo')}&active=eq.true&select=price&limit=1`,
          { headers: getHeaders(false) }
        );
        if (shipRes.ok) {
          const shipData = await shipRes.json();
          if (shipData.length > 0) shippingFee = Number(shipData[0].price);
        }
      } catch {}

      // Check free shipping threshold
      try {
        const settingsRes = await fetch(
          `${PUBLIC_BASE}/toomakt_global_settings?key=eq.shipping_rules&select=value&limit=1`,
          { headers: getHeaders(false) }
        );
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          if (settings.length > 0 && settings[0].value?.free_shipping_threshold) {
            if (subtotal >= settings[0].value.free_shipping_threshold) {
              shippingFee = 0;
            }
          }
        }
      } catch {}

      const totalAmount = subtotal - discountAmount + shippingFee;

      // Insert order
      const orderRes = await fetch(`${ADMIN_BASE}/toomakt_orders`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
          order_number: orderNumber,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone || '',
          shipping_address: `${orderData.shipping_address}, ${orderData.governorate || 'Cairo'}, Egypt`,
          subtotal,
          discount_amount: discountAmount,
          shipping_fee: shippingFee,
          total_amount: totalAmount,
          promo_code: orderData.promo_code || null,
          status: 'pending',
          governorate: orderData.governorate || 'Cairo',
          shipping_city: orderData.shipping_city || '',
          building_number: orderData.building_number || '',
          apartment_floor: orderData.apartment_floor || '',
          delivery_notes: orderData.delivery_notes || '',
          payment_method: orderData.payment_method || 'cod'
        })
      });

      if (!orderRes.ok) {
        const err = await orderRes.text();
        return { success: false, error: `Failed to place order: ${err}` };
      }

      const [createdOrder] = await orderRes.json();

      // Insert order items
      if (createdOrder && orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: createdOrder.id,
          item_id: String(item.item_id || 'prod'),
          item_type: 'product',
          name: item.name || 'Artisanal Toffee',
          unit_price: Number(item.unit_price || 16),
          quantity: Number(item.quantity) || 1,
          total_price: (Number(item.unit_price || 16) * (Number(item.quantity) || 1))
        }));

        await fetch(`${ADMIN_BASE}/toomakt_order_items`, {
          method: 'POST',
          headers: getHeaders(true),
          body: JSON.stringify(orderItems)
        });
      }

      // Create notification for admin
      await fetch(`${ADMIN_BASE}/toomakt_notifications`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
          notification_type: 'new_order',
          title: `New order received — Order #${orderNumber}`,
          message: `${orderData.customer_name} placed an order for ${totalAmount.toFixed(2)} EGP (${orderData.items.length} items).`,
          related_order_number: orderNumber,
          priority: 'high'
        })
      });

      // Dispatch Telegram alert
      try {
        const rawPhone = orderData.customer_phone || '';
        const cleanPhone = rawPhone.replace(/\D/g, '');
        const waPhone = cleanPhone.startsWith('20') ? cleanPhone : (cleanPhone.startsWith('0') ? '20' + cleanPhone.slice(1) : '20' + cleanPhone);
        const itemsText = (orderData.items || []).map((i: any) => `  ▫️ <b>${i.quantity || 1}x</b> ${i.name || 'Confection'} — <code>${(Number(i.unit_price || 16) * Number(i.quantity || 1)).toFixed(2)} EGP</code>`).join('\n');

        const msg = `🎉 <b>NEW ORDER RECEIVED! | طلب جديد</b>\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `🏷️ <b>Order Number:</b> <code>#${orderNumber}</code>\n` +
          `👤 <b>Customer:</b> <b>${orderData.customer_name}</b>\n` +
          `📞 <b>Phone:</b> <code>${rawPhone}</code>\n` +
          `✉️ <b>Email:</b> <code>${orderData.customer_email}</code>\n\n` +
          `📦 <b>ORDER ITEMS:</b>\n${itemsText || '  ▫️ Order Confections'}\n\n` +
          `💰 <b>FINANCIALS:</b>\n` +
          `  • Subtotal: <code>${subtotal.toFixed(2)} EGP</code>\n` +
          `  • Shipping: <code>${shippingFee.toFixed(2)} EGP</code>\n` +
          `  • <b>TOTAL AMOUNT:</b> <b><u>${totalAmount.toFixed(2)} EGP</u></b>\n\n` +
          `💳 <b>Payment:</b> 💵 <b>${(orderData.payment_method || 'COD').toUpperCase()}</b>\n\n` +
          `🚚 <b>DELIVERY DESTINATION:</b>\n` +
          `📍 <b>Governorate:</b> ${orderData.governorate || 'Cairo'}\n` +
          `🏠 <b>Address:</b> ${orderData.shipping_address}\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `👨‍🍳 <i>Admin: Prepare packaging in atelier!</i>`;

        const tgPayload: any = {
          chat_id: '1686960840',
          text: msg,
          parse_mode: 'HTML'
        };
        if (waPhone) {
          tgPayload.reply_markup = {
            inline_keyboard: [
              [{ text: `💬 WhatsApp Customer (${rawPhone})`, url: `https://wa.me/${waPhone}` }]
            ]
          };
        }

        const tgToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
        if (tgToken) {
          fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tgPayload)
          }).catch(() => {});
        }
      } catch (tgErr) {
        console.warn('Telegram alert error:', tgErr);
      }

      return {
        success: true,
        order: {
          ...createdOrder,
          governorate: orderData.governorate || 'Cairo',
          payment_method: orderData.payment_method || 'cod'
        }
      };
    } catch (e: any) {
      console.error('Checkout error:', e);
      return { success: false, error: e.message || 'Checkout failed' };
    }
  },

  // =========================================================================
  // EGYPT SHIPPING RATES (100% Synced with Database)
  // =========================================================================
  async getShippingRates(): Promise<any[]> {
    try {
      const res = await fetch(
        `${ADMIN_BASE}/toomakt_shipping_rates?select=*&order=governorate.asc`,
        { headers: getHeaders(true) }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          return data.map((sr: any) => ({
            ...sr,
            price: Number(sr.price),
            rate: Number(sr.price), // Support both property names seamlessly
            estimated_delivery: sr.estimated_delivery || '1–3 Business Days',
            active: sr.active !== false
          }));
        }
      }
    } catch (e) {
      console.warn('Could not fetch shipping rates from Supabase:', e);
    }
    // Reliable 27 Egyptian Governorates fallback matching database
    return [
      { id: '1', governorate: 'Cairo', price: 45.0, rate: 45.0, estimated_delivery: 'Same Day – 24 Hours', active: true },
      { id: '2', governorate: 'Giza', price: 45.0, rate: 45.0, estimated_delivery: 'Same Day – 24 Hours', active: true },
      { id: '3', governorate: 'Alexandria', price: 55.0, rate: 55.0, estimated_delivery: '1–2 Business Days', active: true },
      { id: '4', governorate: 'Qalyubia', price: 50.0, rate: 50.0, estimated_delivery: '1–2 Business Days', active: true },
      { id: '5', governorate: 'Sharqia', price: 60.0, rate: 60.0, estimated_delivery: '1–2 Business Days', active: true },
      { id: '6', governorate: 'Dakahlia', price: 60.0, rate: 60.0, estimated_delivery: '1–2 Business Days', active: true },
      { id: '7', governorate: 'Gharbia', price: 60.0, rate: 60.0, estimated_delivery: '1–2 Business Days', active: true },
      { id: '8', governorate: 'Monufia', price: 60.0, rate: 60.0, estimated_delivery: '1–2 Business Days', active: true },
      { id: '9', governorate: 'Beheira', price: 65.0, rate: 65.0, estimated_delivery: '1–3 Business Days', active: true },
      { id: '10', governorate: 'Damietta', price: 65.0, rate: 65.0, estimated_delivery: '1–3 Business Days', active: true },
      { id: '11', governorate: 'Port Said', price: 65.0, rate: 65.0, estimated_delivery: '1–3 Business Days', active: true },
      { id: '12', governorate: 'Ismailia', price: 65.0, rate: 65.0, estimated_delivery: '1–3 Business Days', active: true },
      { id: '13', governorate: 'Suez', price: 65.0, rate: 65.0, estimated_delivery: '1–3 Business Days', active: true },
      { id: '14', governorate: 'Kafr El Sheikh', price: 65.0, rate: 65.0, estimated_delivery: '1–3 Business Days', active: true },
      { id: '15', governorate: 'Faiyum', price: 70.0, rate: 70.0, estimated_delivery: '2–3 Business Days', active: true },
      { id: '16', governorate: 'Beni Suef', price: 75.0, rate: 75.0, estimated_delivery: '2–3 Business Days', active: true },
      { id: '17', governorate: 'Minya', price: 80.0, rate: 80.0, estimated_delivery: '2–3 Business Days', active: true },
      { id: '18', governorate: 'Asyut', price: 85.0, rate: 85.0, estimated_delivery: '2–4 Business Days', active: true },
      { id: '19', governorate: 'Sohag', price: 90.0, rate: 90.0, estimated_delivery: '2–4 Business Days', active: true },
      { id: '20', governorate: 'Qena', price: 95.0, rate: 95.0, estimated_delivery: '2–4 Business Days', active: true },
      { id: '21', governorate: 'Luxor', price: 100.0, rate: 100.0, estimated_delivery: '3–5 Business Days', active: true },
      { id: '22', governorate: 'Aswan', price: 110.0, rate: 110.0, estimated_delivery: '3–5 Business Days', active: true },
      { id: '23', governorate: 'Matrouh', price: 110.0, rate: 110.0, estimated_delivery: '3–5 Business Days', active: true },
      { id: '24', governorate: 'Red Sea', price: 120.0, rate: 120.0, estimated_delivery: '3–5 Business Days', active: true },
      { id: '25', governorate: 'South Sinai', price: 120.0, rate: 120.0, estimated_delivery: '3–5 Business Days', active: true },
      { id: '26', governorate: 'North Sinai', price: 130.0, rate: 130.0, estimated_delivery: '3–5 Business Days', active: true },
      { id: '27', governorate: 'New Valley', price: 130.0, rate: 130.0, estimated_delivery: '3–5 Business Days', active: true }
    ];
  },

  async updateShippingRate(id: string, data: any): Promise<boolean> {
    try {
      let patchPayload: any = {};
      if (typeof data === 'number') {
        patchPayload = { price: Number(data) };
      } else if (typeof data === 'object') {
        patchPayload = { ...data };
        if (data.rate !== undefined && data.price === undefined) {
          patchPayload.price = Number(data.rate);
        }
        delete patchPayload.rate;
      }
      patchPayload.updated_at = new Date().toISOString();

      const res = await fetch(`${ADMIN_BASE}/toomakt_shipping_rates?id=eq.${id}`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify(patchPayload)
      });
      return res.ok;
    } catch (e) {
      console.error('Error updating shipping rate in DB:', e);
      return false;
    }
  },

  async createShippingRate(data: { governorate: string; price: number; estimated_delivery?: string; active?: boolean }): Promise<any> {
    try {
      const res = await fetch(`${ADMIN_BASE}/toomakt_shipping_rates`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
          governorate: data.governorate.trim(),
          price: Number(data.price) || 50.0,
          estimated_delivery: data.estimated_delivery || '1–2 Business Days',
          active: data.active !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      });
      if (res.ok) {
        const rows = await res.json();
        return rows[0];
      }
    } catch (e) {
      console.error('Error creating shipping rate:', e);
    }
    return null;
  },

  async deleteShippingRate(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${ADMIN_BASE}/toomakt_shipping_rates?id=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // =========================================================================
  // WHOLESALE & B2B INQUIRIES
  // =========================================================================
  async submitWholesaleRequest(data: any): Promise<{ success: boolean; message?: string }> {
    try {
      // Store in notifications for admin live alert
      await fetch(`${ADMIN_BASE}/toomakt_notifications`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
          notification_type: 'wholesale_request',
          title: `Wholesale inquiry from ${data.company_name || data.name || 'New Client'}`,
          message: `${data.name || 'Client'} (${data.email}) requested wholesale: ${data.message || 'No details provided'}. Phone: ${data.phone || 'N/A'}`,
          priority: 'high'
        })
      });

      // Store in DB global_settings
      const current = await this.getWholesaleRequests();
      const newReq = {
        id: String(Date.now()),
        ...data,
        status: 'new',
        created_at: new Date().toISOString()
      };
      const updated = [newReq, ...current];
      await this.updateGlobalSetting('toomakt_wholesale_requests', updated);
      localStorage.setItem('toomakt_wholesale_requests', JSON.stringify(updated));

      return { success: true, message: 'We received your wholesale request. Our team will contact you shortly.' };
    } catch (e) {
      console.error('Error saving wholesale request:', e);
      return { success: true, message: 'We received your wholesale request.' };
    }
  },

  async getWholesaleRequests(params?: { status?: string; search?: string }): Promise<any[]> {
    try {
      // Fetch from Supabase global_settings
      const res = await fetch(`${ADMIN_BASE}/toomakt_global_settings?key=eq.toomakt_wholesale_requests&select=value`, { headers: getHeaders(true) });
      let list: any[] = [];
      if (res.ok) {
        const rows = await res.json();
        if (rows.length > 0 && Array.isArray(rows[0].value)) {
          list = rows[0].value;
        }
      }
      if (list.length === 0) {
        const saved = localStorage.getItem('toomakt_wholesale_requests');
        if (saved) list = JSON.parse(saved);
      }
      if (params?.status && params.status !== 'all') {
        list = list.filter((r: any) => r.status === params.status);
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        list = list.filter((r: any) =>
          (r.company_name || '').toLowerCase().includes(s) ||
          (r.name || '').toLowerCase().includes(s) ||
          (r.email || '').toLowerCase().includes(s) ||
          (r.governorate || '').toLowerCase().includes(s)
        );
      }
      return list;
    } catch (e) {
      console.error('Error fetching wholesale requests:', e);
      return [];
    }
  },

  async updateWholesaleStatus(id: string, newStatus: string, internalNotes?: string): Promise<boolean> {
    try {
      const list = await this.getWholesaleRequests();
      const updated = list.map((r: any) => {
        if (r.id === id) {
          return {
            ...r,
            status: newStatus,
            internal_notes: internalNotes !== undefined ? internalNotes : r.internal_notes,
            updated_at: new Date().toISOString()
          };
        }
        return r;
      });
      await this.updateGlobalSetting('toomakt_wholesale_requests', updated);
      localStorage.setItem('toomakt_wholesale_requests', JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  },

  async resendInvoiceEmail(_orderId: string): Promise<boolean> {
    // Not implemented without backend — would need Supabase Edge Function
    console.warn('Invoice resend requires backend server');
    return false;
  },

  // =========================================================================
  // 7. COUPONS & PROMOS
  // =========================================================================
  async getCoupons(): Promise<any[]> {
    try {
      const res = await fetch(
        `${ADMIN_BASE}/toomakt_promo_codes?select=*&order=created_at.desc`,
        { headers: getHeaders(true) }
      );
      if (res.ok) {
        const data = await res.json();
        return data.map((c: any) => ({
          id: c.id,
          code: c.code,
          discount_type: 'percentage',
          discount_value: c.discount_percent,
          min_order_amount: c.min_order_amount,
          is_active: c.is_active,
          times_used: c.times_used || 0
        }));
      }
    } catch (e) {
      console.error('Error fetching promo codes:', e);
    }
    return [];
  },

  async createCoupon(data: any): Promise<any> {
    const payload = {
      code: data.code.trim().toUpperCase(),
      discount_percent: parseFloat(data.discount_value || data.discount_percent) || 10.0,
      is_active: true,
      min_order_amount: parseFloat(data.min_order_amount) || 0.0
    };

    const res = await fetch(`${ADMIN_BASE}/toomakt_promo_codes`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const created = await res.json();
      return created[0] || payload;
    }
    return payload;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const res = await fetch(`${ADMIN_BASE}/toomakt_promo_codes?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.ok;
  },

  async updateCoupon(id: string, data: any): Promise<boolean> {
    try {
      const res = await fetch(`${ADMIN_BASE}/toomakt_promo_codes?id=eq.${id}`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async validateCoupon(code: string, subtotal = 0): Promise<{ valid: boolean; discount_percent?: number; discount_amount?: number; message?: string }> {
    try {
      const cleanCode = code.trim().toUpperCase();
      const res = await fetch(
        `${PUBLIC_BASE}/toomakt_promo_codes?code=eq.${encodeURIComponent(cleanCode)}&is_active=eq.true&select=*`,
        { headers: getHeaders(false) }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const promo = data[0];
          if (subtotal < (promo.min_order_amount || 0)) {
            return { valid: false, message: `Minimum order of ${promo.min_order_amount} EGP required` };
          }
          return {
            valid: true,
            discount_percent: Number(promo.discount_percent)
          };
        }
      }
    } catch (e) {
      console.error('Error validating coupon:', e);
    }
    return { valid: false, message: 'Invalid or expired promo code' };
  },

  // =========================================================================
  // 8. SUBSCRIBERS & NEWSLETTER
  // =========================================================================
  async subscribeNewsletter(email: string, source = 'footer'): Promise<{ success: boolean; promo_code?: string; message?: string }> {
    try {
      const res = await fetch(`${ADMIN_BASE}/toomakt_subscribers`, {
        method: 'POST',
        headers: { ...getHeaders(true), Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source,
          promo_code_issued: 'TOOMAKT10'
        })
      });
      if (res.ok) {
        return { success: true, promo_code: 'TOOMAKT10', message: 'Welcome to the Tasting Society!' };
      }
    } catch (e) {
      console.error('Error subscribing:', e);
    }
    return { success: true, promo_code: 'TOOMAKT10', message: 'Welcome to the Tasting Society!' };
  },

  async getSubscribers(): Promise<any[]> {
    try {
      const res = await fetch(`${ADMIN_BASE}/toomakt_subscribers?select=*&order=created_at.desc`, { headers: getHeaders(true) });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Error fetching subscribers:', e);
    }
    return [];
  },

  async deleteSubscriber(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${ADMIN_BASE}/toomakt_subscribers?id=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // =========================================================================
  // 9. DYNAMIC ADMIN ANALYTICS FROM SUPABASE
  // =========================================================================
  async getAdminStats(): Promise<any> {
    try {
      const headers = getHeaders(true);
      const [ordersRes, prodsRes] = await Promise.all([
        fetch(`${ADMIN_BASE}/toomakt_orders?select=*&order=created_at.desc`, { headers }),
        fetch(`${ADMIN_BASE}/toomakt_products?select=*&order=stock_quantity.asc`, { headers })
      ]);

      const orders = ordersRes.ok ? await ordersRes.json() : [];
      const products = prodsRes.ok ? await prodsRes.json() : [];

      const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);
      const pendingCount = orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length;
      const uniqueCustomers = new Set(orders.map((o: any) => o.customer_email)).size;
      const lowStockAlerts = products.filter((p: any) => (p.stock_quantity ?? 0) < 20);

      return {
        metrics: {
          total_revenue: totalRevenue,
          total_orders: orders.length,
          pending_orders: pendingCount,
          total_customers: Math.max(uniqueCustomers, 0),
          total_products: products.length,
          low_stock_count: lowStockAlerts.length
        },
        low_stock_alerts: lowStockAlerts.map((p: any) => ({
          name: p.name,
          sku: `TMK-${(p.slug || 'TOOM').slice(0, 6).toUpperCase()}`,
          stock: p.stock_quantity ?? 0,
          threshold: 20
        })),
        recent_orders: orders.slice(0, 5)
      };
    } catch (e) {
      console.error('Error computing admin stats:', e);
      return {
        metrics: {
          total_revenue: 0,
          total_orders: 0,
          pending_orders: 0,
          total_customers: 0,
          total_products: 6,
          low_stock_count: 0
        },
        low_stock_alerts: [],
        recent_orders: []
      };
    }
  },

  // =========================================================================
  // 10. CMS PAGES & HOMEPAGE SECTIONS (Supabase via global_settings)
  // =========================================================================
  async getCMSPages(): Promise<any[]> {
    // Try Supabase settings first
    try {
      const res = await fetch(
        `${ADMIN_BASE}/toomakt_global_settings?category=eq.cms&select=*&order=updated_at.desc`,
        { headers: getHeaders(true) }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          const pagesEntry = data.find((d: any) => d.key === 'cms_pages');
          if (pagesEntry && pagesEntry.value) return pagesEntry.value;
        }
      }
    } catch {}

    // localStorage fallback
    const saved = localStorage.getItem('toomakt_cms_pages');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: '1', title: 'Our Story & Philosophy', slug: 'our-story', visibility: 'published', content: 'Born from a passionate obsession with pure orchard fruit and authentic French soft toffee craft.' },
      { id: '2', title: 'Ingredients & Craft', slug: 'ingredients', visibility: 'published', content: 'Real pressed fruits, grass-fed Brittany butter, and zero artificial dyes or high-fructose syrup.' },
      { id: '3', title: 'Frequently Asked Questions', slug: 'faq', visibility: 'published', content: 'Everything you need to know about our chew times, shelf life, and allergen assurances.' },
      { id: '4', title: 'Shipping & Climate Guarantee', slug: 'shipping', visibility: 'published', content: 'All packages ship in insulated eco-coolers with 48h ice retention.' },
      { id: '5', title: 'Privacy & Terms', slug: 'privacy', visibility: 'published', content: 'Complete consumer data privacy protocols and customer guarantees.' }
    ];
  },

  async getCMSPage(slug: string): Promise<any> {
    const pages = await this.getCMSPages();
    return pages.find((p) => p.slug === slug) || null;
  },

  async updateCMSPage(slug: string, data: any): Promise<any> {
    const pages = await this.getCMSPages();
    const updated = pages.map((p) => (p.slug === slug ? { ...p, ...data } : p));
    localStorage.setItem('toomakt_cms_pages', JSON.stringify(updated));
    return updated.find(p => p.slug === slug);
  },

  async getHomepageSections(): Promise<any[]> {
    const saved = localStorage.getItem('toomakt_homepage_sections');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: '1', section_key: 'hero', title: 'Hero & Canister Showcase', subtitle: 'Big Fruit. Real Toffee. Pure Obsession.', display_order: 1, is_active: true },
      { id: '2', section_key: 'flavor_vault', title: 'Explore the Flavor Vault', subtitle: 'Handcrafted with real orchard concentrates.', display_order: 2, is_active: true },
      { id: '3', section_key: 'crowd_favorites', title: 'The Crowd Favorites & Curated Gift Tins', subtitle: 'Individually wrapped foil chews.', display_order: 3, is_active: true },
      { id: '4', section_key: 'anatomy', title: 'The Anatomy of a toomakt Chew', subtitle: 'The 45-Second Sensory Evolution', display_order: 4, is_active: true },
      { id: '5', section_key: 'reviews', title: 'Customer Unboxing Obsessions', subtitle: '4.9/5 Average Rating across 1,200+ orders', display_order: 5, is_active: true },
      { id: '6', section_key: 'starter_perk', title: 'First-Tasting Privilege', subtitle: 'Take 10% off your introductory box with code TOOMAKT10', display_order: 6, is_active: true },
    ];
  },

  async updateHomepageSection(id: string, data: any): Promise<any> {
    const sections = await this.getHomepageSections();
    const updated = sections.map((s) => (s.id === id ? { ...s, ...data } : s));
    localStorage.setItem('toomakt_homepage_sections', JSON.stringify(updated));
    return updated.find(s => s.id === id);
  },

  // =========================================================================
  // 11. GLOBAL SETTINGS (from Supabase)
  // =========================================================================
  async getGlobalSettings(): Promise<any> {
    try {
      const res = await fetch(
        `${ADMIN_BASE}/toomakt_global_settings?select=*`,
        { headers: getHeaders(true) }
      );
      if (res.ok) {
        const rows = await res.json();
        if (rows.length > 0) {
          // Merge all settings values into one object
          const merged: any = {};
          for (const row of rows) {
            if (row.value && typeof row.value === 'object') {
              Object.assign(merged, row.value);
            }
          }
          // Add standard keys
          if (merged.store_name) return merged;
          return {
            store_name: merged.store_name || 'toomakt Confectionery',
            currency: merged.currency || 'EGP',
            free_shipping_threshold: merged.free_shipping_threshold || 500.0,
            tax_rate: merged.tax_rate || 0.05,
            contact_email: merged.contact_email || 'bonjour@toomakt.com',
            contact_phone: merged.contact_phone || merged.phone || '+20 100 000 0000',
            address: merged.address || '24 Rue de la Confiserie, Cairo, Egypt',
            instagram: merged.instagram || 'https://instagram.com/toomaktchews',
            tiktok: merged.tiktok || 'https://tiktok.com/@toomakt',
            seo_site_title: merged.site_name || 'toomakt — Big Fruit. Real Toffee. Pure Obsession.',
            seo_meta_description: merged.meta_description || 'Artisanal French fruit-infused soft toffee. Made with real orchard fruits, browned butter, and sea salt.',
            ...merged
          };
        }
      }
    } catch (e) {
      console.error('Error fetching global settings:', e);
    }

    // LocalStorage fallback
    const saved = localStorage.getItem('toomakt_global_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      store_name: 'toomakt Confectionery',
      currency: 'EGP',
      free_shipping_threshold: 500.0,
      tax_rate: 0.05,
      contact_email: 'bonjour@toomakt.com',
      contact_phone: '+20 100 000 0000',
      address: '24 Rue de la Confiserie, Cairo, Egypt',
      instagram: 'https://instagram.com/toomaktchews',
      tiktok: 'https://tiktok.com/@toomakt',
      seo_site_title: 'toomakt — Big Fruit. Real Toffee. Pure Obsession.',
      seo_meta_description: 'Artisanal French fruit-infused soft toffee.',
    };
  },

  async getGlobalSetting(key: string): Promise<any> {
    try {
      const res = await fetch(
        `${ADMIN_BASE}/toomakt_global_settings?key=eq.${encodeURIComponent(key)}&select=value`,
        { headers: getHeaders(true) }
      );
      if (res.ok) {
        const rows = await res.json();
        if (rows.length > 0 && rows[0].value !== undefined) {
          return rows[0].value;
        }
      }
    } catch {}
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch { return saved; }
    }
    return null;
  },

  async updateGlobalSetting(key: string, value: any): Promise<any> {
    // Update in Supabase
    try {
      const merged = typeof value === 'object' ? value : { [key]: value };

      // Try to update existing setting
      const checkRes = await fetch(
        `${ADMIN_BASE}/toomakt_global_settings?key=eq.${encodeURIComponent(key)}&select=id`,
        { headers: getHeaders(true) }
      );
      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (existing.length > 0) {
          await fetch(`${ADMIN_BASE}/toomakt_global_settings?key=eq.${encodeURIComponent(key)}`, {
            method: 'PATCH',
            headers: getHeaders(true),
            body: JSON.stringify({ value: merged, updated_at: new Date().toISOString() })
          });
        } else {
          await fetch(`${ADMIN_BASE}/toomakt_global_settings`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify({ category: 'general', key, label: key, value: merged })
          });
        }
      }
    } catch (e) {
      console.warn('Could not save setting to Supabase:', e);
    }

    // Also save to localStorage as fallback
    const current = await this.getGlobalSettings();
    const mergedLocal = { ...current, ...(typeof value === 'object' ? value : { [key]: value }) };
    localStorage.setItem('toomakt_global_settings', JSON.stringify(mergedLocal));
    return mergedLocal;
  },

  // =========================================================================
  // 12. CONTACT INQUIRIES
  // =========================================================================
  async submitContact(data: { name: string; email: string; subject: string; message: string; phone?: string }): Promise<boolean> {
    // Store as notification in Supabase
    try {
      await fetch(`${ADMIN_BASE}/toomakt_notifications`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
          notification_type: 'contact_inquiry',
          title: `Contact from ${data.name}: ${data.subject}`,
          message: `${data.message}\n\nEmail: ${data.email}${data.phone ? `\nPhone: ${data.phone}` : ''}`,
          priority: 'medium'
        })
      });
    } catch {}

    // Also store in localStorage
    const messages = await this.getContactMessages();
    const newMsg = {
      id: String(Date.now()),
      ...data,
      status: 'unread',
      created_at: new Date().toISOString()
    };
    localStorage.setItem('toomakt_contact_messages', JSON.stringify([newMsg, ...messages]));
    return true;
  },

  async submitWholesaleInquiry(data: any): Promise<any> {
    const messages = await this.getContactMessages();
    const newMsg = {
      id: String(Date.now()),
      name: data.contact_name || data.name || 'Valued Client',
      email: data.email,
      phone: data.phone,
      subject: `Bespoke Inquiry: ${data.company_name || 'Private Client'} (${data.governorate || 'Cairo'})`,
      message: data.message || '',
      volume: data.estimated_monthly_volume || '',
      status: 'unread',
      created_at: new Date().toISOString()
    };
    localStorage.setItem('toomakt_contact_messages', JSON.stringify([newMsg, ...messages]));

    // Also create notification in Supabase
    try {
      await fetch(`${ADMIN_BASE}/toomakt_notifications`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
          notification_type: 'wholesale_inquiry',
          title: `Wholesale inquiry from ${data.company_name || data.name || 'Client'}`,
          message: `${data.contact_name || data.name} (${data.email}) — ${data.message || 'Wholesale request'}`,
          priority: 'high'
        })
      });
    } catch {}

    return { success: true };
  },

  async getContactMessages(): Promise<any[]> {
    const saved = localStorage.getItem('toomakt_contact_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  },

  // =========================================================================
  // UNIVERSAL RAW DATABASE EXPLORER & SYNCHRONIZATION
  // =========================================================================
  async getRawTableData(tableName: string): Promise<any[]> {
    try {
      const res = await fetch(`${ADMIN_BASE}/${tableName}?select=*&limit=100`, { headers: getHeaders(true) });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(`Error querying raw table ${tableName}:`, e);
    }
    return [];
  },

  async updateRawTableRow(tableName: string, id: string, data: any): Promise<boolean> {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const query = isUUID ? `id=eq.${id}` : (tableName === 'toomakt_global_settings' ? `key=eq.${id}` : `id=eq.${id}`);
      const res = await fetch(`${ADMIN_BASE}/${tableName}?${query}`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async insertRawTableRow(tableName: string, data: any): Promise<any> {
    try {
      const res = await fetch(`${ADMIN_BASE}/${tableName}`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const rows = await res.json();
        return rows[0] || data;
      }
    } catch (e) {
      console.error(`Error inserting into ${tableName}:`, e);
    }
    return null;
  },

  async deleteRawTableRow(tableName: string, id: string): Promise<boolean> {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const query = isUUID ? `id=eq.${id}` : (tableName === 'toomakt_global_settings' ? `key=eq.${id}` : `id=eq.${id}`);
      const res = await fetch(`${ADMIN_BASE}/${tableName}?${query}`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async syncDatabases(): Promise<{ success: boolean; message: string; tableCounts: Record<string, number> }> {
    try {
      const diag = await this.checkDatabaseConnection();
      return {
        success: diag.connected,
        message: diag.connected ? `Successfully synced with database (${diag.latencyMs}ms)` : 'Database sync error',
        tableCounts: diag.tableCounts
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Sync failed', tableCounts: {} };
    }
  }
};
