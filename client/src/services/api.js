import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Trips API
export const tripsAPI = {
  getAll: () => api.get('/trips'),
  getById: (id) => api.get(`/trips/${id}`),
  getByShareId: (shareId) => api.get(`/trips/share/${shareId}`),
  create: (data) => api.post('/trips', data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`)
};

// AI API
export const aiAPI = {
  chat: (message, conversationHistory) => api.post('/ai/chat', { message, conversationHistory }),
  form: (data) => api.post('/ai/form', data),
  surprise: (data) => api.post('/ai/surprise', data)
};

export default api;