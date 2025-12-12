const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
    unique: true
  },
  eventId: {
    type: String,
    required: true,
    ref: 'Event'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    required: true
  },
  registrationType: {
    type: String,
    enum: ['online', 'kiosk'],
    default: 'online'
  },
  isCheckedIn: {
    type: Boolean,
    default: false
  },
  checkedAt: {
    type: Date,
    default: null
  },
  whatsappSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', registrationSchema);