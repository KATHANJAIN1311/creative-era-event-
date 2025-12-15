import React, { useState } from 'react';
import { QrCode, Search, CheckCircle, Clock, User, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckIn = () => {
  const [qrData, setQrData] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('qr'); // 'qr' or 'manual'

  const handleCheckIn = async (e) => {
    e.preventDefault();
    
    const inputValue = mode === 'qr' ? qrData.trim() : registrationId.trim();
    if (!inputValue) {
      toast.error('Please enter QR data or Registration ID');
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        qrData: mode === 'qr' ? inputValue : null,
        registrationId: mode === 'manual' ? inputValue : null
      };
      
      console.log('Sending check-in request:', requestBody);
      
      const response = await fetch('/api/registrations/checkin', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'X-CSRF-Token': 'checkin-action'
  },
  body: JSON.stringify(requestBody)
});

      const data = await response.json();
      console.log('Check-in response:', data);

      if (response.ok) {
        if (data.alreadyCheckedIn || !data.success) {
          toast.error(data.message || 'User already checked in');
        } else {
          toast.success(data.message || 'Successfully checked in!');
        }
        setResult(data);
      } else {
        console.error('Check-in failed:', data);
        toast.error(data.message || 'Check-in failed');
        setResult(null);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      toast.error('Network error during check-in');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const validateRegistration = async () => {
    const inputValue = mode === 'qr' ? qrData.trim() : registrationId.trim();
    if (!inputValue) {
      toast.error('Please enter QR data or Registration ID');
      return;
    }

    setLoading(true);
    try {
      let checkId = inputValue;
      if (mode === 'qr' && inputValue.includes('|')) {
        checkId = inputValue.split('|')[0];
      }
      
      const response = await fetch(`/api/registrations/debug/check/${checkId}`);
      const data = await response.json();
      
      if (data.exists) {
        toast.success(`Registration found: ${data.registration.name}`);
        console.log('Registration details:', data.registration);
      } else {
        toast.error('Registration not found');
      }
    } catch (error) {
      toast.error('Error validating registration');
      console.error('Validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQrData('');
    setRegistrationId('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <QrCode className="w-8 h-8 mr-3 text-blue-600" />
            Event Check-In
          </h1>
          <p className="text-gray-600">Scan QR code or enter Registration ID to check in attendees</p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setMode('qr')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'qr'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <QrCode className="w-4 h-4 inline mr-2" />
              QR Code
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'manual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Manual Entry
            </button>
          </div>

          {/* Check-in Form */}
          <form onSubmit={handleCheckIn} className="space-y-4">
            {mode === 'qr' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Data
                </label>
                <textarea
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  placeholder="Paste QR code data here or scan QR code..."
                  className="input-field h-24 resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: registrationId|eventId
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration ID
                </label>
                <input
                  type="text"
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                  placeholder="Enter registration ID..."
                  className="input-field"
                  required
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={validateRegistration}
                disabled={loading}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Validate</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{loading ? 'Checking In...' : 'Check In'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className={`flex items-center mb-4 ${
              result.success ? 'text-green-600' : 'text-red-600'
            }`}>
              {result.success ? (
                <CheckCircle className="w-6 h-6 mr-2" />
              ) : (
                <Clock className="w-6 h-6 mr-2" />
              )}
              <h3 className="text-lg font-semibold">
                {result.alreadyCheckedIn ? 'Already Checked In' : 
                 result.success ? 'Check-In Successful' : 'Check-In Failed'}
              </h3>
            </div>

            {result.registration && (
              <div className="space-y-4">
                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Attendee Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {result.registration.name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {result.registration.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {result.registration.phone}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> 
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        result.registration.registrationType === 'online'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {result.registration.registrationType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event Info */}
                {result.event && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Event Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium w-16">Event:</span>
                        <span>{result.event.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="font-medium w-15">Date:</span>
                        <span>{new Date(result.event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="font-medium w-15">Time:</span>
                        <span>{result.event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="font-medium w-15">Venue:</span>
                        <span>{result.event.venue}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Check-in Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Check-In Status</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        result.registration.isCheckedIn
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.registration.isCheckedIn ? 'Checked In' : 'Pending'}
                      </span>
                    </div>
                    {result.registration.checkedAt && (
                      <div>
                        <span className="font-medium">Check-in Time:</span>
                        <span className="ml-2">
                          {new Date(result.registration.checkedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4 mt-6">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use QR Code mode to scan or paste QR code data</li>
            <li>• Use Manual Entry mode to enter Registration ID directly</li>
            <li>• Each attendee can only be checked in once</li>
            <li>• Check-in status is updated in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;