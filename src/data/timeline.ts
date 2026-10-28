import type { Faq, Gesture, Scene } from "./faqs";
import voDurations from "./vo-durations.json";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Seconds the voiceover waits after a scene starts */
export const VO_LEAD = 0.4;

const MIN_SEC: Record<Scene["kind"], number> = { hook: 5.4, step: 7.0, outro: 6.0 };
const TAIL_SEC: Record<Scene["kind"], number> = { hook: 0.8, step: 1.2, outro: 2.2 };

export type TimedGesture = Gesture & { frame: number };
export type TimedScene = Scene & {
  from: number;
  duration: number;
  voFrom: number;
  voSec: number;
  gesturesTimed: TimedGesture[];
};

export const voSeconds = (faqId: string, sceneId: string): number =>
  (voDurations as Record<string, number>)[`${faqId}/${sceneId}`] ?? 3;

/** Single source of truth for scene timing — used by the video AND the audio mix. */
export const buildTimeline = (faq: Faq) => {
  let cursor = 0;
  const scenes: TimedScene[] = faq.scenes.map((s) => {
    const voSec = voSeconds(faq.id, s.id);
    const lastGesture = Math.max(0, ...(s.gestures ?? []).map((g) => g.at + 2.2));
    const sec = Math.max(s.minSec ?? MIN_SEC[s.kind], VO_LEAD + voSec + TAIL_SEC[s.kind], lastGesture);
    const duration = Math.round(sec * FPS);
    const from = cursor;
    cursor += duration;
    return {
      ...s,
      from,
      duration,
      voSec,
      voFrom: from + Math.round(VO_LEAD * FPS),
      gesturesTimed: (s.gestures ?? []).map((g) => ({ ...g, frame: Math.round(g.at * FPS) })),
    };
  });
  return { scenes, durationInFrames: cursor };
};

export type AudioCue = { src: string; frame: number; volume: number };

/** Every sound in the video. Used by <Audio> in the composition and by the local ffmpeg mix. */
export const audioCues = (faq: Faq): AudioCue[] => {
  const { scenes } = buildTimeline(faq);
  const cues: AudioCue[] = [];
  for (const s of scenes) {
    cues.push({ src: `vo/${faq.id}/${s.id}.wav`, frame: s.voFrom, volume: 1 });
    if (s.kind === "hook") cues.push({ src: "sfx/pop.wav", frame: s.from + 8, volume: 0.45 });
    if (s.kind === "step" && s === scenes.find((x) => x.kind === "step")) cues.push({ src: "sfx/swoosh.wav", frame: s.from, volume: 0.4 });
    if (s.kind === "outro") {
      cues.push({ src: "sfx/swoosh.wav", frame: s.from - 8, volume: 0.35 });
      cues.push({ src: "sfx/pop.wav", frame: s.from + 4, volume: 0.5 });
      cues.push({ src: "sfx/chime.wav", frame: s.from + 6, volume: 0.32 });
    }
    for (const g of s.gesturesTimed) cues.push({ src: "sfx/tap.wav", frame: s.from + g.frame, volume: 0.55 });
  }
  return cues;
};
