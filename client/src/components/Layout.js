import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, QrCode, BarChart3, Home, Building, BookOpen, Menu, X, MapPin, Mail, Phone, Twitter, Instagram, MessageCircle } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const isKioskMode = location.pathname.includes('/kiosk');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isKioskMode) {
    return <div className="kiosk-mode">{children}</div>;
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Corporate', href: '/corporate', icon: Building },
    { name: 'My Booking', href: '/my-booking', icon: BookOpen },
    { name: 'Admin', href: '/admin', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen premium-gradient">
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
                <img 
                  src="https://creativeeraevents.com/assets/frontend-assets/images/1.site-logo.png"
                  alt="Company Logo" 
                  className="w-10 h-8 sm:w-14 sm:h-10 rounded-xl bg-black p-1 border border-gray-800 shadow-sm"
                />
                <span className="text-lg sm:text-2xl font-bold hero-text hidden sm:inline">Creative Era Events</span>
                <span className="text-lg font-bold hero-text sm:hidden">Creative Era</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                      isActive
                        ? 'bg-yellow-400 text-black'
                        : 'text-black hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-black hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-yellow-400 text-black'
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>
      
      <main className="min-h-screen">
        {children}
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                <img 
                  src="https://creativeeraevents.com/assets/frontend-assets/images/1.site-logo.png"
                  alt="Company Logo" 
                  className="w-10 h-6 sm:w-12 sm:h-8 rounded-lg bg-black p-1 border border-gray-700"
                />
                <span className="text-lg sm:text-xl font-bold text-black">Creative Era Events</span>
              </div>
              <p className="text-sm sm:text-base text-black mb-4">We're team players, passionate and talented experts who deliver exceptional results.</p>
              <div className="space-y-2 text-black text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <p>Office No. 308, NRK BIZPARK, PU 4, AB Road, INDORE (M.P.) 452010</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <a href="mailto:creativeeraevents@gmail.com" className="hover:text-yellow-600 transition-colors">creativeeraevents@gmail.com</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <a href="tel:+919098176171" className="hover:text-yellow-600 transition-colors">+91 90981 76171</a>
                </div>
              </div>
            </div>
            <div className="lg:flex lg:justify-end">
              <div>
                <h3 className="text-black font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-yellow-400 transition-colors">
                    <Twitter className="w-5 h-5 text-black" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-yellow-400 transition-colors">
                    <Instagram className="w-5 h-5 text-black" />
                  </a>
                  <a href="https://wa.me/919098176171" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-yellow-400 transition-colors">
                    <MessageCircle className="w-5 h-5 text-black" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-black text-xs sm:text-sm">© 2024 Creative Era Events. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;