"""Reflect the lower body inside its own silhouette to invert gait phase."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(r"C:\Users\samar\Desktop\New folder\portfolio")
FRAMES = ROOT / ".next" / "hero-frames"
OUT = Path(r"C:\Users\samar\.cursor\projects\c-Users-samar-Desktop-New-folder-portfolio") / "assets"


def reflect_span(row: np.ndarray) -> np.ndarray:
    alpha = row[:, 3] > 12
    if not np.any(alpha):
        return row
    x0, x1 = int(np.argmax(alpha)), int(len(alpha) - np.argmax(alpha[::-1]))
    slice_ = row[x0:x1].copy()
    row[x0:x1] = slice_[::-1]
    return row


def flip_islands(row: np.ndarray) -> np.ndarray:
    """Horizontally flip each opaque island in place (restores toe direction)."""
    alpha = row[:, 3] > 12
    i = 0
    n = len(alpha)
    while i < n:
        if not alpha[i]:
            i += 1
            continue
        j = i
        while j < n and alpha[j]:
            j += 1
        if j - i > 4:
            row[i:j] = row[i:j][::-1]
        i = j
    return row


def invert_gait(path: Path, hip_ratio: float = 0.48, boot_ratio: float = 0.78) -> Image.Image:
    arr = np.array(Image.open(path).convert("RGBA"))
    h = arr.shape[0]
    hip = int(h * hip_ratio)
    boot = int(h * boot_ratio)
    for y in range(hip, h):
        arr[y] = reflect_span(arr[y])
    for y in range(boot, h):
        arr[y] = flip_islands(arr[y])
    # swap arms: reflect a chest band, then flip each island (hands)
    chest0, chest1 = int(h * 0.24), int(h * 0.46)
    for y in range(chest0, chest1):
        arr[y] = reflect_span(arr[y])
    for y in range(int(h * 0.36), chest1):
        arr[y] = flip_islands(arr[y])
    img = Image.fromarray(arr, "RGBA")
    return img.filter(ImageFilter.UnsharpMask(radius=1, percent=80, threshold=2))


def main() -> None:
    FRAMES.mkdir(parents=True, exist_ok=True)
    for name, dest in [("v3-2.png", "opp-contact.png"), ("v3-3.png", "opp-pass.png")]:
        frame = invert_gait(FRAMES / name)
        frame.save(OUT / dest)
        frame.save(FRAMES / dest)
        print("wrote", dest, frame.size)


if __name__ == "__main__":
    main()
