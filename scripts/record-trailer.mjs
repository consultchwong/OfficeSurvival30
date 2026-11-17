import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const TARGET_URL = process.env.TRAILER_URL || 'http://127.0.0.1:4173/?trailer=1';
const OUTPUT_DIR = path.resolve(process.cwd(), 'media-output');
const PLATFORM = (process.env.MEDIA_PLATFORM || 'all').toLowerCase(); // 'y8' | 'crazygames' | 'social' | 'all'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const VIDEO_SPECS = {
  y8_16x9: {
    platform: 'y8',
    width: 1280,
    height: 720,
    filename: 'y8-video-16x9-1280x720.webm',
    screenshots: [
      { name: 'y8-screenshot-widescreen-1-1280x720.png', atStep: 'swipe_peek' },
      { name: 'y8-screenshot-widescreen-2-1280x720.png', atStep: 'codex_open' },
    ],
  },
  y8_4x3: {
    platform: 'y8',
    width: 960,
    height: 720,
    filename: 'y8-video-4x3-960x720.webm',
    screenshots: [],
  },
  cg_landscape: {
    platform: 'crazygames',
    width: 1920,
    height: 1080,
    filename: 'crazygames-video-landscape-1920x1080-raw.webm',
    screenshots: [
      { name: 'crazygames-screenshot-1-1920x1080.png', atStep: 'swipe_peek' },
      { name: 'crazygames-screenshot-2-1920x1080.png', atStep: 'codex_open' },
    ],
  },
  cg_portrait: {
    platform: 'crazygames',
    width: 800,
    height: 1200,
    filename: 'crazygames-video-portrait-800x1200-raw.webm',
    screenshots: [],
  },
  social_9x16: {
    platform: 'social',
    width: 720,
    height: 1280,
    filename: 'social-shorts-9x16-720x1280.webm',
    screenshots: [],
  },
};

function getTargets() {
  if (PLATFORM === 'all') return Object.keys(VIDEO_SPECS);
  return Object.keys(VIDEO_SPECS).filter((k) => VIDEO_SPECS[k].platform === PLATFORM);
}

async function createSeededContext(browser, width, height, videoDir) {
  const options = {
    viewport: { width, height },
    deviceScaleFactor: 1,
  };
  if (videoDir) {
    options.recordVideo = {
      dir: videoDir,
      size: { width, height },
    };
  }

  const context = await browser.newContext(options);
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('shechu_lang', 'en');
    localStorage.setItem('shechu_coins', '380');
    localStorage.setItem('shechu_unlocked_roles', JSON.stringify(['default', 'buddha_slacker', 'pass_master', 'kol_ai_hero']));
    localStorage.setItem('shechu_active_role', 'kol_ai_hero');
  });

  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  await sleep(350);
  return { context, page };
}

/**
 * Smoothly drag the active card left or right to preview the impact stamp, then release or commit.
 */
async function dragSwipeCard(page, direction, releaseCommit = true, screenshotPath = null) {
  const card = page.locator('[data-testid="reigns-card"]');
  const box = await card.boundingBox();
  if (!box) return;

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height * 0.45;
  const targetDelta = direction === 'left' ? -135 : 135;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  const steps = 12;
  for (let s = 1; s <= steps; s++) {
    await page.mouse.move(startX + (targetDelta * s) / steps, startY + (s % 3), { steps: 1 });
    await sleep(30);
  }

  await sleep(360);

  if (screenshotPath) {
    await page.screenshot({ path: screenshotPath });
  }

  if (releaseCommit) {
    await page.mouse.up();
    await sleep(620);
  } else {
    // Pull back to center to tease the opposite choice before committing
    for (let s = steps - 1; s >= 0; s--) {
      await page.mouse.move(startX + (targetDelta * s) / steps, startY, { steps: 1 });
      await sleep(22);
    }
    await page.mouse.up();
    await sleep(220);
  }
}

async function recordSpec(browser, specKey) {
  const spec = VIDEO_SPECS[specKey];
  const rawDir = path.join(OUTPUT_DIR, 'raw', specKey);
  const platformDir = path.join(OUTPUT_DIR, spec.platform);
  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(platformDir, { recursive: true });

  const { context, page } = await createSeededContext(browser, spec.width, spec.height, rawDir);

  const peekShot = spec.screenshots.find((s) => s.atStep === 'swipe_peek');
  const codexShot = spec.screenshots.find((s) => s.atStep === 'codex_open');

  // Phase 1 (~9s): Real Tinder-style mouse drags & Reigns decision commits across KOL & office cards
  await dragSwipeCard(page, 'right', false, null);
  await dragSwipeCard(
    page,
    'left',
    true,
    peekShot ? path.join(platformDir, peekShot.name) : null
  );

  await dragSwipeCard(page, 'right', true, null);
  await dragSwipeCard(page, 'left', true, null);
  await dragSwipeCard(page, 'right', true, null);

  // Quick button / keyboard swipe burst
  await page.keyboard.press('ArrowLeft');
  await sleep(850);
  await page.keyboard.press('ArrowRight');
  await sleep(850);

  // Phase 2 (~4s): Showcase 32-Character Codex modal briefly (high visual variety for store trailer)
  const rosterBtn = page.locator('header button[aria-label="Character Roster & Codex"]');
  if (await rosterBtn.isVisible()) {
    await rosterBtn.click();
    await sleep(450);
    const codexTab = page.locator('[data-testid="tab-codex"]');
    if (await codexTab.isVisible()) {
      await codexTab.click();
      await sleep(550);
      const gridButtons = page.locator('[data-testid="codex-grid"] button');
      const count = await gridButtons.count();
      if (count > 12) {
        await gridButtons.nth(12).click();
        await sleep(500);
      }
      if (codexShot) {
        await page.screenshot({ path: path.join(platformDir, codexShot.name) });
      }
      if (count > 15) {
        await gridButtons.nth(15).click();
        await sleep(500);
      }
    }
    const closeBtn = page.locator('button[aria-label="Close and go back"]');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await sleep(400);
    }
  }

  // Phase 3 (~5s): Final flurry of card swipes to reach ~18s total runtime
  await dragSwipeCard(page, 'left', true, null);
  await dragSwipeCard(page, 'right', true, null);
  await page.keyboard.press('ArrowLeft');
  await sleep(900);
  await dragSwipeCard(page, 'right', true, null);
  await sleep(600);

  const video = page.video();
  await context.close();
  const recordedPath = await video.path();
  const finalRawPath = path.join(OUTPUT_DIR, 'raw', spec.filename);
  fs.copyFileSync(recordedPath, finalRawPath);
  fs.rmSync(rawDir, { recursive: true, force: true });

  console.log(`Recorded ${specKey} -> ${finalRawPath}`);
}

async function captureY8StandardScreenshot(browser) {
  const y8Dir = path.join(OUTPUT_DIR, 'y8');
  fs.mkdirSync(y8Dir, { recursive: true });
  const { context, page } = await createSeededContext(browser, 760, 570, null);
  await dragSwipeCard(
    page,
    'right',
    false,
    path.join(y8Dir, 'y8-screenshot-standard-760x570.png')
  );
  await context.close();
  console.log('Captured Y8 standard 760x570 screenshot');
}

async function capturePromoCovers(browser) {
  const rawDir = path.join(OUTPUT_DIR, 'raw');
  fs.mkdirSync(rawDir, { recursive: true });
  const baseTitleUrl = TARGET_URL.replace(/\?.*$/, '?lang=en');
  const specs = [
    { name: 'cover-landscape.png', width: 1920, height: 1080 },
    { name: 'cover-portrait.png', width: 800, height: 1200 },
    { name: 'cover-square.png', width: 800, height: 800 },
  ];
  for (const spec of specs) {
    const context = await browser.newContext({
      viewport: { width: spec.width, height: spec.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('shechu_lang', 'en');
      localStorage.setItem('shechu_coins', '380');
      localStorage.setItem('shechu_active_role', 'kol_ai_hero');
    });
    await page.goto(baseTitleUrl, { waitUntil: 'networkidle' });
    await sleep(400);
    await page.screenshot({ path: path.join(rawDir, spec.name) });
    await context.close();
    console.log(`Captured fallback promo cover -> ${spec.name}`);
  }
}

async function main() {
  fs.mkdirSync(path.join(OUTPUT_DIR, 'raw'), { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const targets = getTargets();
    for (const key of targets) {
      await recordSpec(browser, key);
    }
    if (PLATFORM === 'all' || PLATFORM === 'y8') {
      await captureY8StandardScreenshot(browser);
    }
    if (PLATFORM === 'all' || PLATFORM === 'y8' || PLATFORM === 'crazygames') {
      await capturePromoCovers(browser);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Media generation failed:', err);
  process.exit(1);
});
