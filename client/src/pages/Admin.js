import React, { useState, useEffect } from 'react';
import { eventsAPI, adminAPI } from '../utils/api';
import AdminLogin from '../components/AdminLogin';
import toast from 'react-hot-toast';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [consultationFilter, setConsultationFilter] = useState('all');
  const [registrationFilter, setRegistrationFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    maxCapacity: 1000,
    ticketTiers: []
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchDashboardData(selectedEvent.eventId);
    }
    if (activeTab === 'consultations') {
      fetchConsultations();
    }
    if (activeTab === 'registrations' && selectedEvent) {
      fetchRegistrations();
    }
  }, [selectedEvent, activeTab]);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    setIsAuthenticated(true);
    fetchEvents();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setAdmin(null);
    setEvents([]);
    setSelectedEvent(null);
    setDashboardData(null);
  };

  const fetchEvents = async () => {
    try {
      console.log('Fetching events from:', process.env.REACT_APP_API_URL);
      const response = await eventsAPI.getAll();
      console.log('Events response:', response);
      
      const eventsData = Array.isArray(response.data) ? response.data : [];
      setEvents(eventsData);
      
      if (eventsData.length > 0 && !selectedEvent) {
        setSelectedEvent(eventsData[0]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (eventId) => {
    try {
      const response = await adminAPI.getDashboard(eventId);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchConsultations = async () => {
    try {
      const rawApi = process.env.REACT_APP_API_URL;
      const API_URL = rawApi.endsWith('/api') ? rawApi : `${rawApi.replace(/\/$/, '')}/api`;
      const filter = consultationFilter === 'all' ? '' : `?status=${consultationFilter}`;
      const response = await fetch(`${API_URL}/consultations${filter}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setConsultations(data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const rawApi = process.env.REACT_APP_API_URL;
      const API_URL = rawApi.endsWith('/api') ? rawApi : `${rawApi.replace(/\/$/, '')}/api`;
      const response = await fetch(`${API_URL}/registrations/event/${selectedEvent.eventId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setRegistrations([]);
    }
  };

  const updateConsultationStatus = async (id, status) => {
    try {
      const rawApi = process.env.REACT_APP_API_URL;
      const API_URL = rawApi.endsWith('/api') ? rawApi : `${rawApi.replace(/\/$/, '')}/api`;
      await fetch(`${API_URL}/consultations/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'X-CSRF-Token': localStorage.getItem('csrfToken') || ''
        },
        body: JSON.stringify({ status })
      });

      toast.success('Status updated successfully');
      fetchConsultations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCheckIn = async (registrationId) => {
    try {
      if (!registrationId || typeof registrationId !== 'string' || !/^[A-Z0-9]{8}$/.test(registrationId)) {
        toast.error('Invalid registration ID');
        return;
      }

      const rawApi = process.env.REACT_APP_API_URL;
      const API_URL = rawApi.endsWith('/api') ? rawApi : `${rawApi.replace(/\/$/, '')}/api`;
      const response = await fetch(`${API_URL}/registrations/${registrationId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'X-CSRF-Token': localStorage.getItem('csrfToken') || ''
        },
        body: JSON.stringify({ status: 'checkedIn' })
      });    
      
      if (response.ok) {
        toast.success('User checked in successfully!');
        fetchDashboardData(selectedEvent.eventId);
        if (activeTab === 'registrations') {
          fetchRegistrations();
        }
      } else {
        const err = await response.json().catch(() => null);
        toast.error(err?.message || 'Failed to check in user');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Error checking in user');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    if (!newEvent.name || !newEvent.date || !newEvent.time || !newEvent.venue || !newEvent.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      let response;
      if (selectedImage) {
        const formData = new FormData();
        Object.keys(newEvent).forEach(key => {
          if (key === 'ticketTiers') {
            formData.append(key, JSON.stringify(newEvent[key]));
          } else {
            formData.append(key, newEvent[key]);
          }
        });
        formData.append('image', selectedImage);
        response = await eventsAPI.createWithImage(formData);
      } else {
        response = await eventsAPI.create(newEvent);
      }
      
      toast.success('Event created successfully!');
      setShowCreateForm(false);
      setNewEvent({
        name: '',
        date: '',
        time: '',
        venue: '',
        description: '',
        maxCapacity: 1000,
        ticketTiers: []
      });
      setSelectedImage(null);
      fetchEvents();
    } catch (error) {
      console.error('Event creation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error creating event';
      toast.error(errorMessage);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await eventsAPI.delete(eventId);
        toast.success('Event deleted successfully!');
        if (selectedEvent?.eventId === eventId) {
          setSelectedEvent(null);
        }
        fetchEvents();
      } catch (error) {
        console.error('Event deletion error:', error);
        toast.error('Error deleting event');
      }
    }
  };

  const exportData = async (type) => {
    try {
      const response = type === 'registrations' 
        ? await adminAPI.exportRegistrations(selectedEvent.eventId)
        : await adminAPI.exportCheckins(selectedEvent.eventId);
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + Object.keys(response.data.data[0] || {}).join(",") + "\n"
        + response.data.data.map(row => Object.values(row).join(",")).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${response.data.eventName}-${type}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${type} data exported successfully!`);
    } catch (error) {
      toast.error(`Error exporting ${type} data`);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600">Admin dashboard content goes here...</p>
            {selectedEvent && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Selected Event: {selectedEvent.name}</h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;