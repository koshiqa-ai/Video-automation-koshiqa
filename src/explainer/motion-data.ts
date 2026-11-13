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
