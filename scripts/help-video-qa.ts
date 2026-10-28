// Prints the QA frame for every slide of a help video (one still per slide), as JSON.
//   npx tsx scripts/help-video-qa.ts <videoId>
// Then render those frames (Remotion: `npx remotion still <id> --frame=N out/qa/<id>-fN.png`)
// and build the contact sheet: python3 scripts/qa-sheet.py <videoId> out/qa
import { findVideo } from "../src/videos";
import { buildHelpVideo, qaFrames } from "../src/videos/build";

const spec = findVideo(process.argv[2] ?? "");
if (!spec) throw new Error(`Unknown video id "${process.argv[2]}"`);
const b = buildHelpVideo(spec);
const frames = qaFrames(spec);
console.log(JSON.stringify({
  id: spec.id,
  seconds: +(b.durationInFrames / 30).toFixed(1),
  slides: b.slides.map((s, i) => ({ n: i + 1, code: s.code, frame: frames[i], sec: +(s.duration / 30).toFixed(1), peek: s.peek ? `${s.peek.side} ${s.peek.expr}` : null, title: s.title ?? null, vo: spec.slides[i].vo ?? null })),
}, null, 1));
