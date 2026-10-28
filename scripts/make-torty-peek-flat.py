"""Peek poses from the flat-style Torty: head + arms + top of the shell, flat cut at the hips (CUT of body height).
Effect marks (sparkles, ?, zzz) are dropped so nothing pokes into the phone.
usage: python3 scripts/make-torty-peek-flat.py -> public/torty/peek-flat/peek-{left,right}-<pose>.png + src/torty/peek-flat.json"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "public/torty/flat")
OUT = os.path.join(ROOT, "public/torty/peek-flat"); os.makedirs(OUT, exist_ok=True)
meta_in = json.load(open(os.path.join(ROOT, "src/torty/flat.json")))
CUT = 0.86
POSES = ["idle", "smile", "happy", "excited", "thinking", "surprised", "worried", "sad", "confused", "shy", "wink", "determined"]
out = {}
for p in POSES:
    m = meta_in[p]
    img = np.array(Image.open(os.path.join(SRC, f"{p}.png")))
    a = img[:, :, 3] > 40
    lab, n = ndi.label(a)
    sizes = ndi.sum(a, lab, range(1, n + 1))
    body_i = int(np.argmax(sizes)) + 1
    bsl = ndi.find_objects(lab)[body_i - 1]
    keep = lab == body_i
    for i, sl in enumerate(ndi.find_objects(lab)):  # keep marks touching the body box (e.g. sweat drop)
        if p == "worried" and i + 1 != body_i and sl[0].start >= bsl[0].start and sl[1].start >= bsl[1].start and sl[1].stop <= bsl[1].stop:
            keep |= lab == i + 1
    keep = ndi.binary_dilation(keep, iterations=3)
    img[:, :, 3] = np.where(keep, img[:, :, 3], 0)
    top, bot = bsl[0].start, bsl[0].stop
    cut = int(top + CUT * (bot - top))
    crop = Image.fromarray(img[top:cut])
    bb = crop.getbbox()
    crop = crop.crop((bb[0], 0, bb[2], crop.height))
    ca = np.array(crop)[:, :, 3] > 128
    head_rows = ca[: int(0.42 * (bot - top))]
    xs = np.where(head_rows.any(0))[0]
    head = {"l": int(xs.min()), "r": int(xs.max())}
    crop.save(os.path.join(OUT, f"peek-left-{p}.png"))
    crop.transpose(Image.FLIP_LEFT_RIGHT).save(os.path.join(OUT, f"peek-right-{p}.png"))
    out[p] = {"w": crop.width, "h": crop.height, "headL": head["l"], "headR": head["r"]}
json.dump(out, open(os.path.join(ROOT, "src/torty/peek-flat.json"), "w"), indent=1)
print({k: (v["w"], v["h"], v["headL"], v["headR"]) for k, v in out.items()})
