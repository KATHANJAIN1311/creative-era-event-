import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, QrCode, BarChart3, Home, Building, BookOpen } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const isKioskMode = location.pathname.includes('/kiosk');

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
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <img 
                  src="https://creativeeraevents.com/assets/frontend-assets/images/1.site-logo.png"
                  alt="Company Logo" 
                  className="w-14 h-10 rounded-xl bg-black p-1 border border-gray-800 shadow-sm"
                />
                <span className="text-2xl font-bold hero-text">Creative Era Events</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
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
          </div>
        </div>
      </nav>
      
      <main className="min-h-screen">
        {children}
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://creativeeraevents.com/assets/frontend-assets/images/1.site-logo.png"
                  alt="Company Logo" 
                  className="w-12 h-8 rounded-lg bg-black p-1 border border-gray-700"
                />
                <span className="text-xl font-bold text-black">Creative Era Events</span>
              </div>
              <p className="text-black mb-4">Smart Event Registration & Automated Entry Solutions</p>
            </div>
            <div>
              <h3 className="text-black font-semibold mb-4">Contact</h3>
              <p className="text-black text-sm">info@creativeera.com</p>
              <p className="text-black text-sm">+91 98765 43210</p>
            </div>
            <div>
              <h3 className="text-black font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-black text-sm">© 2024 Creative Era Events. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;