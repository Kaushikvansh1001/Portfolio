import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(".next/audit");
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
if (await page.locator(".gate-skip").count()) await page.locator(".gate-skip").click();
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(OUT, "gate-desktop.png") });
const btn = page.locator(".gate-enter");
const box = await btn.boundingBox();
const clip = box
  ? { x: Math.max(0, box.x - 80), y: Math.max(0, box.y - 50), width: box.width + 160, height: box.height + 110 }
  : undefined;
await page.screenshot({ path: path.join(OUT, "btn-idle.png"), clip });
await btn.hover();
await page.waitForTimeout(450);
await page.screenshot({ path: path.join(OUT, "btn-hover.png"), clip });
await browser.close();
console.log("ok");
