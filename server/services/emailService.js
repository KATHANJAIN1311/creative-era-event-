// Email Service for sending notifications
// To use this service, install nodemailer: npm install nodemailer
// and configure your email provider credentials in .env file

/*
const nodemailer = require('nodemailer');

// Create transporter (configure with your email provider)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send check-in confirmation email
const sendCheckInEmail = async (registration, event) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: registration.email,
      subject: `✅ Checked In - ${event.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Successfully Checked In!</h2>
          <p>Hi ${registration.name},</p>
          <p>You have been successfully checked in for <strong>${event.name}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Event Details:</h3>
            <p><strong>Event:</strong> ${event.name}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Check-in Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>Thank you for attending!</p>
          <p>Best regards,<br>Creative Era Events Team</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Check-in email sent successfully to:', registration.email);
    return true;
  } catch (error) {
    console.error('Error sending check-in email:', error);
    return false;
  }
};

module.exports = {
  sendCheckInEmail
};
*/

// Placeholder for email service
// To enable email notifications:
// 1. Install nodemailer: npm install nodemailer
// 2. Add email credentials to .env file:
//    EMAIL_USER=your-email@gmail.com
//    EMAIL_PASS=your-app-password
// 3. Uncomment the code above
// 4. Import and use in registration routes

console.log('Email service placeholder - configure nodemailer to enable email notifications');

module.exports = {
  sendCheckInEmail: async (registration, event) => {
    console.log(`Email notification: ${registration.name} checked in for ${event.name}`);
    return true;
  }
};