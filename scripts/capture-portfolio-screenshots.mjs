/**
 * Captures the curated portfolio screenshots in /screenshots from a running
 * production build of the site. See docs/portfolio-screenshots.md.
 *
 *   npm run build            (blank the third-party keys so no widgets render)
 *   npx next start -p 3187 -H 127.0.0.1
 *   node scripts/capture-portfolio-screenshots.mjs [origin]
 *
 * Playwright is not a project dependency. Install it (`npm i -D playwright`)
 * or point PLAYWRIGHT_MODULE at an existing install.
 *
 * Local only: it reads public pages, submits no forms and needs no auth or
 * seed data. The calculator is filled with fictional numbers in the browser.
 */
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const origin = process.argv[2] ?? "http://127.0.0.1:3187";
const outDir = path.resolve("screenshots");
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)) {
  throw new Error(`Refusing to capture from non-local origin: ${origin}`);
}

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE
    ? pathToFileURL(path.resolve(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href
    : "playwright"
);

/** Fictional calculator inputs: an owner-operated contractor. */
const CALCULATOR_DEMO = {
  missedCallsPerWeek: "8",
  leadRate: "60",
  averageJobValue: "4500",
  closeRate: "35",
  recoveryRate: "10",
};

const scrollToHeading = (text, offset = 90) => async (page) => {
  await page.evaluate(
    ({ text, offset }) => {
      const el = [...document.querySelectorAll("h1,h2")].find((h) =>
        h.textContent?.includes(text),
      );

      if (!el) throw new Error(`Heading not found: ${text}`);
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY - offset);
    },
    { text, offset },
  );
};

const shots = [
  {
    file: "home-hero.png",
    route: "/",
    viewport: DESKTOP,
  },
  {
    file: "missed-call-calculator.png",
    route: "/tools/missed-call-revenue-calculator",
    viewport: DESKTOP,
    async prepare(page) {
      for (const [name, value] of Object.entries(CALCULATOR_DEMO)) {
        await page.fill(`#${name}`, value);
      }
      await page.click('button[type="submit"]');
      await page.waitForSelector("dl");
    },
    // Whole calculator card: the form is taller than the 900px viewport.
    clipSelector: '[aria-labelledby="calculator-heading"] > div',
  },
  {
    file: "case-study-results.png",
    route: "/work/service-business-growth-case-study",
    viewport: DESKTOP,
    prepare: scrollToHeading("Captured results", 110),
  },
  {
    file: "services-overview.png",
    route: "/services",
    viewport: DESKTOP,
    prepare: scrollToHeading("Five Steps Between a Search and a Customer", 110),
  },
  {
    file: "home-mobile.png",
    route: "/",
    viewport: MOBILE,
    mobile: true,
  },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const report = [];

try {
  for (const shot of shots) {
    const context = await browser.newContext({
      viewport: shot.viewport,
      deviceScaleFactor: shot.mobile ? 2 : 1,
      isMobile: Boolean(shot.mobile),
      hasTouch: Boolean(shot.mobile),
      reducedMotion: "reduce",
      colorScheme: "dark",
    });
    const page = await context.newPage();
    const problems = [];

    page.on("pageerror", (error) => problems.push(error.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") problems.push(msg.text());
    });

    await page.goto(new URL(shot.route, origin).href, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });
    await page.evaluate(() => document.fonts.ready);
    // Walk the page so lazy sections and scroll-reveal animations settle.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    await shot.prepare?.(page);
    await page.waitForTimeout(600);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );

    if (shot.clipSelector) {
      // A full-page clip renders the fixed header mid-image; hide it here.
      await page.evaluate(() => {
        for (const el of document.querySelectorAll("*")) {
          if (getComputedStyle(el).position === "fixed") {
            el.style.visibility = "hidden";
          }
        }
      });
      const box = await page.locator(shot.clipSelector).evaluate((el) => {
        const rect = el.getBoundingClientRect();

        return { y: rect.top + window.scrollY, height: rect.height };
      });
      const pad = 24;

      await page.screenshot({
        path: path.join(outDir, shot.file),
        fullPage: true,
        clip: {
          x: 0,
          y: Math.max(0, box.y - pad),
          width: shot.viewport.width,
          height: box.height + pad * 2,
        },
      });
    } else {
      await page.screenshot({ path: path.join(outDir, shot.file) });
    }
    report.push({ file: shot.file, overflow, problems });
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify(report, null, 2));
