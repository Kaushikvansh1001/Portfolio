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
    black = (r < 18) & (g < 18) & (b < 18)
    bg = hot_pink | magenta | purple | black
    mask = Image.fromarray((bg * 255).astype(np.uint8), "L").filter(ImageFilter.MaxFilter(5))
    bg = np.array(mask) > 0
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    arr[:, :, 3] = alpha
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def content(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    pad = 4
    x0, y0, x1, y1 = bbox
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))


def load_knock(name: str) -> Image.Image:
    return content(knock(Image.open(ASSETS / name)))


def pack_npc(frames: list[Image.Image], dest_name: str, target_h: int = 360) -> dict:
    scaled = []
    for im in frames:
        ratio = target_h / im.height
        scaled.append(im.resize((max(1, int(im.width * ratio)), target_h), Image.Resampling.LANCZOS))
    max_w = max(im.width for im in scaled)
    sheet = Image.new("RGBA", (max_w * len(scaled), target_h), (0, 0, 0, 0))
    for i, im in enumerate(scaled):
        canvas = Image.new("RGBA", (max_w, target_h), (0, 0, 0, 0))
        canvas.paste(im, ((max_w - im.width) // 2, target_h - im.height), im)
        sheet.paste(canvas, (i * max_w, 0), canvas)
    dest = OUT / dest_name
    sheet.save(dest, "PNG", optimize=True)
    meta = {"frameWidth": max_w, "frameHeight": target_h, "frames": len(scaled)}
    print(dest_name, sheet.size, meta)
    return meta


def save_prop(src: str, dest_name: str, max_w: int = 720) -> None:
    im = load_knock(src)
    if im.width > max_w:
        ratio = max_w / im.width
        im = im.resize((max_w, max(1, int(im.height * ratio))), Image.Resampling.LANCZOS)
    dest = OUT / dest_name
    im.save(dest, "WEBP", quality=82, method=6)
    print(dest_name, im.size, dest.stat().st_size)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    priya = load_knock("npc-priya-b.jpg")
    priya_meta = pack_npc([priya, priya], "npc-priya.png")
    radhika_meta = pack_npc([load_knock("npc-radhika-a.jpg"), load_knock("npc-radhika-b.jpg")], "npc-radhika.png")
    save_prop("sign-boulevard.jpg", "sign-boulevard.webp", 720)
    save_prop("prop-lantern.jpg", "prop-lantern.webp", 220)
    (GAME / "npcSheets.ts").write_text(
        "export const NPC_SHEETS = "
        + json.dumps({"priya": priya_meta, "radhika": radhika_meta})
        + " as const;\n",
        encoding="utf-8",
    )
    print("done")
