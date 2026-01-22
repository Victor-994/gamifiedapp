import axios from 'axios';

// Create a central instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Points to your backend
  withCredentials: true // Important for CORS
});

// Automatically add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;