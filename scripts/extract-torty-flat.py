"""Cuts the flat-style Torty poses out of the expression sheet (black background).
usage: python3 scripts/extract-torty-flat.py  -> public/torty/flat/<name>.png + src/torty/flat.json"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.join(os.path.dirname(__file__), "..")
sheet = np.array(Image.open(os.path.join(ROOT, "assets-src/torty-flat/expression-sheet.png")).convert("RGB")).astype(float)
H, W, _ = sheet.shape
mx = sheet.max(2)

# background = dark pixels connected to the border (keeps dark pupils inside the art)
dark = mx < 22
lab, _ = ndi.label(dark)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bg = np.isin(lab, list(border))
fg = ~bg

# soft edge: pixels touching the background get alpha from their brightness
ring = fg & ndi.binary_dilation(bg, iterations=2)
alpha = fg.astype(float)
alpha[ring] = np.clip((mx[ring] - 10) / 110, 0, 1)
rgb = sheet.copy()
a3 = np.maximum(alpha, 1e-3)[..., None]
rgb = np.where(ring[..., None], np.clip(sheet / a3, 0, 255), sheet)  # un-premultiply the dark fringe

# group each character with its effect marks (sparkles, ?, zzz)
groups, n = ndi.label(ndi.binary_dilation(fg & (mx > 30), iterations=22))
boxes = ndi.find_objects(groups)
items = []
for i, sl in enumerate(boxes):
    area = (groups[sl] == i + 1).sum()
    if area < 4000:
        continue
    items.append(((sl[0].start + sl[0].stop) / 2, sl[1].start, sl))
# reading order: rows by y, then x
items.sort(key=lambda t: (int(t[0] // 400), t[1]))
NAMES = ["idle", "smile", "happy", "excited", "thinking", "surprised", "worried", "sad", "confused", "shy", "wink", "determined", "sleeping"]
OUT = os.path.join(ROOT, "public/torty/flat"); os.makedirs(OUT, exist_ok=True)


def upscale4(img):
    """4x for flat cartoon art (the sheet is small, ~300 px per pose, and Torty is shown ~1000 px tall): bicubic on
    premultiplied colour (no dark fringe), two edge-preserving bilateral passes to flatten the colour areas, a light
    unsharp mask, and a steeper alpha ramp so the outline stays crisp. Sharper than plain Lanczos (team review
    2026-11-20: "torty pics res overall can be improved"); higher-resolution source art would still be better."""
    import cv2
    x = np.array(img).astype(np.float32) / 255
    rgb, a = x[..., :3], x[..., 3]
    size = (img.width * 4, img.height * 4)
    up = cv2.resize(rgb * a[..., None], size, interpolation=cv2.INTER_CUBIC)
    ua = cv2.resize(a, size, interpolation=cv2.INTER_CUBIC).clip(0, 1)
    rgb_u = np.where(ua[..., None] > 1e-3, up / np.maximum(ua[..., None], 1e-3), 0).clip(0, 1)
    b = (rgb_u * 255).astype(np.uint8)
    for _ in range(2):
        b = cv2.bilateralFilter(b, 9, 28, 7)
    f = b.astype(np.float32) / 255
    f = (f + 0.6 * (f - cv2.GaussianBlur(f, (0, 0), 2.2))).clip(0, 1)
    a2 = np.clip((ua - 0.5) * 2.6 + 0.5, 0, 1)
    a2 = a2 * a2 * (3 - 2 * a2)
    return Image.fromarray((np.dstack([f, a2]) * 255).round().astype(np.uint8), "RGBA")
meta = {}
for name, (_, _, sl) in zip(NAMES, items):
    k = [i for i, b in enumerate(boxes) if b == sl][0] + 1
    m = (groups[sl] == k)
    a = np.where(m, alpha[sl], 0)
    tile = np.dstack([rgb[sl], a * 255]).astype(np.uint8)
    img = Image.fromarray(tile, "RGBA")
    img = img.crop(img.getbbox())
    # body box (largest component without the effect marks) for anchoring
    body_lab, nb = ndi.label(np.array(img)[:, :, 3] > 128)
    sizes = ndi.sum(np.ones_like(body_lab), body_lab, range(1, nb + 1))
    body = ndi.find_objects(body_lab)[int(np.argmax(sizes))]
    big = upscale4(img)
    big.save(os.path.join(OUT, f"{name}.png"))
    meta[name] = {"w": big.width, "h": big.height, "bodyTop": body[0].start * 4, "bodyBottom": body[0].stop * 4, "bodyLeft": body[1].start * 4, "bodyRight": body[1].stop * 4}
json.dump(meta, open(os.path.join(ROOT, "src/torty/flat.json"), "w"), indent=1)
print(len(items), {k: (v["w"], v["h"]) for k, v in meta.items()})
