/* eslint-disable @typescript-eslint/no-require-imports */
// Script to initialize Google Sheets headers
// Run this once: node scripts/initSheetHeaders.js

require('dotenv').config({ path: '.env.local' });

const { google } = require('googleapis');

async function initializeHeaders() {
  try {
    console.log('🔧 Initializing Google Sheets headers...');

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

    const headers = [
      [
        'Timestamp',
        'Team Name',
        'Batch',
        'Leader Name',
        'Leader Index',
        'Leader Email',
        'Member Name',
        'Member Index',
        'Member Email',
      ],
    ];

    // Wrap sheet name in quotes if it contains spaces or special characters
    const sheetRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-')
      ? `'${SHEET_NAME}'!A1`
      : `${SHEET_NAME}!A1`;

    console.log(`📋 Sheet: ${SHEET_NAME}`);
    console.log(`📋 Range: ${sheetRange}`);
    console.log(`📋 Headers: ${headers[0].join(', ')}`);

    // First, add the header values
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: headers,
      },
    });

    console.log('✅ Headers added');
    console.log('🎨 Applying formatting (bold, background color, centered)...');

    // Get the sheet ID
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheet = spreadsheet.data.sheets.find(
      (s) => s.properties.title === SHEET_NAME
    );

    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }

    const sheetId = sheet.properties.sheetId;

    // Format headers: bold, background color, centered, frozen
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          // Make header row bold
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: headers[0].length,
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    bold: true,
                    fontSize: 11,
                  },
                  backgroundColor: {
                    red: 0.2,
                    green: 0.7,
                    blue: 0.8,
                  },
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE',
                },
              },
              fields: 'userEnteredFormat(textFormat,backgroundColor,horizontalAlignment,verticalAlignment)',
            },
          },
          // Freeze header row
          {
            updateSheetProperties: {
              properties: {
                sheetId: sheetId,
                gridProperties: {
                  frozenRowCount: 1,
                },
              },
              fields: 'gridProperties.frozenRowCount',
            },
          },
          // Auto-resize columns
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: sheetId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: headers[0].length,
              },
            },
          },
        ],
      },
    });

    console.log('✅ Sheet headers initialized successfully!');
    console.log(`\n✨ Your Google Sheet now has ${headers[0].length} columns:`);
    headers[0].forEach((header, index) => {
      console.log(`   ${index + 1}. ${header}`);
    });
  } catch (error) {
    console.error('❌ Error initializing sheet headers:', error);
    if (error.message) {
      console.error('Error message:', error.message);
    }
    process.exit(1);
  }
}

initializeHeaders();
