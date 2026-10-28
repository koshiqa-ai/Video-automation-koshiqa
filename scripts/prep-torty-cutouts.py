"""Prepares the Torty cutout PNGs: removes stray specks, measures the feet anchor,
writes public/torty/cutouts/*.png and src/torty/cutouts.json.
usage: python3 scripts/prep-torty-cutouts.py <folder with torty-*.png>"""
import sys, os, json, glob
import numpy as np
from PIL import Image
from collections import deque

src = sys.argv[1]
root = os.path.join(os.path.dirname(__file__), "..")
out_dir = os.path.join(root, "public/torty/cutouts")
os.makedirs(out_dir, exist_ok=True)
manifest = {}
for path in sorted(glob.glob(os.path.join(src, "torty-*.png"))):
    name = os.path.basename(path)[6:-4]
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    a = arr[:, :, 3]
    H, W = a.shape
    m = a > 40
    lab = np.zeros((H, W), np.int32); k = 0; sizes = {}
    for y0, x0 in zip(*np.nonzero(m)):
        if lab[y0, x0]: continue
        k += 1; q = deque([(y0, x0)]); lab[y0, x0] = k; n = 0
        while q:
            y, x = q.popleft(); n += 1
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < H and 0 <= nx < W and m[ny, nx] and not lab[ny, nx]:
                    lab[ny, nx] = k; q.append((ny, nx))
        sizes[k] = n
    # drop specks (< 200 px); keep the figure and intentional marks (sparkles, motion lines)
    for kk, n in sizes.items():
        if n < 200:
            arr[lab == kk, 3] = 0
    # also clear faint alpha that touches only removed specks' neighbourhood
    a = arr[:, :, 3]; m = a > 40
    rows = np.nonzero(m.any(1))[0]; top, bot = int(rows[0]), int(rows[-1])
    feet = m[int(bot - (bot - top) * 0.10): bot + 1]
    fx = float(np.nonzero(feet)[1].mean())
    Image.fromarray(arr).save(os.path.join(out_dir, f"{name}.png"), optimize=True)
    manifest[name] = {"file": f"torty/cutouts/{name}.png", "w": W, "h": H, "top": top, "bottom": bot, "feetX": round(fx, 1)}
    print(name, manifest[name], "specks removed:", sum(1 for n in sizes.values() if n < 200))
json.dump(manifest, open(os.path.join(root, "src/torty/cutouts.json"), "w"), indent=1)
