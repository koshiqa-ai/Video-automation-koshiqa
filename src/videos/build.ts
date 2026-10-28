// Turns a HelpVideoSpec into timed layout-system slides + audio cues. Pure (no React).
import { cuesFor, type Cue, type LSSlide } from "../data/layout-system";
import type { HelpVideoSpec, VideoSlide } from "./types";
import VO from "./vo-durations.json";

export const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
/** design.md §2: the screen changes ~0.35 s before the line about it */
export const VO_LEAD = 0.35;
export const VO_TAIL = 0.45;
const DEFAULT_SEC = 2.6;

type VoEntry = { files: (string | null)[]; durations: (number | null)[] };
const voFor = (id: string): VoEntry | undefined => (VO as Record<string, VoEntry>)[id];

const toLS = (spec: HelpVideoSpec, v: VideoSlide, i: number): LSSlide => {
  const base = { code: v.code, row: 0, name: `${i + 1} ${v.code}`, title: v.title, accent: v.accent, peek: v.peek, sec: 0 };
  const times = v.times ?? (v.items ?? []).map((_, k) => 0.6 + 0.6 * k);
  switch (v.code) {
    case "F1":
    case "F2":
      return { ...base, kind: "full-torty", peek: undefined, fullTorty: { pose: v.pose ?? (v.code === "F1" ? "excited" : "wink"), textOnTop: v.code === "F1" } };
    case "P1":
    case "P2":
      return { ...base, kind: "pointer", list: { style: v.code === "P1" ? "num" : "icon", items: v.items ?? [], times } };
    case "T1":
      return { ...base, kind: "toc", list: { style: "toc", eyebrow: "IN THIS VIDEO", items: v.items ?? (spec.steps ?? []).map((text) => ({ text })), times } };
    case "T2":
      return { ...base, kind: "timeline", layout: "S2", screen: v.screen, anno: v.anno, timeline: { labels: spec.steps ?? [], current: v.step ?? 0 } };
    default:
      return { ...base, kind: v.anno ? "anno" : "phone", layout: v.code, screen: v.screen, anno: v.anno };
  }
};

export type TimedVideoSlide = LSSlide & { from: number; duration: number; vo?: { src: string; frame: number } };

export const buildHelpVideo = (spec: HelpVideoSpec) => {
  const vo = voFor(spec.id);
  let t = 0;
  const slides: TimedVideoSlide[] = spec.slides.map((v, i) => {
    const voSec = vo?.durations[i] ?? 0;
    const sec = Math.max(v.minSec ?? DEFAULT_SEC, voSec ? VO_LEAD + voSec + VO_TAIL : 0);
    const from = t;
    const duration = fr(sec);
    t += duration;
    const file = vo?.files[i];
    return { ...toLS(spec, v, i), sec, from, duration, vo: file ? { src: file, frame: from + fr(VO_LEAD) } : undefined };
  });
  const cues: Cue[] = cuesFor(slides);
  const voCues: Cue[] = slides.filter((s) => s.vo).map((s) => ({ src: s.vo!.src, frame: s.vo!.frame, volume: 1 }));
  return { slides, cues, voCues, durationInFrames: t };
};

/** one QA frame per slide: after its entrance and annotation, before the next slide */
export const qaFrames = (spec: HelpVideoSpec) =>
  buildHelpVideo(spec).slides.map((s) => {
    const a = s.anno?.kind;
    const late = s.from + s.duration - 8;
    if (a === "success") return Math.min(late, s.from + fr((s.anno?.at ?? 0.9) + 0.7));
    return late;
  });
