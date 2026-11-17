from pathlib import Path
import numpy as np
from PIL import Image

root = Path(r"C:\Users\samar\Desktop\New folder\portfolio\public\vanshverse")
hero = np.array(Image.open(root / "hero.png"))
print("hero", hero.shape, "corner alpha", hero[2, 2, 3], hero[2, 180, 3])
for name in ["bldg-home.webp", "bldg-tower.webp", "bldg-lab.webp", "layer-trees.webp"]:
    im = np.array(Image.open(root / name))
    print(name, im.shape, "mode", Image.open(root / name).mode, "tl alpha", im[1, 1, 3] if im.ndim == 3 and im.shape[2] == 4 else "n/a")
