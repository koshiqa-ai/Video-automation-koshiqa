"""Builds the dedicated PEEK pose: Torty's head + both fists gripping the bottom edge of the frame.
Base = the worried cutout (fists under the chin), cut flat just under the fists. Other expressions
swap in the head from that pose. Writes public/torty/peek/peek-{left,right}-{expr}.png
('left' = for the bottom-LEFT corner, looking right/up toward the phone; 'right' = mirrored).
usage: python3 scripts/make-torty-peek.py"""
import json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), "..")
CUT = os.path.join(ROOT, "public/torty/cutouts")
OUT = os.path.join(ROOT, "public/torty/peek")
os.makedirs(OUT, exist_ok=True)
CUT_Y = 468  # flat cut just under the fists

# head ellipses measured on the 906px-tall cutouts: centre x, centre y, rx, ry
HEADS = {"worried": (247, 195, 226, 196), "happy": (357, 205, 222, 205), "curious": (232, 200, 228, 200)}


def ellipse_mask(size, cx, cy, rx, ry, grow=0, blur=1.5):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).ellipse((cx - rx - grow, cy - ry - grow, cx + rx + grow, cy + ry + grow), fill=255)
    return m.filter(ImageFilter.GaussianBlur(blur))


worried = Image.open(os.path.join(CUT, "worried.png")).convert("RGBA")
base_full = worried.crop((0, 0, worried.width, CUT_Y))
wcx, wcy, wrx, wry = HEADS["worried"]

# fists layer (kept on top of any new head)
fist_poly = Image.new("L", base_full.size, 0)
ImageDraw.Draw(fist_poly).polygon([(112, 372), (200, 352), (300, 352), (390, 372), (395, CUT_Y), (105, CUT_Y)], fill=255)
fist_poly = fist_poly.filter(ImageFilter.GaussianBlur(1.2))
fists = base_full.copy()
fists.putalpha(Image.fromarray(np.minimum(np.array(base_full)[:, :, 3], np.array(fist_poly))))

meta = {}
for expr, (cx, cy, rx, ry) in HEADS.items():
    if expr == "worried":
        img = base_full.copy()
    else:
        # face swap: keep the worried head shape + fists, blend in the other pose's face (eyes, brows, cheeks, mouth)
        src = Image.open(os.path.join(CUT, f"{expr}.png")).convert("RGBA")
        k = wrx / rx
        src = src.resize((round(src.width * k), round(src.height * k)), Image.LANCZOS)
        scx, scy = cx * k, cy * k
        layer = Image.new("RGBA", base_full.size, (0, 0, 0, 0))
        layer.alpha_composite(src, (round(wcx - scx), round(wcy - scy)))
        face = ellipse_mask(base_full.size, wcx, wcy + 12, wrx * 0.99, wry * 0.92, blur=0)
        face = Image.fromarray(np.minimum(np.array(face), np.array(ellipse_mask(base_full.size, wcx, wcy, wrx - 12, wry - 12, blur=0))))
        face = face.filter(ImageFilter.GaussianBlur(9))
        la = np.array(layer)
        la[:, :, 3] = (la[:, :, 3].astype(float) * np.array(face) / 255).astype(np.uint8)
        img = Image.alpha_composite(base_full.copy(), Image.fromarray(la))
        img = Image.alpha_composite(img, fists)
    bbox = img.getbbox()
    img = img.crop((bbox[0], bbox[1], bbox[2], img.height))  # keep the flat bottom cut
    img = img.resize((img.width * 2, img.height * 2), Image.LANCZOS)
    img.save(os.path.join(OUT, f"peek-left-{expr}.png"))
    img.transpose(Image.FLIP_LEFT_RIGHT).save(os.path.join(OUT, f"peek-right-{expr}.png"))
    meta[expr] = {"w": img.width, "h": img.height}
json.dump(meta, open(os.path.join(ROOT, "src/torty/peek.json"), "w"), indent=1)
print(meta)
