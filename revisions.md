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

## 2026-11-20 · HV-RestCard (EN) · Voice: Tara, stability 0
- **Asked:** replace the voice with "Tara – Polished Audio Description", stability 0%, through ElevenLabs.
- **Changed:**
  - Generated once (1 take, 1,164 credits) in ElevenLabs flow `Dz6Bnyq2uzZtpw0aO4hE`: a tts node, eleven_v4, voice `nF5xXwlriNhsorW8Fykg`, `voice_settings.stability = 0`.
  - The prompt is the 10 voiced lines of the current English spec, with a blank line between slides; the section cards are silent.
  - `voices.json` en = Tara, stability 0, eleven_v4. CLAUDE.md and PROJECT-CONTEXT.md updated.
- **Waiting for:** the team to download the take and attach it. The sandbox can't download from ElevenLabs.
- **Next:** split it per slide (by transcript if needed), level it to −16 LUFS, re-time and re-render.

## 2026-11-20 · HV-RestCard (English only) · Section cards + coded mockups
- **Asked:**
  - Split the video with cards like the first one ("Why we built it"…). English version only.
  - The recordings' black patch at the top looks bad: rebuild those screens in our mock layout.
- **Changed:**
  - Three silent F1 section cards (2.4 s each): "Why you need it" (worried), "Why we built it" (happy), "What it does" (excited, after "We built the Rest Card").
  - New coded mockups `src/screens/rest-card-screens.tsx`: `rest-calendar-top`, `rest-calendar` (day-22 lift via `props.liftAtWord`, confetti) and `power-card`. Clean and light, reusing the real Rest Card art and palm badge (`public/screens/HV-RestCard/art-*.png`).
  - They replace the screenshots on slides 3, 4, 8 and 10.
  - `zoom` reworked: the screen content zooms inside the phone, so the bezel no longer grows into a black band; annotations follow.
  - Mock screens accept `props`; `…AtWord` props resolve.
  - `voice-sample.ts` finds its slides by kind.
  - The Hindi spec skips the section cards and is unchanged (not re-rendered).
  - SCREENS.md, `design.md` 1.6.1 (section cards, zoom, a Don't).
- **Why:**
  - The team's structure.
  - The dark recording tops and the enlarged bezel read as a black patch.
- **Output:**
  - `out/HV-RestCard.mp4`: 85.6 s, 13 slides, placeholder voice.
  - QA sheet: all slides pass.

## 2026-11-18 · HV-RestCard (+ HI) · v2 after the team review (Swati, Mrinal)
- **Asked:** "do all these changes, and mention all", covering the 29 review comments on Video 1.
- **Structure:**
  - Video 1 is now only: why you need it (a missed day) → why we built it (the story) → what it does (lifts a day to 10K). It has 10 slides, 78 s (was 14 slides, 98.9 s).
  - Slides 9–12 (deficit/club, contest vs streak, streak minimum, streak broken) moved out for the how-to-apply / do's & don'ts video. They are kept in `rest-card.ts` as `MOVED_TO_DOS_AND_DONTS`, with their review notes.
- **Slide changes:**
  - **Opening:** a new voiced line naming the title and the payoff.
  - **Calendars:** realistic green 10K+ days and avg 12,347 (`scripts/green-calendar.py`, illustrative); day-22 cell redrawn square with the real palm badge; the tab's drop shadow removed.
  - **Day 22:** zoom in.
  - **"Built with feedback":** new line "Koshiqa is built with feedback from members like you"; heart icon; bigger text; Torty smile.
  - **"We built the Rest Card":** title first, then the phone (one focal point); the cut-off third card removed.
  - **Lift to 10,000:** confetti.
  - **Bonus steps:** the C1 number replaced by a new C5 bar build-up (4,200 actual + 5,800 bonus = 10,000, held 10 s).
  - **E14:** headline lines appear with the voice ("Sustainable," / "not stressful"); varied bar heights; the "Push. Rest. Repeat." line removed.
  - **Headlines:** aligned to the voiceover ("Showing up every day", "We built the Rest Card", "Lifts it to 10,000", "Adds 5,800 steps").
  - **Closing card:** breaks cleanly ("Every step / of the way").
- **System:**
  - Ambient motion on every slide (`Backdrop` glow drift + floating motes; phone float; E7 icon float; E14 breathing; C5 glow).
  - New C5 (`TypeLayouts` BarSlide, `LS.cBar`).
  - Phone `zoom`, `titleFirst`, `then.confetti`; E7 `icon` + per-line sizing; E14 `heights`, `lines`, `linesAtWords` (any `…AtWords` motion field resolves to seconds).
  - `design.md` 1.6, with 6 new Don'ts; `design/layouts/C5.png`; CLAUDE.md C1–C5.
- **Hindi:**
  - The spec mirrors v2.
  - ElevenLabs clips are renumbered (moved-out clips archived in `work/HV-RestCard-HI/vo-v1-moved-out/`).
  - The 2 new lines (opener, slide 4) use the Piper Hindi placeholder. 111.3 s.
- **Open (from the team):**
  - The voice choice (Mona / Riya Rao / Tara); then one ElevenLabs take each for English and Hindi.
  - Heart-hands Torty art.
  - A real green-calendar screenshot.
  - Approval of the opener line.
  - Whether the E14 "sustainable" point stays.
  - The member's real words and consent.
  - Hindi review of the two new lines.
- **Output:**
  - `out/HV-RestCard.mp4` (78.0 s) and `out/HV-RestCard-HI.mp4` (111.3 s).
  - QA sheets: every slide passes.
  - Storyboard `storyboards/HV-RestCard.html` (v2, with flags).

## 2026-11-18 · HV-RestCard · Swati's "few fixes here" (0:09)
- **Asked:** the team's review of Video 1, 15 comments from Swati and 14 from Mrinal (listed in chat). First, the annotated frame at 0:09: arrows at the top strip and the left edge of the calendar.
- **Found:**
  - The review was of an export from before the 2026-11-14 screen clean-up. That clean-up already fixed the top strip and the dark smear.
  - A grey shade down the left edge was still there: the recorder tab's soft drop shadow, which dims the page and card 9 (225 → 255 by x ≈ 120, fading by y ≈ 400).
- **Changed:**
  - `scripts/prep-rest-card-screens.py`: new `de_shadow` measures the shadow on plain page pixels against each row's page white, smooths it and divides it out. It is applied to 02 (and so 02b).
  - `design.md` 1.5.1: a Don't line.
- **Output:**
  - Still checked at 0:09: the page is clean white to the edge.
  - Full re-render waits for the rest of the review changes.

## 2026-11-18 · System · Project context file
- **Asked:** a file that sums up everything, to upload as context when setting up a project with one thread per video.
- **Changed:** new `PROJECT-CONTEXT.md` (what the project is, repo + skill, video types, process, standing rules, voice rules, status and open questions per video, suggested threads).
- **Output:** no video change. Keep `PROJECT-CONTEXT.md` up to date when a video's status or the chosen voice changes.

## 2026-11-17 · Voice comparison: Mona, Riya Rao, Tara
- **Asked:** the team doesn't like Monika Sogam. Make a sample video with three ElevenLabs voiceovers they generated, each after a 2 s black card "Option 1/2/3": Mona first, Riya Rao second, Tara third.
- **Changed:**
  - The samples (about 10 s each) all read Video 1's "At Koshiqa, we build our product with feedback from members like you. One day, a woman from our community sent us a message that really stayed with us." Confirmed by transcript.
  - Each is split at its pause into `public/vo/HV-VoiceSample-1..3/01–02.wav` and levelled to −16 LUFS with one fixed gain + limiter. The originals were −27.6, −22.3 and −27.9 LUFS.
  - Originals are kept in `work/voice-sample/`.
  - `src/videos/voice-sample.ts`: three specs that reuse Video 1's E7 and chat slides. The chat shows the first message at "sent us a message".
  - `scripts/voice-sample-reel.sh` joins them with the Option cards.
- **Why:** with equal loudness, the comparison is about the voice, not the volume. No ElevenLabs credits were used.
- **Output:** `out/voice-sample.mp4` (38.5 s).
- **Open:**
  - The chosen voice's ID goes into `voices.json` (currently Monika).
  - Video 2's voiceover is then generated once in that voice.

## 2026-11-17 · System · One ElevenLabs take per script
- **Asked:** "why you generated two voiceovers on elevenlabs?"
- **What happened:** two speech runs of the Video 2 script, about 4,000 credits in all:
  - the first in Esha, a voice I picked before the team said Monika Sogam
  - the second in Monika Sogam
  - each made 2 takes (the connector's default)
- **Changed:** CLAUDE.md now says to:
  - use the `voices.json` voice only
  - make one take (`generations_count: 1`) unless the team asks for options
  - ask before generating if no voice is set
- **Output:** no video change.

## 2026-11-17 · HV-RestCardWhen · Video 2: when to use / save your Rest Card (draft)
- **Asked:** Video 2 from the team's script and recordings IMG_7239 and IMG_7240. Objective: "Explain when to use the card, when to save it and clarify the current limitations around planning rest days." Voice: Monika Sogam on ElevenLabs.
- **Type:** explainer (rules and judgment, not a tap-by-tap task).
- **Changed:**
  - New `src/videos/rest-card-when.ts` (9 slides: F1, P2, S2 ×4, C3, S2, F2), registered in `index.ts`.
  - Screens `public/screens/HV-RestCardWhen/05, 06, 08`, made by `scripts/prep-rest-card-when-screens.py`. The recorder tab moves between frames, so it is found per frame and removed by its shape:
    - plain page: blended from clean rows above and below
    - over a card: the card's own right edge mirrored, brightness-matched
    - the "L" of "Lifts" is kept
  - Video 1's 02/02b/05 are reused for the 4,200 example.
  - `build.ts`: P1/P2/T1 rows honour `atWord`.
  - `voices.json`: en + hi voice = Monika Sogam – Natural Conversations (`EaBs7G1VibMrNAuz2Na7`), model `eleven_v4`.
  - CLAUDE.md: the ElevenLabs connector workflow.
  - Storyboard: `storyboards/HV-RestCardWhen.html`.
- **Voice:**
  - Generated in ElevenLabs through the connector: the full script, one prompt, two takes each of Esha (first try) and Monika Sogam (chosen by the team).
  - The sandbox can't download ElevenLabs audio (proxy 403), so the draft uses the Piper placeholder. Waiting for the team to attach the chosen Monika take.
- **Why / decisions:**
  - The script is word for word.
  - Headlines and list items are shortened ("A low-step day", "A deficit to clear", "Plan ahead? Soon") to fit on one line.
  - 05 uses frame f_007; 06 uses f_018 rather than f_009, because there the tab doesn't cover "Your deficit"; 08 uses f_015.
- **Flags:**
  - The 4,200 example uses Video 1's recording.
  - "Plan ahead? Soon" headline wording.
- **Output:**
  - `out/HV-RestCardWhen.mp4`: 63.4 s, placeholder voice.
  - QA sheet: all 9 slides pass.

## 2026-11-17 · System · ElevenLabs voice from the script
- **Asked:** "we have eleven labs where we need to generate voice from script. so connect eleven labs", and update the skill.
- **Changed:**
  - `scripts/elevenlabs-vo.ts` (`npm run voice -- <id>`) sends each slide's `vo` line to ElevenLabs `text-to-speech/{voice}/with-timestamps`, using the lines before and after as context. It writes:
    - `public/vo/<id>/NN.mp3`
    - `NN.align.json` (word start times)
    - `elevenlabs.json` (a hash per line)
  - It then runs `help-video-vo.ts`.
  - Only changed lines are generated, and hand-made recordings are kept. Flags: `--only`, `--force`, `--dry-run`.
  - `src/data/voices.json` holds the voice and settings per language. `voiceId` is still empty and needs the team's voice IDs.
  - Specs can override the voice with `voice: {…}` (`types.ts`).
  - `help-video-vo.ts` stores word timings in `vo-durations.json`, and `build.ts` `wordTime` uses them, so `atWord` is exact; otherwise it estimates as before.
  - `.gitignore` adds `.env`.
  - Docs: `CLAUDE.md` and `design.md` 1.5 (§8 Voice).
  - ElevenLabs connector suggested in chat. It is for ElevenAgents voice agents, so text-to-speech through it is unconfirmed.
- **Why / decisions:**
  - Per-slide generation removes the split step, and with it the mis-cuts seen on the Hindi take.
  - Word timings replace the position-based estimate.
  - The cloud sandbox can't reach api.elevenlabs.io (proxy 403), so the script runs on a Mac, or here once an admin allows the domain and the key is set as an environment variable.
- **Tested:**
  - Against a local fake ElevenLabs server on HV-RestCard-HI: 13 lines sent with the right settings and context, mp3 and timings written, durations measured.
  - A re-run skips everything, and the hand-made recording is kept.
  - The slide-3 ring lands at the exact word time (1.63 s).
  - The real Hindi files were restored afterwards; no video output changed.

## 2026-11-14 · HV-RestCard (+ HI) · Clean screenshot edges
- **Asked:** "why is this place looking different and blurry", with the calendar at 0:15 circled under the status bar.
- **Changed** (`scripts/prep-rest-card-screens.py`; `public/screens/HV-RestCard/01–05, 02b` regenerated):
  - The screen recorder's side tab ("❯", x 0–35, y 85–226) is now removed by its exact rounded shape:
    - 01, 04, 05 are inpainted (OpenCV Telea).
    - 02 and 03 are filled from clean background rows.
  - 02/02b (calendar frame grabbed mid-scroll): the strip above the first full row is replaced with the page background. That strip held the recorder's dark bar and the bottoms of cards 5–8.
  - 03: the back arrow's tip, hidden under the tab, is redrawn.
  - English and Hindi videos re-rendered.
  - `design.md` 1.4.2: a new Don't.
- **Why:**
  - The old paint-out faded from the row above the tab (the dark status bar) to the row below. That left a grey smear down the left edge, an orange streak on 01 and a dark streak on 04.
  - The scroll sliver showed through under our clean 9:41 bar.
  - Fill seams are now within 2–5 brightness levels.
- **Output:** `out/HV-RestCard.mp4` (98.9 s) and `out/HV-RestCard-HI.mp4` (138.5 s).

## 2026-11-14 · HV-RestCard-HI · Team's ElevenLabs Hindi voice
- **Asked:** "use this voice for hindi version" (one full ElevenLabs recording, 129.9 s).
- **Changed:**
  - Stored the recording as `work/HV-RestCard-HI/vo-full-elevenlabs.mp3`.
  - Split it into `public/vo/HV-RestCard-HI/02–14.wav`. There is no opener line, so slide 1 stays silent.
  - Each clip is trimmed to its speech and raised by the same +4.4 dB (limited at 0.95), because the recording measured −20.4 LUFS. The final mix is −15.8 LUFS.
  - VO durations are re-measured. The video was re-rendered and QA'd.
  - `CLAUDE.md`: how to transcribe a recording to place the cuts.
- **Why / decisions:**
  - `vo-split.py`'s estimate put cuts in the wrong places (lines 06 and 13 flagged), because this voice paces some lines very differently.
  - The recording was transcribed with Whisper-small (sherpa-onnx), and each line's start was placed by the words heard: "लेकिन सच कहें तो" 5.9 s, "एक दिन हमारी community" 19.0 s, "मान लीजिए" 66.8 s, "इसका मतलब है" 79.7 s, "अगर आपकी streak" 105.7 s, "क्योंकि हम मानते हैं" 111.1 s, "और हम Koshiqa" 124.1 s.
  - Line lengths match the script's proportions.
- **Output:**
  - `out/HV-RestCard-HI.mp4`: 138.5 s, ElevenLabs Hindi voice, with music.
  - QA sheet: every slide passes.
  - Runtime is long for an explainer (guideline 40–75 s) because the voice is unhurried. Options: a faster ElevenLabs speed setting, or a shorter story line (05, 32.7 s).

## 2026-11-14 · HV-RestCard-HI · Hindi version of the Rest Card explainer
- **Asked:** "Translate the script into hindi and make one hindi version".
- **Changed:**
  - New `src/videos/rest-card-hi.ts` (`HV-RestCard-HI`, `lang: "hi"`), registered in `index.ts`.
    - It is built from the English slides, so layouts, screens, targets, peeks, the chat and the music are the same.
    - Every VO line, headline, card, number label, E7/E14 line and `atWord` is translated.
  - `MotionKit` E14 takes `days`.
  - `help-video-vo.ts`:
    - per-language Piper model (`PIPER_MODEL_HI`, `PIPER_ESPEAK_DATA_HI`)
    - the pronunciation list `src/data/pronunciation-hi.json`
    - speed `PIPER_LENGTH_SCALE_HI` (default 0.85)
  - `design.md` 1.4.1: §11 "Hindi versions".
  - `CLAUDE.md`: Hindi placeholder voice setup (sherpa-onnx GitHub release, with an IR-version patch).
  - Review page: `work/HV-RestCard-HI/storyboard.json` → `storyboards/HV-RestCard-HI.html`, with the Hindi script and the English line under each.
- **Why / decisions:**
  - The translation is conversational Hinglish in Devanagari, matching the earlier Hindi FAQ test. App and product words stay in English.
  - "stayed with us" became "जो हमारे दिल को छू गया".
  - "every step of the way" became "हर कदम पर" (keeps the step pun).
  - "Push. Rest. Repeat." became "मेहनत। आराम। फिर से।"
  - The chat message and the app screenshots stay in English.
  - E14 day letters are सो मं बु गु शु श र.
- **Output:**
  - `out/HV-RestCard-HI.mp4`: 131.7 s with the placeholder Hindi voice (Piper hi_IN-priyamvada). The voice is slow; a real Hindi VO should land nearer 100–110 s.
  - QA sheet: every slide passes; Devanagari renders cleanly.
  - The team's Hindi VO goes in `public/vo/HV-RestCard-HI/02–14` (+ `01` if the opener is voiced).

## 2026-11-14 · HV-RestCard + system · Chat earlier and flipped, 💚 reply, background music
- **Asked:** chat messages a bit earlier; consumer messages on the left, ours on the right; send a heart emoji at the end; subtle non-copyright music always running at low volume.
- **Changed:**
  - `src/screens/chat.tsx`: seen from Koshiqa's side. The header is the member (plain person icon), member bubbles are on the left in white, Koshiqa's on the right in mint. Emoji-only messages pop in large without a bubble. The typing dots can come from either side and stop when that side's next message arrives.
  - `layout-system.ts` ChatScreen type updated (`avatar` may be null, `typing.from`).
  - `rest-card.ts` (chat timing):
    - Messages now land a sentence ahead of the voice: at 0.5 s, at "lifelong", and at "She wants to give".
    - Koshiqa's typing dots start at "simple", then 💚 at "That got".
    - The slide is held 22.4 s so the heart stays ~2 s.
  - Music:
    - `scripts/make-music.py` synthesises `public/music/soft-bed.wav` (180 s; Cmaj7–Am7–Fmaj7–G6 pad, e-piano arpeggio, sub, soft shaker, reverb; no samples, so no copyright).
    - `build.ts` adds the `MUSIC` levels and a ducking curve shared by Studio (`HelpVideo.tsx` `<Audio>`) and the sandbox mix (`mix-audio.ts`, ffmpeg volume expression).
    - Specs get `music` (default the house bed, `null` = off).
  - `design.md` 1.4: `audio.music` tokens and the §8 rule. `SCREENS.md` chat notes updated.
- **Why / decisions:**
  - Heart is green 💚, to match the brand and her own message.
  - Header reads "Koshiqa member · Community", with no name or photo.
  - Music levels: 0.16 alone (≈ −29 LUFS) and 0.09 under the voice (≈ 20 dB below it). The voice mix is −16 LUFS.
  - Voice lines < 1.5 s apart count as one, so the music doesn't pump.
- **Output:**
  - `out/HV-RestCard.mp4`: 98.9 s, placeholder voice, with music.
  - QA sheet: every slide passes.
  - Storyboard regenerated.

## 2026-11-13 · HV-RestCard · Opens on the video's question
- **Asked:** "this was the question - VIDEO 1: WHAT IS A REST CARD? WHY DID WE BUILD IT?"
- **Changed:**
  - `src/videos/rest-card.ts`: `question` is now "What is a Rest Card? Why did we build it?", and a new first slide F1 (pose thinking) shows "What is a Rest Card?" for 3 s.
  - The VO files moved up one number (02–14).
  - `src/components/Text.tsx`: an accent now also matches a word with punctuation after it ("Card?" matches "Card"), fixing every headline that ends on its accent word.
  - Storyboard retitled "Video 1 · …" and regenerated.
- **Why / decisions:**
  - F1 text has a 5-word limit, so the card shows only the first half of the question; the story answers "why".
  - "Rest Card" is kept together on one line.
  - The script has no line for the opener, so it is silent; flagged.
- **Output:**
  - `out/HV-RestCard.mp4`: 97.9 s, 14 slides, placeholder voice.
  - QA sheet: every slide passes.
  - Team VO files are now `public/vo/HV-RestCard/02–14`, plus `01` if the opener is voiced.

## 2026-11-13 · HV-RestCard · First Rest Card explainer (draft, placeholder voice)
- **Asked:** "make the first video": the Rest Card script (6 scenes, ~90 s; benefit, story behind the launch, limitations), plus recording IMG_7237 and a screenshot of day 22 lifted to 10,000.
- **Changed:**
  - New spec `src/videos/rest-card.ts` (13 slides, registered in `index.ts`). Scenes: S2 ×5, S1 chat, E7 ×2, C1 ×2, C3, E14, F2.
  - Screens `public/screens/HV-RestCard/01–05, 02b` made by `scripts/prep-rest-card-screens.py`. The HDR recording is tone-mapped, the side tab painted out (narrower on 03 so "Power card" stays whole), the member name on 01 blurred, and 02b composited from the user's day-22 screenshot.
  - New screen features: `then` crossfade on screenshots (before → after) and a chat-thread mockup (`src/screens/chat.tsx`). Both are documented in SCREENS.md, design.md 1.3.1.
  - C1 formats numbers (5,800), and C1/E7 text sizes itself to fit.
  - `recording-frames.py` handles HDR.
  - Storyboard for review: `work/HV-RestCard/storyboard.json` → `storyboards/HV-RestCard.html`.
- **Why / decisions:**
  - Type: explainer (what/why of a feature, story and rules; very little tapping).
  - VO is the script verbatim, split per slide.
  - It opens on the calendar as scripted, with no F1. It ends on F2, because there is no logo layout.
  - E14 line shortened to "Push. Rest. Repeat." so it fits on one line.
- **Flags:**
  - The chat text is drafted from the VO and needs the member's real words and consent.
  - Is the 3,500-step day still lifted for the contest?
  - "Lowest eligible day" is not defined.
  - The example club line says "remain in Urban Blackbuck".
  - The logo end card is missing.
  - The runtime is 95 s, over the 75 s explainer guideline but matching the script's 90 s.
- **Output:**
  - `out/HV-RestCard.mp4` (94.9 s, Piper placeholder VO)
  - `out/HV-RestCard-qa.png` (all 13 slides pass)
  - The team's VO goes in `public/vo/HV-RestCard/01–13`.

## 2026-11-13 · system + HV-HowStepsSync · Explainer approved; motion scenes usable in videos; video-type rules
- **Asked:** the motion kit is fine. Add explainers to the skill, and make the skill decide which video type a script needs.
- **Changed:**
  - Each E1–E14 scene takes content (`MotionContent`, defaults = reel examples) and can be used in a spec (`code: "E5", motion: {…}`), with its own timing and sounds.
  - `design.md` 1.3: explainer + motion kit approved, a scene table (use for / content / limits), and rules for choosing the video type from a script.
  - Storyboards record `type` and a per-beat `layout`.
  - `HV-HowStepsSync` now uses E12, E9 and E7.
  - E7 text sizes itself to fit.
  - `CLAUDE.md` and `storyboards/README.md` updated; skill updated (proposed to the user).
- **Why / decisions:** E scenes play from the slide start rather than per word, because their animations are choreographed. The slide is never shorter than the scene.
- **Output:** `HV-HowStepsSync` 42.6 s (placeholder VO), QA sheet; motion-kit reel re-rendered (unchanged look).

## 2026-11-13 · system · Explainer motion kit (E1–E14) from the reference video
- **Asked:** read all the animations in the reference video (9 Micro Habits, 17 min) and build them for explainer videos with Remotion.
- **Changed:** `src/explainer/motion.tsx` (Words, mint box, GlassGrow, DrawPath, helpers), `src/explainer/MotionKit.tsx` (14 scenes + reel), `src/explainer/motion-data.ts` (timeline + cues); composition `ExplainerMotionKit`; `design.md` §11 draft entry; grid at `design/explainer-motion-kit-grid.png`.
- **Why / decisions:**
  - Kept the motion graphics only, re-coloured to Koshiqa green, portrait 1080×1920, Torty peeking.
  - Sample content uses Koshiqa ideas (steps, koins, streaks) as placeholders.
  - QA fixed text overflow on E6, E7 and E13.
- **Output:** `out/ExplainerMotionKit.mp4` (58 s, Soft UI sounds).

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
