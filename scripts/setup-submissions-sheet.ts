/* eslint-disable @typescript-eslint/no-require-imports */
// Script to initialize Submissions Google Sheet headers
// Run this once: npm run setup-submissions

require('dotenv').config({ path: '.env.local' });

const { google } = require('googleapis');

async function initializeHeaders() {
  try {
    console.log('🚀 Setting up Submissions Google Sheet...');

    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error('GOOGLE_SHEET_ID not found in .env.local');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
    const SHEET_NAME = 'Submissions';

    const headers = [
      [
        'Timestamp',
        'Team Name',
        'GitHub Repository Link',
        'Google Drive Folder Link',
      ],
    ];

    // Get the spreadsheet to check if Submissions sheet exists
    console.log('📋 Checking if Submissions sheet exists...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    let sheet = spreadsheet.data.sheets.find(
      (s: { properties: { title: string } }) => s.properties.title === SHEET_NAME
    );

    let sheetId;

    if (!sheet) {
      // Create the Submissions sheet
      console.log('➕ Creating Submissions sheet...');
      const addSheetResponse = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: SHEET_NAME,
                },
              },
            },
          ],
        },
      });

      sheetId = addSheetResponse.data.replies[0].addSheet.properties.sheetId;
      console.log('✅ Submissions sheet created');
    } else {
      sheetId = sheet.properties.sheetId;
      console.log('✅ Submissions sheet already exists');
    }

    // Add headers
    const sheetRange = `'${SHEET_NAME}'!A1`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: headers,
      },
    });

    console.log('✅ Headers added');
    console.log('🎨 Applying formatting...');

    // Format headers
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
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

    console.log('✅ Submissions sheet setup complete!');
    console.log('\n📋 Headers created:');
    console.log('   1. Timestamp');
    console.log('   2. Team Name');
    console.log('   3. GitHub Repository Link');
    console.log('   4. Google Drive Folder Link');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\nMake sure you have:');
    console.log('1. Set GOOGLE_SERVICE_ACCOUNT_EMAIL in .env.local');
    console.log('2. Set GOOGLE_PRIVATE_KEY in .env.local');
    console.log('3. Set GOOGLE_SHEET_ID in .env.local');
    console.log('4. Shared the Google Sheet with your service account email');
    console.log('5. Created a sheet tab named "Submissions" in your Google Sheet');
    process.exit(1);
  }
}

initializeHeaders();
