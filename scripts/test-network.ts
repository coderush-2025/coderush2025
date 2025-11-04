/**
 * Test network connectivity with SSL bypass (FOR TESTING ONLY)
 * WARNING: This disables SSL verification - use only in development!
 */

import dotenv from 'dotenv';
import path from 'path';
import https from 'https';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

// TEMPORARY: Bypass SSL verification (INSECURE - DEV ONLY!)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('⚠️  WARNING: SSL verification is DISABLED (development only!)');
console.log('🧪 Testing network connectivity...\n');

async function testConnections() {
  // Test 1: Check Gemini API
  console.log('1️⃣ Testing Gemini API connection...');
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Hello');
    console.log('   ✅ Gemini API: Connected\n');
  } catch (error) {
    console.log('   ❌ Gemini API: Failed');
    console.log('   Error:', error instanceof Error ? error.message : String(error));
    console.log('');
  }

  // Test 2: Check Pinecone API
  console.log('2️⃣ Testing Pinecone API connection...');
  try {
    const { Pinecone } = await import('@pinecone-database/pinecone');
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });
    const indexes = await pc.listIndexes();
    console.log('   ✅ Pinecone API: Connected');
    console.log('   Indexes found:', indexes.indexes?.length || 0);
    console.log('');
  } catch (error) {
    console.log('   ❌ Pinecone API: Failed');
    console.log('   Error:', error instanceof Error ? error.message : String(error));
    console.log('');
  }

  // Test 3: General internet connectivity
  console.log('3️⃣ Testing general internet...');
  try {
    await fetch('https://www.google.com', {
      method: 'HEAD',
      // @ts-expect-error - Node-specific agent option not in standard fetch types
      agent: new https.Agent({ rejectUnauthorized: false })
    });
    console.log('   ✅ Internet: Connected\n');
  } catch (error) {
    console.log('   ❌ Internet: Failed');
    console.log('   Error:', error instanceof Error ? error.message : String(error));
    console.log('');
  }
}

testConnections().then(() => {
  console.log('═'.repeat(60));
  console.log('✅ Network test complete!');
  console.log('\n💡 If tests failed:');
  console.log('   1. Switch to mobile hotspot or home WiFi');
  console.log('   2. Check if university proxy is blocking external APIs');
  console.log('   3. Use VPN if available');
});
