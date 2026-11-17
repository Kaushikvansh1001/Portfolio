"""Pack idle + 8-pose walk cycle + interact into hero-v3.png."""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(r"C:\Users\samar\Desktop\New folder\portfolio")
ASSETS = Path(r"C:\Users\samar\.cursor\projects\c-Users-samar-Desktop-New-folder-portfolio\assets")
OUT = ROOT / "public" / "vanshverse"
GAME = ROOT / "src" / "game"
OLD = OUT / "hero-v2.png"
FW, FH = 224, 360


def knock(img: Image.Image) -> Image.Image:
    arr = np.array(img.convert("RGBA")).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    lum = (r + g + b) / 3
    hot_pink = (r > 170) & (g < 90) & (b > 90)
    magenta = (r > 150) & (g < 110) & (b > 120)
    purple = (b > 80) & (b >= g * 1.05) & (b >= r * 0.7) & (r < 200) & (g < 160)
    # Never key out dark clothing or boots — MaxFilter would eat the legs.
    bg = (hot_pink | magenta | purple) & (lum > 70)
    mask = Image.fromarray((bg * 255).astype(np.uint8), "L").filter(ImageFilter.MaxFilter(3))
    bg = np.array(mask) > 0
    arr[:, :, 3] = np.where(bg, 0, 255).astype(np.uint8)
    keep = arr[:, :, 3] > 0
    # Recolor pose-guide stripes on the pants to black
    green = keep & (g > r + 18) & (g > b + 18) & (g > 50)
    blue = keep & (b > r + 18) & (b > g + 8) & (b > 50)
    stripe = green | blue
    arr[:, :, 0] = np.where(stripe, np.minimum(arr[:, :, 0], 32), arr[:, :, 0])
    arr[:, :, 1] = np.where(stripe, np.minimum(arr[:, :, 1], 32), arr[:, :, 1])
    arr[:, :, 2] = np.where(stripe, np.minimum(arr[:, :, 2], 32), arr[:, :, 2])
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def content(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    pad = 6
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))


def neutralize_stripes(img: Image.Image) -> Image.Image:
    arr = np.array(img)
    r, g, b, a = arr[:, :, 0].astype(np.int16), arr[:, :, 1].astype(np.int16), arr[:, :, 2].astype(np.int16), arr[:, :, 3]
    keep = a > 0
    lower = np.zeros(a.shape, dtype=bool)
    lower[int(a.shape[0] * 0.42) :] = True
    green = keep & lower & (g > r + 6) & (g > b + 6)
    blue = keep & lower & (b > r + 6) & (b > g + 4)
    stripe = green | blue
    arr[:, :, 0] = np.where(stripe, 28, arr[:, :, 0])
    arr[:, :, 1] = np.where(stripe, 28, arr[:, :, 1])
    arr[:, :, 2] = np.where(stripe, 28, arr[:, :, 2])
    return Image.fromarray(arr, "RGBA")


def snap_feet(img: Image.Image) -> Image.Image:
    arr = np.array(img)
    rows = np.any(arr[:, :, 3] > 12, axis=1)
    if not np.any(rows):
        return img
    last = int(np.where(rows)[0][-1])
    shift = (FH - 2) - last
    if shift == 0:
        return img
    out = np.zeros_like(arr)
    if shift > 0:
        out[shift:] = arr[: FH - shift]
    else:
        out[: FH + shift] = arr[-shift:]
    return Image.fromarray(out, "RGBA")


def lift_legs(img: Image.Image) -> Image.Image:
    arr = np.array(img).astype(np.float32)
    h = arr.shape[0]
    y = np.arange(h)[:, None]
    fade = np.clip((y - h * 0.4) / (h * 0.6), 0, 1)
    keep = arr[:, :, 3] > 8
    lum = arr[:, :, 0] * 0.3 + arr[:, :, 1] * 0.4 + arr[:, :, 2] * 0.3
    dark = keep & (lum < 72)
    boost = 26 * fade
    for channel in range(3):
        arr[:, :, channel] = np.where(dark, np.minimum(arr[:, :, channel] + boost, 96), arr[:, :, channel])
    boots = keep & (y > h * 0.78) & (lum < 90)
    arr[:, :, 0] = np.where(boots, np.minimum(arr[:, :, 0] + 28, 120), arr[:, :, 0])
    arr[:, :, 1] = np.where(boots, np.minimum(arr[:, :, 1] + 18, 100), arr[:, :, 1])
    arr[:, :, 2] = np.where(boots, np.minimum(arr[:, :, 2] + 10, 80), arr[:, :, 2])
    arr[:, :, 3] = np.where(arr[:, :, 3] > 18, 255, 0)
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def plant(img: Image.Image) -> Image.Image:
    img = neutralize_stripes(content(img))
    ratio = FH / max(1, img.height)
    img = img.resize((max(1, int(img.width * ratio)), FH), Image.Resampling.LANCZOS)
    if img.width > FW:
        ratio = FW / img.width
        img = img.resize((FW, max(1, int(img.height * ratio))), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (FW, FH), (0, 0, 0, 0))
    x = (FW - img.width) // 2
    y = FH - img.height
    canvas.paste(img, (x, y), img)
    return lift_legs(snap_feet(neutralize_stripes(canvas)))


def slice_old(index: int) -> Image.Image:
    sheet = Image.open(OLD).convert("RGBA")
    return sheet.crop((index * 224, 0, (index + 1) * 224, 360))


def blobs(img: Image.Image) -> list[Image.Image]:
    alpha = np.array(img.split()[-1])
    from scipy import ndimage

    labeled, count = ndimage.label(alpha > 0)
    boxes: list[tuple[int, Image.Image]] = []
    for index in range(1, count + 1):
        ys, xs = np.where(labeled == index)
        if xs.size < 6000:
            continue
        pad = 8
        crop = img.crop(
            (
                max(0, int(xs.min()) - pad),
                max(0, int(ys.min()) - pad),
                min(img.width, int(xs.max()) + pad),
                min(img.height, int(ys.max()) + pad),
            )
        )
        boxes.append((int(xs.min()), crop))
    boxes.sort(key=lambda item: item[0])
    return [item[1] for item in boxes]


def main() -> None:
    cycle = knock(Image.open(ASSETS / "walk-cycle-8.jpg"))
    walks = [plant(frame) for frame in blobs(cycle)]
    print("found walk blobs", len(walks))
    if len(walks) < 8:
        raise SystemExit(f"expected 8 walk frames, got {len(walks)}")

    # 8-blob sheet: 0 L-contact, 1 R-contact, 2 L-pass, 3 R-contact,
    # 4 R-contact, 5 L-contact, 6 R-pass, 7 L-contact.
    # 4-beat alternating gait: R plant, L swing, L plant, R swing.
    frames = [
        slice_old(0),
        slice_old(1),
        walks[4],
        walks[2],
        walks[0],
        walks[6],
        slice_old(7),
    ]
    dest_sheet = Image.new("RGBA", (FW * len(frames), FH), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        dest_sheet.paste(frame, (i * FW, 0), frame)
    dest = OUT / "hero-v3.png"
    dest_sheet.save(dest, "PNG", optimize=True)
    meta = {
        "frameWidth": FW,
        "frameHeight": FH,
        "idle": [0, 1],
        "walk": [2, 3, 4, 5],
        "interact": [6],
    }
    (GAME / "heroSheet.ts").write_text(
        "export const HERO_SHEET = " + json.dumps(meta) + " as const;\n",
        encoding="utf-8",
    )
    preview = ROOT / ".next" / "hero-frames"
    preview.mkdir(parents=True, exist_ok=True)
    for i, frame in enumerate(frames):
        frame.save(preview / f"v3-{i}.png")
    print("packed", dest, dest_sheet.size, meta)


if __name__ == "__main__":
    main()
