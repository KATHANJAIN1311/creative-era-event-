import { useState, useEffect } from 'react';
import { eventsAPI, adminAPI } from '../utils/api';
import AdminLogin from '../components/AdminLogin';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Download, 
  Plus,
  TrendingUp,
  Clock,
  MapPin,
  Building,
  CheckCircle,
  QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
  
  // Test API connection
  const testAPIConnection = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
      const data = await response.json();
      console.log('API Health Check:', data);
      toast.success('API connection successful!');
    } catch (error) {
      console.error('API connection failed:', error);
      toast.error('API connection failed!');
    }
  };

  // fetchEvents is stable in this component scope; allow it in effect without exhaustive-deps noise
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, []);

  // fetchDashboardData, fetchConsultations and fetchRegistrations are stable helpers
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const filter = consultationFilter === 'all' ? '' : `?status=${consultationFilter}`;
      const response = await fetch(`/api/consultations${filter}`);
      const data = await response.json();
      setConsultations(data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  const fetchRegistrations = async () => {
  try {
    const response = await fetch(`/api/registrations/event/${selectedEvent.eventId}`);
    const data = await response.json();
    setRegistrations(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    setRegistrations([]);
  }
};


  const updateConsultationStatus = async (id, status) => {
    try {
      await fetch(`/api/consultations/${id}/status`, {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    'X-CSRF-Token': 'admin-action'
  },
  body: JSON.stringify({ status })
});

      toast.success('Status updated successfully');
      fetchConsultations();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCheckIn = async (registrationId) => {
    try {
     // Validate registrationId to prevent SSRF
if (!registrationId || typeof registrationId !== 'string' || !/^[A-Z0-9]{8}$/.test(registrationId)) {
  toast.error('Invalid registration ID');
  return;
}

const response = await fetch(`/api/registrations/${registrationId}/status`, {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    'X-CSRF-Token': 'admin-action'
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
        toast.error('Failed to check in user');
      }
    } catch (error) {
      toast.error('Error checking in user');
    }
  };



  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newEvent.name || !newEvent.date || !newEvent.time || !newEvent.venue || !newEvent.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      let response;
      if (selectedImage) {
        const formData = new FormData();
        Object.keys(newEvent).forEach(key => {
          formData.append(key, newEvent[key]);
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

  // Chart data
  const hourlyCheckinsData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Check-ins',
        data: Array.from({ length: 24 }, (_, i) => {
          const hourData = dashboardData?.hourlyCheckins?.find(h => h._id === i);
          return hourData ? hourData.count : 0;
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const registrationTypeData = {
    labels: ['Online', 'Kiosk'],
    datasets: [
      {
        data: [
          dashboardData?.statistics?.onlineRegistrations || 0,
          dashboardData?.statistics?.kioskRegistrations || 0
        ],
        backgroundColor: ['#3b82f6', '#10b981'],
        borderWidth: 0,
      },
    ],
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 sm:space-y-6 p-4 sm:p-0">
        <div className="h-6 sm:h-8 bg-gray-200 rounded w-2/3 sm:w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-48 sm:h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
            <span className="hidden sm:inline">Admin Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome, {admin?.username}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4">
          <a
            href="/checkin"
            className="btn-secondary flex items-center justify-center space-x-2 min-h-[44px] text-sm"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">QR Check-In</span>
            <span className="sm:hidden">Check-In</span>
          </a>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center justify-center space-x-2 min-h-[44px] text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Event</span>
            <span className="sm:hidden">Create</span>
          </button>
          <button
            onClick={handleLogout}
            className="btn-secondary min-h-[44px] text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto px-4 sm:px-6 -mb-px">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap min-h-[44px] ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap min-h-[44px] ${
                activeTab === 'registrations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Registrations
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap min-h-[44px] ${
                activeTab === 'consultations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Consultations
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap min-h-[44px] ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Events
            </button>
          </nav>
        </div>
      </div>

      {/* Event Selection */}
      {events.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Select Event</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event.eventId}
                className={`relative p-4 rounded-lg border-2 transition-colors ${
                  selectedEvent?.eventId === event.eventId
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="text-left w-full"
                >
                  <h3 className="font-semibold text-gray-900">{event.name}</h3>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.venue}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.eventId)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                  title="Delete Event"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {activeTab === 'dashboard' && selectedEvent && dashboardData && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.statistics.totalRegistrations}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Checked In</p>
                  <p className="text-3xl font-bold text-green-600">
                    {dashboardData.statistics.totalCheckins}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {dashboardData.statistics.attendanceRate}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Online Registrations</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {dashboardData.statistics.onlineRegistrations}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Hourly Check-ins</h3>
              <div className="h-48 sm:h-64">
                <Line data={hourlyCheckinsData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Registration Types</h3>
              <div className="h-48 sm:h-64 flex items-center justify-center">
                <Doughnut data={registrationTypeData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Registrations</h3>
                <button
                  onClick={() => exportData('registrations')}
                  className="btn-secondary flex items-center space-x-1 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
              <div className="space-y-3">
                {dashboardData.recentRegistrations.slice(0, 5).map((reg) => (
                  <div key={reg.registrationId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{reg.name}</p>
                      <p className="text-sm text-gray-600">{reg.email}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          reg.registrationType === 'online' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {reg.registrationType}
                        </span>
                        {reg.isCheckedIn && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Checked In
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {!reg.isCheckedIn ? (
                        <button
                          onClick={() => handleCheckIn(reg.registrationId)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          Check In
                        </button>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Checked In
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Check-ins</h3>
                <button
                  onClick={() => exportData('checkins')}
                  className="btn-secondary flex items-center space-x-1 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
              <div className="space-y-3">
                {dashboardData.recentCheckins.slice(0, 5).map((checkin) => (
                  <div key={checkin.checkinId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{checkin.registration?.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(checkin.checkinTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Checked In
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Registrations Tab */}
      {activeTab === 'registrations' && selectedEvent && (
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Event Registrations - {selectedEvent.name}</h2>
            <select
              value={registrationFilter}
              onChange={(e) => setRegistrationFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-h-[44px]"
            >
              <option value="all">All Registrations</option>
              <option value="checkedIn">Checked In</option>
              <option value="pending">Pending Check-In</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
  {(Array.isArray(registrations) ? registrations : [])
    .filter(reg => {
      if (registrationFilter === 'checkedIn') return reg.isCheckedIn;
      if (registrationFilter === 'pending') return !reg.isCheckedIn;
      return true;
    })
    .map((registration) => (
      <tr key={registration.registrationId}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {registration.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {registration.email}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {registration.phone}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            registration.registrationType === 'online'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {registration.registrationType}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            registration.isCheckedIn
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {registration.isCheckedIn ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Checked In
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </>
            )}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          {!registration.isCheckedIn ? (
            <button
              onClick={() => handleCheckIn(registration.registrationId)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Check In</span>
            </button>
          ) : (
            <div className="text-green-600 flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Checked In</span>
              {registration.checkedAt && (
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(registration.checkedAt).toLocaleString()}
                </span>
              )}
            </div>
          )}
        </td>
      </tr>
    ))}
</tbody>

              </table>
            </div>
            {registrations.filter(reg => {
              if (registrationFilter === 'checkedIn') return reg.isCheckedIn;
              if (registrationFilter === 'pending') return !reg.isCheckedIn;
              return true;
            }).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No registrations found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Consultations Tab */}
      {activeTab === 'consultations' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Consultation Requests</h2>
            <select
              value={consultationFilter}
              onChange={(e) => {
                setConsultationFilter(e.target.value);
                fetchConsultations();
              }}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-h-[44px]"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="checkedIn">Checked-In</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultations.map((consultation) => (
                  <tr key={consultation.consultationId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {consultation.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {consultation.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {consultation.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(consultation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        consultation.status === 'checkedIn'
                          ? 'bg-blue-100 text-blue-800'
                          : consultation.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {consultation.status === 'checkedIn' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : consultation.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {consultation.status === 'checkedIn' ? 'Checked-In' : consultation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {consultation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateConsultationStatus(consultation.consultationId, 'checkedIn')}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Mark as Checked-In
                          </button>
                          <button
                            onClick={() => updateConsultationStatus(consultation.consultationId, 'completed')}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Mark Completed
                          </button>
                        </>
                      )}
                      <a
                        href={`mailto:${consultation.email}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Contact
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            {consultations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No consultation requests found.
              </div>
            )}
          </div>
        </div>
      )}
      {/* Events Tab */}
{activeTab === 'events' && (
  <div>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Event Management</h2>
      <button
        onClick={() => setShowCreateForm(true)}
        className="btn-primary flex items-center justify-center space-x-2 min-h-[44px] text-sm"
      >
        <Plus className="w-4 h-4" />
        <span>Create Event</span>
      </button>
    </div>

    {/* Upcoming Events */}
    <div className="mb-6 sm:mb-8">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {events
          .filter(event => {
            const eventDate = new Date(event.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return eventDate >= today;
          })
          .map((event) => (
            <div key={event.eventId} className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{event.name}</h4>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.venue}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-blue-600 font-medium">
                    {event.registrationCount || 0} registered
                  </span>
                  <span className="text-gray-500 mx-2">•</span>
                  <span className="text-green-600 font-medium">
                    {event.checkedInCount || 0} checked in
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium min-h-[44px] px-2 py-1"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.eventId)}
                    className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium min-h-[44px] px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {events.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
      }).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No upcoming events found.</p>
        </div>
      )}
    </div>

    {/* Past Events */}
    <div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Past Events</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registrations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-ins
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events
              .filter(event => {
                const eventDate = new Date(event.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return eventDate < today;
              })
              .map((event) => {
                const registrations = event.registrationCount || 0;
                const checkins = event.checkedInCount || 0;
                const attendanceRate = registrations > 0 ? Math.round((checkins / registrations) * 100) : 0;
                
                return (
                  <tr key={event.eventId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.venue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registrations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {checkins}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        attendanceRate >= 80 
                          ? 'bg-green-100 text-green-800'
                          : attendanceRate >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attendanceRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-3">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm min-h-[44px] px-2 py-1"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.eventId)}
                          className="text-red-600 hover:text-red-900 text-xs sm:text-sm min-h-[44px] px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
          </table>
        </div>
        {events.filter(event => {
          const eventDate = new Date(event.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return eventDate < today;
        }).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No past events found.</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}


      {/* Create Event Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Create New Event</h2>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Event Name"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  className="input-field pl-10"
                  required
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="input-field pl-10"
                  required
                />
              </div>
              
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="input-field pl-10"
                  required
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Venue"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                  className="input-field pl-10"
                  required
                />
              </div>
              
              <div className="relative">
                <Building className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="input-field pl-10 pt-3 h-24 resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type.startsWith('image/')) {
                      setSelectedImage(file);
                    } else {
                      toast.error('Please select a valid image file');
                      e.target.value = '';
                    }
                  }}
                  className="input-field"
                />
                {selectedImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">
                      Selected: {selectedImage.name}
                    </p>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="w-32 h-24 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              
              {/* Ticket Pricing Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ticket Pricing (Optional)</h3>
                  <button
                    type="button"
                    onClick={() => setNewEvent({...newEvent, ticketTiers: [...newEvent.ticketTiers, { name: '', price: 0, seats: 0 }]})}
                    className="btn-secondary text-sm"
                  >
                    + Add Tier
                  </button>
                </div>
                
                {newEvent.ticketTiers.map((tier, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3 p-3 border rounded-lg">
                    <input
                      type="text"
                      placeholder="Tier Name (e.g., VIP, General)"
                      value={tier.name}
                      onChange={(e) => {
                        const updatedTiers = [...newEvent.ticketTiers];
                        updatedTiers[index].name = e.target.value;
                        setNewEvent({...newEvent, ticketTiers: updatedTiers});
                      }}
                      className="input-field"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        placeholder="Price"
                        value={tier.price}
                        onChange={(e) => {
                          const updatedTiers = [...newEvent.ticketTiers];
                          updatedTiers[index].price = parseInt(e.target.value) || 0;
                          setNewEvent({...newEvent, ticketTiers: updatedTiers});
                        }}
                        className="input-field pl-8"
                        min="0"
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Seats"
                      value={tier.seats}
                      onChange={(e) => {
                        const updatedTiers = [...newEvent.ticketTiers];
                        updatedTiers[index].seats = parseInt(e.target.value) || 0;
                        setNewEvent({...newEvent, ticketTiers: updatedTiers});
                      }}
                      className="input-field"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedTiers = newEvent.ticketTiers.filter((_, i) => i !== index);
                        setNewEvent({...newEvent, ticketTiers: updatedTiers});
                      }}
                      className="btn-secondary text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              

              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button type="submit" className="flex-1 btn-primary min-h-[44px]">
                  Create Event
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 btn-secondary min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* No Events State */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Created</h3>
          <p className="text-gray-600 mb-4">Create your first event to start managing registrations.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create First Event
          </button>
        </div>
      )}
    </div>
  );
};

export default Admin;