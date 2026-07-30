import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Use explicit VITE_API_URL when provided, otherwise use relative paths so
// the frontend uses the same origin (works on mobile and when proxied).
const apiUrl = import.meta.env.VITE_API_URL || "";
axios.defaults.baseURL = apiUrl;

// Global axios response interceptor to handle expired/invalid JWTs
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || '';

    if (status === 401) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const isProtectedDashboard = currentPath.startsWith('/admin') || currentPath.startsWith('/hr') || currentPath.startsWith('/engineer') || currentPath.startsWith('/employee') || currentPath.startsWith('/client');

      if (isProtectedDashboard) {
        const shouldRedirect = !localStorage.getItem('token') || !localStorage.getItem('userRole');
        if (shouldRedirect) {
          if (currentPath.startsWith('/admin')) {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
