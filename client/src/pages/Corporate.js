import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, Calendar, Award, Phone, Mail, Star, CheckCircle, User, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Corporate = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    requirements: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Inquiry submitted successfully!');
    setShowContactForm(false);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  const testimonials = [
    { name: 'Sarah Johnson', company: 'Tech Corp', rating: 5, text: 'Outstanding service and seamless event management.' },
    { name: 'Michael Chen', company: 'Global Inc', rating: 5, text: 'Professional team that delivered beyond expectations.' },
    { name: 'Emma Davis', company: 'Innovation Ltd', rating: 5, text: 'The QR system made our conference incredibly efficient.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
          Corporate Event Excellence
        </h1>
        <p className="text-xl text-black mb-8 max-w-3xl mx-auto">
          Transform your corporate events with our cutting-edge technology and professional expertise.
        </p>
        <Link
          to="/schedule-consultation"
          className="btn-primary text-lg px-8 py-4 inline-block"
        >
          Schedule a Consultation
        </Link>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact Person"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="requirements"
                  placeholder="Brief description of requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 pt-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thank You Message */}
      {showThankYou && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg z-50">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Thank you! We'll contact you soon.</span>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-black mb-6">About Creative Era Events</h2>
          <p className="text-black text-lg leading-relaxed">
            Creative Era Events is a leading provider of innovative event management solutions, specializing in corporate conferences, exhibitions, and automated entry systems. With over a decade of experience, we combine cutting-edge technology with personalized service to deliver exceptional events that exceed expectations and drive business success.
          </p>
        </div>
      </div>

      {/* What We Deliver */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-black text-center mb-12">What We Deliver</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <Building className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-black mb-2">Corporate Event Conference</h3>
            <p className="text-black">Professional conferences with seamless registration and networking solutions</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <Users className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Expo Management</h3>
            <p className="text-gray-600">Complete exhibition management from planning to execution</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <Calendar className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Automated Entry System</h3>
            <p className="text-gray-600">Advanced QR-based entry systems for contactless check-ins</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <Award className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Workflow Security & Access Control</h3>
            <p className="text-gray-600">Comprehensive security solutions and access management</p>
          </div>
        </div>
      </div>

      {/* Client Testimonials */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-black text-center mb-12">Client Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">{testimonial.name[0]}</span>
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-black mb-4 italic">"{testimonial.text}"</p>
              <div className="text-black font-semibold">{testimonial.name}</div>
              <div className="text-black text-sm">{testimonial.company}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-black mb-4">Ready to Get Started?</h2>
          <p className="text-black mb-6">Let's discuss your next corporate event</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+1234567890" className="btn-primary flex items-center justify-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </a>
            <a href="mailto:corporate@creativeera.com" className="btn-secondary flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Corporate;