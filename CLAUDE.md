# Working in this repo

- **Read `design.md` before planning or building any video.** Every slide must be one of its layouts (S1–S4, F1–F2, P1–P2, T1–T2; FAQ Q, A; explainer C1–C4, E1–E14) with its annotations (K1–K8). Don't invent layouts; use the closest one and flag the gap.
- `design.md` (YAML block) is the source of truth for numbers. `src/data/layout-system.ts` must match it, so change `design.md` first, then the code.
- After any layout or Torty change: re-render the `LayoutSystem` stills, rebuild `design/layout-system-grid.png` (`scripts/make-layout-grid.py`) and refresh the matching image in `design/layouts/`.
- Torty art: never edit the PNGs in `public/torty/` by hand. Re-run `npm run torty` from the source sheet.
- Add every mistake a reviewer points out as a line in the Don'ts section of `design.md`, and log the change in its Changelog.
- **After every edit, add an entry at the top of `revisions.md`** (format at the top of that file). This applies to videos and to the system alike.

## Making a help video
Three video types (`type` in the spec; design.md §11, which also says how to pick the type from a script): **walkthrough** (how to do a task, from a recording; example `src/videos/start-steps.ts`), **faq** (5–6 quick Q&As in one video: layouts Q, A, S2; example `src/videos/steps-faq.ts`), **explainer** (a feature's what and why: concept scenes C1–C4 and motion scenes E1–E14 from `src/explainer/`; example `src/videos/how-steps-sync.ts`).

Flow: screen recording → storyboard HTML (reviewed) → video spec → render (see `storyboards/README.md`). Voiceover comes from the team as files in `public/vo/<id>/` (one per slide, or one full file split with `scripts/vo-split.py`); Piper is only a placeholder for drafts.

Videos are specs in `src/videos/<name>.ts` (a list of layout codes, see `src/videos/types.ts`), registered in `src/videos/index.ts`; `src/HelpVideo.tsx` renders them. Screens and tap targets are in `src/videos/SCREENS.md`. Example: `src/videos/join-contest.ts`. The `koshiqa-help-video` skill walks through the full process.

## Rendering in the cloud sandbox (no npm access)
```bash
ESBUILD_PATH=/opt/npm-tools/node_modules/esbuild/lib/main.js GLOBAL_NODE_MODULES=/home/claude/.npm-global/lib/node_modules node render-local/build.mjs
PLAYWRIGHT_PATH=/home/claude/.npm-global/lib/node_modules/playwright/index.mjs node render-local/render.mjs <CompositionId> [--stills f1,f2]
PATH=/home/claude/.npm-global/bin:$PATH tsx render-local/mix-audio.ts <CompositionId>
```
Render one composition at a time. Output goes to `out/`, which is git-ignored.

Placeholder Hindi voice (PyPI and Hugging Face are blocked here; GitHub works). Set it up once per sandbox:
```bash
mkdir -p /home/claude/tts/hi && cd /home/claude/tts/hi
curl -sSL https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-hi_IN-priyamvada-medium.tar.bz2 | tar xj
M=vits-piper-hi_IN-priyamvada-medium
# the bundled Piper runtime reads ONNX IR ≤ 8; the model header says 9 (byte 2), so patch a copy
python3 -c "b=bytearray(open('$M/hi_IN-priyamvada-medium.onnx','rb').read()); b[1]=8; open('$M/hi8.onnx','wb').write(b)"; cp $M/hi_IN-priyamvada-medium.onnx.json $M/hi8.onnx.json
```
Then generate the Hindi VO for a video:
```bash
M=/home/claude/tts/hi/vits-piper-hi_IN-priyamvada-medium
LD_LIBRARY_PATH=/home/claude/tts/piper PIPER_BIN=/home/claude/tts/piper/piper \
  PIPER_MODEL_HI=$M/hi8.onnx PIPER_ESPEAK_DATA_HI=$M/espeak-ng-data PATH=/home/claude/.npm-global/bin:$PATH tsx scripts/help-video-vo.ts <id>
```

If `scripts/vo-split.py` flags cuts (⚠), transcribe the recording to place them instead of guessing (Whisper via sherpa-onnx, both from GitHub releases):
```bash
mkdir -p /home/claude/tts/asr && cd /home/claude/tts/asr
curl -sSL https://github.com/k2-fsa/sherpa-onnx/releases/download/v1.12.20/sherpa-onnx-v1.12.20-linux-x64-shared.tar.bz2 | tar xj
curl -sSL https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2 | tar xj
# split the file at its pauses into ≤30 s 16 kHz mono wavs, then:
B=sherpa-onnx-v1.12.20-linux-x64-shared; M=sherpa-onnx-whisper-small
LD_LIBRARY_PATH=$B/lib $B/bin/sherpa-onnx-offline --whisper-encoder=$M/small-encoder.onnx --whisper-decoder=$M/small-decoder.onnx --tokens=$M/small-tokens.txt --whisper-language=hi seg/*.wav
```
(Hindi output drops some characters, but the surviving words are enough to find where each line starts.)

