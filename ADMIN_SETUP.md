# Admin Panel Setup Guide

## Quick Setup

1. **Start MongoDB** (make sure MongoDB is running on your system)

2. **Create Default Admin User**:
   ```bash
   cd server
   npm run create-admin
   ```

3. **Start the Application**:
   ```bash
   # From root directory
   npm run dev
   ```

4. **Access Admin Panel**:
   - Navigate to `http://localhost:3005/admin`
   - Login with:
     - **Username**: `admin`
     - **Password**: `admin123`

## Admin Features

✅ **Authentication**: Secure login with JWT tokens
✅ **Dashboard**: Real-time statistics and analytics  
✅ **Event Management**: Create and manage events
✅ **User Management**: View all registered users
✅ **Check-in Tracking**: Monitor attendee check-ins
✅ **Data Export**: Export registrations and check-ins as CSV
✅ **Real-time Updates**: Live data with WebSocket integration

## Security Notes

- Change the default admin password after first login
- The JWT_SECRET is already configured in server/.env
- Admin routes are protected with authentication middleware
- Tokens expire after 24 hours

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

**Important**: Change these credentials in production!