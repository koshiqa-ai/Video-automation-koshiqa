# Screen recording guidelines (for the person recording)

Shared copy: https://claude.ai/artifact/NCf2fGEejGoazPQte1bLvP. Keep this file and that doc in sync.

Record slowly, pausing about 2 seconds on every screen, from a clean test account with nothing personal on screen. Each recording is turned into still screenshots, one per screen, then a storyboard, then the video.

## Before you record
- Test account, not personal (its name, email and photo will be seen)
- Do Not Disturb on; chat apps closed
- Light mode, kept the same throughout
- Phone language English (other languages = separate recordings)
- Default text size and display size
- Android: Settings → Developer options → **Show taps** on
- Start from the right state (e.g. uninstall Google Fit if the flow downloads it; log out of what the flow logs into)
- Battery above 50%, strong Wi-Fi; latest Koshiqa app (note the version)
- Clear old banners/pop-ups; close other apps

## While recording
1. Portrait the whole time.
2. **Pause ~2 s on every screen before tapping**, after it has finished loading and animating. We use the frame just before the tap.
3. One tap at a time; let the next screen settle, then pause again.
4. Scroll slowly, stop with the important part fully visible, pause 2 s.
5. Pop-ups and permission dialogs: let them appear fully, pause, then tap.
6. Typing: made-up values; close the keyboard before pausing.
7. Other apps in the flow (Play Store, Google Fit…) are part of the recording; same pace.
8. Mistake: don't stop. Pause 3 s, go back, redo, and note the time. Start over only if it goes very wrong.
9. Branching flows: record each path as its own file.
10. No sound; mic off (the voiceover is recorded separately).
11. Whole flow in one go, first screen to the final "done" screen.

## Privacy
- Never show: real phone numbers, OTPs, passwords, addresses, payment details, personal photos, contact names.
- Account pickers list every account on the phone. Prefer a test phone; otherwise note the time so we blur it.
- No notifications (Do Not Disturb).
- Note in the notes file anything private that showed up, with its time.

## After recording
- Original MP4, full resolution, unedited (no trim, crop, speed-up, text or stickers).
- Name: `topic_platform_date.mp4`, e.g. `start-steps_android_2026-10-29.mp4`; extra paths get a suffix (`start-steps-already-have-fit_android_2026-10-29.mp4`).
- Upload to the shared Google Drive folder (WhatsApp and email compress it).
- Notes file next to it, same name, `.txt`.

## Notes template
```
Video: How to start counting steps
Question it answers: How do I connect Google Fit so Koshiqa counts my steps?
Phone / OS: Samsung A54, Android 14
Koshiqa app version: 4.2.1
Starting state: Google Fit not installed, logged out of Koshiqa steps

Steps (what you tapped and why):
0:01  Home - tap "Start My Steps"
0:04  Play Store - tap Install, then Open
0:10  Google Fit - tap "Continue as ..." (picks the account)
...
0:58  Back in Koshiqa - steps start syncing (end)

Important points to explain:
- Use the SAME Google account in Google Fit and in Koshiqa
- Activity tracking must be ON or steps won't count

Mistakes / redo at: 0:33 (tapped Back by mistake, redid the step)
Private info visible at: 0:51 (account list)
Other paths recorded separately: start-steps-already-have-fit_android_2026-10-29.mp4
Draft voiceover script (optional): attached / none
```

## Final checklist
- [ ] Portrait, full flow first screen → "done" screen
- [ ] Every screen held ~2 s before tapping
- [ ] Show taps on (Android)
- [ ] Test account, light mode, English, default text size
- [ ] Nothing personal on screen
- [ ] Original MP4, unedited, named `topic_platform_date.mp4`
- [ ] Uploaded to the shared Drive folder
- [ ] Notes file filled in, next to the video

---

### For Claude: how the guide maps to the pipeline
- The 2 s pauses are what `recording-frames.py` relies on (it keeps screens stable ≥ 0.4 s); without them use a lower `--settle`.
- Show-taps dots mark the tap target: use the dot's position for `taps` (then pick a frame *before* the dot for the screenshot).
- The notes' step list and "important points" seed the storyboard's sections, card text, voiceover and flags. "Mistakes / redo at" tells you which frames to skip; "Private info visible at" tells you what to redact (always check every frame anyway).
- Each recorded path is its own storyboard or a clearly marked branch.
