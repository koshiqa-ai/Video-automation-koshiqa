#!/usr/bin/env python3
"""Screens for HV-RestCardWhen (Video 2) from recordings IMG_7239 (no benefit) and IMG_7240 (small benefit).

    python3 scripts/prep-rest-card-when-screens.py

Frames come from scripts/recording-frames.py (already SDR, 576 x 1248) in work/HV-RestCardWhen/r7239|r7240/frames.
The screen recorder's floating tab ('❯', x 0-35, ~142 px tall) sits at a different height in each frame, so it is
found per frame (the dark run in column x=5) and removed by its exact shape:
  • over plain background → inpainted (OpenCV Telea)
  • over a card's left edge → the card's own right edge mirrored across the card's centre, with a per-row
    brightness match to the pixels just right of the tab (the page has a soft grey shade along its left edge)
Calendar and impact screens for the 4,200 example are reused from Video 1 (public/screens/HV-RestCard/02, 02b, 05).
"""
import os
import numpy as np
import cv2
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = os.path.join(ROOT, "work/HV-RestCardWhen")
OUT = os.path.join(ROOT, "public/screens/HV-RestCardWhen")
os.makedirs(OUT, exist_ok=True)


def find_tab(a):
    col = a[:, 5].astype(int).mean(1)
    dark = np.where(col < 170)[0]
    runs, s = [], None
    for y in range(a.shape[0] + 1):
        on = y < a.shape[0] and col[y] < 170
        if on and s is None:
            s = y
        if not on and s is not None:
            if y - s > 80:
                runs.append((s, y - 1))
            s = None
    assert runs, "no recorder tab found"
    return runs[0]


def tab_mask(a, y0, y1, keep=None):
    """the tab's rounded box plus ~3 px of its soft shadow. `keep` = (x, y) : leave x >= keep[0], y >= keep[1]
    alone (text that starts right at the tab's corner, e.g. the 'L' of 'Lifts')."""
    m = np.zeros(a.shape[:2], np.uint8)
    cv2.rectangle(m, (0, y0 - 4), (24, y1 + 4), 255, -1)
    cv2.rectangle(m, (0, y0 + 12), (37, y1 - 12), 255, -1)
    for cy in (y0 + 13, y1 - 13):
        cv2.circle(m, (22, cy), 15, 255, -1)
    if keep:
        m[keep[1]:, keep[0]:] = 0
    return m


def inpaint(a, y0, y1, keep=None):
    """plain page: fill from the rows just above and below (the page shade runs top to bottom), then a light
    3 px inpaint to blend the seam; a wide inpaint drags the back arrow and nearby text into the fill"""
    m = tab_mask(a, y0, y1, keep) > 0
    out = a.astype(float).copy()
    t, b = clean_rows(a, y0, y1)
    for y in range(a.shape[0]):
        xs = np.where(m[y])[0]
        if len(xs):
            k = (y - t) / (b - t)
            out[y, xs] = a[t, xs] * (1 - k) + a[b, xs] * k
    out = out.astype(np.uint8)
    edge = cv2.dilate(m.astype(np.uint8), np.ones((5, 5), np.uint8)) - cv2.erode(m.astype(np.uint8), np.ones((5, 5), np.uint8))
    bgr = cv2.inpaint(cv2.cvtColor(out, cv2.COLOR_RGB2BGR), edge * 255, 3, cv2.INPAINT_TELEA)
    return cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)


def clean_rows(a, y0, y1, x1=42):
    """nearest rows above and below the tab whose left strip (x < x1) is plain page, no text or icons"""
    g = a[:, :x1].astype(int).mean(2).min(1)
    t = next(y for y in range(y0 - 6, 0, -1) if g[y] > 200)
    b = next(y for y in range(y1 + 6, a.shape[0]) if g[y] > 200)
    return t, b


def mirror(a, y0, y1, axis, card_left):
    """inside the card: its own right edge mirrored across its centre (x' = 2*axis - x), matched in brightness per
    row to the real pixels just right of the tab. Left of the card (page margin): blended from the plain rows
    just above and below the tab."""
    out = a.astype(float).copy()
    m = tab_mask(a, y0, y1) > 0
    t, b = max(0, y0 - 8), min(a.shape[0] - 1, y1 + 8)
    for y in range(a.shape[0]):
        xs = np.where(m[y])[0]
        if not len(xs):
            continue
        card = xs[xs >= card_left - 2]
        marg = xs[xs < card_left - 2]
        if len(marg):
            k = (y - t) / (b - t)
            out[y, marg] = a[t, marg] * (1 - k) + a[b, marg] * k
        if len(card):
            src = (2 * axis - card).round().astype(int)
            ref = np.arange(xs.max() + 2, xs.max() + 8)
            refm = (2 * axis - ref).round().astype(int)
            gain = (a[y, ref].astype(float).mean(0) + 1) / (a[y, refm].astype(float).mean(0) + 1)
            out[y, card] = np.clip(a[y, src] * gain, 0, 255)
    return out.astype(np.uint8)


def prep(rec, frame, mode, name, axis=None, card_left=None, keep=None):
    a = np.array(Image.open(f"{W}/{rec}/frames/{frame}.png").convert("RGB"))
    y0, y1 = find_tab(a)
    a = inpaint(a, y0, y1, keep) if mode == "inpaint" else mirror(a, y0, y1, axis, card_left)
    Image.fromarray(a).save(f"{OUT}/{name}.png")
    print(name, rec, frame, f"tab y {y0}-{y1}", mode)


prep("r7239", "f_007", "inpaint", "05", keep=(27, 218))  # "No benefit here", deficit 0 → 0, Save for later ('Lifts' starts at x 29, y 218)
prep("r7240", "f_018", "mirror", "06", 146, 29)    # 8,500 → 10,000, "will add only 1500 steps", deficit 6,500 → 5,000 (8,500 card: x 29-263)
prep("r7240", "f_015", "mirror", "08", 152.5, 28)  # Potential impact 578,500 → 580,000 (Before card: x 28-277)
