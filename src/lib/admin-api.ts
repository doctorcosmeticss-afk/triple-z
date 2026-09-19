// Admin API client - uses env var for Vercel, localhost for dev
export const ADMIN_API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

export function getAuthHeaders() {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function getAuthHeadersOnly() {
  const token = localStorage.getItem('adminToken');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
