const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-registration');
    
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    const admin = new Admin({
      username: 'admin',
      password: 'admin123'
    });
    
    await admin.save();
    console.log('Default admin created: username=admin, password=admin123');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

createDefaultAdmin();