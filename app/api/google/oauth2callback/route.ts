import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const TOKEN_PATH = path.join(process.cwd(), '.google-oauth-token.json');

function getOAuth2() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      'Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI',
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// MUST be a named export: GET
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { ok: false, error: 'Missing code' },
      { status: 400 },
    );
  }

  const oauth2 = getOAuth2();

  const { tokens } = await oauth2.getToken(code);

  // Persist tokens (dev file storage). In prod, use KV/DB/secret store.
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2), 'utf8');

  // Redirect to a success page
  return NextResponse.redirect(new URL('/admin/google-connected', url.origin));
}
