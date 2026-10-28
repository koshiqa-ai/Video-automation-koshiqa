"""Imports a storyboard HTML (the format made by scripts/make-storyboard.py, see storyboards/README.md).
usage: python3 -I scripts/storyboard-import.py <storyboard.html> <video-id>
writes  public/screens/<video-id>/NN.png   (the screenshots, as-is: already redacted)
        storyboards/<video-id>.json        (title, beats: section, card text, voiceover, screenshot, flags, cut)"""
import base64, html, json, os, re, sys
from io import BytesIO
from PIL import Image

src, vid = sys.argv[1], sys.argv[2]
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
t = open(src, encoding="utf-8").read()
text = lambda s: html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()
def grab(cls, block, all_=False):
    pat = rf'<div class="{cls}">(.*?)</div>'
    return [text(x) for x in re.findall(pat, block, re.S)] if all_ else text((re.search(pat, block, re.S) or [None, ""])[1] if re.search(pat, block, re.S) else "")

title = text((re.search(r"<h1>(.*?)</h1>", t, re.S) or [None, ""])[1])
img_dir = os.path.join(root, "public", "screens", vid); os.makedirs(img_dir, exist_ok=True)
# walk sections (.pair) and beats (.beat) in document order
tokens = re.finditer(r'<div class="pair">.*?<div class="pair-name">(.*?)</div>|<div class="beat( cut)?">(.*?)(?=<div class="beat|<div class="pair">|<div class="legend">)', t, re.S)
section, beats = None, []
for m in tokens:
    if m.group(1) is not None:
        section = text(m.group(1)); continue
    cut, block = bool(m.group(2)), m.group(3)
    meta = re.findall(r'<div class="meta">(.*?)</div>', block, re.S)
    spans = [text(x) for x in re.findall(r"<span[^>]*>(.*?)</span>", meta[0], re.S)] if meta else []
    n = spans[0] if spans else ""
    hold = next((float(x.split()[1][:-1]) for x in spans if x.startswith("hold ")), None)
    beat = {"n": n, "kind": "card" if n == "card" else "screen", "section": section, "cut": cut, "hold": hold,
            "card": grab("card-preview", block), "vo": grab("vo", block) or None,
            "was": re.sub(r"^was\s+", "", grab("was", block)) or None, "why": grab("why", block) or None, "flags": grab("flag", block, True)}
    im = re.search(r'<img alt="([^"]*)" src="data:image/[a-z]+;base64,([A-Za-z0-9+/=]+)"', block)
    if im:
        num = re.sub(r"\D", "", n) or str(len(beats) + 1)
        name = f"{int(num):02d}.png"
        img = Image.open(BytesIO(base64.b64decode(im.group(2))))
        img.save(os.path.join(img_dir, name))
        beat.update(image=f"screens/{vid}/{name}", w=img.width, h=img.height)
    beats.append(beat)

out = {"id": vid, "title": title, "source": os.path.basename(src), "sections": list(dict.fromkeys(b["section"] for b in beats if b["section"])), "beats": beats}
p = os.path.join(root, "storyboards", f"{vid}.json")
json.dump(out, open(p, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
live = [b for b in beats if not b["cut"]]
print(f"{title}: {len(beats)} beats ({len(beats) - len(live)} cut), {sum(1 for b in live if b.get('image'))} screenshots, {len(out['sections'])} sections")
for b in beats:
    print(f"  {b['n']:>5} {'CUT ' if b['cut'] else ''}{b['card']!r:28} {('[' + str(len(b['flags'])) + ' flag]') if b['flags'] else ''}")
print("wrote", p)
