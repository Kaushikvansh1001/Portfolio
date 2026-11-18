"""Pack painted character sheets with edge chroma-key and equal-height frames."""

from __future__ import annotations

import json
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ASSETS = Path(r"C:\Users\samar\.cursor\projects\c-Users-samar-Desktop-New-folder-portfolio\assets")
OUT = Path(r"C:\Users\samar\Desktop\New folder\portfolio\public\vanshverse")
GAME = Path(r"C:\Users\samar\Desktop\New folder\portfolio\src\game")
TARGET_H = 360


def edge_key(img: Image.Image) -> Image.Image:
    arr = np.array(img.convert("RGBA")).astype(np.float32)
    rgb = arr[:, :, :3]
    h, w = rgb.shape[:2]
    samples = np.concatenate(
        [
            rgb[:6, :6].reshape(-1, 3),
            rgb[:6, -6:].reshape(-1, 3),
            rgb[-6:, :6].reshape(-1, 3),
            rgb[-6:, -6:].reshape(-1, 3),
        ]
    )
    bg = np.median(samples, axis=0)
    dist = np.linalg.norm(rgb - bg, axis=2)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    chroma = (r > 175) & (g < 80) & (b > 90) & (r > g + 80)
    close = dist < 48
    seed = (close | chroma).copy()
    # flood from image edges so interior skin/clothes stay
    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        if seed[0, x]:
            q.append((x, 0))
            visited[0, x] = True
        if seed[h - 1, x]:
            q.append((x, h - 1))
            visited[h - 1, x] = True
    for y in range(h):
        if seed[y, 0]:
            q.append((0, y))
            visited[y, 0] = True
        if seed[y, w - 1]:
            q.append((w - 1, y))
            visited[y, w - 1] = True
    bg_mask = np.zeros((h, w), dtype=bool)
    while q:
        x, y = q.popleft()
        bg_mask[y, x] = True
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx] and seed[ny, nx]:
                visited[ny, nx] = True
                q.append((nx, ny))
    # nibble one pixel of fringe
    dil = np.pad(bg_mask, 1, constant_values=False)
    fringe = (
        dil[1:-1, 2:] | dil[1:-1, :-2] | dil[2:, 1:-1] | dil[:-2, 1:-1]
    ) & ~bg_mask
    near = fringe & (dist < 72) & (r > 130) & (g < 110)
    hot_pink = (r > 168) & (g < 98) & (b > 52) & (b >= g * 0.75) & ((r - g) > 70)
    bg_mask = bg_mask | near | hot_pink
    alpha = np.where(bg_mask, 0, 255).astype(np.uint8)
    keep = alpha > 0
    lum = r * 0.3 + g * 0.4 + b * 0.3
    dark = keep & (lum < 40)
    for channel in range(3):
        arr[:, :, channel] = np.where(dark, np.minimum(arr[:, :, channel] + 14, 255), arr[:, :, channel])
    arr[:, :, 3] = np.where(keep, 255, 0)
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def crop_content(img: Image.Image, pad: int = 3) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))


def split_figures(img: Image.Image) -> list[Image.Image]:
    keyed = edge_key(img)
    alpha = np.array(keyed.split()[-1])
    filled = (alpha > 16).any(axis=0)
    frames: list[Image.Image] = []
    x = 0
    w = filled.shape[0]
    while x < w:
        while x < w and not filled[x]:
            x += 1
        if x >= w:
            break
        start = x
        while x < w and filled[x]:
            x += 1
        if x - start < 18:
            continue
        frames.append(crop_content(keyed.crop((start, 0, x, keyed.height))))
    if not frames:
        one = crop_content(keyed)
        if one.getbbox():
            frames.append(one)
    return frames


def load_frames(name: str) -> list[Image.Image]:
    path = ASSETS / name
    if not path.exists():
        raise FileNotFoundError(path)
    frames = split_figures(Image.open(path))
    if not frames:
        raise RuntimeError(f"no figures in {name}")
    return frames


def scale_to_height(im: Image.Image) -> Image.Image:
    ratio = TARGET_H / im.height
    return im.resize((max(1, int(im.width * ratio)), TARGET_H), Image.Resampling.LANCZOS)


def pack(frames: list[Image.Image], dest: Path) -> dict:
    scaled = [scale_to_height(im) for im in frames]
    max_w = max(im.width for im in scaled)
    sheet = Image.new("RGBA", (max_w * len(scaled), TARGET_H), (0, 0, 0, 0))
    for i, im in enumerate(scaled):
        canvas = Image.new("RGBA", (max_w, TARGET_H), (0, 0, 0, 0))
        canvas.paste(im, ((max_w - im.width) // 2, TARGET_H - im.height), im)
        sheet.paste(canvas, (i * max_w, 0), canvas)
    dest.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(dest, "PNG", optimize=True)
    return {"frameWidth": max_w, "frameHeight": TARGET_H, "frames": len(scaled), "size": list(sheet.size)}


def main() -> None:
    idle = load_frames("vansh-idle-strip.jpg")[:4]
    walk = load_frames("vansh-walk-cycle.jpg")[:4]
    if len(walk) < 4:
        walk = load_frames("vansh-walk-strip.jpg")[:4]
    interact = load_frames("vansh-interact.jpg")[:1]
    if len(idle) < 4:
        idle = (idle + idle)[:4]
    if len(walk) < 4:
        walk = (walk + walk)[:4]
    hero_meta = pack(idle + walk + interact, OUT / "hero-v4.png")
    hero_sheet = {
        "frameWidth": hero_meta["frameWidth"],
        "frameHeight": hero_meta["frameHeight"],
        "idle": [0, 1, 2, 3],
        "walk": [4, 5, 6, 7],
        "interact": [8],
    }
    (GAME / "heroSheet.ts").write_text(
        "export const HERO_SHEET = " + json.dumps(hero_sheet) + " as const;\n",
        encoding="utf-8",
    )

    priya = load_frames("priya-idle-move.jpg")[:4]
    radhika = load_frames("radhika-idle-move.jpg")[:4]
    priya_meta = pack(priya, OUT / "npc-priya.png")
    radhika_meta = pack(radhika, OUT / "npc-radhika.png")
    npc = {
        "priya": {
            "frameWidth": priya_meta["frameWidth"],
            "frameHeight": priya_meta["frameHeight"],
            "frames": priya_meta["frames"],
        },
        "radhika": {
            "frameWidth": radhika_meta["frameWidth"],
            "frameHeight": radhika_meta["frameHeight"],
            "frames": radhika_meta["frames"],
        },
    }
    (GAME / "npcSheets.ts").write_text(
        "export const NPC_SHEETS = " + json.dumps(npc) + " as const;\n",
        encoding="utf-8",
    )
    print("hero", hero_meta, hero_sheet)
    print("priya", priya_meta)
    print("radhika", radhika_meta)


if __name__ == "__main__":
    main()
