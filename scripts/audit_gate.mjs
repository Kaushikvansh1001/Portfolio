import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(".next/audit");
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });

async function shot(width, height, name, mobile = false) {
  const page = await browser.newPage({
    viewport: { width, height },
    isMobile: mobile,
    hasTouch: mobile,
  });
  page.on("pageerror", (err) => console.log(name, "PAGEERROR", err.message));
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(400);
  const skip = page.locator(".gate-skip");
  if (await skip.count()) await skip.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, name) });
  const info = await page.evaluate(() => ({
    title: document.querySelector(".gate-title")?.textContent,
    logo: Boolean(document.querySelector(".gate-logo")),
    enter: document.querySelector(".gate-enter")?.textContent?.trim(),
    enterDisabled: document.querySelector(".gate-enter")?.disabled,
  }));
  console.log(name, info);
  await page.close();
}

await shot(1440, 900, "gate-desktop.png");
await shot(390, 844, "gate-mobile.png", true);

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(300);
if (await page.locator(".gate-skip").count()) await page.locator(".gate-skip").click();
await page.waitForTimeout(400);
await page.locator(".gate-enter").click();
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, "gate-enter.png") });
await page.waitForURL("**/explore", { timeout: 15000 });
console.log("entered", page.url());
await page.close();
await browser.close();
