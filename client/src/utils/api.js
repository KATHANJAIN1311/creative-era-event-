import axios from 'axios';

// CRITICAL FIX: Determine API URL correctly
const getApiUrl = () => {
  // Check if we're in production
  if (window.location.hostname === 'creativeeraevents.in' || 
      window.location.hostname === 'www.creativeeraevents.in') {
    return 'https://api.creativeeraevents.in/api';
  }
  
  // Check environment variable
  if (process.env.REACT_APP_API_URL) {
    const rawApi = process.env.REACT_APP_API_URL;
    return rawApi.endsWith('/api') ? rawApi : `${rawApi}/api`;
  }
  
  // Default to localhost for development
  return 'http://localhost:3001/api';
};

const API_URL = getApiUrl();

console.log('🔗 API URL configured as:', API_URL);

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS
  timeout: 30000 // 30 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authorization token
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token if available
    const csrf = localStorage.getItem('csrfToken');
    if (csrf) {
      config.headers['X-CSRF-Token'] = csrf;
    }
    
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      message: error.message
    });
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens
      localStorage.removeItem('adminToken');
      localStorage.removeItem('csrfToken');
      
      // Redirect to login if on admin page
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/admin';
      }
    }
    
    return Promise.reject(error);
  }
);

/* =====================================================
   EVENTS API - FIXED
===================================================== */
export const fetchEvents = async () => {
  try {
    console.log('Fetching events from:', `${API_URL}/events`);
    
    const response = await fetch(`${API_URL}/events`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      mode: 'cors'
    });

    console.log('Events response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Events fetch error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Events data received:', data);
    
    // Handle different response formats
    if (data.success && data.data) {
      return { data: data.data };
    } else if (data.events) {
      return { data: data.events };
    } else if (Array.isArray(data)) {
      return { data: data };
    } else {
      return { data: [] };
    }
    
  } catch (error) {
    console.error('Error in fetchEvents:', error);
    throw error;
  }
};

export const eventsAPI = {
  getAll: () => fetchEvents(),
  
  getById: (id) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid event ID format');
    }
    return api.get(`/events/${id}`);
  },
  
  create: (data) => {
    console.log('Creating event:', data);
    return api.post('/events', data);
  },
  
  createWithImage: (formData) => {
    console.log('Creating event with image');
    return api.post('/events', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  update: (id, data) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid event ID format');
    }
    console.log('Updating event:', id);
    return api.put(`/events/${id}`, data);
  },
  
  delete: (id) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid event ID format');
    }
    console.log('Deleting event:', id);
    return api.delete(`/events/${id}`);
  },
};

/* =====================================================
   REGISTRATIONS API
===================================================== */
export const registrationsAPI = {
  create: (data) => {
    console.log('Creating registration:', data);
    return api.post('/registrations', data);
  },
  
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
  
  getByEmail: (email) => {
    return api.get(`/registrations/search?email=${encodeURIComponent(email)}`);
  },
};

/* =====================================================
   CHECK-INS API
===================================================== */
export const checkinsAPI = {
  verify: (qrData) => {
    console.log('Verifying check-in:', qrData);
    return api.post('/checkins/verify', { qrData });
  },
  
  getByEvent: (eventId) => {
    if (!eventId || typeof eventId !== 'string') {
      throw new Error('Invalid event ID format');
    }
    return api.get(`/checkins/event/${eventId}`);
  },
};

/* =====================================================
   ADMIN API
===================================================== */
export const adminAPI = {
  login: (username, password) => {
    console.log('Admin login attempt');
    return api.post('/admin/login', { username, password });
  },
  
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

/* =====================================================
   HELPER FUNCTION: TEST API CONNECTION
===================================================== */
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', API_URL);
    const response = await fetch(`${API_URL.replace('/api', '')}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors'
    });
    
    const data = await response.json();
    console.log('✅ API connection test successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ API connection test failed:', error);
    return { success: false, error: error.message };
  }
};

export default api;