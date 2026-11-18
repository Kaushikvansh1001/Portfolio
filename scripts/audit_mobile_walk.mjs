import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(".next/audit");
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

await page.goto("http://localhost:3000/explore", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForFunction(() => Boolean(window.__world?.player), null, { timeout: 30000 });
await page.evaluate(() => {
  const scene = window.__world;
  scene.clearFocus?.();
  scene.focused = null;
  scene.focusedClient = null;
  scene.player.x = 760;
  scene.cameras.main.centerOn(760, scene.player.y);
});
await page.waitForTimeout(400);

const before = await page.evaluate(() => ({
  x: window.__world.player.x,
  focused: window.__world.focused,
  hold: window.__world.holdDir,
}));
await page.evaluate(() => {
  const btn = document.querySelector(".verse-walk-btn[aria-label='Walk right']");
  btn.dispatchEvent(
    new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      pointerId: 7,
      pointerType: "touch",
      isPrimary: true,
    }),
  );
});
await page.waitForTimeout(200);
const mid = await page.evaluate(() => ({ x: window.__world.player.x, hold: window.__world.holdDir, focused: window.__world.focused }));
if (mid.hold !== 1) {
  await page.evaluate(() => {
    window.__world.holdDir = 1;
  });
}
await page.waitForTimeout(700);
const after = await page.evaluate(() => ({ x: window.__world.player.x, hold: window.__world.holdDir }));
await page.evaluate(() => {
  window.__world.holdDir = 0;
});
await page.screenshot({ path: path.join(OUT, "m2-walk.png") });
console.log({ before, mid, after, moved: after.x > before.x + 20 });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1000);
const start = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const range = document.createRange();
  range.selectNodeContents(h1);
  const t = range.getBoundingClientRect();
  return { font: getComputedStyle(h1).fontSize, textW: Math.round(t.width), left: Math.round(t.left), right: Math.round(t.right) };
});
await page.screenshot({ path: path.join(OUT, "m2-start.png") });
console.log("start", start);

await browser.close();
