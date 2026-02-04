# Event Registration System - Backend Server

A comprehensive Node.js backend API for the Event Registration & Entry Automation System, designed to handle event management, user registrations, QR code generation, and real-time check-ins.

## 🚀 Features

### Core API Functionality
- **Event Management**: CRUD operations for events with image upload support
- **User Registration**: Secure registration with QR code generation
- **QR Code Verification**: Real-time check-in system with QR scanning
- **Email Notifications**: Professional confirmation emails with QR codes
- **Real-time Updates**: WebSocket integration for live data synchronization
- **Admin Authentication**: JWT-based admin authentication system
- **File Upload**: Multer integration for event image uploads

### Security Features
- CORS configuration for cross-origin requests
- Input validation and sanitization
- JWT token authentication
- Password hashing with bcrypt
- Request origin validation
- Rate limiting ready

## 🛠️ Technology Stack

- **Runtime**: Node.js 18.x
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email**: Nodemailer (Gmail integration)
- **QR Codes**: QRCode.js
- **Real-time**: Socket.io
- **Process Management**: PM2

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- Gmail account for email notifications
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/KATHANJAIN1311/server.git
cd server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Secret (Generate a secure random string)
JWT_SECRET=your_jwt_secret_key_here

# Client URL (Frontend)
CLIENT_URL=https://yourdomain.com

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Create Admin User
```bash
npm run create-admin
```

### 5. Start the Server

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

#### PM2 Production Deployment
```bash
npm run pm2:prod
```

## 📁 Project Structure

```
server/
├── models/
│   ├── Admin.js          # Admin user schema
│   ├── Event.js          # Event schema
│   ├── Registration.js   # Registration schema
│   ├── Checkin.js        # Check-in schema
│   └── Consultation.js   # Consultation schema
├── routes/
│   ├── admin.js          # Admin authentication routes
│   ├── events.js         # Event CRUD routes
│   ├── registrations.js  # Registration routes
│   ├── checkins.js       # Check-in verification routes
│   ├── consultations.js  # Consultation routes
│   └── bookings.js       # Booking validation routes
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── utils/
│   └── emailTemplate.js  # Email template generator
├── uploads/              # File upload directory
├── index.js              # Main server file
├── package.json          # Dependencies and scripts
├── ecosystem.config.js   # PM2 configuration
├── createAdmin.js        # Admin creation script
└── .env.example          # Environment variables template
```

## 🔌 API Endpoints

### Health Check
- `GET /` - Server status
- `GET /api` - API status
- `GET /api/health` - Health check with database status

### Authentication
- `POST /api/admin/login` - Admin login

### Events
- `GET /api/events` - Get all active events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event (with image upload)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Soft delete event

### Registrations
- `POST /api/registrations` - Create registration
- `GET /api/registrations` - Get all registrations
- `GET /api/registrations/event/:eventId` - Get registrations for event
- `GET /api/registrations/user/:email` - Get user registrations
- `GET /api/registrations/search?email=` - Search registrations
- `GET /api/registrations/:registrationId` - Get registration by ID

### Check-ins
- `POST /api/checkins/verify` - Verify QR and check-in

### Consultations
- `POST /api/consultations` - Create consultation request
- `GET /api/consultations` - Get all consultations
- `PATCH /api/consultations/:id/status` - Update consultation status
- `GET /api/consultations/search?email=` - Search consultations

### Bookings
- `POST /api/bookings` - Validate booking

## 📊 Database Schema

### Events Collection
```javascript
{
  eventId: String (unique),
  name: String,
  date: Date,
  time: String,
  venue: String,
  description: String,
  imageUrl: String,
  isActive: Boolean,
  maxCapacity: Number,
  ticketTiers: [{
    name: String,
    price: Number,
    seats: Number
  }]
}
```

### Registrations Collection
```javascript
{
  registrationId: String (unique),
  eventId: String,
  name: String,
  email: String,
  phone: String,
  company: String,
  ticketTier: String,
  numberOfTickets: Number,
  totalAmount: Number,
  status: String,
  isCheckedIn: Boolean,
  checkedInAt: Date,
  qrCode: String,
  paymentId: String,
  paymentStatus: String
}
```

### Check-ins Collection
```javascript
{
  checkinId: String (unique),
  registrationId: String,
  eventId: String,
  checkinTime: Date,
  checkedInBy: String
}
```

## 🔒 Security Features

- **CORS Configuration**: Properly configured for production domains
- **Input Sanitization**: XSS prevention on all inputs
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Origin Validation**: Request origin verification
- **File Upload Security**: Restricted file types and sizes

## 📧 Email Integration

The system sends professional confirmation emails with:
- Registration details
- Event information
- QR code attachment
- Company branding
- Contact information

## 🔄 Real-time Features

WebSocket integration provides:
- Live registration updates
- Real-time check-in notifications
- Dashboard data synchronization

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production with PM2
```bash
npm run pm2:prod
npm run pm2:logs    # View logs
npm run pm2:status  # Check status
```

### Environment Variables for Production
Update `ecosystem.config.js` with production values:
- MongoDB connection string
- JWT secret
- Email credentials
- Client URL

## 📝 API Response Format

### Success Response
```javascript
{
  success: true,
  data: {...},
  message: "Operation successful"
}
```

### Error Response
```javascript
{
  success: false,
  message: "Error description",
  error: "Detailed error (development only)"
}
```

## 🧪 Testing

### Manual Testing
- Use Postman or similar tools
- Test all endpoints with various inputs
- Verify CORS functionality
- Test file upload functionality

### Health Check
```bash
curl http://localhost:3001/api/health
```

## 📊 Monitoring

### PM2 Commands
```bash
pm2 status                    # Check process status
pm2 logs creativeeraevents-api # View logs
pm2 restart creativeeraevents-api # Restart process
pm2 stop creativeeraevents-api    # Stop process
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: creativeeraevents@gmail.com
- Phone: +91 90981 76171

---

**Creative Era Events** - Streamlining event management with technology.