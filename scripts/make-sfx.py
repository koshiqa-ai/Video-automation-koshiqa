"""Synthesises the small UI sound set (tap, swoosh, pop, chime) into public/sfx.
Placeholders until the sound-effects library from the tracker is chosen."""
import numpy as np, wave, os
SR = 48000
out = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
os.makedirs(out, exist_ok=True)

def save(name, x):
    x = np.clip(x / (np.max(np.abs(x)) + 1e-9) * 0.9, -1, 1)
    with wave.open(os.path.join(out, name), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

t = lambda d: np.linspace(0, d, int(SR * d), endpoint=False)
rng = np.random.default_rng(7)

# tap: short soft "tock" — decaying sine blip + tiny click
a = t(0.09)
tap = np.sin(2 * np.pi * (900 - 2500 * a) * a) * np.exp(-a * 55) + 0.25 * rng.standard_normal(a.size) * np.exp(-a * 400)
save("tap.wav", tap * 0.7)

# swoosh: filtered noise with a rising-then-falling envelope
a = t(0.42)
n = rng.standard_normal(a.size)
k = np.exp(-np.linspace(-3, 3, 400) ** 2); n = np.convolve(n, k / k.sum(), "same")
env = np.sin(np.pi * (a / a[-1]) ** 0.7) ** 2
save("swoosh.wav", n * env * 0.5)

# pop: bubbly pitch sweep up
a = t(0.16)
pop = np.sin(2 * np.pi * (300 + 2200 * a) * a) * np.exp(-a * 28)
save("pop.wav", pop)

# chime: two-note bright success
a = t(0.9)
note = lambda f, d: np.where(a >= d, np.sin(2 * np.pi * f * (a - d)) * np.exp(-(a - d) * 5) + 0.3 * np.sin(2 * np.pi * 2 * f * (a - d)) * np.exp(-(a - d) * 8), 0)
save("chime.wav", note(1046.5, 0) + note(1568, 0.12))
print(sorted(os.listdir(out)))
