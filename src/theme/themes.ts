// Five style directions for the Visual Style v1 review.
// Each maps to one FigJam reference + one layout option.

export type ThemeKey = "volt" | "blush" | "aurora" | "mint" | "sky" | "skyHi";
export type Layout = "phone-bottom" | "card" | "tilted" | "dual" | "phone-top";

export type Theme = {
  key: ThemeKey;
  name: string;
  reference: string;
  layout: Layout;
  background: string;
  /** Soft decorative shapes behind the content */
  blobs: { color: string; size: number; x: number; y: number }[];
  text: string;
  subText: string;
  accent: string;
  /** Background behind accented headline word ("none" = colour only) */
  accentBg: string;
  hookCard: string;
  chip: { bg: string; fg: string };
  phoneFrame: string;
  cursor: { fill: string; stroke: string; ripple: string };
  headlineFont: string;
  bodyFont: string;
  headlineWeight: number;
  headlineCase: "none" | "uppercase";
  headlineSize: number;
  letterSpacing: string;
  /** Peeking Torty during steps */
  peek: boolean;
  /** Devanagari needs taller lines than Latin */
  headlineLineHeight?: number;
  captionLineHeight?: number;
  captionWeight?: number;
};

export const THEMES = {
  volt: {
    key: "volt",
    name: "Volt",
    reference: "Design Reference 1 · lime sport",
    layout: "phone-bottom",
    background: "linear-gradient(180deg, #E4F95B 0%, #D3F23A 100%)",
    blobs: [
      { color: "rgba(255,255,255,0.45)", size: 760, x: 760, y: 980 },
      { color: "rgba(20,24,6,0.06)", size: 520, x: -120, y: 1500 },
    ],
    text: "#11140A",
    subText: "rgba(17,20,10,0.72)",
    accent: "#11140A",
    accentBg: "#FFFFFF",
    hookCard: "#11140A",
    chip: { bg: "#11140A", fg: "#E4F95B" },
    phoneFrame: "#15171A",
    cursor: { fill: "#11140A", stroke: "#FFFFFF", ripple: "17,20,10" },
    headlineFont: "InterDisplay",
    bodyFont: "Inter",
    headlineWeight: 900,
    headlineCase: "none",
    headlineSize: 104,
    letterSpacing: "-0.035em",
    peek: true,
  },
  blush: {
    key: "blush",
    name: "Blush",
    reference: "Design Reference 2 · soft pink cards",
    layout: "card",
    background: "linear-gradient(160deg, #F4B3B0 0%, #EE9C9B 55%, #F7C6B8 100%)",
    blobs: [
      { color: "rgba(255,255,255,0.35)", size: 640, x: -180, y: -160 },
      { color: "rgba(255,214,170,0.55)", size: 520, x: 760, y: 1500 },
    ],
    text: "#2A1A1C",
    subText: "rgba(42,26,28,0.7)",
    accent: "#FF6A3D",
    accentBg: "none",
    hookCard: "#FFFFFF",
    chip: { bg: "#FFFFFF", fg: "#2A1A1C" },
    phoneFrame: "#1E1E22",
    cursor: { fill: "#2A1A1C", stroke: "#FFFFFF", ripple: "255,106,61" },
    headlineFont: "Poppins",
    bodyFont: "Poppins",
    headlineWeight: 700,
    headlineCase: "none",
    headlineSize: 92,
    letterSpacing: "-0.02em",
    peek: false,
  },
  aurora: {
    key: "aurora",
    name: "Aurora",
    reference: "Design Reference 3 · purple fintech",
    layout: "tilted",
    background: "linear-gradient(165deg, #2B1BB8 0%, #5B33F0 48%, #8B5CFF 100%)",
    blobs: [
      { color: "rgba(255,120,220,0.45)", size: 700, x: 640, y: -200 },
      { color: "rgba(80,220,255,0.35)", size: 640, x: -260, y: 1180 },
    ],
    text: "#FFFFFF",
    subText: "rgba(255,255,255,0.78)",
    accent: "#D8FF5C",
    accentBg: "none",
    hookCard: "rgba(255,255,255,0.14)",
    chip: { bg: "rgba(255,255,255,0.16)", fg: "#FFFFFF" },
    phoneFrame: "#0E0B26",
    cursor: { fill: "#FFFFFF", stroke: "#2B1BB8", ripple: "91,51,240" },
    headlineFont: "InterDisplay",
    bodyFont: "Inter",
    headlineWeight: 800,
    headlineCase: "none",
    headlineSize: 100,
    letterSpacing: "-0.03em",
    peek: false,
  },
  mint: {
    key: "mint",
    name: "Midnight Mint",
    reference: "Design Reference 4 · teal on dark",
    layout: "dual",
    background: "radial-gradient(120% 80% at 50% 0%, #10463A 0%, #0A2621 55%, #061613 100%)",
    blobs: [
      { color: "rgba(45,225,180,0.22)", size: 760, x: 520, y: 780 },
      { color: "rgba(255,196,57,0.12)", size: 420, x: -120, y: 260 },
    ],
    text: "#FFFFFF",
    subText: "rgba(214,255,240,0.72)",
    accent: "#2DE1B4",
    accentBg: "none",
    hookCard: "#2DE1B4",
    chip: { bg: "#2DE1B4", fg: "#06231C" },
    phoneFrame: "#020807",
    cursor: { fill: "#FFFFFF", stroke: "#06231C", ripple: "45,225,180" },
    headlineFont: "Adventor",
    bodyFont: "Inter",
    headlineWeight: 700,
    headlineCase: "uppercase",
    headlineSize: 84,
    letterSpacing: "-0.01em",
    peek: false,
  },
  sky: {
    key: "sky",
    name: "Sky",
    reference: "Front-slide reference · cyan gradient + Koshiqa blue",
    layout: "phone-top",
    background: "linear-gradient(180deg, #13BFE6 0%, #6FDBF2 48%, #EAFBFF 100%)",
    blobs: [
      { color: "rgba(255,255,255,0.5)", size: 600, x: 620, y: 1380 },
      { color: "rgba(7,93,194,0.18)", size: 520, x: -200, y: -120 },
    ],
    text: "#062A5C",
    subText: "rgba(6,42,92,0.72)",
    accent: "#075DC2",
    accentBg: "none",
    hookCard: "#0B0F14",
    chip: { bg: "#075DC2", fg: "#FFFFFF" },
    phoneFrame: "#101418",
    cursor: { fill: "#062A5C", stroke: "#FFFFFF", ripple: "7,93,194" },
    headlineFont: "InterDisplay",
    bodyFont: "Inter",
    headlineWeight: 900,
    headlineCase: "none",
    headlineSize: 100,
    letterSpacing: "-0.035em",
    peek: true,
  },
} as Record<ThemeKey, Theme>;

/** Sky, set in Poppins (which includes Devanagari) for Hindi / Hinglish videos */
THEMES.skyHi = {
  ...THEMES.sky,
  key: "skyHi",
  name: "Sky · Hindi",
  headlineFont: "Poppins",
  bodyFont: "Poppins",
  headlineWeight: 700,
  headlineSize: 80,
  letterSpacing: "-0.01em",
  headlineLineHeight: 1.28,
  captionLineHeight: 1.45,
  captionWeight: 500,
};

/** Koshiqa app UI colours (used inside every phone mockup) */
export const APP = {
  blue: "#075DC2",
  blueDark: "#05479A",
  blueSoft: "#E8F1FC",
  ink: "#0F1B2D",
  muted: "#6B7785",
  line: "#E6EAF0",
  bg: "#F5F7FA",
  green: "#1DB57A",
  coral: "#F25F6B",
  gold: "#F5B300",
};
