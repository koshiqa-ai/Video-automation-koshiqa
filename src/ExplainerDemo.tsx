// FAQ 8 — explainer-style video built only from the approved layout catalogue.
// Motion kit: highlight rings, camera push-in on taps,
// slide-in scene transitions, confetti on success.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone } from "./components/Phone";
import { Headline } from "./components/Text";
import { buildSaasTimeline, saasAudioCues, type Focus, type SfxPack, type TimedExplainerScene } from "./data/faq-saas";
import type { TimedLayoutScene } from "./data/faq-layouts";
import { FullTorty, geometry, PeekFromSide, PH, PointsOverScreen } from "./LayoutCatalogue";
import { AppScreen, Backdrop, GREEN, theme, toVideo, type Geo } from "./LayoutDemo";
import { ensureFonts } from "./theme/fonts";

ensureFonts();

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fr = (s: number) => Math.round(s * 30);
type P = { x: number; y: number };

// ───────── camera push-in ─────────
const zoomAt = (s: TimedExplainerScene, f: number) => {
  if (!s.zoom) return 1;
  const z = s.zoom.z ?? 1.12;
  return interpolate(f, [fr(s.zoom.at), fr(s.zoom.at) + 12, fr(s.zoom.until), fr(s.zoom.until) + 14], [1, z, z, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
};
/** video point after the phone has been scaled by z around origin o */
export const zoomed = (p: P, o: P, z: number) => ({ x: o.x + (p.x - o.x) * z, y: o.y + (p.y - o.y) * z });

// ───────── highlight ring ─────────
export const FocusRing: React.FC<{ fc: Focus; centre: P; scale: number }> = ({ fc, centre, scale }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - fr(fc.at), fps, config: { damping: 12, stiffness: 160 } });
  if (f < fr(fc.at)) return null;
  const w = fc.w * scale + 28, h = fc.h * scale + 28;
  const pulse = 1 + 0.03 * Math.sin((f - fr(fc.at)) / 5);
  return (
    <div style={{ position: "absolute", left: centre.x - w / 2, top: centre.y - h / 2, width: w, height: h, borderRadius: ((fc.r ?? 16) * scale) + 14, border: `7px solid ${GREEN.mint}`, boxShadow: `0 0 0 5px ${GREEN.deep}, 0 0 40px rgba(194,238,225,0.8)`, opacity: p, scale: String((1.25 - 0.25 * p) * pulse) }} />
  );
};

// ───────── confetti ─────────
export const Confetti: React.FC<{ at: number; origin: P }> = ({ at, origin }) => {
  const f = useCurrentFrame() - fr(at);
  if (f < 0 || f > 70) return null;
  const cols = [GREEN.mint, "#FFFFFF", "#FFC93C", "#FF7A59", GREEN.deep];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(60).fill(0).map((_, i) => {
        const a = -Math.PI / 2 + (random(`a${i}`) - 0.5) * 2.4;
        const v = 18 + random(`v${i}`) * 22;
        const x = origin.x + Math.cos(a) * v * f;
        const y = origin.y + Math.sin(a) * v * f + 0.9 * f * f;
        const w = 14 + random(`w${i}`) * 14;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.5, borderRadius: 3, background: cols[i % cols.length], rotate: `${f * (10 + random(`r${i}`) * 12)}deg`, opacity: interpolate(f, [0, 3, 50, 70], [0, 1, 1, 0], clamp) }} />;
      })}
    </AbsoluteFill>
  );
};

// ───────── one scene ─────────
const SceneView: React.FC<{ s: TimedExplainerScene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g: Geo = geometry({ ...s, name: "", sec: 0 });
  const rise = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } });
  const enter = interpolate(f, [0, 11], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });

  const z = zoomAt(s, f);
  const origin = s.zoom ? toVideo(g, s.zoom.x, s.zoom.y) : { x: 540, y: 960 };
  const screenToFrame = (x: number, y: number) => zoomed(toVideo(g, x, y), origin, z);

  // Torty (same placement rules as the catalogue)
  const T = s.torty;
  let torty: React.ReactNode = null;
  if (T.mode === "peek") {
    const h = s.phone === "full" ? 520 : 600;
    const top = s.phone === "top-half" ? 300 : s.phone === "bottom-half" ? 1260 : 1180;
    torty = <PeekFromSide pose={T.pose} side={T.side ?? "right"} top={top} height={h} />;
  } else if (s.phone === "full") torty = <FullTorty pose={T.pose} left={680} top={1920 - 30 - 640} height={640} />;
  else if (s.phone === "top-half") torty = <FullTorty pose={T.pose} left={600} top={940 - 640 + 30} height={640} />;
  else torty = <FullTorty pose={T.pose} left={(1080 - 820 * 0.62) / 2} top={1920 - 30 - 820} height={820} />;

  // Headline (minimal text)
  let text: React.ReactNode = null;
  if (s.text) {
    const top = s.phone === "full" ? (s.text.pos === "top" ? 170 : g.y + PH(g.s) + 70) : s.phone === "top-half" ? 340 : 1150;
    const left = (s.phone === "top-half" && T.mode === "full") || (s.phone === "bottom-half" && T.mode === "peek");
    text = (
      <div style={{ position: "absolute", left: 80, right: left ? 420 : 80, top, display: "flex", justifyContent: left ? "flex-start" : "center" }}>
        <Headline text={s.text.title} accent={s.text.accent} theme={theme} size={left ? 104 : 110} align={left ? "left" : "center"} delay={4} maxWidth={920} />
      </div>
    );
  }

  return (
    <AbsoluteFill style={{ translate: `${enter * 120}px 0px`, opacity: 1 - enter * 0.6 }}>
      <Backdrop />
      <AbsoluteFill style={{ scale: String(z), transformOrigin: `${origin.x}px ${origin.y}px` }}>
        <Phone scale={g.s} frame={theme.phoneFrame} x={g.x} y={g.y + (1 - rise) * 70} shadow="0 40px 90px rgba(0,50,35,0.38)">
          <AppScreen scene={{ screen: s.screen, duration: s.duration } as unknown as TimedLayoutScene} />
          {s.points && <PointsOverScreen points={s.points} />}
        </Phone>
      </AbsoluteFill>
      {(s.focus ?? []).map((fc, i) => <FocusRing key={i} fc={fc} centre={screenToFrame(fc.x, fc.y)} scale={g.s * z} />)}
      {torty}
      {text}
      {s.confettiAt !== undefined && <Confetti at={s.confettiAt} origin={{ x: 540, y: g.y + 120 }} />}
    </AbsoluteFill>
  );
};

export const ExplainerDemo: React.FC<{ sfx?: SfxPack }> = ({ sfx = "soft" }) => {
  const { scenes } = buildSaasTimeline();
  return (
    <AbsoluteFill style={{ background: GREEN.bg }}>
      {scenes.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={`${s.code} · ${s.id}`}>
          <SceneView s={s} />
        </Sequence>
      ))}
      {saasAudioCues(sfx).map((c, i) => (
        <Sequence key={`a${i}`} from={c.frame} layout="none" name={c.src}>
          <Audio src={staticFile(c.src)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
