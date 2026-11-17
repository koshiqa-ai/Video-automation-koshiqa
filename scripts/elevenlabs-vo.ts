// Voiceover from the script with ElevenLabs: one request per slide, straight into public/vo/<id>/NN.mp3.
//
//   ELEVENLABS_API_KEY=… npx tsx scripts/elevenlabs-vo.ts <videoId> [--only 05,07] [--force] [--dry-run]
//
// • Voice and settings come from src/data/voices.json (per language), overridden by the spec's `voice: { … }`.
// • Each slide's `vo` text is sent exactly as written (Hinglish included; no respelling), with the lines before and
//   after as context (`stitch`) so the delivery flows like one take.
// • ElevenLabs returns character timings; they're saved as NN.align.json and used for `atWord`, so taps, rings and
//   reveals land on the spoken word instead of an estimate.
// • Only new or changed lines are generated (public/vo/<id>/elevenlabs.json keeps a hash per slide), to save
//   credits. Recordings this script didn't make (e.g. a full take split with vo-split.py) are kept.
//   --only 05,07 (re)generates just those slides; --force regenerates all; --dry-run shows what would be sent.
// • Afterwards it runs scripts/help-video-vo.ts to measure durations, so the video re-times itself.
// The key is read from ELEVENLABS_API_KEY or a git-ignored .env file (ELEVENLABS_API_KEY=…). Never commit it.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { findVideo } from "../src/videos";

type Voice = { voiceId: string; model: string; languageCode?: string; stability: number; similarity: number; style: number; speed: number; speakerBoost: boolean; stitch: boolean };

const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith("--") && !/^[\d,]+$/.test(a));
const flag = (f: string) => args.includes(f);
const onlyArg = args[args.indexOf("--only") + 1];
const only = flag("--only") && onlyArg ? new Set(onlyArg.split(",").map((n) => n.padStart(2, "0"))) : null;
const spec = id && findVideo(id);
if (!spec) throw new Error(`Unknown video id "${id}". Add it to src/videos/index.ts first.`);

const root = join(__dirname, "..");
const envFile = join(root, ".env");
const fromEnvFile = existsSync(envFile) ? readFileSync(envFile, "utf8").match(/^ELEVENLABS_API_KEY=(.+)$/m)?.[1].trim() : undefined;
const key = process.env.ELEVENLABS_API_KEY ?? fromEnvFile;
const API = process.env.ELEVENLABS_API_URL ?? "https://api.elevenlabs.io";

const voices = JSON.parse(readFileSync(join(root, "src/data/voices.json"), "utf8"));
const voice: Voice = { ...voices[spec.lang], ...((spec as { voice?: Partial<Voice> }).voice ?? {}) };
if (!voice.voiceId) throw new Error(`No ElevenLabs voiceId for "${spec.lang}". Set it in src/data/voices.json (or the spec's voice.voiceId).`);
if (!key && !flag("--dry-run")) throw new Error("Set ELEVENLABS_API_KEY (environment or .env in the repo root).");

const dir = join(root, "public", "vo", spec.id);
mkdirSync(dir, { recursive: true });
const manPath = join(dir, "elevenlabs.json");
const man: Record<string, { hash: string; chars: number }> = existsSync(manPath) ? JSON.parse(readFileSync(manPath, "utf8")) : {};

const lines = spec.slides.map((s) => s.vo ?? "");
const settingsKey = JSON.stringify([voice.voiceId, voice.model, voice.languageCode, voice.stability, voice.similarity, voice.style, voice.speed, voice.speakerBoost]);
const hashOf = (t: string) => createHash("sha1").update(settingsKey + "\n" + t).digest("hex").slice(0, 12);

/** word starts as [charIndex, seconds], from ElevenLabs' per-character timings */
const wordMarks = (chars: string[], starts: number[]) => {
  const marks: [number, number][] = [];
  chars.forEach((c, i) => { if (/\S/.test(c) && (i === 0 || /\s/.test(chars[i - 1]))) marks.push([i, Math.round(starts[i] * 1000) / 1000]); });
  return marks;
};

const run = async () => {
  let made = 0, chars = 0;
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i];
    const nn = String(i + 1).padStart(2, "0");
    if (!text) continue;
    const mp3 = join(dir, `${nn}.mp3`);
    const hash = hashOf(text);
    const fresh = existsSync(mp3) && man[nn]?.hash === hash;
    // a file this script didn't make (a recording split by hand, a re-take) is kept unless asked for by --only/--force
    const handMade = !man[nn] && ["mp3", "wav", "m4a"].some((e) => existsSync(join(dir, `${nn}.${e}`)));
    if (only && !only.has(nn)) { console.log(`${nn}  skipped (not in --only)`); continue; }
    if (!only && !flag("--force")) {
      if (fresh) { console.log(`${nn}  unchanged`); continue; }
      if (handMade) { console.log(`${nn}  kept: existing recording (use --only ${nn} or --force to replace it)`); continue; }
    }
    const prev = lines.slice(0, i).filter(Boolean).slice(-1)[0];
    const next = lines.slice(i + 1).filter(Boolean)[0];
    const body: Record<string, unknown> = {
      text, model_id: voice.model,
      voice_settings: { stability: voice.stability, similarity_boost: voice.similarity, style: voice.style, use_speaker_boost: voice.speakerBoost, speed: voice.speed },
      ...(voice.languageCode ? { language_code: voice.languageCode } : {}),
      ...(voice.stitch ? { ...(prev ? { previous_text: prev } : {}), ...(next ? { next_text: next } : {}) } : {}),
    };
    if (flag("--dry-run")) { console.log(`${nn}  would send ${text.length} chars: ${text}`); continue; }
    const res = await fetch(`${API}/v1/text-to-speech/${voice.voiceId}/with-timestamps?output_format=mp3_44100_128`, {
      method: "POST", headers: { "xi-api-key": key!, "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status} on slide ${nn}: ${(await res.text()).slice(0, 400)}`);
    const j = (await res.json()) as { audio_base64: string; alignment?: { characters: string[]; character_start_times_seconds: number[] } };
    writeFileSync(mp3, Buffer.from(j.audio_base64, "base64"));
    for (const old of ["wav", "m4a"]) rmSync(join(dir, `${nn}.${old}`), { force: true }); // a newer take replaces placeholders
    if (j.alignment) writeFileSync(join(dir, `${nn}.align.json`), JSON.stringify({ text, marks: wordMarks(j.alignment.characters, j.alignment.character_start_times_seconds) }) + "\n");
    man[nn] = { hash, chars: text.length };
    writeFileSync(manPath, JSON.stringify(man, null, 1) + "\n");
    made++; chars += text.length;
    console.log(`${nn}  ✓ ${text.length} chars  ${text}`);
  }
  if (flag("--dry-run")) return;
  console.log(`\n${made} line(s) generated, ${chars} characters billed.`);
  execFileSync(process.execPath, [...process.execArgv, join(__dirname, "help-video-vo.ts"), spec.id], { stdio: "inherit" });
};
run().catch((e) => { console.error(e.message ?? e); process.exit(1); });
