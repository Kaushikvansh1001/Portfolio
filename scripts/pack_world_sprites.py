from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageFilter

ASSETS = Path(r"C:\Users\samar\.cursor\projects\c-Users-samar-Desktop-New-folder-portfolio\assets")
OUT = Path(r"C:\Users\samar\Desktop\New folder\portfolio\public\vanshverse")
GAME = Path(r"C:\Users\samar\Desktop\New folder\portfolio\src\game")


def knock(img: Image.Image) -> Image.Image:
    arr = np.array(img.convert("RGBA")).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    hot_pink = (r > 170) & (g < 55) & (b > 80)
    magenta = (r > 130) & (b > 110) & (g < 140) & ((r + b) > (g * 2.0))
    purple = (b > 70) & (b >= g * 1.1) & (b >= r * 0.72) & (r < 180) & (g < 140)
    bg = hot_pink | magenta | purple
    mask = Image.fromarray((bg * 255).astype(np.uint8), "L").filter(ImageFilter.MaxFilter(5))
    bg = np.array(mask) > 0
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    keep = alpha > 0
    spill = keep & (b > r * 0.9) & (b > g)
    b[spill] = np.minimum(b[spill], np.maximum(r[spill], g[spill]) * 0.85)
    arr[:, :, 2] = b
    arr[:, :, 3] = alpha
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def content(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    pad = 4
    x0, y0, x1, y1 = bbox
    return img.crop(
        (
            max(0, x0 - pad),
            max(0, y0 - pad),
            min(img.width, x1 + pad),
            min(img.height, y1 + pad),
        )
    )


def load_knock(name: str) -> Image.Image:
    src = ASSETS / name
    return content(knock(Image.open(src)))


def pack_hero() -> None:
    frames = [
        load_knock("char-idle-a.jpg"),
        load_knock("char-idle-b.jpg"),
        load_knock("char-walk-1.jpg"),
        load_knock("char-walk-2.jpg"),
        load_knock("char-walk-3.jpg"),
        load_knock("char-walk-4.jpg"),
        load_knock("char-interact.jpg"),
    ]
    target_h = 360
    scaled = []
    for im in frames:
        ratio = target_h / im.height
        scaled.append(im.resize((max(1, int(im.width * ratio)), target_h), Image.Resampling.LANCZOS))
    frames = scaled
    max_w = max(im.width for im in frames)
    max_h = max(im.height for im in frames)
    packed = []
    for im in frames:
        canvas = Image.new("RGBA", (max_w, max_h), (0, 0, 0, 0))
        x = (max_w - im.width) // 2
        y = max_h - im.height
        canvas.paste(im, (x, y), im)
        packed.append(canvas)

    sheet = Image.new("RGBA", (max_w * len(packed), max_h), (0, 0, 0, 0))
    for i, im in enumerate(packed):
        sheet.paste(im, (i * max_w, 0), im)
    dest = OUT / "hero.png"
    sheet.save(dest, "PNG", optimize=True)
    meta = {
        "frameWidth": max_w,
        "frameHeight": max_h,
        "idle": [0, 1],
        "walk": [2, 3, 4, 5],
        "interact": [6],
    }
    (GAME / "heroSheet.ts").write_text(
        "export const HERO_SHEET = "
        + json.dumps(meta)
        + " as const;\n",
        encoding="utf-8",
    )
    print("hero", dest, sheet.size, meta)


def save_building(src_name: str, dest_name: str) -> None:
    im = load_knock(src_name)
    max_w = 640
    if im.width > max_w:
        ratio = max_w / im.width
        im = im.resize((max_w, max(1, int(im.height * ratio))), Image.Resampling.LANCZOS)
    dest = OUT / dest_name
    if dest.suffix.lower() == ".webp":
        im.save(dest, "WEBP", quality=82, method=6)
    else:
        im.save(dest, "PNG", optimize=True)
    print(dest_name, im.size, dest.stat().st_size)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    pack_hero()
    save_building("bldg-home.jpg", "bldg-home.webp")
    save_building("bldg-code.jpg", "bldg-code.webp")
    save_building("bldg-projects.jpg", "bldg-projects.webp")
    save_building("bldg-lab.jpg", "bldg-lab.webp")
    save_building("bldg-tower.jpg", "bldg-tower.webp")
    save_building("bldg-hub.jpg", "bldg-hub.webp")
    save_building("layer-trees.jpg", "layer-trees.webp")
    save_building("layer-clouds.jpg", "layer-clouds.webp")
    Image.open(ASSETS / "layer-mountains.jpg").convert("RGB").save(
        OUT / "layer-mountains.jpg", "JPEG", quality=82, optimize=True
    )
    print("done")
