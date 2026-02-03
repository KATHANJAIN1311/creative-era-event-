import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_API_URL.replace('/api', '');

const EventCard = ({ event }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="card-premium rounded-2xl overflow-hidden group">
      <div className="relative">
        {event.imageUrl ? (
          <img
            src={event.imageUrl.startsWith('http') ? event.imageUrl : `${BACKEND_URL}${event.imageUrl}`}
            alt={event.name}
            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-600/50" />
          </div>
        )}

      </div>
      
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start gap-3 mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-black group-hover:text-yellow-600 transition-colors line-clamp-2 leading-tight flex-1 pr-2">
            {event.name}
          </h3>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg border border-yellow-400/20 flex-shrink-0">
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-wide whitespace-nowrap">
              {new Date(event.date) >= new Date() ? 'Upcoming' : 'Past'}
            </span>
          </div>
        </div>
        <p className="text-black mb-3 sm:mb-4 line-clamp-2 text-sm leading-relaxed">
          {event.description}
        </p>
        
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          <div className="flex items-center text-xs sm:text-sm text-black">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-yellow-600 flex-shrink-0" />
            <span className="truncate">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-black">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-yellow-600 flex-shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-black">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-yellow-600 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          {(event.registrationCount || event.checkedInCount) && (
            <div className="flex items-center text-xs sm:text-sm text-black">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-yellow-600 flex-shrink-0" />
              <span className="truncate">
                {event.registrationCount || 0} registered • {event.checkedInCount || 0} attended
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 sm:space-y-3">
          <Link
            to={`/events/${event.eventId}/register`}
            className="btn-primary text-center min-h-[44px] flex items-center justify-center text-sm"
          >
            Register Now
          </Link>
          <Link
            to={`/events/${event.eventId}`}
            className="btn-ghost text-center min-h-[44px] flex items-center justify-center text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
