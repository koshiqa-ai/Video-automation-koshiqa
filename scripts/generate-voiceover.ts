// Placeholder voiceover: renders every scene's `vo` line with Piper (offline TTS)
// and writes public/vo/<faq>/<scene>.wav + src/data/vo-durations.json.
// Swap this for the locked TTS tool once the voiceover milestone is done.
//   PIPER_BIN=/path/to/piper PIPER_MODEL=/path/to/en-us-lessac-medium.onnx npx tsx scripts/generate-voiceover.ts
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { FAQS } from "../src/data/faqs";
import { LAYOUT_DEMO } from "../src/data/faq-layouts";
import { SAAS } from "../src/data/faq-saas";

const root = join(__dirname, "..");
const piper = process.env.PIPER_BIN ?? "piper";
const model = process.env.PIPER_MODEL;
if (!model) throw new Error("Set PIPER_MODEL to a Piper .onnx voice");
const pron: Record<string, string> = JSON.parse(
  readFileSync(join(root, "src/data/pronunciation.json"), "utf8"),
);

const speakable = (s: string) =>
  Object.entries(pron)
    .filter(([k]) => !k.startsWith("_"))
    .reduce((t, [k, v]) => t.replace(new RegExp(`\\b${k}\\b`, "g"), v), s);

const durations: Record<string, number> = {};
const ONLY = process.env.ONLY; // e.g. ONLY=FAQ7-LayoutsDemo to regenerate one video
const existing: Record<string, number> = (() => { try { return JSON.parse(readFileSync(join(root, "src/data/vo-durations.json"), "utf8")); } catch { return {}; } })();
Object.assign(durations, existing);
for (const faq of [...FAQS, LAYOUT_DEMO, SAAS]) {
  if (ONLY && faq.id !== ONLY) continue;
  const dir = join(root, "public/vo", faq.id);
  mkdirSync(dir, { recursive: true });
  for (const scene of faq.scenes) {
    const out = join(dir, `${scene.id}.wav`);
    execFileSync(piper, ["--model", model, "--output_file", out, "--length_scale", "0.96", "--sentence_silence", "0.15"], {
      input: speakable(scene.vo),
      stdio: ["pipe", "ignore", "ignore"],
    });
    const d = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]).toString();
    durations[`${faq.id}/${scene.id}`] = Math.round(parseFloat(d) * 1000) / 1000;
    console.log(faq.id, scene.id, durations[`${faq.id}/${scene.id}`]);
  }
}
writeFileSync(join(root, "src/data/vo-durations.json"), JSON.stringify(durations, null, 2));
