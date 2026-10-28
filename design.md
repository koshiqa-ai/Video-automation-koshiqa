---
# ─────────────────────────────────────────────────────────────
# DESIGN.md: Koshiqa help videos
# The values in this block are the source of truth. Claude reads this file before
# planning or building any video. src/data/layout-system.ts must match these numbers;
# change them here first, then in code.
# Rule: one value per token, no ranges.
# ─────────────────────────────────────────────────────────────
version: 1.1
status: approved            # layout system approved from the v4 review grid (2026-10-28)
reference: LayoutSystem     # Remotion composition that renders every layout below
visuals: design/            # layout stills (design/layouts), Torty art (design/torty), review grid

canvas:
  width: 1080
  height: 1920
  fps: 30
  margin: 70                # min gap between the phone and the frame edge

colors:
  bg: "#008E66"             # Koshiqa green, the background of every slide
  bgGlow: "#0AA376"         # radial glow, 50% x / 35% y
  deep: "#006B4D"           # numbers on mint, ring outline
  mint: "#C2EEE1"           # headline text, badges, done steps, highlight ring
  white: "#FFFFFF"          # accent word, list text
  cream: "#FDF9F0"          # icon badges
  ink: "#0B2B22"            # dark tooltip, cursor fill
  spotlightDim: "rgba(5,30,22,0.62)"
  confetti: ["#C2EEE1", "#FFFFFF", "#FFC93C", "#FF7A59", "#006B4D"]
  phoneFrame: "#1B1F1E"
  # inside the phone: always the real app palette, never the video colours
  app: { blue: "#075DC2", ink: "#0F1B2D", muted: "#6B7785", bg: "#F5F7FA", green: "#1DB57A", coral: "#F25F6B", gold: "#F5B300" }

typography:
  family: Poppins
  headline:     { weight: 700, size: 84,  lineHeight: 1.12, letterSpacing: -0.02em, maxWords: 4, lines: 1 }
  fullTortyText: { weight: 700, size: 104, lineHeight: 1.12, maxWords: 5, lines: 2 }
  listHeading:  { weight: 700, size: 104 }
  listItem:     { weight: 600, size: 70, maxWords: 3 }
  eyebrow:      { weight: 700, size: 38, letterSpacing: 0.14em, case: upper }
  timelineLabel: { weight: 500, size: 34, currentWeight: 700 }
  tooltip:      { weight: 700, size: 40 }
  # headline colour: mint, with ONE accent word in white

phone:                      # mockup incl. bezel, at scale 1
  width: 414
  height: 868
  screen: { width: 390, height: 844, inset: 12 }
  x: centred                # always (1080 − 414 × scale) / 2

layouts:                    # see section 3 for when to use each
  S1: { name: "Phone",                    phoneTop: 70,  scale: 2.05,  headline: none }
  S2: { name: "Phone + headline",         phoneTop: 230, scale: 1.866, headlineTop: 80 }
  S3: { name: "Close-up, bottom of screen + headline below", scale: 2.3, phoneBottom: 1480, phoneBottomWithTorty: 1300, headlineGap: 90 }
  S4: { name: "Close-up, top of screen + headline",          scale: 2.3, phoneTop: 230, headlineTop: 80 }
  F1: { name: "Text on top, Torty below", textTop: 300, tortyTop: 610,  tortyHeight: 1000 }
  F2: { name: "Torty on top, text below", tortyTop: 300, textTop: 1370, tortyHeight: 1000 }
  P1: { name: "Numbered pointers", eyebrowTop: none, headingTop: 430, listTop: 620, badge: 140, rowGap: 64, maxItems: 4 }
  P2: { name: "Icon pointers",     headingTop: 430, listTop: 620, badge: 140, rowGap: 64, maxItems: 4 }
  T1: { name: "Steps list",        eyebrowTop: 350, headingTop: 430, listTop: 620, badge: 140, rowGap: 64, maxItems: 4 }
  T2: { name: "Progress timeline", base: S2, dotsY: 96, dot: 76, dotsX: [220, 540, 860] }

torty:
  art: public/torty/flat/              # 13 full poses, cut from assets-src/torty-flat/expression-sheet.png
  peekArt: public/torty/peek-flat/     # peek-{left|right}-{pose}.png, cut at the hips
  peek: { height: 490, centreX: 150, sink: 30, tilt: 10, zone: { w: 330, h: 470 } }   # centreX from the side edge
  full: { bodyHeight: 1000 }           # feet to top of head; sparkles etc. sit outside

motion:                     # frames at 30 fps unless marked s
  slideIn: { duration: 11, offsetX: 100, fromOpacity: 0.4, easing: easeOutCubic }
  phoneRise: { offsetY: 60, spring: { damping: 18, stiffness: 120 } }
  headlineWords: per-word spring rise, 3f delay
  peekRise: { delay: 6, spring: { damping: 12, stiffness: 130 }, bob: 4px, tiltSettle: 50%→100% }
  fullTortyPop: { spring: { damping: 10, stiffness: 140 }, from: 0.9, float: 6px }
  listItem: { spring: { damping: 11, stiffness: 170 }, textSlide: 30px over 10f, stagger: 0.6s }
  cursorTravel: 18
  tapPress: 0.84
  longPressHold: 20
  swipe: 16
  ring: { at: 0.6s, spring: { damping: 12, stiffness: 160 }, pulse: 3% }
  spotlight: { fadeIn: 0.5s→0.9s }
  tooltip: { at: 0.6s, spring: { damping: 11, stiffness: 170 } }
  confetti: { pieces: 60, life: 70 }
  hand: { arrives: 0.9s before the tap, angle: 38deg, width: 230, press: 0.92, leaves: 1.0s after the tap }
  timelineAdvance: 0.4s→0.8s

audio:
  pack: public/sfx/packs/soft          # "Soft UI"
  voiceover: 1.0
  tap: 0.45
  transition: 0.2
  pop: 0.28            # list items, Torty peek (0.16)
  focus: 0.3           # ring, spotlight, tooltip, timeline
  success: 0.32
  music: none
---

# Koshiqa help videos: design rules

> **For Claude:** read this whole file before planning or building a video. Every slide must be one of the layouts in section 3, with the numbers in the YAML block. If a script needs something these layouts can't do, don't invent a new layout. Use the closest one and flag it in the draft notes.

## 1. Purpose & audience
- **Who:** Koshiqa users stuck on a task, like steps not syncing, joining a contest or redeeming koins. They watch on their phone, often with the sound off.
- **Tone:** friendly, calm and quick. Torty is a helpful buddy reacting from the corner; the app screen does the explaining.
- **Length:** 30–40 s for a single question. If the voiceover runs past 45 s, split the video, unless the approved storyboard is deliberately a longer walkthrough (e.g. first-time setup). In that case keep it and note it in `revisions.md`.

## 2. Video structure
A video is a sequence of the layouts below, with no other slide types.

| Beat | Layout | Notes |
|---|---|---|
| Opening | **F1** | The question or promise in 2–5 words, with Torty reacting: worried or confused for a problem, excited for a feature. |
| What you'll do *(only if 2–4 steps and the script has a line for it)* | **T1** | The steps, 2–3 words each. They become the T2 timeline labels. |
| Each step | **T2** for the main screen of the step, then **S1–S4** as needed | Use T2 when the video has 2–3 steps. With more steps (e.g. a storyboard with 8 sections), use **S2** with the storyboard's card text as the headline. Close-ups (S3/S4) always carry a headline. |
| Tips, requirements, "you'll need" | **P1** (order matters) or **P2** (no order) | Full screen, never over the phone. |
| Closing | **F2** | The payoff in 2–4 words, with Torty winking or happy. |

- One idea per slide. A slide lasts as long as its voiceover line, plus about 0.3 s.
- The screen changes about 0.35 s **before** the line that talks about it.

## 3. Layout system
These are the only layouts. The review grid is the `LayoutSystem` composition; the codes there match these. Each code has a still in `design/layouts/`, and the full grid is `design/layout-system-grid.png`.

### Phone layouts (S1–S4)
| Code | Use for | Phone | Headline |
|---|---|---|---|
| **S1** Phone | A screen that speaks for itself, or a tap sequence | Centred, top 70, scale 2.05 | None |
| **S2** Phone + headline | The default step slide | Centred, top 230, scale 1.866 | Top 80 |
| **S3** Close-up, bottom of screen | Buttons, sheets and tab bars at the bottom of the screen | Scale 2.3, hanging from the top; ends at 1480 (1300 with Torty) | 90 px under the phone |
| **S4** Close-up, top of screen | Headers, balances, the step ring | Scale 2.3, top 230, runs off the bottom edge | Top 80 |

- **The phone is always horizontally centred** and the same size whether or not Torty is there. Torty overlaps it; it never shrinks or moves for him.
- The UI inside the phone always uses `colors.app`, never the video colours.
- **Screens are real screenshots** from the approved storyboard (see `storyboards/README.md`). They are fitted to the phone width, the recording's status bar (clock and the recorder's red timer) is replaced with a clean one, and anything personal is redacted before it reaches the storyboard. Coded mockups are for demos only.

**What they look like**

|  | S1 Phone | S2 Phone + headline | S3 Close-up, bottom | S4 Close-up, top |
| --- | --- | --- | --- | --- |
| **No Torty** | <img src="design/layouts/S1-no-torty.png" width="150" alt="S1 No Torty"> | <img src="design/layouts/S2-no-torty.png" width="150" alt="S2 No Torty"> | <img src="design/layouts/S3-no-torty.png" width="150" alt="S3 No Torty"> | <img src="design/layouts/S4-no-torty.png" width="150" alt="S4 No Torty"> |
| **Peek left** | <img src="design/layouts/S1-peek-left.png" width="150" alt="S1 Peek left"> | <img src="design/layouts/S2-peek-left.png" width="150" alt="S2 Peek left"> | <img src="design/layouts/S3-peek-left.png" width="150" alt="S3 Peek left"> | <img src="design/layouts/S4-peek-left.png" width="150" alt="S4 Peek left"> |
| **Peek right** | <img src="design/layouts/S1-peek-right.png" width="150" alt="S1 Peek right"> | <img src="design/layouts/S2-peek-right.png" width="150" alt="S2 Peek right"> | <img src="design/layouts/S3-peek-right.png" width="150" alt="S3 Peek right"> | <img src="design/layouts/S4-peek-right.png" width="150" alt="S4 Peek right"> |

### Full Torty (F1, F2): no phone
- **F1:** text on top (starting at 300), Torty below (starting at 610).
- **F2:** Torty on top (starting at 300), text below (starting at 1370).
- Torty's body is always 1000 px tall and centred, on a soft mint glow.

| F1 | F2 |
| --- | --- |
| <img src="design/layouts/F1.png" width="180" alt="F1"> | <img src="design/layouts/F2.png" width="180" alt="F2"> |

### Pointers (P1, P2): full screen, no phone
- Heading (104 px) at 430, then the list at 620. The list is a centred block with its items left-aligned.
- **P1 numbered:** mint circle (140 px) with a deep-green number.
- **P2 icons:** cream circle (140 px) with a green line icon from the app icon set.
- Up to 4 points of up to 3 words each. Points pop in one by one with the voiceover.
- Torty peeks from a corner.

| P1 numbered | P2 icons |
| --- | --- |
| <img src="design/layouts/P1.png" width="180" alt="P1"> | <img src="design/layouts/P2.png" width="180" alt="P2"> |

### Steps (T1, T2)
- **T1 steps list (full screen):** "IN THIS VIDEO" eyebrow at 350, then a heading, then numbered white circles joined by a line that grows as each step appears. Torty peeks.
- **T2 progress timeline:** S2 geometry, with the headline slot replaced by three dots (76 px at x 220 / 540 / 860, y 96) with labels underneath.
  - **Done:** mint with a tick.
  - **Current:** white with a green number; it pops and its label is bold white.
  - **Upcoming:** outlined at 55%.
  - The line fills toward the current step as the slide starts.
- A steps list is **never** drawn on top of the app UI.

| T1 steps list | T2 progress timeline |
| --- | --- |
| <img src="design/layouts/T1.png" width="180" alt="T1"> | <img src="design/layouts/T2.png" width="180" alt="T2"> |

## 4. Torty
**Art:** flat style, cut from the expression sheet (`scripts/extract-torty-flat.py`). Peek versions come from `scripts/make-torty-peek-flat.py`.

**Full poses** (`design/torty/full/`, used in the videos from `public/torty/flat/`)

|  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| <img src="design/torty/full/idle.png" width="110" alt="idle"> | <img src="design/torty/full/smile.png" width="110" alt="smile"> | <img src="design/torty/full/happy.png" width="110" alt="happy"> | <img src="design/torty/full/excited.png" width="110" alt="excited"> | <img src="design/torty/full/thinking.png" width="110" alt="thinking"> | <img src="design/torty/full/surprised.png" width="110" alt="surprised"> | <img src="design/torty/full/worried.png" width="110" alt="worried"> |
| `idle` | `smile` | `happy` | `excited` | `thinking` | `surprised` | `worried` |
| <img src="design/torty/full/sad.png" width="110" alt="sad"> | <img src="design/torty/full/confused.png" width="110" alt="confused"> | <img src="design/torty/full/shy.png" width="110" alt="shy"> | <img src="design/torty/full/wink.png" width="110" alt="wink"> | <img src="design/torty/full/determined.png" width="110" alt="determined"> | <img src="design/torty/full/sleeping.png" width="110" alt="sleeping"> |  |
| `sad` | `confused` | `shy` | `wink` | `determined` | `sleeping` |  |

**Peeks, bottom-left corner** (`design/torty/peek-left/`)

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| <img src="design/torty/peek-left/idle.png" width="110" alt="idle"> | <img src="design/torty/peek-left/smile.png" width="110" alt="smile"> | <img src="design/torty/peek-left/happy.png" width="110" alt="happy"> | <img src="design/torty/peek-left/excited.png" width="110" alt="excited"> | <img src="design/torty/peek-left/thinking.png" width="110" alt="thinking"> | <img src="design/torty/peek-left/surprised.png" width="110" alt="surprised"> |
| `idle` | `smile` | `happy` | `excited` | `thinking` | `surprised` |
| <img src="design/torty/peek-left/worried.png" width="110" alt="worried"> | <img src="design/torty/peek-left/sad.png" width="110" alt="sad"> | <img src="design/torty/peek-left/confused.png" width="110" alt="confused"> | <img src="design/torty/peek-left/shy.png" width="110" alt="shy"> | <img src="design/torty/peek-left/wink.png" width="110" alt="wink"> | <img src="design/torty/peek-left/determined.png" width="110" alt="determined"> |
| `worried` | `sad` | `confused` | `shy` | `wink` | `determined` |

**Peeks, bottom-right corner** (`design/torty/peek-right/`)

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| <img src="design/torty/peek-right/idle.png" width="110" alt="idle"> | <img src="design/torty/peek-right/smile.png" width="110" alt="smile"> | <img src="design/torty/peek-right/happy.png" width="110" alt="happy"> | <img src="design/torty/peek-right/excited.png" width="110" alt="excited"> | <img src="design/torty/peek-right/thinking.png" width="110" alt="thinking"> | <img src="design/torty/peek-right/surprised.png" width="110" alt="surprised"> |
| `idle` | `smile` | `happy` | `excited` | `thinking` | `surprised` |
| <img src="design/torty/peek-right/worried.png" width="110" alt="worried"> | <img src="design/torty/peek-right/sad.png" width="110" alt="sad"> | <img src="design/torty/peek-right/confused.png" width="110" alt="confused"> | <img src="design/torty/peek-right/shy.png" width="110" alt="shy"> | <img src="design/torty/peek-right/wink.png" width="110" alt="wink"> | <img src="design/torty/peek-right/determined.png" width="110" alt="determined"> |
| `worried` | `sad` | `confused` | `shy` | `wink` | `determined` |

The whole set on one page: `design/torty/torty-poses-sheet.png`.

**Where he goes**

- **With a phone, or on P and T slides, he only peeks** from the **bottom-left or bottom-right corner**. The peek shows his head, arms and shell down to the hips, with a flat cut at the frame edge. It's 490 px tall, centred 150 px from the side, sinks 30 px below the frame and tilts 10° toward the centre.
- On phone slides he is **in front of the phone's bottom corner**. **Put him on the side away from the action:** nothing being tapped or explained may sit in his zone (about 330 × 470 px in that corner). For example, a tap on Home (bottom-left) means he peeks from the right. If the element spans both bottom corners (a full-width row or banner near the bottom), leave the peek out of that slide.
- **Full-body Torty only on F1/F2.** He is never full-body next to a phone, and never behind it.

**Which pose**

| Moment | Pose |
|---|---|
| Problem question, something went wrong | `worried`, `confused` or `sad` |
| Explaining, pointing out where to look | `thinking` or `smile` |
| Neutral, just keeping company | `idle` |
| Something unexpected appears on screen | `surprised` |
| Success, reward, goal reached | `excited` or `happy` |
| Tip or shortcut, closing line | `wink` |
| "Let's do it", before the steps | `determined` |
| "Oops", a small user mistake | `shy` |
| App closed or asleep in the background, steps not counted overnight | `sleeping` (full Torty only) |

- Change his pose only on a new slide or a new voiceover sentence, at most once per slide.
- **Speech bubble:** not in v1. We'll decide once the final peek art is in.

## 5. Annotations (K1–K8)
These are the only annotations, with at most one per moment.

| Code | Annotation | Use for | Sound |
|---|---|---|---|
| K1 | **Tap**: arrow cursor glides in (18 f), presses to 0.84, ripple | Every tap | tap |
| K2 | **Long press**: the ripple holds for 20 f | Press-and-hold actions | tap |
| K3 | **Swipe**: a short trail along the gesture (16 f) | Pull to refresh, scrolling | — |
| K4 | **Highlight ring**: mint ring with a deep outline and a soft glow, pulsing 3% | "Look here" on a small element | focus |
| K5 | **Spotlight**: everything else dims to 62%, with a mint outline on the element | "Look here" on a card or row | focus |
| K6 | **Label tooltip (dark)**: ink pill with white text and a tail pointing down | Naming an element, max 2 words | focus |
| K7 | **Success**: success screen plus 60 confetti pieces | The task is done | success |
| K8 | **Torty hand tap**: his hand flies in at 38° (230 px), presses to 0.92, leaves | Torty's own tap, instead of the cursor; once or twice per video | tap |

| K1 | K2 | K3 | K4 |
| --- | --- | --- | --- |
| <img src="design/layouts/K1-tap.png" width="140" alt="K1-tap"> | <img src="design/layouts/K2-long-press.png" width="140" alt="K2-long-press"> | <img src="design/layouts/K3-swipe.png" width="140" alt="K3-swipe"> | <img src="design/layouts/K4-highlight-ring.png" width="140" alt="K4-highlight-ring"> |

| K5 | K6 | K7 | K8 |
| --- | --- | --- | --- |
| <img src="design/layouts/K5-spotlight.png" width="140" alt="K5-spotlight"> | <img src="design/layouts/K6-label-tooltip.png" width="140" alt="K6-label-tooltip"> | <img src="design/layouts/K7-success.png" width="140" alt="K7-success"> | <img src="design/layouts/K8-torty-hand-tap.png" width="140" alt="K8-torty-hand-tap"> |

## 6. On-screen text
- **Minimal.** The voiceover carries the detail. There are no captions, step chips or sentences on screen.
- **Always centred, always in the fixed slots** from section 3. Text is never left-aligned beside the phone.
- **Headline:** one line of 2–4 words, mint, with **one** accent word in white.
- **Full Torty text:** up to 5 words over at most 2 lines. **List items:** up to 3 words each.
- Product words stay in English: Koshiqa, Google Fit, koins, app.

## 7. Motion
- **Slide change:** the new slide slides in 100 px from the right over 11 f. There are no other transition types.
- **Phone:** rises 60 px on a spring when a slide starts. Torty's peek rises from below 6 f later and bobs gently (4 px).
- **Lists:** items pop in with the voiceover, 0.6 s apart by default.
- **Close-ups:** use S3/S4 instead of a camera zoom.
- Exact springs and timings are in `motion` in the YAML block.

## 8. Audio
- **SFX:** the Soft UI pack (`public/sfx/packs/soft`), at the levels in the YAML block. The voiceover is always the loudest track, and no SFX lands on a stressed word.
- **Music:** none in v1.

## 9. Don'ts
Each line here is a mistake from an earlier draft.
- ❌ The phone off-centre, or shrunk to make room for Torty.
- ❌ Full-body Torty on a slide with a phone.
- ❌ Torty behind the phone, or peeking from the left or right edges (side peeks are retired).
- ❌ Torty covering the element being tapped or explained. Switch him to the other corner.
- ❌ Left-aligned or wandering text. Everything is centred in the fixed slots.
- ❌ More than 4 words in a headline, captions, chips, or explanatory sentences on screen.
- ❌ Step lists or pointers drawn over the app UI. They get their own full-screen slide (P/T1).
- ❌ Arrow animations, callout badges with lines into the screen, or dotted red circles or rectangles.
- ❌ A light tooltip. It disappears against the UI and the green.
- ❌ Big empty areas of green. If a slide feels empty, it's the wrong layout.
- ❌ Video colours inside the phone UI, or fake third-party logos in mockups.
- ❌ Videos over 45 s.

## 10. Open items
- [ ] Separate high-res Torty PNGs, about 1500 px tall. The sheet cuts are upscaled 4× and look a little soft (`torty-requests.md`).
- [ ] A flat-style pointing hand for K8. It currently uses the older 3D hand.
- [ ] A waving pose for F2 closings. `wink` stands in for now.
- [ ] Speech bubble: yes or no, once the peek art is final.
- [ ] Voiceover language and voice: Hindi, English or both.
- [ ] Real app screen recordings to replace the mockups.

## Changelog
| Version | Date | Change | Why |
|---|---|---|---|
| 1.1 | 2026-10-29 | Real screenshots from storyboards (status bar replaced); when to use T1/T2 vs S2; longer walkthroughs allowed | First storyboard-driven video (How to Start Steps: 8 sections, 2 min) |
| 1.0 | 2026-10-28 | Rewritten around the approved layout system: S1–S4, F1–F2, P1–P2, T1–T2 and K1–K8; flat-style Torty with corner peeks overlapping the phone | Review of the v3 layouts: cut down to a small reusable set, maximise the phone, one peek style |
| 0.x | 2026-10-21 → 27 | Exploration: 5 style directions, Hindi test, 3D Torty cutouts, layout catalogue v1–v3 | Kept in `assets-src/design.v0-notes.md` |
