// FAQ 7 — layout system demo ("How do I join a contest?").
// One video that uses every scene layout once, in the green reference palette.
// Screen coordinates are in the 390 × 844 app-mockup space.
import type { TortyPose } from "../torty/TortyCutout";
import { FPS, VO_LEAD, voSeconds } from "./timeline";

export type SceneLayout =
  | "intro" //            headline + phone mockup + Torty
  | "full-text" //        whole phone on the background, text above OR below it
  | "half" //             big phone cut by the frame edge (half visible), text in the other half
  | "full-clean" //       whole phone on the background, no text at all
  | "torty-text" //       Torty full pose + text
  | "pointers-num" //     full screen + numbered pointers + peeking Torty
  | "pointers-icon" //    full screen + icon pointers + peeking Torty
  | "outro"; //           closing slide

export type Tap = { x: number; y: number; at: number; kind?: "tap" | "swipe-down" | "hold" };
export type Pointer = {
  /** element being pointed at — app-screen coords (390 × 844) */
  tx: number;
  ty: number;
  /** where the badge sits — VIDEO coords (on the background beside the phone) */
  bx: number;
  by: number;
  /** seconds into the scene */
  at: number;
  icon?: "steps" | "medal" | "tree" | "coin";
};

export type LayoutScene = {
  id: string;
  layout: SceneLayout;
  vo: string;
  chip?: string;
  title?: string;
  accent?: string;
  textPos?: "top" | "bottom";
  screenHalf?: "top" | "bottom";
  screen?: {
    comp: "home" | "home-tabbar" | "contest-list" | "contest-detail" | "koins-1" | "koins-2" | "koins-3" | "koins-redeemed" | "home-sync";
    taps?: Tap[];
    /** unused by phone layouts; kept for full-bleed experiments */
    camY?: number;
    /** for contest-detail: [join, confirm] tap times in s; negative = already happened */
    detailTaps?: [number, number];
  };
  pointers?: Pointer[];
  torty?: TortyPose;
  /** pointer layouts: which side of the phone Torty peeks from */
  peekSide?: "left" | "right";
  minSec?: number;
};

export const LAYOUT_DEMO = {
  id: "FAQ7-LayoutsDemo",
  scenes: [
    {
      id: "intro",
      layout: "intro",
      vo: "Want to join a step contest on Koshiqa? Here's how.",
      title: "Join a contest",
      accent: "contest",
      torty: "curious",
      minSec: 5,
    },
    {
      id: "s1",
      layout: "full-text",
      textPos: "top",
      title: "Tap Contests",
      accent: "Contests",
      vo: "First, open the Contests tab at the bottom of your home screen.",
      screen: { comp: "home-tabbar", camY: 151, taps: [{ x: 146, y: 796, at: 2.6 }] },
    },
    {
      id: "s2",
      layout: "full-text",
      textPos: "bottom",
      title: "Pick a contest",
      accent: "contest",
      vo: "Browse the open contests, and tap the one you like.",
      screen: { comp: "contest-list", camY: 60, taps: [{ x: 195, y: 300, at: 2.4 }] },
    },
    {
      id: "s3",
      layout: "pointers-num",
      vo: "Before joining, check three things. The daily step goal, the contest dates, and what you can win.",
      screen: { comp: "contest-detail", camY: 0, detailTaps: [999, 999] },
      pointers: [
        { tx: 190, ty: 356, bx: 975, by: 857, at: 2.0 },
        { tx: 250, ty: 430, bx: 975, by: 1000, at: 3.4 },
        { tx: 292, ty: 504, bx: 975, by: 1143, at: 4.9 },
      ],
      torty: "curious",
      peekSide: "left",
      minSec: 7.5,
    },
    {
      id: "s4",
      layout: "half",
      screenHalf: "top",
      title: "Tap Join",
      accent: "Join",
      vo: "Happy with it? Tap Join Contest.",
      screen: { comp: "contest-detail", camY: 483, detailTaps: [1.6, 999] },
      minSec: 5,
    },
    {
      id: "s5",
      layout: "full-clean",
      vo: "Confirm your entry, and you're in!",
      screen: { comp: "contest-detail", camY: 151, detailTaps: [-10, 1.3] },
      minSec: 5,
    },
    {
      id: "s6",
      layout: "torty-text",
      title: "10K steps daily",
      accent: "10K",
      vo: "Now just walk ten thousand steps, every single day.",
      torty: "celebrate",
      minSec: 5,
    },
    {
      id: "s7",
      layout: "pointers-icon",
      vo: "Track your steps on the home screen, and earn a medal, a tree, and Koshiqa koins.",
      screen: { comp: "home", camY: 0 },
      pointers: [
        { tx: 280, ty: 238, bx: 975, by: 700, at: 0.9, icon: "steps" },
        { tx: 55, ty: 520, bx: 105, by: 1000, at: 3.0, icon: "medal" },
        { tx: 55, ty: 616, bx: 105, by: 1300, at: 3.8, icon: "tree" },
        { tx: 300, ty: 82, bx: 975, by: 420, at: 4.8, icon: "coin" },
      ],
      torty: "happy",
      peekSide: "right",
      minSec: 7,
    },
    {
      id: "outro",
      layout: "outro",
      title: "See you there!",
      accent: "there!",
      vo: "That's it! See you on the leaderboard.",
      torty: "wave",
      minSec: 5.5,
    },
  ] as LayoutScene[],
};

const TAIL: Record<SceneLayout, number> = {
  intro: 0.8, "full-text": 1.0, half: 1.0, "full-clean": 1.0, "torty-text": 1.0, "pointers-num": 1.0, "pointers-icon": 1.0, outro: 2.2,
};

export type TimedLayoutScene = LayoutScene & { from: number; duration: number; voFrom: number; voSec: number };

export const buildLayoutTimeline = () => {
  let cursor = 0;
  const scenes: TimedLayoutScene[] = LAYOUT_DEMO.scenes.map((s) => {
    const voSec = voSeconds(LAYOUT_DEMO.id, s.id);
    const lastTap = Math.max(0, ...(s.screen?.taps ?? []).map((t) => t.at + 2.0), ...(s.screen?.detailTaps ?? []).filter((t) => t < 100).map((t) => t + 2.2));
    const sec = Math.max(s.minSec ?? 5.5, VO_LEAD + voSec + TAIL[s.layout], lastTap);
    const duration = Math.round(sec * FPS);
    const t = { ...s, from: cursor, duration, voSec, voFrom: cursor + Math.round(VO_LEAD * FPS) };
    cursor += duration;
    return t;
  });
  return { scenes, durationInFrames: cursor };
};

export const layoutAudioCues = () => {
  const { scenes } = buildLayoutTimeline();
  const cues: { src: string; frame: number; volume: number }[] = [];
  for (const s of scenes) {
    cues.push({ src: `vo/${LAYOUT_DEMO.id}/${s.id}.wav`, frame: s.voFrom, volume: 1 });
    if (s.layout === "intro" || s.layout === "torty-text") cues.push({ src: "sfx/pop.wav", frame: s.from + 6, volume: 0.35 });
    if (s.layout === "outro") cues.push({ src: "sfx/chime.wav", frame: s.from + 6, volume: 0.28 });
    if (s.layout !== "intro") cues.push({ src: "sfx/swoosh.wav", frame: Math.max(0, s.from - 4), volume: 0.22 });
    for (const t of s.screen?.taps ?? []) cues.push({ src: "sfx/tap.wav", frame: s.from + Math.round(t.at * FPS), volume: 0.45 });
    for (const t of s.screen?.detailTaps ?? []) if (t >= 0 && t < 100) cues.push({ src: "sfx/tap.wav", frame: s.from + Math.round(t * FPS), volume: 0.45 });
    for (const p of s.pointers ?? []) cues.push({ src: "sfx/pop.wav", frame: s.from + Math.round(p.at * FPS), volume: 0.25 });
  }
  return cues;
};
