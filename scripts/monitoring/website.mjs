import { request, retry } from './http.mjs';

export const ORIGIN = 'https://all8webworks.com';
export const pages = [
  { path: '/', heading: /lead|customer|business|work/i },
  { path: '/contact', heading: /contact|talk|review/i },
  { path: '/services', heading: /services|lead|business|search.*sale/i },
  { path: '/pricing', heading: /pricing|plans|leak.*help/i },
  { path: '/blog', heading: /blog|field notes|writing|work.*missing/i },
];

export async function checkPage(page, options) {
  const { response, body } = await request(`${ORIGIN}${page.path}`, {
    headers: { 'user-agent': 'ALL8Monitor/1.0 (GitHub Actions)', accept: 'text/html' },
    cache: 'no-store',
  }, options);
  if (response.status !== 200) throw new Error(`HTTP ${response.status}; expected 200 without redirects`);
  if (!response.headers.get('content-type')?.includes('text/html')) throw new Error('Expected HTML');
  // Check rendered content, not matching words inside hydration payloads/scripts.
  const rendered = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const h1 = rendered.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]*>/g, ' ');
  if (!h1 || !page.heading.test(h1)) throw new Error('Expected page heading missing');
  if (!rendered.includes('ALL8') || rendered.length < 2_000) throw new Error('Expected ALL8 content missing or truncated');
  const canonical = [...rendered.matchAll(/<link\b[^>]*>/gi)].find(([tag]) => /rel=["']canonical["']/.test(tag))?.[0];
  if (!canonical?.includes(`href="${ORIGIN}${page.path === '/' ? '' : page.path}"`) &&
      !canonical?.includes(`href="${ORIGIN}${page.path}"`)) throw new Error('Canonical URL mismatch');
  return body;
}

export async function checkLegacyRedirect(path, options) {
  const { response } = await request(`https://all8webworks.ca${path}`, {}, options);
  if (![301, 308].includes(response.status)) throw new Error(`Legacy domain returned HTTP ${response.status}; expected permanent redirect`);
  if (response.headers.get('location') !== `${ORIGIN}${path}`) throw new Error('Legacy redirect must preserve path in one hop');
}

export function representativeArticle(html) {
  const matches = [...html.matchAll(/href="(\/blog\/[a-z0-9-]+)"/g)];
  const path = matches.find(([, value]) => !['/blog/category', '/blog/tag'].includes(value))?.[1];
  if (!path) throw new Error('No representative article link found on Blog');
  return { path, heading: /\S/ };
}

export async function websiteChecks(check) {
  let blog;
  for (const page of pages) {
    const html = await check(`website:${page.path}`, () => retry(() => checkPage(page)));
    if (page.path === '/blog') blog = html;
  }
  await check('website:representative-blog-article', () => retry(async () => {
    if (!blog) throw new Error('Blog index unavailable; cannot discover representative article');
    return checkPage(representativeArticle(blog));
  }));
  for (const path of ['/', '/contact']) {
    await check(`redirect:.ca${path}`, () => retry(() => checkLegacyRedirect(path)));
  }
}
