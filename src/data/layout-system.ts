// Koshiqa help-video LAYOUT SYSTEM (v4) — the small, fixed set every video reuses.
// Slide data + geometry only (no React), so Node scripts and design.md can read the same numbers.
//
//   S1–S4  phone screen layouts (S4 = no Torty only)
//   F1–F2  full Torty + text (no phone)
//   P1–P2  pointer slides (full screen, no phone): numbered / icons
//   T1–T2  steps: full-screen list ("table of contents") / progress timeline over a phone layout
//   K1–K8  annotations
import type { TimedLayoutScene } from "./faq-layouts";

type Screen = NonNullable<TimedLayoutScene["screen"]>;
/** flat-style Torty poses (public/torty/flat, cut from the expression sheet) */
export type FlatPose = "idle" | "smile" | "happy" | "excited" | "thinking" | "surprised" | "worried" | "sad" | "confused" | "shy" | "wink" | "determined" | "sleeping";
export type PeekExpr = Exclude<FlatPose, "sleeping">;
export type PeekSide = "left" | "right";
export type PhoneLayout = "S1" | "S2" | "S3" | "S4";

// ───────── geometry (1080 × 1920) ─────────
export const PHONE_W0 = 414; // phone incl. bezel at scale 1
export const PHONE_H0 = 868;
export const LS = {
  margin: 70,
  headline: { top: 80, size: 84, maxWords: 4 }, // one line, centred
  phoneTopUnderHeadline: 230,
  /** phone bottom for S1/S2 — the same with or without Torty; a peeking Torty overlaps the phone's bottom corner */
  phoneBottom: 1850,
  /** area Torty covers in his corner (keep the element being explained out of it) */
  peekZone: { w: 330, h: 470 },
  peek: { height: 490, sink: 30, centreX: 150, tilt: 10 }, // head + arms + shell down to the hips; cut edge sinks 30px below the frame
  closeUp: { scale: 2.3, bottomWithTorty: 1300, bottomNoTorty: 1480, headlineGap: 90 }, // S3 headline must clear his head
  fullTorty: { height: 1000, textSize: 104, top: 300, gap: 70 }, // height = body (feet to head), effect marks extra
  list: { headingTop: 430, headingSize: 104, top: 620, badge: 140, text: 70, gap: 64, eyebrowTop: 350, maxItems: 4 },
  timeline: { y: 96, dot: 76, xs: [220, 540, 860], labelSize: 34 },
};

export type Geo = { x: number; y: number; s: number };
const centred = (s: number, y: number): Geo => ({ x: (1080 - PHONE_W0 * s) / 2, y, s });

/** phone geometry for a layout, with or without a peeking Torty */
export const phoneGeo = (layout: PhoneLayout, torty: boolean): Geo => {
  const bottom = LS.phoneBottom;
  if (layout === "S1") return centred((bottom - LS.margin) / PHONE_H0, LS.margin);
  if (layout === "S2") return centred((bottom - LS.phoneTopUnderHeadline) / PHONE_H0, LS.phoneTopUnderHeadline);
  const s = LS.closeUp.scale;
  if (layout === "S3") return centred(s, (torty ? LS.closeUp.bottomWithTorty : LS.closeUp.bottomNoTorty) - PHONE_H0 * s);
  return centred(s, LS.phoneTopUnderHeadline); // S4: rises from the bottom edge
};
/** where the headline goes for a layout (null = no headline) */
export const headlineTop = (layout: PhoneLayout, torty: boolean) =>
  layout === "S1" ? null : layout === "S3" ? (torty ? LS.closeUp.bottomWithTorty : LS.closeUp.bottomNoTorty) + LS.closeUp.headlineGap : LS.headline.top;

// ───────── slides ─────────
export type AnnoKind = "tap" | "hold" | "swipe" | "ring" | "spotlight" | "tooltip" | "success" | "hand";

export type LSSlide = {
  code: string;
  row: number;
  name: string;
  kind: "phone" | "full-torty" | "pointer" | "toc" | "timeline" | "anno";
  layout?: PhoneLayout;
  peek?: { expr: PeekExpr; side: PeekSide };
  title?: string;
  accent?: string;
  screen?: Screen;
  fullTorty?: { pose: FlatPose; textOnTop: boolean };
  list?: { style: "num" | "icon" | "toc"; eyebrow?: string; items: { text: string; icon?: string }[]; times: number[] };
  timeline?: { labels: string[]; current: number };
  anno?: { kind: AnnoKind; target?: { x: number; y: number; w: number; h: number; r?: number }; label?: string };
  sec: number;
};

const phoneRow = (row: number, side: PeekSide | null): LSSlide[] => {
  const peek = (l: PeekExpr, r: PeekExpr) => (side ? { peek: { expr: side === "left" ? l : r, side } } : {});
  const tag = side ? ` · peek ${side}` : " · no Torty";
  const list: LSSlide[] = [
    { code: "S1", row, kind: "phone", layout: "S1", name: `Phone${tag}`, ...peek("thinking", "smile"), screen: { comp: "home-tabbar", taps: [{ x: 146, y: 796, at: 1.6 }] }, sec: 3.4 },
    { code: "S2", row, kind: "phone", layout: "S2", name: `Phone + headline${tag}`, ...peek("happy", "surprised"), title: "Pick a contest", accent: "contest", screen: { comp: "contest-list", taps: [{ x: 195, y: 300, at: 1.6 }] }, sec: 3.4 },
    { code: "S3", row, kind: "phone", layout: "S3", name: `Close-up + headline${tag}`, ...peek("excited", "wink"), title: "Tap Join", accent: "Join", screen: { comp: "contest-detail", detailTaps: [1.6, 999] }, sec: 3.4 },
  ];
  list.push({ code: "S4", row, kind: "phone", layout: "S4", name: `Close-up top + headline${tag}`, ...peek("determined", "confused"), title: "Your steps", accent: "steps", screen: { comp: "home" }, sec: 3.4 });
  return list;
};

const T_LIST = [0.6, 1.2, 1.8];
export const LS_SLIDES: LSSlide[] = [
  ...phoneRow(1, "left"),
  ...phoneRow(2, "right"),
  { code: "F1", row: 3, kind: "full-torty", name: "Text on top, Torty below", title: "Walk 10K steps daily", accent: "10K", fullTorty: { pose: "excited", textOnTop: true }, sec: 3.2 },
  { code: "F2", row: 3, kind: "full-torty", name: "Torty on top, text below", title: "See you there!", accent: "there!", fullTorty: { pose: "wink", textOnTop: false }, sec: 3.2 },
  ...phoneRow(4, null),
  {
    code: "P1", row: 5, kind: "pointer", name: "Numbered pointers · peek left", title: "Count your steps", accent: "steps", peek: { expr: "thinking", side: "left" }, sec: 3.6,
    list: { style: "num", items: [{ text: "Go to Google Fit" }, { text: "Open the steps" }, { text: "Check mail" }], times: T_LIST },
  },
  {
    code: "P2", row: 5, kind: "pointer", name: "Icon pointers · peek right", title: "Why join?", accent: "join?", peek: { expr: "happy", side: "right" }, sec: 3.6,
    list: { style: "icon", items: [{ text: "Win medals", icon: "trophy" }, { text: "Earn koins", icon: "gift" }, { text: "Walk together", icon: "user" }], times: T_LIST },
  },
  {
    code: "T1", row: 6, kind: "toc", name: "Steps list (full screen)", title: "Join a contest", accent: "contest", peek: { expr: "excited", side: "left" }, sec: 3.6,
    list: { style: "toc", eyebrow: "IN THIS VIDEO", items: [{ text: "Open Contests" }, { text: "Pick a contest" }, { text: "Tap Join" }], times: T_LIST },
  },
  {
    code: "T2", row: 6, kind: "timeline", layout: "S2", name: "Progress timeline on phone", peek: { expr: "smile", side: "right" }, sec: 3.6,
    timeline: { labels: ["Open Contests", "Pick a contest", "Tap Join"], current: 1 }, screen: { comp: "contest-list", taps: [{ x: 195, y: 300, at: 1.8 }] },
  },
  // annotations — all on S2 · no Torty; the headline slot names the annotation
  { code: "K1", row: 7, kind: "anno", layout: "S2", name: "Tap", title: "Tap", anno: { kind: "tap" }, screen: { comp: "home-tabbar", taps: [{ x: 146, y: 796, at: 1.0 }] }, sec: 3 },
  { code: "K2", row: 7, kind: "anno", layout: "S2", name: "Long press", title: "Long press", anno: { kind: "hold" }, screen: { comp: "home", taps: [{ x: 195, y: 520, at: 0.9, kind: "hold" }] }, sec: 3 },
  { code: "K3", row: 7, kind: "anno", layout: "S2", name: "Swipe", title: "Swipe", anno: { kind: "swipe" }, screen: { comp: "home-sync", taps: [{ x: 195, y: 210, at: 0.8, kind: "swipe-down" }] }, sec: 3.4 },
  { code: "K4", row: 7, kind: "anno", layout: "S2", name: "Highlight ring", title: "Highlight ring", anno: { kind: "ring", target: { x: 318, y: 82, w: 112, h: 46, r: 23 } }, screen: { comp: "home" }, sec: 3 },
  { code: "K5", row: 7, kind: "anno", layout: "S2", name: "Spotlight", title: "Spotlight", anno: { kind: "spotlight", target: { x: 195, y: 520, w: 366, h: 86, r: 22 } }, screen: { comp: "home" }, sec: 3 },
  { code: "K6", row: 7, kind: "anno", layout: "S2", name: "Label tooltip (dark)", title: "Label tooltip", anno: { kind: "tooltip", target: { x: 318, y: 82, w: 112, h: 46 }, label: "Your koins" }, screen: { comp: "home" }, sec: 3 },
  { code: "K7", row: 7, kind: "anno", layout: "S2", name: "Success", title: "Success", anno: { kind: "success" }, screen: { comp: "contest-detail", detailTaps: [-10, 0.5] }, sec: 3.4 },
  { code: "K8", row: 7, kind: "anno", layout: "S2", name: "Torty hand tap", title: "Torty hand tap", anno: { kind: "hand", target: { x: 146, y: 796, w: 0, h: 0 } }, screen: { comp: "home-tabbar", taps: [{ x: 146, y: 796, at: 1.3 }] }, sec: 3.4 },
];

export const LS_ROWS = [
  "1 · Torty peeking (left)",
  "2 · Torty peeking (right)",
  "3 · Full Torty",
  "4 · No Torty",
  "5 · Pointers",
  "6 · Steps",
  "7 · Annotations",
];

const fr = (s: number) => Math.round(s * 30);
export const lsTimeline = () => {
  let t = 0;
  return LS_SLIDES.map((s) => {
    const from = t;
    const duration = fr(s.sec);
    t += duration;
    return { ...s, from, duration };
  });
};
export const lsDuration = () => LS_SLIDES.reduce((a, s) => a + fr(s.sec), 0);

export const lsCues = () => {
  const pack = "sfx/packs/soft";
  return lsTimeline().flatMap((s) => {
    const c: { src: string; frame: number; volume: number }[] = [];
    if (s.from > 0) c.push({ src: `${pack}/transition.wav`, frame: s.from - 3, volume: 0.2 });
    for (const t of s.screen?.taps ?? []) c.push({ src: `${pack}/tap.wav`, frame: s.from + fr(t.at), volume: 0.45 });
    for (const t of s.screen?.detailTaps ?? []) if (t >= 0 && t < 100) c.push({ src: `${pack}/tap.wav`, frame: s.from + fr(t), volume: 0.45 });
    for (const t of s.list?.times ?? []) c.push({ src: `${pack}/pop.wav`, frame: s.from + fr(t), volume: 0.28 });
    if (s.peek) c.push({ src: `${pack}/pop.wav`, frame: s.from + 10, volume: 0.16 });
    const k = s.anno?.kind;
    if (k === "ring" || k === "spotlight" || k === "tooltip") c.push({ src: `${pack}/focus.wav`, frame: s.from + fr(0.6), volume: 0.3 });
    if (k === "success") c.push({ src: `${pack}/success.wav`, frame: s.from + fr(0.9), volume: 0.32 });
    if (k === "hand") c.push({ src: `${pack}/transition.wav`, frame: s.from + fr(0.35), volume: 0.12 });
    if (s.kind === "timeline") c.push({ src: `${pack}/focus.wav`, frame: s.from + fr(0.5), volume: 0.25 });
    return c;
  });
};

/** the frame used for the review grid (late in each slide, after its animation) */
export const lsStillFrame = (s: { from: number; duration: number; anno?: LSSlide["anno"] }) =>
  s.anno?.kind === "success" ? s.from + 48 : s.anno?.kind === "hand" ? s.from + 39 : s.anno?.kind === "swipe" ? s.from + 34 : s.from + s.duration - 8;
