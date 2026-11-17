import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(".next/audit");
const BASE = "http://localhost:3000/explore";

async function waitWorld(page) {
  await page.waitForFunction(() => Boolean(window.__world?.player), null, { timeout: 30000 });
  await page.locator("canvas").click({ position: { x: 200, y: 200 } });
}

async function place(page, x) {
  await page.evaluate((worldX) => {
    const scene = window.__world;
    scene.player.x = worldX;
    scene.targetX = null;
    scene.walkVx = 0;
    scene.playAnim("idle", true);
    scene.cameras.main.centerOn(worldX, scene.player.y);
  }, x);
  await page.waitForTimeout(720);
}

async function walkBurst(page, dir, ms) {
  const key = dir === "right" ? "ArrowRight" : "ArrowLeft";
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
  await page.waitForTimeout(160);
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
}

async function runViewport(browser, name, size) {
  const page = await browser.newPage({ viewport: size });
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => caches?.delete?.("next") );
  await waitWorld(page);
  await page.waitForTimeout(500);
  await shot(page, `${name}-01-home`);
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(380);
  await shot(page, `${name}-02-walk-moving`);
  await page.keyboard.up("ArrowRight");
  await page.waitForTimeout(200);
  await shot(page, `${name}-03-walk-idle`);

  const points = [
    ["04-home-intro", 760],
    ["05-code", 1760],
    ["06-lab", 3920],
    ["07-career", 5080],
    ["08-connect", 6020],
    ["09-boulevard", 7100],
  ];
  for (const [label, x] of points) {
    await place(page, x);
    await shot(page, `${name}-${label}`);
  }
  await page.close();
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
await mkdir(OUT, { recursive: true });
try {
  await runViewport(browser, "desktop", { width: 1440, height: 900 });
  await runViewport(browser, "mobile", { width: 390, height: 844 });
} finally {
  await browser.close();
}
console.log("wrote", OUT);
