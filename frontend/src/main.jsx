import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

const normalizeApiBaseUrl = (value) => {
  if (!value) return '';
  return value.replace(/\/+$/, '');
};

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isLocalDevHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
const isLocalNetworkHost = hostname.endsWith('.local') || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.');
const fallbackApiUrl = configuredApiUrl
  ? configuredApiUrl
  : isLocalDevHost || isLocalNetworkHost
  ? `${window.location.protocol}//${hostname}:5000`
  : `${window.location.protocol}//${hostname}`;

axios.defaults.baseURL = normalizeApiBaseUrl(configuredApiUrl || fallbackApiUrl);

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
