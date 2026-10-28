"""QA contact sheet for a help video: one still per slide, labelled with its code, peek and voiceover line.
usage: python3 scripts/qa-sheet.py <qa.json> <stills-dir> <out.png>
qa.json = output of `npx tsx scripts/help-video-qa.ts <id>`; stills named <id>-f<frame>.png"""
import json, sys, textwrap
from PIL import Image, ImageDraw, ImageFont

B = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
R = "/usr/share/fonts/truetype/google-fonts/Poppins-Regular.ttf"
def font(p, s):
    try: return ImageFont.truetype(p, s)
    except OSError: return ImageFont.load_default()
qa = json.load(open(sys.argv[1])); d_in = sys.argv[2]; out = sys.argv[3]
W, H, pad, lab, cols = 270, 480, 40, 150, 6
n = len(qa["slides"]); rows = (n + cols - 1) // cols
im = Image.new("RGB", (pad + cols * (W + pad), 120 + rows * (H + lab + pad)), "#F4F1EA")
d = ImageDraw.Draw(im)
d.text((pad, 28), f"{qa['id']} · QA sheet", font=font(B, 40), fill="#0B2B22")
d.text((pad, 80), f"{n} slides · {qa['seconds']} s", font=font(R, 22), fill="#3d5a50")
for i, s in enumerate(qa["slides"]):
    x = pad + (i % cols) * (W + pad); y = 120 + (i // cols) * (H + lab + pad)
    im.paste(Image.open(f"{d_in}/{qa['id']}-f{s['frame']}.png").convert("RGB").resize((W, H), Image.LANCZOS), (x, y))
    d.text((x, y + H + 6), f"{s['n']}. {s['code']}  ·  {s['sec']} s", font=font(B, 22), fill="#006B4D")
    d.text((x, y + H + 34), f"peek {s['peek']}" if s["peek"] else "no peek", font=font(R, 16), fill="#3d5a50")
    for k, line in enumerate(textwrap.wrap(s["vo"] or "—", 30)[:4]):
        d.text((x, y + H + 58 + k * 21), line, font=font(R, 17), fill="#0B2B22")
im.save(out); print(out, im.size)
