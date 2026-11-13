// Turns a HelpVideoSpec into timed layout-system slides + audio cues. Pure (no React).
import { cuesFor, isShot, shotFit, type Cue, type LSSlide } from "../data/layout-system";
import type { HelpVideoSpec, VideoSlide } from "./types";
import { motionScene } from "../explainer/motion-data";
import VO from "./vo-durations.json";

export const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
/** design.md §2: the screen changes ~0.35 s before the line about it */
export const VO_LEAD = 0.35;
export const VO_TAIL = 0.45;
const DEFAULT_SEC = 2.6;

type VoEntry = { files: (string | null)[]; durations: (number | null)[] };
const voFor = (id: string): VoEntry | undefined => (VO as Record<string, VoEntry>)[id];

/** seconds into the slide when `word` is spoken (estimated from its position in the line) */
const wordTime = (vo: string | undefined, voSec: number, word: string) => {
  if (!vo || !voSec) return VO_LEAD + 0.6;
  const i = vo.toLowerCase().indexOf(word.toLowerCase());
  const frac = i < 0 ? 0.6 : i / vo.length;
  return +(VO_LEAD + frac * voSec + 0.15).toFixed(2);
};

/** screenshot slides give taps / annotation targets in image pixels → convert to phone-screen coords; resolve atWord */
const toScreenSpace = (v: VideoSlide, voSec: number): VideoSlide => {
  const anno = v.anno && v.anno.atWord ? { ...v.anno, at: wordTime(v.vo, voSec, v.anno.atWord) } : v.anno;
  if (!isShot(v.screen)) return { ...v, anno };
  const { k, offY } = shotFit(v.screen.w, v.screen.h);
  const p = (x: number, y: number) => ({ x: x * k, y: y * k + offY });
  const taps = v.screen.taps?.map((t) => ({ ...t, ...p(t.x, t.y), at: t.at ?? (t.atWord ? wordTime(v.vo, voSec, t.atWord) : VO_LEAD + 0.6) }));
  const tg = anno?.target;
  const target = tg ? { ...p(tg.x, tg.y), w: tg.w * k, h: tg.h * k, r: tg.r !== undefined ? tg.r * k : undefined } : undefined;
  return { ...v, screen: { ...v.screen, taps }, anno: anno ? { ...anno, target } : undefined };
};

const toLS = (spec: HelpVideoSpec, v0: VideoSlide, i: number, voSec: number): LSSlide => {
  const v = toScreenSpace(v0, voSec);
  const base = { code: v.code, row: 0, name: `${i + 1} ${v.code}`, title: v.title, accent: v.accent, peek: v.peek, sec: 0 };
  const times = v.times ?? (v.items ?? []).map((_, k) => 0.6 + 0.6 * k);
  const at = (w: string | undefined, fallback: number) => (w ? wordTime(v.vo, voSec, w) : fallback);
  const itemTimes = (v.items ?? []).map((it, k) => at(it.atWord, v.code === "C4" ? 0.6 + 1.0 * k : 0.6 + 0.6 * k));
  switch (v.code) {
    case "E1": case "E2": case "E3": case "E4": case "E5": case "E6": case "E7":
    case "E8": case "E9": case "E10": case "E11": case "E12": case "E13": case "E14":
      return { ...base, kind: "motion", screen: v.screen, motion: { code: v.code, m: v.motion as Record<string, unknown> | undefined } };
    case "Q": {
      const qs = spec.slides.filter((x) => x.code === "Q");
      return { ...base, kind: "question", q: { n: qs.indexOf(v0) + 1, total: qs.length } };
    }
    case "A":
      return { ...base, kind: "answer", peek: undefined, answer: { sub: v.sub ?? "", pose: v.pose ?? "smile" } };
    case "C1":
      return { ...base, kind: "c-number", number: v.number };
    case "C2":
    case "C4":
      return { ...base, kind: v.code === "C2" ? "c-trio" : "c-flow", nodes: v.items, nodeTimes: itemTimes };
    case "C3":
      return { ...base, kind: "c-compare", compare: v.compare && { left: v.compare.left, right: v.compare.right, times: [at(v.compare.left.atWord, 0.6), at(v.compare.right.atWord, 1.6)] } };
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
    const sec = Math.max(v.minSec ?? motionScene(v.code)?.sec ?? DEFAULT_SEC, voSec ? VO_LEAD + voSec + VO_TAIL : 0);
    const from = t;
    const duration = fr(sec);
    t += duration;
    const file = vo?.files[i];
    return { ...toLS(spec, v, i, voSec), sec, from, duration, vo: file ? { src: file, frame: from + fr(VO_LEAD) } : undefined };
  });
  const VOL = { pop: 0.26, focus: 0.3, success: 0.3, tap: 0.4, zoom: 0.18 } as const;
  const motionCueList: Cue[] = slides.flatMap((s) => (s.kind === "motion" ? (motionScene(s.code)?.cues ?? []).map(([at, r]) => ({ src: `sfx/packs/soft/${r}.wav`, frame: s.from + at, volume: VOL[r] })) : []));
  const cues: Cue[] = [...cuesFor(slides), ...motionCueList];
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
