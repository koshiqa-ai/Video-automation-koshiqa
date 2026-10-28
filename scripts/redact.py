"""Blur private details (names, emails, phone numbers, avatars) in a screenshot.
usage: python3 scripts/redact.py <in.png> <out.png> x,y,w,h [x,y,w,h ...]   (image pixels)"""
import sys
from PIL import Image, ImageFilter

src, dst, boxes = sys.argv[1], sys.argv[2], sys.argv[3:]
im = Image.open(src).convert("RGB")
for b in boxes:
    x, y, w, h = [int(float(v)) for v in b.split(",")]
    region = im.crop((x, y, x + w, y + h))
    im.paste(region.filter(ImageFilter.GaussianBlur(max(6, h // 3))).filter(ImageFilter.GaussianBlur(8)), (x, y))
im.save(dst)
print(dst, len(boxes), "box(es) blurred")
