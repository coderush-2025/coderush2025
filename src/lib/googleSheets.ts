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

  // Create rows (one row per member)
  // Only include team info (timestamp, team name, hackerrank username, batch) in the first row
  const rows = data.members.map((member, index) => [
    index === 0 ? timestamp : '',
    index === 0 ? data.teamName : '',
    index === 0 ? data.hackerrankUsername : '',
    index === 0 ? data.teamBatch : '',
    data.members.length,
    member.fullName,
    member.indexNumber,
    member.email,
  ]);    // Append to sheet
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
        'Hackerrank Username',
        'Batch',
        'Team Size',
        'Member Name',
        'Index Number',
        'Email',
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
