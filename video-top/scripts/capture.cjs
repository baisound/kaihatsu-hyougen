const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

const captureUrl = process.env.CAPTURE_URL || 'http://127.0.0.1:4173/index.html';
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const videoRoot = path.resolve(__dirname, '..');
const captureDir = path.join(videoRoot, 'public', 'capture');
const finalCapture = path.join(videoRoot, 'public', 'top-page.webm');

fs.mkdirSync(captureDir, {recursive: true});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const smoothScroll = async (page, selector, duration = 2200, offset = 90) => {
  await page.evaluate(
    ({selector: targetSelector, duration: scrollDuration, offset: topOffset}) =>
      new Promise((resolve) => {
        const element = document.querySelector(targetSelector);
        if (!element) {
          resolve();
          return;
        }

        const startY = window.scrollY;
        const targetY = Math.max(0, element.getBoundingClientRect().top + startY - topOffset);
        const distance = targetY - startY;
        const startedAt = performance.now();
        const ease = (value) => (value < 0.5 ? 4 * value ** 3 : 1 - ((-2 * value + 2) ** 3) / 2);

        const step = (now) => {
          const progress = Math.min(1, (now - startedAt) / scrollDuration);
          window.scrollTo(0, startY + distance * ease(progress));
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        };

        requestAnimationFrame(step);
      }),
    {selector, duration, offset},
  );
};

(async () => {
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--disable-gpu-sandbox', '--hide-scrollbars'],
  });

  const context = await browser.newContext({
    viewport: {width: 1920, height: 1080},
    deviceScaleFactor: 1,
    recordVideo: {dir: captureDir, size: {width: 1920, height: 1080}},
  });

  const page = await context.newPage();
  await page.goto(captureUrl, {waitUntil: 'load', timeout: 30000});
  await page.evaluate(() => {
    for (const image of document.images) image.setAttribute('loading', 'eager');
  });
  await page.waitForFunction(
    () => [...document.images].every((image) => image.complete && image.naturalWidth > 0),
    {timeout: 30000},
  );
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)));
  });
  await page.addStyleTag({
    content: `
      html { scroll-behavior: auto !important; }
      ::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
      * { cursor: default !important; }
    `,
  });

  await wait(2800);
  await smoothScroll(page, '#about', 2200, 90);
  await wait(1800);
  await smoothScroll(page, '#services', 2200, 90);
  await wait(1500);

  for (const card of await page.locator('.service-card').all()) {
    await card.hover();
    await wait(850);
  }

  await smoothScroll(page, '#products', 2300, 90);
  await wait(1800);
  await page.locator('.product-feature').hover();
  await wait(1200);

  await smoothScroll(page, '#activity', 2500, 90);
  await wait(1900);
  await smoothScroll(page, '#channel-behind', 2200, 90);
  await wait(1500);
  await smoothScroll(page, '#behind-picks', 1900, 90);
  await wait(1200);
  for (const card of await page.locator('#behind-picks .content-card').all()) {
    await card.hover();
    await wait(520);
  }
  await smoothScroll(page, '#channel-baisound', 2200, 90);
  await wait(1500);
  await smoothScroll(page, '#baisound-picks', 1900, 90);
  await wait(1200);
  for (const card of await page.locator('#baisound-picks .content-card').all()) {
    await card.hover();
    await wait(520);
  }

  await smoothScroll(page, '#worklog', 2200, 90);
  await wait(1800);
  await smoothScroll(page, '#portrait', 2300, 90);
  await wait(2200);
  await smoothScroll(page, '#contact', 2300, 90);
  await wait(3600);

  const video = page.video();
  await context.close();
  const recordedPath = await video.path();
  fs.copyFileSync(recordedPath, finalCapture);
  await browser.close();

  process.stdout.write(`${finalCapture}\n`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
