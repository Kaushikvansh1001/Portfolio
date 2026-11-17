from pathlib import Path
import numpy as np
from PIL import Image

p = Path(r"C:\Users\samar\Desktop\New folder\portfolio\public\vanshverse\character-walk.jpg")
img = np.array(Image.open(p).convert("RGB"))
print("shape", img.shape)
print("tl", img[0, 0], "tr", img[0, -1], "bl", img[-1, 0], "br", img[-1, -1])
print("mean", img.mean(axis=(0, 1)))
png = np.array(Image.open(p.with_suffix(".png")).convert("RGBA"))
print("png shape", png.shape, "opaque", (png[:, :, 3] > 10).mean())
print("png corner alpha", png[0, 0, 3], png[0, -1, 3], png[-1, 0, 3], png[-1, -1, 3])
print("png corner rgb", png[0, 0], png[20, 20])
