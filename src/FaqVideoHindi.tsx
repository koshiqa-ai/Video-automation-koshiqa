import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, HookScene, OutroScene } from "./components/Scenes";
import { PHONE_W } from "./components/Phone";
import { Stage, type PeekState } from "./components/Stage";
import { Caption, Chip, Headline } from "./components/Text";
import { buildHindiTimeline, hindiAudioCues, LINES, voFrame, type HiTimed } from "./data/faq-hi";
import { ensureFonts } from "./theme/fonts";
import { THEMES } from "./theme/themes";
import VO_ENV from "./data/vo-envelope-FAQ6.json";

ensureFonts();

const theme = THEMES.skyHi;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PHONE_SCALE = 1.55;
// Phone sits a little left so Torty can stand beside it, in front, and point at the screen
const GEOMETRY = [{ scale: PHONE_SCALE, x: 140, y: 90 }];
const PRESENTER = { x: 790, y: 1010, height: 420 };
void PHONE_W;
const TEXT_TOP = 1468;

// ───────── Captions: long lines are split into ≤2-line chunks, timed by length ─────────
const MAX = 54;
const chunkLine = (text: string): string[] => {
  if (text.length <= MAX) return [text];
  const parts = text.split(/(?<=,)\s+/);
  const out: string[] = [];
  for (const p of parts) {
    if (out.length && (out[out.length - 1] + " " + p).length <= MAX) out[out.length - 1] += " " + p;
    else out.push(p);
  }
  return out.flatMap((c) => {
    if (c.length <= MAX + 8) return [c];
    const words = c.split(" ");
    let best = 1, bestDiff = Infinity;
    for (let i = 1; i < words.length; i++) {
      const d = Math.abs(words.slice(0, i).join(" ").length - c.length / 2);
      if (d < bestDiff) { bestDiff = d; best = i; }
    }
    return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
  });
};

type Chunk = { text: string; from: number; dur: number };
const chunksFor = (lineIdx: number[], sceneFrom: number): Chunk[] =>
  lineIdx.flatMap((li) => {
    const l = LINES[li];
    const parts = chunkLine(l.text);
    const total = parts.reduce((a, p) => a + p.length, 0);
    let t = l.start;
    return parts.map((p) => {
      const sec = ((l.end - l.start) * p.length) / total;
      const c = { text: p, from: voFrame(t) - sceneFrom, dur: sec };
      t += sec;
      return c;
    });
  });

const LiveCaption: React.FC<{ chunks: Chunk[]; size: number; align: "left" | "center"; color: string }> = ({ chunks, size, align, color }) => {
  const f = useCurrentFrame();
  let k = 0;
  chunks.forEach((c, i) => { if (f >= c.from - 6) k = i; });
  const c = chunks[k];
  return <Caption key={k} text={c.text} theme={theme} voFrom={c.from} voSec={c.dur} size={size} align={align} color={color} />;
};

// ───────── Yes / No branch card ─────────
const ForkCard: React.FC<{ pick: "yes" | "no"; from: number; to: number }> = ({ pick, from, to }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - from, fps, config: { damping: 14 } });
  const out = interpolate(f, [to - 8, to], [0, 1], clamp);
  const sel = interpolate(f, [from + 12, from + 20], [0, 1], clamp);
  if (f < from || f > to) return null;
  const Opt: React.FC<{ id: "yes" | "no"; label: string; to: string }> = ({ id, label, to: dest }) => {
    const on = id === pick ? sel : 0;
    const good = id === "yes";
    return (
      <div
        style={{
          flex: 1,
          borderRadius: 30,
          padding: "22px 20px",
          background: on > 0.5 ? (good ? "#1DB57A" : "#075DC2") : "#F1F5FA",
          color: on > 0.5 ? "#fff" : "#62708A",
          scale: String(1 + 0.06 * on),
          opacity: id === pick ? 1 : 1 - 0.45 * sel,
          textAlign: "center",
          fontFamily: theme.headlineFont,
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.25 }}>{label}</div>
        <div style={{ fontSize: 30, fontWeight: 500, marginTop: 4, lineHeight: 1.3 }}>→ {dest}</div>
      </div>
    );
  };
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        width: 610,
        top: 1010,
        padding: "28px 30px 30px",
        borderRadius: 44,
        background: "#FFFFFF",
        boxShadow: "0 30px 70px rgba(6,42,92,0.30)",
        opacity: p * (1 - out),
        translate: `0px ${(1 - p) * 80 + out * 40}px`,
        zIndex: 10,
      }}
    >
      <div style={{ fontFamily: theme.headlineFont, fontWeight: 700, fontSize: 36, color: theme.text, textAlign: "center", lineHeight: 1.3, marginBottom: 22 }}>
        Google Fit में steps दिख रहे हैं?
      </div>
      <div style={{ display: "flex", gap: 22 }}>
        <Opt id="yes" label="✓ हां" to="तरीका 1" />
        <Opt id="no" label="✗ नहीं" to="तरीका 2" />
      </div>
    </div>
  );
};

const StepTextHi: React.FC<{ scene: HiTimed }> = ({ scene }) => {
  const f = useCurrentFrame();
  const exitAt = scene.duration - 8;
  const fade = interpolate(f, [exitAt, exitAt + 8], [1, 0], clamp);
  const chunks = chunksFor(scene.hi.lines, scene.from);
  const fork = scene.hi.fork;
  return (
    <AbsoluteFill>
      {fork && <ForkCard pick={fork.pick} from={voFrame(fork.from) - scene.from} to={voFrame(fork.to) - scene.from} />}
      <div style={{ position: "absolute", left: 80, right: 80, top: TEXT_TOP, display: "flex", flexDirection: "column", gap: 14, opacity: fade }}>
        <Chip theme={theme}>{scene.hi.chip}</Chip>
        <Headline text={scene.title} accent={scene.accent} theme={theme} size={scene.title.length > 26 ? 64 : 74} delay={4} />
        <LiveCaption chunks={chunks} size={38} align="left" color={theme.subText} />
      </div>
    </AbsoluteFill>
  );
};

// ───────── Torty's reactions (absolute frames) ─────────
// Torty is the narrator: he bounces with the voiceover's loudness.
const talk = (abs: number) => VO_ENV.values[abs - voFrame(0)] ?? 0;
const at = (s: number) => voFrame(s);

// When he points at the phone (explaining what to tap) and gives a thumbs-up (after each fix), VO seconds
const POINT: [number, number][] = [[9.5, 10.4], [11.4, 13.2], [19.5, 20.9], [22.2, 24.5], [29.0, 32.4], [46.6, 49.0], [66.1, 69.1]];
const THUMBS: [number, number][] = [[13.6, 16.6], [37.0, 38.1], [52.6, 53.7], [70.3, 72.0]];
const within = (abs: number, list: [number, number][]) => list.find(([a, b]) => abs >= at(a) && abs < at(b));

// Every moment Torty changes pose (window starts/ends) → used for his pop-in
const BOUNDS = [...POINT, ...THUMBS, [53.7, 56.9], [72.0, 75.2], [57.0, 61.2]].flat().map(at).sort((a, b) => a - b);
const sinceChange = (abs: number) => abs - Math.max(0, ...BOUNDS.filter((b) => b <= abs));

const peekScript = (abs: number): PeekState => {
  const base = { talk: talk(abs), since: sinceChange(abs) };
  const say = (from: number, to: number) => abs >= at(from) && abs < at(to);
  if (say(53.7, 56.9)) return { mood: "sad", bubble: "Permission ज़रूरी है!", bubbleFrom: at(53.7), lean: 1, rig: base };
  if (say(72.0, 75.2)) return { mood: "sad", bubble: "Permission ज़रूरी है!", bubbleFrom: at(72.0), lean: 1, rig: base };
  if (within(abs, THUMBS)) return { mood: "happy", rig: { ...base, gesture: "thumbs" } };
  if (within(abs, POINT)) return { mood: "surprised", rig: { ...base, gesture: "point" } };
  if (say(57.0, 61.2)) return { mood: "sad", rig: base };
  return { mood: "surprised", rig: base };
};

export const FaqVideoHindi: React.FC = () => {
  const { scenes } = buildHindiTimeline();
  const steps = scenes.filter((s) => s.kind === "step");
  const outro = scenes.find((s) => s.kind === "outro")!;
  const stageFrom = steps[0].from;
  return (
    <AbsoluteFill style={{ fontFamily: theme.bodyFont }}>
      <Background theme={theme} />
      <Sequence from={stageFrom} durationInFrames={outro.from - stageFrom} name="Phone stage">
        <Stage steps={steps} stageFrom={stageFrom} duration={outro.from - stageFrom} theme={theme} geometry={GEOMETRY} peek={peekScript} presenter={PRESENTER} />
      </Sequence>
      {scenes.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={`${s.kind}: ${s.title}`}>
          {s.kind === "hook" && <HookScene scene={s} theme={theme} rig={(f) => ({ talk: talk(f + s.from) })} />}
          {s.kind === "step" && <StepTextHi scene={s} />}
          {s.kind === "outro" && (
            <OutroScene
              scene={s}
              theme={theme}
              tagline="और जवाब: Help & Support में"
              rig={(f) => ({ talk: talk(f + s.from), gesture: "wave", sway: 3 * Math.sin(f / 5) * interpolate(f, [8, 20], [0, 1], clamp) })}
            />
          )}
        </Sequence>
      ))}
      {hindiAudioCues().map((c, i) => (
        <Sequence key={`a${i}`} from={c.frame} layout="none" name={c.src}>
          <Audio src={staticFile(c.src)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

