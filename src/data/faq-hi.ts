// FAQ 6 (Hindi): "Steps stuck at zero?" — driven by a single pre-recorded voiceover
// (ElevenLabs, Monika Sogam). Times below are seconds in the VO file, from
// silence detection + a Whisper transcript, then hand-corrected for captions.
import type { TortyMood } from "./faqs";
import { FPS, type AudioCue, type TimedScene } from "./timeline";
import {
  ACCOUNT_ROW_Y, CHANGE_BTN, DIALOG_ALLOW, FIT_AVATAR, FIT_EMAIL_ROW, LAUNCHER_MENU_UNINSTALL, STORE_INSTALL, iconCenter,
} from "../screens/coords-hi";

export const HI_ID = "FAQ6-StepsStuckHindi";
export const HI_VO = "vo/FAQ6-StepsStuckHindi.mp3";
export const HI_VO_SEC = 79.65;
/** Seconds of silence before the voice starts */
export const HI_LEAD = 0.5;
/** Seconds after the voice ends (outro logo hold) */
export const HI_TAIL = 2.4;
/** Visual changes land this far ahead of the line that describes them */
const PRE = 0.35;

export type Line = { text: string; start: number; end: number };

/** On-screen Hinglish captions (Devanagari + English product words), VO seconds. */
export const LINES: Line[] = [
  { text: "क्या Koshiqa में आपके steps ज़ीरो पर अटके हुए हैं?", start: 0.0, end: 3.34 },
  { text: "कोई बात नहीं, आइए इसे दो मिनट में ठीक कर लेते हैं।", start: 3.88, end: 7.47 },
  { text: "स्टेप 1", start: 8.22, end: 9.13 },
  { text: "चेक करें कि क्या Google Fit में आपके steps दिख रहे हैं।", start: 9.6, end: 13.11 },
  { text: "अगर हां, तो अब ये बहुत आसान हो जाएगा।", start: 13.61, end: 16.35 },
  { text: "तरीका 1, स्टेप 2", start: 17.01, end: 19.09 },
  { text: "वो email ID चेक करें, जिससे आपने Google Fit में अपना account बनाया था।", start: 19.59, end: 24.13 },
  { text: "यहां देखें कैसे?", start: 24.61, end: 25.9 },
  { text: "तरीका 1, स्टेप 3", start: 26.4, end: 28.61 },
  { text: "चेक करें कि क्या Koshiqa में भी वही email ID है।", start: 29.03, end: 32.3 },
  { text: "अगर नहीं, तो कृपया Change पर क्लिक करें और सही email ID चुनें।", start: 32.73, end: 37.62 },
  { text: "तरीका 1, स्टेप 4", start: 38.15, end: 40.4 },
  { text: "अगर email ID भी सही है, तो कृपया app को uninstall करके दोबारा install करें।", start: 40.77, end: 46.2 },
  { text: "ध्यान रखें कि आप उसी email ID का इस्तेमाल करें, और Koshiqa को Activity Tracking की permission दें।", start: 46.67, end: 53.39 },
  { text: "इसके बिना मैं आपके steps नहीं दिखा पाऊंगा।", start: 53.82, end: 56.67 },
  { text: "तरीका 2", start: 57.3, end: 58.12 },
  { text: "अगर Google Fit में आपके steps नहीं दिख रहे हैं, तो कृपया Google Fit को uninstall करके दोबारा install करें।", start: 58.56, end: 65.64 },
  { text: "इस बार पक्का करें कि आपने Google Fit को Activity Tracking की permission दे दी है।", start: 66.13, end: 71.62 },
  { text: "इसके बिना ये आपके steps नहीं दिखा पाएगा।", start: 72.09, end: 74.99 },
  { text: "इन steps को follow करने के बाद आप अपने steps देख पाएंगे।", start: 75.48, end: 79.65 },
];

type G = { x: number; y: number; vo: number; kind?: "tap" | "hold" };

export type HiScene = {
  id: string;
  kind: "hook" | "step" | "outro";
  chip?: string;
  title: string;
  accent?: string;
  /** indices into LINES spoken during this scene */
  lines: number[];
  screen?: string;
  gestures?: G[];
  torty?: TortyMood;
  /** Yes/No branch card: which answer is highlighted, and when (VO seconds) */
  fork?: { pick: "yes" | "no"; from: number; to: number };
};

const fit = iconCenter("fit");
const kq = iconCenter("koshiqa");

export const HI_SCENES: HiScene[] = [
  { id: "hook", kind: "hook", title: "Steps 0 पर अटके हैं?", accent: "0", lines: [0, 1], torty: "sad" },
  {
    id: "s1", kind: "step", chip: "स्टेप 1", title: "Google Fit चेक करें", accent: "Google Fit",
    lines: [2, 3, 4], screen: "hi-fit-check",
    gestures: [{ ...fit, vo: 10.7 }],
    fork: { pick: "yes", from: 13.5, to: 16.6 },
  },
  {
    id: "m1s2", kind: "step", chip: "तरीका 1 · स्टेप 2", title: "Fit की email ID देखें", accent: "email ID",
    lines: [5, 6, 7], screen: "hi-fit-email",
    gestures: [{ ...FIT_AVATAR, vo: 21.2 }, { ...FIT_EMAIL_ROW, vo: 24.8 }],
  },
  {
    id: "m1s3", kind: "step", chip: "तरीका 1 · स्टेप 3", title: "Koshiqa में वही email ID", accent: "वही",
    lines: [8, 9, 10], screen: "hi-koshiqa-email",
    gestures: [{ ...CHANGE_BTN, vo: 34.5 }, { x: 195, y: ACCOUNT_ROW_Y, vo: 36.6 }],
  },
  {
    id: "m1s4", kind: "step", chip: "तरीका 1 · स्टेप 4", title: "Koshiqa दोबारा install करें", accent: "install",
    lines: [11, 12, 13, 14], screen: "hi-reinstall-koshiqa",
    gestures: [
      { ...kq, vo: 42.3, kind: "hold" },
      { ...LAUNCHER_MENU_UNINSTALL("koshiqa"), vo: 43.6 },
      { ...STORE_INSTALL, vo: 45.3 },
      { x: 195, y: ACCOUNT_ROW_Y, vo: 49.4 },
      { ...DIALOG_ALLOW, vo: 52.3 },
    ],
  },
  {
    id: "m2", kind: "step", chip: "तरीका 2", title: "Google Fit दोबारा install करें", accent: "Google Fit",
    lines: [15, 16, 17, 18], screen: "hi-reinstall-fit",
    gestures: [
      { ...fit, vo: 62.0, kind: "hold" },
      { ...LAUNCHER_MENU_UNINSTALL("fit"), vo: 63.2 },
      { ...STORE_INSTALL, vo: 64.6 },
      { ...DIALOG_ALLOW, vo: 69.6 },
    ],
    fork: { pick: "no", from: 57.1, to: 61.2 },
  },
  { id: "outro", kind: "outro", title: "अब दिखेंगे आपके steps!", accent: "steps!", lines: [19], torty: "happy" },
];

/** VO seconds → composition frame */
export const voFrame = (sec: number) => Math.round((sec + HI_LEAD) * FPS);

export type HiTimed = TimedScene & { hi: HiScene };

export const buildHindiTimeline = () => {
  const starts = HI_SCENES.map((s, i) => (i === 0 ? 0 : voFrame(LINES[s.lines[0]].start - PRE)));
  const total = voFrame(HI_VO_SEC + HI_TAIL);
  const scenes: HiTimed[] = HI_SCENES.map((s, i) => {
    const from = starts[i];
    const duration = (starts[i + 1] ?? total) - from;
    const first = LINES[s.lines[0]];
    const last = LINES[s.lines[s.lines.length - 1]];
    return {
      id: s.id,
      kind: s.kind,
      vo: s.lines.map((l) => LINES[l].text).join(" "),
      title: s.title,
      accent: s.accent,
      screen: s.screen,
      torty: s.torty,
      from,
      duration,
      voFrom: voFrame(first.start),
      voSec: last.end - first.start,
      gesturesTimed: (s.gestures ?? []).map((g) => ({ x: g.x, y: g.y, at: 0, kind: g.kind, frame: voFrame(g.vo) - from })),
      hi: s,
    };
  });
  return { scenes, durationInFrames: total };
};

export const hindiAudioCues = (): AudioCue[] => {
  const { scenes } = buildHindiTimeline();
  const cues: AudioCue[] = [{ src: HI_VO, frame: voFrame(0), volume: 1 }];
  for (const s of scenes) {
    if (s.kind === "hook") cues.push({ src: "sfx/pop.wav", frame: s.from + 6, volume: 0.3 });
    if (s.id === "s1") cues.push({ src: "sfx/swoosh.wav", frame: s.from, volume: 0.3 });
    if (s.kind === "outro") {
      cues.push({ src: "sfx/pop.wav", frame: s.from + 4, volume: 0.35 });
      cues.push({ src: "sfx/chime.wav", frame: s.from + 6, volume: 0.25 });
    }
    for (const g of s.gesturesTimed) cues.push({ src: "sfx/tap.wav", frame: s.from + g.frame, volume: 0.4 });
  }
  return cues;
};
