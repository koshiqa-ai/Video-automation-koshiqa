// Voiceover for a help video.
//   npx tsx scripts/help-video-vo.ts <videoId>
// For each slide with a `vo` line:
//   • if public/vo/<videoId>/NN.(mp3|wav|m4a) already exists (e.g. exported from ElevenLabs), it is used as is;
//   • otherwise, if PIPER_MODEL is set, a placeholder voice is generated with Piper (PIPER_BIN, default "piper").
// Durations are measured with ffprobe and written to src/videos/vo-durations.json; slide lengths follow automatically.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findVideo } from "../src/videos";

const id = process.argv[2];
const spec = id && findVideo(id);
if (!spec) throw new Error(`Unknown video id "${id}". Add it to src/videos/index.ts first.`);

const root = join(__dirname, "..");
const dir = join(root, "public", "vo", spec.id);
mkdirSync(dir, { recursive: true });
const pron: Record<string, string> = JSON.parse(readFileSync(join(root, "src/data/pronunciation.json"), "utf8"));
const respell = (t: string) => Object.entries(pron).filter(([w]) => !w.startsWith("_")).reduce((s, [w, say]) => s.replace(new RegExp(`\\b${w}\\b`, "gi"), say), t);
const piper = process.env.PIPER_BIN ?? "piper";
const model = process.env.PIPER_MODEL;
const dur = (f: string) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString().trim());

const files: (string | null)[] = [];
const durations: (number | null)[] = [];
spec.slides.forEach((s, i) => {
  const nn = String(i + 1).padStart(2, "0");
  if (!s.vo) { files.push(null); durations.push(null); return; }
  const existing = ["mp3", "wav", "m4a"].map((e) => join(dir, `${nn}.${e}`)).find(existsSync);
  let file = existing;
  if (!file) {
    if (!model) throw new Error(`No audio for slide ${nn} and PIPER_MODEL is not set. Drop ${nn}.mp3 into public/vo/${spec.id}/ or set PIPER_MODEL.`);
    if (spec.lang !== "en") console.warn(`⚠ slide ${nn}: Piper placeholder is English-only; use real ${spec.lang} VO files for the final.`);
    file = join(dir, `${nn}.wav`);
    execFileSync(piper, ["--model", model, "--output_file", file, "--length_scale", "0.96", "--sentence_silence", "0.15"], { input: respell(s.vo) });
  }
  files.push(`vo/${spec.id}/${file.split("/").pop()}`);
  durations.push(Math.round(dur(file) * 100) / 100);
  console.log(`${nn}  ${durations[i]!.toFixed(2)}s  ${s.vo}`);
});

const p = join(root, "src/videos/vo-durations.json");
const all = existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
all[spec.id] = { files, durations };
writeFileSync(p, JSON.stringify(all, null, 1) + "\n");
console.log(`wrote ${p}`);
