---
# ─────────────────────────────────────────────────────────────
# DESIGN.md: Koshiqa FAQ videos
# Exact values live in this block. Claude reads it before building any video.
# Rule: one value per token, no ranges. Change a value here, not in code comments.
# ─────────────────────────────────────────────────────────────
version: 0.1            # bump on every change; log why in revisions.md
status: draft           # draft → locked (after design-team review)
direction: sky-hindi    # chosen style direction (currently the FAQ6 reference)

canvas:
  width: 1080
  height: 1920
  fps: 30
  safeArea: { side: 80, top: 100, bottom: 100 }   # px; no key text outside

colors:
  bgTop: "#13BFE6"
  bgMid: "#6FDBF2"
  bgBottom: "#EAFBFF"
  text: "#062A5C"
  textMuted: "rgba(6,42,92,0.72)"
  accent: "#075DC2"          # Koshiqa blue: accent word, step chip, primary buttons
  chipBg: "#075DC2"
  chipText: "#FFFFFF"
  hookCard: "#0B0F14"
  bubble: "#FFFFFF"
  # inside the phone (app UI): always the real app palette
  app:
    blue: "#075DC2"
    ink: "#0F1B2D"
    muted: "#6B7785"
    success: "#1DB57A"
    error: "#F25F6B"

typography:
  family: Poppins            # covers Latin + Devanagari
  headline:  { weight: 700, size: 74, lineHeight: 1.28 }   # step titles (64 if > 26 chars)
  hookTitle: { weight: 700, size: 88, lineHeight: 1.28 }
  outroTitle: { weight: 700, size: 92, lineHeight: 1.28 }
  caption:   { weight: 500, size: 38, lineHeight: 1.45, maxLines: 2, maxChars: 54 }
  chip:      { weight: 700, size: 30, letterSpacing: 0.08em, case: upper }

layout:
  phone: { scale: 1.55, x: 140, y: 90 }        # left of centre to leave room for Torty
  textTop: 1468                                # chip + headline + caption block
  tortyPresenter: { x: 790, y: 1010, height: 420 }
  tortyHook: { height: 760 }
  tortyOutro: { height: 820 }

timing:                      # seconds unless noted
  voLead: 0.5                # silence before the voice starts
  visualLeadsVoice: 0.35     # screen changes this much before the line about it
  outroTail: 2.4             # logo hold after the last word
  sceneCrossfade: 9f
  cursorTravel: 18f
  tapRipple: 0.7             # blob 32% opacity + ring 0.3→1.5×
  longPressHold: 20f
  tortyPosePop: { damping: 11, stiffness: 170 }

audio:
  voiceover: 1.0
  tap: 0.4
  swoosh: 0.3
  pop: 0.35
  chime: 0.25
---

# Koshiqa FAQ videos: design rules

> **For Claude:** read this whole file before planning or building a video. The YAML block above is the source of truth for values. If a request conflicts with a rule here, follow this file and flag the conflict in the draft notes.

## 1. Purpose & audience
<!-- 2–3 lines. Who watches, where, and what tone. -->
- **Who:** Koshiqa users stuck on a task (steps not syncing, joining a contest, redeeming koins). They watch on their phone, often without sound.
- **Tone:** friendly, calm, fast. Torty is a helpful buddy, never a salesman.
- **Language:** Hinglish captions (Devanagari + English product words). Voiceover in Hindi or English.

## 2. Video structure
| Beat | Length | Content |
|---|---|---|
| Hook | ≈ first VO line + 0.8s | Koshiqa FAQ chip, Torty in the hook card, question as headline, caption |
| Steps (×2–5) | as long as the VO for that step | Phone stays on screen and the screen slides between steps. Chip "स्टेप n" / "तरीका n · स्टेप n", headline, live caption |
| Branch card *(optional)* | 3–4s | "Google Fit में steps दिख रहे हैं?" with हां → तरीका 1 / नहीं → तरीका 2 |
| Outro | last VO line + 2.4s | Torty waves, payoff headline, logo lockup, "और जवाब: Help & Support में" |

- **Length target:** 30–40s. If the VO is longer than 45s, split the FAQ into two videos.

## 3. Layout rules
- The phone sits left of centre. Torty stands in front of it, beside it, on the same baseline (**presenter mode**).
- The text block always starts at `layout.textTop`, in this order: chip, then headline, then caption.
- One accent word per headline, coloured `colors.accent`.
- The UI inside the phone always uses `colors.app`, never the video theme.

## 4. Torty
**Assets:** `public/torty/cutouts/*.png`. Re-run `scripts/prep-torty-cutouts.py` after any art change.

| Moment | Pose | Placement |
|---|---|---|
| Hook, problem question | `worried` | Hook card |
| Hook, "how do I…" question | `curious` | Hook card |
| VO explains what to tap | `point-curious` | Presenter, arm over the phone edge |
| Right after a fix succeeds | `thumbs-up` | Presenter |
| Warning ("इसके बिना…") | `worried` + speech bubble | Presenter, bubble above his head |
| Reward / goal reached | `celebrate` | Presenter or outro |
| Outro | `wave` | Centre stage |
| Anything else | `curious` | Presenter |

- **Motion:** pop on every pose change, a subtle bounce with VO loudness while he narrates, and a ±3° sway on the wave.
- **Speech bubble:** max 4 words, `colors.bubble`, `typography.headline` font at 40px, max width 300px.

## 5. Tap & cursor language
- The arrow cursor enters from the lower right and eases to each target over `timing.cursorTravel`.
- **On tap:** the arrow presses down (0.84×), then a low-opacity blob pops from the tip and a ring expands over `timing.tapRipple`. The tapped element dips to 0.95× and springs back, and the tap sound plays.
- **Long-press:** the ripple holds for `timing.longPressHold`, then the menu opens.
- **Swipe:** a short gradient trail follows the cursor.

## 6. Captions & language
- Captions use the VO text, corrected for spelling. Product words stay in English: Koshiqa, Google Fit, email ID, app, permission.
- Words light up as they are spoken (32% opacity before, 100% after).
- Max 2 lines. Longer sentences split at commas into chunks of up to `typography.caption.maxChars`.
- **Pronunciation fixes** (`src/data/pronunciation.json`) apply to the voice only, never to captions.

| Written | Spoken |
|---|---|
| Koshiqa | कोशिका *(confirm)* |
| Torty | टॉर्टी |
| koins | coins |

## 7. Audio
- The VO is the loudest track. SFX levels are in the YAML block, and SFX never overlap a stressed word.
- No background music in v1. *(Open item.)*

## 8. Don'ts
<!-- Add one line every time a draft goes wrong. Each line should name a real mistake. -->
- ❌ Torty's body behind the phone while his arm is in front of it. Pick one layer.
- ❌ A gesture hand over Torty's face (the green blends into the green).
- ❌ A speech bubble or branch card covering the tap target or Torty's gesture.
- ❌ Captions longer than 2 lines, or text inside the 80px side margin.
- ❌ More than one accent word per headline.
- ❌ Theme colours inside the phone UI.
- ❌ Fake brand logos (e.g. Google's) in mockups. Use generic glyphs until real recordings exist.
- ❌ Videos over 45s. Split the FAQ instead.

## 9. Open items
<!-- Undecided things live here, not in the rules above. -->
- [ ] Lock the style direction (5 explored, currently Sky · Hindi).
- [ ] Voice: female VO vs. Torty's male script form ("पाऊंगा"). Pick one.
- [ ] Mouth and eye layers for Torty, for lip-sync and blinking.
- [ ] Real app screen recordings to replace the mockups.
- [ ] Background music: yes/no, and the track library.

## Changelog
| Version | Date | Change | Why |
|---|---|---|---|
| 0.1 | 2026-10-26 | First structured version | Moved from notes to the DESIGN.md format |
