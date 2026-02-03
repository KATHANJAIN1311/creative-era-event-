const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const eventRoutes = require('./server/routes/events');
const registrationRoutes = require('./server/routes/registrations');
const checkinRoutes = require('./server/routes/checkins');
const consultationRoutes = require('./server/routes/consultations');
const adminRoutes = require('./server/routes/admin');
const bookingRoutes = require('./server/routes/bookings');

const app = express();
const server = http.createServer(app);

// Trust proxy (REQUIRED for Hostinger)
app.set('trust proxy', 1);

const io = socketIo(server, {
  cors: {
    origin: [
      'https://creativeeraevents.in',
      'https://www.creativeeraevents.in',
      process.env.CLIENT_URL || "http://localhost:3005",
      'http://localhost:3000'
    ],
    methods: ["GET", "POST"]
  }
});

// CORS Configuration (MUST come before CSRF)
app.use(cors({
  origin: [
    'https://creativeeraevents.in',
    'https://www.creativeeraevents.in',
    process.env.CLIENT_URL || 'http://localhost:3005',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'server/uploads')));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes (Login route BEFORE CSRF protection)
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-registration')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});