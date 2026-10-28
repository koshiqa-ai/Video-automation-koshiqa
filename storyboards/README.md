# Storyboards: screen recording → reviewed storyboard → video

A help video starts from a **screen recording** of the flow in the real app, plus a draft script. Claude turns the recording into a **storyboard HTML**: one beat per screen with its screenshot, its on-screen card text and its voiceover line. The team reviews and edits that page; once it's approved, the video is built from it with `design.md` and Remotion.

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
