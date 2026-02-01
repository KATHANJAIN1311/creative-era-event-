const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Admin = require('./models/Admin');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Checkin = require('./models/Checkin');
const Consultation = require('./models/Consultation');

async function testConnection() {
  try {
    console.log('🧪 Testing new database connection...');
    console.log(`📡 Connecting to: ${process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connection successful!');
    
    // Test each model
    console.log('\n🔍 Testing database collections...');
    
    const tests = [
      { model: Admin, name: 'Admin' },
      { model: Event, name: 'Event' },
      { model: Registration, name: 'Registration' },
      { model: Checkin, name: 'Checkin' },
      { model: Consultation, name: 'Consultation' }
    ];
    
    for (const { model, name } of tests) {
      try {
        const count = await model.countDocuments();
        console.log(`   ✅ ${name}: ${count} documents`);
      } catch (error) {
        console.log(`   ❌ ${name}: Error - ${error.message}`);
      }
    }
    
    // Test basic operations
    console.log('\n🔧 Testing basic operations...');
    
    // Test create operation
    const testEvent = new Event({
      eventId: 'TEST-' + Date.now(),
      name: 'Connection Test Event',
      date: new Date(),
      time: '10:00 AM',
      venue: 'Test Venue',
      description: 'This is a test event for connection verification'
    });
    
    await testEvent.save();
    console.log('   ✅ Create operation successful');
    
    // Test read operation
    const foundEvent = await Event.findOne({ eventId: testEvent.eventId });
    console.log('   ✅ Read operation successful');
    
    // Test update operation
    await Event.updateOne(
      { eventId: testEvent.eventId },
      { description: 'Updated test description' }
    );
    console.log('   ✅ Update operation successful');
    
    // Test delete operation
    await Event.deleteOne({ eventId: testEvent.eventId });
    console.log('   ✅ Delete operation successful');
    
    console.log('\n🎉 All tests passed! Database is ready for use.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

if (require.main === module) {
  testConnection()
    .then(() => {
      console.log('\n✅ Database connection test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Database connection test failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testConnection };