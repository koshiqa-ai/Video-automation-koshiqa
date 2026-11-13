// Explainer motion kit: scene list, timing and sound cues (data only, so Node scripts can read it).
export type Role = "pop" | "focus" | "success" | "tap" | "zoom";
export const MOTION_SCENES: { code: string; name: string; ref: string; sec: number; cues: [number, Role][] }[] = [
  { code: "E1", name: "Progress ring", ref: "0:06 percentage ring", sec: 4.2, cues: [[4, "pop"], [80, "success"]] },
  { code: "E2", name: "Dots to cycle", ref: "0:22 framework cycle", sec: 5.4, cues: [[6, "pop"], [42, "zoom"], [80, "focus"], [112, "pop"]] },
  { code: "E3", name: "Section navigator", ref: "3:00 chapter dots", sec: 3.6, cues: [[2, "pop"], [18, "focus"], [38, "pop"]] },
  { code: "E4", name: "Staircase", ref: "2:04 3D steps", sec: 5.0, cues: [[6, "zoom"], [70, "success"], [122, "pop"]] },
  { code: "E5", name: "Chart + goal line", ref: "11:52 graph, 1:06 line", sec: 4.8, cues: [[2, "pop"], [26, "zoom"], [62, "focus"], [104, "success"]] },
  { code: "E6", name: "Bracket list", ref: "6:04 4D framework", sec: 3.8, cues: [[40, "pop"], [60, "pop"], [80, "pop"]] },
  { code: "E7", name: "Highlight box", ref: "7:50 kinetic text", sec: 3.4, cues: [[52, "focus"]] },
  { code: "E8", name: "Clock + bar", ref: "10:40 clock + caffeine bar", sec: 4.6, cues: [[8, "pop"], [120, "success"]] },
  { code: "E9", name: "Glass caption pill", ref: "4:02 caption pill", sec: 3.4, cues: [[30, "pop"]] },
  { code: "E10", name: "Number cards + roll", ref: "10:24 + 5:36 cards", sec: 4.4, cues: [[10, "pop"], [36, "zoom"], [52, "pop"], [104, "success"]] },
  { code: "E11", name: "Icon tiles", ref: "6:15 icon buttons", sec: 3.8, cues: [[24, "pop"], [42, "pop"], [60, "pop"], [78, "pop"]] },
  { code: "E12", name: "Bullet line", ref: "8:16 question list", sec: 3.8, cues: [[20, "pop"], [46, "pop"], [72, "pop"]] },
  { code: "E13", name: "Floating cards", ref: "5:16 floating app widgets", sec: 3.6, cues: [[24, "pop"], [40, "pop"], [56, "pop"]] },
  { code: "E14", name: "Line to streak", ref: "2:26 line into humps", sec: 4.4, cues: [[34, "zoom"], [66, "pop"], [108, "success"]] },
];
const fr = (s: number) => Math.round(s * 30);
export const motionTimeline = () => {
  let t = 0;
  return MOTION_SCENES.map((s) => { const from = t; t += fr(s.sec); return { ...s, from, duration: fr(s.sec) }; });
};
export const motionDuration = () => MOTION_SCENES.reduce((a, s) => a + fr(s.sec), 0);
const VOL: Record<Role, number> = { pop: 0.26, focus: 0.3, success: 0.3, tap: 0.4, zoom: 0.18 };
export const motionCues = () =>
  motionTimeline().flatMap((s) => [
    ...(s.from > 0 ? [{ src: "sfx/packs/soft/transition.wav", frame: s.from - 3, volume: 0.2 }] : []),
    ...s.cues.map(([at, r]) => ({ src: `sfx/packs/soft/${r}.wav`, frame: s.from + at, volume: VOL[r] })),
  ]);

// ───────── content each scene takes in a video spec (`code: "E5", motion: {...}`) ─────────
// Missing fields fall back to MOTION_DEFAULTS (the review-reel content).
import type { PeekExpr, PeekSide } from "../data/layout-system";
export type MotionContent = {
  E1: { title: string; accent?: string; value: number; label: string }; // value = 0–100 (%)
  E2: { title: string; labels: [string, string, string] }; // a loop of 3
  E3: { part: 1 | 2 | 3; title: string }; // "PART n OF 3"
  E4: { first: string; next: string };
  E5: { pill: string; values: number[]; goal: number; goalLabel: string; axis: string; bestLabel: string; days?: string[] }; // 7 values
  E6: { title: string; items: string[] }; // 3 items
  E7: { line1: string; line2: string; box?: [number, number] }; // box = word range of line2 (default: all of it)
  E8: { title: string; accent?: string; barLabel: string; fromHour?: number; hours?: number };
  E9: { caption: string }; // over the slide's `screen`
  E10: { title: string; accent?: string; from: number; to: number; fromLabel: string; toLabel: string; footer: string }; // to < 100
  E11: { title: string; accent?: string; tiles: { icon: string; text: string }[] }; // 2–4 tiles
  E12: { title: string; accent?: string; items: string[] }; // 2–4 items
  E13: { cards: { icon: string; text: string }[] }; // 3 cards around the slide's `screen`
  E14: { title: string; accent?: string; line: string; filled?: number; days?: string[] }; // filled = days lit (0–7); days = 7 labels (default M T W T F S S)
};
export type MotionCode = keyof MotionContent;
export const MOTION_DEFAULTS: { [K in MotionCode]: MotionContent[K] } = {
  E1: { title: "Almost there!", accent: "there!", value: 95, label: "of today's 10K goal" },
  E2: { title: "Walk. Earn. Redeem.", labels: ["Walk", "Earn", "Redeem"] },
  E3: { part: 1, title: "Earn koins" },
  E4: { first: "Take the first step", next: "Then the next one" },
  E5: { pill: "Your week", values: [6.2, 8.4, 11.2, 9.1, 12.6, 7.4, 10.8], goal: 10, goalLabel: "10K goal", axis: "STEPS", bestLabel: "Best day!" },
  E6: { title: "3 ways to earn koins", items: ["Walk daily", "Join contests", "Hit your goal"] },
  E7: { line1: "Every step you walk", line2: "counts for your team" },
  E8: { title: "Syncs all day", accent: "all day", barLabel: "Steps synced" },
  E9: { caption: "Your connected account" },
  E10: { title: "Build your streak", accent: "streak", from: 1, to: 30, fromLabel: "Day", toLabel: "Days", footer: "Keep the chain going" },
  E11: { title: "How it works", accent: "works", tiles: [{ icon: "steps", text: "Walk" }, { icon: "refresh", text: "Sync" }, { icon: "coin", text: "Earn" }, { icon: "gift", text: "Redeem" }] },
  E12: { title: "Quick check", accent: "check", items: ["Did my steps sync?", "Is tracking on?", "Same Google account?"] },
  E13: { cards: [{ icon: "coin", text: "+500 koins" }, { icon: "check-circle", text: "Steps synced" }, { icon: "trophy", text: "New contest" }] },
  E14: { title: "7 days in a row", accent: "7 days", line: "One walk at a time", filled: 7 },
};
/** default corner peek per scene (null = no peek: E9/E13 show a phone, E2 uses the whole frame) */
export const MOTION_PEEK: Record<MotionCode, { expr: PeekExpr; side: PeekSide } | null> = {
  E1: { expr: "happy", side: "right" }, E2: null, E3: { expr: "smile", side: "left" }, E4: { expr: "determined", side: "right" },
  E5: { expr: "excited", side: "left" }, E6: { expr: "happy", side: "right" }, E7: { expr: "smile", side: "left" }, E8: { expr: "wink", side: "right" },
  E9: null, E10: { expr: "excited", side: "left" }, E11: { expr: "smile", side: "right" }, E12: { expr: "thinking", side: "right" }, E13: null, E14: { expr: "happy", side: "left" },
};
export const motionScene = (code: string) => MOTION_SCENES.find((s) => s.code === code);
