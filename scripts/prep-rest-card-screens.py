# One-off prep for HV-RestCard screenshots (kept for reproducibility): paints out the recorder's side tab,
# blurs the member name in Torty's greeting, and builds 02b (day 22 after the Rest Card) from the team's screenshot.
# Inputs: frames from scripts/recording-frames.py on IMG_7237.MP4 + the team's calendar screenshot (paths below).
import numpy as np
from PIL import Image, ImageFilter
S='/tmp/claude-0/-home-claude/6250d460-97be-56d8-8e18-6ba55b3d3991/scratchpad/rc'
OUT='/home/claude/video-automation-koshiqa/public/screens/HV-RestCard'
def no_handle(im, x1=44):
    """paint out the floating side-tab ('❯') the recording shows at the left edge"""
    a=np.array(im.convert('RGB')).astype(float)
    y0,y1=80,234
    top=a[y0-1,:x1]; bot=a[y1+1,:x1]
    for y in range(y0,y1+1):
        t=(y-y0)/(y1-y0); a[y,:x1]=top*(1-t)+bot*t
    return Image.fromarray(a.astype(np.uint8))
frames={'01':'f_001','02':'f_005','03':'f_006','04':'f_007','05':'f_012'}
for nn,f in frames.items():
    # 03: the 'Power card' title starts right next to the tab, so paint a narrower strip there
    im=no_handle(Image.open(f'{S}/out/frames/{f}.png'), 36 if nn=='03' else 44)
    if nn=='01':  # blur the member's first name in Torty's greeting
        r=(262,389,326,417); reg=im.crop(r).filter(ImageFilter.GaussianBlur(7)); im.paste(reg,r[:2])
    im.save(f'{OUT}/{nn}.png')
# 02b: same calendar with day 22 after the Rest Card (cell taken from the team's screenshot)
base=np.array(Image.open(f'{OUT}/02.png').convert('RGB')).astype(float)
gx0,gy0,gx1,gy1=170,550,269,659
bg=np.concatenate([base[gy0-6:gy1+6,gx0-8], base[gy0-6:gy1+6,gx1+8]]).mean(0)
base[gy0-2:gy1+4,gx0-3:gx1+4]=bg
user=Image.open(f'{S}/calendar.jpg').convert('RGB')
s=576/634
crop=user.crop((176,640,312,796)); crop=crop.resize((round(crop.width*s),round(crop.height*s)),Image.LANCZOS)
ca=np.array(crop).astype(float)
ox=round(gx0-(187-176)*s); oy=round(gy0-(670-640)*s)
# keep everything that isn't the white page behind it
diff=np.abs(ca-np.array([255,255,255])).max(2)
mask=np.clip((diff-6)/18,0,1)[...,None]
reg=base[oy:oy+ca.shape[0], ox:ox+ca.shape[1]]
base[oy:oy+ca.shape[0], ox:ox+ca.shape[1]]=reg*(1-mask)+ca*mask
Image.fromarray(base.astype(np.uint8)).save(f'{OUT}/02b.png')
print('ok')
