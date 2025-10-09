/* eslint-disable @typescript-eslint/no-require-imports */
// Script to clear all data from Google Sheets (keep headers)
// Run this: node scripts/clearSheetData.js

require('dotenv').config({ path: '.env.local' });

const { google } = require('googleapis');

async function clearSheetData() {
  try {
    console.log('🧹 Clearing Google Sheets data...');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
    const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

    if (!SPREADSHEET_ID) {
      throw new Error('❌ GOOGLE_SHEET_ID not configured in .env.local');
    }

    console.log(`📋 Sheet: ${SHEET_NAME}`);
    console.log(`📋 Spreadsheet ID: ${SPREADSHEET_ID}`);

    // Get the sheet to find out how many rows exist
    const sheetRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-')
      ? `'${SHEET_NAME}'!A2:Z`
      : `${SHEET_NAME}!A2:Z`;

    console.log(`🔍 Checking range: ${sheetRange}`);

    // Get current data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRange,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log('✅ Sheet is already empty (no data rows found)');
      return;
    }

    console.log(`📊 Found ${rows.length} data rows to clear`);

    // Clear all data starting from row 2 (keep headers in row 1)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRange,
    });

    console.log('✅ All data cleared successfully!');
    console.log('✨ Headers are preserved in row 1');
    console.log(`🗑️  Removed ${rows.length} rows of data`);

  } catch (error) {
    console.error('❌ Error clearing sheet data:', error);
    if (error.message) {
      console.error('Error message:', error.message);
    }
    process.exit(1);
  }
}

clearSheetData();
