// Arrow cursor that glides to each target and "taps".
// On every tap a low-opacity circle pops out from the arrow tip and a ring
// expands outwards — the tap feel the design team liked in the references.
import React from "react";
import { Easing, interpolate } from "remotion";
import type { TimedGesture } from "../data/timeline";

type Props = {
  f: number;
  gestures: TimedGesture[];
  fill: string;
  stroke: string;
  /** "r,g,b" for the ripple */
  ripple: string;
  size?: number;
  /** shrink/grow the tap ripple (e.g. when the screen itself is scaled up) */
  rippleScale?: number;
};

const SWIPE_LEN = 200;
const SWIPE_FRAMES = 16;
const HOLD_FRAMES = 20;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

const position = (f: number, gs: TimedGesture[]) => {
  const first = gs[0];
  // Enter from lower right
  let x = first.x + 70;
  let y = first.y + 150;
  const travel = 18;
  if (f <= first.frame - 4) {
    const p = interpolate(f, [first.frame - 4 - travel, first.frame - 4], [0, 1], { ...clamp, easing: ease });
    return { x: x + (first.x - x) * p, y: y + (first.y - y) * p };
  }
  for (let i = 0; i < gs.length; i++) {
    const g = gs[i];
    const endY = g.kind === "swipe-down" ? g.y + SWIPE_LEN : g.y;
    const gEnd = g.kind === "swipe-down" ? g.frame + SWIPE_FRAMES : g.frame;
    if (f <= gEnd) {
      const p = interpolate(f, [g.frame, gEnd], [0, 1], { ...clamp, easing: ease });
      return { x: g.x, y: g.y + (endY - g.y) * p };
    }
    const next = gs[i + 1];
    if (!next) return { x: g.x + interpolate(f, [gEnd + 14, gEnd + 34], [0, 40], clamp), y: endY + interpolate(f, [gEnd + 14, gEnd + 34], [0, 80], clamp) };
    if (f <= next.frame - 4) {
      const p = interpolate(f, [Math.max(gEnd + 6, next.frame - 4 - travel), next.frame - 4], [0, 1], { ...clamp, easing: ease });
      return { x: g.x + (next.x - g.x) * p, y: endY + (next.y - endY) * p };
    }
    x = next.x;
    y = next.y;
  }
  return { x, y };
};

export const TapCursor: React.FC<Props> = ({ f, gestures, fill, stroke, ripple, size = 40, rippleScale = 1 }) => {
  const B = 34 * rippleScale, R = 40 * rippleScale;
  if (!gestures.length) return null;
  const first = gestures[0];
  const last = gestures[gestures.length - 1];
  const lastEnd = last.kind === "swipe-down" ? last.frame + SWIPE_FRAMES : last.frame;
  const opacity = interpolate(f, [first.frame - 26, first.frame - 16, lastEnd + 20, lastEnd + 34], [0, 1, 1, 0], clamp);
  if (opacity <= 0) return null;
  const { x, y } = position(f, gestures);

  const pressed = gestures.some((g) => {
    const end = g.kind === "swipe-down" ? g.frame + SWIPE_FRAMES : g.kind === "hold" ? g.frame + HOLD_FRAMES : g.frame + 4;
    return f >= g.frame - 2 && f <= end;
  });
  const pressScale = pressed ? 0.84 : 1;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {gestures.map((g, i) => {
        const t = f - g.frame;
        if (t < 0 || t > 30 + (g.kind === "hold" ? HOLD_FRAMES : 0)) return null;
        const blob = interpolate(t, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
        const hold = g.kind === "hold" ? HOLD_FRAMES : 0;
        const blobOpacity = interpolate(t, [0, 3, 14 + hold, 26 + hold], [0, 0.32, 0.26, 0], clamp);
        const ring = interpolate(t, [0, 20 + hold], [0.3, hold ? 1.9 : 1.5], { ...clamp, easing: Easing.out(Easing.cubic) });
        const ringOpacity = interpolate(t, [0, 4, 20 + hold], [0, 0.7, 0], clamp);
        const cy = g.kind === "swipe-down" ? g.y : g.y;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: g.x - B,
                top: cy - B,
                width: B * 2,
                height: B * 2,
                borderRadius: B,
                background: `rgba(${ripple},1)`,
                opacity: blobOpacity,
                scale: String(blob),
              }}
            />
            <div
              style={{
                position: "absolute",
                left: g.x - R,
                top: cy - R,
                width: R * 2,
                height: R * 2,
                borderRadius: R,
                border: `${3 * rippleScale}px solid rgba(${ripple},1)`,
                boxSizing: "border-box",
                opacity: ringOpacity,
                scale: String(ring),
              }}
            />
          </React.Fragment>
        );
      })}
      {/* swipe trail */}
      {gestures
        .filter((g) => g.kind === "swipe-down" && f >= g.frame && f <= g.frame + SWIPE_FRAMES + 12)
        .map((g, i) => {
          const len = interpolate(f, [g.frame, g.frame + SWIPE_FRAMES], [0, SWIPE_LEN], clamp);
          const o = interpolate(f, [g.frame, g.frame + 4, g.frame + SWIPE_FRAMES, g.frame + SWIPE_FRAMES + 12], [0, 0.3, 0.3, 0], clamp);
          return (
            <div key={`s${i}`} style={{ position: "absolute", left: g.x - 22, top: g.y - 22, width: 44, height: len + 44, borderRadius: 22, background: `linear-gradient(180deg, rgba(${ripple},0.05), rgba(${ripple},1))`, opacity: o }} />
          );
        })}
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 24 31"
        style={{
          position: "absolute",
          left: x - 2,
          top: y - 1,
          opacity,
          scale: String(pressScale),
          transformOrigin: "2px 1px",
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
        }}
      >
        <path d="M2 1.5 L2 24 L8.2 18.6 L12.4 28.2 L16.6 26.4 L12.5 17 L21 16.6 Z" fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
