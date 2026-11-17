from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ASSETS = Path(r"C:\Users\samar\.cursor\projects\c-Users-samar-Desktop-New-folder-portfolio\assets")
OUT = Path(r"C:\Users\samar\Desktop\New folder\portfolio\public\vanshverse")


def knock(img: Image.Image) -> Image.Image:
    arr = np.array(img.convert("RGBA")).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    hot_pink = (r > 170) & (g < 55) & (b > 80)
    magenta = (r > 130) & (b > 110) & (g < 140) & ((r + b) > (g * 2.0))
    purple = (b > 70) & (b >= g * 1.1) & (b >= r * 0.72) & (r < 180) & (g < 140)
    bg = hot_pink | magenta | purple
    mask = Image.fromarray((bg * 255).astype(np.uint8), "L").filter(ImageFilter.MaxFilter(5))
    bg = np.array(mask) > 0
    arr[:, :, 3] = np.where(bg, 0, 255).astype(np.uint8)
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def content(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    pad = 6
    x0, y0, x1, y1 = bbox
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))


def save(im: Image.Image, name: str, max_w: int) -> None:
    if im.width > max_w:
        ratio = max_w / im.width
        im = im.resize((max_w, max(1, int(im.height * ratio))), Image.Resampling.LANCZOS)
    dest = OUT / name
    im.save(dest, "WEBP", quality=80, method=6)
    print(name, im.size, dest.stat().st_size)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    save(content(knock(Image.open(ASSETS / "prop-cobble.jpg"))), "prop-cobble.webp", 640)
    save(content(knock(Image.open(ASSETS / "prop-stairs.jpg"))), "prop-stairs.webp", 560)
    save(content(knock(Image.open(ASSETS / "prop-bridge.jpg"))), "prop-bridge.webp", 720)
    save(content(knock(Image.open(ASSETS / "prop-arch.jpg"))), "prop-arch.webp", 640)
    save(content(knock(Image.open(ASSETS / "prop-water.jpg"))), "prop-water.webp", 640)
    save(content(knock(Image.open(ASSETS / "prop-signpost.jpg"))), "prop-signpost.webp", 220)
    cluster = content(knock(Image.open(ASSETS / "prop-set.jpg")))
    w, h = cluster.size
    for i, name in enumerate(["prop-rock.webp", "prop-grass.webp", "prop-barrel.webp", "prop-bench.webp"]):
        x0 = int(w * i / 4)
        x1 = int(w * (i + 1) / 4)
        save(content(cluster.crop((x0, 0, x1, h))), name, 280)
    print("done")
