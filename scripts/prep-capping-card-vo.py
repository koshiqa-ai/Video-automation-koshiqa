"""Video 5 (HV-CappingCard): split the team's one Tara take into 14 slide clips, level them, and write
phrase-based word timings so `atWord` lands near the spoken word. Same method as Video 4 (prep-booster-card-vo.py).

usage: python3 -I scripts/prep-capping-card-vo.py work/HV-CappingCard/vo-full-tara-s0.mp3
then:  tsx scripts/help-video-vo.ts HV-CappingCard   (measures durations), then re-run this script with --marks-only
       (help-video-vo rewrites the entry without marks)

The phrase starts come from a Whisper base.en transcript (sherpa-onnx, CLAUDE.md) of every stretch between pauses
(39 stretches; a 0.03 s blip at the very end is ignored). Each slide's cut sits in the pause after its last phrase.
"""
import json, os, re, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ID = "HV-CappingCard"
# where each phrase starts in the slide's vo line, per slide (from the transcript, in order)
PHRASES = [
    ["Going for", "a trek", "Today", "I am"],
    ["Every day", "Anything", "doesn't", "Some days"],
    ["Members", "on those", "Can that"],
    ["So we", "built"],
    ["On the day", "your daily"],
    ["And those", "The steps"],
    ["Deficit of 5,000", "Steps are", "nothing more"],
    ["Deficit of 7,000", "Up to"],
    ["Deficit of 20,000", "The entire", "from 15,000", "counts."],
    ["Capping"],
    ["And it's", "Race date", "Just move"],
    ["No deficit", "Save it", "And remember", "you only", "Steps beyond"],
    ["Big day", "Full effort", "Make it"],
    ["For the"],
]
GAIN_DB = 11.5  # one fixed gain + limiter (as Videos 2–4); the take is −27.6 LUFS

full = sys.argv[1]
marks_only = "--marks-only" in sys.argv
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", full, "-af", "silencedetect=noise=-35dB:d=0.2", "-f", "null", "-"], capture_output=True, text=True).stderr
S = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", log)]
E = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", log)]
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", full], capture_output=True, text=True).stdout)
gaps = list(zip(S, E))
# phrases in the take = stretches between pauses; slide cuts fall after these phrase counts
speech = [((gaps[i - 1][1] if i else 0.0), (gaps[i][0] if i < len(gaps) else dur)) for i in range(len(gaps) + 1)]
speech = [x for x in speech if x[1] - x[0] > 0.08]  # drop the end-of-take blip
assert len(speech) == sum(len(p) for p in PHRASES), f"expected {sum(len(p) for p in PHRASES)} stretches, found {len(speech)}"

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
