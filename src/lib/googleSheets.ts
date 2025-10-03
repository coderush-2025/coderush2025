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
  members: {
    fullName: string;
    indexNumber: string;
    batch: string;
    email: string;
  }[];
  timestamp: Date;
}

/**
 * Append registration data to Google Sheets
 */
export async function appendToGoogleSheets(data: RegistrationData) {
  try {
    if (!SPREADSHEET_ID) {
      console.error('⚠️ GOOGLE_SHEET_ID not configured');
      return { success: false, error: 'Sheet ID not configured' };
    }

    // Prepare row data
    const timestamp = new Date().toISOString();
    
    // Create rows - one row per team with all members
    const memberDetails = data.members.map((m, index) => 
      `Member ${index + 1}: ${m.fullName} (${m.indexNumber}, Batch ${m.batch}, ${m.email})`
    ).join(' | ');

    const rows = [
      [
        timestamp,
        data.teamName,
        data.hackerrankUsername,
        data.members.length,
        memberDetails,
        // Individual member columns for easier filtering
        data.members[0]?.fullName || '',
        data.members[0]?.indexNumber || '',
        data.members[0]?.batch || '',
        data.members[0]?.email || '',
        data.members[1]?.fullName || '',
        data.members[1]?.indexNumber || '',
        data.members[1]?.batch || '',
        data.members[1]?.email || '',
        data.members[2]?.fullName || '',
        data.members[2]?.indexNumber || '',
        data.members[2]?.batch || '',
        data.members[2]?.email || '',
        data.members[3]?.fullName || '',
        data.members[3]?.indexNumber || '',
        data.members[3]?.batch || '',
        data.members[3]?.email || '',
      ],
    ];

    // Append to sheet
    // Wrap sheet name in quotes if it contains spaces or special characters
    const sheetRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-') 
      ? `'${SHEET_NAME}'!A1` 
      : `${SHEET_NAME}!A1`;
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRange,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: rows,
      },
    });

    console.log('✅ Data saved to Google Sheets:', response.data);
    return { success: true, data: response.data };
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
        'HackerRank Username',
        'Member Count',
        'All Members',
        // Member 1
        'Member 1 Name',
        'Member 1 Index',
        'Member 1 Batch',
        'Member 1 Email',
        // Member 2
        'Member 2 Name',
        'Member 2 Index',
        'Member 2 Batch',
        'Member 2 Email',
        // Member 3
        'Member 3 Name',
        'Member 3 Index',
        'Member 3 Batch',
        'Member 3 Email',
        // Member 4
        'Member 4 Name',
        'Member 4 Index',
        'Member 4 Batch',
        'Member 4 Email',
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
