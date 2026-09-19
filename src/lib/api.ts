// MongoDB API client
// Uses VITE_API_URL env var for production (Vercel), falls back to localhost for dev
const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

export const api = {
  // Products
  async getProducts() {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch products');
    return data.products;
  },

  async getProductBySlug(slug: string) {
    const response = await fetch(`${API_URL}/products?slug=${slug}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch product');
    return data.products[0];
  },

  async getProductsByCategory(category: string) {
    const response = await fetch(`${API_URL}/products?category=${category}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch products');
    return data.products;
  },

  // Orders
  async createOrder(orderData: any) {
    const response = await fetch(`${API_URL}/orders`, {
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
    // Vercel: POST /api/promo-codes?action=validate
    // Localhost: POST /api/promo-codes/validate
    const isVercel = !API_URL.includes('localhost');
    const url = isVercel
      ? `${API_URL}/promo-codes?action=validate`
      : `${API_URL}/promo-codes/validate`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Invalid promo code');
    return data.promoCode;
  },

  async usePromoCode(code: string) {
    // Vercel: POST /api/promo-codes?action=use
    // Localhost: POST /api/promo-codes/use
    const isVercel = !API_URL.includes('localhost');
    const url = isVercel
      ? `${API_URL}/promo-codes?action=use`
      : `${API_URL}/promo-codes/use`;

    const response = await fetch(url, {
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
    const response = await fetch(`${API_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to subscribe');
    return data;
  },
};
