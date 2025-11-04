/**
 * Check API Keys Configuration
 * Verifies that Gemini and Pinecone API keys are properly loaded
 */

console.log('🔑 Checking API Keys Configuration\n');
console.log('='.repeat(60));

// Check Gemini API Key
const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
console.log('\n📊 Gemini API Key:');
if (geminiKey) {
  console.log(`✅ Configured (${geminiKey.substring(0, 20)}...)`);
} else {
  console.log('❌ NOT configured');
  console.log('⚠️  Set GOOGLE_GEMINI_API_KEY in .env.local');
}

// Check Pinecone API Key
const pineconeKey = process.env.PINECONE_API_KEY;
console.log('\n📊 Pinecone API Key:');
if (pineconeKey) {
  console.log(`✅ Configured (${pineconeKey.substring(0, 20)}...)`);
} else {
  console.log('❌ NOT configured');
  console.log('⚠️  Set PINECONE_API_KEY in .env.local');
}

// Check MongoDB URI
const mongoUri = process.env.MONGODB_URI;
console.log('\n📊 MongoDB URI:');
if (mongoUri) {
  console.log('✅ Configured');
} else {
  console.log('❌ NOT configured');
}

console.log('\n' + '='.repeat(60));

if (geminiKey && pineconeKey) {
  console.log('\n✅ All API keys are configured!');
  console.log('\n📝 Next steps:');
  console.log('1. If you just added/changed keys, restart your Next.js dev server');
  console.log('2. Run: npm run dev');
  console.log('3. Test the chat assistant in your browser');
} else {
  console.log('\n❌ Some API keys are missing!');
  console.log('\n📝 Fix:');
  console.log('1. Check that .env.local exists in project root');
  console.log('2. Add missing keys to .env.local');
  console.log('3. Restart Next.js dev server: npm run dev');
}
