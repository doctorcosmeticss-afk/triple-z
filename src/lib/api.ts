// API client — uses TanStack Start server routes (/api/*)
// Works on Vercel (SSR) and locally. No external server needed.
const API_BASE = '';

export const api = {
  // Products
  async getProducts() {
    const response = await fetch(`${API_BASE}/api/products`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch products');
    return data.products;
  },

  async getProductBySlug(slug: string) {
    const response = await fetch(`${API_BASE}/api/products?slug=${slug}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch product');
    return data.products?.[0];
  },

  async getProductsByCategory(category: string) {
    const response = await fetch(`${API_BASE}/api/products?category=${encodeURIComponent(category)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch products');
    return data.products;
  },

  // Orders
  async createOrder(orderData: any) {
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create order');
    return data.order;
  },

  // Promo Codes
  async validatePromoCode(code: string) {
    const response = await fetch(`${API_BASE}/api/promo-codes?action=validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Invalid promo code');
    return data.promoCode;
  },

  async usePromoCode(code: string) {
    const response = await fetch(`${API_BASE}/api/promo-codes?action=use`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to use promo code');
    return data.promoCode;
  },

  // Newsletter
  async subscribeNewsletter(email: string) {
    const response = await fetch(`${API_BASE}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to subscribe');
    return data;
  },
};
