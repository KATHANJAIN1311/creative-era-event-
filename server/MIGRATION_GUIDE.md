# Database Migration Guide

This guide explains how to migrate your Event Registration System from the old MongoDB database to the new one.

## 🔄 Migration Overview

The migration process includes:
1. **Backup**: Creates a complete backup of your current database
2. **Migration**: Transfers all data to the new database
3. **Verification**: Tests the new database connection and functionality

## 📋 Prerequisites

- Node.js and npm installed
- Access to both old and new MongoDB databases
- Updated `.env` file with new connection string

## 🚀 Quick Migration

Run the complete migration process:

```bash
cd server
npm run migrate
```

This will:
- Create a backup of your current data
- Migrate all collections to the new database
- Verify the new connection works properly

## 🔧 Individual Commands

### Create Backup Only
```bash
npm run backup
```

### Test New Connection Only
```bash
npm run test-connection
```

### Manual Migration Steps
```bash
# 1. Create backup
node backup-database.js

# 2. Run migration
node migrate-database.js

# 3. Test connection
node test-connection.js
```

## 📊 What Gets Migrated

The following collections are migrated:

- **Admin** - Administrator accounts
- **Events** - Event information and details
- **Registrations** - User registrations and QR codes
- **Check-ins** - Check-in records and timestamps
- **Consultations** - Consultation bookings

## 🔒 Database Configuration

### Old Database
```
mongodb+srv://sanskarchourasiya910_db_user:***@cluster0.ttnub49.mongodb.net/event-registration
```

### New Database
```
mongodb+srv://abhiback14_db_user:CREATIVE@creative-era.kjruuxs.mongodb.net/event-registration?appName=creative-era
```

## 📁 Backup Files

Backups are stored in `./backup/` directory with timestamps:
- `backup-YYYY-MM-DDTHH-mm-ss.json` - Complete data backup
- `backup-summary-YYYY-MM-DDTHH-mm-ss.json` - Migration summary

## ✅ Verification Steps

After migration, verify:

1. **Connection Test**: Run `npm run test-connection`
2. **Data Integrity**: Check document counts match
3. **Application Test**: Start the app and test key features
4. **Admin Access**: Verify admin login works
5. **Event Management**: Test creating/editing events
6. **Registration Flow**: Test user registration
7. **QR Scanning**: Test check-in functionality

## 🚨 Troubleshooting

### Connection Issues
- Verify the new MongoDB URI is correct
- Check network connectivity
- Ensure database user has proper permissions

### Migration Failures
- Check backup files in `./backup/` directory
- Verify old database is accessible
- Ensure sufficient disk space

### Data Inconsistencies
- Compare document counts between old and new databases
- Check for any error messages during migration
- Verify all required fields are present

## 🔄 Rollback Process

If you need to rollback:

1. Keep the old database connection string
2. Use backup files to restore data if needed
3. Update `.env` file back to old connection string

## 📞 Support

If you encounter issues:

1. Check the console output for error messages
2. Verify all prerequisites are met
3. Ensure both databases are accessible
4. Contact support with error logs and backup files

## 🎯 Post-Migration Checklist

- [ ] Migration completed successfully
- [ ] New database connection tested
- [ ] Application starts without errors
- [ ] Admin login works
- [ ] Event creation/editing works
- [ ] User registration works
- [ ] QR code generation works
- [ ] Check-in functionality works
- [ ] All data is accessible
- [ ] Backup files are secure

## 🔐 Security Notes

- Keep backup files secure and private
- Update any hardcoded connection strings
- Verify environment variables are properly set
- Remove old database access when migration is confirmed successful

---

**Note**: Always test the migration in a development environment before running in production.