import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
});

// INTERCEPTOR: This runs automatically before every single request
apiClient.interceptors.request.use((config) => {
  // 1. Look in the browser's local storage for our VIP wristband
  const token = localStorage.getItem('wolfguard_token');
  
  // 2. If we have one, attach it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;