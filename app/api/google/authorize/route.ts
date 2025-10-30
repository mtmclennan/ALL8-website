import { NextResponse } from 'next/server';
import { google } from 'googleapis';

function getAuthUrl() {
  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );
  return oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

// ✅ Named export (no default)
export async function GET() {
  const url = getAuthUrl();
  return NextResponse.redirect(url);
}
