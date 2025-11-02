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

// Use separate sheet for submissions
const SPREADSHEET_ID = process.env.GOOGLE_SUBMISSIONS_SHEET_ID || process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SUBMISSIONS_SHEET_NAME || 'Submissions';

export interface SubmissionData {
  teamName: string;
  githubLink: string;
  googleDriveLink: string;
  submittedAt: Date;
}

export interface SubmissionUpdateData {
  originalTeamName?: string;
  teamName: string;
  githubLink: string;
  googleDriveLink: string;
  submittedAt: Date;
}

/**
 * Append submission data to Google Sheets (Submissions sheet)
 */
export async function appendSubmissionToSheets(data: SubmissionData) {
  try {
    if (!SPREADSHEET_ID) {
      console.error('⚠️ GOOGLE_SHEET_ID not configured');
      return { success: false, error: 'Sheet ID not configured' };
    }

    const timestamp = data.submittedAt.toISOString();

    // Create row data
    const row = [
      timestamp,
      data.teamName,
      data.githubLink,
      data.googleDriveLink,
    ];

    // Wrap sheet name in quotes if it contains spaces or special characters
    const sheetRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-')
      ? `'${SHEET_NAME}'!A:D`
      : `${SHEET_NAME}!A:D`;

    // Check if team already submitted
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
      // Team exists - update the existing row
      console.log(`📝 Updating existing submission for team at row ${teamRowIndex + 1}`);

      const updateRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-')
        ? `'${SHEET_NAME}'!A${teamRowIndex + 1}:D${teamRowIndex + 1}`
        : `${SHEET_NAME}!A${teamRowIndex + 1}:D${teamRowIndex + 1}`;

      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: updateRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row],
        },
      });

      console.log('✅ Submission updated in Google Sheets:', response.data);
      return { success: true, data: response.data, updated: true };
    } else {
      // Team doesn't exist - append new row
      console.log('➕ Appending new submission to Google Sheets');

      const appendRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-')
        ? `'${SHEET_NAME}'!A1`
        : `${SHEET_NAME}!A1`;

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: appendRange,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [row],
        },
      });

      console.log('✅ Submission saved to Google Sheets:', response.data);
      return { success: true, data: response.data, updated: false };
    }
  } catch (error) {
    console.error('❌ Error saving submission to Google Sheets:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Update submission data in Google Sheets by team name
 */
export async function updateSubmissionInSheets(data: SubmissionUpdateData) {
  try {
    if (!SPREADSHEET_ID) {
      console.error('⚠️ GOOGLE_SHEET_ID not configured');
      return { success: false, error: 'Sheet ID not configured' };
    }

    const sheetRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-')
      ? `'${SHEET_NAME}'!A:D`
      : `${SHEET_NAME}!A:D`;

    // Get all existing data
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRange,
    });

    const allRows = existingData.data.values || [];

    // Find team row index using original team name if provided, otherwise use current team name
    const searchTeamName = data.originalTeamName || data.teamName;
    let teamRowIndex = -1;
    for (let i = 1; i < allRows.length; i++) {
      if (allRows[i][1] === searchTeamName) {
        teamRowIndex = i;
        break;
      }
    }

    if (teamRowIndex === -1) {
      console.log(`⚠️ Team submission not found in sheets for: ${searchTeamName}`);
      return { success: false, error: 'Team submission not found in sheets' };
    }

    // Prepare updated row
    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      data.teamName,
      data.githubLink,
      data.googleDriveLink,
    ];

    const updateRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-')
      ? `'${SHEET_NAME}'!A${teamRowIndex + 1}:D${teamRowIndex + 1}`
      : `${SHEET_NAME}!A${teamRowIndex + 1}:D${teamRowIndex + 1}`;

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: updateRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    console.log('✅ Submission updated in Google Sheets');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error updating submission in Google Sheets:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Delete submission from Google Sheets by team name
 */
export async function deleteSubmissionFromSheets(teamName: string) {
  try {
    if (!SPREADSHEET_ID) {
      console.error('⚠️ GOOGLE_SHEET_ID not configured');
      return { success: false, error: 'Sheet ID not configured' };
    }

    const sheetRange = SHEET_NAME.includes(' ') || SHEET_NAME.includes('-')
      ? `'${SHEET_NAME}'!A:D`
      : `${SHEET_NAME}!A:D`;

    // Get all existing data
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRange,
    });

    const allRows = existingData.data.values || [];

    // Find team row index
    let teamRowIndex = -1;
    for (let i = 1; i < allRows.length; i++) {
      if (allRows[i][1] === teamName) {
        teamRowIndex = i;
        break;
      }
    }

    if (teamRowIndex === -1) {
      return { success: false, error: 'Team submission not found in sheets' };
    }

    // Get sheet ID for batch delete
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === SHEET_NAME
    );

    if (!sheet || !sheet.properties?.sheetId) {
      return { success: false, error: 'Sheet not found' };
    }

    // Delete 1 row (submission takes 1 row)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheet.properties.sheetId,
                dimension: 'ROWS',
                startIndex: teamRowIndex,
                endIndex: teamRowIndex + 1,
              },
            },
          },
        ],
      },
    });

    console.log('✅ Submission deleted from Google Sheets');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting submission from Google Sheets:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Initialize submissions sheet with headers (run once)
 */
export async function initializeSubmissionsSheet() {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SHEET_ID not configured');
    }

    const headers = [
      [
        'Timestamp',
        'Team Name',
        'GitHub Repository Link',
        'Google Drive Folder Link',
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

    console.log('✅ Submissions sheet headers initialized');
    return { success: true };
  } catch (error) {
    console.error('❌ Error initializing submissions sheet headers:', error);
    throw error;
  }
}
