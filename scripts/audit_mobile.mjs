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
page.on("pageerror", (err) => console.log("PAGEERROR", err.message));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, "m-start.png") });
const start = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const r = h1?.getBoundingClientRect();
  return {
    title: h1?.textContent,
    titleW: r ? Math.round(r.width) : 0,
    overflow: r ? r.right > window.innerWidth - 8 || r.left < 8 : null,
    vw: window.innerWidth,
  };
});
console.log("start", start);

await page.goto("http://localhost:3000/explore", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForFunction(() => Boolean(window.__world?.player), null, { timeout: 30000 });
await page.locator("canvas").tap({ position: { x: 180, y: 280 } });
await page.evaluate(() => {
  const scene = window.__world;
  scene.player.x = 760;
  scene.cameras.main.centerOn(760, scene.player.y);
});
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(OUT, "m-home.png") });

const plaque = await page.evaluate(() => {
  const dock = document.querySelector(".plaque-dock");
  const btn = document.querySelector(".plaque-enter");
  const kit = document.querySelector(".verse-kit");
  const logo = document.querySelector("header img");
  const d = dock?.getBoundingClientRect();
  const b = btn?.getBoundingClientRect();
  const k = kit?.getBoundingClientRect();
  const l = logo?.getBoundingClientRect();
  const overlap = (a, c) => a && c && !(a.right < c.left || a.left > c.right || a.bottom < c.top || a.top > c.bottom);
  return {
    plaque: d && { x: Math.round(d.x), y: Math.round(d.y), w: Math.round(d.width), h: Math.round(d.height), off: d.top < 0 || d.right > innerWidth || d.bottom > innerHeight },
    button: b && { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) },
    kit: k && { x: Math.round(k.x), y: Math.round(k.y), w: Math.round(k.width), h: Math.round(k.height) },
    logo: l && { x: Math.round(l.x), y: Math.round(l.y), w: Math.round(l.width), h: Math.round(l.height) },
    plaqueVsHud: overlap(d, k),
    plaqueVsLogo: overlap(d, l),
    title: document.querySelector(".plaque-title")?.textContent,
  };
});
console.log("plaque", JSON.stringify(plaque));

if (plaque.button) {
  await page.touchscreen.tap(plaque.button.x + plaque.button.w / 2, plaque.button.y + plaque.button.h / 2);
  await page.waitForTimeout(800);
}
await page.screenshot({ path: path.join(OUT, "m-panel.png") });
const panel = await page.evaluate(() => {
  const dialog = document.querySelector("[role=dialog]");
  const close = document.querySelector(".codex-close");
  const kit = document.querySelector(".verse-kit");
  const logo = document.querySelector("header img");
  const d = dialog?.getBoundingClientRect();
  const c = close?.getBoundingClientRect();
  const k = kit?.getBoundingClientRect();
  const l = logo?.getBoundingClientRect();
  const overlap = (a, b) => a && b && !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  return {
    compact: kit?.classList.contains("is-compact"),
    dialog: d && { x: Math.round(d.x), y: Math.round(d.y), w: Math.round(d.width), h: Math.round(d.height) },
    close: c && { x: Math.round(c.x), y: Math.round(c.y), w: Math.round(c.width), h: Math.round(c.height) },
    kit: k && { x: Math.round(k.x), y: Math.round(k.y), w: Math.round(k.width), h: Math.round(k.height) },
    closeVsHud: overlap(c, k),
    headerVsLogo: overlap(d && { ...d, height: 80, bottom: d.y + 80 }, l),
    title: dialog?.querySelector("h2")?.textContent,
  };
});
console.log("panel", JSON.stringify(panel));

await page.keyboard.press("Escape");
await page.waitForTimeout(500);
await page.evaluate(() => window.__world.clearFocus());
await page.waitForTimeout(200);

await page.getByRole("button", { name: "World map" }).tap();
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, "m-atlas.png") });
const atlas = await page.evaluate(() => {
  const menu = document.querySelector(".verse-atlas-menu");
  const r = menu?.getBoundingClientRect();
  return r && { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), overflow: r.right > innerWidth || r.bottom > innerHeight };
});
console.log("atlas", atlas);

await browser.close();
