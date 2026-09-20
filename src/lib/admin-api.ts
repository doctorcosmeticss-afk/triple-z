// Admin API client — uses TanStack Start server routes (/api/admin/*)
// Relative URLs work on both Vercel and local dev
export const ADMIN_API_URL = '/api/admin';

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
