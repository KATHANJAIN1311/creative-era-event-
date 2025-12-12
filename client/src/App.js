import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
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
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/events/:eventId/register" element={<Registration />} />
            <Route path="/qr/:registrationId" element={<QRDisplay />} />
            <Route path="/corporate" element={<Corporate />} />
            <Route path="/schedule-consultation" element={<ScheduleConsultation />} />
            <Route path="/my-booking" element={<MyBooking />} />
            <Route path="/kiosk" element={<Kiosk />} />
            <Route path="/kiosk/:eventId" element={<Kiosk />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
        
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