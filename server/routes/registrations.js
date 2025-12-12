const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const twilio = require('twilio');

let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Register for event
router.post('/', async (req, res) => {
  try {
    const { eventId, name, email, phone, registrationType = 'online' } = req.body;
    
    // Input validation
    if (!eventId || !name || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({ message: 'Phone number must be 10 digits' });
    }
    
    // Check if event exists
    const event = await Event.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if already registered
    const existingRegistration = await Registration.findOne({ eventId, email });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    
    const registrationId = uuidv4();
    
    // Generate minimal QR code data
    const qrData = `${registrationId}|${eventId}`;
    
    const registration = new Registration({
      registrationId,
      eventId,
      name,
      email: email.toLowerCase(),
      phone: phone.replace(/\D/g, ''),
      qrCode: qrData,
      registrationType
    });
    
    const savedRegistration = await registration.save();
    
    // Send WhatsApp message if online registration
    if (registrationType === 'online' && client) {
      try {
        const qrCodeDataURL = await QRCode.toDataURL(qrData);
        await client.messages.create({
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          to: `whatsapp:+91${phone.replace(/\D/g, '')}`,
          body: `Hi ${name}! You're registered for ${event.name}. Show this QR code at the venue for check-in.`,
          mediaUrl: [qrCodeDataURL]
        });
        
        await Registration.findOneAndUpdate(
          { registrationId },
          { whatsappSent: true }
        );
      } catch (whatsappError) {
        console.log('WhatsApp send failed:', whatsappError.message);
      }
    }
    
    // Emit real-time update
    req.io.emit('newRegistration', {
      eventId,
      registrationCount: await Registration.countDocuments({ eventId })
    });
    
    res.status(201).json(savedRegistration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get registrations for event
router.get('/event/:eventId', async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId })
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Debug route - get all registrations
router.get('/debug/all', async (req, res) => {
  try {
    const registrations = await Registration.find({}).limit(10);
    const totalCount = await Registration.countDocuments({});
    res.json({
      totalCount,
      count: registrations.length,
      registrations: registrations.map(r => ({
        email: r.email,
        name: r.name,
        eventId: r.eventId,
        registrationId: r.registrationId,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search registrations by email
router.get('/search', async (req, res) => {
  try {
    const email = req.query.email?.toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ message: 'Email parameter required' });
    }
    
    console.log('Searching for email:', email);
    
    let registrations = await Registration.find({ 
      email: { $regex: email, $options: 'i' }
    }).sort({ createdAt: -1 });
    
    console.log('Found registrations:', registrations.length);
    
    const registrationsWithEvents = await Promise.all(
      registrations.map(async (registration) => {
        try {
          const event = await Event.findOne({ eventId: registration.eventId });
          return {
            ...registration.toObject(),
            eventName: event?.name || 'Unknown Event',
            eventDate: event?.date || null
          };
        } catch (eventError) {
          console.error('Error fetching event for registration:', eventError);
          return {
            ...registration.toObject(),
            eventName: 'Unknown Event',
            eventDate: null
          };
        }
      })
    );
    
    res.json(registrationsWithEvents);
  } catch (error) {
    console.error('Email search error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update registration status to checked-in
router.patch('/:id/status', async (req, res) => {
  try {
    console.log('Check-in request for ID:', req.params.id);
    const { status } = req.body;
    
    if (status !== 'checkedIn') {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const registration = await Registration.findOneAndUpdate(
      { registrationId: req.params.id },
      { 
        isCheckedIn: true,
        checkedAt: new Date()
      },
      { new: true }
    );
    
    if (!registration) {
      console.log('Registration not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    console.log('Registration checked in successfully:', registration.name);
    
    // Emit real-time update if io is available
    if (req.io) {
      req.io.emit('checkinUpdate', {
        eventId: registration.eventId,
        registrationId: registration.registrationId,
        isCheckedIn: true
      });
    }
    
    res.json(registration);
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Check-in via QR code or registration ID
router.post('/checkin', async (req, res) => {
  try {
    console.log('Check-in request body:', req.body);
    const { qrData, registrationId } = req.body;
    
    let registration;
    let searchId;
    
    if (qrData && qrData.trim()) {
      // Parse QR data format: registrationId|eventId
      const parts = qrData.trim().split('|');
      searchId = parts[0];
      console.log('Searching by QR data, extracted ID:', searchId);
      registration = await Registration.findOne({ registrationId: searchId });
    } else if (registrationId && registrationId.trim()) {
      searchId = registrationId.trim();
      console.log('Searching by registration ID:', searchId);
      registration = await Registration.findOne({ registrationId: searchId });
    } else {
      console.log('No valid input provided');
      return res.status(400).json({ message: 'QR data or registration ID required' });
    }
    
    console.log('Registration found:', !!registration);
    
    if (!registration) {
      console.log('Registration not found for ID:', searchId);
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    console.log('Registration details:', {
      id: registration.registrationId,
      name: registration.name,
      isCheckedIn: registration.isCheckedIn
    });
    
    if (registration.isCheckedIn) {
      console.log('User already checked in');
      const event = await Event.findOne({ eventId: registration.eventId });
      return res.json({ 
        success: false,
        message: 'Already checked in',
        registration,
        event,
        alreadyCheckedIn: true
      });
    }
    
    // Update registration
    registration.isCheckedIn = true;
    registration.checkedAt = new Date();
    await registration.save();
    
    console.log('Registration updated successfully');
    
    // Get event details
    const event = await Event.findOne({ eventId: registration.eventId });
    console.log('Event found:', !!event);
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('checkinUpdate', {
        eventId: registration.eventId,
        registrationId: registration.registrationId,
        isCheckedIn: true
      });
    }
    
    res.json({
      success: true,
      registration,
      event,
      message: 'Successfully checked in'
    });
  } catch (error) {
    console.error('Check-in error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      message: 'Check-in failed: ' + error.message,
      error: error.message 
    });
  }
});

// Debug: Check if registration exists
router.get('/debug/check/:id', async (req, res) => {
  try {
    const registrationId = req.params.id;
    console.log('Debug check for registration ID:', registrationId);
    
    const registration = await Registration.findOne({ registrationId });
    const exists = !!registration;
    
    res.json({
      registrationId,
      exists,
      registration: registration ? {
        name: registration.name,
        email: registration.email,
        eventId: registration.eventId,
        isCheckedIn: registration.isCheckedIn,
        createdAt: registration.createdAt
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get registration by ID
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findOne({ registrationId: req.params.id });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test endpoint
router.get('/test/connection', async (req, res) => {
  try {
    const count = await Registration.countDocuments({});
    res.json({ 
      success: true, 
      message: 'API connection working', 
      totalRegistrations: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

module.exports = router;