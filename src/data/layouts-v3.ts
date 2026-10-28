// Layout catalogue v3 + annotation kit — slide data only (no React), so Node scripts can read it.
//
// Rules locked in this version:
//   • the phone is always horizontally centred in the frame
//   • with a phone on screen, Torty only PEEKS (side edge or bottom corner); full-body Torty never shares a slide with a phone
//   • all text is centre-aligned, in fixed positions
import type { TimedLayoutScene } from "./faq-layouts";
import type { TortyPose } from "../torty/TortyCutout";

type Screen = NonNullable<TimedLayoutScene["screen"]>;
type P = { x: number; y: number };

export type PeekSpot = "left" | "right" | "bottom-left" | "bottom-right";

export type Marker = {
  /** element, app-screen coords */
  tx: number;
  ty: number;
  /** badge position, video px (beside the phone) */
  bx: number;
  by: number;
  at: number;
  icon?: "steps" | "medal" | "tree" | "coin" | "check";
};

export type V3Slide = {
  code: string;
  name: string;
  /** "none" = full-frame text + full-body Torty, no phone */
  phone: "full" | "top-half" | "bottom-half" | "none";
  peek?: { pose: TortyPose; spot: PeekSpot };
  fullTorty?: { pose: TortyPose; place: "below-text" | "above-text" };
  title?: string;
  accent?: string;
  screen?: Screen;
  points?: { variant: "num" | "icon"; heading: string; items: { text: string; icon?: string }[]; times?: number[] };
  markers?: Marker[];
  /** code of a slide in pointer-layouts.ts */
  pointer?: string;
  sec: number;
};

export const V3_SLIDES: V3Slide[] = [
  // A — full phone, centred
  { code: "A1", name: "Full phone · side peek", phone: "full", peek: { pose: "curious", spot: "right" }, screen: { comp: "home-tabbar", taps: [{ x: 146, y: 796, at: 1.8 }] }, sec: 4 },
  { code: "A2", name: "Full phone · side peek · text", phone: "full", peek: { pose: "happy", spot: "left" }, title: "Pick a contest", accent: "contest", screen: { comp: "contest-list", taps: [{ x: 195, y: 300, at: 1.8 }] }, sec: 4 },
  { code: "A3", name: "Full phone · corner peek", phone: "full", peek: { pose: "curious", spot: "bottom-right" }, screen: { comp: "contest-detail", detailTaps: [999, 999] }, sec: 4 },
  { code: "A4", name: "Full phone · corner peek · text", phone: "full", peek: { pose: "happy", spot: "bottom-left" }, title: "Tap Join", accent: "Join", screen: { comp: "contest-detail", detailTaps: [1.6, 999] }, sec: 4 },
  // B — top half of the phone (rises from the bottom edge)
  { code: "B1", name: "Top half · side peek", phone: "top-half", peek: { pose: "curious", spot: "right" }, screen: { comp: "home" }, sec: 3.5 },
  { code: "B2", name: "Top half · side peek · text", phone: "top-half", peek: { pose: "happy", spot: "left" }, title: "Your steps", accent: "steps", screen: { comp: "home" }, sec: 3.5 },
  // C — bottom half of the phone (hangs from the top edge)
  { code: "C1", name: "Bottom half · corner peek · text", phone: "bottom-half", peek: { pose: "curious", spot: "bottom-right" }, title: "Confirm & join", accent: "join", screen: { comp: "contest-detail", detailTaps: [-10, 999] }, sec: 3.5 },
  { code: "C2", name: "Bottom half · side peek", phone: "bottom-half", peek: { pose: "thumbs-up", spot: "left" }, screen: { comp: "contest-detail", detailTaps: [-10, 999] }, sec: 3.5 },
  // D — step list written over the phone
  { code: "D1", name: "Points over phone · numbers", phone: "full", peek: { pose: "curious", spot: "bottom-left" }, screen: { comp: "home" }, points: { variant: "num", heading: "Join in 3 steps", items: [{ text: "Open Contests" }, { text: "Pick a contest" }, { text: "Tap Join" }] }, sec: 4.5 },
  { code: "D2", name: "Points over phone · icons", phone: "full", peek: { pose: "happy", spot: "bottom-right" }, screen: { comp: "home" }, points: { variant: "icon", heading: "You win", items: [{ text: "Finisher medal", icon: "🏅" }, { text: "A tree planted", icon: "🌳" }, { text: "500 koins", icon: "coin" }] }, sec: 4.5 },
  // E — heading + numbered / icon list ABOVE the phone (rendered by PointerLayouts.tsx)
  { code: "E1", name: "Number pointers above phone", phone: "full", pointer: "E1", sec: 7.2 },
  { code: "E2", name: "Icon pointers above phone", phone: "full", pointer: "E2", sec: 6 },
  // F — full-frame text + full-body Torty (no phone)
  { code: "F1", name: "Text + full Torty (text on top)", phone: "none", fullTorty: { pose: "celebrate", place: "below-text" }, title: "Walk 10K steps daily", accent: "10K", sec: 3.5 },
  { code: "F2", name: "Text + full Torty (text below)", phone: "none", fullTorty: { pose: "wave", place: "above-text" }, title: "See you there!", accent: "there!", sec: 3.5 },
];

// ───────── Annotation kit ─────────
export type KitItem = {
  code: string;
  name: string;
  kind: "tap" | "hold" | "swipe" | "ring" | "spotlight" | "zoom" | "num-markers" | "icon-markers" | "tooltip" | "list-num" | "list-icon" | "success" | "bubble" | "hand" | "dot-circle" | "dot-rect";
  screen: Screen;
  /** element for ring / spotlight / zoom / tooltip, app-screen coords */
  target?: { x: number; y: number; w: number; h: number; r?: number };
  label?: string;
  markers?: Marker[];
  points?: V3Slide["points"];
  sec: number;
};

export const KIT: KitItem[] = [
  { code: "K1", name: "Tap ripple", kind: "tap", screen: { comp: "home-tabbar", taps: [{ x: 146, y: 796, at: 1.0 }] }, sec: 3 },
  { code: "K2", name: "Long-press", kind: "hold", screen: { comp: "home", taps: [{ x: 195, y: 520, at: 1.0, kind: "hold" }] }, sec: 3 },
  { code: "K3", name: "Swipe / pull to refresh", kind: "swipe", screen: { comp: "home-sync", taps: [{ x: 195, y: 210, at: 0.9, kind: "swipe-down" }] }, sec: 3.5 },
  { code: "K4", name: "Highlight ring", kind: "ring", screen: { comp: "home" }, target: { x: 318, y: 82, w: 112, h: 46, r: 23 }, sec: 3 },
  { code: "K5", name: "Spotlight", kind: "spotlight", screen: { comp: "home" }, target: { x: 195, y: 520, w: 366, h: 86, r: 22 }, sec: 3 },
  { code: "K6", name: "Push-in zoom", kind: "zoom", screen: { comp: "home" }, target: { x: 195, y: 290, w: 0, h: 0 }, sec: 3 },
  { code: "K7", name: "Label tooltip", kind: "tooltip", screen: { comp: "home" }, target: { x: 318, y: 82, w: 112, h: 46 }, label: "Your koins", sec: 3 },
  { code: "K8", name: "Step list · numbers", kind: "list-num", screen: { comp: "home" }, sec: 3.5, points: { variant: "num", heading: "Join in 3 steps", items: [{ text: "Open Contests" }, { text: "Pick a contest" }, { text: "Tap Join" }], times: [0.8, 1.4, 2.0] } },
  { code: "K9", name: "Step list · icons", kind: "list-icon", screen: { comp: "home" }, sec: 3.5, points: { variant: "icon", heading: "You win", items: [{ text: "Finisher medal", icon: "🏅" }, { text: "A tree planted", icon: "🌳" }, { text: "500 koins", icon: "coin" }], times: [0.8, 1.4, 2.0] } },
  { code: "K10", name: "Success tick + confetti", kind: "success", screen: { comp: "contest-detail", detailTaps: [-10, 0.6] }, sec: 3.5 },
  { code: "K11", name: "Torty speech bubble", kind: "bubble", screen: { comp: "home" }, label: "Don't skip this!", sec: 3 },
  { code: "K12", name: "Torty hand tap", kind: "hand", screen: { comp: "home-tabbar", taps: [{ x: 146, y: 796, at: 1.3 }] }, target: { x: 146, y: 796, w: 0, h: 0 }, sec: 3.5 },
  { code: "K13", name: "Dotted red circle", kind: "dot-circle", screen: { comp: "home" }, target: { x: 195, y: 292, w: 230, h: 230 }, sec: 3 },
  { code: "K14", name: "Dotted red rectangle", kind: "dot-rect", screen: { comp: "home" }, target: { x: 195, y: 520, w: 366, h: 86, r: 22 }, sec: 3 },
];

const fr = (s: number) => Math.round(s * 30);
const timed = <T extends { sec: number }>(list: T[]) => {
  let t = 0;
  return list.map((s) => {
    const from = t;
    const duration = fr(s.sec);
    t += duration;
    return { ...s, from, duration };
  });
};
export const v3Timeline = () => timed(V3_SLIDES);
export const kitTimeline = () => timed(KIT);
export const v3Duration = () => V3_SLIDES.reduce((a, s) => a + fr(s.sec), 0);
export const kitDuration = () => KIT.reduce((a, s) => a + fr(s.sec), 0);

/** Soft-UI pack cues for either reel */
import { POINTER_SLIDES } from "./pointer-layouts";

export const reelCues = (which: "v3" | "kit") => {
  const pack = "sfx/packs/soft";
  const list = which === "v3" ? v3Timeline() : kitTimeline();
  return list.flatMap((s) => {
    const c: { src: string; frame: number; volume: number }[] = [];
    if (s.from > 0) c.push({ src: `${pack}/transition.wav`, frame: s.from - 3, volume: 0.2 });
    const ptr = POINTER_SLIDES.find((x) => x.code === (s as { pointer?: string }).pointer);
    if (ptr) {
      ptr.times.forEach((t) => c.push({ src: `${pack}/pop.wav`, frame: s.from + fr(t), volume: 0.28 }));
      for (const x of ptr.screens) {
        for (const t of x.screen.taps ?? []) c.push({ src: `${pack}/tap.wav`, frame: s.from + fr(x.from + t.at), volume: 0.45 });
        for (const t of x.screen.detailTaps ?? []) if (t >= 0 && t < 100) c.push({ src: `${pack}/tap.wav`, frame: s.from + fr(x.from + t), volume: 0.45 });
      }
      return c;
    }
    const sc = s.screen;
    for (const t of sc?.taps ?? []) c.push({ src: `${pack}/tap.wav`, frame: s.from + fr(t.at), volume: 0.45 });
    for (const t of sc?.detailTaps ?? []) if (t >= 0 && t < 100) c.push({ src: `${pack}/tap.wav`, frame: s.from + fr(t), volume: 0.45 });
    for (const m of s.markers ?? []) c.push({ src: `${pack}/pop.wav`, frame: s.from + fr(m.at), volume: 0.28 });
    const pts = s.points;
    if (pts) (pts.times ?? pts.items.map((_, i) => 1.1 + i * 0.8)).forEach((t) => c.push({ src: `${pack}/pop.wav`, frame: s.from + fr(t), volume: 0.28 }));
    const kind = (s as { kind?: string }).kind;
    if (kind === "ring" || kind === "spotlight" || kind === "tooltip") c.push({ src: `${pack}/focus.wav`, frame: s.from + fr(0.6), volume: 0.3 });
    if (kind === "zoom") c.push({ src: `${pack}/zoom.wav`, frame: s.from + fr(0.5), volume: 0.2 });
    if (kind === "success") c.push({ src: `${pack}/success.wav`, frame: s.from + fr(1.0), volume: 0.32 });
    if (kind === "hand") c.push({ src: `${pack}/transition.wav`, frame: s.from + fr(0.35), volume: 0.12 });
    if (kind === "dot-circle" || kind === "dot-rect") c.push({ src: `${pack}/focus.wav`, frame: s.from + fr(0.5), volume: 0.3 });
    if (kind === "bubble") c.push({ src: `${pack}/pop.wav`, frame: s.from + fr(0.9), volume: 0.3 });
    return c;
  });
};

export type { P };
