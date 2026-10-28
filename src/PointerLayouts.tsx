// Pointer layouts: heading + numbered / icon list ABOVE a centred phone.
//   E1 / E2  — how they run in a real video (phone follows the point being spoken)
//   N1–N4    — number badge style options
//   I1–I4    — icon badge style options
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone, PHONE_W } from "./components/Phone";
import { Headline } from "./components/Text";
import type { TimedLayoutScene } from "./data/faq-layouts";
import { pointerCues, pointerTimeline, type PointerSlide } from "./data/pointer-layouts";
import { AppScreen, Backdrop, GREEN, theme } from "./LayoutDemo";
import { Peek } from "./LayoutsV3";
import { Icon } from "./screens/ui";
import { ensureFonts } from "./theme/fonts";

ensureFonts();

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fr = (s: number) => Math.round(s * 30);

// fixed geometry: heading → list → phone (centred)
export const POINTER_GEO = { headingTop: 140, listTop: 310, phoneScale: 1.22, phoneY: 800 };
const BADGE = 92;
const gapFor = (s: PointerSlide) => (s.style === "stepper" ? 48 : 30);

const Badge: React.FC<{ s: PointerSlide; i: number; p: number; active: boolean }> = ({ s, i, p, active }) => {
  const icon = s.items[i].icon;
  let bg = GREEN.mint, color = GREEN.deep, border = "none", radius = BADGE / 2;
  if (s.kind === "num") {
    if (s.style === "outline") { bg = "rgba(255,255,255,0.08)"; color = "#fff"; border = "6px solid #fff"; }
    if (s.style === "stepper") { bg = "#fff"; color = GREEN.bg; }
    if (s.style === "card") { bg = GREEN.bg; color = "#fff"; }
  } else {
    if (s.style === "solid") { bg = GREEN.cream; color = GREEN.bg; }
    if (s.style === "outline") { bg = "rgba(255,255,255,0.08)"; color = "#fff"; border = "6px solid #fff"; }
    if (s.style === "tile") { bg = GREEN.mint; color = GREEN.deep; radius = 26; }
    if (s.style === "emoji") { bg = GREEN.cream; }
  }
  const content =
    s.kind === "num" ? i + 1
    : s.style === "emoji" ? <span style={{ fontSize: 48, lineHeight: 1, fontFamily: "'Noto Color Emoji'" }}>{icon}</span>
    : <Icon name={icon ?? "check"} size={50} color={color} stroke={2.3} />;
  return (
    <div style={{ width: BADGE, height: BADGE, flexShrink: 0, borderRadius: radius, background: bg, border, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", color, fontFamily: "Poppins", fontWeight: 700, fontSize: 46, scale: String(p), position: "relative", zIndex: 1, boxShadow: active ? "0 0 0 12px rgba(194,238,225,0.28), 0 10px 24px rgba(0,50,35,0.3)" : s.style === "card" || s.style === "outline" ? "none" : "0 10px 24px rgba(0,50,35,0.3)" }}>
      {content}
    </div>
  );
};

const PointList: React.FC<{ s: PointerSlide }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = s.times.filter((t) => f >= fr(t)).length;
  const active = shown - 1;
  const card = s.style === "card";
  const cardIn = spring({ frame: f - 4, fps, config: { damping: 16 } });
  // stepper connector grows to the latest badge
  const step = BADGE + gapFor(s);
  const lineTo = interpolate(f, s.times.map((t) => fr(t)), s.times.map((_, i) => i * step), clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: POINTER_GEO.listTop - (card ? 34 : 0), display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", gap: gapFor(s), minWidth: card ? 640 : undefined, ...(card ? { padding: "34px 48px", borderRadius: 40, background: GREEN.cream, boxShadow: "0 20px 44px rgba(0,50,35,0.3)", opacity: cardIn, translate: `0px ${(1 - cardIn) * 40}px` } : {}) }}>
        {s.style === "stepper" && shown > 0 && (
          <div style={{ position: "absolute", left: BADGE / 2 - 3, top: BADGE / 2, width: 6, height: lineTo, borderRadius: 3, background: "rgba(255,255,255,0.55)" }} />
        )}
        {s.items.map((it, i) => {
          const p = spring({ frame: f - fr(s.times[i]), fps, config: { damping: 11, stiffness: 170 } });
          const tIn = interpolate(f, [fr(s.times[i]) + 2, fr(s.times[i]) + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const dim = s.activeHighlight && i < active ? 0.5 : 1;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, opacity: f < fr(s.times[i]) ? 0 : dim, transition: "none" }}>
              <Badge s={s} i={i} p={p} active={!!s.activeHighlight && i === active} />
              <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 52, color: card ? GREEN.ink : "#fff", whiteSpace: "nowrap", opacity: tIn, translate: `${(1 - tIn) * -30}px 0px` }}>{it.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PhoneScreens: React.FC<{ s: PointerSlide; duration: number }> = ({ s, duration }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } });
  const sc = POINTER_GEO.phoneScale;
  return (
    <Phone scale={sc} frame={theme.phoneFrame} x={(1080 - PHONE_W * sc) / 2} y={POINTER_GEO.phoneY + (1 - rise) * 70} shadow="0 40px 90px rgba(0,50,35,0.38)">
      {s.screens.map((x, i) => {
        const from = fr(x.from);
        const next = s.screens[i + 1];
        const len = (next ? fr(next.from) + 10 : duration) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={len}>
            <Fade first={i === 0}><AppScreen scene={{ screen: x.screen, duration: len } as unknown as TimedLayoutScene} /></Fade>
          </Sequence>
        );
      })}
    </Phone>
  );
};

const Fade: React.FC<{ first: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, 8], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const PointerSlideView: React.FC<{ s: PointerSlide; duration: number; code?: boolean }> = ({ s, duration, code = true }) => (
  <AbsoluteFill>
    <Backdrop />
    <PhoneScreens s={s} duration={duration} />
    <div style={{ position: "absolute", left: 80, right: 80, top: POINTER_GEO.headingTop, display: "flex", justifyContent: "center" }}>
      <Headline text={s.heading} accent={s.accent} theme={theme} size={84} align="center" delay={2} maxWidth={920} />
    </div>
    <PointList s={s} />
    {s.peek && <Peek pose={s.peek.pose} spot={s.peek.spot} height={460} reveal={0.62} />}
    {code && (
      <div style={{ position: "absolute", right: 36, top: 36, padding: "6px 16px", borderRadius: 18, background: "rgba(0,0,0,0.22)", color: "rgba(255,255,255,0.85)", fontFamily: "Poppins", fontWeight: 600, fontSize: 26 }}>{s.code}</div>
    )}
  </AbsoluteFill>
);

const Settle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const e = interpolate(f, [0, 11], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ translate: `${e * 100}px 0px`, opacity: 1 - e * 0.6 }}>{children}</AbsoluteFill>;
};

export const PointerLayouts: React.FC = () => (
  <AbsoluteFill style={{ background: GREEN.bg }}>
    {pointerTimeline().map((s) => (
      <Sequence key={s.code} from={s.from} durationInFrames={s.duration} name={`${s.code} ${s.name}`}>
        <Settle><PointerSlideView s={s} duration={s.duration} /></Settle>
      </Sequence>
    ))}
    {pointerCues().map((c, i) => (
      <Sequence key={`a${i}`} from={c.frame} layout="none"><Audio src={staticFile(c.src)} volume={c.volume} /></Sequence>
    ))}
  </AbsoluteFill>
);
