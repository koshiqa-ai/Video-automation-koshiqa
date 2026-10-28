# Koshiqa help-video automation

This repo turns a help-video script into a finished vertical video (1080×1920) for the Koshiqa app, using Remotion.

- **`design.md`**: the design system: layouts, Torty, annotations, text, motion and audio. It is the source of truth; read it first.
- **`design/`**: the pictures that go with `design.md`: layout stills, Torty poses and peeks, and the review grid.
- **`torty-requests.md`**: Torty art still needed from the designers.

## Run it
```bash
npm i
npm run dev               # Remotion Studio: open the "LayoutSystem" composition
npm run render:layouts    # writes out/LayoutSystem.mp4
```

## Where things are
```
design.md, design/        design system + reference images
src/
  LayoutSystem.tsx        the approved layouts (S1–S4, F1–F2, P1–P2, T1–T2, K1–K8)
  data/layout-system.ts   layout geometry + the review reel's slides (must match design.md)
  components/             Phone, TapCursor, Text (headline)
  screens/                coded mockups of the Koshiqa app (to be replaced by real recordings)
  torty/                  flat.json, peek-flat.json (pose metadata)
public/
  torty/flat/             13 full Torty poses (flat style)
  torty/peek-flat/        corner peeks, left + right
  sfx/packs/soft/         Soft UI sound pack (4 other packs alongside)
scripts/
  extract-torty-flat.py   cuts the poses out of assets-src/torty-flat/expression-sheet.png
  make-torty-peek-flat.py builds the corner peeks
  make-layout-grid.py     builds the review grid image
render-local/             stand-in renderer for sandboxes where Remotion can't be installed (not needed locally)
```

## Earlier explorations (kept for reference)
`FAQ1`–`FAQ5` (five style directions), `FAQ6-StepsStuckHindi`, `FAQ7-LayoutsDemo`, `FAQ8-RedeemKoins-*` (SFX pack options), `LayoutCatalogue`, `LayoutCatalogueV3`, `PointerLayouts`, `AnnotationKit` and `TortyShowcase` are still registered in `src/Root.tsx`. They predate the approved layout system and don't follow `design.md` v1.0.
