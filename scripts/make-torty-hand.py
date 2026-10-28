"""Cuts Torty's pointing hand out of the point-happy cutout -> public/torty/hand-point.png
Rounds off the wrist so it reads as a floating cartoon hand. Prints the fingertip position.
usage: python3 scripts/make-torty-hand.py"""
import json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), "..")
src = Image.open(os.path.join(ROOT, "public/torty/cutouts/point-happy.png")).convert("RGBA")
hand = src.crop((0, 340, 200, 500))
a = np.array(hand)[:, :, 3]
CUT = 168  # wrist column
col = np.where(a[:, CUT] > 128)[0]
top, bot = int(col.min()), int(col.max())
mask = Image.new("L", hand.size, 0)
d = ImageDraw.Draw(mask)
d.rectangle((0, 0, CUT, hand.height), fill=255)
d.ellipse((CUT - 26, top, CUT + 26, bot), fill=255)  # rounded wrist
mask = mask.filter(ImageFilter.GaussianBlur(1.2))
alpha = np.minimum(a, np.array(mask))
out = np.array(hand)
out[:, :, 3] = alpha
img = Image.fromarray(out).crop(Image.fromarray(alpha).getbbox())
img = img.resize((img.width * 2, img.height * 2), Image.LANCZOS)
img.save(os.path.join(ROOT, "public/torty/hand-point.png"))
al = np.array(img)[:, :, 3]
ys, xs = np.where(al > 128)
i = xs.argmin()
tip = {"w": img.width, "h": img.height, "tipX": int(xs[i]), "tipY": int(ys[i])}
json.dump(tip, open(os.path.join(ROOT, "src/torty/hand.json"), "w"))
print(tip)
