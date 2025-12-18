import React, { useState } from 'react';
import { registrationsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Loader } from 'lucide-react';

const RegistrationForm = ({ event, registrationType = 'online', onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);

    try {
      const registrationData = {
        ...formData,
        phone: formData.phone.replace(/\D/g, ''),
        eventId: event.eventId,
        registrationType
      };

      const response = await registrationsAPI.create(registrationData);
      
      toast.success(
        registrationType === 'online' 
          ? 'Registration successful! QR code will be sent to your email.' 
          : 'Registration successful! Please collect your QR slip.'
      );
      
      if (onSuccess) {
        onSuccess(response.data);
      } else {
        setFormData({ name: '', email: '', phone: '' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Register for {event.name}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
              placeholder="Enter your 10-digit phone number"
              maxLength="15"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center space-x-2 py-3 sm:py-4 min-h-[44px] text-sm sm:text-base"
        >
          {loading && <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />}
          <span>{loading ? 'Registering...' : 'Register Now'}</span>
        </button>
      </form>
      
      {registrationType === 'online' && (
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 text-center">
          Your QR code will be sent to your email address after registration.
        </p>
      )}
    </div>
  );
};

export default RegistrationForm;
