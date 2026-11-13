#!/usr/bin/env python3
"""Background music bed for help videos, synthesised from scratch (no samples, so no copyright).

    python3 scripts/make-music.py [out.wav] [--seconds 180] [--bpm 84] [--seed 7]

A soft, warm loop: Cmaj7 → Am7 → Fmaj7 → G6 (2 bars each), with
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
ap.add_argument("--bpm", type=float, default=84)
ap.add_argument("--seed", type=int, default=7)
a = ap.parse_args()

SR = 48000
rng = np.random.default_rng(a.seed)
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
out *= 10 ** (-14 / 20) / np.sqrt(np.mean(out**2))  # ≈ -14 dBFS RMS; the mix sets the final level
fade = int(2 * SR)
out[:fade] *= np.linspace(0, 1, fade)[:, None]
out[-fade:] *= np.linspace(1, 0, fade)[:, None]
out = np.clip(out, -0.98, 0.98)
import os

os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
wavfile.write(a.out, SR, (out * 32767).astype(np.int16))
print(a.out, f"{a.seconds:.0f}s", f"peak {np.abs(out).max():.2f}")
