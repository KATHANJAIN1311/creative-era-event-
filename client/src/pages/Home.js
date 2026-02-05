import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../utils/api';
import EventCard from '../components/EventCard';
import socketService from '../utils/socket';
import { Calendar, Users, QrCode, Monitor } from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    
    const socket = socketService.connect({
      auth: {
        'X-CSRF-Token': localStorage.getItem('csrfToken') || ''
      }
    });

    socket.on('newRegistration', (data) => {
      if (data && typeof data.eventId === 'string' && typeof data.registrationCount === 'number') {
        setEvents(prevEvents => {
          const eventsArray = Array.isArray(prevEvents) ? prevEvents : [];
          return eventsArray.map(event => 
            event.eventId === data.eventId 
              ? { ...event, registrationCount: data.registrationCount }
              : event
          );
        });
      }
    });

    socket.on('newCheckin', (data) => {
      if (data && typeof data.eventId === 'string' && typeof data.checkedInCount === 'number') {
        setEvents(prevEvents => {
          const eventsArray = Array.isArray(prevEvents) ? prevEvents : [];
          return eventsArray.map(event => 
            event.eventId === data.eventId 
              ? { ...event, checkedInCount: data.checkedInCount }
              : event
          );
        });
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      const responseData = Array.isArray(response.data) ? response.data : [];
      const eventsWithStats = await Promise.all(
        responseData.map(async (event) => {
          const eventDetails = await eventsAPI.getById(event.eventId);
          return eventDetails.data;
        })
      );
      setEvents(eventsWithStats);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Create and manage events with detailed information',
      link: '/events'
    },
    {
      icon: Users,
      title: 'Online Registration',
      description: 'Easy online registration with QR code generation',
      link: '/events'
    },
    {
      icon: Monitor,
      title: 'Kiosk Registration',
      description: 'On-site registration with instant QR slip printing',
      link: '/kiosk'
    },
    {
      icon: QrCode,
      title: 'QR Verification',
      description: 'Quick check-in using QR code scanning',
      link: '/scanner'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-96 sm:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 hero-text leading-tight">
              Creative Era Events
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-4 text-black font-light">
              Smart Event Registration &
            </p>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-12 text-black font-medium">
              Automated Entry Solutions
            </p>
            <p className="text-base sm:text-lg text-black mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
              Corporate events with advanced QR check-ins, kiosk workflows, and seamless guest automation.
            </p>

          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6">
            WELCOME TO THE WORLD OF CREATIVE ERA
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 sm:mb-8 font-serif">
            सतत रफ़्तार
          </p>

          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto mb-8 sm:mb-12">
            <div className="text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-4">Our Mission</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                To revolutionize event management through innovative technology solutions that streamline registration, enhance attendee experience, and provide real-time insights.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-4">Our Vision</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                To become the leading provider of smart event management solutions globally, setting new standards for digital event experiences.
              </p>
            </div>
          </div>
          
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            We're team players, passionate and talented experts who deliver exceptional results.
          </p>
        </div>
      </div>

      {/* QR-Powered Smart Entry Section */}
      <div className="bg-white py-12 sm:py-16 lg:py-20 mx-4 rounded-2xl mb-12 sm:mb-20 shadow-lg border border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">
                QR-Powered Smart Entry
              </h2>
              <p className="text-black text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Say goodbye to manual registrations and long queues. Our advanced QR code system enables instant check-ins, real-time tracking, and seamless guest management.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-black">Instant digital ticket generation</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-black">Real-time attendance tracking</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-black">Contactless & secure verification</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 border-2 border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800"
                  alt="Happy event attendees using QR check-in system"
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Automated Kiosk Solutions Section */}
      <div className="bg-white py-12 sm:py-16 lg:py-20 mx-4 rounded-2xl mb-12 sm:mb-20 shadow-lg border border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 border-2 border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800"
                  alt="Professional presentation at corporate event"
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl"
                />
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">
                Automated Kiosk Solutions
              </h2>
              <p className="text-black text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Self-service registration kiosks for on-site attendees. Print instant QR tickets and maintain seamless event flow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6">
              Upcoming Events
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Join our exciting events and experience seamless registration
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {events.map((event) => (
                <EventCard key={event.eventId} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No events available</p>
              <p className="text-gray-500">Check back soon for upcoming events!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;