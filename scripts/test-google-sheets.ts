/**
 * Test Google Sheets Configuration
 * Checks if Google Sheets API is working and shows available sheets
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { google } from 'googleapis';

async function testGoogleSheets() {
  console.log('🧪 Testing Google Sheets Configuration\n');
  console.log('='.repeat(70));

  // Check environment variables
  const requiredVars = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_SHEET_ID',
    'GOOGLE_SHEET_NAME'
  ];

  let allVarsPresent = true;
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName}: NOT SET`);
      allVarsPresent = false;
    } else {
      console.log(`✅ ${varName}: ${value.substring(0, 30)}...`);
    }
  }

  if (!allVarsPresent) {
    console.log('\n❌ Missing required environment variables');
    return;
  }

  console.log('\n' + '='.repeat(70));
  console.log('Testing Google Sheets API connection...\n');

  try {
    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Get spreadsheet info
    console.log('📊 Fetching spreadsheet information...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId!,
    });

    console.log(`✅ Spreadsheet found: ${spreadsheet.data.properties?.title}`);
    console.log('');

    // List all sheets
    console.log('📋 Available sheet tabs:');
    const availableSheets = spreadsheet.data.sheets || [];

    if (availableSheets.length === 0) {
      console.log('   ⚠️  No sheets found in spreadsheet');
    } else {
      availableSheets.forEach((sheet, index) => {
        const title = sheet.properties?.title || 'Untitled';
        const sheetId = sheet.properties?.sheetId;
        const isTargetSheet = title === process.env.GOOGLE_SHEET_NAME;

        console.log(`   ${index + 1}. ${isTargetSheet ? '✅' : '  '} "${title}" (ID: ${sheetId})`);
      });
    }

    // Check if target sheet exists
    const targetSheetName = process.env.GOOGLE_SHEET_NAME;
    const targetSheet = availableSheets.find(
      (s) => s.properties?.title === targetSheetName
    );

    console.log('');
    console.log('='.repeat(70));
    console.log(`\n🎯 Target sheet: "${targetSheetName}"`);

    if (targetSheet) {
      console.log(`✅ Target sheet exists!`);
      console.log(`   Sheet ID: ${targetSheet.properties?.sheetId}`);

      // Try to read data
      const sheetRange = targetSheetName?.includes(' ') || targetSheetName?.includes('-')
        ? `'${targetSheetName}'!A1:I10`
        : `${targetSheetName}!A1:I10`;

      console.log(`\n📖 Reading sample data from ${sheetRange}...`);

      try {
        const data = await sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId!,
          range: sheetRange,
        });

        const rows = data.data.values || [];
        console.log(`✅ Successfully read ${rows.length} rows`);

        if (rows.length > 0) {
          console.log('\n📄 First row (headers):');
          console.log('   ', rows[0].join(' | '));
        }
      } catch (error) {
        const err = error as { message?: string };
        console.log(`❌ Error reading data: ${err.message}`);
      }
    } else {
      console.log(`❌ Target sheet does NOT exist!`);
      console.log(`\n💡 Solution:`);
      console.log(`   Option 1: Rename one of the sheets to "${targetSheetName}"`);
      console.log(`   Option 2: Update GOOGLE_SHEET_NAME in .env.local to match an existing sheet`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Google Sheets test complete!');

  } catch (error) {
    const err = error as { message?: string; code?: number };
    console.log('\n❌ Error testing Google Sheets:');
    console.log(`   ${err.message}`);

    if (err.code === 403) {
      console.log('\n💡 Permission Error:');
      console.log('   The service account does not have access to the spreadsheet.');
      console.log('   Share the spreadsheet with: ' + process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    } else if (err.code === 404) {
      console.log('\n💡 Spreadsheet Not Found:');
      console.log('   Check if GOOGLE_SHEET_ID is correct in .env.local');
    }
  }
}

testGoogleSheets();
