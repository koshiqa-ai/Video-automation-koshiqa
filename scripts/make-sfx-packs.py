"""Builds five SFX packs into public/sfx/packs/<pack>/ — each pack has the same roles:
tap, transition, pop, focus, zoom, success (+ music in the 'minimal' pack).
All sounds are synthesised here (no third-party samples, no licensing questions).
usage: python3 scripts/make-sfx-packs.py"""
import os, json, wave
import numpy as np

SR = 48000
ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx", "packs")
rng = np.random.default_rng(11)


def t(d):
    return np.arange(int(SR * d)) / SR


def save(pack, name, x, peak=0.9):
    os.makedirs(os.path.join(ROOT, pack), exist_ok=True)
    x = np.asarray(x, float)
    m = np.max(np.abs(x)) or 1
    x = x / m * peak
    fade = min(len(x), int(0.004 * SR))
    x[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(os.path.join(ROOT, pack, name + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def lp(x, cutoff):
    """one-pole low-pass"""
    a = np.exp(-2 * np.pi * cutoff / SR); y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x):
        s = (1 - a) * v + a * s; y[i] = s
    return y


def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def sweep(f0, f1, d, shape="exp"):
    tt = t(d)
    f = f0 * (f1 / f0) ** (tt / d) if shape == "exp" else f0 + (f1 - f0) * tt / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def tone(freq, d, decay=8.0, partials=((1, 1.0),), attack=0.003):
    tt = t(d)
    env = np.minimum(1, tt / attack) * np.exp(-tt * decay)
    return sum(a * np.sin(2 * np.pi * freq * k * tt) for k, a in partials) * env


def seq(notes, gap, d, **kw):
    out = np.zeros(int(SR * (gap * len(notes) + d)))
    for i, n in enumerate(notes):
        x = tone(n, d, **kw); s = int(SR * gap * i); out[s:s + len(x)] += x
    return out


def room(x, mix=0.25, delay=0.045, fb=0.45):
    """tiny feedback-delay 'room' so synth tones don't sound dry"""
    d = int(SR * delay); y = np.concatenate([x, np.zeros(d * 8)])
    out = y.copy()
    for k in range(1, 8):
        out[d * k:] += y[:len(y) - d * k] * (fb ** k) * mix
    return out


N = lambda name: {"C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.0, "A4": 440.0, "B4": 493.88,
                  "C5": 523.25, "D5": 587.33, "E5": 659.25, "G5": 783.99, "A5": 880.0, "B5": 987.77, "C6": 1046.5, "E6": 1318.5, "G6": 1568.0}[name]
noise = lambda d: rng.standard_normal(int(SR * d))

# ───────── 1 · Soft UI ─────────
P = "soft"
tt = t(0.07); save(P, "tap", np.sin(2 * np.pi * (1300 - 5000 * tt) * tt) * np.exp(-tt * 70) + 0.15 * lp(noise(0.07), 3000) * np.exp(-tt * 300), 0.6)
tt = t(0.42); save(P, "transition", bp(noise(0.42), 700, 4500) * np.sin(np.pi * (tt / 0.42) ** 0.8) ** 2, 0.5)
save(P, "pop", sweep(380, 950, 0.09) * np.exp(-t(0.09) * 25), 0.7)
save(P, "focus", room(tone(N("E6"), 0.35, 12, ((1, 1), (2, 0.15)))), 0.45)
tt = t(0.5); save(P, "zoom", bp(noise(0.5), 400, 3000) * (tt / 0.5) ** 2 * (1 - (tt / 0.5) ** 8), 0.4)
save(P, "success", room(seq([N("C5"), N("E5"), N("G5"), N("C6")], 0.09, 0.9, decay=4, partials=((1, 1), (2, 0.25), (3, 0.08)))), 0.75)

# ───────── 2 · Playful / cartoon ─────────
P = "playful"
tt = t(0.07); save(P, "tap", np.sign(sweep(600, 1300, 0.07)) * 0.5 * np.exp(-tt * 45), 0.45)
tt = t(0.32); f = 500 * (3.2 ** (tt / 0.32)) * (1 + 0.03 * np.sin(2 * np.pi * 9 * tt)); save(P, "transition", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / 0.32), 0.45)
tt = t(0.12); save(P, "pop", sweep(180, 1400, 0.12) * np.exp(-tt * 30) + 0.4 * noise(0.12) * np.exp(-tt * 400), 0.7)
tt = t(0.45); f = 220 * (1 + 0.35 * np.exp(-tt * 9) * np.sin(2 * np.pi * 14 * tt)); save(P, "focus", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 6), 0.6)
tt = t(0.25); save(P, "zoom", sweep(700, 1600, 0.25) * np.sin(np.pi * tt / 0.25), 0.35)
xylo = dict(decay=9, partials=((1, 1), (3.9, 0.3), (9.2, 0.08)))
run = seq([N("G4"), N("A4"), N("B4"), N("D5"), N("G5")], 0.07, 0.5, **xylo)
spark = tone(N("G6"), 0.5, 6); st = int(SR * 0.35); run[st:st + len(spark)] += 0.25 * spark[: len(run) - st]
save(P, "success", room(run, 0.15), 0.75)

# ───────── 3 · Crisp tech ─────────
P = "tech"
tt = t(0.03); save(P, "tap", np.sign(np.sin(2 * np.pi * 3000 * tt)) * np.exp(-tt * 160) + 0.6 * bp(noise(0.03), 6000, 12000) * np.exp(-tt * 500), 0.4)
tt = t(0.18); save(P, "transition", bp(noise(0.18), 2500, 14000) * np.sin(np.pi * (tt / 0.18) ** 0.5) ** 3, 0.5)
save(P, "pop", tone(1760, 0.07, 40, ((1, 1), (3, 0.2))), 0.45)
two = np.concatenate([tone(1318.5, 0.06, 45), np.zeros(int(SR * 0.03)), tone(1760, 0.08, 40)]); save(P, "focus", two, 0.45)
tt = t(0.55); save(P, "zoom", (sweep(200, 2200, 0.55) * 0.5 + bp(noise(0.55), 1000, 8000) * 0.5) * (tt / 0.55) ** 2 * (1 - (tt / 0.55) ** 10), 0.4)
saw = dict(decay=5, partials=tuple((k, 1 / k) for k in range(1, 8)))
save(P, "success", room(lp(seq([N("C5"), N("E5"), N("G5"), N("C6"), N("E6")], 0.055, 0.6, **saw), 5000), 0.2), 0.7)

# ───────── 4 · Wood & marimba ─────────
P = "wood"
save(P, "tap", tone(900, 0.07, 55, ((1, 1), (2.76, 0.45))) + 0.2 * bp(noise(0.07), 2000, 6000) * np.exp(-t(0.07) * 300), 0.55)
tt = t(0.3); save(P, "transition", lp(noise(0.3), 1800) * np.sin(np.pi * tt / 0.3) ** 1.5, 0.35)
mar = dict(decay=10, partials=((1, 1), (4, 0.35), (10, 0.05)))
save(P, "pop", tone(N("A5"), 0.4, **mar), 0.6)
save(P, "focus", tone(N("E6") * 0.9, 0.4, **mar), 0.5)
tt = t(0.35); save(P, "zoom", lp(noise(0.35), 2500) * (tt / 0.35) ** 2 * np.sin(np.pi * tt / 0.35), 0.3)
chord = seq([N("C5"), N("E5"), N("G5"), N("C6")], 0.06, 1.0, decay=4, partials=mar["partials"])
save(P, "success", room(chord, 0.2), 0.75)

# ───────── 5 · Minimal + music bed ─────────
P = "minimal"
tt = t(0.05); save(P, "tap", np.sin(2 * np.pi * 1100 * tt) * np.exp(-tt * 90), 0.35)
save(P, "transition", np.zeros(10), 0.0)
save(P, "zoom", np.zeros(10), 0.0)
save(P, "pop", tone(N("C6"), 0.18, 20), 0.35)
save(P, "focus", tone(N("G5"), 0.25, 14), 0.3)
save(P, "success", room(seq([N("G5"), N("C6")], 0.12, 0.8, decay=4, partials=((1, 1), (2, 0.2)))), 0.6)
# gentle lo-fi-ish bed, 84 bpm: Cmaj7 – Am7 – Fmaj7 – G6, pads + soft kick + hats
bpm, bars = 84, 16
beat = 60 / bpm; L = int(SR * beat * 4 * bars) + SR
music = np.zeros(L)
chords = [["C4", "E4", "G4", "B4"], ["A4", "C5", "E5", "G4"], ["F4", "A4", "C5", "E5"], ["G4", "B4", "D5", "E5"]]
for b in range(bars):
    s = int(SR * beat * 4 * b); d = beat * 4
    tt = t(d); env = np.minimum(1, tt / 0.6) * np.minimum(1, (d - tt) / 0.5)
    for n in chords[b % 4]:
        music[s:s + len(tt)] += 0.06 * env * (np.sin(2 * np.pi * N(n) * tt) + 0.3 * np.sin(2 * np.pi * N(n) * 2.003 * tt))
    for k in range(4):  # plucked arpeggio
        p = tone(N(chords[b % 4][k]) * 2, beat, 7, ((1, 1), (2, 0.3)))
        st = s + int(SR * beat * k); music[st:st + len(p)] += 0.05 * p
    for k in (0, 2):  # kick
        kt = t(0.25); kick = np.sin(2 * np.pi * (55 + 90 * np.exp(-kt * 30)) * kt) * np.exp(-kt * 14)
        st = s + int(SR * beat * k); music[st:st + len(kick)] += 0.22 * kick
    for k in range(8):  # hats
        ht = t(0.04); hat = bp(noise(0.04), 7000, 14000) * np.exp(-ht * 120)
        st = s + int(SR * beat * k / 2); music[st:st + len(hat)] += 0.03 * hat
save(P, "music", lp(music, 6000), 0.5)

json.dump({
    "soft": {"label": "Soft UI", "tap": 0.45, "transition": 0.22, "pop": 0.3, "focus": 0.3, "zoom": 0.18, "success": 0.32},
    "playful": {"label": "Playful / cartoon", "tap": 0.4, "transition": 0.2, "pop": 0.32, "focus": 0.3, "zoom": 0.16, "success": 0.32},
    "tech": {"label": "Crisp tech", "tap": 0.4, "transition": 0.25, "pop": 0.3, "focus": 0.28, "zoom": 0.2, "success": 0.3},
    "wood": {"label": "Wood & marimba", "tap": 0.5, "transition": 0.2, "pop": 0.35, "focus": 0.3, "zoom": 0.15, "success": 0.35},
    "minimal": {"label": "Minimal + music bed", "tap": 0.35, "transition": 0.0, "pop": 0.25, "focus": 0.22, "zoom": 0.0, "success": 0.3, "music": 0.24},
}, open(os.path.join(ROOT, "packs.json"), "w"), indent=1)
print("packs:", sorted(os.listdir(ROOT)))
