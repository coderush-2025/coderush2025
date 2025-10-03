import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const MAX_TEAMS = 100;

async function checkTeamCount() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    console.error('Please make sure .env.local exists and contains MONGODB_URI');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the registrations collection
    const Registration = mongoose.connection.collection('registrations');

    // Count all registrations
    const totalCount = await Registration.countDocuments({});
    
    // Count completed registrations (state: DONE)
    const completedCount = await Registration.countDocuments({ state: 'DONE' });
    
    // Count in-progress registrations
    const inProgressCount = totalCount - completedCount;

    console.log('\n📊 Team Registration Status:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Completed registrations: ${completedCount}/${MAX_TEAMS}`);
    console.log(`⏳ In-progress registrations: ${inProgressCount}`);
    console.log(`📝 Total sessions: ${totalCount}`);
    console.log(`🎯 Slots remaining: ${MAX_TEAMS - completedCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (completedCount >= MAX_TEAMS) {
      console.log('\n🚫 REGISTRATION CLOSED: Maximum teams reached!');
    } else if (completedCount >= MAX_TEAMS * 0.9) {
      console.log(`\n⚠️  WARNING: Only ${MAX_TEAMS - completedCount} slots remaining!`);
    } else {
      console.log('\n✅ Registration is open.');
    }

    // Get list of completed teams
    if (completedCount > 0) {
      console.log('\n📋 Completed Teams:');
      const teams = await Registration.find({ state: 'DONE' })
        .sort({ createdAt: 1 })
        .toArray();
      
      teams.forEach((team, index: number) => {
        const date = team.createdAt ? new Date(team.createdAt).toLocaleString() : 'Unknown';
        console.log(`${index + 1}. ${team.teamName || 'Unnamed'} (${date})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

checkTeamCount();
