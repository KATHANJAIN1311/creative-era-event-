const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const checkinRoutes = require('./routes/checkins');
const consultationRoutes = require('./routes/consultations');
const adminRoutes = require('./routes/admin');
const bookingRoutes = require('./routes/bookings');

const app = express();
const server = http.createServer(app);

// Trust proxy (REQUIRED for Hostinger)
app.set('trust proxy', 1);

const io = socketIo(server, {
  cors: {
    origin: [
      'https://creativeeraevents.in',
      'https://www.creativeeraevents.in',
      "http://localhost:3005",
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
  // Only protect state-changing requests
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const origin = req.get('Origin');
    const referer = req.get('Referer');

    const allowedOrigins = [
      'https://creativeeraevents.in',
      'https://www.creativeeraevents.in',
      'https://api.creativeeraevents.in'
    ];

    // ✅ CASE 1: Same-origin request (Origin header missing)
    if (!origin && referer) {
      const refererOrigin = new URL(referer).origin;
      if (!allowedOrigins.includes(refererOrigin)) {
        return res.status(403).json({ message: 'CSRF: Invalid referer' });
      }
      return next();
    }

    // ✅ CASE 2: Cross-origin request
    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ message: 'CSRF: Invalid origin' });
    }

    // Require JSON only for APIs
    if (req.path.startsWith('/api')) {
      const contentType = req.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        return res.status(403).json({ message: 'Invalid content type' });
      }
    }
  }

  next();
};

// Apply CSRF protection to all /api routes
app.use('/api', csrfProtection);

// Socket.io connection
// amazonq-ignore-next-line
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

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
