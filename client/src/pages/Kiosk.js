import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventsAPI } from '../utils/api';
import RegistrationForm from '../components/RegistrationForm';
import { QRCodeSVG } from 'qrcode.react';
import { Monitor, Printer, CheckCircle, ArrowLeft } from 'lucide-react';

const Kiosk = () => {
  const { eventId } = useParams();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId);
    } else {
      fetchEvents();
    }
  }, [eventId]);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      const eventsData = Array.isArray(response.data) ? response.data : [];
      setEvents(eventsData);
      if (eventsData.length > 0) {
        setSelectedEvent(eventsData[0]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async (id) => {
    try {
      const response = await eventsAPI.getById(id);
      setSelectedEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = (registrationData) => {
    setRegistration(registrationData);
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    const qrCodeElement = document.getElementById('kiosk-qr-code');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Event Registration QR Code</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
            }
            .qr-container { 
              border: 2px solid #000; 
              padding: 20px; 
              margin: 20px auto; 
              width: fit-content;
            }
            .event-info { 
              margin-bottom: 20px; 
              font-size: 14px;
            }
            .registration-info { 
              margin-top: 20px; 
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h2>Creative Era Events</h2>
          <div class="event-info">
            <h3>${selectedEvent.name}</h3>
            <p>Date: ${new Date(selectedEvent.date).toLocaleDateString()}</p>
            <p>Time: ${selectedEvent.time}</p>
            <p>Venue: ${selectedEvent.venue}</p>
          </div>
          <div class="qr-container">
            ${qrCodeElement.outerHTML}
          </div>
          <div class="registration-info">
            <p><strong>Name:</strong> ${registration.name}</p>
            <p><strong>Registration ID:</strong> ${registration.registrationId}</p>
            <p>Please present this QR code at the venue for check-in</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const resetKiosk = () => {
    setRegistration(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 kiosk-mode">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Monitor className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Kiosk Registration</h1>
          </div>
          <p className="text-xl text-gray-600">On-site event registration with instant QR slip</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!registration ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Event Selection */}
              {!eventId && events.length > 1 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Event</h2>
                  <div className="space-y-3">
                    {events.map((event) => (
                      <button
                        key={event.eventId}
                        onClick={() => setSelectedEvent(event)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                          selectedEvent?.eventId === event.eventId
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900">{event.name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </p>
                        <p className="text-sm text-gray-600">{event.venue}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration Form */}
              {selectedEvent && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedEvent.name}
                    </h2>
                    <div className="text-gray-600 space-y-1">
                      <p>{new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}</p>
                      <p>{selectedEvent.venue}</p>
                    </div>
                  </div>
                  
                  <RegistrationForm 
                    event={selectedEvent} 
                    registrationType="kiosk"
                    onSuccess={handleRegistrationSuccess}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Registration Success */
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Registration Successful!
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Please collect your QR slip and keep it for check-in at the venue.
              </p>

              {/* Registration Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Registration Details</h3>
                <div className="text-lg text-gray-600 space-y-2">
                  <p><strong>Name:</strong> {registration.name}</p>
                  <p><strong>Email:</strong> {registration.email}</p>
                  <p><strong>Phone:</strong> {registration.phone}</p>
                  <p><strong>Registration ID:</strong> {registration.registrationId}</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-8 rounded-lg border-4 border-gray-300 mb-8 inline-block">
                <QRCodeSVG
                  id="kiosk-qr-code"
                  value={registration.qrCode}
                  size={250}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={printQR}
                  className="bg-green-600 hover:bg-green-700 text-white text-xl py-4 px-8 rounded-lg font-semibold flex items-center justify-center space-x-3"
                >
                  <Printer className="w-6 h-6" />
                  <span>Print QR Slip</span>
                </button>
                
                <button
                  onClick={resetKiosk}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xl py-4 px-8 rounded-lg font-semibold flex items-center justify-center space-x-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                  <span>Register Another</span>
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-lg">
                  <strong>Important:</strong> Please keep this QR slip safe and bring it to the event venue for check-in.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kiosk;