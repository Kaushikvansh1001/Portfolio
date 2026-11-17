from pathlib import Path
import numpy as np
from PIL import Image

assets = Path(r"C:\Users\samar\.cursor\projects\c-Users-samar-Desktop-New-folder-portfolio\assets")
for name in ["char-idle-a.jpg", "char-walk-1.jpg", "char-walk-4.jpg", "bldg-home.jpg"]:
    img = np.array(Image.open(assets / name).convert("RGB"))
    print(name, img.shape, "tl", img[8, 8], "mid-top", img[8, img.shape[1]//2], "mean", img.mean(axis=(0, 1)).round(1))
