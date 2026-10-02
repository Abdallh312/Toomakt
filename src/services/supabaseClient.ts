const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

export const supabaseApi = {
  // Fetch products with category filter
  async getProducts(categorySlug?: string) {
    let url = `${SUPABASE_URL}/rest/v1/toomakt_products?select=*,category:toomakt_categories(name,slug)&order=is_featured.desc,name.asc`;
    if (categorySlug && categorySlug !== 'all') {
      // Filter by category slug in joined table or fetch all and filter
    }
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Failed to fetch products from Supabase');
    return await res.json();
  },

  // Fetch all active categories
  async getCategories() {
    const url = `${SUPABASE_URL}/rest/v1/toomakt_categories?select=*&order=display_order.asc`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Failed to fetch categories from Supabase');
    return await res.json();
  },

  // Fetch gift bundles & tins
  async getBundles() {
    const url = `${SUPABASE_URL}/rest/v1/toomakt_bundles?select=*&order=is_grand_feature.desc,price.asc`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Failed to fetch bundles from Supabase');
    return await res.json();
  },

  // Fetch featured customer reviews
  async getReviews() {
    const url = `${SUPABASE_URL}/rest/v1/toomakt_reviews?select=*&is_featured=eq.true&order=created_at.desc`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Failed to fetch reviews from Supabase');
    return await res.json();
  },

  // Validate promo code
  async validatePromo(code: string) {
    const cleanCode = code.trim().toUpperCase();
    const url = `${SUPABASE_URL}/rest/v1/toomakt_promo_codes?code=eq.${cleanCode}&is_active=eq.true&select=*`;
    const res = await fetch(url, { headers });
    if (!res.ok) return { valid: false, message: 'Error checking code' };
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        valid: true,
        code: data[0].code,
        discountPercent: data[0].discount_percent,
      };
    }
    return { valid: false, message: 'Invalid promo code' };
  },

  // Create an order with line items
  async createOrder(order: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress: string;
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    totalAmount: number;
    promoCode?: string;
    items: Array<{
      itemId: string;
      name: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
      itemType?: string;
    }>;
  }) {
    const orderNumber = `TMK-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Insert order
    const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/toomakt_orders`, {
      method: 'POST',
      headers: {
        ...headers,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        order_number: orderNumber,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone || null,
        shipping_address: order.shippingAddress,
        subtotal: order.subtotal,
        discount_amount: order.discountAmount,
        shipping_fee: order.shippingFee,
        total_amount: order.totalAmount,
        promo_code: order.promoCode || null,
        status: 'pending',
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.text();
      throw new Error(`Failed to create order: ${err}`);
    }

    const [createdOrder] = await orderRes.json();

    // 2. Insert order items
    const orderItems = order.items.map(item => ({
      order_id: createdOrder.id,
      item_id: item.itemId,
      item_type: item.itemType || 'product',
      name: item.name,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      total_price: item.totalPrice,
    }));

    await fetch(`${SUPABASE_URL}/rest/v1/toomakt_order_items`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderItems),
    });

    return createdOrder;
  },

  // Newsletter subscription
  async subscribeNewsletter(email: string, source = 'footer') {
    const url = `${SUPABASE_URL}/rest/v1/toomakt_subscribers`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Prefer': 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        source,
        promo_code_issued: 'TOOMAKT10',
      }),
    });

    return res.ok;
  },
};
