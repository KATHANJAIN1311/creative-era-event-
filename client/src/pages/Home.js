import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../utils/api';
import EventCard from '../components/EventCard';
import socketService from '../utils/socket';
import { Calendar, Users, QrCode, Monitor, ArrowRight, Building, Award, Shield, Zap } from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    
    // Connect to socket for real-time updates
    const socket = socketService.connect();
    
    socket.on('newRegistration', (data) => {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.eventId === data.eventId 
            ? { ...event, registrationCount: data.registrationCount }
            : event
        )
      );
    });

    socket.on('newCheckin', (data) => {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.eventId === data.eventId 
            ? { ...event, checkedInCount: data.checkedInCount }
            : event
        )
      );
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

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
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-black mb-6 hero-text leading-tight">
              Creative Era Events
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-black font-light">
              Smart Event Registration &
            </p>
            <p className="text-2xl md:text-3xl mb-12 text-black font-medium">
              Automated Entry Solutions
            </p>
            <p className="text-lg text-black mb-12 max-w-3xl mx-auto">
              Corporate events with advanced QR check-ins, kiosk workflows, and seamless guest automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/events" className="btn-primary">
                <Calendar className="w-5 h-5 mr-2" />
                Explore Events
              </Link>
              <Link to="/corporate" className="btn-secondary">
                <Building className="w-5 h-5 mr-2" />
                Corporate Services
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            WELCOME TO THE WORLD OF CREATIVE ERA
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-black mb-8 font-serif">
            सतत रफ़्तार
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg mb-16 transition-colors">
            GET STARTED!
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-12">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To revolutionize event management through innovative technology solutions that streamline registration, enhance attendee experience, and provide real-time insights. We are committed to delivering seamless, efficient, and secure event automation that empowers organizers to focus on creating memorable experiences.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-black mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become the leading provider of smart event management solutions globally, setting new standards for digital event experiences. We envision a future where every event, regardless of size or complexity, benefits from our cutting-edge technology to create meaningful connections and lasting impressions.
              </p>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 font-medium">
            We're team players, passionate and talented experts who deliver exceptional results.
          </p>
        </div>
      </div>

      {/* QR-Powered Smart Entry Section */}
      <div className="bg-white py-20 mx-4 rounded-2xl mb-20 shadow-lg border border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">
                QR-Powered Smart Entry
              </h2>
              <p className="text-black text-lg mb-8 leading-relaxed">
                Say goodbye to manual registrations and long queues. Our advanced QR code system enables instant check-ins, real-time tracking, and seamless guest management. Perfect for events of any scale.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-black">Instant digital ticket generation</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-black">Real-time attendance tracking</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-black">Contactless & secure verification</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800"
                  alt="Happy event attendees using QR check-in system"
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Automated Kiosk Solutions Section */}
      <div className="bg-white py-20 mx-4 rounded-2xl mb-20 shadow-lg border border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800"
                  alt="Man presenting to audience in professional setting"
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">
                Automated Kiosk Solutions
              </h2>
              <p className="text-black text-lg mb-8 leading-relaxed">
                Our self-service kiosks revolutionize event registration. Attendees can check in, print badges, and access event information independently, reducing staff workload and enhancing guest experience.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-black">Self-service registration & badge printing</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-black">Multi-language support</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-black">Custom branding & interface</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creative Era Event Gallery */}
      <div className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-12">
          Creative Era Event Gallery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
              alt="Corporate Conference"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-black mb-2">Corporate Conference</h3>
              <p className="text-black">Professional business conferences with seamless technology integration</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800"
              alt="Exhibition Hall"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Exhibition Management</h3>
              <p className="text-gray-600">Large-scale exhibitions with automated entry and visitor tracking</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800"
              alt="Networking Event"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Networking Events</h3>
              <p className="text-gray-600">Structured networking sessions with digital connection facilitation</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800"
              alt="Award Ceremony"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Award Ceremonies</h3>
              <p className="text-gray-600">Elegant award ceremonies with professional event coordination</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Premium Event Solutions
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto">
            From corporate conferences to exclusive gatherings, we deliver seamless experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-premium rounded-2xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-4">
              Event Registration
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Seamless online registration with automated QR generation and instant WhatsApp confirmations
            </p>
          </div>

          <div className="card-premium rounded-2xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
              <QrCode className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-4">
              Smart Check-in
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Lightning-fast QR code verification with real-time analytics and contactless entry
            </p>
          </div>

          <div className="card-premium rounded-2xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-4">
              Live Analytics
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Real-time dashboards with attendance tracking, engagement metrics, and detailed reports
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-black">Featured Events</h2>
          <Link
            to="/events"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
          >
            View All Events
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-premium rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-white/10 rounded-xl mb-4"></div>
                <div className="h-6 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 6).map((event) => (
              <EventCard key={event.eventId} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-black mb-4">No Events Yet</h3>
            <p className="text-gray-600 mb-8">Create your first event to get started.</p>
            <Link to="/admin" className="btn-primary">
              Create Event
            </Link>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-20 max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Elevate Your Events?
        </h2>
        <p className="text-xl text-white/60 mb-12">
          Join the future of event management with Creative Era Events
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/events" className="btn-primary">
            <Calendar className="w-5 h-5 mr-2" />
            Browse Events
          </Link>
          <Link to="/my-booking" className="btn-secondary">
            <Users className="w-5 h-5 mr-2" />
            My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;