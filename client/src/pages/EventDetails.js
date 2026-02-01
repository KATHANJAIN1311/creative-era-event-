import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsAPI } from '../utils/api';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Star, Share2, Heart } from 'lucide-react';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded-xl w-32"></div>
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
              <div className="h-80 bg-gradient-to-r from-gray-200 to-gray-300"></div>
              <div className="p-8 space-y-6">
                <div className="h-12 bg-gray-200 rounded-xl w-3/4"></div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="btn-primary inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isUpcoming = new Date(event.date) >= new Date();
  const eventStatus = isUpcoming ? 'upcoming' : 'ended';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Link
            to="/events"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">Back to Events</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                isFavorited 
                  ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                  : 'bg-white text-gray-400 hover:bg-gray-100 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-white text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 hover:scale-110"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Hero Image Section */}
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] overflow-hidden">
            {event.imageUrl ? (
              <>
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className={`w-full h-full object-cover object-center transition-all duration-700 ${
                    imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  style={{
                    objectPosition: 'center center',
                    minHeight: '100%',
                    width: '100%'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                <Calendar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-white/80" />
              </div>
            )}
            
            {/* Event Status Badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
              <span className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md ${
                eventStatus === 'upcoming' 
                  ? 'bg-green-500/90 text-white' 
                  : 'bg-gray-500/90 text-white'
              }`}>
                {eventStatus === 'upcoming' ? '🎉 Upcoming' : '📅 Ended'}
              </span>
            </div>

            {/* Event Title Overlay */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-6 lg:left-6 lg:right-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg leading-tight">
                {event.name}
              </h1>
              <div className="flex items-center text-white/90">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current text-yellow-400" />
                <span className="text-sm sm:text-base lg:text-lg font-medium">Premium Event</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-12">
            {/* Event Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 lg:gap-12 mb-12">
              {/* Event Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center mb-3">
                      <div className="p-3 bg-blue-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Date</p>
                        <p className="text-lg font-bold text-gray-900">{formatDate(event.date)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center mb-3">
                      <div className="p-3 bg-purple-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Time</p>
                        <p className="text-lg font-bold text-gray-900">{event.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 sm:col-span-2">
                    <div className="flex items-center mb-3">
                      <div className="p-3 bg-green-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Venue</p>
                        <p className="text-lg font-bold text-gray-900">{event.venue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Tiers */}
            {isUpcoming && event.ticketTiers && event.ticketTiers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Choose Your Experience</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {event.ticketTiers.map((tier, index) => {
                    const bookedCount = event.registrations?.filter(r => r.ticketTier === tier.name).length || 0;
                    const availableSeats = Math.max(0, tier.seats - bookedCount);
                    const tierStyles = [
                      { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
                      { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
                      { gradient: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' }
                    ];
                    const style = tierStyles[index % 3];
                    
                    return (
                      <div 
                        key={tier.name}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                          selectedTier === tier.name 
                            ? `${style.border} ${style.bg} shadow-lg scale-105` 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => setSelectedTier(tier.name)}
                      >
                        {selectedTier === tier.name && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className={`px-4 py-1 bg-gradient-to-r ${style.gradient} text-white text-sm font-semibold rounded-full`}>
                              Selected
                            </div>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">{tier.name}</h3>
                          <div className={`text-4xl font-bold ${style.text} mb-4`}>₹{tier.price}</div>
                          <div className="flex items-center justify-center mb-4">
                            <div className={`w-3 h-3 rounded-full ${availableSeats > 10 ? 'bg-green-500' : availableSeats > 0 ? 'bg-yellow-500' : 'bg-red-500'} mr-2`}></div>
                            <span className="text-sm font-medium text-gray-600">
                              {availableSeats} seats left
                            </span>
                          </div>
                          <input 
                            type="radio" 
                            name="ticketTier" 
                            value={tier.name} 
                            checked={selectedTier === tier.name}
                            onChange={() => setSelectedTier(tier.name)}
                            className="w-5 h-5 text-blue-600"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Event Description */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Event</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>
              </div>
            </div>

            {/* Action Buttons */}
            {isUpcoming ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={`/events/${event.eventId}/register`}
                  state={{ selectedTier }}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 text-center ${
                    selectedTier || !event.ticketTiers?.length
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (!selectedTier && event.ticketTiers && event.ticketTiers.length > 0) {
                      e.preventDefault();
                      alert('Please select a ticket tier first');
                    }
                  }}
                >
                  🎟️ Book Your Spot Now
                </Link>
              </div>
            ) : (
              <div className="text-center p-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-600">This event has concluded</p>
                <p className="text-gray-500 mt-2">Thank you to all who attended!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;