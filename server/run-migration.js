const { createBackup } = require('./backup-database');
const { migrateDatabase, testNewConnection } = require('./migrate-database');
const { testConnection } = require('./test-connection');

async function runFullMigration() {
  console.log('🚀 Starting complete database migration process...\n');
  
  try {
    // Step 1: Create backup
    console.log('STEP 1: Creating backup of current database');
    console.log('=' .repeat(50));
    await createBackup();
    console.log('\n');
    
    // Step 2: Migrate data
    console.log('STEP 2: Migrating data to new database');
    console.log('=' .repeat(50));
    await migrateDatabase();
    console.log('\n');
    
    // Step 3: Test new connection
    console.log('STEP 3: Testing new database connection');
    console.log('=' .repeat(50));
    await testConnection();
    console.log('\n');
    
    // Step 4: Final summary
    console.log('STEP 4: Migration Summary');
    console.log('=' .repeat(50));
    console.log('✅ Backup created successfully');
    console.log('✅ Data migrated successfully');
    console.log('✅ New database connection verified');
    console.log('✅ All operations completed successfully');
    
    console.log('\n🎉 MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Start your application: npm start');
    console.log('   2. Verify all functionality works correctly');
    console.log('   3. Remove old database references if everything works');
    console.log('\n💡 Backup files are stored in the ./backup directory');
    
  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify the new MongoDB connection string is correct');
    console.log('   3. Ensure you have proper database permissions');
    console.log('   4. Check the backup files in ./backup directory');
    
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--backup-only')) {
  createBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (args.includes('--migrate-only')) {
  migrateDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (args.includes('--test-only')) {
  testConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  runFullMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}