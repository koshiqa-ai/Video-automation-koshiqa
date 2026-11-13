# Revisions

Claude adds an entry here after **every** edit to this repo: newest at the top, one entry per change set.

Entry format:

```
## YYYY-MM-DD · <video id or "system"> · <one-line summary>
- **Asked:** what the person asked for (their words, short)
- **Changed:** files and what changed in them
- **Why / decisions:** judgment calls made, and anything flagged
- **Output:** rendered files, QA sheet, open issues
```

---

## 2026-11-13 · system · FAQ video type approved and added to the skill
- **Asked:** add FAQ videos to the koshiqa-help-video skill. Explainer references are coming separately.
- **Changed:**
  - `design.md` 1.2 §11: FAQ approved (layouts Q, A, S2 answers; structure; how to choose a screen vs a text answer; writing and Torty rules; don'ts).
  - Storyboards support FAQ: `role` (question/answer) and `sub` on cards in `make-storyboard.py`, `storyboard-import.py` and `style.css`. Card beats now get their section headers.
  - `storyboards/README.md` has an FAQ section; `CLAUDE.md` lists the three video types.
  - Skill updated (proposed to the user) with an FAQ path.
- **Why / decisions:**
  - FAQ input = a question list + answers (+ screenshots for screen answers), not one recording. The storyboard groups each Q with its answer.
  - Tested: the FAQ storyboard round trip (JSON → HTML → JSON) keeps roles, subs and sections; the walkthrough reference still imports identically.
- **Output:** none rendered (layouts unchanged since the approved demo).

## 2026-11-11 · system · FAQ and explainer lengths confirmed
- **Asked:** confirmed FAQ length 45–90 s and explainer length 40–75 s; extra explainer scene types will come in one message.
- **Changed:** `design.md` §11 notes the confirmed lengths. Layouts stay in draft until the scene list arrives.
- **Why / decisions:** none.
- **Output:** none.

## 2026-11-11 · system + HV-StepsFAQ + HV-HowStepsSync · Drafts for video types 2 (FAQ) and 3 (explainer)
- **Asked:** finalise video types 2 (FAQ: 5–6 small questions) and 3 (explainer: a feature). Decisions:
  - FAQ: one video only, each answer either a screen or a text answer, per question.
  - Explainer: built from a recording + feature brief + script, with more motion graphics.
- **Changed:**
  - New layouts in `src/TypeLayouts.tsx`: Q (question card), A (answer card), C1 big number, C2 trio, C3 compare, C4 flow. Geometry in `LS` (`src/data/layout-system.ts`), sound cues added.
  - Spec `type` (walkthrough/faq/explainer) and codes Q, A, C1–C4 in `src/videos/types.ts` and `build.ts`. Q numbering is automatic; concept items sync to `atWord`.
  - New icons: x, heart, refresh, clock, question.
  - Demos: `src/videos/steps-faq.ts`, `src/videos/how-steps-sync.ts`.
  - `design.md` §11 drafted (pending approval); review grid at `design/video-types-grid.png`.
- **Why / decisions:**
  - Every fact in both demos comes from the approved HV-StartSteps storyboard; screens reuse its screenshots.
  - QA caught a wrapped verdict overlapping its sub line (the verdict now auto-fits one line), content sitting too high on the Q and concept slides, and flow labels clashing with the peek. All fixed.
  - The Google Fit node uses a generic heart icon (no third-party logos).
- **Output:** `HV-StepsFAQ` (48.5 s), `HV-HowStepsSync` (37.3 s), both with placeholder Piper VO; QA sheets in `out/`.

## 2026-10-29 · system · Screen recording guidelines
- **Asked:** a guidelines file for the person doing the screen recordings, so recordings convert cleanly into storyboard HTML.
- **Changed:** added `storyboards/RECORDING-GUIDE.md` (setup, pace, privacy, file naming and delivery, notes template, checklist, plus a short "for Claude" section mapping it to the pipeline). `storyboards/README.md` now starts from the recording + notes file. The shareable version is a Claude doc: https://claude.ai/artifact/NCf2fGEejGoazPQte1bLvP
- **Why / decisions:**
  - A 2 s pause per screen matches the frame extractor's "settled screen" rule and gives a clean pre-tap frame.
  - "Show taps" (Android) marks the tap targets.
  - Delivery via Drive, not WhatsApp, which compresses the video.
  - The notes file seeds sections, lines, skips and redactions.
- **Output:** the guide (doc + repo copy).

## 2026-10-29 · HV-StartSteps + system · Storyboard-driven videos with real screenshots
- **Asked:** the flow is screen recording → HTML storyboard with screenshots (reference: "How to Start Steps") → design.md layouts → Remotion video; voiceover comes from the team.
- **Changed:**
  - Phone can show real screenshots (`screen: { image, w, h, taps }`, taps in image px; `atWord` syncs a tap or annotation to a spoken word). The recording's status bar and red timer are replaced by a clean 9:41 bar.
  - New scripts: `recording-frames.py` (distinct screens from a recording), `redact.py`, `make-storyboard.py` (review HTML in the reference format), `storyboard-import.py` (HTML → screenshots + JSON), `vo-split.py` (one full VO file → one clip per slide).
  - New video `src/videos/start-steps.ts` from the imported storyboard; `storyboards/README.md`.
  - `design.md` 1.1: real screenshots, T1/T2 only for 2–3 steps (S2 + card headline otherwise), longer walkthroughs allowed, no peek when the target spans both bottom corners.
- **Why / decisions:**
  - No T1/T2: the storyboard has 8 sections and no line for a steps list.
  - Beat #04's line said "jump to row #15" (flagged in the storyboard). Placeholder wording: "…just open it and skip ahead to connecting Koshiqa." **Needs the team's final line.**
  - Beat #11 stays cut. Slide 16 has no peek (the highlighted email row spans both corners).
  - Runtime 1:46 with placeholder VO: longer than the 30–40 s guideline, kept as an approved setup walkthrough.
  - Tested: recording-frames found all 16 screens in a rebuilt recording; vo-split cut a 17-line VO correctly; the storyboard round trip (JSON → HTML → JSON) is lossless.
- **Output:** `out/HV-StartSteps.mp4` (placeholder Piper VO), `out/HV-StartSteps-qa.png`. Open: UI-copy flags #01/#03 are for the app team.

## 2026-10-29 · system · Script-to-video pipeline + Help Video skill
- **Asked:** a skill that makes help videos from `design.md` and the Remotion project, plus this revisions log.
- **Changed:** added `src/videos/` (spec types, builder, registry, `SCREENS.md`, example `join-contest.ts`), `src/HelpVideo.tsx`, `scripts/help-video-vo.ts`, `scripts/help-video-qa.ts`, `scripts/qa-sheet.py`. `src/LayoutSystem.tsx`: code tags can be turned off and annotation timing (`anno.at`) is configurable. `src/data/layout-system.ts`: sound cues shared via `cuesFor()`. Registered help videos in `Root.tsx`.
- **Why / decisions:** a video is a list of design.md layout codes, so the skill can't invent layouts. Slide length = 0.35 s lead + voiceover + 0.45 s tail. The example's success beat moved from S3 to S2 because S3 crops the top of the screen where "You're in!" appears (caught by the QA sheet).
- **Output:** `HV-JoinContest` (25 s, placeholder Piper English VO).

## 2026-10-29 · system · Initial baseline
- **Changed:** design system v1.0 (`design.md` + `design/`), approved layout system, flat Torty, Soft UI SFX, earlier explorations kept for reference.
