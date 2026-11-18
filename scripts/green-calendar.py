#!/usr/bin/env python3
"""Consistency-calendar screens with realistic 10K+ days (green), for Video 1 (review: "don't show all 15k").

    python3 scripts/green-calendar.py        (run after scripts/prep-rest-card-screens.py)

The recording's demo account had every day at 15,000 (gold cells). In the app a day with 10,000–14,999 steps is
green, so this rebuilds each gold cell as a green one:
  • the cell shape and shading come from the cell itself (the app's sticky note), recoloured to the app's green
    (body sampled from the team's screenshot of day 22: RGB 193,252,134);
  • the day number and the step count are redrawn in the same place, size and colours as the app's green cell
    (day: olive 77,115,36 · steps: dark green 38,98,19), TeX Gyre Adventor Bold (closest to the app font here);
  • step counts are a fixed, varied set between 10,0xx and 14,9xx (illustrative demo values; replace this whole
    step with a real screenshot from a test account when one exists);
  • day 22 stays the recording's grey 4,200 cell on 02, and on 02b it is the app's own green 10,000 cell with the
    Rest Card palm (cropped from the team's screenshot) placed square in the grid.
Also updates the "avg" figure on 01 to the average of the days it shows.
"""
import os, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "public/screens/HV-RestCard")
TEAM_SHOT = os.environ.get("CAL_SHOT", "/tmp/claude-0/-home-claude/6250d460-97be-56d8-8e18-6ba55b3d3991/scratchpad/rc/calendar.jpg")
FONT = os.path.join(ROOT, "public/fonts/texgyreadventor-bold.otf")
GREEN = np.array([193, 252, 134], float)
DAY_C, STEP_C = (77, 115, 36), (38, 98, 19)

def steps_for(day):
    return 10000 + (day * 3571 + 977) % 4900 // 10 * 10 + (day * 7) % 10

def cells(a):
    L = a.mean(2); m = ((L < 236) | (a.max(2) - a.min(2) > 25)).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    return [tuple(int(v) for v in st[i][:4]) for i in range(1, n) if 55 < st[i][2] < 140 and 55 < st[i][3] < 140], lab, st

def is_gold(cell):
    body = cell[(cell.mean(2) > 150)]
    return len(body) and np.median(body[:, 0] - body[:, 2]) > 60

def to_green(a, box):
    """recolour one gold sticky note (shape, curl and shadow kept), erase its text"""
    x, y, w, h = box
    c = a[y:y + h, x:x + w].astype(float)
    L = c.mean(2); sat = c.max(2) - c.min(2)
    text = ((L < 160) & (sat > 30)).astype(np.uint8)
    text = cv2.dilate(text, np.ones((3, 3), np.uint8))
    c8 = cv2.inpaint(c.astype(np.uint8), text, 4, cv2.INPAINT_TELEA).astype(float)
    L = c8.mean(2); sat = c8.max(2) - c8.min(2)
    body = sat > 40                                                    # the coloured note (not page, not grey curl)
    shade = L / np.median(L[body])                                     # keep the note's own light and shadow
    g = np.clip(GREEN[None, None] * shade[..., None] ** 0.8, 0, 255)
    c8[body] = g[body]
    a[y:y + h, x:x + w] = c8.astype(np.uint8)

def draw_text(im, box, day, steps):
    x, y, w, h = box; d = ImageDraw.Draw(im)
    f1 = ImageFont.truetype(FONT, 25); f2 = ImageFont.truetype(FONT, 20)
    d.text((x + 20, y + 36), str(day), font=f1, fill=DAY_C, anchor="lt")
    d.text((x + 20, y + 70), f"{steps:,}", font=f2, fill=STEP_C, anchor="lt")

def grid_days(boxes, first):
    rows = sorted(set(b[1] // 40 for b in boxes))
    out = {}
    for b in boxes:
        r = rows.index(b[1] // 40); col = sorted(bb[0] for bb in boxes if bb[1] // 40 == b[1] // 40).index(b[0])
        out[b] = first + 4 * r + col
    return out

def green(name, first, lifted22=False):
    p = os.path.join(D, f"{name}.png"); a = np.array(Image.open(p).convert("RGB"))
    boxes, _, _ = cells(a.astype(int)); days = grid_days(boxes, first); todo = []
    for b, day in days.items():
        if day == 22:
            continue                                                   # 02: stays the grey 4,200 note; 02b: below
        if is_gold(a[b[1]:b[1] + b[3], b[0]:b[0] + b[2]].astype(int)):
            to_green(a, b); todo.append((b, day))
    recolour_slivers(a)
    by_day = {d: b for b, d in days.items()}
    if lifted22 and 21 in by_day and 23 in by_day:
        b21, b23 = by_day[21], by_day[23]
        b22 = (round((b21[0] + b23[0]) / 2), b23[1], b23[2], b23[3])
        a[b22[1] - 26:b22[1] + b22[3] + 6, b22[0] - 6:b22[0] + b22[2] + 30] = 255   # old note + badge
        note = a[b23[1]:b23[1] + b23[3], b23[0]:b23[0] + b23[2]].copy()             # 23's green note, text-free
        clean = note.astype(int); txt = (clean.mean(2) < 160).astype(np.uint8)       # (23's text is drawn later)
        a[b22[1]:b22[1] + b22[3], b22[0]:b22[0] + b22[2]] = note
        todo.append((b22, 22))
    im = Image.fromarray(a)
    for b, day in todo:
        draw_text(im, b, day, 10000 if (lifted22 and day == 22) else steps_for(day))
    if lifted22:
        im = paste_palm(im, b22)
    im.save(p)
    return days

def recolour_slivers(a):
    """cells cut off by the screen edge or the tab bar (too small to be found as cells): recolour what shows"""
    ai = a.astype(int); gold = ((ai[..., 0] - ai[..., 2] > 80) & (ai[..., 0] > 180)).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(gold)
    for i in range(1, n):
        x, y, w, h, _ = st[i]
        if w >= 70 and h < 55 and y > 300:
            m = lab == i; L = ai.mean(2); shade = L / np.median(L[m])
            a[m] = np.clip(GREEN[None] * shade[m][:, None] ** 0.8, 0, 255).astype(np.uint8)

def paste_palm(im, b):
    """the Rest Card badge (white circle + palm) from the team's screenshot of day 22, same spot on the note"""
    c = np.array(Image.open(TEAM_SHOT).convert("RGB")).astype(float)
    k = b[2] / 112.0; cx, cy, r = 276.5, 691.5, 21.8                  # team screenshot px; note top-left (186, 668)
    x0, y0 = int(cx - r - 2), int(cy - r - 2); s = int(2 * r + 4)
    crop = c[y0:y0 + s, x0:x0 + s]
    yy, xx = np.mgrid[0:s, 0:s]; al = np.clip(r + 0.8 - np.hypot(xx - (cx - x0), yy - (cy - y0)), 0, 1)
    S2 = round(s * k); crop = cv2.resize(crop, (S2, S2), interpolation=cv2.INTER_AREA); al = cv2.resize(al, (S2, S2))[..., None]
    px, py = round(b[0] + (x0 - 186) * k), round(b[1] + (y0 - 668) * k)
    a = np.array(im).astype(float); a[py:py + S2, px:px + S2] = a[py:py + S2, px:px + S2] * (1 - al) + crop * al
    return Image.fromarray(a.astype(np.uint8))

def fix_avg():
    """'14,437 avg' can't be right once days are 10–15K: redraw the figure as the average of days 1–40 shown"""
    p = os.path.join(D, "01.png"); a = np.array(Image.open(p).convert("RGB"))
    vals = [steps_for(d) for d in range(1, 41) if d != 22] + [4200]
    avg = round(sum(vals) / len(vals))
    a[558:606, 28:190] = 255                                           # "14,437" (x 33–185, y 563–600)
    im = Image.fromarray(a); f = ImageFont.truetype(os.path.join(ROOT, "public/fonts/InterDisplay-Black.otf"), 51)
    d = ImageDraw.Draw(im); w = d.textlength(f"{avg:,}", font=f)
    d.text((185 - w, 600), f"{avg:,}", font=f, fill=(12, 12, 12), anchor="ls")   # right edge kept next to 'avg'
    im.save(p); return avg

if __name__ == "__main__":
    import sys
    green("02", 9); green("02b", 9, lifted22=True); green("01", 1)
    print("ok, avg", fix_avg())
