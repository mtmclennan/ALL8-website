import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const TOKEN_PATH = path.join(process.cwd(), '.google-oauth-token.json');

function getOAuth2() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );
}

// ✅ Named export (no default)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return NextResponse.json(
      { ok: false, error: 'Missing code' },
      { status: 400 }
    );
  }

  const oauth2 = getOAuth2();
  const { tokens } = await oauth2.getToken(code);
  // Store securely (use DB/KV in prod). File-only shown for simplicity:
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), 'utf8');

  // Redirect somewhere in your app
  const dest = new URL('/admin/google-connected', url.origin);
  return NextResponse.redirect(dest);
}
