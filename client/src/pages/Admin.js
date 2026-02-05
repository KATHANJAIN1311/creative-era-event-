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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Logout
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Event Selector */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select Event</h2>
                <button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  {showCreateForm ? 'Cancel' : 'Create New Event'}
                </button>
              </div>
              
              {showCreateForm && (
                <form onSubmit={handleCreateEvent} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Event Name" value={newEvent.name} onChange={(e) => setNewEvent({...newEvent, name: e.target.value})} className="input-field" required />
                    <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="input-field" required />
                    <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} className="input-field" required />
                    <input type="text" placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})} className="input-field" required />
                    <textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} className="input-field col-span-2" rows="3" required />
                    <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} className="input-field col-span-2" />
                  </div>
                  <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Create Event</button>
                </form>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {events.map(event => (
                  <div key={event.eventId} className={`p-4 border-2 rounded-lg cursor-pointer ${selectedEvent?.eventId === event.eventId ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`} onClick={() => setSelectedEvent(event)}>
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.eventId); }} className="mt-2 text-red-600 text-sm hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            {selectedEvent && (
              <>
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="flex border-b">
                    {['dashboard', 'registrations', 'consultations'].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 font-medium ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && dashboardData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 text-sm">Total Registrations</h3>
                        <p className="text-3xl font-bold text-blue-600">{dashboardData.data?.statistics?.totalRegistrations || 0}</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 text-sm">Checked In</h3>
                        <p className="text-3xl font-bold text-green-600">{dashboardData.data?.statistics?.checkedIn || 0}</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 text-sm">Pending</h3>
                        <p className="text-3xl font-bold text-yellow-600">{dashboardData.data?.statistics?.pending || 0}</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 text-sm">Check-in Rate</h3>
                        <p className="text-3xl font-bold text-purple-600">{dashboardData.data?.statistics?.checkInRate || 0}%</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold mb-4">Recent Registrations</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead><tr className="border-b"><th className="text-left py-2">Name</th><th className="text-left py-2">Email</th><th className="text-left py-2">Ticket</th><th className="text-left py-2">Status</th></tr></thead>
                          <tbody>{dashboardData.data?.recentRegistrations?.map(reg => (<tr key={reg._id} className="border-b"><td className="py-2">{reg.name}</td><td className="py-2">{reg.email}</td><td className="py-2">{reg.ticketTier}</td><td className="py-2"><span className={`px-2 py-1 rounded text-xs ${reg.isCheckedIn ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{reg.isCheckedIn ? 'Checked In' : 'Pending'}</span></td></tr>))}</tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Registrations Tab */}
                {activeTab === 'registrations' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Registrations</h3>
                      <button onClick={() => exportData('registrations')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Export CSV</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead><tr className="border-b"><th className="text-left py-2">ID</th><th className="text-left py-2">Name</th><th className="text-left py-2">Email</th><th className="text-left py-2">Phone</th><th className="text-left py-2">Status</th><th className="text-left py-2">Action</th></tr></thead>
                        <tbody>{registrations.map(reg => (<tr key={reg._id} className="border-b"><td className="py-2">{reg.registrationId}</td><td className="py-2">{reg.name}</td><td className="py-2">{reg.email}</td><td className="py-2">{reg.phone}</td><td className="py-2"><span className={`px-2 py-1 rounded text-xs ${reg.isCheckedIn ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{reg.isCheckedIn ? 'Checked In' : 'Pending'}</span></td><td className="py-2">{!reg.isCheckedIn && <button onClick={() => handleCheckIn(reg.registrationId)} className="text-blue-600 hover:underline text-sm">Check In</button>}</td></tr>))}</tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Consultations Tab */}
                {activeTab === 'consultations' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Consultation Requests</h3>
                    <div className="space-y-4">
                      {consultations.map(cons => (
                        <div key={cons._id} className="border rounded-lg p-4">
                          <div className="flex justify-between">
                            <div><h4 className="font-semibold">{cons.name}</h4><p className="text-sm text-gray-600">{cons.email} | {cons.phone}</p><p className="text-sm mt-2">{cons.message}</p></div>
                            <select value={cons.status} onChange={(e) => updateConsultationStatus(cons._id, e.target.value)} className="h-10 border rounded px-2"><option value="pending">Pending</option><option value="contacted">Contacted</option><option value="completed">Completed</option></select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;