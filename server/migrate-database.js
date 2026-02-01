const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Admin = require('./models/Admin');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Checkin = require('./models/Checkin');
const Consultation = require('./models/Consultation');

// Database connections
const OLD_DB_URI = 'mongodb+srv://sanskarchourasiya910_db_user:eKOyJH3TCHObFvNE@cluster0.ttnub49.mongodb.net/event-registration';
const NEW_DB_URI = process.env.MONGODB_URI;

async function migrateDatabase() {
  let oldConnection, newConnection;
  
  try {
    console.log('🚀 Starting database migration...');
    
    // Connect to old database
    console.log('📡 Connecting to old database...');
    oldConnection = await mongoose.createConnection(OLD_DB_URI);
    console.log('✅ Connected to old database');
    
    // Connect to new database
    console.log('📡 Connecting to new database...');
    newConnection = await mongoose.createConnection(NEW_DB_URI);
    console.log('✅ Connected to new database');
    
    // Create models for both connections
    const OldAdmin = oldConnection.model('Admin', Admin.schema);
    const OldEvent = oldConnection.model('Event', Event.schema);
    const OldRegistration = oldConnection.model('Registration', Registration.schema);
    const OldCheckin = oldConnection.model('Checkin', Checkin.schema);
    const OldConsultation = oldConnection.model('Consultation', Consultation.schema);
    
    const NewAdmin = newConnection.model('Admin', Admin.schema);
    const NewEvent = newConnection.model('Event', Event.schema);
    const NewRegistration = newConnection.model('Registration', Registration.schema);
    const NewCheckin = newConnection.model('Checkin', Checkin.schema);
    const NewConsultation = newConnection.model('Consultation', Consultation.schema);
    
    // Migration functions
    const migrateCollection = async (OldModel, NewModel, collectionName) => {
      console.log(`📦 Migrating ${collectionName}...`);
      
      const oldData = await OldModel.find({});
      console.log(`   Found ${oldData.length} documents in ${collectionName}`);
      
      if (oldData.length > 0) {
        // Clear existing data in new database
        await NewModel.deleteMany({});
        
        // Insert data in batches
        const batchSize = 100;
        for (let i = 0; i < oldData.length; i += batchSize) {
          const batch = oldData.slice(i, i + batchSize);
          await NewModel.insertMany(batch, { ordered: false });
        }
        
        console.log(`   ✅ Migrated ${oldData.length} documents to ${collectionName}`);
      } else {
        console.log(`   ⚠️  No documents found in ${collectionName}`);
      }
    };
    
    // Migrate all collections
    await migrateCollection(OldAdmin, NewAdmin, 'Admin');
    await migrateCollection(OldEvent, NewEvent, 'Events');
    await migrateCollection(OldRegistration, NewRegistration, 'Registrations');
    await migrateCollection(OldCheckin, NewCheckin, 'Check-ins');
    await migrateCollection(OldConsultation, NewConsultation, 'Consultations');
    
    // Verify migration
    console.log('\n🔍 Verifying migration...');
    const newAdminCount = await NewAdmin.countDocuments();
    const newEventCount = await NewEvent.countDocuments();
    const newRegistrationCount = await NewRegistration.countDocuments();
    const newCheckinCount = await NewCheckin.countDocuments();
    const newConsultationCount = await NewConsultation.countDocuments();
    
    console.log(`   Admin documents: ${newAdminCount}`);
    console.log(`   Event documents: ${newEventCount}`);
    console.log(`   Registration documents: ${newRegistrationCount}`);
    console.log(`   Check-in documents: ${newCheckinCount}`);
    console.log(`   Consultation documents: ${newConsultationCount}`);
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('✅ All data has been transferred to the new database');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close connections
    if (oldConnection) {
      await oldConnection.close();
      console.log('🔌 Closed old database connection');
    }
    if (newConnection) {
      await newConnection.close();
      console.log('🔌 Closed new database connection');
    }
  }
}

// Test new database connection
async function testNewConnection() {
  try {
    console.log('\n🧪 Testing new database connection...');
    await mongoose.connect(NEW_DB_URI);
    
    const adminCount = await Admin.countDocuments();
    const eventCount = await Event.countDocuments();
    const registrationCount = await Registration.countDocuments();
    
    console.log('✅ New database connection successful!');
    console.log(`   Found ${adminCount} admins, ${eventCount} events, ${registrationCount} registrations`);
    
    await mongoose.disconnect();
    console.log('🔌 Test connection closed');
    
  } catch (error) {
    console.error('❌ New database connection failed:', error);
    process.exit(1);
  }
}

// Run migration
if (require.main === module) {
  migrateDatabase()
    .then(() => testNewConnection())
    .then(() => {
      console.log('\n🚀 Migration and verification complete!');
      console.log('💡 You can now start your application with the new database');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Process failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateDatabase, testNewConnection };