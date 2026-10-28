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

## 2026-10-29 · system · Script-to-video pipeline + Help Video skill
- **Asked:** a skill that makes help videos from `design.md` and the Remotion project, plus this revisions log.
- **Changed:** added `src/videos/` (spec types, builder, registry, `SCREENS.md`, example `join-contest.ts`), `src/HelpVideo.tsx`, `scripts/help-video-vo.ts`, `scripts/help-video-qa.ts`, `scripts/qa-sheet.py`. `src/LayoutSystem.tsx`: code tags can be turned off and annotation timing (`anno.at`) is configurable. `src/data/layout-system.ts`: sound cues shared via `cuesFor()`. Registered help videos in `Root.tsx`.
- **Why / decisions:** a video is a list of design.md layout codes, so the skill can't invent layouts. Slide length = 0.35 s lead + voiceover + 0.45 s tail. The example's success beat moved from S3 to S2 because S3 crops the top of the screen where "You're in!" appears (caught by the QA sheet).
- **Output:** `HV-JoinContest` (25 s, placeholder Piper English VO).

## 2026-10-29 · system · Initial baseline
- **Changed:** design system v1.0 (`design.md` + `design/`), approved layout system, flat Torty, Soft UI SFX, earlier explorations kept for reference.
