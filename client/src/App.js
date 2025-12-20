import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Registration from './pages/Registration';
import QRDisplay from './pages/QRDisplay';
import Corporate from './pages/Corporate';
import ScheduleConsultation from './pages/ScheduleConsultation';
import MyBooking from './pages/MyBooking';
import Kiosk from './pages/Kiosk';
import Scanner from './pages/Scanner';
import CheckIn from './pages/CheckIn';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout><Home /></UserLayout>} />
          <Route path="/events" element={<UserLayout><Events /></UserLayout>} />
          <Route path="/events/:eventId" element={<UserLayout><EventDetails /></UserLayout>} />
          <Route path="/events/:eventId/register" element={<UserLayout><Registration /></UserLayout>} />
          <Route path="/qr/:registrationId" element={<UserLayout><QRDisplay /></UserLayout>} />
          <Route path="/corporate" element={<UserLayout><Corporate /></UserLayout>} />
          <Route path="/schedule-consultation" element={<UserLayout><ScheduleConsultation /></UserLayout>} />
          <Route path="/my-booking" element={<UserLayout><MyBooking /></UserLayout>} />
          
          {/* Kiosk Routes (no layout) */}
          <Route path="/kiosk" element={<Kiosk />} />
          <Route path="/kiosk/:eventId" element={<Kiosk />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/checkin" element={<CheckIn />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><Admin /></AdminLayout>} />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#10b981',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;