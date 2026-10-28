# Koshiqa FAQ videos: design.md (v0, pre-lock)

This is a draft for the **Visual Style v1** review. The shared system below holds for every video. The five directions differ only in their *skin* (palette, type, layout). After the team picks a direction, delete the other four and this file becomes the locked design.md.

## Format
- 1080 × 1920 (9:16), 30 fps, 30–40 s, English.
- Safe area: keep key text at least 80 px from the sides and at least 100 px from the top and bottom.
- Minimum type sizes: headline 84 px, supporting/caption text 38 px.

## Structure (every video)
| Beat | Length | What happens |
|---|---|---|
| **Hook** | ~5.5 s | Front-slide layout: Koshiqa FAQ chip, a card with Torty (sad or surprised), and floating "?" marks. The question is the headline, with the spoken caption below it. |
| **Steps ×3** | ~7 s each | The phone stays on screen across all steps, and the screen cross-slides between them. Each step has a "Step n of 3" chip, a short imperative headline, and the spoken caption. A cursor glides to the target and taps. |
| **Outro** | ~6 s | Torty is happy, with a confetti burst and a short payoff headline. The logo lockup reads "Koshiqa · More answers in Help & Support". |

All timing comes from `src/data/timeline.ts`: each scene lasts as long as its voiceover plus padding, never less than the minimum. Video and audio both read that same timeline.

## Tap language (from the FigJam notes)
- An arrow cursor moves in from the lower right and eases to each target.
- **On tap:**
  - The arrow presses down (scale 0.84).
  - A low-opacity filled circle (~30%) pops out from the arrow tip with a slight overshoot.
  - A thin ring expands outwards and fades within about 0.7 s.
  - A soft "tock" sound plays.
- The tapped element itself shrinks to 0.95 and springs back, so the UI visibly reacts.
- Swipes leave a short gradient trail.

## Torty rules (first pass)
| Moment | Expression | Placement |
|---|---|---|
| Hook, problem/frustration questions | Sad | Standing in the front-slide card |
| Hook, "how do I…" questions | Surprised | Standing in the front-slide card |
| Steps (Volt and Sky only) | Surprised, switching to happy after the last tap | Peeking from behind the phone's right edge |
| Outro | Happy | Centre stage, with confetti |

Torty never covers a tap target or the headline.

## Torty (cutouts)
- **Source:** the designers' cutout PNGs in `public/torty/cutouts/`. There are 8 poses: worried, curious, happy, celebrate, point-curious, point-happy, thumbs-up and wave.
- **Prep:** `scripts/prep-torty-cutouts.py <folder>` removes stray specks, measures the centre of his feet for each pose and writes `src/torty/cutouts.json`. Re-run it whenever the art changes.
- **Anchoring:** every pose is anchored at his feet, so swapping poses never makes him jump. Scenes ask for a *mood* plus an optional *gesture*, and `poseFor()` picks the cutout.
- **Motion:**
  - A pop when his pose changes.
  - A subtle squash-and-bounce driven by voiceover loudness while he narrates (`scripts/voice-envelope.py`).
  - A gentle sway on the wave.
  - The art has no mouth or eye layers, so there is no lip-sync or blinking. Both are possible later if mouth and eye layers are provided.
- **Placement:** see "Layout system (v4)". He peeks from the bottom corners with a phone, and appears full-body only on the F slides.
- **When to gesture:**
  - Point while the voiceover explains what to tap.
  - Thumbs-up right after a fix.
  - Worried pose plus a speech bubble for warnings.
  - Wave on the outro.
- **Review sheet:** the `TortyShowcase` composition.
- `assets-src/torty-vector/` keeps the earlier flat vector art for reference. It isn't used.

## Layout system (v4, pending approval)
Source of truth for every number below: `src/data/layout-system.ts` (`LS`, `phoneGeo`, `headlineTop`). Review grid: `LayoutSystem` composition.
Frame 1080 × 1920. Phone = 414 × 868 at scale 1 (bezel included), always horizontally centred.

**Torty**
- **Art style: flat (from the expression sheet, `assets-src/torty-flat/expression-sheet.png`).** There are 13 poses in `public/torty/flat/`: idle, smile, happy, excited, thinking, surprised, worried, sad, confused, shy, wink, determined, sleeping. Re-cut them with `scripts/extract-torty-flat.py`.
- With a phone, or on pointer and steps slides, Torty only **peeks from the bottom-left or bottom-right corner**. On phone slides he **overlaps the phone's bottom corner, in front of it**, so the phone keeps its full size. Peek on the side away from the action: nothing being tapped or explained may sit in his corner zone (about 330 × 470 px). The peek shows his head, arms and shell down to the hips, with a flat cut at the frame edge. There are 12 expressions, each in a left and a right version, in `public/torty/peek-flat/` (`scripts/make-torty-peek-flat.py`). The peek is 490 px tall, its centre sits 150 px from the side, the cut edge sinks 30 px below the frame, it tilts 10° toward the centre, and it rises in on a spring.
- Full-body Torty appears only on F1/F2 (no phone), with his body always 1000 px tall (sparkles and other marks sit outside that).
- Side peeks are retired (they forced the phone to shrink).

**Phone layouts** (T = with peek, N = no Torty)
| Code | Layout | Phone (with peek: Torty overlaps the bottom corner) | Phone (no Torty) | Headline |
|---|---|---|---|---|
| S1 | Phone only | top 70, scale 2.05 (ends 1850) | same | none |
| S2 | Phone + headline | top 230, scale 1.866 | same | top 80 |
| S3 | Close-up (bottom of screen) + headline below | scale 2.3, phone ends 1300 (headline clears his head) | scale 2.3, ends 1480 | phone end + 90 |
| S4 | Close-up (top of screen) + headline | top 230, scale 2.3, runs off the bottom | same | top 80 |

**Other slides**
- **F1 / F2 (full Torty):** text block starts at 300 (F1) and Torty starts at 610; in F2, Torty starts at 300 and text at 1370. Torty is 1000 px in both, text 104 px.
- **P1 / P2 (pointers, full screen, no phone):** heading top 430 (104 px), list top 620, badge 140, text 70 px, row gap 64, max 4 points of 2–3 words. P1 uses mint circles with deep-green numbers; P2 uses cream circles with green line icons.
- **T1 (steps list):** same grid as pointers plus an eyebrow ("IN THIS VIDEO") at 350; white numbered circles joined by a line that grows as each step appears.
- **T2 (progress timeline):** sits in the headline slot of S2. It has dots of 76 px at x 220 / 540 / 860, y 96, with labels underneath (34 px). Done steps are mint with a tick, the current step is white and pops, and later steps are outlined.

**Text:** always centred, always in these fixed slots. Headline is 84 px, one line, 2–4 words.

**Annotations (K1–K8):** tap, long press, swipe, highlight ring, spotlight, dark label tooltip (ink `#0B2B22` pill, white text), success (tick + confetti), Torty hand tap. Not used: arrows, callout badges, dotted red marks, step lists drawn on the app UI, push-in zoom (not in the kept set). Torty speech bubble: decide once the peek pose is locked.

## Minimal on-screen text
- One short headline per slide, 2–4 words (e.g. "Tap Contests", "Pick a contest"). The voiceover carries the detail.
- No full spoken captions, step chips or explanatory sentences on screen.
- Some slides have no text at all, e.g. the phone-only slide, the pointer slides, and the intro and outro beyond their headline.
- The phone and Torty take up the space freed by removing text.

## Captions
- The spoken line sits under the headline.
- Words light up as the voice reaches them: 32% opacity before, 100% after.
- Captions use the same text as the voiceover.
- Pronunciation respellings (`src/data/pronunciation.json`) apply only to the voice, never to on-screen text.

## Five directions
| # | Name | Reference | Layout | Palette | Type |
|---|---|---|---|---|---|
| 1 | **Volt** | Ref 1, lime sport | Headline top, phone bottom (bleeds off) | Lime `#E4F95B`, ink `#11140A`, white highlight block | Inter Display Black / Inter |
| 2 | **Blush** | Ref 2, soft pink cards | Phone inside a white card, centred headline below | Pink `#F4B3B0`, ink `#2A1A1C`, orange accent `#FF6A3D` | Poppins Bold |
| 3 | **Aurora** | Ref 3, purple fintech | Headline top, tilted phone, glossy orbs | Indigo→violet gradient, lime accent `#D8FF5C` | Inter Display ExtraBold / Inter |
| 4 | **Midnight Mint** | Ref 4, teal on dark | Two phones: "You tap" → "You get" | Deep green `#0A2621`, mint `#2DE1B4` | TeX Gyre Adventor (caps) / Inter |
| 5 | **Sky** | Front-slide ref | Phone top, headline bottom-left, Torty peeking | Cyan gradient, Koshiqa blue `#075DC2` | Inter Display Black / Inter |

Inside the phone, the app mockups always use Koshiqa's own blue (`#075DC2`), whatever the video skin.

## Open items
- Real app recordings will replace the coded mockups. The screen components in `src/screens` are placeholders.
- Torty art: the designers' cutouts are now in use. For lip-sync, ask for mouth and eye layers.
- Voice: the Piper "lessac" US voice is a placeholder until the TTS milestone locks a voice that supports Hindi and English.
- SFX: the tap, swoosh, pop and chime sounds are synthesised placeholders.
