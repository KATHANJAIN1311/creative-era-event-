import React, { useState } from 'react';
import { Search, CheckCircle, Clock, Calendar, AlertCircle, Mail, Phone, QrCode, Eye, EyeOff } from 'lucide-react';

const MyBooking = () => {
  const [email, setEmail] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [showQRCodes, setShowQRCodes] = useState({});

  const handleSearch = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setRegistrations([]);

    try {
      const rawApi = process.env.REACT_APP_API_URL;
      const API_URL = rawApi.endsWith('/api') ? rawApi : `${rawApi.replace(/\/$/, '')}/api`;
      const response = await fetch(`${API_URL}/registrations/search?email=${encodeURIComponent(email.trim())}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const registrationsData = Array.isArray(data) ? data : [];
        setRegistrations(registrationsData);
        setError('');
        
        if (registrationsData.length === 0) {
          setError('No registrations found for this email address');
        }
      } else {
        setError('No registrations found for this email address');
        setRegistrations([]);
      }
      
      setSearched(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };



  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusBadge = (isCheckedIn) => {
    if (isCheckedIn) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Checked In
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4 mr-1" />
          Registered
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">My Registrations</h1>
          <p className="text-black">Enter your email to view your event registrations</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5" />
            <span>{loading ? 'Searching...' : 'Search Registrations'}</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Registration Details */}
        {registrations.length > 0 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-black">Your Registrations ({registrations.length})</h2>
              <div className="text-sm text-black">
                Found {Array.isArray(registrations) ? registrations.filter(r => r.isCheckedIn).length : 0} checked-in, {Array.isArray(registrations) ? registrations.filter(r => !r.isCheckedIn).length : 0} pending
              </div>
            </div>
            {registrations.map((registration) => (
              <div key={registration.registrationId} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black">{registration.eventName}</h3>
                    <p className="text-black">{registration.name}</p>
                  </div>
                  {getStatusBadge(registration.isCheckedIn)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-black">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{registration.email}</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{registration.phoneNumber || registration.phone}</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {registration.eventDate ? formatDate(registration.eventDate) : 'Date TBD'}
                    </span>
                  </div>
                  <div className="flex items-center text-black">
                    <QrCode className="w-4 h-4 mr-2" />
                    <span className="text-sm font-mono">{registration.registrationId}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-sm text-black mb-3">
                    <span>Registered: {formatDate(registration.createdAt)}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      registration.registrationType === 'online' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {registration.registrationType} registration
                    </span>
                  </div>
                  
                  {registration.isCheckedIn && registration.checkedAt && (
                    <div className="text-sm text-green-600 mb-3">
                      ✓ Checked in: {new Date(registration.checkedAt).toLocaleString()}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setShowQRCodes(prev => ({
                        ...prev,
                        [registration.registrationId]: !prev[registration.registrationId]
                      }))}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {showQRCodes[registration.registrationId] ? (
                        <><EyeOff className="w-4 h-4" /> Hide QR Code</>
                      ) : (
                        <><Eye className="w-4 h-4" /> Show QR Code</>
                      )}
                    </button>
                    
                    {registration.whatsappSent && (
                      <span className="text-xs text-green-600">📱 Sent via WhatsApp</span>
                    )}
                  </div>
                  
                  {showQRCodes[registration.registrationId] && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-xs text-gray-500 mb-2">Your QR Code:</div>
                      {registration.qrCode ? (
                        <div className="bg-white p-4 rounded-lg inline-block">
                          <img 
                            src={registration.qrCode} 
                            alt="Registration QR Code" 
                            className="w-48 h-48 mx-auto"
                          />
                        </div>
                      ) : (
                        <div className="text-red-500 text-sm">QR Code not available</div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Show this QR code at the event for check-in
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {searched && registrations.length === 0 && !error && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">No Registrations Found</h3>
            <p className="text-black">We couldn't find any registrations associated with this email address.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyBooking;