// Admin API client
// - IMPORTANT: Set VITE_API_URL in Vercel Dashboard → Settings → Environment Variables
//   Value: https://your-project.vercel.app/api
// - Development: automatically uses localhost:5000 (no config needed)
export const ADMIN_API_URL: string = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

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
