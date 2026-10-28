// FAQ 7 — every scene layout in one video, in the green reference palette.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone, PHONE_W } from "./components/Phone";
import { TapCursor } from "./components/TapCursor";
import { Headline } from "./components/Text";
import { buildLayoutTimeline, layoutAudioCues, type Pointer, type TimedLayoutScene } from "./data/faq-layouts";
import type { TimedGesture } from "./data/timeline";
import { Home, SCREENS } from "./screens/screens";
import { Coin, Icon } from "./screens/ui";
import { ensureFonts } from "./theme/fonts";
import { THEMES, type Theme } from "./theme/themes";
import { TortyCutout } from "./torty/TortyCutout";

ensureFonts();

// ───────── Palette from the reference ─────────
export const GREEN = {
  bg: "#008E66",
  bgGlow: "#0AA376",
  deep: "#006B4D",
  mint: "#C2EEE1",
  cream: "#FDF9F0",
  ink: "#0B2B22",
};

export const theme: Theme = {
  ...THEMES.skyHi,
  name: "Green reference",
  background: GREEN.bg,
  blobs: [],
  text: GREEN.mint,
  subText: "rgba(255,255,255,0.88)",
  accent: "#FFFFFF",
  accentBg: "none",
  chip: { bg: GREEN.mint, fg: GREEN.deep },
  phoneFrame: "#1B1F1E",
  cursor: { fill: GREEN.ink, stroke: "#FFFFFF", ripple: "0,142,102" },
  headlineFont: "Poppins",
  bodyFont: "Poppins",
  headlineWeight: 700,
  headlineSize: 88,
  letterSpacing: "-0.02em",
  headlineLineHeight: 1.12,
  captionLineHeight: 1.4,
  captionWeight: 500,
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** app mockup (390 wide) → full video width */
const S = 1080 / 390;
const fr = (s: number) => Math.round(s * 30);

// ───────── Shared pieces ─────────
export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 35%, ${GREEN.bgGlow} 0%, ${GREEN.bg} 60%)` }} />
);

const Pill: React.FC<{ children: React.ReactNode; delay?: number; center?: boolean }> = ({ children, delay = 0, center }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: { damping: 14 } });
  return (
    <div style={{ alignSelf: center ? "center" : "flex-start", display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 26px", borderRadius: 40, background: GREEN.mint, color: GREEN.deep, fontFamily: "Poppins", fontWeight: 700, fontSize: 30, letterSpacing: "0.06em", textTransform: "uppercase", opacity: p, scale: String(0.7 + 0.3 * p) }}>
      {children}
    </div>
  );
};

/** One scene's app screen + its cursor, in 390×844 space */
export const AppScreen: React.FC<{ scene: TimedLayoutScene; cursorSize?: number; rippleScale?: number }> = ({ scene, cursorSize = 36, rippleScale = 0.9 }) => {
  const f = useCurrentFrame();
  const sc = scene.screen!;
  let content: React.ReactNode;
  let gestures: TimedGesture[] = [];
  if (sc.comp === "home") {
    content = <Home steps={6240} synced={1} />;
    gestures = (sc.taps ?? []).map((t) => ({ ...t, frame: fr(t.at) }));
  }
  else if (sc.comp === "contest-detail") {
    const [j, c] = sc.detailTaps ?? [999, 999];
    const Detail = SCREENS["contest-detail"];
    content = <Detail f={f} taps={[fr(j), fr(c)]} />;
    gestures = [j, c].filter((t) => t >= 0 && t < 100).map((t) => ({ x: 195, y: 772, at: t, frame: fr(t) }));
  } else {
    const Comp = SCREENS[sc.comp];
    const taps = sc.taps ?? [];
    content = <Comp f={f} taps={taps.length ? taps.map((t) => fr(t.at)) : [0]} />;
    gestures = taps.map((t) => ({ ...t, frame: fr(t.at) }));
  }
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 390, height: 844, overflow: "hidden", background: "#fff" }}>
      {content}
      <TapCursor f={f} gestures={gestures} fill={theme.cursor.fill} stroke={theme.cursor.stroke} ripple={theme.cursor.ripple} size={cursorSize} rippleScale={rippleScale} />
    </div>
  );
};

/** Phone placement on the background (video px) */
export type Geo = { x: number; y: number; s: number };
export const centred = (s: number, y: number): Geo => ({ x: (1080 - PHONE_W * s) / 2, y, s });
/** app-screen point → video point for a phone at `g` (12px bezel inside the frame) */
export const toVideo = (g: Geo, x: number, y: number) => ({ x: g.x + (12 + x) * g.s, y: g.y + (12 + y) * g.s });

/** The whole phone (frame + live app screen) sitting on the green background */
export const PhoneOnBg: React.FC<{ scene: TimedLayoutScene; g: Geo }> = ({ scene, g }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <Phone scale={g.s} frame={theme.phoneFrame} x={g.x} y={g.y + (1 - rise) * 70} shadow="0 40px 90px rgba(0,50,35,0.38)">
      <AppScreen scene={scene} />
    </Phone>
  );
};

/** Text block: chip + headline + live caption */
/** Minimal on-screen text: one short headline (2–4 words). The voiceover carries the detail. */
const TextBlock: React.FC<{ scene: TimedLayoutScene; align?: "left" | "center"; size?: number }> = ({ scene, align = "center", size = 104 }) =>
  scene.title ? (
    <div style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start" }}>
      <Headline text={scene.title} accent={scene.accent} theme={theme} size={size} align={align} delay={4} maxWidth={920} />
    </div>
  ) : null;

const ICONS: Record<NonNullable<Pointer["icon"]>, React.ReactNode> = {
  steps: <Icon name="steps" size={66} color={GREEN.deep} stroke={2.4} />,
  medal: <span style={{ fontSize: 62, lineHeight: 1, fontFamily: "'Noto Color Emoji'" }}>🏅</span>,
  tree: <span style={{ fontSize: 62, lineHeight: 1, fontFamily: "'Noto Color Emoji'" }}>🌳</span>,
  coin: <Coin size={66} />,
};

/** Numbered or icon pointers: badge on the background, line into the phone screen */
const Pointers: React.FC<{ scene: TimedLayoutScene; g: Geo }> = ({ scene, g }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {(scene.pointers ?? []).map((p, i) => {
          const t = toVideo(g, p.tx, p.ty), b = { x: p.bx, y: p.by };
          const draw = interpolate(f, [fr(p.at), fr(p.at) + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          if (draw <= 0) return null;
          const x2 = b.x + (t.x - b.x) * draw, y2 = b.y + (t.y - b.y) * draw;
          return (
            <g key={i}>
              <line x1={b.x} y1={b.y} x2={x2} y2={y2} stroke="#fff" strokeWidth={13} strokeLinecap="round" />
              <line x1={b.x} y1={b.y} x2={x2} y2={y2} stroke={GREEN.deep} strokeWidth={6} strokeLinecap="round" />
              {draw > 0.95 && <circle cx={t.x} cy={t.y} r={13 + 3 * Math.sin((f - fr(p.at)) / 4)} fill={GREEN.bg} stroke="#fff" strokeWidth={6} />}
            </g>
          );
        })}
      </svg>
      {(scene.pointers ?? []).map((p, i) => {
        const s = spring({ frame: f - fr(p.at), fps, config: { damping: 10, stiffness: 160 } });
        if (f < fr(p.at)) return null;
        return (
          <div key={i} style={{ position: "absolute", left: p.bx - 62, top: p.by - 62, width: 124, height: 124, borderRadius: 62, background: GREEN.mint, border: "8px solid #fff", boxSizing: "border-box", boxShadow: "0 14px 30px rgba(0,60,40,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: GREEN.deep, fontFamily: "Poppins", fontWeight: 700, fontSize: 60, scale: String(s) }}>
            {p.icon ? ICONS[p.icon] : i + 1}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Torty peeking out from behind the phone's left or right edge (render BEFORE the phone) */
const PeekingTorty: React.FC<{ scene: TimedLayoutScene; g: Geo }> = ({ scene, g }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = spring({ frame: f - 10, fps, config: { damping: 12 } });
  const right = scene.peekSide !== "left";
  const h = 560;
  const edge = right ? g.x + PHONE_W * g.s : g.x;
  const w = h * 0.62;
  const hidden = right ? edge - w * 0.75 : edge - w * 0.25;
  const shown = right ? edge - w * 0.32 : edge - w * 0.68;
  return (
    <div style={{ position: "absolute", left: hidden + (shown - hidden) * out, top: 1920 - h - 40 + Math.sin(f / 9) * 6, rotate: `${right ? 9 : -9}deg`, transformOrigin: "50% 100%" }}>
      <TortyCutout pose={scene.torty!} height={h} since={f - 10} />
    </div>
  );
};

// ───────── The 8 layouts ─────────
const Intro: React.FC<{ scene: TimedLayoutScene }> = ({ scene }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneIn = spring({ frame: f - 6, fps, config: { damping: 16, stiffness: 90 } });
  const scale = 1.3;
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: 80, right: 80, top: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Pill center>
          <Img src={staticFile("brand/logo-app.jpg")} style={{ width: 40, height: 40, borderRadius: 11, marginLeft: -12 }} /> FAQ
        </Pill>
        <Headline text={scene.title!} accent={scene.accent} theme={theme} size={110} align="center" delay={6} />
      </div>
      <div style={{ position: "absolute", inset: 0, translate: `0px ${(1 - phoneIn) * 900}px` }}>
        <Phone scale={scale} frame={theme.phoneFrame} x={(1080 - PHONE_W * scale) / 2 - 60} y={480}>
          <Home steps={6240} synced={1} />
        </Phone>
      </div>
      <div style={{ position: "absolute", left: 650, top: 1290 }}>
        <TortyCutout pose={scene.torty!} height={560} since={f - 20} style={{ filter: "drop-shadow(0 20px 26px rgba(0,50,35,0.35))" }} />
      </div>
    </AbsoluteFill>
  );
};

// Text above the phone, or below it (separate slides)
const FullText: React.FC<{ scene: TimedLayoutScene }> = ({ scene }) => {
  const top = scene.textPos !== "bottom";
  const g = top ? centred(1.68, 370) : centred(1.62, 70);
  return (
    <AbsoluteFill>
      <Backdrop />
      <PhoneOnBg scene={scene} g={g} />
      <div style={{ position: "absolute", left: 80, right: 80, ...(top ? { top: 150 } : { top: 1610 }) }}>
        <TextBlock scene={scene} />
      </div>
    </AbsoluteFill>
  );
};

// Big phone cut by the frame edge: only half of it shows, text fills the other half
const Half: React.FC<{ scene: TimedLayoutScene }> = ({ scene }) => {
  const screenTop = scene.screenHalf !== "bottom";
  const s2 = 2.0;
  const PH = 868 * s2;
  const g = screenTop ? centred(s2, 1010 - PH) : centred(s2, 900);
  return (
    <AbsoluteFill>
      <Backdrop />
      <PhoneOnBg scene={scene} g={g} />
      <div style={{ position: "absolute", left: 80, right: 80, top: screenTop ? 1380 : 360 }}>
        <TextBlock scene={scene} size={120} />
      </div>
    </AbsoluteFill>
  );
};

// Just the phone, bigger, no text
const FullClean: React.FC<{ scene: TimedLayoutScene }> = ({ scene }) => (
  <AbsoluteFill>
    <Backdrop />
    <PhoneOnBg scene={scene} g={centred(1.9, 130)} />
  </AbsoluteFill>
);

const TortyText: React.FC<{ scene: TimedLayoutScene }> = ({ scene }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: 90, top: 560, width: 900, height: 900, borderRadius: 450, background: "radial-gradient(circle, rgba(194,238,225,0.45), transparent 68%)" }} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 150 }}>
        <TextBlock scene={scene} size={120} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", translate: `0px ${Math.sin(f / 10) * 8}px` }}>
        <TortyCutout pose={scene.torty!} height={1180} since={f - 4} />
      </div>
    </AbsoluteFill>
  );
};

// Phone + pointers on the background + Torty peeking from behind the phone
const PointersScene: React.FC<{ scene: TimedLayoutScene }> = ({ scene }) => {
  const g = centred(1.55, 287);
  return (
    <AbsoluteFill>
      <Backdrop />
      <PeekingTorty scene={scene} g={g} />
      <PhoneOnBg scene={scene} g={g} />
      <Pointers scene={scene} g={g} />
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ scene: TimedLayoutScene }> = ({ scene }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lock = spring({ frame: f - fr(2.2), fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: 190, top: 330, width: 700, height: 700, borderRadius: 350, background: "radial-gradient(circle, rgba(194,238,225,0.4), transparent 68%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
        <TortyCutout pose={scene.torty!} height={860} since={f - 2} sway={3 * Math.sin(f / 5)} />
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1280 }}>
        <TextBlock scene={scene} size={110} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1550, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: lock, translate: `0px ${(1 - lock) * 40}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Img src={staticFile("brand/logo-app.jpg")} style={{ width: 96, height: 96, borderRadius: 26 }} />
          <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 60, color: "#fff" }}>Koshiqa</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const LAYOUTS: Record<TimedLayoutScene["layout"], React.FC<{ scene: TimedLayoutScene }>> = {
  intro: Intro,
  "full-text": FullText,
  half: Half,
  "full-clean": FullClean,
  "torty-text": TortyText,
  "pointers-num": PointersScene,
  "pointers-icon": PointersScene,
  outro: Outro,
};

/** Every cut lands with a small settle so scene changes feel intentional */
const Settle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 10], [1.04, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const o = interpolate(f, [0, 5], [0.4, 1], clamp);
  return <AbsoluteFill style={{ scale: String(s), opacity: o }}>{children}</AbsoluteFill>;
};

export const LayoutDemo: React.FC = () => {
  const { scenes } = buildLayoutTimeline();
  return (
    <AbsoluteFill style={{ background: GREEN.bg, fontFamily: "Poppins" }}>
      {scenes.map((s) => {
        const L = LAYOUTS[s.layout];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={`${s.layout}: ${s.id}`}>
            <Settle>
              <L scene={s} />
            </Settle>
          </Sequence>
        );
      })}
      {layoutAudioCues().map((c, i) => (
        <Sequence key={`a${i}`} from={c.frame} layout="none" name={c.src}>
          <Audio src={staticFile(c.src)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
