// Mixes voiceover + SFX from the same cue list the composition uses, then muxes onto the silent render.
//   npx tsx render-local/mix-audio.ts <CompositionId> [outdir]
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { FAQS } from "../src/data/faqs";
import { audioCues, buildTimeline, FPS } from "../src/data/timeline";
import { buildHindiTimeline, hindiAudioCues, HI_ID } from "../src/data/faq-hi";
import { buildLayoutTimeline, layoutAudioCues, LAYOUT_DEMO } from "../src/data/faq-layouts";
import { catalogueAudioCues, catalogueDuration } from "../src/data/layout-catalogue";
import { findVideo } from "../src/videos";
import { buildHelpVideo } from "../src/videos/build";
import { lsCues, lsDuration } from "../src/data/layout-system";
import { pointerCues, pointerDuration } from "../src/data/pointer-layouts";
import { kitDuration, reelCues, v3Duration } from "../src/data/layouts-v3";
import { buildSaasTimeline, saasAudioCues, SAAS, type SfxPack } from "../src/data/faq-saas";

const id = process.argv[2];
const outdir = process.argv[3] ?? join(__dirname, "../out");
const isHi = id === HI_ID;
const faq = FAQS.find((f) => f.id === id)!;
const isLayout = id === LAYOUT_DEMO.id;
const isCat = id === "LayoutCatalogue";
const isSaas = id.startsWith(SAAS.id);
const isV3 = id === "LayoutCatalogueV3";
const isKit = id === "AnnotationKit";
const isPtr = id === "PointerLayouts";
const isLS = id === "LayoutSystem";
const hv = findVideo(id);
const hvb = hv ? buildHelpVideo(hv) : null;
const pack = (id.slice(SAAS.id.length + 1) || "soft") as SfxPack;
const cues = hvb ? [...hvb.voCues, ...hvb.cues] : isLS ? lsCues() : isPtr ? pointerCues() : isV3 ? reelCues("v3") : isKit ? reelCues("kit") : isSaas ? saasAudioCues(pack) : isCat ? catalogueAudioCues() : isLayout ? layoutAudioCues() : isHi ? hindiAudioCues() : audioCues(faq);
const total = (hvb ? hvb.durationInFrames : isLS ? lsDuration() : isPtr ? pointerDuration() : isV3 ? v3Duration() : isKit ? kitDuration() : isSaas ? buildSaasTimeline().durationInFrames : isCat ? catalogueDuration() : isLayout ? buildLayoutTimeline().durationInFrames : isHi ? buildHindiTimeline().durationInFrames : buildTimeline(faq).durationInFrames) / FPS;
const inputs = cues.flatMap((c) => ["-i", join(__dirname, "../public", c.src)]);
const chains = cues.map((c, i) => {
  const ms = Math.round((c.frame / FPS) * 1000);
  return `[${i}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${c.volume},adelay=${ms}|${ms}[a${i}]`;
});
const filter = `${chains.join(";")};${cues.map((_, i) => `[a${i}]`).join("")}amix=inputs=${cues.length}:normalize=0:dropout_transition=0,alimiter=limit=0.95,apad,atrim=0:${total.toFixed(3)},afade=t=out:st=${(total - 0.8).toFixed(3)}:d=0.8[out]`;
const wav = join(outdir, `${id}.mix.wav`);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", filter, "-map", "[out]", "-ar", "48000", wav]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", process.env.SILENT ?? join(outdir, `${id}.silent.mp4`), "-i", wav, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", join(outdir, `${id}.mp4`)]);
console.log("muxed", join(outdir, `${id}.mp4`));
