import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/admin" className="flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Creative Era Events</span>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;