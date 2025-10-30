import { google } from 'googleapis';
import path from 'node:path';
import { promises as fs } from 'node:fs';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || 'ALL8_Leads';

// ––––– helpers –––––

function isString(v: any): v is string {
  return typeof v === 'string' && v.length > 0;
}

function friendlySheetsError(e: any) {
  const msg = String(e?.message || e);
  if (msg.includes('This operation is not supported for this document')) {
    return new Error(
      `The file with id ${SHEET_ID} is not a native Google Sheet.\n` +
        `Open it and use "File → Save as Google Sheets", then use the NEW Sheet ID (docs.google.com/spreadsheets/d/...).`
    );
  }
  if (msg.includes('client_email')) {
    return new Error(
      `Your credentials look like OAuth (no "client_email"). Either:\n` +
        `• Switch to OAuth mode (see code), OR\n` +
        `• Provide a valid Service Account JSON (with "client_email") and share the sheet with that email.`
    );
  }
  return e;
}

// ––––– auth –––––

async function loadJSONIfExists(filePath: string) {
  try {
    const txt = await fs.readFile(filePath, 'utf8');
    return JSON.parse(txt);
  } catch {
    return undefined;
  }
}

/**
 * Returns an authenticated Sheets client using either:
 *  - Service Account (if GOOGLE_SERVICE_ACCOUNT_JSON or google-service-account.json present), or
 *  - OAuth 2.0 user tokens (if token file present and client envs set)
 */
async function getSheetsClient() {
  // 1) Try Service Account first (explicit env or file)
  const saEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const saFilePath = path.join(process.cwd(), 'google-service-account.json');
  const saFile = await loadJSONIfExists(saFilePath);

  if (isString(saEnv) || saFile) {
    const credentials = saEnv ? JSON.parse(saEnv) : saFile;
    if (!credentials?.client_email || !credentials?.private_key) {
      throw friendlySheetsError(
        new Error('Service account JSON missing client_email/private_key')
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  }

  // 2) Fallback to OAuth 2.0 user flow (requires token file + client envs)
  const tokenPath =
    process.env.GOOGLE_OAUTH_TOKEN_PATH ||
    path.join(process.cwd(), '.google-oauth-token.json');
  const tokens = await loadJSONIfExists(tokenPath);

  if (!tokens) {
    throw new Error(
      `No service account JSON found and no OAuth tokens found.\n` +
        `Finish the OAuth connect flow (visit /api/google/authorize) to generate ${tokenPath}, or provide service account JSON.`
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      'Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI for OAuth mode.'
    );
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oauth2.setCredentials(tokens); // contains refresh_token so it will auto-refresh

  return google.sheets({ version: 'v4', auth: oauth2 });
}

// ––––– sheet checks –––––

async function assertSheetReady(
  sheets: ReturnType<(typeof google)['sheets']>,
  spreadsheetId: string,
  sheetName: string
) {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const titles = meta.data.sheets?.map((s) => s.properties?.title) ?? [];
    if (!titles.includes(sheetName)) {
      throw new Error(
        `Tab "${sheetName}" not found. Available tabs: ${titles.filter(Boolean).join(', ') || '(none)'}`
      );
    }
  } catch (e) {
    throw friendlySheetsError(e);
  }
}

// ––––– public API –––––

export async function isDuplicateEntry(email: string, projectType: string) {
  try {
    const sheets = await getSheetsClient();
    await assertSheetReady(sheets, SHEET_ID, SHEET_TAB);

    const range = `${SHEET_TAB}!A:G`; // [name, email, phone, projectType, message, submittedAt, status]
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });
    const rows = res.data.values || [];
    return rows.some((r) => r[1] === email && r[3] === projectType);
  } catch (e) {
    console.error(
      'Sheets duplicate check failed (continuing):',
      friendlySheetsError(e)
    );
    return false; // fail-open so we don't block submissions
  }
}

export async function appendLeadRow(payload: {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
}) {
  const sheets = await getSheetsClient();
  await assertSheetReady(sheets, SHEET_ID, SHEET_TAB);

  const range = `${SHEET_TAB}!A:G`;
  const submittedAt = new Date().toLocaleString('en-CA');

  const values = [
    [
      payload.name,
      payload.email,
      payload.phone || '',
      payload.projectType,
      payload.message || '',
      submittedAt,
      'New',
    ],
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });
  } catch (e) {
    const err = friendlySheetsError(e);
    console.error('Sheets append failed:', err);
    throw err; // submitIntake.step() will catch & continue
  }
}
