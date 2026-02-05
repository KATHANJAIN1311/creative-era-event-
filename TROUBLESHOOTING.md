# 🔧 Connectivity & Troubleshooting Guide

## ✅ Current Status

### Backend Server
- **Status**: ✅ Running on port 3003
- **Health Check**: http://localhost:3003/api/health
- **Events API**: http://localhost:3003/api/events
- **Database**: ✅ Connected to MongoDB

### Frontend Client
- **Status**: ✅ Running on port 3000
- **Local URL**: http://localhost:3000
- **Production URL**: https://creativeeraevents.in

---

## 🚀 Quick Start

### Option 1: Use Startup Script (Easiest)
```bash
# Double-click this file:
start-dev.bat
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

---

## 🔍 Troubleshooting Steps

### Issue 1: Frontend Can't Connect to Backend

**Symptoms:**
- Events not loading
- "Network Error" messages
- API connection failures

**Solution:**
1. Check backend is running:
   ```bash
   curl http://localhost:3003/api/health
   ```

2. Verify frontend .env file:
   ```
   REACT_APP_API_URL=http://localhost:3003
   ```

3. Restart frontend after .env changes:
   ```bash
   cd client
   npm start
   ```

### Issue 2: Backend Not Running

**Symptoms:**
- Cannot access http://localhost:3003
- Connection refused errors

**Solution:**
1. Start backend:
   ```bash
   cd server
   npm start
   ```

2. Check for port conflicts:
   ```bash
   netstat -ano | findstr :3003
   ```

3. If port is in use, kill the process or change PORT in server/.env

### Issue 3: Database Connection Failed

**Symptoms:**
- "MongoDB disconnected" in logs
- Events not loading from database

**Solution:**
1. Check MongoDB URI in server/.env
2. Verify MongoDB Atlas cluster is running
3. Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 for testing)

### Issue 4: Admin Login Not Working

**Symptoms:**
- "Invalid credentials" error
- Login fails with correct password

**Solution:**
1. Run the fix script:
   ```bash
   cd server
   node fixAdmin.js
   ```

2. Use credentials:
   - Username: `admin`
   - Password: `admin123`

### Issue 5: CORS Errors

**Symptoms:**
- "CORS policy" errors in browser console
- Requests blocked by browser

**Solution:**
1. Backend already configured for CORS
2. Ensure frontend uses correct API URL
3. Check browser console for specific CORS errors

---

## 🌐 Environment Configuration

### Development (Localhost)
**client/.env:**
```env
REACT_APP_API_URL=http://localhost:3003
REACT_APP_SOCKET_URL=http://localhost:3003
```

### Production (Live Domain)
**client/.env.production:**
```env
REACT_APP_API_URL=https://api.creativeeraevents.in
REACT_APP_SOCKET_URL=https://api.creativeeraevents.in
```

---

## 📊 Testing Checklist

### Backend Tests
- [ ] Health check: `curl http://localhost:3003/api/health`
- [ ] Events API: `curl http://localhost:3003/api/events`
- [ ] Admin login: `curl -X POST http://localhost:3003/api/admin/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"`

### Frontend Tests
- [ ] Homepage loads: http://localhost:3000
- [ ] Events display on homepage
- [ ] Admin panel accessible: http://localhost:3000/admin
- [ ] Admin login works
- [ ] Event creation works

### Integration Tests
- [ ] Frontend can fetch events from backend
- [ ] Registration form submits successfully
- [ ] QR codes generate properly
- [ ] Email notifications send

---

## 🔐 Admin Credentials

**Username:** `admin`  
**Password:** `admin123`

To reset admin password:
```bash
cd server
node fixAdmin.js
```

---

## 📝 Common Commands

### Check Running Processes
```bash
# Windows
netstat -ano | findstr :3003
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID> /F
```

### View Logs
```bash
# Backend logs
cd server
npm start

# Frontend logs
cd client
npm start
```

### Database Operations
```bash
# Test MongoDB connection
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(err => console.error('❌ Error:', err));"
```

---

## 🆘 Still Having Issues?

1. **Clear browser cache** and restart browser
2. **Delete node_modules** and reinstall:
   ```bash
   cd server && rm -rf node_modules && npm install
   cd ../client && rm -rf node_modules && npm install
   ```
3. **Check firewall settings** - ensure ports 3000 and 3003 are allowed
4. **Verify .env files** exist in both client/ and server/ directories
5. **Check MongoDB Atlas** - ensure cluster is active and IP whitelist is configured

---

## 📞 Support

- Email: creativeeraevents@gmail.com
- Phone: +91 90981 76171
- GitHub: https://github.com/KATHANJAIN1311/server

---

**Last Updated:** February 2026
