// Centralized API Base URL configuration
// In development: defaults to live Render URL or import.meta.env.VITE_API_URL
// In production on Vercel: configure VITE_API_URL in Vercel environment variables if needed
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://sankalp-backend-r2sj.onrender.com").replace(/\/+$/, "");

export default API_BASE_URL;
