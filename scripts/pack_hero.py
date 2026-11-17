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


def remove_door(img: Image.Image) -> Image.Image:
    arr = np.array(img)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    wood = (
        (a > 0)
        & (r > 55)
        & (r < 175)
        & (g > 25)
        & (g < 125)
        & (b < 85)
        & (r > g + 8)
        & (g > b)
        & ((r.astype(np.int16) - b) > 35)
    )
    cutoff = int(arr.shape[1] * 0.5)
    wood[:, :cutoff] = False
    arr[wood, 3] = 0
    return Image.fromarray(arr)


def load_knock(name: str, strip_door: bool = False) -> Image.Image:
    im = knock(Image.open(ASSETS / name))
    if strip_door:
        im = remove_door(im)
    return content(im)


def main() -> None:
    frames = [
        load_knock("idle-a.jpg"),
        load_knock("idle-b.jpg"),
        load_knock("cycle-1.jpg"),
        load_knock("cycle-2.jpg"),
        load_knock("cycle-6.jpg"),
        load_knock("cycle-3.jpg"),
        load_knock("cycle-4.jpg"),
        load_knock("interact-b.jpg"),
    ]
    target_h = 360
    scaled = []
    for im in frames:
        ratio = target_h / im.height
        scaled.append(im.resize((max(1, int(im.width * ratio)), target_h), Image.Resampling.LANCZOS))
    frames = scaled
    max_w = max(im.width for im in frames)
    max_h = max(im.height for im in frames)
    sheet = Image.new("RGBA", (max_w * len(frames), max_h), (0, 0, 0, 0))
    for i, im in enumerate(frames):
        canvas = Image.new("RGBA", (max_w, max_h), (0, 0, 0, 0))
        canvas.paste(im, ((max_w - im.width) // 2, max_h - im.height), im)
        sheet.paste(canvas, (i * max_w, 0), canvas)
    dest = OUT / "hero-v2.png"
    sheet.save(dest, "PNG", optimize=True)
    meta = {
        "frameWidth": max_w,
        "frameHeight": max_h,
        "idle": [0, 1],
        "walk": [2, 3, 4, 5, 6],
        "interact": [7],
    }
    (GAME / "heroSheet.ts").write_text(
        "export const HERO_SHEET = " + json.dumps(meta) + " as const;\n",
        encoding="utf-8",
    )
    print("hero", dest, sheet.size, meta)


if __name__ == "__main__":
    main()
