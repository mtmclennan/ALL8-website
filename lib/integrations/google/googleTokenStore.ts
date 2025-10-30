import { promises as fs } from 'fs';
import path from 'path';

const TOKEN_PATH = path.join(process.cwd(), '.google-oauth-token.json');

export async function saveToken(tokens: any) {
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), 'utf8');
}
export async function loadToken(): Promise<any | null> {
  try {
    const raw = await fs.readFile(TOKEN_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
