# Storyboards: screen recording → reviewed storyboard → video

A help video starts from a **screen recording** of the flow in the real app, plus a draft script. Claude turns the recording into a **storyboard HTML**: one beat per screen with its screenshot, its on-screen card text and its voiceover line. The team reviews and edits that page; once it's approved, the video is built from it with `design.md` and Remotion.

## 0. The recording
Recordings follow `storyboards/RECORDING-GUIDE.md` (shared with the person recording) and arrive with a notes file (`<name>.txt`): steps with rough times, the important points, mistakes to skip and private info to blur. Read the notes before picking frames.

## 1. Recording → candidate screens
```bash
python3 scripts/recording-frames.py recordings/<name>.mp4 work/<id>
```
This keeps every distinct screen that settles for at least 0.4 s and writes `work/<id>/frames-sheet.png` (numbered, with timestamps). If a screen is missing, lower `--change` (default 3.0); for too many near-duplicates, raise it.

## 2. Pick, clean, describe
- Pick one frame per beat: the moment **before** the tap, so the button is visible.
- Redact anything personal (names, emails, phone numbers, avatars): `python3 scripts/redact.py in.png out.png x,y,w,h …`
- Write `work/<id>/storyboard.json` (format below): sections, card text (2–4 words), voiceover line, and flags for anything the reviewers must decide.

## 3. Storyboard HTML for review
```bash
python3 scripts/make-storyboard.py work/<id>/storyboard.json storyboards/<id>.html
```
This produces the same page format as the approved reference: screenshots, cards, voiceover, "was / why" edit trail, flags, a read-through and download buttons. Reviewers edit the script there (or send notes), and Claude updates the JSON and regenerates.

## 4. Approved storyboard → video
```bash
python3 -I scripts/storyboard-import.py storyboards/<id>.html HV-<Name>
```
This writes `public/screens/HV-<Name>/NN.png` and `storyboards/HV-<Name>.json`. Claude then writes `src/videos/<name>.ts` from it, following `design.md` (see `src/videos/start-steps.ts`).

## FAQ storyboards
An FAQ video has no single recording to follow. Its input is the list of 5–6 questions with their answers (from the team, support chats or a brief), plus screenshots for the answers that need a screen. Its storyboard uses one `section` per question:
```json
{ "title": "Step sync: quick answers", "subtitle": "FAQ draft",
  "beats": [
    { "n": "card", "card": "Step sync questions?", "vo": "Got questions about step sync? Here are five quick answers." },
    { "n": "card", "section": "Q1 · How long does setup take?", "role": "question", "card": "How long does setup take?", "vo": "How long does setup take?" },
    { "n": "card", "section": "Q1 · How long does setup take?", "role": "answer", "card": "Under 2 minutes", "sub": "And you only do it once.", "vo": "Less than two minutes. And it's a one-time setup." },
    { "n": "card", "section": "Q2 · Where's my connected account?", "role": "question", "card": "Where's my connected account?", "vo": "…" },
    { "n": "#01", "section": "Q2 · Where's my connected account?", "card": "Right on Home", "vo": "…", "image": "frames/f_016.png" },
    { "n": "card", "card": "Happy walking!", "vo": "That's it. Happy walking!" }
  ] }
```
- `role: "question"` → layout **Q**; `role: "answer"` → layout **A** (`card` = the verdict, `sub` = the line under it); a screen beat → **S2**.
- Cards without a role are the opening (F1) and the closing (F2).
- Screenshots for FAQ answers can come from any recording that follows the guide, or from earlier storyboards' `public/screens/`.

## Explainer storyboards
Input: a feature brief + a draft script, and a screen recording for the "how" part. Each beat carries the planned scene in `layout` (C1–C4, E1–E14, S2, E9, E13, F1/F2), shown in the HTML as "layout E5" so reviewers see the plan:
```json
{ "title": "How steps get into Koshiqa", "type": "explainer",
  "beats": [
    { "n": "card", "layout": "F1", "card": "Where do steps come from?", "vo": "Ever wondered how your steps get into Koshiqa?" },
    { "n": "card", "section": "Why", "layout": "C4", "card": "Phone → Google Fit → Koshiqa", "vo": "Your phone counts every step…" },
    { "n": "card", "section": "Why", "layout": "E12", "card": "Three must-haves", "vo": "…" },
    { "n": "#01", "section": "How", "layout": "S2", "card": "Pick the same one", "vo": "…", "image": "frames/f_014.png" }
  ] }
```
Every storyboard also records its video `type` (walkthrough, faq or explainer); it shows at the top of the HTML and is read back by the importer.

## storyboard.json
```json
{ "title": "How to Start Steps", "subtitle": "Draft · from recording 2026-10-29",
  "beats": [
    { "n": "card", "card": "Connect Google Fit", "vo": "Getting your steps on Koshiqa is simple…" },
    { "n": "#01", "section": "Kick off", "card": "Tap Start My Steps", "vo": "Just open Koshiqa and tap “Start My Steps.”",
      "image": "frames/f_003.png", "flags": ["<b>UI copy</b> — the CTA should say “Count my Steps”."] },
    { "n": "#02", "section": "Kick off", "card": "…", "vo": "…", "image": "…", "was": "old line", "why": "reason for the change", "cut": false }
  ] }
```
- `n` is `"card"` for full-frame cards (they become F1/F2) or `#NN` for screen beats (they become phone slides).
- `section` groups beats under a numbered heading.
- `hold` (seconds) is optional; it is estimated from the voiceover at 150 wpm.
