import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsAPI } from '../utils/api';
import { Calendar, MapPin, Clock, Users, ArrowLeft } from 'lucide-react';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-black mb-4">Event Not Found</h2>
        <Link to="/events" className="btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }

  const isUpcoming = new Date(event.date) >= new Date();

  return (
    <div>
      {/* Back Button */}
      <Link
        to="/events"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Events
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Event Image */}
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-64 md:h-80 object-cover"
          />
        )}

        <div className="p-6 md:p-8">
          {/* Event Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            {event.name}
          </h1>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-black">
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">{formatDate(event.date)}</p>
                  <p className="text-sm text-black">Event Date</p>
                </div>
              </div>

              <div className="flex items-center text-black">
                <Clock className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">{event.time}</p>
                  <p className="text-sm text-black">Event Time</p>
                </div>
              </div>

              <div className="flex items-center text-black">
                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">{event.venue}</p>
                  <p className="text-sm text-black">Venue</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-black">
                <Users className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">
                    {event.registrationCount || 0} Registered
                  </p>
                  <p className="text-sm text-black">Total Registrations</p>
                </div>
              </div>

              <div className="flex items-center text-black">
                <Users className="w-5 h-5 mr-3 text-green-600" />
                <div>
                  <p className="font-medium">
                    {event.checkedInCount || 0} Checked In
                  </p>
                  <p className="text-sm text-black">Attendees Present</p>
                </div>
              </div>

              {event.maxCapacity && (
                <div className="flex items-center text-black">
                  <Users className="w-5 h-5 mr-3 text-orange-600" />
                  <div>
                    <p className="font-medium">{event.maxCapacity} Max</p>
                    <p className="text-sm text-black">Capacity</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Pricing Section */}
          {isUpcoming && event.ticketTiers && event.ticketTiers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-black mb-4">Select Ticket Tier</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {event.ticketTiers.map((tier, index) => {
                  const bookedCount = event.registrations?.filter(r => r.ticketTier === tier.name).length || 0;
                  const availableSeats = Math.max(0, tier.seats - bookedCount);
                  const tierColors = {
                    0: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600', radio: 'text-blue-600' },
                    1: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-600', radio: 'text-purple-600' },
                    2: { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-600', radio: 'text-yellow-600' }
                  };
                  const colors = tierColors[index % 3] || tierColors[0];
                  
                  return (
                    <div 
                      key={tier.name}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTier === tier.name 
                          ? `${colors.border} ${colors.bg}` 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTier(tier.name)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">{tier.name}</h3>
                        <input 
                          type="radio" 
                          name="ticketTier" 
                          value={tier.name} 
                          checked={selectedTier === tier.name}
                          onChange={() => setSelectedTier(tier.name)}
                          className={colors.radio}
                        />
                      </div>
                      <p className={`text-2xl font-bold ${colors.text} mb-2`}>₹{tier.price}</p>
                      <p className="text-sm text-gray-600">
                        Seats: {availableSeats} left
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Event Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-3">About This Event</h2>
            <p className="text-black leading-relaxed">{event.description}</p>
          </div>

          {/* Registration Buttons */}
          {isUpcoming && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`/events/${event.eventId}/register`}
                state={{ selectedTier }}
                className={`flex-1 text-center py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                  selectedTier 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (!selectedTier && event.ticketTiers && event.ticketTiers.length > 0) {
                    e.preventDefault();
                    alert('Please select a ticket tier first');
                  }
                }}
              >
                Book Now
              </Link>
            </div>
          )}

          {!isUpcoming && (
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-black font-medium">This event has ended</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;