import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(".next/audit");
await mkdir(OUT, { recursive: true });

const overlap = (a, b) =>
  a && b && !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);

const box = (el) => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    x: Math.round(r.x),
    y: Math.round(r.y),
    w: Math.round(r.width),
    h: Math.round(r.height),
    right: Math.round(r.right),
    bottom: Math.round(r.bottom),
    left: r.left,
    top: r.top,
  };
};

async function auditMobile(browser) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  page.on("pageerror", (err) => console.log("MOBILE PAGEERROR", err.message));

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(OUT, "m2-start.png") });
  const start = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const r = h1?.getBoundingClientRect();
    let textW = 0;
    if (h1) {
      const range = document.createRange();
      range.selectNodeContents(h1);
      textW = Math.round(range.getBoundingClientRect().width);
    }
    return {
      title: h1?.textContent,
      boxW: r ? Math.round(r.width) : 0,
      textW,
      overflow: textW > innerWidth - 16,
      left: r ? Math.round(r.left) : 0,
      right: r ? Math.round(r.right) : 0,
      font: h1 ? getComputedStyle(h1).fontSize : null,
      tracking: h1 ? getComputedStyle(h1).letterSpacing : null,
    };
  });
  console.log("mobile start", start);

  await page.goto("http://localhost:3000/explore", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForFunction(() => Boolean(window.__world?.player), null, { timeout: 30000 });
  await page.evaluate(() => {
    const scene = window.__world;
    scene.player.x = 760;
    scene.cameras.main.centerOn(760, scene.player.y);
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, "m2-home.png") });

  const world = await page.evaluate(() => {
    const dock = document.querySelector(".plaque-dock");
    const btn = document.querySelector(".plaque-enter");
    const kit = document.querySelector(".verse-kit");
    const logo = document.querySelector("header img");
    const walk = document.querySelector(".verse-walk");
    const mapBtn = document.querySelector(".verse-dock-map");
    const copy = document.querySelector(".verse-hud-copy strong");
    const d = dock?.getBoundingClientRect();
    const k = kit?.getBoundingClientRect();
    const l = logo?.getBoundingClientRect();
    const overlap = (a, b) => a && b && !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
    return {
      plaque: d && { x: Math.round(d.x), y: Math.round(d.y), w: Math.round(d.width), h: Math.round(d.height) },
      kit: k && { x: Math.round(k.x), y: Math.round(k.y), w: Math.round(k.width), h: Math.round(k.height) },
      logo: l && { x: Math.round(l.x), y: Math.round(l.y), w: Math.round(l.width), h: Math.round(l.height) },
      plaqueVsHud: overlap(d, k),
      plaqueVsLogo: overlap(d, l),
      walkVisible: walk ? getComputedStyle(walk).display !== "none" : false,
      mapVisible: mapBtn ? getComputedStyle(mapBtn).display !== "none" : null,
      hudLabel: copy ? getComputedStyle(copy).clip : null,
      kitDir: kit ? getComputedStyle(kit).flexDirection : null,
      enter: btn?.textContent?.trim(),
    };
  });
  console.log("mobile world", JSON.stringify(world));

  const enter = await page.evaluate(() => {
    const btn = document.querySelector(".plaque-enter");
    const r = btn?.getBoundingClientRect();
    return r && { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (enter) {
    await page.touchscreen.tap(enter.x, enter.y);
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: path.join(OUT, "m2-panel.png") });
  const panel = await page.evaluate(() => {
    const dialog = document.querySelector("[role=dialog]");
    const close = document.querySelector(".codex-close");
    const kit = document.querySelector(".verse-kit");
    const logo = document.querySelector("header img");
    const walk = document.querySelector(".verse-walk");
    const dock = document.querySelector(".verse-dock");
    const d = dialog?.getBoundingClientRect();
    const c = close?.getBoundingClientRect();
    const k = kit?.getBoundingClientRect();
    const l = logo?.getBoundingClientRect();
    const overlap = (a, b) => a && b && !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
    const headerBox = d && { left: d.left, top: d.top, right: d.right, bottom: d.top + 72 };
    return {
      dialog: d && { x: Math.round(d.x), y: Math.round(d.y), w: Math.round(d.width), h: Math.round(d.height) },
      close: c && { x: Math.round(c.x), y: Math.round(c.y) },
      kit: k && { x: Math.round(k.x), y: Math.round(k.y), w: Math.round(k.width), h: Math.round(k.height) },
      closeVsHud: overlap(c, k),
      headerVsLogo: overlap(headerBox, l),
      headerVsKit: overlap(headerBox, k),
      walkHidden: walk ? getComputedStyle(walk).display === "none" : null,
      dockHidden: dock ? getComputedStyle(dock).display === "none" : null,
      overlayPad: document.querySelector(".codex-overlay")
        ? getComputedStyle(document.querySelector(".codex-overlay")).padding
        : null,
      overlayTop: document.querySelector(".codex-overlay")
        ? getComputedStyle(document.querySelector(".codex-overlay")).top
        : null,
      title: dialog?.querySelector("h2")?.textContent,
    };
  });
  console.log("mobile panel", JSON.stringify(panel));

  await page.locator(".codex-close").tap();
  await page.waitForTimeout(500);

  await page.getByRole("button", { name: "World map" }).tap();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "m2-atlas.png") });
  const atlas = await page.evaluate(() => {
    const menu = document.querySelector(".verse-atlas-menu");
    const r = menu?.getBoundingClientRect();
    return r && {
      x: Math.round(r.x),
      y: Math.round(r.y),
      w: Math.round(r.width),
      h: Math.round(r.height),
      overflow: r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.left < -1,
    };
  });
  console.log("mobile atlas", atlas);
  await page.touchscreen.tap(20, 400);
  await page.waitForTimeout(300);

  const before = await page.evaluate(() => window.__world.player.x);
  const holdInfo = await page.evaluate(() => ({
    hasHold: typeof window.__world.holdDir,
    focused: window.__world.focused,
    api: typeof window.__world,
  }));
  await page.evaluate(() => {
    const btn = document.querySelector(".verse-walk-btn[aria-label='Walk right']");
    btn?.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: "touch",
        isPrimary: true,
      }),
    );
  });
  await page.waitForTimeout(400);
  const mid = await page.evaluate(() => ({ x: window.__world.player.x, holdDir: window.__world.holdDir }));
  if (mid.holdDir !== 1) {
    await page.evaluate(() => {
      window.__world.holdDir = 1;
    });
    await page.waitForTimeout(400);
  } else {
    await page.waitForTimeout(400);
  }
  await page.evaluate(() => {
    const btn = document.querySelector(".verse-walk-btn[aria-label='Walk right']");
    btn?.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: "touch",
        isPrimary: true,
      }),
    );
    window.__world.holdDir = 0;
  });
  const after = await page.evaluate(() => window.__world.player.x);
  console.log("mobile walk debug", JSON.stringify({ holdInfo, mid }));
  console.log("mobile walk", { before: Math.round(before), after: Math.round(after), moved: after > before + 8 });
  await page.screenshot({ path: path.join(OUT, "m2-walk.png") });
  await page.close();
}

async function auditDesktop(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (err) => console.log("DESKTOP PAGEERROR", err.message));

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "d2-start.png") });
  const start = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return {
      font: h1 ? getComputedStyle(h1).fontSize : null,
      tracking: h1 ? getComputedStyle(h1).letterSpacing : null,
    };
  });
  console.log("desktop start", start);

  await page.goto("http://localhost:3000/explore", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForFunction(() => Boolean(window.__world?.player), null, { timeout: 30000 });
  await page.evaluate(() => {
    const scene = window.__world;
    scene.player.x = 760;
    scene.cameras.main.centerOn(760, scene.player.y);
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "d2-home.png") });
  const world = await page.evaluate(() => {
    const kit = document.querySelector(".verse-kit");
    const copy = document.querySelector(".verse-hud-copy strong");
    const walk = document.querySelector(".verse-walk");
    const mapBtn = document.querySelector(".verse-dock-map");
    const plaque = document.querySelector(".plaque-dock");
    return {
      kitDir: kit ? getComputedStyle(kit).flexDirection : null,
      kitW: kit ? Math.round(kit.getBoundingClientRect().width) : null,
      label: copy?.textContent,
      labelHidden: copy ? getComputedStyle(copy).clip : null,
      walkDisplay: walk ? getComputedStyle(walk).display : null,
      mapDisplay: mapBtn ? getComputedStyle(mapBtn).display : null,
      plaqueW: plaque ? Math.round(plaque.getBoundingClientRect().width) : null,
      plaqueMinH: document.querySelector(".plaque-shell")
        ? getComputedStyle(document.querySelector(".plaque-shell")).minHeight
        : null,
    };
  });
  console.log("desktop world", JSON.stringify(world));

  const enter = page.locator(".plaque-enter");
  if (await enter.count()) await enter.click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, "d2-panel.png") });
  const panel = await page.evaluate(() => {
    const overlay = document.querySelector(".codex-overlay");
    const kit = document.querySelector(".verse-kit");
    return {
      overlayPad: overlay ? getComputedStyle(overlay).padding : null,
      compact: kit?.classList.contains("is-compact"),
      panelW: document.querySelector(".codex-panel")
        ? Math.round(document.querySelector(".codex-panel").getBoundingClientRect().width)
        : null,
    };
  });
  console.log("desktop panel", panel);
  await page.close();
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
await auditMobile(browser);
await auditDesktop(browser);
await browser.close();
