# Check-In System Guide

## ✅ Features Implemented

### 1. Admin Check-In Buttons
- **Location**: Admin Dashboard → Registrations Tab
- **Function**: One-click check-in for any registration
- **Status**: Real-time updates with visual indicators

### 2. QR Scanner Check-In Page
- **URL**: `/checkin`
- **Access**: Available in main navigation
- **Features**:
  - QR Code scanning mode
  - Manual Registration ID entry
  - Real-time validation
  - Detailed attendee information display

### 3. User Status Display
- **Location**: My Bookings page
- **Shows**: Check-in status with timestamps
- **Icons**: ✓ for checked-in users

## 🚀 How to Use

### Admin Check-In (Dashboard)
1. Go to Admin → Registrations tab
2. Find the user in the list
3. Click "Check In" button
4. Status updates immediately

### QR Scanner Check-In
1. Navigate to "Check-In" in main menu
2. Choose mode:
   - **QR Code**: Paste QR data (format: `registrationId|eventId`)
   - **Manual**: Enter Registration ID directly
3. Click "Check In"
4. View detailed confirmation

### User View
1. Go to "My Booking"
2. Enter email address
3. View registration status
4. See check-in timestamp if checked in

## 🔧 API Endpoints

### Check-In Registration
```
PATCH /api/registrations/:id/status
Body: { "status": "checkedIn" }
```

### QR/Manual Check-In
```
POST /api/registrations/checkin
Body: { 
  "qrData": "registrationId|eventId" 
  OR 
  "registrationId": "uuid" 
}
```

## 🐛 Troubleshooting

### "Failed to check in user"
- Check if registration ID exists
- Verify server is running on port 5001
- Check browser console for detailed errors

### "Error searching for bookings"
- Ensure MongoDB is connected
- Check if email exists in database
- Verify API proxy configuration

### QR Code Format
- Correct: `uuid-string|event-id`
- Generated automatically during registration
- Available in WhatsApp messages

## 📱 Mobile Support
- Responsive design works on all devices
- Touch-friendly buttons
- Optimized for tablet kiosks

## 🔄 Real-Time Updates
- WebSocket integration
- Live dashboard updates
- Instant status changes
- Cross-device synchronization

## 🎯 Quick Access
- Admin dashboard has "QR Check-In" button
- Main navigation includes "Check-In" link
- Direct URL: `http://localhost:3000/checkin`