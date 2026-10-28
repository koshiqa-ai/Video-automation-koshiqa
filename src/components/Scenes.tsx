import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { TortyMood } from "../data/faqs";
import { poseFor, TortyCutout, type TortyGesture } from "../torty/TortyCutout";
import type { TimedScene } from "../data/timeline";
import type { Theme } from "../theme/themes";
import { Caption, Chip, Headline } from "./Text";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** What a scene can ask of Torty beyond his mood */
export type TortyRig = { talk?: number; gesture?: TortyGesture; since?: number; sway?: number };

/** Torty from the designers' cutouts. `rig` adds a gesture pose, talk bounce, pose pop and sway. */
export const Torty: React.FC<{ mood: TortyMood; height: number; style?: React.CSSProperties; rig?: TortyRig }> = ({ mood, height, style, rig }) => (
  <div style={style}>
    <TortyCutout pose={poseFor(mood, rig?.gesture)} height={height} talk={rig?.talk} since={rig?.since} sway={rig?.sway} />
  </div>
);

export const KoshiqaBadge: React.FC<{ theme: Theme; label?: string }> = ({ theme, label = "Koshiqa FAQ" }) => (
  <Chip theme={theme}>
    <Img src={staticFile("brand/logo-app.jpg")} style={{ width: 44, height: 44, borderRadius: 12, marginLeft: -12 }} />
    {label}
  </Chip>
);

export const Background: React.FC<{ theme: Theme }> = ({ theme }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: theme.background, overflow: "hidden" }}>
      {theme.blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x + Math.sin(f / 70 + i * 2) * 40,
            top: b.y + Math.cos(f / 85 + i) * 40,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color} 0%, transparent 68%)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ───────────────────────── Hook (front-slide style) ─────────────────────────
export const HookScene: React.FC<{ scene: TimedScene; theme: Theme; rig?: (f: number) => TortyRig }> = ({ scene, theme, rig }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voFrom = scene.voFrom - scene.from;
  const card = spring({ frame: f, fps, config: { damping: 15, stiffness: 120 } });
  const jump = spring({ frame: f, fps, delay: 6, config: { damping: 9, stiffness: 110 } });
  const exit = interpolate(f, [scene.duration - 10, scene.duration], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const bob = Math.sin(f / 9) * 8;
  const marks = [
    { x: 150, y: 260, r: -14, d: 16 },
    { x: 760, y: 320, r: 12, d: 22 },
    { x: 700, y: 140, r: -6, d: 28 },
  ];
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, translate: `0px ${-90 * exit}px` }}>
      <div style={{ position: "absolute", left: 80, top: 110 }}>
        <KoshiqaBadge theme={theme} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 210,
          width: 920,
          height: 860,
          borderRadius: 64,
          background: theme.hookCard,
          overflow: "hidden",
          scale: String(0.82 + 0.18 * card),
          opacity: card,
          boxShadow: "0 30px 70px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ position: "absolute", left: 210, top: 120, width: 500, height: 500, borderRadius: 250, background: "radial-gradient(circle, rgba(255,255,255,0.22), transparent 70%)" }} />
        {marks.map((m, i) => {
          const p = spring({ frame: f, fps, delay: m.d, config: { damping: 10 } });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: m.x,
                top: m.y + Math.sin(f / 11 + i) * 12,
                fontFamily: theme.headlineFont,
                fontWeight: 900,
                fontSize: 120,
                color: theme.key === "volt" || theme.key === "sky" ? "#E4F95B" : theme.key === "mint" ? "#06231C" : theme.accent,
                rotate: `${m.r}deg`,
                scale: String(p),
                opacity: 0.9,
              }}
            >
              ?
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -10,
            display: "flex",
            justifyContent: "center",
            translate: `0px ${(1 - jump) * 700 + bob}px`,
          }}
        >
          <Torty mood={scene.torty ?? "sad"} height={760} rig={rig?.(f)} style={{ scale: `${1 + (1 - jump) * 0.08} ${1 - (1 - jump) * 0.08}`, transformOrigin: "bottom center" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 1130, display: "flex", flexDirection: "column", gap: 34 }}>
        <Headline text={scene.title} accent={scene.accent} theme={theme} size={Math.round(theme.headlineSize * 1.1)} delay={10} />
        <Caption text={scene.vo} theme={theme} voFrom={voFrom} voSec={scene.voSec} color={theme.subText} size={42} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── Outro ─────────────────────────
const CONFETTI_COLORS: Record<string, string[]> = {
  volt: ["#11140A", "#FFFFFF", "#075DC2", "#FF6A3D"],
  blush: ["#FF6A3D", "#FFFFFF", "#075DC2", "#FFC93C"],
  aurora: ["#D8FF5C", "#FFFFFF", "#FF7AD9", "#5CE1FF"],
  mint: ["#2DE1B4", "#FFC439", "#FFFFFF", "#7AF0FF"],
  sky: ["#075DC2", "#FFFFFF", "#E4F95B", "#FF6A3D"],
};

const Confetti: React.FC<{ theme: Theme; start: number }> = ({ theme, start }) => {
  const f = useCurrentFrame() - start;
  if (f < 0) return null;
  const colors = CONFETTI_COLORS[theme.key] ?? CONFETTI_COLORS.sky;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(70).fill(0).map((_, i) => {
        const a = random(`a${i}`) * Math.PI * 2;
        const v = 14 + random(`v${i}`) * 26;
        const t = f;
        const x = 540 + Math.cos(a) * v * t * 0.9;
        const y = 640 + Math.sin(a) * v * t * 0.9 - 10 * t + 0.9 * t * t;
        const o = interpolate(t, [0, 3, 40, 60], [0, 1, 1, 0], clamp);
        const w = 14 + random(`w${i}`) * 16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: w * (random(`s${i}`) > 0.5 ? 0.45 : 1),
              borderRadius: random(`r${i}`) > 0.6 ? w : 3,
              background: colors[i % colors.length],
              rotate: `${t * (8 + random(`rot${i}`) * 14)}deg`,
              opacity: o,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const OutroScene: React.FC<{ scene: TimedScene; theme: Theme; tagline?: string; rig?: (f: number) => TortyRig }> = ({ scene, theme, tagline = "More answers in Help & Support", rig }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voFrom = scene.voFrom - scene.from;
  const pop = spring({ frame: f, fps, delay: 2, config: { damping: 8, stiffness: 120 } });
  const lock = spring({ frame: f, fps, delay: Math.round(scene.duration - 2.1 * fps), config: { damping: 14 } });
  const bob = Math.sin(f / 7) * 10;
  const onDark = theme.key === "aurora" || theme.key === "mint";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 760, height: 760, borderRadius: 380, background: onDark ? "radial-gradient(circle, rgba(255,255,255,0.18), transparent 68%)" : "radial-gradient(circle, rgba(255,255,255,0.65), transparent 68%)", scale: String(pop) }} />
      </div>
      <Confetti theme={theme} start={4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", translate: `0px ${bob}px` }}>
        <Torty mood={scene.torty ?? "happy"} height={820} rig={rig?.(f)} style={{ scale: String(pop), transformOrigin: "bottom center" }} />
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1110, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <Headline text={scene.title} accent={scene.accent} theme={theme} size={Math.round(theme.headlineSize * 1.15)} align="center" delay={8} />
        <Caption text={scene.vo} theme={theme} voFrom={voFrom} voSec={scene.voSec} align="center" color={theme.subText} size={42} maxWidth={860} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1600,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          opacity: lock,
          translate: `0px ${(1 - lock) * 40}px`,
        }}
      >
        <Img src={staticFile("brand/logo-app.jpg")} style={{ width: 112, height: 112, borderRadius: 30, boxShadow: "0 12px 30px rgba(7,93,194,0.35)" }} />
        <div>
          <div style={{ fontFamily: theme.headlineFont, fontWeight: theme.headlineWeight, fontSize: 64, color: theme.text, letterSpacing: "-0.02em", lineHeight: 1 }}>Koshiqa</div>
          <div style={{ fontFamily: theme.bodyFont, fontWeight: 600, fontSize: 30, color: theme.subText, marginTop: 8 }}>{tagline}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
