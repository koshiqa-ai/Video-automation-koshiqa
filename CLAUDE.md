# Working in this repo

- **Read `design.md` before planning or building any video.** Every slide must be one of its layouts (S1–S4, F1–F2, P1–P2, T1–T2) with its annotations (K1–K8). Don't invent layouts; use the closest one and flag the gap.
- `design.md` (YAML block) is the source of truth for numbers. `src/data/layout-system.ts` must match it, so change `design.md` first, then the code.
- After any layout or Torty change: re-render the `LayoutSystem` stills, rebuild `design/layout-system-grid.png` (`scripts/make-layout-grid.py`) and refresh the matching image in `design/layouts/`.
- Torty art: never edit the PNGs in `public/torty/` by hand. Re-run `npm run torty` from the source sheet.
- Add every mistake a reviewer points out as a line in the Don'ts section of `design.md`, and log the change in its Changelog.

## Rendering in the cloud sandbox (no npm access)
```bash
ESBUILD_PATH=/opt/npm-tools/node_modules/esbuild/lib/main.js GLOBAL_NODE_MODULES=/home/claude/.npm-global/lib/node_modules node render-local/build.mjs
PLAYWRIGHT_PATH=/home/claude/.npm-global/lib/node_modules/playwright/index.mjs node render-local/render.mjs <CompositionId> [--stills f1,f2]
PATH=/home/claude/.npm-global/bin:$PATH tsx render-local/mix-audio.ts <CompositionId>
```
Render one composition at a time. Output goes to `out/`, which is git-ignored.
