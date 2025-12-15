const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const Registration = require('../models/Registration');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // CSRF Protection - Validate request origin
    const origin = req.get('Origin') || req.get('Referer');
    const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:3005', 'http://localhost:3000'];
    
    if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return res.status(403).json({ message: 'Forbidden: Invalid origin' });
    }

    const { name, email, phone, eventId, registrationType, organization, designation } = req.body;
    
    // Input sanitization to prevent XSS
    const sanitizedName = name ? name.replace(/[<>]/g, '') : '';
    const sanitizedEmail = email ? email.replace(/[<>]/g, '') : '';
    const sanitizedPhone = phone ? phone.replace(/[<>]/g, '') : '';
    const sanitizedOrganization = organization ? organization.replace(/[<>]/g, '') : '';
    const sanitizedDesignation = designation ? designation.replace(/[<>]/g, '') : '';
    
    // Generate unique registration ID
    const registrationId = uuidv4().substring(0, 8).toUpperCase();
    
    // Create QR code data
    const qrData = {
      registrationId,
      eventId,
      name: sanitizedName,
      email: sanitizedEmail,
      timestamp: new Date().toISOString()
    };
    
    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));
    
    const registrationData = {
      registrationId,
      eventId,
      name: sanitizedName,
      email: sanitizedEmail,
      phoneNumber: sanitizedPhone,
      qrCode: qrCodeDataURL,
      registrationType: registrationType || 'online',
      organization: sanitizedOrganization,
      designation: sanitizedDesignation
    };
    
    const registration = new Registration(registrationData);
    await registration.save();
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('newRegistration', { eventId, registration: registrationData });
    }
    
    // Send email with QR code using secure connection
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true, // Use TLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: true
        }
      });

      const mailOptions = {
        from: `"Event Registration" <${process.env.EMAIL_USER}>`,
        to: sanitizedEmail,
        subject: `Registration Successful - ID: ${registrationId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Hello ${sanitizedName},</h2>
            <p>Thank you for registering for the event. Below are your registration details:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Registration ID:</strong> ${registrationId}</p>
              <p><strong>Event ID:</strong> ${eventId}</p>
              <p><strong>Name:</strong> ${sanitizedName}</p>
              <p><strong>Email:</strong> ${sanitizedEmail}</p>
              <p><strong>Phone:</strong> ${sanitizedPhone}</p>
            </div>
            <p><strong>Your QR Code:</strong></p>
            <div style="text-align: center; margin: 20px 0;">
              <img src="${qrCodeDataURL}" alt="QR Code" style="border: 1px solid #ddd; padding: 10px;" />
            </div>
            <p style="color: #666; font-size: 14px;">Save this email for event check-in. Show the QR code at the venue for quick entry.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', sanitizedEmail);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the registration if email fails
    }
    
    res.status(201).json({
      message: 'Registration created successfully!',
      registration: {
        ...registrationData,
        phone: sanitizedPhone // Add phone field for compatibility
      },
      qrCode: qrCodeDataURL
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ 
      error: err.message || 'Error creating registration' 
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(400).json({ error: 'Error fetching registrations' });
  }
});

router.get('/event/:eventId', async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    console.error('Error fetching event registrations:', err);
    res.status(400).json({ error: 'Error fetching event registrations' });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    const registrations = await Registration.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    console.error('Error fetching user registrations:', err);
    res.status(400).json({ error: 'Error fetching user registrations' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { email } = req.query;
    const registrations = await Registration.find({ email }).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    console.error('Error searching registrations:', err);
    res.status(400).json({ error: 'Error searching registrations' });
  }
});

router.get('/:registrationId', async (req, res) => {
  try {
    const registration = await Registration.findOne({ registrationId: req.params.registrationId });
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json(registration);
  } catch (err) {
    console.error('Error fetching registration:', err);
    res.status(400).json({ error: 'Error fetching registration' });
  }
});

module.exports = router;
