from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

SRC = Path(r"C:\Users\samar\Desktop\New folder\portfolio\public\vanshverse")


def rgb_to_hsv(r: np.ndarray, g: np.ndarray, b: np.ndarray):
    r = r / 255.0
    g = g / 255.0
    b = b / 255.0
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    diff = np.maximum(mx - mn, 1e-6)
    h = np.zeros_like(mx)
    mask = mx == r
    h[mask] = ((g[mask] - b[mask]) / diff[mask]) % 6
    mask = mx == g
    h[mask] = (b[mask] - r[mask]) / diff[mask] + 2
    mask = mx == b
    h[mask] = (r[mask] - g[mask]) / diff[mask] + 4
    h = (h * 60) % 360
    s = np.where(mx == 0, 0, diff / np.maximum(mx, 1e-6))
    return h, s, mx


def dilate(mask: np.ndarray, radius: int = 2) -> np.ndarray:
    img = Image.fromarray((mask * 255).astype(np.uint8), "L")
    img = img.filter(ImageFilter.MaxFilter(radius * 2 + 1))
    return np.array(img) > 0


def knock(src: Path, dest: Path) -> None:
    img = Image.open(src).convert("RGBA")
    arr = np.array(img).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    h, s, v = rgb_to_hsv(r, g, b)
    purple_hue = ((h >= 250) & (h <= 330)) | ((h >= 0) & (h <= 10) & (b > r) & (b > g))
    chroma = purple_hue & (s > 0.16) & (v > 0.12)
    rgb_rule = (b > 55) & (b >= g * 1.08) & (b >= r * 0.72) & (r < 175)
    oval = (s > 0.12) & (v < 0.45) & (b > g) & (b > r * 0.7) & (h >= 240)
    bg = chroma | rgb_rule | oval
    bg = dilate(bg, 2)

    alpha = np.where(bg, 0, 255).astype(np.float32)
    # despill remaining magenta fringe
    keep = alpha > 0
    spill = keep & (b > r) & (b > g)
    b[spill] = np.minimum(b[spill], np.maximum(r[spill], g[spill]))
    arr[:, :, 0] = r
    arr[:, :, 1] = g
    arr[:, :, 2] = b
    arr[:, :, 3] = alpha
    out = Image.fromarray(arr.astype(np.uint8), "RGBA")
    bbox = out.getbbox()
    if bbox:
        pad = 8
        x0, y0, x1, y1 = bbox
        out = out.crop(
            (
                max(0, x0 - pad),
                max(0, y0 - pad),
                min(out.width, x1 + pad),
                min(out.height, y1 + pad),
            )
        )
    out.save(dest, "PNG", optimize=True)
    print(dest.name, out.size, dest.stat().st_size)


if __name__ == "__main__":
    knock(SRC / "character-idle.jpg", SRC / "character-idle.png")
    knock(SRC / "character-walk.jpg", SRC / "character-walk.png")
