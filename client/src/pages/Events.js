import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../utils/api';
import EventCard from '../components/EventCard';
import { Search, Calendar, Filter } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, searchTerm, sortBy]);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      const eventsWithStats = await Promise.all(
        response.data.map(async (event) => {
          const eventDetails = await eventsAPI.getById(event.eventId);
          return eventDetails.data;
        })
      );
      setEvents(eventsWithStats);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortEvents = () => {
    let filtered = events.filter(event =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'registrations':
          return (b.registrationCount || 0) - (a.registrationCount || 0);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.date) < new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-black mb-6">Discover Events</h1>
        <p className="text-xl text-black mb-8">Find and register for amazing events near you</p>
        
        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events, venues, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 h-14 text-lg"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field pl-12 pr-8 h-14 text-lg appearance-none"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="registrations">Sort by Popularity</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="card-premium rounded-2xl p-6 animate-pulse">
              <div className="h-48 bg-white/10 rounded-xl mb-4"></div>
              <div className="h-6 bg-white/10 rounded mb-3"></div>
              <div className="h-4 bg-white/10 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-black mb-8 flex items-center">
                <Calendar className="w-8 h-8 mr-3 text-yellow-600" />
                Upcoming Events ({upcomingEvents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.eventId} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-600 mb-8 flex items-center">
                <Calendar className="w-8 h-8 mr-3 text-gray-400" />
                Past Events ({pastEvents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {pastEvents.map((event) => (
                  <EventCard key={event.eventId} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* No Events */}
          {filteredEvents.length === 0 && !loading && (
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