# Koshiqa help videos: project context

## What this is
We make short vertical help videos (1080×1920, 30 fps) for the Koshiqa app (a 10K-steps contest app; mascot: Torty the turtle) with Claude + Remotion.
- **Repo (source of truth):** github.com/koshiqa-ai/Video-automation-koshiqa. Always `git pull` first.
- **Skill:** use `koshiqa-help-video` for every video. It covers type → storyboard → spec → voice → render → QA → log.
- **Read before any work:** `design.md` (all layout rules), `CLAUDE.md` (commands, voice workflow, sandbox limits), and the latest entries of `revisions.md` (what was done and why, per video).

## Video types (pick one per video; never mix)
- **Walkthrough:** how to do one task, from a screen recording. 30–40 s.
- **FAQ:** 5–6 quick Q&As in one video. 45–90 s.
- **Explainer:** a feature's what and why, with motion scenes. 40–75 s.

## Process
Script + screen recording → classify type → storyboard HTML (team reviews) → video spec (`src/videos/<name>.ts`) → voiceover → render (with the soft music bed) → QA sheet → log in `revisions.md` → commit and push → send MP4 + QA sheet.

## Rules that always apply
- **Layouts:** only the layouts in design.md. Phone always centred at full size. Torty peeks from a bottom corner (full-body Torty only on the opening/closing cards). Minimal, centred on-screen text, one line per headline.
- **Facts:** never invent them. The script's wording is kept word for word; on-screen labels may be shortened to fit.
- **Privacy:** blur member names, photos, emails and phone numbers in screenshots.
- **Screenshots:** clean every one (remove the screen recorder's floating tab by its exact shape, no smears, no mid-scroll slivers). Zoom in on the top and left edges before rendering.
- **Change log:** log every edit at the top of `revisions.md`. Reviewer mistakes go into design.md's Don'ts.
- **Hindi versions:** a separate spec (`…-HI`), built from the English slides, in conversational Hinglish written in Hindi script. App words (steps, Rest Card, contest, streak, deficit) stay in English; app screens and quoted messages stay English. A native speaker checks the translation before the voice is made.

## Voiceover (ElevenLabs)
- **Credits:** generate ONCE per script, ONE take. Never retry or try other voices without asking; it wastes credits.
- **Voice (English):** Tara – Polished Audio Description (`nF5xXwlriNhsorW8Fykg`), eleven_v4, **stability 0**. Hindi voice not chosen yet.
- **Model:** eleven_v4. Expressiveness = lower Stability (~30–40) + audio tags like `[warm]` or `[curious]` in the ElevenLabs text (tags are not added to the spec's lines).
- **Getting the audio in:** the cloud workspace can't download from ElevenLabs. Generate the full script once (via the ElevenLabs connector or the ElevenLabs website), then the team downloads the take and attaches it to the chat. Claude splits it per slide (by transcript if needed) and levels it to −16 LUFS.
- **Placeholder:** Piper is only for drafts; always say when a render uses it.

## Videos so far
1. **Video 1 · "What is a Rest Card? Why did we build it?"** (explainer, v2 after the 2026-11-18 review)
   - English: `HV-RestCard`, `src/videos/rest-card.ts`, 78 s, 10 slides, placeholder voice.
   - Hindi: `HV-RestCard-HI`, `rest-card-hi.ts`, 111 s, ElevenLabs Hindi clips plus 2 placeholder lines.
   - Now only: why you need it → why we built it (the member-message chat) → what it does (lift to 10K, C5 bar 4,200 + 5,800 = 10,000).
   - The do's & don'ts part (deficit, club, contest vs streak, streak minimum, streak broken) moved out (`MOVED_TO_DOS_AND_DONTS`) for a future video.
   - **Open questions:**
     - Voice choice.
     - Heart-hands Torty art.
     - A real green 10K+ calendar screenshot (the current one is illustrative).
     - Approval of the opener line.
     - Whether the "sustainable, not stressful" ending stays.
     - The member's real words and consent.
2. **Video 2 · "When should you use your Rest Card?"** (explainer)
   - `HV-RestCardWhen`, `rest-card-when.ts`, 76 s, 12 slides (F1 intro, E3 sections, E12, C5, zoom + circle, E13), Tara voice.
   - Objective: when to use the card, when to save it, and the current limit on planning rest days.
   - Recordings: IMG_7239 (no benefit) and IMG_7240 (small benefit).
   - The 4,200 + 5,800 = 10,000 example is Video 1's C5 bar build-up (held 10 s).
   - **Open questions:** the "Smaller deficit" slide reuses Video 1's impact screen; is the "Plan ahead? Soon" headline OK, or use "Past days only"; Hindi version not started.
3. **Video 3 · "How to use your Rest Card"** (walkthrough)
   - `HV-RestCardHowTo`. Status: storyboard for review (`storyboards/HV-RestCardHowTo.html`, 10 beats, 2026-11-25). Voice: Tara, stability 0, one take after approval.
   - Objective: a clear step-by-step walkthrough of using a Rest Card. Recording: IMG_7241.
   - Steps: Power cards → select the Rest Card → check the potential impact → Apply → (low benefit / no benefit) → Koshiqa finds the lowest day → day 22 lifts to 10,000.
   - Uses Video 1's calendar and Power card mockups and Video 2's low-benefit and no-benefit screens.
   - **Open questions:** the script jumps from Step 3 to Step 5 ("Step 4" proposed); about 70 s, over the walkthrough guideline (about 53 s without the low-benefit slides, which repeat Video 2); whether to show the "Applied successfully" toast.
4. **Video 4 · "What if your best day counted twice?"** (explainer, Booster Card)
   - `HV-BoosterCard`, `src/videos/booster-card.ts`, 82 s, 12 slides (gold Day 40 intro, E14, E5, E12, C5, C3, 3 phone slides), Tara voice (one take, 2026-11-25; split by Whisper transcript, `scripts/prep-booster-card-vo.py`).
   - Recordings: IMG_7404 (Booster: Power card, Booster screen, apply on Nov 13, Day 40 = 30,000) and IMG_7406 (Capping Card).
   - Examples: C5 bar 15,000 counted + 15,000 boost = 30,000; deficit 10,000 → adds 10,000.
   - **Open questions:** "Pick your best one" vs the app's "finds your best day automatically"; length over 75 s; voiced E3 section cards or not.

## Suggested threads
One thread per video (English + Hindi together), plus one "system" thread for changes to templates, Torty, design rules, music or the skill.
