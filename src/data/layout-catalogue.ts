// Slide list for the layout catalogue (no React here, so Node scripts can read it).
import type { TimedLayoutScene } from "./faq-layouts";
import type { TortyPose } from "../torty/TortyCutout";

const fr = (s: number) => Math.round(s * 30);

type Screen = TimedLayoutScene["screen"];
export type Slide = {
  code: string;
  name: string;
  phone: "full" | "top-half" | "bottom-half";
  torty: { mode: "peek" | "full"; pose: TortyPose; side?: "left" | "right" };
  text?: { title: string; accent?: string; pos: "top" | "bottom" };
  points?: { variant: "num" | "icon"; heading: string; items: { text: string; icon?: string }[]; times?: number[] };
  screen: NonNullable<Screen>;
  sec: number;
};

export const SLIDES: Slide[] = [
  { code: "A1", name: "Full phone · peeking Torty", phone: "full", torty: { mode: "peek", pose: "curious", side: "right" }, screen: { comp: "home-tabbar", taps: [{ x: 146, y: 796, at: 1.8 }] }, sec: 4.5 },
  { code: "A2", name: "Full phone · peeking Torty · text", phone: "full", torty: { mode: "peek", pose: "happy", side: "left" }, text: { title: "Pick a contest", accent: "contest", pos: "top" }, screen: { comp: "contest-list", taps: [{ x: 195, y: 300, at: 1.8 }] }, sec: 4.5 },
  { code: "A3", name: "Full phone · full Torty", phone: "full", torty: { mode: "full", pose: "point-curious" }, screen: { comp: "contest-detail", detailTaps: [999, 999] }, sec: 4.5 },
  { code: "A4", name: "Full phone · full Torty · text", phone: "full", torty: { mode: "full", pose: "point-happy" }, text: { title: "Tap Join", accent: "Join", pos: "top" }, screen: { comp: "contest-detail", detailTaps: [1.6, 999] }, sec: 4.5 },
  { code: "B1", name: "Top half of phone · peeking Torty", phone: "top-half", torty: { mode: "peek", pose: "curious", side: "right" }, screen: { comp: "home" }, sec: 4 },
  { code: "B2", name: "Top half of phone · full Torty · text", phone: "top-half", torty: { mode: "full", pose: "happy" }, text: { title: "Your steps", accent: "steps", pos: "top" }, screen: { comp: "home" }, sec: 4 },
  { code: "C1", name: "Bottom half of phone · peeking Torty · text", phone: "bottom-half", torty: { mode: "peek", pose: "curious", side: "right" }, text: { title: "Confirm & join", accent: "join", pos: "bottom" }, screen: { comp: "contest-detail", detailTaps: [-10, 1.8] }, sec: 4.5 },
  { code: "C2", name: "Bottom half of phone · full Torty", phone: "bottom-half", torty: { mode: "full", pose: "thumbs-up" }, screen: { comp: "contest-detail", detailTaps: [-10, 999] }, sec: 4 },
  {
    code: "D1", name: "Points over phone · numbers · peeking Torty", phone: "full", torty: { mode: "peek", pose: "curious", side: "left" },
    points: { variant: "num", heading: "Join in 3 steps", items: [{ text: "Open Contests" }, { text: "Pick a contest" }, { text: "Tap Join" }] },
    screen: { comp: "home" }, sec: 5.5,
  },
  {
    code: "D2", name: "Points over phone · icons · peeking Torty", phone: "full", torty: { mode: "peek", pose: "happy", side: "right" },
    points: { variant: "icon", heading: "You win", items: [{ text: "Finisher medal", icon: "🏅" }, { text: "A tree planted", icon: "🌳" }, { text: "500 koins", icon: "coin" }] },
    screen: { comp: "home" }, sec: 5.5,
  },
];

export const timeline = () => {
  let t = 0;
  return SLIDES.map((s) => {
    const from = t;
    const duration = fr(s.sec);
    t += duration;
    return { ...s, from, duration };
  });
};
export const catalogueDuration = () => SLIDES.reduce((a, s) => a + fr(s.sec), 0);

export const catalogueAudioCues = () =>
  timeline().flatMap((s) => {
    const cues = [{ src: "sfx/swoosh.wav", frame: Math.max(0, s.from - 3), volume: 0.2 }];
    for (const t of s.screen.taps ?? []) cues.push({ src: "sfx/tap.wav", frame: s.from + fr(t.at), volume: 0.45 });
    for (const t of s.screen.detailTaps ?? []) if (t >= 0 && t < 100) cues.push({ src: "sfx/tap.wav", frame: s.from + fr(t), volume: 0.45 });
    s.points?.items.forEach((_, i) => cues.push({ src: "sfx/pop.wav", frame: s.from + fr(1.1 + i * 0.8), volume: 0.25 }));
    return cues;
  });

