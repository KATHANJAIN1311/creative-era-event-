# Event Registration & Entry Automation System

A comprehensive digital platform designed to streamline and automate the registration, onboarding, verification, and attendee check-in process for Creative Era Events.

## 🚀 Features

### Core Functionality
- **Online Registration**: Web-based registration with automated QR code generation
- **Kiosk Registration**: On-site registration with instant QR slip printing
- **QR Verification**: Quick check-in using QR code scanning
- **Real-time Updates**: Live data synchronization using WebSockets
- **Admin Dashboard**: Comprehensive analytics and event management
- **WhatsApp Integration**: Automated QR code delivery via WhatsApp

### System Components
1. **Web-Based Registration Module**
2. **QR Code Generation & Storage**
3. **WhatsApp Automation Workflow**
4. **Kiosk Registration Interface**
5. **QR Code Slip Printing**
6. **QR Verification & Check-In Module**
7. **Admin Dashboard with Analytics**

## 🛠️ Technology Stack

### Frontend
- **React.js** - User interface framework
- **Tailwind CSS** - Styling and responsive design
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Chart.js** - Data visualization
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Socket.io** - Real-time communication
- **Twilio** - WhatsApp integration
- **QRCode.js** - QR code generation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd event-registration-system
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (client + server)
npm run install-all
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-registration
JWT_SECRET=your_jwt_secret_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### 4. Database Setup

Make sure MongoDB is running on your system:
```bash
# Start MongoDB service
mongod
```

The application will automatically create the required collections on first run.

### 5. Twilio WhatsApp Setup (Optional)

1. Create a Twilio account at https://www.twilio.com/
2. Set up WhatsApp Sandbox or get approved for WhatsApp Business API
3. Add your Twilio credentials to the `.env` file

## 🚀 Running the Application

### Development Mode
```bash
# Run both client and server concurrently
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend client on `http://localhost:3000`

### Production Mode
```bash
# Build the client
npm run build

# Start the server
npm start
```

## 📱 Usage Guide

### 1. Event Creation
- Navigate to `/admin` to access the admin dashboard
- Click "Create Event" to add a new event
- Fill in event details (name, date, time, venue, description)

### 2. Online Registration
- Users can browse events on the homepage
- Click "Register" on any event card
- Fill in registration details (name, email, phone)
- QR code is automatically generated and sent via WhatsApp

### 3. Kiosk Registration
- Access kiosk mode at `/kiosk`
- Large, touch-friendly interface for on-site registration
- Instant QR slip generation with print functionality

### 4. QR Code Verification
- Staff can use `/scanner` for check-in verification
- Supports manual QR data input or image upload
- Real-time validation and check-in confirmation

### 5. Admin Dashboard
- View real-time statistics and analytics
- Monitor registrations and check-ins
- Export data in CSV format
- Hourly check-in charts and registration type breakdown

## 🏗️ Database Schema

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
  maxCapacity: Number
}
```

### Registrations Collection
```javascript
{
  registrationId: String (unique),
  eventId: String (foreign key),
  name: String,
  email: String,
  phone: String,
  qrCode: String,
  registrationType: String (online/kiosk),
  isCheckedIn: Boolean,
  whatsappSent: Boolean
}
```

### Check-ins Collection
```javascript
{
  checkinId: String (unique),
  registrationId: String (foreign key),
  eventId: String (foreign key),
  checkinTime: Date,
  checkedInBy: String
}
```

## 🔌 API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Registrations
- `POST /api/registrations` - Create registration
- `GET /api/registrations/:id` - Get registration by ID
- `GET /api/registrations/event/:eventId` - Get registrations for event

### Check-ins
- `POST /api/checkins/verify` - Verify QR and check-in
- `GET /api/checkins/event/:eventId` - Get check-ins for event

### Admin
- `GET /api/admin/dashboard/:eventId` - Get dashboard data
- `GET /api/admin/export/registrations/:eventId` - Export registrations
- `GET /api/admin/export/checkins/:eventId` - Export check-ins

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimized for tablets and desktop screens
- Touch-friendly kiosk interface

### Real-time Updates
- Live registration counters
- Instant check-in notifications
- WebSocket-based communication

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatible
- High contrast color scheme

## 🔒 Security Features

- Input validation and sanitization
- QR code encryption
- Rate limiting for API endpoints
- CORS configuration
- Environment variable protection

## 📊 Analytics & Reporting

### Dashboard Metrics
- Total registrations
- Check-in statistics
- Attendance rates
- Registration type breakdown
- Hourly check-in patterns

### Export Capabilities
- CSV export for registrations
- Check-in data export
- Custom date range filtering
- Bulk data operations

## 🚀 Deployment

### Local Deployment
The application is ready to run locally with the setup instructions above.

### Cloud Deployment Options

#### AWS Deployment
1. **EC2 Instance**: Deploy on Amazon EC2
2. **MongoDB Atlas**: Use managed MongoDB service
3. **S3**: Store event images and QR codes
4. **CloudFront**: CDN for static assets

#### Google Cloud Deployment
1. **Compute Engine**: Deploy on GCP VM
2. **Cloud MongoDB**: Use Google Cloud MongoDB
3. **Cloud Storage**: Store media files
4. **Cloud CDN**: Content delivery

#### Heroku Deployment
1. Create Heroku app
2. Add MongoDB Atlas add-on
3. Configure environment variables
4. Deploy using Git

## 🧪 Testing

### Manual Testing Checklist
- [ ] Event creation and management
- [ ] Online registration flow
- [ ] Kiosk registration process
- [ ] QR code generation and scanning
- [ ] WhatsApp message delivery
- [ ] Real-time updates
- [ ] Data export functionality
- [ ] Mobile responsiveness

### Automated Testing (Future Enhancement)
- Unit tests for API endpoints
- Integration tests for workflows
- E2E tests for user journeys
- Performance testing for concurrent users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Core functionality implemented
- Basic admin dashboard
- WhatsApp integration
- Responsive design

### Future Enhancements
- Email notifications
- SMS integration
- Advanced analytics
- Multi-language support
- Mobile app
- Payment integration
- Social media sharing
- Advanced reporting
- API rate limiting
- User authentication
- Role-based access control

---

**Creative Era Events** - Streamlining event management with technology.