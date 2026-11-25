#!/usr/bin/env python3
"""Screens for HV-CappingCard (Video 5) from recording IMG_7406.

    python3 scripts/recording-frames.py work/HV-CappingCard/IMG_7406.MP4 work/HV-CappingCard
    python3 scripts/prep-capping-card-screens.py

Frames are already SDR (HDR tone-mapped by recording-frames.py), 576 x 1248. This recording has no floating
recorder tab, so the only cleanup is the Power card carousel: the third card of each row is cut off by the right
edge (design.md Don'ts), so that column is painted out with the page background.

  05  Power card (f_002, 0:03): Capping / Booster / Rest cards, third column painted out
  06  Capping Card screen, top (f_003, 0:07): 15,000 -> 25,000, deficit 58,541 -> 48,541 (same frame as
      Video 4's slide 11, public/screens/HV-BoosterCard/11.png)
  10  "Select your capping day" sheet (f_008, 0:25): 15,000 -> 25,000, upcoming 7 days, 25 Nov selected.
      Used as an S3 close-up of the bottom of the screen, so the dimmed page above the sheet stays out of view.
"""
import os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = os.path.join(ROOT, "work/HV-CappingCard")
FR = os.path.join(W, "frames")


def load(name):
    return np.array(Image.open(os.path.join(FR, name + ".png")).convert("RGB"))


def save(a, n):
    Image.fromarray(a).save(os.path.join(W, n + ".png"))
    print(n, a.shape)


# 05 · Power card: paint out the half-visible third card in each row (x >= 505), from the Capping row
# down to the tab bar. The page there is flat off-white; copy it from the clean strip just left of the cut.
a = load("f_002")
# Fill row by row from the clean strip at x 488-500 (between the 2nd card and the cut), so the page's faint
# shading and the tab bar's soft shadow continue unbroken.
for y in range(300, 1098):
    a[y, 505:] = np.median(a[y, 488:501], axis=0).astype(np.uint8)
# blend the seam over 8 px
for i, x in enumerate(range(497, 505)):
    t = (i + 1) / 9
    a[300:1098, x] = (a[300:1098, x] * (1 - t) + a[300:1098, 505] * t).astype(np.uint8)
save(a, "05")

save(load("f_003"), "06")
save(load("f_008"), "10")
