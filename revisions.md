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

## 2026-10-29 · HV-RedeemKoins · Demo video from design.md + coded mockups
- **Asked:** "using /koshiqa-help-video and design.md make a demo video" (no recording attached).
- **Changed:**
  - New `src/videos/redeem-koins.ts` ("How do I redeem my koins?"), registered in `src/videos/index.ts`.
  - `src/videos/build.ts` + `src/data/layout-system.ts`: coded-mockup taps can now use `atWord` too (was screenshots only), so taps follow the real VO once it arrives.
  - `src/videos/vo-durations.json`: `HV-RedeemKoins` has **estimated** line lengths (2.7 words/s, no files). `npm run vo -- HV-RedeemKoins` replaces them once the team's clips are in `public/vo/HV-RedeemKoins/`.
- **Why / decisions:**
  - No recording, so this is a demo on the coded koins mockups (design.md §3 allows mockups for demos). Flow: F1 → T1 → T2 ×3 → S2 success (K7) → P2 tips → F2; 3 steps, so T1/T2 per design.md §2.
  - Slide 5 has no peek: Redeem is a full-width bottom button (spans both corners). Other peeks sit opposite the tapped element.
  - P2 item pop times (0.5 / 2.9 / 5.4 s) are set from the estimated line; re-check them against the real VO.
  - No voice: Piper and its model aren't reachable from the cloud sandbox, so the render has SFX only, paced to the script.
  - Mockup copy (₹100 Amazon Pay, "valid 12 months", "saved in My Rewards") is demo data; confirm before a real version.
- **Output:** `out/HV-RedeemKoins.mp4` (37.9 s, SFX only), `out/HV-RedeemKoins-qa.png`. QA: all 8 slides are design.md layouts, headlines fit one line, taps land on the chip / first reward / Redeem, Torty never covers a tap.

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
