import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { eventsAPI } from '../utils/api';
import RegistrationForm from '../components/RegistrationForm';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Share2, CheckCircle, Home, QrCode } from 'lucide-react';

const Registration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);
  const selectedTier = location.state?.selectedTier;

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await eventsAPI.getById(eventId);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = (registrationData) => {
    setRegistration(registrationData);
  };



  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${event.name} - Registration QR Code`,
          text: `My registration for ${event.name}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
        <Link to="/events" className="btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <Link
        to={`/events/${eventId}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 min-h-[44px] px-2 py-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span className="text-sm sm:text-base">Back to Event Details</span>
      </Link>

      {!registration ? (
        <RegistrationForm 
          event={event} 
          registrationType="online"
          selectedTier={selectedTier}
          onSuccess={handleRegistrationSuccess}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
          
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
         Your QR code has been sent to your email. You can also download it below.
        </p>


          {/* Registration Details */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Registration Details</h3>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p><strong>Name:</strong> {registration.name}</p>
              <p><strong>Email:</strong> {registration.email}</p>
              <p><strong>Phone:</strong> {registration.phone}</p>
              <p><strong>Registration ID:</strong> {registration.registrationId}</p>
            </div>
          </div>

          {/* QR Code Info */}
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <p className="text-blue-800 text-xs sm:text-sm">
              <strong>Your QR Code:</strong> Has been generated and sent to your Gmail.
            </p>
            <p className="text-blue-600 text-xs mt-2">
              Registration ID: <code className="bg-blue-100 px-2 py-1 rounded text-xs">{registration.registrationId}</code>
            </p>
            <Link 
              to={`/qr/${registration.registrationId}`}
              className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium min-h-[44px] flex items-center justify-center"
            >
              View Your QR Code →
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/qr/${registration.registrationId}`}
              className="btn-primary flex items-center justify-center space-x-2 min-h-[44px] text-sm"
            >
              <QrCode className="w-4 h-4" />
              <span>View QR Code</span>
            </Link>
            
            <button
              onClick={() => navigate('/events')}
              className="btn-secondary flex items-center justify-center space-x-2 min-h-[44px] text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Back to Events</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Registration;