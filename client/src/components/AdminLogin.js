import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../utils/api';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
  e.preventDefault();
  
  try {
    console.log('Attempting login with:', credentials);
    
    const response = await fetch('https://api.creativeeraevents.in/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    console.log('Response status:', response.status);
    
    // Get response as text first
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    // Check if it looks like JavaScript code (your current problem)
    if (responseText.includes('require(') || responseText.includes('const express')) {
      toast.error('Server configuration error: Backend is not running properly');
      console.error('Server returned source code instead of executing it!');
      return;
    }
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      toast.error('Server returned invalid response');
      console.error('Parse error:', parseError);
      return;
    }

    if (data.success) {
      localStorage.setItem('adminToken', data.token);
      onLogin(data.user);
      toast.success('Login successful!');
    } else {
      toast.error(data.message || 'Invalid credentials');
    }
    
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Cannot connect to server');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">Default Credentials:</p>
            <p className="text-sm font-mono text-blue-900">
              Username: admin | Password: admin123
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                className="pl-10 input-field"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                className="pl-10 input-field"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;