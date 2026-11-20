#!/usr/bin/env python3
"""Background music bed for help videos, synthesised from scratch (no samples, so no copyright).

    python3 scripts/make-music.py [out.wav] [--style soft|bright|piano|uke] [--seconds 180] [--bpm N] [--seed 7]

Styles (team, 2026-11-20: "soft" sounded a bit tense, so three lighter ones were added; all plain major triads):
  bright  C → G → Am → F, 96 bpm: a soft marimba-like pluck on the beat, a warm sine pad, round bass. No shaker.
  piano   C → F → Am → G, 72 bpm: slow broken chords on a soft piano, a very quiet pad underneath.
  uke     F → C → G → Am, 100 bpm: a gentle plucked-string strum (Karplus-Strong) and a light bell melody.
  soft    (the original) below.

soft — a warm loop: Cmaj7 → Am7 → Fmaj7 → G6 (2 bars each), with
  • a slow pad of detuned saws through a low-pass filter
  • a gentle electric-piano style arpeggio, panned slightly left/right
  • a round sub bass on the root
  • a light shaker on the off-beats
and a short convolution reverb. Mixed quietly so it sits under the voiceover
(the renderer lowers it further and ducks it when someone speaks: design.md §8).
"""
import argparse
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

ap = argparse.ArgumentParser()
ap.add_argument("out", nargs="?", default="public/music/soft-bed.wav")
ap.add_argument("--seconds", type=float, default=180)
ap.add_argument("--bpm", type=float, default=0, help="0 = the style's own tempo")
ap.add_argument("--style", default="soft", choices=["soft", "bright", "piano", "uke"])
ap.add_argument("--seed", type=int, default=7)
a = ap.parse_args()

SR = 48000
rng = np.random.default_rng(a.seed)
a.bpm = a.bpm or {"soft": 84, "bright": 96, "piano": 72, "uke": 100}[a.style]
beat = 60 / a.bpm
bar = 4 * beat
N = int(a.seconds * SR)
L = np.zeros(N)
R = np.zeros(N)

mid = lambda m: 440 * 2 ** ((m - 69) / 12)
# chords as MIDI notes (voiced around middle C), bass root
CHORDS = [
    ([60, 64, 67, 71], 36),  # Cmaj7
    ([57, 60, 64, 67], 33),  # Am7
    ([53, 57, 60, 64], 29),  # Fmaj7
    ([55, 59, 62, 64], 31),  # G6
]
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)
hp = lambda x, f: sosfilt(butter(2, f, "high", fs=SR, output="sos"), x)


def add(buf_l, buf_r, sig, start, pan=0.0):
    s = max(0, int(start * SR))
    if s >= N:
        return
    sig = sig[: N - s]
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf_l[s : s + len(sig)] += sig * gl
    buf_r[s : s + len(sig)] += sig * gr


def env(n, att, rel):
    e = np.ones(n)
    a_, r_ = int(att * SR), int(rel * SR)
    e[:a_] = np.linspace(0, 1, a_) ** 2
    e[-r_:] *= np.linspace(1, 0, r_) ** 2
    return e


def saw(f, t):
    return 2 * ((f * t) % 1) - 1


def pad(notes, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for m in notes:
        for det in (-0.07, 0.0, 0.08):
            s += saw(mid(m) * 2 ** (det / 12), t + rng.random())
    s = lp(s, 900) * env(n, 1.2, 1.4)
    return s / len(notes) * 0.18


def epiano(m, dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mid(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6) + 0.12 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 9)
    s *= np.exp(-t * 2.6) * env(n, 0.006, 0.3)
    return s * 0.16


def bass(m, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * mid(m) * t) + 0.2 * np.sin(2 * np.pi * 2 * mid(m) * t)
    return s * env(n, 0.04, 0.5) * np.exp(-t * 0.35) * 0.22


def shaker():
    n = int(0.09 * SR)
    s = hp(rng.standard_normal(n), 6000) * np.exp(-np.arange(n) / SR * 55)
    return s * 0.035


def style_soft():
    ARP = [[0, 2, 1, 3, 2, 1, 3, 2], [0, 1, 2, 3, 1, 2, 3, 1], [3, 2, 1, 0, 2, 1, 2, 3]]
    t0, k = 0.0, 0
    while t0 < a.seconds:
        notes, root = CHORDS[k % 4]
        span = 2 * bar
        p = pad(notes, span + 1.4)
        add(L, R, p, t0, -0.25)
        add(L, R, np.roll(p, 900), t0, 0.25)
        add(L, R, bass(root, span), t0, 0.0)
        add(L, R, bass(root + 7, bar), t0 + bar + 2 * beat, 0.0) if k % 2 else None
        pattern = ARP[(k // 4) % len(ARP)]
        for i in range(16):  # 8th notes over 2 bars
            if (k // 4) % 4 == 0 and i % 4 == 3:
                continue  # breathe: sparser every fourth cycle
            m = notes[pattern[i % 8]] + 12
            vel = 0.75 + 0.25 * rng.random()
            add(L, R, epiano(m) * vel, t0 + i * beat / 2 + 0.004 * rng.standard_normal(), 0.35 * np.sin(i * 0.9))
        for i in range(8):  # off-beat shaker
            add(L, R, shaker() * (0.7 + 0.3 * rng.random()), t0 + i * beat + beat / 2, 0.4)
        t0 += span
        k += 1



def sine_pad(notes, dur, level=0.10):
    """warm, round pad: sines + a little 2nd harmonic, slow swell (no saws, so no buzz)"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for m in notes:
        for det in (-0.05, 0.05):
            f = mid(m) * 2 ** (det / 12)
            s += np.sin(2 * np.pi * f * t + rng.random() * 6) + 0.15 * np.sin(4 * np.pi * f * t)
    trem = 1 + 0.08 * np.sin(2 * np.pi * 0.2 * t)
    return lp(s, 1200) * env(n, 1.5, 1.6) * trem / len(notes) * level


def marimba(m, dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mid(m)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 3.2) + 0.25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 14) \
        + 0.06 * np.sin(2 * np.pi * 9.9 * f * t) * np.exp(-t * 30)
    return s * env(n, 0.003, 0.2) * 0.17


def piano(m, dur=3.0, vel=1.0):
    """soft felt-piano tone: a few slightly stretched partials, the upper ones dying faster"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mid(m)
    s = np.zeros(n)
    for h, (amp, dec) in enumerate([(1, 1.1), (0.45, 1.9), (0.18, 2.8), (0.08, 3.6), (0.04, 4.5)], 1):
        s += amp * np.sin(2 * np.pi * f * h * (1 + 0.0004 * h * h) * t) * np.exp(-t * dec * (0.6 + 0.4 * vel))
    s = lp(s, 2600 + 1800 * vel)
    return s * env(n, 0.004, 0.5) * 0.15 * vel


def pluck(m, dur=1.6, bright=0.5):
    """Karplus-Strong plucked string (ukulele-ish), soft attack"""
    f = mid(m)
    period = int(SR / f)
    n = int(dur * SR)
    buf = lp(rng.uniform(-1, 1, period), 2000 + 3000 * bright)
    out = np.zeros(n)
    out[:period] = buf
    decay = 0.996
    for i in range(period, n):
        out[i] = decay * 0.5 * (out[i - period] + out[i - period - 1 if i - period - 1 >= 0 else 0])
    return lp(out, 3500) * env(n, 0.002, 0.3) * 0.22


def bell(m, dur=2.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mid(m)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.2) + 0.3 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t * 5) \
        + 0.12 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t * 9)
    return s * env(n, 0.002, 0.4) * 0.07


def style_bright():
    # C, G, Am, F (I–V–vi–IV) triads, 2 bars each; marimba walks the chord on quarter notes, resting now and then
    chords = [([60, 64, 67], 36), ([59, 62, 67], 31), ([57, 60, 64], 33), ([57, 60, 65], 29)]
    pats = [[0, 1, 2, 1, 0, 2, 1, -1], [0, 2, 1, 2, 0, 1, 2, -1], [2, 1, 0, 1, 2, 0, -1, -1]]
    t0, k = 0.0, 0
    while t0 < a.seconds:
        notes, root = chords[k % 4]
        span = 2 * bar
        add(L, R, sine_pad(notes, span + 1.6), t0, -0.2)
        add(L, R, np.roll(sine_pad(notes, span + 1.6), 1200), t0, 0.2)
        add(L, R, bass(root, bar) * 0.9, t0, 0.0)
        add(L, R, bass(root, bar) * 0.7, t0 + bar, 0.0)
        pat = pats[(k // 4) % len(pats)]
        for i in range(8):
            if pat[i] < 0:
                continue
            m = notes[pat[i]] + 12
            add(L, R, marimba(m) * (0.7 + 0.25 * rng.random()), t0 + i * beat + 0.003 * rng.standard_normal(), 0.3 * np.sin(i * 1.3))
        t0 += span
        k += 1


def style_piano():
    # C, F, Am, G; each bar: low root, then the chord broken upward in slow 8ths, a top note on beat 3 every other bar
    chords = [([48, 55, 60, 64, 67], [72, 76]), ([41, 53, 57, 60, 65], [72, 77]), ([45, 52, 57, 60, 64], [69, 72]), ([43, 50, 55, 59, 62], [67, 71])]
    t0, k = 0.0, 0
    while t0 < a.seconds:
        notes, tops = chords[k % 4]
        add(L, R, sine_pad(notes[1:4], bar + 1.6, 0.05), t0, 0.0)
        order = [0, 1, 2, 3, 4, 3, 2, 1] if k % 2 == 0 else [0, 2, 1, 3, 2, 4, 3, 2]
        for i, idx in enumerate(order):
            m = notes[idx]
            vel = (0.85 if i == 0 else 0.55) + 0.12 * rng.random()
            add(L, R, piano(m, 3.2, vel), t0 + i * beat / 2 + 0.006 * rng.standard_normal(), -0.3 + 0.6 * idx / 4)
        if k % 2 == 1:
            add(L, R, piano(tops[(k // 2) % 2], 3.5, 0.6), t0 + 2 * beat, 0.15)
        t0 += bar
        k += 1


def style_uke():
    # F, C, G, Am, 2 bars each; strum pattern D . D U . U D U (8ths), and a sparse bell melody on chord tones
    chords = [([57, 60, 65, 69], 29), ([55, 60, 64, 67], 36), ([55, 59, 62, 67], 31), ([57, 60, 64, 69], 33)]
    strum = [(0, "D", 0.9), (2, "D", 0.6), (3, "U", 0.45), (5, "U", 0.45), (6, "D", 0.6), (7, "U", 0.4)]
    mel = [[2, -1, 1, -1], [3, -1, 2, 1], [1, -1, -1, 2], [0, -1, 1, -1]]
    cache = {}
    t0, k = 0.0, 0
    while t0 < a.seconds:
        notes, root = chords[k % 4]
        for b in range(2):
            tb = t0 + b * bar
            for pos, d, vel in strum:
                seq = notes if d == "D" else notes[::-1]
                for j, m in enumerate(seq):
                    key = (m, j)
                    if key not in cache:
                        cache[key] = pluck(m)
                    add(L, R, cache[key] * vel * (0.85 + 0.15 * rng.random()), tb + pos * beat / 2 + j * 0.012, -0.25 + 0.15 * j)
            add(L, R, bass(root, bar) * 0.7, tb, 0.0)
        if (k // 4) % 2 == 1:  # the bell melody every other round, so it doesn't nag
            for i, idx in enumerate(mel[k % 4]):
                if idx >= 0:
                    add(L, R, bell(notes[idx] + 12), t0 + i * bar / 2, 0.3)
        t0 += 2 * bar
        k += 1


{"soft": style_soft, "bright": style_bright, "piano": style_piano, "uke": style_uke}[a.style]()

# reverb: exponentially decaying stereo noise
irn = int(2.2 * SR)
ir_t = np.arange(irn) / SR
irL = rng.standard_normal(irn) * np.exp(-ir_t * 2.8)
irR = rng.standard_normal(irn) * np.exp(-ir_t * 2.8)
irL, irR = lp(irL, 5000), lp(irR, 5000)
irL /= np.abs(irL).sum() ** 0.5 * 6
irR /= np.abs(irR).sum() ** 0.5 * 6
wetL = fftconvolve(L, irL)[:N]
wetR = fftconvolve(R, irR)[:N]
L, R = hp(L * 0.8 + wetL * 0.5, 40), hp(R * 0.8 + wetR * 0.5, 40)

out = np.stack([L, R], 1)
out *= 10 ** ((-14 + {"uke": 1.2}.get(a.style, 0)) / 20) / np.sqrt(np.mean(out**2))  # trims match the styles in loudness (≈ -12.4 LUFS)  # ≈ -14 dBFS RMS; the mix sets the final level
fade = int(2 * SR)
out[:fade] *= np.linspace(0, 1, fade)[:, None]
out[-fade:] *= np.linspace(1, 0, fade)[:, None]
knee = 0.8  # soft-limit the odd pluck peak instead of hard-clipping it
over = np.abs(out) > knee
out[over] = np.sign(out[over]) * (knee + (1 - knee) * np.tanh((np.abs(out[over]) - knee) / (1 - knee)))
out = np.clip(out, -0.98, 0.98)
import os

os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
wavfile.write(a.out, SR, (out * 32767).astype(np.int16))
print(a.out, f"{a.seconds:.0f}s", f"peak {np.abs(out).max():.2f}")
