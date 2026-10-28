// Layout catalogue v3 + annotation kit.
// Phone always centred · Torty only peeks when a phone is on screen · text always centred.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone, PHONE_W } from "./components/Phone";
import { Headline } from "./components/Text";
import type { TimedLayoutScene } from "./data/faq-layouts";
import { kitTimeline, reelCues, v3Timeline, type KitItem, type Marker, type PeekSpot, type V3Slide } from "./data/layouts-v3";
import { Confetti, FocusRing } from "./ExplainerDemo";
import { PointsOverScreen } from "./LayoutCatalogue";
import { PointerSlideView } from "./PointerLayouts";
import { POINTER_SLIDES } from "./data/pointer-layouts";
import { AppScreen, Backdrop, GREEN, theme, toVideo, type Geo } from "./LayoutDemo";
import { Coin, Icon } from "./screens/ui";
import { ensureFonts } from "./theme/fonts";
import { TortyCutout, type TortyPose } from "./torty/TortyCutout";
import HAND from "./torty/hand.json";

ensureFonts();

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fr = (s: number) => Math.round(s * 30);
const PH = (s: number) => 868 * s;
const mid = (s: number) => (1080 - PHONE_W * s) / 2;

// ───────── fixed positions (all text centred) ─────────
const TITLE_TOP = { full: 160, "top-half": 220, "bottom-half": 1120 } as const;

const geometry = (phone: V3Slide["phone"], text: boolean, kit = false): Geo => {
  if (phone === "top-half") return { x: mid(1.85), y: 940, s: 1.85 };
  if (phone === "bottom-half") return { x: mid(1.85), y: 980 - PH(1.85), s: 1.85 };
  if (kit) return { x: mid(1.42), y: 290, s: 1.42 };
  const s = text ? 1.36 : 1.42;
  return { x: mid(s), y: text ? 400 : (1920 - PH(s)) / 2, s };
};

// ───────── Torty peek: side edge or bottom corner ─────────
export const Peek: React.FC<{ pose: TortyPose; spot: PeekSpot; height: number; top?: number; reveal?: number }> = ({ pose, spot, height, top, reveal = 0.8 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - 8, fps, config: { damping: 13, stiffness: 120 } });
  const w = height * 0.62;
  const side = spot === "left" || spot === "right";
  const right = spot === "right" || spot === "bottom-right";
  let restX: number, hideX: number, y: number, hideY: number, rot: number;
  if (side) {
    restX = right ? 1080 - w * 0.5 : -w * 0.5;
    hideX = right ? 1100 : -w - 20;
    y = top ?? 1150;
    hideY = y;
    rot = right ? -9 : 9;
  } else {
    // rises from the bottom corner: head + shoulders visible
    restX = right ? 1080 - w * reveal : -w * (1 - reveal);
    hideX = restX;
    y = 1920 - height * 0.6;
    hideY = 1940;
    rot = right ? -16 : 16;
  }
  return (
    <div style={{ position: "absolute", left: hideX + (restX - hideX) * p, top: hideY + (y - hideY) * p + Math.sin(f / 10) * 5, rotate: `${rot}deg`, transformOrigin: "50% 100%", filter: "drop-shadow(0 16px 24px rgba(0,50,35,0.3))" }}>
      <TortyCutout pose={pose} height={height} since={f - 8} />
    </div>
  );
};

const peekDefaults = (phone: V3Slide["phone"], spot: PeekSpot) => {
  const corner = spot.startsWith("bottom");
  if (phone === "top-half") return { height: 560, top: 380 };
  if (phone === "bottom-half") return { height: corner ? 600 : 560, top: 1230 };
  return { height: corner ? 560 : 520, top: 1150 };
};

// ───────── markers (numbered / icon) beside the phone ─────────
const MARK_ICON: Record<NonNullable<Marker["icon"]>, React.ReactNode> = {
  steps: <Icon name="steps" size={62} color={GREEN.deep} stroke={2.4} />,
  medal: <span style={{ fontSize: 58, lineHeight: 1, fontFamily: "'Noto Color Emoji'" }}>🏅</span>,
  tree: <span style={{ fontSize: 58, lineHeight: 1, fontFamily: "'Noto Color Emoji'" }}>🌳</span>,
  coin: <Coin size={62} />,
  check: <Icon name="check" size={62} color={GREEN.deep} stroke={3} />,
};

export const Markers: React.FC<{ markers: Marker[]; g: Geo }> = ({ markers, g }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {markers.map((m, i) => {
          const t = toVideo(g, m.tx, m.ty);
          const d = interpolate(f, [fr(m.at), fr(m.at) + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          if (d <= 0) return null;
          const x2 = m.bx + (t.x - m.bx) * d, y2 = m.by + (t.y - m.by) * d;
          return (
            <g key={i}>
              <line x1={m.bx} y1={m.by} x2={x2} y2={y2} stroke="#fff" strokeWidth={13} strokeLinecap="round" />
              <line x1={m.bx} y1={m.by} x2={x2} y2={y2} stroke={GREEN.deep} strokeWidth={6} strokeLinecap="round" />
              {d > 0.95 && <circle cx={t.x} cy={t.y} r={13 + 3 * Math.sin((f - fr(m.at)) / 4)} fill={GREEN.bg} stroke="#fff" strokeWidth={6} />}
            </g>
          );
        })}
      </svg>
      {markers.map((m, i) => {
        if (f < fr(m.at)) return null;
        const s = spring({ frame: f - fr(m.at), fps, config: { damping: 10, stiffness: 160 } });
        return (
          <div key={i} style={{ position: "absolute", left: m.bx - 62, top: m.by - 62, width: 124, height: 124, borderRadius: 62, background: GREEN.mint, border: "8px solid #fff", boxSizing: "border-box", boxShadow: "0 14px 30px rgba(0,60,40,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: GREEN.deep, fontFamily: "Poppins", fontWeight: 700, fontSize: 60, scale: String(s) }}>
            {m.icon ? MARK_ICON[m.icon] : i + 1}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const CentredTitle: React.FC<{ title: string; accent?: string; top: number; size?: number }> = ({ title, accent, top, size = 104 }) => (
  <div style={{ position: "absolute", left: 80, right: 80, top, display: "flex", justifyContent: "center" }}>
    <Headline text={title} accent={accent} theme={theme} size={size} align="center" delay={4} maxWidth={920} />
  </div>
);

const PhoneWithScreen: React.FC<{ g: Geo; screen: V3Slide["screen"]; duration: number; children?: React.ReactNode; noCursor?: boolean }> = ({ g, screen, duration, children, noCursor }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <Phone scale={g.s} frame={theme.phoneFrame} x={g.x} y={g.y + (1 - rise) * 70} shadow="0 40px 90px rgba(0,50,35,0.38)">
      <AppScreen scene={{ screen, duration } as unknown as TimedLayoutScene} cursorSize={noCursor ? 0 : 36} />
      {children}
    </Phone>
  );
};

const CodeTag: React.FC<{ code: string }> = ({ code }) => (
  <div style={{ position: "absolute", right: 36, top: 36, padding: "6px 16px", borderRadius: 18, background: "rgba(0,0,0,0.22)", color: "rgba(255,255,255,0.85)", fontFamily: "Poppins", fontWeight: 600, fontSize: 26 }}>{code}</div>
);

const Settle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const e = interpolate(f, [0, 11], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ translate: `${e * 100}px 0px`, opacity: 1 - e * 0.6 }}>{children}</AbsoluteFill>;
};

// ───────── catalogue v3 slide ─────────
const V3SlideView: React.FC<{ s: V3Slide & { duration: number } }> = ({ s }) => {
  const f = useCurrentFrame();
  const ptr = POINTER_SLIDES.find((x) => x.code === s.pointer);
  if (ptr) return <PointerSlideView s={ptr} duration={s.duration} />;
  if (s.phone === "none") {
    const t = s.fullTorty!;
    const below = t.place === "below-text";
    return (
      <AbsoluteFill>
        <Backdrop />
        <div style={{ position: "absolute", left: 90, top: below ? 600 : 160, width: 900, height: 900, borderRadius: 450, background: "radial-gradient(circle, rgba(194,238,225,0.45), transparent 68%)" }} />
        {s.title && <CentredTitle title={s.title} accent={s.accent} top={below ? 220 : 1260} size={112} />}
        <div style={{ position: "absolute", left: 0, right: 0, top: below ? 560 : 170, display: "flex", justifyContent: "center", translate: `0px ${Math.sin(f / 10) * 8}px` }}>
          <TortyCutout pose={t.pose} height={below ? 1180 : 980} since={f - 4} sway={t.pose === "wave" ? 3 * Math.sin(f / 5) : 0} />
        </div>
        <CodeTag code={s.code} />
      </AbsoluteFill>
    );
  }
  const g = geometry(s.phone, !!s.title);
  const pk = s.peek ? peekDefaults(s.phone, s.peek.spot) : null;
  return (
    <AbsoluteFill>
      <Backdrop />
      <PhoneWithScreen g={g} screen={s.screen} duration={s.duration}>{s.points && <PointsOverScreen points={s.points} />}</PhoneWithScreen>
      {s.markers && <Markers markers={s.markers} g={g} />}
      {s.peek && pk && <Peek pose={s.peek.pose} spot={s.peek.spot} height={pk.height} top={pk.top} />}
      {s.title && <CentredTitle title={s.title} accent={s.accent} top={TITLE_TOP[s.phone]} />}
      <CodeTag code={s.code} />
    </AbsoluteFill>
  );
};

export const LayoutCatalogueV3: React.FC = () => (
  <AbsoluteFill style={{ background: GREEN.bg }}>
    {v3Timeline().map((s) => (
      <Sequence key={s.code} from={s.from} durationInFrames={s.duration} name={`${s.code} ${s.name}`}>
        <Settle><V3SlideView s={s} /></Settle>
      </Sequence>
    ))}
    {reelCues("v3").map((c, i) => (
      <Sequence key={`a${i}`} from={c.frame} layout="none"><Audio src={staticFile(c.src)} volume={c.volume} /></Sequence>
    ))}
  </AbsoluteFill>
);

// ───────── annotation kit ─────────
const Spotlight: React.FC<{ t: NonNullable<KitItem["target"]> }> = ({ t }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [fr(0.5), fr(0.9)], [0, 1], clamp);
  const pad = 8;
  return <div style={{ position: "absolute", left: t.x - t.w / 2 - pad, top: t.y - t.h / 2 - pad, width: t.w + pad * 2, height: t.h + pad * 2, borderRadius: (t.r ?? 16) + pad, boxShadow: `0 0 0 2000px rgba(5,30,22,${0.62 * o})`, outline: `${3 * o}px solid ${GREEN.mint}` }} />;
};

const Tooltip: React.FC<{ at: { x: number; y: number }; label: string }> = ({ at, label }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - fr(0.6), fps, config: { damping: 11, stiffness: 170 } });
  if (f < fr(0.6)) return null;
  return (
    <div style={{ position: "absolute", left: at.x, top: at.y, translate: "-50% -100%", scale: String(p), transformOrigin: "50% 100%" }}>
      <div style={{ padding: "16px 30px", borderRadius: 40, background: GREEN.mint, color: GREEN.deep, fontFamily: "Poppins", fontWeight: 700, fontSize: 40, whiteSpace: "nowrap", boxShadow: "0 14px 30px rgba(0,50,35,0.35)" }}>{label}</div>
      <div style={{ width: 0, height: 0, margin: "0 auto", borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: `20px solid ${GREEN.mint}` }} />
    </div>
  );
};

const Bubble: React.FC<{ text: string; x: number; y: number }> = ({ text, x, y }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - fr(0.9), fps, config: { damping: 11, stiffness: 150 } });
  if (f < fr(0.9)) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "22px 30px", borderRadius: 34, background: "#fff", color: GREEN.ink, fontFamily: "Poppins", fontWeight: 700, fontSize: 40, boxShadow: "0 18px 40px rgba(0,50,35,0.3)", scale: String(p), transformOrigin: "100% 50%" }}>
      {text}
      <div style={{ position: "absolute", right: -22, top: 34, width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: "26px solid #fff" }} />
    </div>
  );
};

const KitLabel: React.FC<{ k: KitItem }> = ({ k }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 34px", borderRadius: 44, background: "rgba(0,0,0,0.2)", fontFamily: "Poppins", color: "#fff", fontSize: 40, fontWeight: 600 }}>
      <span style={{ color: GREEN.mint, fontWeight: 700 }}>{k.code}</span>
      {k.name}
    </div>
  </div>
);

// Torty's pointing hand (cut from the point-happy cutout) — flies in, presses, lifts off
export const TortyHand: React.FC<{ tip: { x: number; y: number }; tapAt: number; width?: number; angle?: number }> = ({ tip, tapAt, width = 230, angle = 38 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = width / HAND.w;
  const tx = HAND.tipX * k, ty = HAND.tipY * k;
  const enter = spring({ frame: f - fr(tapAt - 0.9), fps, config: { damping: 15, stiffness: 110 } });
  const leave = interpolate(f, [fr(tapAt + 1.0), fr(tapAt + 1.4)], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const t = f - fr(tapAt);
  const press = t < -4 ? 0 : t < 0 ? (t + 4) / 4 : t < 5 ? 1 : Math.max(0, 1 - (t - 5) / 5);
  const off = (1 - enter) * 420 + leave * 420 + (1 - press) * 22 + 0;
  // approach along the finger direction (from lower right)
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * off, dy = Math.sin(rad) * off;
  return (
    <div style={{ position: "absolute", left: tip.x - tx + dx, top: tip.y - ty + dy, width, height: HAND.h * k, rotate: `${angle}deg`, transformOrigin: `${tx}px ${ty}px`, scale: String(1 - 0.08 * press), opacity: Math.min(1, enter * 3) * (1 - leave), filter: "drop-shadow(0 0 1.5px rgba(0,60,40,0.9)) drop-shadow(0 14px 18px rgba(0,40,28,0.35))" }}>
      <Img src={staticFile("torty/hand-point.png")} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

// Dotted red circle / rectangle — dots draw on around the target, then slowly march
const RED = "#FF3B3B";
export const DottedMark: React.FC<{ shape: "circle" | "rect"; t: NonNullable<KitItem["target"]>; g: Geo; at?: number }> = ({ shape, t, g, at = 0.5 }) => {
  const f = useCurrentFrame();
  const c = toVideo(g, t.x, t.y);
  const pad = 16;
  const w = t.w * g.s + pad * 2, h = t.h * g.s + pad * 2;
  const r = shape === "circle" ? w / 2 : (t.r ?? 16) * g.s + pad;
  const len = shape === "circle" ? Math.PI * w : 2 * (w + h - 4 * r) + 2 * Math.PI * r;
  const draw = interpolate(f, [fr(at), fr(at) + 16], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const march = Math.max(0, f - fr(at) - 16) * 0.8;
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, f - fr(at) - 16) / 6);
  if (draw <= 0) return null;
  const x = c.x - w / 2, y = c.y - h / 2, sw = 9;
  const shapeEl = (props: React.SVGProps<SVGRectElement>) => <rect x={sw} y={sw} width={w} height={h} rx={r} ry={r} fill="none" {...props} />;
  const id = `m${shape}`;
  return (
    <svg width={w + sw * 2} height={h + sw * 2} style={{ position: "absolute", left: x - sw, top: y - sw, overflow: "visible", scale: String(pulse) }}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-50} y={-50} width={w + 100} height={h + 100}>
          {shapeEl({ stroke: "#fff", strokeWidth: sw * 3, pathLength: 1, strokeDasharray: `${draw} 1` } as React.SVGProps<SVGRectElement>)}
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        {shapeEl({ stroke: "rgba(255,255,255,0.9)", strokeWidth: sw + 6, strokeDasharray: `0.1 ${len / Math.round(len / 26)}`, strokeLinecap: "round", strokeDashoffset: -march })}
        {shapeEl({ stroke: RED, strokeWidth: sw, strokeDasharray: `0.1 ${len / Math.round(len / 26)}`, strokeLinecap: "round", strokeDashoffset: -march })}
      </g>
    </svg>
  );
};

const KitView: React.FC<{ k: KitItem & { duration: number } }> = ({ k }) => {
  const f = useCurrentFrame();
  const g = geometry("full", false, true);
  const z = k.kind === "zoom" ? interpolate(f, [fr(0.5), fr(1.0)], [1, 1.2], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 1;
  const zo = k.target ? toVideo(g, k.target.x, k.target.y) : { x: 540, y: 960 };
  const inner = (
    <>
      {k.kind === "spotlight" && k.target && <Spotlight t={k.target} />}
      {k.points && <PointsOverScreen points={k.points} />}
    </>
  );
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ scale: String(z), transformOrigin: `${zo.x}px ${zo.y}px` }}>
        <PhoneWithScreen g={g} screen={k.screen} duration={k.duration} noCursor={k.kind === "hand"}>{inner}</PhoneWithScreen>
      </AbsoluteFill>
      {k.kind === "ring" && k.target && <FocusRing fc={{ ...k.target, at: 0.6 }} centre={toVideo(g, k.target.x, k.target.y)} scale={g.s} />}
      {k.markers && <Markers markers={k.markers.map((m) => ({ ...m, by: m.by - 54 }))} g={g} />}
      {k.kind === "tooltip" && k.target && <Tooltip at={{ x: toVideo(g, k.target.x, k.target.y).x - 60, y: toVideo(g, k.target.x, k.target.y - k.target.h / 2).y - 12 }} label={k.label!} />}
      {k.kind === "hand" && k.target && <TortyHand tip={toVideo(g, k.target.x, k.target.y)} tapAt={k.screen.taps![0].at} />}
      {k.kind === "dot-circle" && k.target && <DottedMark shape="circle" t={k.target} g={g} />}
      {k.kind === "dot-rect" && k.target && <DottedMark shape="rect" t={k.target} g={g} />}
      {k.kind === "success" && <Confetti at={1.0} origin={{ x: 540, y: g.y + 300 }} />}
      {k.kind === "bubble" && (
        <>
          <Peek pose="worried" spot="bottom-right" height={560} />
          <Bubble text={k.label!} x={330} y={1555} />
        </>
      )}
      <KitLabel k={k} />
    </AbsoluteFill>
  );
};

export const AnnotationKit: React.FC = () => (
  <AbsoluteFill style={{ background: GREEN.bg }}>
    {kitTimeline().map((k) => (
      <Sequence key={k.code} from={k.from} durationInFrames={k.duration} name={`${k.code} ${k.name}`}>
        <Settle><KitView k={k} /></Settle>
      </Sequence>
    ))}
    {reelCues("kit").map((c, i) => (
      <Sequence key={`a${i}`} from={c.frame} layout="none"><Audio src={staticFile(c.src)} volume={c.volume} /></Sequence>
    ))}
  </AbsoluteFill>
);
