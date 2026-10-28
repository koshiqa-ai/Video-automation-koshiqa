"""Per-frame mouth-openness track (0..1) from a voiceover, for Torty's lip flap.
usage: python3 scripts/voice-envelope.py <audio> <out.json> [fps=30]"""
import sys, json, subprocess
import numpy as np

src, out = sys.argv[1], sys.argv[2]
fps = int(sys.argv[3]) if len(sys.argv) > 3 else 30
sr = 16000
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(sr), "-f", "s16le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
hop = sr // fps
n = len(x) // hop
rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(n)])
db = 20 * np.log10(rms)
speech = db[db > -45]
hi = np.percentile(speech, 95) if len(speech) else -10
lo = hi - 24
o = np.clip((db - lo) / (hi - lo), 0, 1) ** 0.8
# fast attack, slower release so the mouth doesn't chatter
sm = np.zeros_like(o); v = 0.0
for i, t in enumerate(o):
    v = v + (t - v) * (0.75 if t > v else 0.4)
    sm[i] = v
json.dump({"fps": fps, "values": [round(float(v), 2) for v in sm]}, open(out, "w"))
print(out, n, "frames", f"speech dB 95th={hi:.1f}")
