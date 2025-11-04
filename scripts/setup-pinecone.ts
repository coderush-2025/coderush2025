/**
 * Setup Script: Populate Pinecone Vector Database
 * Run once: npx tsx scripts/setup-pinecone.ts
 */

// Load environment variables
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local first, then .env
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { initializePineconeIndex, populateVectorDatabase } from '../src/lib/vectorService';

async function setup() {
  console.log('🚀 Starting Pinecone setup...\n');

  // Check if API key is configured
  if (!process.env.PINECONE_API_KEY || process.env.PINECONE_API_KEY === 'your-key-here-if-you-want-it') {
    console.log('⚠️  Pinecone API key not configured in .env');
    console.log('📝 To use Pinecone:');
    console.log('   1. Get free API key from: https://www.pinecone.io/');
    console.log('   2. Add to .env: PINECONE_API_KEY=your-actual-key');
    console.log('   3. Run this script again\n');
    console.log('✅ System will use keyword search (works great!)');
    process.exit(0);
  }

  try {
    // Step 1: Initialize index
    console.log('📊 Step 1: Initializing Pinecone index...');
    const indexCreated = await initializePineconeIndex();

    if (!indexCreated) {
      console.error('❌ Failed to initialize Pinecone index');
      process.exit(1);
    }

    console.log('✅ Index initialized successfully\n');

    // Step 2: Populate with knowledge base
    console.log('📚 Step 2: Populating vector database...');
    console.log('   (This may take 1-2 minutes)\n');

    const populated = await populateVectorDatabase();

    if (!populated) {
      console.error('❌ Failed to populate vector database');
      process.exit(1);
    }

    console.log('\n✅ SUCCESS! Pinecone is ready to use!');
    console.log('\n🎯 Your chat assistant will now use:');
    console.log('   - Semantic search (Pinecone)');
    console.log('   - Better synonym understanding');
    console.log('   - Improved accuracy\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n💡 Tip: System will fall back to keyword search automatically');
    process.exit(1);
  }
}

setup();
