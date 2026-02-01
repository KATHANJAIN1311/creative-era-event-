const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Import models
const Admin = require('./models/Admin');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Checkin = require('./models/Checkin');
const Consultation = require('./models/Consultation');

const OLD_DB_URI = 'mongodb+srv://sanskarchourasiya910_db_user:eKOyJH3TCHObFvNE@cluster0.ttnub49.mongodb.net/event-registration';

async function createBackup() {
  let connection;
  
  try {
    console.log('📦 Creating database backup...');
    
    // Connect to old database
    connection = await mongoose.createConnection(OLD_DB_URI);
    console.log('✅ Connected to database');
    
    // Create models
    const AdminModel = connection.model('Admin', Admin.schema);
    const EventModel = connection.model('Event', Event.schema);
    const RegistrationModel = connection.model('Registration', Registration.schema);
    const CheckinModel = connection.model('Checkin', Checkin.schema);
    const ConsultationModel = connection.model('Consultation', Consultation.schema);
    
    // Create backup directory
    const backupDir = path.join(__dirname, 'backup');
    await fs.mkdir(backupDir, { recursive: true });
    
    // Backup each collection
    const collections = [
      { model: AdminModel, name: 'admins' },
      { model: EventModel, name: 'events' },
      { model: RegistrationModel, name: 'registrations' },
      { model: CheckinModel, name: 'checkins' },
      { model: ConsultationModel, name: 'consultations' }
    ];
    
    const backupData = {};
    
    for (const { model, name } of collections) {
      console.log(`📄 Backing up ${name}...`);
      const data = await model.find({}).lean();
      backupData[name] = data;
      console.log(`   ✅ Backed up ${data.length} documents from ${name}`);
    }
    
    // Save backup to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
    
    await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`💾 Backup saved to: ${backupFile}`);
    
    // Create summary
    const summary = {
      timestamp: new Date().toISOString(),
      collections: Object.keys(backupData).map(name => ({
        name,
        count: backupData[name].length
      })),
      totalDocuments: Object.values(backupData).reduce((sum, arr) => sum + arr.length, 0)
    };
    
    const summaryFile = path.join(backupDir, `backup-summary-${timestamp}.json`);
    await fs.writeFile(summaryFile, JSON.stringify(summary, null, 2));
    
    console.log('\n📊 Backup Summary:');
    summary.collections.forEach(({ name, count }) => {
      console.log(`   ${name}: ${count} documents`);
    });
    console.log(`   Total: ${summary.totalDocuments} documents`);
    
    console.log('\n🎉 Backup completed successfully!');
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
      console.log('🔌 Database connection closed');
    }
  }
}

if (require.main === module) {
  createBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { createBackup };