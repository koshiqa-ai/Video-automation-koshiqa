// Koshiqa help-video LAYOUT SYSTEM (v4) — renders the fixed set defined in data/layout-system.ts.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone } from "./components/Phone";
import { Headline } from "./components/Text";
import type { TimedLayoutScene } from "./data/faq-layouts";
import { ChatView } from "./screens/chat";
import { WomanTyping } from "./screens/illustrations";
import { headlineTop, isChat, isShot, LS, SHOT_TOP, lsCues, lsTimeline, phoneGeo, shotFit, type FlatPose, type ShotScreen, type LSSlide, type PeekExpr, type PeekSide } from "./data/layout-system";
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

export const CentredHeadline: React.FC<{ title: string; accent?: string; top: number; size?: number }> = ({ title, accent, top, size = LS.headline.size }) => (
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
      {sc.then && <Img src={staticFile(sc.then.image)} style={{ position: "absolute", left: 0, top: offY, width: 390, height, opacity: interpolate(f, [fr(sc.then.at ?? 1.5), fr(sc.then.at ?? 1.5) + 9], [0, 1], clamp) }} />}
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
  // title-first staging: the headline alone (large, centred) for ~1.1 s, then it moves up and the phone rises
  // lead-in: a full-frame illustration first (S1 chat story), then the phone rises at lead.until
  const stage = s.titleFirst ? 33 : s.lead ? fr(s.lead.until) : 0;
  const rise = spring({ frame: f - stage, fps, config: { damping: 18, stiffness: 120 } });
  const hTop = s.kind === "timeline" ? null : headlineTop(layout, torty);
  const a = s.anno;
  const t = a?.target;
  const sc = isShot(s.screen) ? s.screen : undefined;
  // keep it alive after the entrance: a slow float of the phone (design.md §8, ambient motion)
  const float = Math.sin((f - stage) / 38) * 5;
  // zoom: a camera push-in on the whole phone (bezel included) towards the zoom point; the headline and Torty stay
  // put (team review 2026-11-20: zooming inside the screen looked odd). Annotations follow the zoom; the ring is drawn
  // outside the scaled layer so its stroke stays crisp.
  const z = s.zoom ? 1 + (s.zoom.scale - 1) * spring({ frame: f - fr(s.zoom.at), fps, config: { damping: 20, stiffness: 70 } }) : 1;
  const zx = s.zoom?.x ?? 195, zy = s.zoom?.y ?? 422;
  const zt = t && { ...t, x: zx + (t.x - zx) * z, y: zy + (t.y - zy) * z, w: t.w * z, h: t.h * z, r: t.r !== undefined ? t.r * z : undefined };
  const zo = toVideo(g, zx, zy);
  const mockProps = (s.screen as { props?: { liftAt?: number; confetti?: boolean } } | undefined)?.props;
  const confettiAt = sc?.then?.confetti ? (sc.then.at ?? 0) + 0.15 : mockProps?.confetti && mockProps.liftAt !== undefined ? mockProps.liftAt + 0.15 : null;
  const burst = zt ? toVideo(g, zt.x, zt.y) : { x: 540, y: g.y + 600 };
  const move = s.titleFirst ? interpolate(f, [24, 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 1;
  const midTop = 840;
  // how much bigger the headline is while alone in the middle: up to 1.3×, but never wider than the frame
  const big = Math.min(1.3, 1000 / ((s.title?.length ?? 10) * 0.54 * LS.headline.size)) - 1;
  return (
    <AbsoluteFill>
      <Backdrop />
      {s.lead && f < stage + 10 && (
        <AbsoluteFill style={{ opacity: interpolate(f, [stage - 6, stage + 6], [1, 0], clamp), scale: String(1 + 0.08 * interpolate(f, [stage - 6, stage + 8], [0, 1], clamp)) }}>
          <WomanTyping />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ opacity: s.titleFirst || s.lead ? interpolate(f, [stage - 4, stage + 6], [0, 1], clamp) : 1 }}>
        {/* when zoomed, the phone fades out just under the headline so the headline stays on clean background */}
        <div style={{ position: "absolute", inset: 0, ...(s.zoom && hTop !== null ? { maskImage: `linear-gradient(to bottom, transparent ${hTop + 110}px, black ${hTop + 148}px)`, WebkitMaskImage: `linear-gradient(to bottom, transparent ${hTop + 110}px, black ${hTop + 148}px)` } : {}) }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${zo.x}px ${zo.y + float * rise}px` }}>
        <Phone scale={g.s} frame={theme.phoneFrame} x={g.x} y={g.y + (1 - rise) * 60 + float * rise} shadow="0 40px 90px rgba(0,50,35,0.38)">
          <div style={{ position: "absolute", left: 0, top: 0, width: 390, height: 844, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0 }}>
              {isChat(s.screen) ? <ChatView chat={s.screen.chat} /> : isShot(s.screen)
                ? <ShotView sc={s.screen} cursorSize={a?.kind === "hand" ? 0 : 36} rippleScale={g.s > 2 ? 0.8 : 0.9} />
                : <AppScreen scene={{ screen: s.screen, duration: s.duration } as unknown as TimedLayoutScene} cursorSize={a?.kind === "hand" ? 0 : 36} rippleScale={g.s > 2 ? 0.8 : 0.9} />}
              {a?.kind === "spotlight" && t && <Spotlight t={t} at={a.at ?? 0.6} />}
            </div>
          </div>
        </Phone>
        </div>
        </div>
        <div style={{ position: "absolute", inset: 0, translate: `0px ${float * rise}px` }}>
          {a?.kind === "ring" && zt && <FocusRing fc={{ ...zt, at: a.at ?? 0.6 }} centre={toVideo(g, zt.x, zt.y)} scale={g.s} />}
          {a?.kind === "tooltip" && zt && <DarkTooltip x={toVideo(g, zt.x, zt.y).x} y={toVideo(g, zt.x, zt.y - zt.h / 2).y - 14} label={a.label!} at={a.at ?? 0.6} />}
          {a?.kind === "hand" && zt && <TortyHand tip={toVideo(g, zt.x, zt.y)} tapAt={s.screen!.taps![0].at} />}
          {confettiAt !== null && <Confetti at={confettiAt} origin={burst} />}
        </div>
      </AbsoluteFill>
      {a?.kind === "success" && <Confetti at={a.at ?? 0.9} origin={{ x: 540, y: g.y + 300 }} />}
      {s.timeline && <StepTimeline labels={s.timeline.labels} current={s.timeline.current} />}
      {hTop !== null && s.title && (
        <div style={{ position: "absolute", inset: 0, translate: `0px ${(1 - move) * (midTop - hTop)}px`, scale: String(1 + Math.max(0, big) * (1 - move)), transformOrigin: `540px ${hTop + 60}px` }}>
          <CentredHeadline title={s.title} accent={s.accent} top={hTop} />
        </div>
      )}
      {s.peek && <TortyPeek expr={s.peek.expr} side={s.peek.side} delay={6 + stage} />}
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

// ───────── F1 intro: the headline follows the voice; a day card lifts to the target (team review 2026-11-20) ─────────
const fmtN = (n: number) => Math.round(n).toLocaleString("en-US");
/** a calendar day note, drawn large (the same look as the calendar mockup's notes) */
const BigDayNote: React.FC<{ day: number; value: number; green: number; w: number; tone?: "gold" }> = ({ day, value, green, w, tone }) => {
  const h = w * 1.1;
  const r = `${w * 0.05}px ${w * 0.05}px ${w * 0.18}px ${w * 0.05}px`;
  // gold = a capped / boosted day in the app's calendar (Booster Card): gold before and after, only the number changes
  if (tone === "gold") {
    const ink = "#6B5526";
    return (
      <div style={{ position: "relative", width: w, height: h }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: r, background: "linear-gradient(160deg, #FBC845 0%, #FDE38C 50%, #F0C463 100%)", boxShadow: "0 24px 50px rgba(0,40,28,0.35)" }} />
        <div style={{ position: "absolute", left: w * 0.13, top: w * 0.17, fontFamily: "Poppins", fontWeight: 700, fontSize: w * 0.24, lineHeight: 1, color: ink }}>Day {day}</div>
        <div style={{ position: "absolute", left: w * 0.13, top: w * 0.55, fontFamily: "Poppins", fontWeight: 800, fontSize: w * 0.22, lineHeight: 1, color: ink }}>{fmtN(value)}</div>
        <div style={{ position: "absolute", left: w * 0.13, top: w * 0.8, fontFamily: "Poppins", fontWeight: 600, fontSize: w * 0.09, lineHeight: 1, color: ink, opacity: 0.8 }}>steps</div>
      </div>
    );
  }
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: r, background: "linear-gradient(160deg, #F2F2F2 0%, #DCDCDC 100%)", boxShadow: "0 24px 50px rgba(0,40,28,0.35)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: green, borderRadius: r, background: "linear-gradient(160deg, #DFFFBE 0%, #C3F58F 55%, #B0EC77 100%)" }} />
      <div style={{ position: "absolute", left: w * 0.13, top: w * 0.17, fontFamily: "Poppins", fontWeight: 700, fontSize: w * 0.24, lineHeight: 1, color: green > 0.5 ? "#4D7324" : "#8A8A8A" }}>Day {day}</div>
      <div style={{ position: "absolute", left: w * 0.13, top: w * 0.55, fontFamily: "Poppins", fontWeight: 800, fontSize: w * 0.22, lineHeight: 1, color: green > 0.5 ? "#26620F" : "#8F8F8F" }}>{fmtN(value)}</div>
      <div style={{ position: "absolute", left: w * 0.13, top: w * 0.8, fontFamily: "Poppins", fontWeight: 600, fontSize: w * 0.09, lineHeight: 1, color: green > 0.5 ? "#4D7324" : "#9A9A9A" }}>steps</div>
    </div>
  );
};

const IntroSlide: React.FC<{ s: LSSlide & { duration: number } }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const F = LS.fullTorty;
  const intro = s.intro!;
  const cur = intro.steps.reduce((k, st, i) => (f >= fr(st.at) ? i : k), 0);
  const pose = intro.steps.slice(0, cur + 1).reduce<FlatPose>((p, st) => st.pose ?? p, s.fullTorty!.pose);
  const poseSince = f - fr(intro.steps.slice(0, cur + 1).reduce((t, st) => (st.pose ? st.at : t), 0)) - 4;
  const L = intro.lift;
  // Torty steps aside (smaller, bottom right) when the day card comes in
  const k = L ? spring({ frame: f - fr(L.at), fps, config: { damping: 16, stiffness: 110 } }) : 0;
  const tH = F.height - 460 * k, tTop = F.top + 240 + F.gap + (1280 - (F.top + 240 + F.gap)) * k, tX = 230 * k;
  const pCard = L ? spring({ frame: f - fr(L.at) - 4, fps, config: { damping: 11, stiffness: 150 } }) : 0;
  const lift = L ? interpolate(f, [fr(L.liftAt), fr(L.liftAt) + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) : 0;
  const bob = Math.sin(f / 12) * 6;
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: 90 + tX, top: tTop + tH / 2 - 450, width: 900, height: 900, borderRadius: 450, background: "radial-gradient(circle, rgba(194,238,225,0.42), transparent 68%)", scale: String(1 - 0.4 * k) }} />
      <div style={{ position: "absolute", left: tX, right: -tX, top: tTop, display: "flex", justifyContent: "center", translate: `0px ${Math.sin(f / 10) * 6}px` }}>
        <TortyFlat pose={pose} height={tH} since={poseSince} />
      </div>
      {intro.steps.map((st, i) => {
        const next = intro.steps[i + 1];
        // the old line clears (6 frames) before the new one starts, so they never overlap
        const start = fr(st.at) + (i > 0 ? 6 : 0);
        if (f < start || (next && f >= fr(next.at) + 6)) return null;
        const out = next ? interpolate(f, [fr(next.at), fr(next.at) + 6], [1, 0], clamp) : 1;
        return (
          <Sequence key={i} from={start} layout="none">
            <div style={{ position: "absolute", inset: 0, opacity: out, translate: `0px ${(1 - out) * -40}px` }}>
              <CentredHeadline title={st.title} accent={st.accent} top={F.top} size={F.textSize} />
            </div>
          </Sequence>
        );
      })}
      {L && f >= fr(L.at) && (
        <>
          <div style={{ position: "absolute", left: 540 - 170 - 120, top: 640 + bob, scale: String(pCard), rotate: `${-4 + 4 * lift}deg` }}>
            <BigDayNote day={L.day} value={L.base + (L.target - L.base) * lift} green={lift} w={340} tone={L.tone} />
            {L.badge && (() => {
              const pb = spring({ frame: f - fr(L.liftAt) - 6, fps, config: { damping: 9, stiffness: 160 } });
              return pb > 0.01 ? <Img src={staticFile(L.badge)} style={{ position: "absolute", left: 340 - 62, top: -66, width: 124, height: 124, scale: String(pb), rotate: `${(1 - pb) * -40}deg`, filter: "drop-shadow(0 8px 14px rgba(0,40,28,0.35))" }} /> : null;
            })()}
          </div>
          {lift > 0 && <div style={{ position: "absolute", left: 540 - 170 - 120 - 20, top: 620 + bob, width: 380, height: 414, borderRadius: 40, boxShadow: `0 0 ${40 + 30 * Math.sin(f / 8)}px rgba(194,238,225,${0.55 * lift})`, pointerEvents: "none" }} />}
          <Confetti at={L.liftAt + 0.2} origin={{ x: 420, y: 820 }} />
        </>
      )}
      <CodeTag s={s} />
    </AbsoluteFill>
  );
};

// ───────── full Torty + text (F1/F2) ─────────
const FullTortySlide: React.FC<{ s: LSSlide & { duration: number } }> = ({ s }) => {
  const f = useCurrentFrame();
  if (s.intro) return <IntroSlide s={s} />;
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
