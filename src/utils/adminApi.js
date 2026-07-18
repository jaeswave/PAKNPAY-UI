import axios from 'axios';

// Deliberately separate from utils/api.js — that instance auto-attaches the
// attendant/owner JWT (parkpay_token). Admin endpoints need a different
// token (parkpay_admin_token, role: platform_admin), so this keeps the two
// completely independent rather than trying to make one interceptor branch
// between two unrelated auth schemes.
const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('parkpay_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default adminApi;
