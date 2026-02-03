import axios from 'axios';

// Normalize the API base URL: ensure it ends with '/api'
const rawApiUrl = process.env.REACT_APP_API_URL || '';
const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});


// Add tokens to requests (Authorization + CSRF)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const csrf = localStorage.getItem('csrfToken');
  if (csrf) {
    config.headers['X-CSRF-Token'] = csrf;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.baseURL);
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
    return Promise.reject(error);
  }
);

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid event ID format');
    }
    return api.get(`/events/${id}`);
  },
  create: (data) => api.post('/events', data),
  createWithImage: (formData) => api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid event ID format');
    }
    return api.put(`/events/${id}`, data);
  },

  delete: (id) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid event ID format');
    }
    return api.delete(`/events/${id}`);
  },

};

// Registrations API
export const registrationsAPI = {
  create: (data) => api.post('/registrations', data),
  getById: (id) => {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid registration ID format');
  }
  return api.get(`/registrations/${id}`);
},
getByEvent: (eventId) => {
  if (!eventId || typeof eventId !== 'string') {
    throw new Error('Invalid event ID format');
  }
  return api.get(`/registrations/event/${eventId}`);
},

  getByEmail: (email) => api.get(`/registrations/search?email=${encodeURIComponent(email)}`),
};

// Check-ins API
export const checkinsAPI = {
  verify: (qrData) => api.post('/checkins/verify', { qrData }),
  getByEvent: (eventId) => api.get(`/checkins/event/${eventId}`),
};

// Admin API
export const adminAPI = {
  getDashboard: (eventId) => {
    if (!eventId || typeof eventId !== 'string') {
      throw new Error('Invalid event ID format');
    }
    return api.get(`/admin/dashboard/${eventId}`);
  },
  exportRegistrations: (eventId) => {
    if (!eventId || typeof eventId !== 'string') {
      throw new Error('Invalid event ID format');
    }
    return api.get(`/admin/export/registrations/${eventId}`);
  },
  exportCheckins: (eventId) => {
    if (!eventId || typeof eventId !== 'string') {
      throw new Error('Invalid event ID format');
    }
    return api.get(`/admin/export/checkins/${eventId}`);
  },
};

export default api;