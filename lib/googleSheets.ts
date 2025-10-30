import { google } from 'googleapis';
import path from 'path';
import fs from 'fs/promises';

async function getSheetsClient() {
  const keyFilePath = path.join(process.cwd(), '.google-oauth-token.json');
  const keyFile = await fs.readFile(keyFilePath, 'utf-8');
  const credentials = JSON.parse(keyFile);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export async function isDuplicateEntry(email: string, projectType: string) {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
    const sheetName = process.env.GOOGLE_SHEET_TAB || 'ALL8_Leads';
    const range = `${sheetName}!A:G`; // [name, email, phone, projectType, message, submittedAt, status]

    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res.data.values || [];
    return rows.some((r) => r[1] === email && r[3] === projectType);
  } catch (e) {
    console.error('Sheets duplicate check failed (continuing):', e);
    return false;
  }
}

export async function appendToSheet(payload: {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  notes: string;
}) {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
  const sheetName = process.env.GOOGLE_SHEET_TAB || 'ALL8_Leads';
  const range = `${sheetName}!A:G`;
  const submittedAt = new Date().toLocaleString('en-CA');

  const values = [
    [
      payload.name,
      payload.email,
      payload.phone || '',
      payload.projectType,
      payload.notes || '',
      submittedAt,
      'New',
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}
