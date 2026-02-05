import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../utils/api';
import EventCard from '../components/EventCard';
import { Search, Calendar, Filter } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [specificDate, setSpecificDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, searchTerm, locationFilter, specificDate, typeFilter]);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      const eventsData = Array.isArray(response.data) ? response.data : [];
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortEvents = () => {
    const eventsArray = Array.isArray(events) ? events : [];
    let filtered = eventsArray.filter(event => {
      // Search filter
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Location filter
      const matchesLocation = locationFilter === 'all' || 
        event.venue.toLowerCase().includes(locationFilter.toLowerCase());
      
      // Date filter
      const eventDate = new Date(event.date);
      const matchesDate = !specificDate || eventDate.toDateString() === new Date(specificDate).toDateString();
      
      // Type filter (based on event name/description keywords)
      const matchesType = typeFilter === 'all' ||
        (typeFilter === 'conference' && (event.name.toLowerCase().includes('conference') || event.description.toLowerCase().includes('conference'))) ||
        (typeFilter === 'workshop' && (event.name.toLowerCase().includes('workshop') || event.description.toLowerCase().includes('workshop'))) ||
        (typeFilter === 'seminar' && (event.name.toLowerCase().includes('seminar') || event.description.toLowerCase().includes('seminar'))) ||
        (typeFilter === 'networking' && (event.name.toLowerCase().includes('networking') || event.description.toLowerCase().includes('networking')));
      
      return matchesSearch && matchesLocation && matchesDate && matchesType;
    });

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredEvents(filtered);
  };

  const upcomingEvents = Array.isArray(filteredEvents) 
    ? filteredEvents.filter(event => new Date(event.date) >= new Date())
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6">Discover Events</h1>
        <p className="text-lg sm:text-xl text-black mb-6 sm:mb-8">Find and register for amazing events near you</p>
        
        {/* Search and Filter */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search events or venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 sm:pl-12 h-12 sm:h-14 text-base sm:text-lg w-full"
            />
          </div>
          
          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="input-field h-12 sm:h-14 text-base sm:text-lg appearance-none"
            >
              <option value="all">All Locations</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
              <option value="pune">Pune</option>
              <option value="hyderabad">Hyderabad</option>
            </select>
            
            <input
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              className="input-field h-12 sm:h-14 text-base sm:text-lg w-full"
              placeholder="Select specific date"
            />
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field h-12 sm:h-14 text-base sm:text-lg appearance-none"
            >
              <option value="all">All Types</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="networking">Networking</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="card-premium rounded-2xl p-4 sm:p-6 animate-pulse">
              <div className="h-40 sm:h-48 bg-white/10 rounded-xl mb-4"></div>
              <div className="h-5 sm:h-6 bg-white/10 rounded mb-3"></div>
              <div className="h-4 bg-white/10 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 sm:h-4 bg-white/10 rounded"></div>
                <div className="h-3 sm:h-4 bg-white/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Events */}
          {upcomingEvents.length > 0 && (
            <div className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8 flex items-center">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-yellow-600" />
                <span>Events ({upcomingEvents.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.eventId} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* No Events */}
          {upcomingEvents.length === 0 && !loading && (
            <div className="text-center py-20">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-black mb-4">
                {searchTerm ? 'No events found' : 'No events available'}
              </h3>
              <p className="text-black text-lg">
                {searchTerm 
                  ? 'Try adjusting your search terms or browse all events.' 
                  : 'Check back later for exciting upcoming events.'
                }
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Events;