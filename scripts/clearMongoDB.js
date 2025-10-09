/* eslint-disable @typescript-eslint/no-require-imports */
// Script to clear all registrations from MongoDB
// Run this: node scripts/clearMongoDB.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function clearMongoDB() {
  try {
    console.log('🧹 Clearing MongoDB registrations...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the Registration collection
    const db = mongoose.connection.db;
    const collection = db.collection('registrations');

    // Count documents before deletion
    const countBefore = await collection.countDocuments();
    console.log(`📊 Found ${countBefore} registration(s) in database`);

    if (countBefore === 0) {
      console.log('✅ Database is already empty');
      await mongoose.connection.close();
      return;
    }

    // Delete all documents
    const result = await collection.deleteMany({});
    console.log(`\n✅ Deleted ${result.deletedCount} registration(s)`);

    // Verify deletion
    const countAfter = await collection.countDocuments();
    console.log(`📊 Remaining documents: ${countAfter}`);

    await mongoose.connection.close();
    console.log('\n✨ MongoDB cleared successfully!');

  } catch (error) {
    console.error('❌ Error clearing MongoDB:', error);
    if (error.message) {
      console.error('Error message:', error.message);
    }
    process.exit(1);
  }
}

clearMongoDB();
