// Koshiqa help-video LAYOUT SYSTEM (v4) — renders the fixed set defined in data/layout-system.ts.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone } from "./components/Phone";
import { Headline } from "./components/Text";
import type { TimedLayoutScene } from "./data/faq-layouts";
import { headlineTop, isShot, LS, SHOT_TOP, lsCues, lsTimeline, phoneGeo, shotFit, type FlatPose, type ShotScreen, type LSSlide, type PeekExpr, type PeekSide } from "./data/layout-system";
import { Confetti, FocusRing } from "./ExplainerDemo";
import { AppScreen, Backdrop, GREEN, theme, toVideo } from "./LayoutDemo";
import { TortyHand } from "./LayoutsV3";
import { Icon, StatusBar } from "./screens/ui";
import { TapCursor } from "./components/TapCursor";
import { ensureFonts } from "./theme/fonts";
import FLAT from "./torty/flat.json";
import PEEK from "./torty/peek-flat.json";

ensureFonts();

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fr = (s: number) => Math.round(s * 30);

// ───────── Torty (flat style) ─────────
/** peek: head + arms + top of shell rising from a bottom corner, tilted toward the phone */
export const TortyPeek: React.FC<{ expr: PeekExpr; side: PeekSide; delay?: number }> = ({ expr, side, delay = 6 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: { damping: 12, stiffness: 130 } });
  const m = PEEK[expr];
  const h = LS.peek.height;
  const w = (m.w * h) / m.h;
  const cx = side === "left" ? LS.peek.centreX : 1080 - LS.peek.centreX;
  const top = 1920 + LS.peek.sink - h;
  const tilt = (side === "left" ? 1 : -1) * LS.peek.tilt;
  const bob = Math.sin((f - delay) / 12) * 4;
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: top + (1 - p) * (h + 40) + bob, width: w, height: h, rotate: `${tilt * (0.5 + 0.5 * p)}deg`, transformOrigin: "50% 100%", filter: "drop-shadow(0 -6px 22px rgba(0,50,35,0.25))" }}>
      <Img src={staticFile(`torty/peek-flat/peek-${side}-${expr}.png`)} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

/** full-body flat Torty; `height` = feet-to-head (effect marks sit outside it) */
export const TortyFlat: React.FC<{ pose: FlatPose; height: number; since?: number }> = ({ pose, height, since = 0 }) => {
  const { fps } = useVideoConfig();
  const m = FLAT[pose];
  const k = height / (m.bodyBottom - m.bodyTop);
  const pop = spring({ frame: since, fps, config: { damping: 10, stiffness: 140 } });
  const bodyCx = ((m.bodyLeft + m.bodyRight) / 2) * k;
  return (
    <div style={{ position: "relative", width: 0, height }}>
      <Img src={staticFile(`torty/flat/${pose}.png`)} style={{ position: "absolute", left: -bodyCx, top: -m.bodyTop * k, width: m.w * k, height: m.h * k, scale: String(0.9 + 0.1 * pop), transformOrigin: `${bodyCx}px ${m.bodyBottom * k}px`, filter: "drop-shadow(0 20px 26px rgba(0,50,35,0.3))" }} />
    </div>
  );
};

const CentredHeadline: React.FC<{ title: string; accent?: string; top: number; size?: number }> = ({ title, accent, top, size = LS.headline.size }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", justifyContent: "center" }}>
    <Headline text={title} accent={accent} theme={theme} size={size} align="center" delay={3} maxWidth={960} />
  </div>
);

/** code tags (S2 · L …) show on the review reel only; real videos turn them off */
export const ShowCodeTags = React.createContext(true);
const CodeTag: React.FC<{ s: LSSlide }> = ({ s }) => {
  if (!React.useContext(ShowCodeTags)) return null;
  const suffix = s.peek ? ` · ${s.peek.side === "left" ? "L" : "R"}` : s.row === 4 ? " · N" : "";
  return <div style={{ position: "absolute", right: 28, top: 24, padding: "4px 14px", borderRadius: 16, background: "rgba(0,0,0,0.22)", color: "rgba(255,255,255,0.85)", fontFamily: "Poppins", fontWeight: 600, fontSize: 24 }}>{s.code}{suffix}</div>;
};

// ───────── annotations that live inside the phone (screen coords) ─────────
const Spotlight: React.FC<{ t: NonNullable<NonNullable<LSSlide["anno"]>["target"]>; at: number }> = ({ t, at }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [fr(at - 0.1), fr(at + 0.3)], [0, 1], clamp);
  const pad = 8;
  return <div style={{ position: "absolute", left: t.x - t.w / 2 - pad, top: t.y - t.h / 2 - pad, width: t.w + pad * 2, height: t.h + pad * 2, borderRadius: (t.r ?? 16) + pad, boxShadow: `0 0 0 2000px rgba(5,30,22,${0.62 * o})`, outline: `${3 * o}px solid ${GREEN.mint}` }} />;
};

const DarkTooltip: React.FC<{ x: number; y: number; label: string; at: number }> = ({ x, y, label, at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < fr(at)) return null;
  const p = spring({ frame: f - fr(at), fps, config: { damping: 11, stiffness: 170 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -100%", scale: String(p), transformOrigin: "50% 100%" }}>
      <div style={{ padding: "18px 32px", borderRadius: 40, background: GREEN.ink, color: "#fff", fontFamily: "Poppins", fontWeight: 700, fontSize: 40, whiteSpace: "nowrap", boxShadow: "0 16px 34px rgba(0,20,14,0.45)", border: "2px solid rgba(255,255,255,0.14)" }}>{label}</div>
      <div style={{ width: 0, height: 0, margin: "-1px auto 0", borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `22px solid ${GREEN.ink}` }} />
    </div>
  );
};

// ───────── a real screenshot inside the phone (taps already in screen coords) ─────────
const ShotView: React.FC<{ sc: ShotScreen; cursorSize: number; rippleScale: number }> = ({ sc, cursorSize, rippleScale }) => {
  const f = useCurrentFrame();
  const { offY, cut, height } = shotFit(sc.w, sc.h);
  const gestures = (sc.taps ?? []).map((t) => ({ ...t, frame: fr(t.at) }));
  const src = staticFile(sc.image);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 390, height: 844, overflow: "hidden", background: "#000" }}>
      <Img src={src} style={{ position: "absolute", left: 0, top: offY, width: 390, height }} />
      {/* clean status bar: the app's first row of pixels stretched up, with a 9:41 bar that inverts to stay readable */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 390, height: SHOT_TOP, overflow: "hidden" }}>
        <div style={{ width: 390, height: 2, backgroundImage: `url(${src})`, backgroundSize: `390px ${height}px`, backgroundPosition: `0px ${-(cut + 1)}px`, transform: `scaleY(${SHOT_TOP / 2})`, transformOrigin: "top" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: -3, width: 390, height: SHOT_TOP, mixBlendMode: "difference" }}><StatusBar light /></div>
      <TapCursor f={f} gestures={gestures} fill={theme.cursor.fill} stroke={theme.cursor.stroke} ripple={theme.cursor.ripple} size={cursorSize} rippleScale={rippleScale} />
    </div>
  );
};

// ───────── phone slides (S1–S4, T2, K*) ─────────
const PhoneSlide: React.FC<{ s: LSSlide & { duration: number } }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const torty = !!s.peek;
  const layout = s.layout!;
  const g = phoneGeo(layout, torty);
  const rise = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } });
  const hTop = s.kind === "timeline" ? null : headlineTop(layout, torty);
  const a = s.anno;
  const t = a?.target;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Phone scale={g.s} frame={theme.phoneFrame} x={g.x} y={g.y + (1 - rise) * 60} shadow="0 40px 90px rgba(0,50,35,0.38)">
        {isShot(s.screen)
          ? <ShotView sc={s.screen} cursorSize={a?.kind === "hand" ? 0 : 36} rippleScale={g.s > 2 ? 0.8 : 0.9} />
          : <AppScreen scene={{ screen: s.screen, duration: s.duration } as unknown as TimedLayoutScene} cursorSize={a?.kind === "hand" ? 0 : 36} rippleScale={g.s > 2 ? 0.8 : 0.9} />}
        {a?.kind === "spotlight" && t && <Spotlight t={t} at={a.at ?? 0.6} />}
      </Phone>
      {a?.kind === "ring" && t && <FocusRing fc={{ ...t, at: a.at ?? 0.6 }} centre={toVideo(g, t.x, t.y)} scale={g.s} />}
      {a?.kind === "tooltip" && t && <DarkTooltip x={toVideo(g, t.x, t.y).x} y={toVideo(g, t.x, t.y - t.h / 2).y - 14} label={a.label!} at={a.at ?? 0.6} />}
      {a?.kind === "hand" && t && <TortyHand tip={toVideo(g, t.x, t.y)} tapAt={s.screen!.taps![0].at} />}
      {a?.kind === "success" && <Confetti at={a.at ?? 0.9} origin={{ x: 540, y: g.y + 300 }} />}
      {s.timeline && <StepTimeline labels={s.timeline.labels} current={s.timeline.current} />}
      {hTop !== null && s.title && <CentredHeadline title={s.title} accent={s.accent} top={hTop} />}
      {s.peek && <TortyPeek expr={s.peek.expr} side={s.peek.side} />}
      <CodeTag s={s} />
    </AbsoluteFill>
  );
};

// ───────── progress timeline (top of a phone layout) ─────────
export const StepTimeline: React.FC<{ labels: string[]; current: number }> = ({ labels, current }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = LS.timeline;
  const move = interpolate(f, [fr(0.4), fr(0.8)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }); // previous → current
  const pop = spring({ frame: f - fr(0.7), fps, config: { damping: 10, stiffness: 170 } });
  const r = T.dot / 2;
  return (
    <AbsoluteFill>
      <svg width={1080} height={300} style={{ position: "absolute", inset: 0 }}>
        {T.xs.slice(0, -1).map((x, i) => {
          const x2 = T.xs[i + 1];
          const filled = i < current - 1 ? 1 : i === current - 1 ? move : 0;
          return (
            <g key={i}>
              <line x1={x + r + 8} y1={T.y} x2={x2 - r - 8} y2={T.y} stroke="rgba(255,255,255,0.3)" strokeWidth={6} strokeLinecap="round" />
              <line x1={x + r + 8} y1={T.y} x2={x + r + 8 + (x2 - x - 2 * r - 16) * filled} y2={T.y} stroke={GREEN.mint} strokeWidth={6} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
      {T.xs.map((x, i) => {
        const done = i < current || (i === current - 1 && move > 0);
        const isCur = i === current;
        const sc = isCur ? 0.85 + 0.3 * pop : 1;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - r, top: T.y - r, width: T.dot, height: T.dot, borderRadius: r, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: 38, scale: String(sc),
              background: isCur ? "#fff" : done ? GREEN.mint : "transparent", color: isCur ? GREEN.bg : GREEN.deep, border: isCur || done ? "none" : "4px solid rgba(255,255,255,0.55)",
              boxShadow: isCur ? `0 0 0 ${10 * pop}px rgba(194,238,225,0.3)` : "none" }}>
              {done && !isCur ? <Icon name="check" size={40} color={GREEN.deep} stroke={3} /> : <span style={{ color: isCur ? GREEN.bg : "rgba(255,255,255,0.7)" }}>{i + 1}</span>}
            </div>
            <div style={{ position: "absolute", left: x - 170, width: 340, top: T.y + r + 14, textAlign: "center", fontFamily: "Poppins", fontWeight: isCur ? 700 : 500, fontSize: T.labelSize, color: isCur ? "#fff" : "rgba(255,255,255,0.55)" }}>{labels[i]}</div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ───────── full-screen list (pointers P1/P2, steps list T1) ─────────
const ListBadge: React.FC<{ style: "num" | "icon" | "toc"; i: number; icon?: string; p: number }> = ({ style, i, icon, p }) => {
  const B = LS.list.badge;
  const bg = style === "num" ? GREEN.mint : style === "icon" ? GREEN.cream : "#fff";
  const col = style === "num" ? GREEN.deep : GREEN.bg;
  return (
    <div style={{ width: B, height: B, borderRadius: B / 2, flexShrink: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: col, fontFamily: "Poppins", fontWeight: 700, fontSize: 70, scale: String(p), boxShadow: "0 12px 28px rgba(0,50,35,0.3)", position: "relative", zIndex: 1 }}>
      {style === "icon" ? <Icon name={icon ?? "check"} size={76} color={col} stroke={2.1} /> : i + 1}
    </div>
  );
};

const ListSlide: React.FC<{ s: LSSlide & { duration: number } }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = LS.list;
  const list = s.list!;
  const step = L.badge + L.gap;
  const lineTo = interpolate(f, list.times.map(fr), list.times.map((_, i) => i * step), clamp);
  const eb = interpolate(f, [2, 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Backdrop />
      {list.eyebrow && (
        <div style={{ position: "absolute", left: 0, right: 0, top: L.eyebrowTop, textAlign: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: 38, letterSpacing: "0.14em", color: GREEN.mint, opacity: eb }}>{list.eyebrow}</div>
      )}
      <CentredHeadline title={s.title!} accent={s.accent} top={L.headingTop} size={L.headingSize} />
      <div style={{ position: "absolute", left: 0, right: 0, top: L.top, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", gap: L.gap }}>
          {list.style === "toc" && f >= fr(list.times[0]) && (
            <div style={{ position: "absolute", left: L.badge / 2 - 3, top: L.badge / 2, width: 6, height: lineTo, borderRadius: 3, background: "rgba(255,255,255,0.5)" }} />
          )}
          {list.items.map((it, i) => {
            const p = spring({ frame: f - fr(list.times[i]), fps, config: { damping: 11, stiffness: 170 } });
            const tIn = interpolate(f, [fr(list.times[i]) + 2, fr(list.times[i]) + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 36, opacity: f < fr(list.times[i]) ? 0 : 1 }}>
                <ListBadge style={list.style} i={i} icon={it.icon} p={p} />
                <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: L.text, color: "#fff", whiteSpace: "nowrap", opacity: tIn, translate: `${(1 - tIn) * -30}px 0px` }}>{it.text}</div>
              </div>
            );
          })}
        </div>
      </div>
      {s.peek && <TortyPeek expr={s.peek.expr} side={s.peek.side} />}
      <CodeTag s={s} />
    </AbsoluteFill>
  );
};

// ───────── full Torty + text (F1/F2) ─────────
const FullTortySlide: React.FC<{ s: LSSlide & { duration: number } }> = ({ s }) => {
  const f = useCurrentFrame();
  const F = LS.fullTorty;
  const ft = s.fullTorty!;
  const textTop = ft.textOnTop ? F.top : F.top + F.height + F.gap;
  const tortyTop = ft.textOnTop ? F.top + 240 + F.gap : F.top;
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: 90, top: tortyTop + F.height / 2 - 450, width: 900, height: 900, borderRadius: 450, background: "radial-gradient(circle, rgba(194,238,225,0.42), transparent 68%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: tortyTop, display: "flex", justifyContent: "center", translate: `0px ${Math.sin(f / 10) * 6}px` }}>
        <TortyFlat pose={ft.pose} height={F.height} since={f - 4} />
      </div>
      <CentredHeadline title={s.title!} accent={s.accent} top={textTop} size={F.textSize} />
      <CodeTag s={s} />
    </AbsoluteFill>
  );
};

export const LSSlideView: React.FC<{ s: LSSlide & { duration: number } }> = ({ s }) =>
  s.kind === "full-torty" ? <FullTortySlide s={s} /> : s.kind === "pointer" || s.kind === "toc" ? <ListSlide s={s} /> : <PhoneSlide s={s} />;

export const Settle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const e = interpolate(f, [0, 11], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ translate: `${e * 100}px 0px`, opacity: 1 - e * 0.6 }}>{children}</AbsoluteFill>;
};

export const LayoutSystem: React.FC = () => (
  <AbsoluteFill style={{ background: GREEN.bg }}>
    {lsTimeline().map((s) => (
      <Sequence key={`${s.row}-${s.code}`} from={s.from} durationInFrames={s.duration} name={`${s.row} ${s.code} ${s.name}`}>
        <Settle><LSSlideView s={s} /></Settle>
      </Sequence>
    ))}
    {lsCues().map((c, i) => (
      <Sequence key={`a${i}`} from={c.frame} layout="none"><Audio src={staticFile(c.src)} volume={c.volume} /></Sequence>
    ))}
  </AbsoluteFill>
);
