"""Step 2 of recording → storyboard: write the review storyboard HTML (same format as the approved reference,
and readable by scripts/storyboard-import.py).
usage: python3 scripts/make-storyboard.py <storyboard.json> <out.html>
storyboard.json = {"title", "subtitle"?, "beats": [{"n": "card"|"#01", "section"?, "card", "vo", "hold"?, "image"?,
                   "was"?, "why"?, "flags"?: ["<b>Label</b> — text"], "cut"?: bool}]}
image paths are relative to the JSON file or to public/."""
import base64, html, json, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "storyboard_assets")
src, out = sys.argv[1], sys.argv[2]
sb = json.load(open(src, encoding="utf-8")); base = os.path.dirname(os.path.abspath(src))
e = lambda s: html.escape(s or "", quote=True)
slug = "".join(c if c.isalnum() else "-" for c in sb["title"].lower()).strip("-")
DL = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.5v9M4.5 7L8 10.5 11.5 7M2 13.5h12"/></svg>'

def img_uri(p):
    for cand in (os.path.join(base, p), os.path.join(ROOT, "public", p), p):
        if os.path.exists(cand):
            return "data:image/png;base64," + base64.b64encode(open(cand, "rb").read()).decode()
    raise SystemExit(f"image not found: {p}")

def fmt(t): return f"{int(t // 60)}:{t % 60:04.1f}"
words = lambda s: len((s or "").split())
beats = sb["beats"]
t, section, parts, sec_no, lines = 0.0, None, [], 0, []
for b in beats:
    hold = b.get("hold") or (round(max(2.0, words(b.get("vo")) / 2.5) * 2) / 2 if b.get("vo") else 3.0)
    if b.get("section") and b["section"] != section and b.get("n") != "card":
        section = b["section"]; sec_no += 1
        parts.append(f'<div class="pair"><div class="pair-n">{sec_no}</div><div class="pair-name">{e(section)}</div><div class="pair-rule"></div><div class="pair-time">from {fmt(t)}</div></div>')
        lines.append(f'<div class="rt-sec">{e(section)}</div>')
    cut = bool(b.get("cut")); n = b.get("n", "")
    if b.get("image"):
        name = os.path.basename(b["image"])
        fig = (f'<img alt="{e(name)}" src="{img_uri(b["image"])}"><div class="figbar"><button type="button" class="dl" '
               f'data-name="{slug}-{name}">{DL}Download</button></div>')
    else:
        fig = '<div class="noscreen">full-frame<br>card</div>'
    meta = f'<span class="n">{e(n)}</span><span>{fmt(t)}</span>' + ('<span class="cutlabel">cut</span>' if cut else f'<span>hold {hold}s</span>')
    if b.get("image"): meta += f'<span>{e(os.path.basename(b["image"]))}</span>'
    body = f'<div class="meta">{meta}</div><div class="card-preview">{e(b.get("card"))}</div>'
    if b.get("vo") and not cut: body += f'<div class="vo">{e(b["vo"])}</div>'
    if b.get("was"): body += f'<div class="was">was <s>{e(b["was"])}</s></div>'
    if b.get("why"): body += f'<div class="why">{e(b["why"])}</div>'
    for fl in b.get("flags") or []: body += f'<div class="flag">{fl}</div>'
    parts.append(f'<div class="beat{" cut" if cut else ""}"><div>{fig}</div><div>{body}</div></div>')
    if not cut:
        if b.get("vo"): lines.append(f'<div class="rt-line"><div class="rt-mark">{e(n)}</div><div class="rt-text">{e(b["vo"])}</div></div>')
        t += hold

live = [b for b in beats if not b.get("cut")]
nwords = sum(words(b.get("vo")) for b in live)
raw = "\n\n".join(e(b["vo"]) for b in live if b.get("vo"))
sub = e(sb.get("subtitle") or "Draft storyboard")
page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(sb['title'])}</title>
<style>
{open(os.path.join(ASSETS, 'style.css')).read()}</style>
</head>
<body><div class="wrap"><h1>{e(sb['title'])}</h1>
<div class="sub">{sub} &nbsp;·&nbsp; {len(live)} beats &nbsp;·&nbsp; runtime <b>{fmt(t)}</b> &nbsp;·&nbsp; <a href="#readthrough">read-through</a></div>
<div class="topbar"><button type="button" class="dlall">{DL}Download all screenshots</button></div>
{chr(10).join(parts)}
<div class="legend">Dark panel = the card on screen beside the phone. Quoted line = voiceover. Screenshots are the processed frames, redactions already applied.</div>
<div class="rt" id="readthrough">
<div class="rt-head"><h2>Read-through</h2>
<span class="rt-stat">{len(lines) - sec_no} lines · {nwords} words · ~{fmt(nwords / 2.5)} at 150 wpm</span>
<span class="rt-actions">
<button type="button" id="rt-copy">Copy script</button>
<button type="button" id="rt-bare">Hide markers</button>
</span></div>
<div class="rt-body">
{chr(10).join(lines)}
</div><pre id="rt-raw">{raw}</pre></div>
<script>
{open(os.path.join(ASSETS, 'script.js')).read()}</script></div></body>
</html>
"""
open(out, "w", encoding="utf-8").write(page)
print(out, f"{len(live)} beats, runtime {fmt(t)}")
