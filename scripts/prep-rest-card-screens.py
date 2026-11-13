# One-off prep for HV-RestCard screenshots (kept for reproducibility): paints out the recorder's side tab,
# blurs the member name in Torty's greeting, and builds 02b (day 22 after the Rest Card) from the team's screenshot.
# Inputs: frames from scripts/recording-frames.py on IMG_7237.MP4 + the team's calendar screenshot (paths below).
import numpy as np
import cv2
from PIL import Image, ImageFilter
S='/tmp/claude-0/-home-claude/6250d460-97be-56d8-8e18-6ba55b3d3991/scratchpad/rc'
OUT='/home/claude/video-automation-koshiqa/public/screens/HV-RestCard'
def tab_mask(shape):
    m=np.zeros(shape[:2],np.uint8)
    cv2.rectangle(m,(0,84),(22,227),255,-1); cv2.rectangle(m,(0,98),(36,213),255,-1)
    for cy in (98,213): cv2.circle(m,(22,cy),14,255,-1)   # rounded right corners
    return m
def no_handle_plain(im, top, bot):
    """for frames with a plain background behind the tab: fill it with the background from clean rows above
    (`top`) and below (`bot`), blended top to bottom; inpainting would pull in the card / title colours next to it"""
    a=np.array(im.convert('RGB')).astype(float); m=tab_mask(a.shape)>0
    t,b=a[top],a[bot]
    for y in range(a.shape[0]):
        if m[y].any():
            k=np.clip((y-top)/max(1,bot-top),0,1); row=t*(1-k)+b*k; a[y,m[y]]=row[m[y]]
    return Image.fromarray(a.astype(np.uint8))
def no_handle(im):
    """remove the screen recorder's floating side tab ('❯'): a see-through rounded box at x 0-35, y 85-226 in every
    frame. Inpaint exactly that shape from the pixels around it (an earlier version faded top-to-bottom, which
    smeared the dark status bar down the left edge)."""
    a=cv2.cvtColor(np.array(im.convert('RGB')),cv2.COLOR_RGB2BGR)
    a=cv2.inpaint(a,tab_mask(a.shape),9,cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(a,cv2.COLOR_BGR2RGB))
def clean_scroll_top(im, y0=60, y1=100, src=110):
    """calendar frames were grabbed mid-scroll: a sliver of the row above (card bottoms) and the recorder's dark
    status bar sit above the first full row. Replace that strip with the page background (row `src`, between the
    sliver and the next cards), so the screen starts on a clean white page under our 9:41 bar."""
    a=np.array(im.convert('RGB')); a[y0:y1+1]=a[src]
    return Image.fromarray(a)
frames={'01':'f_001','02':'f_005','03':'f_006','04':'f_007','05':'f_012'}
for nn,f in frames.items():
    im=Image.open(f'{S}/out/frames/{f}.png')
    if nn=='02': im=clean_scroll_top(no_handle_plain(im, 240, 240))   # page background is the same all the way down
    elif nn=='03':                                                    # soft beige gradient; the 'P' starts at x 37
        im=no_handle_plain(im, 80, 232)
        # the back arrow's tip sat under the tab: finish its line and both 45° strokes to the tip (x 32.5, y 116.5)
        a=cv2.cvtColor(np.array(im),cv2.COLOR_RGB2BGR); col=tuple(int(v) for v in a[116,50]); sh=4; S2=1<<sh
        P=lambda x,y:(round(x*S2),round(y*S2))
        for (x0,y0),(x1,y1) in [((32.5,116.5),(40,116.5)),((32.5,116.5),(41,108)),((32.5,116.5),(41.5,125.5))]:
            cv2.line(a,P(x0,y0),P(x1,y1),col,2,cv2.LINE_AA,sh)
        im=Image.fromarray(cv2.cvtColor(a,cv2.COLOR_BGR2RGB))
    else: im=no_handle(im)
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
