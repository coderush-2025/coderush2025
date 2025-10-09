import { google } from 'googleapis';

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Sheet1'; // Sheet name (can have spaces)

export interface RegistrationData {
  teamName: string;
  hackerrankUsername: string;
  teamBatch: string;
  members: {
    fullName: string;
    indexNumber: string;
    batch: string;
    email: string;
  }[];
  timestamp: Date;
}

/**
 * Append or update registration data in Google Sheets
 * If team already exists, updates the existing rows
 * Otherwise, appends new rows
 */
export async function appendToGoogleSheets(data: RegistrationData) {
  try {
    if (!SPREADSHEET_ID) {
      console.error('⚠️ GOOGLE_SHEET_ID not configured');
      return { success: false, error: 'Sheet ID not configured' };
    }

    // Prepare row data
    const timestamp = new Date().toISOString();

    // Create rows - one per other member (excluding leader)
    // First row includes team info + leader info, then other members follow
    const rows = data.members.slice(1).map((member, index) => [
      // Team info only in first row
      index === 0 ? timestamp : '',
      index === 0 ? data.teamName : '',
      index === 0 ? data.hackerrankUsername : '',
      index === 0 ? data.teamBatch : '',
      // Leader info only in first row
      index === 0 ? data.members[0]?.fullName || '' : '',
      index === 0 ? data.members[0]?.indexNumber || '' : '',
      index === 0 ? data.members[0]?.email || '' : '',
      // Other member info (appears in all 3 rows)
      member.fullName,
      member.indexNumber,
      member.email,
    ]);

    // Wrap sheet name in quotes if it contains spaces or special characters
    const sheetRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-')
      ? `'${SHEET_NAME}'!A:J`
      : `${SHEET_NAME}!A:J`;

    // Get all existing data to check if team already exists
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRange,
    });

    const allRows = existingData.data.values || [];

    // Find if team already exists (check by team name in column B)
    let teamRowIndex = -1;
    for (let i = 1; i < allRows.length; i++) { // Skip header row (index 0)
      if (allRows[i][1] === data.teamName) { // Column B is team name
        teamRowIndex = i;
        break;
      }
    }

    if (teamRowIndex !== -1) {
      // Team exists - update the existing 3 rows
      console.log(`📝 Updating existing team at row ${teamRowIndex + 1}`);

      const updateRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-')
        ? `'${SHEET_NAME}'!A${teamRowIndex + 1}:J${teamRowIndex + 3}`
        : `${SHEET_NAME}!A${teamRowIndex + 1}:J${teamRowIndex + 3}`;

      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: updateRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: rows,
        },
      });

      console.log('✅ Data updated in Google Sheets:', response.data);
      return { success: true, data: response.data, updated: true };
    } else {
      // Team doesn't exist - append new rows
      console.log('➕ Appending new team to Google Sheets');

      const appendRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-')
        ? `'${SHEET_NAME}'!A1`
        : `${SHEET_NAME}!A1`;

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: appendRange,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: rows,
        },
      });

      console.log('✅ Data saved to Google Sheets:', response.data);
      return { success: true, data: response.data, updated: false };
    }
  } catch (error) {
    console.error('❌ Error saving to Google Sheets:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Initialize Google Sheet with headers (run once)
 */
export async function initializeSheetHeaders() {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SHEET_ID not configured');
    }

    const headers = [
      [
        'Timestamp',
        'Team Name',
        'Hackerrank Username',
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

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: headers,
      },
    });

    console.log('✅ Sheet headers initialized');
    return { success: true };
  } catch (error) {
    console.error('❌ Error initializing sheet headers:', error);
    throw error;
  }
}
