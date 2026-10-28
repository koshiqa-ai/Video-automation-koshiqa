"""Split ONE voiceover recording into one clip per slide (for videos where the VO comes as a single file).
usage: python3 scripts/vo-split.py <full-vo.(mp3|wav|m4a)> <qa.json> [--min-gap 0.25]
qa.json = output of `npx tsx scripts/help-video-qa.ts <id>` (lists each slide's VO line).
Cuts at the pauses that best match where each line should end (by its share of the script), writes
public/vo/<id>/NN.wav for every slide that has a line, and prints a table to check (rate outliers are flagged).
Then run `npx tsx scripts/help-video-vo.ts <id>` to measure the clips."""
import json, os, re, subprocess, sys

args = sys.argv[1:]
full, qa = args[0], json.load(open(args[1]))
min_gap = float(args[args.index("--min-gap") + 1]) if "--min-gap" in args else 0.25
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
out = os.path.join(root, "public", "vo", qa["id"]); os.makedirs(out, exist_ok=True)

dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", full], capture_output=True, text=True).stdout)
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", full, "-af", f"silencedetect=noise=-35dB:d={min_gap}", "-f", "null", "-"], capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", log)]
ends = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", log)]
gaps = [(s, e) for s, e in zip(starts, ends + [dur] * (len(starts) - len(ends)))]
speech0 = gaps[0][1] if gaps and gaps[0][0] < 0.05 else 0.0
speech1 = gaps[-1][0] if gaps and gaps[-1][1] >= dur - 0.05 else dur
inner = [(s, e) for s, e in gaps if s > speech0 + 0.05 and e < speech1 - 0.05]

lines = [s for s in qa["slides"] if s.get("vo")]
weights = [len(s["vo"]) for s in lines]
total = sum(weights)
targets, cum = [], 0
for w in weights[:-1]:
    cum += w; targets.append(speech0 + (speech1 - speech0) * cum / total)
if len(inner) < len(targets): sys.exit(f"not enough pauses: found {len(inner)} for {len(targets)} cuts; try --min-gap 0.15")
# choose one pause per cut, in order, all at once: close to where the line should end AND as long as possible
# (pauses between lines are usually longer than pauses inside a line)
sigma = 0.06 * (speech1 - speech0); longest = max(e - s for s, e in inner)
cost = lambda j, k: (((inner[k][0] + inner[k][1]) / 2 - targets[j]) / sigma) ** 2 - 4.0 * (inner[k][1] - inner[k][0]) / longest
INF = float("inf"); J, K = len(targets), len(inner)
best = [[INF] * K for _ in range(J)]; prev = [[-1] * K for _ in range(J)]
for k in range(K): best[0][k] = cost(0, k)
for j in range(1, J):
    run, arg = INF, -1
    for k in range(K):
        if k > 0 and best[j - 1][k - 1] < run: run, arg = best[j - 1][k - 1], k - 1
        if arg >= 0: best[j][k] = run + cost(j, k); prev[j][k] = arg
k = min(range(K), key=lambda k: best[J - 1][k]); picks = []
for j in range(J - 1, -1, -1): picks.append(k); k = prev[j][k]
cuts = [inner[k] for k in reversed(picks)]

bounds = [(speech0, cuts[0][0] if cuts else speech1)] + [(cuts[i][1], cuts[i + 1][0]) for i in range(len(cuts) - 1)] + ([(cuts[-1][1], speech1)] if cuts else [])
rates = []
for s, (a, b) in zip(lines, bounds):
    nn = f"{s['n']:02d}"
    for ext in ("mp3", "m4a"):  # a split replaces any older per-line file for this slide
        p = os.path.join(out, f"{nn}.{ext}")
        if os.path.exists(p): os.remove(p)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(0, a - 0.05):.3f}", "-to", f"{b + 0.08:.3f}", "-i", full, os.path.join(out, f"{nn}.wav")], check=True)
    rates.append(len(s["vo"].split()) / max(0.1, b - a))
med = sorted(rates)[len(rates) // 2]
print(f"{'#':>3} {'sec':>6} {'w/s':>5}  line")
for s, (a, b), r in zip(lines, bounds, rates):
    flag = "  ⚠ check this cut" if r > med * 1.45 or r < med * 0.6 else ""
    print(f"{s['n']:>3} {b - a:6.2f} {r:5.2f}  {s['vo'][:60]}{flag}")
print(f"wrote {len(lines)} clips to {out}")
