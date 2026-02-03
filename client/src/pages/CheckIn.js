import React, { useState } from 'react';
import { QrCode, Search, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
const CheckIn = () => {
  const [mode, setMode] = useState('qr'); // qr | manual
  const [qrData, setQrData] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  /* ---------------- HANDLE CHECK-IN ---------------- */
  const handleCheckIn = async (e) => {
    e.preventDefault();

    if (mode === 'qr' && !qrData.trim()) {
      toast.error('Please enter QR data');
      return;
    }

    if (mode === 'manual' && !registrationId.trim()) {
      toast.error('Please enter Registration ID');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const body =
        mode === 'qr'
          ? { qrData: qrData.trim() }
          : { registrationId: registrationId.trim() };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/checkins/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Check-in failed');
        return;
      }

      if (data.alreadyCheckedIn) {
        toast.error('User already checked in');
      } else if (data.success) {
        toast.success('Check-in successful');
      } else {
        toast.error(data.message || 'Check-in failed');
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VALIDATE REGISTRATION ---------------- */
  const validateRegistration = async () => {
    const input =
      mode === 'qr' ? qrData.trim() : registrationId.trim();

    if (!input) {
      toast.error('Enter QR or Registration ID');
      return;
    }

    let regId = input;

    if (mode === 'qr' && input.includes('|')) {
      regId = input.split('|')[0];
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/registrations/debug/check/${regId}`
      );
      const data = await res.json();

      if (data.exists) {
        toast.success(`Found: ${data.registration.name}`);
      } else {
        toast.error('Registration not found');
      }
    } catch (err) {
      toast.error('Validation failed');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET ---------------- */
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
          <h1 className="text-3xl font-bold flex justify-center items-center">
            <QrCode className="w-8 h-8 mr-2 text-blue-600" />
            Event Check-In
          </h1>
          <p className="text-gray-600">
            Scan QR or manually enter Registration ID
          </p>
        </div>

        {/* Mode Switch */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setMode('qr')}
              className={`flex-1 py-2 rounded ${
                mode === 'qr'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100'
              }`}
            >
              QR Mode
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 py-2 rounded ${
                mode === 'manual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100'
              }`}
            >
              Manual Mode
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCheckIn} className="space-y-4">
            {mode === 'qr' ? (
              <textarea
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                placeholder="registrationId|eventId"
                className="input-field h-24"
              />
            ) : (
              <input
                type="text"
                value={registrationId}
                onChange={(e) => setRegistrationId(e.target.value)}
                placeholder="Registration ID"
                className="input-field"
              />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={validateRegistration}
                className="btn-secondary"
                disabled={loading}
              >
                Validate
              </button>

              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Check In'}
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

        {/* Result */}
        {result && result.registration && (
          <div className="bg-white p-6 rounded shadow">
            <div className="flex items-center mb-3">
              {result.success ? (
                <CheckCircle className="text-green-600 mr-2" />
              ) : (
                <Clock className="text-yellow-600 mr-2" />
              )}
              <h3 className="font-semibold">
                {result.alreadyCheckedIn
                  ? 'Already Checked In'
                  : result.success
                  ? 'Check-In Successful'
                  : 'Check-In Failed'}
              </h3>
            </div>

            <p><b>Name:</b> {result.registration.name}</p>
            <p><b>Email:</b> {result.registration.email}</p>
            <p>
              <b>Status:</b>{' '}
              {result.registration.isCheckedIn ? 'Checked In' : 'Pending'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
