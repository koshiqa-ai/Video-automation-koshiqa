"""Step 1 of recording → storyboard: pull the distinct screens out of a screen recording.
usage: python3 scripts/recording-frames.py <recording.mp4> <out-dir> [--change 3.0] [--settle 0.4]
A screen is kept when the picture has settled (no change for --settle seconds, so mid-animation and mid-scroll
frames are skipped) and differs from the last kept screen by more than --change (mean grey-level difference).
writes <out-dir>/frames/f_NNN.png (576 px wide), <out-dir>/frames.json [{file, t}], <out-dir>/frames-sheet.png"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

args = sys.argv[1:]
video, out = args[0], args[1]
opt = lambda k, d: float(args[args.index(k) + 1]) if k in args else d
CHANGE, SETTLE, FPS, SW, SH = opt("--change", 3.0), opt("--settle", 0.4), 8, 72, 160
fdir = os.path.join(out, "frames"); os.makedirs(fdir, exist_ok=True)
for f in os.listdir(fdir): os.remove(os.path.join(fdir, f))

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vf", f"fps={FPS},scale={SW}:{SH},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, SH, SW).astype(float)
if not len(fr): sys.exit("could not read video")
still = int(round(SETTLE * FPS))
moving = np.r_[np.inf, np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))] > 1.0
picks, last, i = [], None, 0
while i < len(fr):
    j = i
    while j < len(fr) and not moving[j] or j == i: j += 1      # stable run [i, j)
    if j - i >= still or j >= len(fr):
        k = i + (j - i) // 2
        if last is None or np.abs(fr[k] - last).mean() > CHANGE:
            picks.append(k / FPS); last = fr[k]
    i = j

frames = []
for n, t in enumerate(picks, 1):
    name = f"f_{n:03d}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", video, "-frames:v", "1", "-vf", "scale=576:-2", os.path.join(fdir, name)], check=True)
    frames.append({"file": f"frames/{name}", "t": round(t, 2)})
json.dump(frames, open(os.path.join(out, "frames.json"), "w"), indent=1)

W, H, cols = 180, 405, 8
rows = (len(frames) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (W + 12) + 12, rows * (H + 40) + 12), "white"); d = ImageDraw.Draw(sheet)
try: fnt = ImageFont.truetype("/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf", 18)
except OSError: fnt = ImageFont.load_default()
for i, f in enumerate(frames):
    im = Image.open(os.path.join(out, f["file"])).convert("RGB"); im.thumbnail((W, H))
    x, y = 12 + (i % cols) * (W + 12), 12 + (i // cols) * (H + 40)
    sheet.paste(im, (x, y)); d.text((x, y + H + 6), f"{i + 1:03d} · {int(f['t'] // 60)}:{f['t'] % 60:04.1f}", font=fnt, fill="#111")
sheet.save(os.path.join(out, "frames-sheet.png"))
print(f"{len(frames)} distinct screens → {out}/frames-sheet.png")
