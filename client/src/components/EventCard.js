import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

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
            src={event.imageUrl.startsWith('http') ? event.imageUrl : `http://localhost:5001${event.imageUrl}`}
            alt={event.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center">
            <Calendar className="w-16 h-16 text-yellow-600/50" />
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wide">
              {new Date(event.date) >= new Date() ? 'Upcoming' : 'Past'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2">
          {event.name}
        </h3>
        <p className="text-black mb-4 line-clamp-2 text-sm leading-relaxed">
          {event.description}
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-black">
            <Calendar className="w-4 h-4 mr-3 text-yellow-600 flex-shrink-0" />
            <span className="truncate">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-black">
            <Clock className="w-4 h-4 mr-3 text-yellow-600 flex-shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-black">
            <MapPin className="w-4 h-4 mr-3 text-yellow-600 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          {(event.registrationCount || event.checkedInCount) && (
            <div className="flex items-center text-sm text-black">
              <Users className="w-4 h-4 mr-3 text-yellow-600 flex-shrink-0" />
              <span className="truncate">
                {event.registrationCount || 0} registered • {event.checkedInCount || 0} attended
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-3">
          <Link
            to={`/events/${event.eventId}/register`}
            className="btn-primary text-center"
          >
            Register Now
          </Link>
          <Link
            to={`/events/${event.eventId}`}
            className="btn-ghost text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
