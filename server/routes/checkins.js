const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Registration = require('../models/Registration');
const Checkin = require('../models/Checkin');

// Check-in with QR code
router.post('/verify', async (req, res) => {
  try {
    // Validate request origin for CSRF protection
    const origin = req.get('Origin') || req.get('Referer');
    const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:3005', 'http://localhost:3000'];
    
    if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return res.status(403).json({ message: 'Forbidden: Invalid origin' });
    }

    const { qrData } = req.body;
    
    // Type validation to prevent type confusion
    if (!qrData || typeof qrData !== 'string') {
      return res.status(400).json({ message: 'Invalid QR code: must be a string' });
    }
    
    let registrationId, eventId;
    
    // Handle different QR formats with proper validation
    if (qrData.includes('|')) {
      // New simple format: registrationId|eventId
      const parts = qrData.split('|');
      if (parts.length !== 2) {
        return res.status(400).json({ message: 'Invalid QR code format' });
      }
      [registrationId, eventId] = parts;
    } else {
      // Try JSON format for backward compatibility
      try {
        const parsedData = JSON.parse(qrData);
        registrationId = parsedData.id || parsedData.registrationId;
        eventId = parsedData.event || parsedData.eventId;
      } catch (parseError) {
        return res.status(400).json({ message: 'Invalid QR code format' });
      }
    }
    
    if (!registrationId || !eventId) {
      return res.status(400).json({ message: 'Invalid QR code data' });
    }
    
    // Find registration
    const registration = await Registration.findOne({ registrationId, eventId });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Check if already checked in
    if (registration.isCheckedIn) {
      return res.status(400).json({ 
        message: 'Already checked in',
        registration,
        alreadyCheckedIn: true
      });
    }
    
    // Create check-in record
    const checkinId = uuidv4();
    const checkin = new Checkin({
      checkinId,
      registrationId,
      eventId
    });
    
    await checkin.save();
    
    // Update registration status
    await Registration.findOneAndUpdate(
      { registrationId },
      { isCheckedIn: true }
    );
    
    // Emit real-time update
    req.io.emit('newCheckin', {
      eventId,
      checkedInCount: await Registration.countDocuments({ eventId, isCheckedIn: true })
    });
    
    res.json({
      message: 'Check-in successful',
      registration: {
        ...registration.toObject(),
        isCheckedIn: true
      },
      checkin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get check-ins for event
router.get('/event/:eventId', async (req, res) => {
  try {
    const checkins = await Checkin.find({ eventId: req.params.eventId })
      .sort({ checkinTime: -1 });
    
    const checkinsWithDetails = await Promise.all(
      checkins.map(async (checkin) => {
        const registration = await Registration.findOne({ registrationId: checkin.registrationId });
        return {
          ...checkin.toObject(),
          registration
        };
      })
    );
    
    res.json(checkinsWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
