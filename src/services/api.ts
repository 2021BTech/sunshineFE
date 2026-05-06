import axios from 'axios';

// API base URL - fallback only for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Only log in development
const isDev = import.meta.env.DEV;

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    if (isDev) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => {
    if (isDev) {
      console.error('Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (isDev) {
      console.error('Response Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;