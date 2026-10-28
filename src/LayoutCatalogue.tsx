// Layout catalogue for review: every phone × Torty × text combination we may use.
// Each slide carries a small code (A1, B2…) so feedback can name a layout exactly.
//
//   A  full phone            — whole phone on the background
//   B  top half of phone     — phone rises from the bottom edge, its top half is visible
//   C  bottom half of phone  — phone hangs from the top edge, its bottom half is visible
//   D  points over phone     — a short step list written over the (dimmed) phone screen
//
//   Torty:  "peek" = leans in from the LEFT/RIGHT EDGE OF THE FRAME (never behind the phone)
//           "full" = full body, standing beside / on the phone, in front of it
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AppScreen, Backdrop, GREEN, theme, type Geo } from "./LayoutDemo";
import { Phone, PHONE_W } from "./components/Phone";
import { Headline } from "./components/Text";
import type { TimedLayoutScene } from "./data/faq-layouts";
import { catalogueAudioCues, timeline, type Slide } from "./data/layout-catalogue";
import { Coin } from "./screens/ui";
import { ensureFonts } from "./theme/fonts";
import { TortyCutout, type TortyPose } from "./torty/TortyCutout";

ensureFonts();

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fr = (s: number) => Math.round(s * 30);
export const PH = (s: number) => 868 * s;

// ───────── geometry ─────────
// The phone is ALWAYS horizontally centred; Torty fits around it.
export const geometry = (s: Slide): Geo => {
  const text = !!s.text;
  const mid = (sc: number) => (1080 - PHONE_W * sc) / 2;
  if (s.phone === "full") {
    if (s.torty.mode === "full") {
      const sc = text ? 1.25 : 1.32;
      return { x: mid(sc), y: text ? 400 : (1920 - PH(sc)) / 2 - 60, s: sc };
    }
    const sc = text ? 1.36 : 1.42; // leaves ~250px each side for the peek
    return { x: mid(sc), y: text ? 400 : (1920 - PH(sc)) / 2, s: sc };
  }
  const sc = 1.85;
  if (s.phone === "top-half") return { x: mid(sc), y: 940, s: sc };
  return { x: mid(sc), y: 980 - PH(sc), s: sc };
};

// ───────── pieces ─────────
const asScene = (s: Slide, duration: number) => ({ screen: s.screen, duration } as unknown as TimedLayoutScene);

/** Torty leaning in from the left/right edge of the FRAME */
export const PeekFromSide: React.FC<{ pose: TortyPose; side: "left" | "right"; top: number; height: number }> = ({ pose, side, top, height }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - 8, fps, config: { damping: 13, stiffness: 120 } });
  const w = height * 0.62;
  const shown = 0.5; // share of his width that is inside the frame
  const right = side === "right";
  const restX = right ? 1080 - w * shown : -w * (1 - shown);
  const hideX = right ? 1080 + 20 : -w - 20;
  return (
    <div style={{ position: "absolute", left: hideX + (restX - hideX) * p, top: top + Math.sin(f / 10) * 5, rotate: `${right ? -9 : 9}deg`, transformOrigin: "50% 100%", filter: "drop-shadow(0 16px 24px rgba(0,50,35,0.3))" }}>
      <TortyCutout pose={pose} height={height} since={f - 8} />
    </div>
  );
};

export const FullTorty: React.FC<{ pose: TortyPose; left: number; top: number; height: number }> = ({ pose, left, top, height }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left, top: top + Math.sin(f / 11) * 4, filter: "drop-shadow(0 20px 26px rgba(0,50,35,0.32))" }}>
      <TortyCutout pose={pose} height={height} since={f - 6} />
    </div>
  );
};

/** Step list written over the phone screen (in 390×844 screen space) */
export const PointsOverScreen: React.FC<{ points: NonNullable<Slide["points"]> }> = ({ points }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dim = interpolate(f, [fr(0.3), fr(0.6)], [0, 1], clamp);
  const card = spring({ frame: f - fr(0.5), fps, config: { damping: 16 } });
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(6,40,30,${0.55 * dim})` }} />
      <div style={{ position: "absolute", left: 22, right: 22, top: 250, padding: "26px 22px 14px", borderRadius: 28, background: GREEN.cream, opacity: card, translate: `0px ${(1 - card) * 60}px`, boxShadow: "0 18px 40px rgba(0,0,0,0.3)", fontFamily: "Poppins" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: GREEN.deep, marginBottom: 14 }}>{points.heading}</div>
        {points.items.map((it, i) => {
          const p = spring({ frame: f - fr(points.times?.[i] ?? 1.1 + i * 0.8), fps, config: { damping: 13 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderTop: i ? "1px solid rgba(0,107,77,0.12)" : "none", opacity: p, translate: `${(1 - p) * -30}px 0px` }}>
              <div style={{ width: 52, height: 52, borderRadius: 26, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: points.variant === "num" ? GREEN.bg : GREEN.mint, color: "#fff", fontWeight: 700, fontSize: 26, scale: String(0.6 + 0.4 * p) }}>
                {points.variant === "num" ? i + 1 : it.icon === "coin" ? <Coin size={32} /> : <span style={{ fontSize: 30, lineHeight: 1, fontFamily: "'Noto Color Emoji'" }}>{it.icon}</span>}
              </div>
              <div style={{ fontSize: 23, fontWeight: 600, color: GREEN.ink }}>{it.text}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const CodeTag: React.FC<{ code: string }> = ({ code }) => (
  <div style={{ position: "absolute", right: 36, top: 36, padding: "6px 16px", borderRadius: 18, background: "rgba(0,0,0,0.22)", color: "rgba(255,255,255,0.85)", fontFamily: "Poppins", fontWeight: 600, fontSize: 26, letterSpacing: "0.04em" }}>{code}</div>
);

const SlideView: React.FC<{ s: Slide; duration: number }> = ({ s, duration }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = geometry(s);
  const rise = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } });
  const settle = interpolate(f, [0, 10], [1.03, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const phoneBottom = g.y + PH(g.s);
  const T = s.torty;

  // Torty placement per phone type
  let torty: React.ReactNode = null;
  if (T.mode === "peek") {
    const side = T.side ?? "right";
    const h = s.phone === "full" ? 520 : 600;
    const top = s.phone === "top-half" ? 300 : s.phone === "bottom-half" ? 1260 : 1180;
    torty = <PeekFromSide pose={T.pose} side={side} top={top} height={h} />;
  } else {
    // full phone: Torty stands in front of the phone's lower-right corner, pointing in
    if (s.phone === "full") torty = <FullTorty pose={T.pose} left={680} top={1920 - 30 - 640} height={640} />;
    else if (s.phone === "top-half") torty = <FullTorty pose={T.pose} left={600} top={940 - 640 + 30} height={640} />; // stands on the phone's top edge
    else torty = <FullTorty pose={T.pose} left={(1080 - 820 * 0.62) / 2} top={1920 - 30 - 820} height={820} />;
  }

  // Text position
  let text: React.ReactNode = null;
  if (s.text) {
    const top =
      s.phone === "full" ? (s.text.pos === "top" ? 170 : phoneBottom + 70)
      : s.phone === "top-half" ? 340
      : 1150;
    const align = s.phone === "top-half" && T.mode === "full" ? "left" : s.phone === "bottom-half" && T.mode === "peek" ? "left" : "center";
    text = (
      <div style={{ position: "absolute", left: 80, right: align === "left" ? 420 : 80, top, display: "flex", justifyContent: align === "left" ? "flex-start" : "center" }}>
        <Headline text={s.text.title} accent={s.text.accent} theme={theme} size={align === "left" ? 104 : 110} align={align} delay={4} maxWidth={920} />
      </div>
    );
  }

  return (
    <AbsoluteFill style={{ scale: String(settle) }}>
      <Backdrop />
      <Phone scale={g.s} frame={theme.phoneFrame} x={g.x} y={g.y + (1 - rise) * 70} shadow="0 40px 90px rgba(0,50,35,0.38)">
        <AppScreen scene={asScene(s, duration)} />
        {s.points && <PointsOverScreen points={s.points} />}
      </Phone>
      {torty}
      {text}
      <CodeTag code={s.code} />
    </AbsoluteFill>
  );
};

export const LayoutCatalogue: React.FC = () => (
  <AbsoluteFill style={{ background: GREEN.bg }}>
    {timeline().map((s) => (
      <Sequence key={s.code} from={s.from} durationInFrames={s.duration} name={`${s.code} ${s.name}`}>
        <SlideView s={s} duration={s.duration} />
      </Sequence>
    ))}
    {catalogueAudioCues().map((c, i) => (
      <Sequence key={`a${i}`} from={c.frame} layout="none" name={c.src}>
        <Audio src={staticFile(c.src)} volume={c.volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const catalogueStills = () => timeline().map((s) => ({ code: s.code, name: s.name, frame: s.from + Math.min(s.duration - 5, fr(3.6)) }));
