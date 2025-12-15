import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Ensure API_URL includes '/api' so requests hit server routes correctly
      const rawApi = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const API_URL = rawApi.endsWith('/api') ? rawApi : `${rawApi.replace(/\/$/, '')}/api`;
      const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 
    'Content-Type': 'application/json',
    'X-CSRF-Token': 'admin-login'
    },
    body: JSON.stringify(credentials)
    });
 
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        onLogin(data.admin);
        toast.success('Login successful!');
      } else {
        console.error('Login failed:', data);
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Connection failed. Please check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">Default Credentials:</p>
            <p className="text-sm font-mono text-blue-900">Username: admin | Password: admin123</p>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="sr-only" aria-label="Username input field">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  className="pl-10 input-field"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="sr-only" aria-label="Password input field">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  className="pl-10 input-field"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;