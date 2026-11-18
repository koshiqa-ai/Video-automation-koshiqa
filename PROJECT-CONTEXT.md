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
- **Voice choice is pending:** we didn't like Monika Sogam. We're comparing Mona (Option 1), Riya Rao (Option 2) and Tara (Option 3) in `out/voice-sample.mp4`. Once chosen, put its ID in `src/data/voices.json` (still set to Monika) and use only that voice.
- **Model:** eleven_v4. Expressiveness = lower Stability (~30–40) + audio tags like `[warm]` or `[curious]` in the ElevenLabs text (tags are not added to the spec's lines).
- **Getting the audio in:** the cloud workspace can't download from ElevenLabs. Generate the full script once (via the ElevenLabs connector or the ElevenLabs website), then the team downloads the take and attaches it to the chat. Claude splits it per slide (by transcript if needed) and levels it to −16 LUFS.
- **Placeholder:** Piper is only for drafts; always say when a render uses it.

## Videos so far
1. **Video 1 · "What is a Rest Card? Why did we build it?"** (explainer)
   - English: `HV-RestCard`, `src/videos/rest-card.ts`, ~99 s, placeholder voice.
   - Hindi: `HV-RestCard-HI`, `rest-card-hi.ts`, ~138 s, team's ElevenLabs Hindi recording.
   - Includes the member-message chat screen (her messages on the left, Koshiqa's 💚 reply on the right) and the day-22 calendar going from 4,200 to 10,000.
   - **The team has changes to make to this video.**
   - **Open questions:** the member's real words and consent for the chat; does a 3,500-step day still get lifted for the contest; what makes a day "eligible"; the club line shown on screen; a Koshiqa logo end card (no layout for it yet); length is over the 75 s guideline.
2. **Video 2 · "When should you use your Rest Card?"** (explainer)
   - `HV-RestCardWhen`, `rest-card-when.ts`, 63 s draft, placeholder voice.
   - Objective: when to use the card, when to save it, and the current limit on planning rest days.
   - Recordings: IMG_7239 (no benefit) and IMG_7240 (small benefit).
   - **Waiting for:** the chosen voice's full take.
   - **Open questions:** the 4,200 example reuses Video 1's screens; is the "Plan ahead? Soon" headline OK, or use "Past days only".

## Suggested threads
One thread per video (English + Hindi together), plus one "system" thread for changes to templates, Torty, design rules, music or the skill.
