"""Rebuild tower and NPC cutouts from source. Magenta key only — keep dark clothes."""

from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

ASSETS = Path(r"C:\Users\samar\.cursor\projects\c-Users-samar-Desktop-New-folder-portfolio\assets")
OUT = Path(r"C:\Users\samar\Desktop\New folder\portfolio\public\vanshverse")
GAME = Path(r"C:\Users\samar\Desktop\New folder\portfolio\src\game")


def magenta_key(img: Image.Image, dilate: int = 3) -> Image.Image:
    arr = np.array(img.convert("RGBA")).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    lum = (r + g + b) / 3
    hot = (r > 155) & (g < 110) & (b > 70) & ((r + b) > g * 2.15)
    magenta = (r > 130) & (b > 110) & (g < 130) & ((r + b) > g * 2.0) & (lum > 70)
    bg = hot | magenta
    mask = Image.fromarray((bg * 255).astype(np.uint8), "L")
    if dilate >= 3:
        mask = mask.filter(ImageFilter.MaxFilter(dilate))
    bg = np.array(mask) > 0
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    keep = alpha > 0
    spill = keep & (b > r * 0.95) & (b > g) & (r > 90)
    b[spill] = np.minimum(b[spill], np.maximum(r[spill], g[spill]) * 0.9)
    arr[:, :, 2] = b
    arr[:, :, 3] = alpha
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def crop_content(img: Image.Image, pad: int = 6) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))


def lift_dark(img: Image.Image, floor: float) -> Image.Image:
    arr = np.array(img).astype(np.float32)
    keep = arr[:, :, 3] > 0
    lum = arr[:, :, 0] * 0.3 + arr[:, :, 1] * 0.4 + arr[:, :, 2] * 0.3
    skin = keep & (arr[:, :, 0] > arr[:, :, 2] + 22) & (arr[:, :, 0] > 88) & (lum > 68)
    dark = keep & ~skin & (lum < floor)
    boost = np.where(dark, (floor - lum) * 0.5, 0.0)
    for channel in range(3):
        arr[:, :, channel] = np.clip(arr[:, :, channel] + boost, 0, 255)
    arr[:, :, 3] = np.where(arr[:, :, 3] > 40, 255, 0)
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def thin_outline(img: Image.Image) -> Image.Image:
    arr = np.array(img)
    keep = arr[:, :, 3] > 0
    dil = Image.fromarray(arr[:, :, 3]).filter(ImageFilter.MaxFilter(3))
    edge = (np.array(dil) > 0) & ~keep
    arr[:, :, 0] = np.where(edge, 32, arr[:, :, 0])
    arr[:, :, 1] = np.where(edge, 28, arr[:, :, 1])
    arr[:, :, 2] = np.where(edge, 24, arr[:, :, 2])
    arr[:, :, 3] = np.where(keep | edge, 255, 0)
    return Image.fromarray(arr, "RGBA")


def pack_npc(sources: list[str], dest_name: str, target_h: int = 360) -> dict:
    frames = []
    for name in sources:
        im = lift_dark(crop_content(magenta_key(Image.open(ASSETS / name), 3)), 88)
        im = thin_outline(im)
        ratio = target_h / im.height
        frames.append(im.resize((max(1, int(im.width * ratio)), target_h), Image.Resampling.LANCZOS))
    max_w = max(im.width for im in frames)
    sheet = Image.new("RGBA", (max_w * len(frames), target_h), (0, 0, 0, 0))
    for i, im in enumerate(frames):
        canvas = Image.new("RGBA", (max_w, target_h), (0, 0, 0, 0))
        canvas.paste(im, ((max_w - im.width) // 2, target_h - im.height), im)
        sheet.paste(canvas, (i * max_w, 0), canvas)
    dest = OUT / dest_name
    sheet.save(dest, "PNG", optimize=True)
    meta = {"frameWidth": max_w, "frameHeight": target_h, "frames": len(frames)}
    print(dest_name, sheet.size, meta)
    return meta


def save_tower() -> None:
    im = crop_content(magenta_key(Image.open(ASSETS / "bldg-tower.jpg"), 3), 4)
    im = lift_dark(im, 72)
    if im.width > 640:
        ratio = 640 / im.width
        im = im.resize((640, max(1, int(im.height * ratio))), Image.Resampling.LANCZOS)
    im = ImageEnhance.Contrast(im).enhance(1.08)
    im = ImageEnhance.Sharpness(im).enhance(1.08)
    dest = OUT / "bldg-tower.webp"
    im.save(dest, "WEBP", quality=92, method=6)
    print("bldg-tower.webp", im.size, dest.stat().st_size)


if __name__ == "__main__":
    save_tower()
    priya = pack_npc(["npc-priya-b.jpg", "npc-priya-c.jpg"] if (ASSETS / "npc-priya-c.jpg").exists() else ["npc-priya-b.jpg", "npc-priya-b.jpg"], "npc-priya.png")
    radhika = pack_npc(["npc-radhika-a.jpg", "npc-radhika-b.jpg"], "npc-radhika.png")
    (GAME / "npcSheets.ts").write_text(
        "export const NPC_SHEETS = "
        + json.dumps({"priya": priya, "radhika": radhika})
        + " as const;\n",
        encoding="utf-8",
    )
    print("done")
