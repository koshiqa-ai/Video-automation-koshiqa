"""Review grid for the layout system: one row per layout family.
usage: python3 scripts/make-layout-grid.py <slides.json> <stills-dir> <out.png>
slides.json = [{row, code, name, f}] (from lsTimeline + lsStillFrame)"""
import json, sys
from PIL import Image, ImageDraw, ImageFont

B = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
R = "/usr/share/fonts/truetype/google-fonts/Poppins-Regular.ttf"
slides = json.load(open(sys.argv[1])); stills = sys.argv[2]; out = sys.argv[3]
ROWS = ["Torty peeking (left)", "Torty peeking (right)", "Full Torty", "No Torty", "Pointers", "Steps", "Annotations"]
W, H, pad, lab, labw = 300, 533, 28, 74, 300
rows = {}
for s in slides: rows.setdefault(s["row"], []).append(s)
cols = max(len(v) for v in rows.values())
im = Image.new("RGB", (labw + pad + cols * (W + pad), 190 + len(rows) * (H + lab + pad)), "#F4F1EA")
d = ImageDraw.Draw(im)
d.text((pad, 36), "Koshiqa help-video layout system", font=ImageFont.truetype(B, 50), fill="#0B2B22")
d.text((pad, 106), "Phone always centred at full size · Torty peeks from a bottom corner, in front of the phone · all text centred in fixed slots", font=ImageFont.truetype(R, 26), fill="#3d5a50")
for r in sorted(rows):
    y = 190 + (r - 1) * (H + lab + pad)
    d.text((pad, y + 6), str(r), font=ImageFont.truetype(B, 64), fill="#008E66")
    words = ROWS[r - 1].split(" ")
    line, ly = "", y + 96
    for w in words:  # wrap the row label
        if d.textlength(line + " " + w, font=ImageFont.truetype(B, 30)) > labw - 20 and line:
            d.text((pad, ly), line.strip(), font=ImageFont.truetype(B, 30), fill="#0B2B22"); ly += 40; line = ""
        line += " " + w
    d.text((pad, ly), line.strip(), font=ImageFont.truetype(B, 30), fill="#0B2B22")
    for i, s in enumerate(rows[r]):
        x = labw + pad + i * (W + pad)
        im.paste(Image.open(f"{stills}/LayoutSystem-f{s['f']}.png").convert("RGB").resize((W, H), Image.LANCZOS), (x, y))
        d.text((x, y + H + 8), s["code"], font=ImageFont.truetype(B, 26), fill="#006B4D")
        name = s["name"].split(" · ")[0]
        d.text((x + 50, y + H + 11), name, font=ImageFont.truetype(R, 20), fill="#0B2B22")
im.save(out)
print(im.size)
