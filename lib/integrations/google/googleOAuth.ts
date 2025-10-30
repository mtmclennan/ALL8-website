import { google } from 'googleapis';

export function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );
  return client;
}

export function getAuthUrl() {
  const oauth2 = getOAuth2Client();
  return oauth2.generateAuthUrl({
    access_type: 'offline', // <- get refresh_token
    prompt: 'consent', // <- force refresh_token first time
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}
