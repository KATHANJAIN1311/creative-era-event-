const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const registrationCount = await Registration.countDocuments({ eventId: req.params.id });
    const checkedInCount = await Registration.countDocuments({ eventId: req.params.id, isCheckedIn: true });
    
    res.json({
      ...event.toObject(),
      registrationCount,
      checkedInCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new event
router.post('/', async (req, res) => {
  // Check if request has multipart data
  const contentType = req.headers['content-type'];
  
  if (contentType && contentType.includes('multipart/form-data')) {
    // Handle file upload
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      try {
        const eventId = uuidv4();
        const eventData = {
          eventId,
          ...req.body
        };
        
        if (req.file) {
          eventData.imageUrl = `/uploads/${req.file.filename}`;
        }
        
        const event = new Event(eventData);
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
      } catch (error) {
        console.error('Event creation error:', error);
        res.status(400).json({ message: error.message });
      }
    });
  } else {
    // Handle regular JSON data
    try {
      const eventId = uuidv4();
      const eventData = {
        eventId,
        ...req.body
      };
      
      const event = new Event(eventData);
      const savedEvent = await event.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      console.error('Event creation error:', error);
      res.status(400).json({ message: error.message });
    }
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { eventId: req.params.id },
      req.body,
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { eventId: req.params.id },
      { isActive: false },
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;