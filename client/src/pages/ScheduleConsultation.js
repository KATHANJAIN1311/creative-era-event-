import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, User, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ScheduleConsultation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    requirements: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/consultations', formData);
      toast.success('Consultation request submitted successfully!');
      setSubmitted(true);
      setTimeout(() => navigate('/corporate'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card-premium rounded-2xl p-12">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-navy-900 mb-4">Thank You!</h1>
          <p className="text-gray-700 text-lg mb-6">
            Your consultation request has been submitted successfully. Our team will contact you within 24 hours.
          </p>
          <p className="text-gray-600">Redirecting to Corporate page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-4">Schedule a Consultation</h1>
        <p className="text-gray-700 text-lg">
          Let's discuss how we can make your next corporate event exceptional
        </p>
      </div>

      <div className="card-premium rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-navy-900 font-medium mb-2">
              Company Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="Enter your company name"
              />
            </div>
          </div>

          <div>
            <label className="block text-navy-900 font-medium mb-2">
              Contact Person
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="Enter contact person name"
              />
            </div>
          </div>

          <div>
            <label className="block text-navy-900 font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div>
            <label className="block text-navy-900 font-medium mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-navy-900 font-medium mb-2">
              Brief Requirements
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                required
                rows={4}
                className="input-field pl-10 pt-3"
                placeholder="Describe your event requirements, expected attendees, and any specific needs..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 text-lg"
          >
            {loading ? 'Submitting...' : 'Submit Consultation Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleConsultation;