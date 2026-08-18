import axios from 'axios';

const API_BASE = 'https://civicpulse-6bsu.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civicpulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export const issueAPI = {
  getAll: (params) => api.get('/issues', { params }),
  getById: (id) => api.get(`/issues/${id}`),
  create: (data) => api.post('/issues', data),
  update: (id, data) => api.patch(`/issues/${id}`, data),
  delete: (id) => api.delete(`/issues/${id}`)
};

export const aiAPI = {
  analyze: (data) => api.post('/ai/analyze', data)
};

export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getTrends: () => api.get('/analytics/trends'),
  getHotspots: () => api.get('/analytics/hotspots')
};

export const clusterAPI = {
  getAll: () => api.get('/clusters'),
  getById: (id) => api.get(`/clusters/${id}`),
  merge: (data) => api.post('/clusters/merge', data)
};

export default api;
