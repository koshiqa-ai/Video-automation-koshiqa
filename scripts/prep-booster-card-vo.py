"""Video 4 (HV-BoosterCard): split the team's one Tara take into 12 slide clips, level them, and write
phrase-based word timings so `atWord` lands near the spoken word.

usage: python3 -I scripts/prep-booster-card-vo.py work/HV-BoosterCard/vo-full-tara-s0.mp3
then:  tsx scripts/help-video-vo.ts HV-BoosterCard   (measures durations), then re-run this script with --marks-only
       (help-video-vo rewrites the entry without marks)

The cuts come from a Whisper transcript (sherpa-onnx, CLAUDE.md) of every stretch between pauses: vo-split.py
flagged 3 cuts because spoken numbers ("15,000") skew its length estimate. Each phrase below starts where the
transcript heard it; words inside a phrase are spread over its speech by character position.
"""
import json, os, re, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ID = "HV-BoosterCard"
# where each phrase starts in the slide's vo line, per slide (from the transcript, in order)
PHRASES = [
    ["What if", "That's"],
    ["Koshiqa", "One you", "with no"],
    ["But everyone's", "Some members", "Others"],
    ["So members", "can we", "Can my"],
    ["So we", "You can", "Pick"],
    ["The contest", "Booster doubles"],
    ["Did 18,000", "15,000 count", "and Booster"],
    ["But it", "If your", "Booster adds"],
    ["No deficit", "or a very", "Save your", "Any day"],
    ["And it's", "For days", "there's"],
    ["Some days", "while"],
    ["Make"],
]
GAIN_DB = 11.5  # one fixed gain + limiter (as Video 2): speech ≈ −17 LUFS

full = sys.argv[1]
marks_only = "--marks-only" in sys.argv
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", full, "-af", "silencedetect=noise=-35dB:d=0.2", "-f", "null", "-"], capture_output=True, text=True).stderr
S = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", log)]
E = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", log)]
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", full], capture_output=True, text=True).stdout)
gaps = list(zip(S, E))
# phrases in the take = stretches between pauses; slide cuts fall after these phrase counts
assert len(gaps) + 1 == sum(len(p) for p in PHRASES), f"expected {sum(len(p) for p in PHRASES) - 1} pauses, found {len(gaps)}"
speech = [((gaps[i - 1][1] if i else 0.0), (gaps[i][0] if i < len(gaps) else dur)) for i in range(len(gaps) + 1)]

spec = json.load(open(os.path.join(ROOT, "work", ID, "qa.json")))
lines = [s["vo"] for s in spec["slides"] if s.get("vo")]
out = os.path.join(ROOT, "public", "vo", ID); os.makedirs(out, exist_ok=True)
k, marks = 0, []
for n, (vo, starts) in enumerate(zip(lines, PHRASES)):
    sp = speech[k:k + len(starts)]; k += len(starts)
    a, b = max(0.0, sp[0][0] - 0.04), min(dur, sp[-1][1] + 0.10)
    if not marks_only:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", full, "-af", f"volume={GAIN_DB}dB,alimiter=limit=0.89:level=false",
                        "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", os.path.join(out, f"{n + 1:02d}.wav")], check=True)
    idx = [vo.index(p) for p in starts]
    m = []
    for j, ci in enumerate(idx):
        cj = idx[j + 1] if j + 1 < len(idx) else len(vo)
        t0, t1 = sp[j][0] - a, sp[j][1] - a
        for w in re.finditer(r"\S+", vo[ci:cj]):
            m.append([ci + w.start(), round(t0 + (t1 - t0) * w.start() / max(1, cj - ci), 3)])
    marks.append(m)
    print(f"{n + 1:02d}  {a:6.2f}–{b:6.2f}  {len(starts)} phrases  {vo[:50]}")

p = os.path.join(ROOT, "src", "videos", "vo-durations.json")
allv = json.load(open(p))
if ID in allv:
    allv[ID]["marks"] = marks
    json.dump(allv, open(p, "w"), indent=1); open(p, "a").write("\n")
    print("marks written to vo-durations.json")
