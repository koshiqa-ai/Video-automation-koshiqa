// FAQ 8 — "How do I redeem my koins?" built only from the approved layout catalogue,
// with explainer-style motion: highlight rings, camera push-ins, confetti (no arrows).
import type { Slide } from "./layout-catalogue";
import { FPS, VO_LEAD, voSeconds } from "./timeline";

type P = { x: number; y: number };
/** Highlight ring around an element, app-screen coords (centre + size) */
export type Focus = { x: number; y: number; w: number; h: number; at: number; r?: number };
/** Camera push-in toward an app-screen point */
export type Zoom = { x: number; y: number; at: number; until: number; z?: number };

export type ExplainerScene = Omit<Slide, "sec" | "name"> & {
  id: string;
  vo: string;
  focus?: Focus[];
  zoom?: Zoom;
  confettiAt?: number;
  minSec?: number;
};

export const SAAS = {
  id: "FAQ8-RedeemKoins",
  scenes: [
    {
      id: "s1", code: "A2", phone: "full", torty: { mode: "peek", pose: "curious", side: "left" },
      text: { title: "Your koins", accent: "koins", pos: "top" },
      vo: "Got Koshiqa koins? Tap your koin balance, right at the top.",
      screen: { comp: "koins-1", taps: [{ x: 318, y: 82, at: 3.1 }] },
      focus: [{ x: 318, y: 82, w: 112, h: 46, at: 1.8, r: 23 }],
      zoom: { x: 318, y: 82, at: 2.3, until: 3.9, z: 1.14 },
      minSec: 5.2,
    },
    {
      id: "s2", code: "A3", phone: "full", torty: { mode: "full", pose: "point-curious" },
      vo: "In the rewards store, pick something you love.",
      screen: { comp: "koins-2", taps: [{ x: 104, y: 330, at: 2.7 }] },
      focus: [{ x: 104, y: 330, w: 170, h: 210, at: 1.5, r: 20 }],
      zoom: { x: 104, y: 330, at: 2.0, until: 3.6, z: 1.12 },
      minSec: 5,
    },
    {
      id: "s3", code: "C1", phone: "bottom-half", torty: { mode: "peek", pose: "curious", side: "right" },
      text: { title: "Tap Redeem", accent: "Redeem", pos: "bottom" },
      vo: "Then tap Redeem. Your koins are used instantly.",
      screen: { comp: "koins-3", taps: [{ x: 195, y: 772, at: 2.2 }] },
      focus: [{ x: 195, y: 772, w: 366, h: 64, at: 1.3, r: 32 }],
      zoom: { x: 195, y: 772, at: 1.7, until: 3.2, z: 1.08 },
      minSec: 5,
    },
    {
      id: "s4", code: "B2", phone: "top-half", torty: { mode: "full", pose: "celebrate" },
      text: { title: "Your code", accent: "code", pos: "top" },
      vo: "Done! Your reward code is ready, and your balance updates.",
      screen: { comp: "koins-redeemed" },
      focus: [{ x: 195, y: 365, w: 326, h: 78, at: 1.9, r: 18 }],
      confettiAt: 0.3,
      minSec: 5.2,
    },
    {
      id: "s5", code: "D1", phone: "full", torty: { mode: "peek", pose: "curious", side: "left" },
      points: { variant: "num", heading: "3 quick steps", items: [{ text: "Tap your balance" }, { text: "Pick a reward" }, { text: "Tap Redeem" }], times: [1.9, 2.9, 3.8] },
      vo: "So, three quick steps. Tap your balance, pick a reward, and redeem.",
      screen: { comp: "koins-2" },
      minSec: 6,
    },
    {
      id: "s6", code: "D2", phone: "full", torty: { mode: "peek", pose: "happy", side: "right" },
      points: { variant: "icon", heading: "Spend koins on", items: [{ text: "Vouchers", icon: "🛍️" }, { text: "Trees", icon: "🌳" }, { text: "Fitness passes", icon: "🧘" }], times: [1.6, 2.3, 3.0] },
      vo: "Spend your koins on vouchers, trees, and fitness passes.",
      screen: { comp: "koins-2" },
      minSec: 5.5,
    },
    {
      id: "s7", code: "C2", phone: "bottom-half", torty: { mode: "full", pose: "thumbs-up" },
      vo: "Find all your codes under My Rewards. Happy redeeming!",
      screen: { comp: "koins-redeemed" },
      focus: [{ x: 195, y: 772, w: 366, h: 64, at: 2.0, r: 32 }],
      minSec: 5.5,
    },
  ] as ExplainerScene[],
};

export type TimedExplainerScene = ExplainerScene & { from: number; duration: number; voFrom: number; voSec: number };

export const buildSaasTimeline = () => {
  let cursor = 0;
  const scenes: TimedExplainerScene[] = SAAS.scenes.map((s) => {
    const voSec = voSeconds(SAAS.id, s.id);
    const last = Math.max(0, ...(s.screen.taps ?? []).map((t) => t.at + 1.6), ...(s.points?.times ?? []).map((t) => t + 1.4));
    const sec = Math.max(s.minSec ?? 5, VO_LEAD + voSec + 1.0, last);
    const duration = Math.round(sec * FPS);
    const t = { ...s, from: cursor, duration, voSec, voFrom: cursor + Math.round(VO_LEAD * FPS) };
    cursor += duration;
    return t;
  });
  return { scenes, durationInFrames: cursor };
};

import PACKS from "../../public/sfx/packs/packs.json";

export type SfxPack = "soft" | "playful" | "tech" | "wood" | "minimal";
export const SFX_PACKS: SfxPack[] = ["soft", "playful", "tech", "wood", "minimal"];
export const packLabel = (p: SfxPack) => (PACKS as Record<string, { label: string }>)[p].label;

/** Every sound for one SFX pack: voiceover + role-based effects (+ music bed if the pack has one). */
export const saasAudioCues = (pack: SfxPack = "soft") => {
  const { scenes, durationInFrames } = buildSaasTimeline();
  const vol = (PACKS as Record<string, Record<string, number | string>>)[pack];
  const f = (s: number) => Math.round(s * FPS);
  const fx = (role: string, frame: number) =>
    typeof vol[role] === "number" && (vol[role] as number) > 0 ? [{ src: `sfx/packs/${pack}/${role}.wav`, frame: Math.max(0, frame), volume: vol[role] as number }] : [];
  const cues = scenes.flatMap((s) => [
    { src: `vo/${SAAS.id}/${s.id}.wav`, frame: s.voFrom, volume: 1 },
    ...(s.from > 0 ? fx("transition", s.from - 4) : []),
    ...(s.screen.taps ?? []).flatMap((t) => fx("tap", s.from + f(t.at))),
    ...(s.focus ?? []).flatMap((x) => fx("focus", s.from + f(x.at))),
    ...(s.zoom ? fx("zoom", s.from + f(s.zoom.at) - 2) : []),
    ...(s.points?.times ?? []).flatMap((t) => fx("pop", s.from + f(t))),
    ...(s.confettiAt !== undefined ? fx("success", s.from + f(s.confettiAt)) : []),
  ]);
  if (typeof vol.music === "number") cues.push({ src: `sfx/packs/${pack}/music.wav`, frame: 0, volume: vol.music });
  void durationInFrames;
  return cues;
};
