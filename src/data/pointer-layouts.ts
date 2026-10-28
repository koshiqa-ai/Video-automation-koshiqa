// Pointer layouts: heading + numbered / icon list in the space ABOVE the phone.
// Slide data only (no React) so Node scripts (audio mixer) can read it.
import type { TimedLayoutScene } from "./faq-layouts";
import type { TortyPose } from "../torty/TortyCutout";

type Screen = NonNullable<TimedLayoutScene["screen"]>;

export type NumStyle = "solid" | "outline" | "stepper" | "card";
export type IconStyle = "solid" | "outline" | "tile" | "emoji";

export type PointerSlide = {
  code: string;
  name: string;
  kind: "num" | "icon";
  style: NumStyle | IconStyle;
  heading: string;
  accent?: string;
  /** icon = name from the line-icon set (ui.tsx PATHS) or an emoji for the "emoji" style */
  items: { text: string; icon?: string }[];
  /** seconds when each point appears */
  times: number[];
  /** phone screens; each starts at `from` seconds (taps are relative to that start) */
  screens: { from: number; screen: Screen }[];
  /** true = the point being spoken is bright, earlier points dim */
  activeHighlight?: boolean;
  peek?: { pose: TortyPose; spot: "bottom-left" | "bottom-right" };
  sec: number;
};

const homeStatic: PointerSlide["screens"] = [{ from: 0, screen: { comp: "home" } }];
const NUM_ITEMS = [{ text: "Open Contests" }, { text: "Pick a contest" }, { text: "Tap Join" }];
const ICON_ITEMS = [
  { text: "Open Google Fit", icon: "phone" },
  { text: "Check your steps", icon: "steps" },
  { text: "Look for our mail", icon: "mail" },
];
const EMOJI_ITEMS = [
  { text: "Open Google Fit", icon: "📱" },
  { text: "Check your steps", icon: "👟" },
  { text: "Look for our mail", icon: "✉️" },
];
const T = [0.6, 1.3, 2.0];

export const POINTER_SLIDES: PointerSlide[] = [
  // the two layouts as they'd run in a real video: phone follows the spoken point
  {
    code: "E1", name: "Number pointers above phone", kind: "num", style: "solid", heading: "Join in 3 steps", accent: "3 steps", items: NUM_ITEMS,
    times: [0.6, 2.6, 4.6], activeHighlight: true, peek: { pose: "curious", spot: "bottom-right" }, sec: 7.2,
    screens: [
      { from: 0, screen: { comp: "home-tabbar", taps: [{ x: 146, y: 796, at: 1.4 }] } },
      { from: 2.4, screen: { comp: "contest-list", taps: [{ x: 195, y: 300, at: 1.0 }] } },
      { from: 4.4, screen: { comp: "contest-detail", detailTaps: [1.0, 999] } },
    ],
  },
  {
    code: "E2", name: "Icon pointers above phone", kind: "icon", style: "solid", heading: "Steps not syncing?", accent: "syncing?", items: ICON_ITEMS,
    times: [0.6, 2.2, 3.8], activeHighlight: true, peek: { pose: "worried", spot: "bottom-right" }, sec: 6,
    screens: [{ from: 0, screen: { comp: "home-sync", taps: [{ x: 195, y: 210, at: 2.4, kind: "swipe-down" }] } }],
  },
  // badge style options (pick one for numbers, one for icons)
  { code: "N1", name: "Numbers · solid circle", kind: "num", style: "solid", heading: "Join in 3 steps", accent: "3 steps", items: NUM_ITEMS, times: T, screens: homeStatic, sec: 3.6 },
  { code: "N2", name: "Numbers · outline ring", kind: "num", style: "outline", heading: "Join in 3 steps", accent: "3 steps", items: NUM_ITEMS, times: T, screens: homeStatic, sec: 3.6 },
  { code: "N3", name: "Numbers · stepper line", kind: "num", style: "stepper", heading: "Join in 3 steps", accent: "3 steps", items: NUM_ITEMS, times: T, screens: homeStatic, sec: 3.6 },
  { code: "N4", name: "Numbers · cream card", kind: "num", style: "card", heading: "Join in 3 steps", accent: "3 steps", items: NUM_ITEMS, times: T, screens: homeStatic, sec: 3.6 },
  { code: "I1", name: "Icons · solid circle", kind: "icon", style: "solid", heading: "Steps not syncing?", accent: "syncing?", items: ICON_ITEMS, times: T, screens: homeStatic, sec: 3.6 },
  { code: "I2", name: "Icons · outline ring", kind: "icon", style: "outline", heading: "Steps not syncing?", accent: "syncing?", items: ICON_ITEMS, times: T, screens: homeStatic, sec: 3.6 },
  { code: "I3", name: "Icons · rounded tile", kind: "icon", style: "tile", heading: "Steps not syncing?", accent: "syncing?", items: ICON_ITEMS, times: T, screens: homeStatic, sec: 3.6 },
  { code: "I4", name: "Icons · emoji in circle", kind: "icon", style: "emoji", heading: "Steps not syncing?", accent: "syncing?", items: EMOJI_ITEMS, times: T, screens: homeStatic, sec: 3.6 },
];

const fr = (s: number) => Math.round(s * 30);
export const pointerTimeline = () => {
  let t = 0;
  return POINTER_SLIDES.map((s) => {
    const from = t;
    const duration = fr(s.sec);
    t += duration;
    return { ...s, from, duration };
  });
};
export const pointerDuration = () => POINTER_SLIDES.reduce((a, s) => a + fr(s.sec), 0);

export const pointerCues = () => {
  const pack = "sfx/packs/soft";
  return pointerTimeline().flatMap((s) => {
    const c: { src: string; frame: number; volume: number }[] = [];
    if (s.from > 0) c.push({ src: `${pack}/transition.wav`, frame: s.from - 3, volume: 0.2 });
    s.times.forEach((t) => c.push({ src: `${pack}/pop.wav`, frame: s.from + fr(t), volume: 0.28 }));
    for (const sc of s.screens) {
      if (sc.from > 0) c.push({ src: `${pack}/transition.wav`, frame: s.from + fr(sc.from), volume: 0.12 });
      for (const t of sc.screen.taps ?? []) c.push({ src: `${pack}/tap.wav`, frame: s.from + fr(sc.from + t.at), volume: 0.45 });
      for (const t of sc.screen.detailTaps ?? []) if (t >= 0 && t < 100) c.push({ src: `${pack}/tap.wav`, frame: s.from + fr(sc.from + t), volume: 0.45 });
    }
    return c;
  });
};
