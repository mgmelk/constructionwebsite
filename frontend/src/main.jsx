import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Global axios response interceptor to handle expired/invalid JWTs
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || '';
    if (status === 401) {
      // clear auth and redirect to admin login
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('adminName');
      if (typeof window !== 'undefined') {
        // show short notice in dev to help debugging
        if (msg.toLowerCase().includes('expired')) {
          // eslint-disable-next-line no-alert
          alert('Session expired — please sign in again.');
        }
        window.location.href = '/admin/login';
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
