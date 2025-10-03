/**
 * Setup script to initialize Google Sheets with headers
 * Run this once: npm run setup-sheets
 */

import { initializeSheetHeaders } from '../src/lib/googleSheets';

async function setup() {
  console.log('🚀 Setting up Google Sheets...');
  
  try {
    await initializeSheetHeaders();
    console.log('✅ Google Sheets setup complete!');
    console.log('📊 Your sheet is ready to receive registrations.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.error('\nMake sure you have:');
    console.error('1. Set GOOGLE_SERVICE_ACCOUNT_EMAIL in .env.local');
    console.error('2. Set GOOGLE_PRIVATE_KEY in .env.local');
    console.error('3. Set GOOGLE_SHEET_ID in .env.local');
    console.error('4. Shared the Google Sheet with your service account email');
    process.exit(1);
  }
}

setup();
