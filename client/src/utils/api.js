import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  createWithImage: (formData) => api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// Registrations API
export const registrationsAPI = {
  create: (data) => api.post('/registrations', data),
  getById: (id) => api.get(`/registrations/${id}`),
  getByEvent: (eventId) => api.get(`/registrations/event/${eventId}`),
  getByEmail: (email) => api.get(`/registrations/search?email=${encodeURIComponent(email)}`),
};

// Check-ins API
export const checkinsAPI = {
  verify: (qrData) => api.post('/checkins/verify', { qrData }),
  getByEvent: (eventId) => api.get(`/checkins/event/${eventId}`),
};

// Admin API
export const adminAPI = {
  getDashboard: (eventId) => api.get(`/admin/dashboard/${eventId}`),
  exportRegistrations: (eventId) => api.get(`/admin/export/registrations/${eventId}`),
  exportCheckins: (eventId) => api.get(`/admin/export/checkins/${eventId}`),
};

export default api;