import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { registrationsAPI } from '../utils/api';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, QrCode, User, Calendar, MapPin } from 'lucide-react';

const QRDisplay = () => {
  const { registrationId } = useParams();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegistration();
  }, [registrationId]);

  const fetchRegistration = async () => {
    try {
      console.log('Fetching registration with ID:', registrationId);
      const response = await registrationsAPI.getById(registrationId);
      console.log('Registration response:', response);
      setRegistration(response.data);
    } catch (error) {
      console.error('Registration fetch error:', error);
      setError('Registration not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
        <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Registration Not Found</h2>
        <p className="text-gray-600 mb-4">The registration ID you provided could not be found.</p>
        <Link to="/events" className="btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Link
        to="/events"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Events
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Your Event QR Code
        </h2>

        {/* Registration Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-center mb-2">
            <User className="w-4 h-4 text-gray-600 mr-2" />
            <span className="font-medium">{registration.name}</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Email: {registration.email}</p>
            <p>Phone: {registration.phone || registration.phoneNumber}</p>
            <p>Registration ID: {registration.registrationId}</p>
            {registration.isCheckedIn && (
              <p className="text-green-600 font-medium">✓ Checked In</p>
            )}
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-6 inline-block">
          {registration.qrCode ? (
            <img src={registration.qrCode} alt="QR Code" className="w-48 h-48" />
          ) : (
            <QRCodeSVG
              value={`${registration.registrationId}|${registration.eventId}`}
              size={200}
              level="H"
              includeMargin={true}
            />
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Show this QR code</strong> to event staff for check-in at the venue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRDisplay;