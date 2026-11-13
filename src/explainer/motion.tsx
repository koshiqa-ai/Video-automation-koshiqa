// Motion language for explainer videos, taken from the reference video ("9 Micro Habits", Nov 2026)
// and adapted to Koshiqa (green, Poppins, portrait, Torty):
//   • Words   — text appears word by word: each word fades up from 25 % opacity, rises 18 px and un-blurs
//   • Box     — a mint box wipes in behind the key phrase, the phrase turns deep green
//   • Glass   — frosted cards / pills that grow out of a thin bar (width first, then height), content after
//   • Draw    — lines, axes, connectors and arrows draw on with an ease-out (stroke-dash)
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GREEN } from "../LayoutDemo";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const prog = (f: number, a: number, b: number, easing = EASE) => interpolate(f, [a, b], [0, 1], { ...clamp, easing });
export const pop = (f: number, at: number, fps = 30, damping = 12, stiffness = 170) => (f < at ? 0 : spring({ frame: f - at, fps, config: { damping, stiffness } }));

export const glassStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.16)",
  border: "2px solid rgba(255,255,255,0.42)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 22px 50px rgba(0,40,28,0.28), inset 0 2px 0 rgba(255,255,255,0.45)",
  boxSizing: "border-box",
};
export const lightGlass: React.CSSProperties = { ...glassStyle, background: "rgba(255,255,255,0.86)", border: "2px solid rgba(255,255,255,0.95)" };

/** word-by-word reveal; `box` puts a mint box behind words [from, to] (inclusive) from frame `box.at` */
export const Words: React.FC<{
  text: string; at?: number; size: number; color?: string; weight?: number; stagger?: number;
  box?: { from: number; to: number; at: number }; align?: "center" | "left"; lineHeight?: number; width?: number; style?: React.CSSProperties;
}> = ({ text, at = 0, size, color = "#fff", weight = 700, stagger = 3, box, align = "center", lineHeight = 1.18, width, style }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const word = (w: string, i: number) => {
    const p = prog(f, at + i * stagger, at + i * stagger + 9);
    return (
      <span key={i} style={{ display: "inline-block", opacity: 0.25 + 0.75 * p, translate: `0px ${(1 - p) * 18}px`, filter: `blur(${(1 - p) * 6}px)`, visibility: f < at + i * stagger ? "hidden" : "visible", whiteSpace: "pre" }}>
        {w}
      </span>
    );
  };
  const gap = <span style={{ display: "inline-block", width: "0.28em" }} />;
  const parts: React.ReactNode[] = [];
  let i = 0;
  while (i < words.length) {
    if (box && i === box.from) {
      const bp = prog(f, box.at, box.at + 10);
      const group = words.slice(box.from, box.to + 1);
      parts.push(
        <span key={`b${i}`} style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
          <span style={{ position: "absolute", left: "-0.16em", right: "-0.16em", top: "0.04em", bottom: "0.02em", background: GREEN.mint, borderRadius: "0.12em", scale: `${bp} 1`, transformOrigin: "left center" }} />
          <span style={{ position: "relative", color: bp > 0.5 ? GREEN.deep : color }}>
            {group.map((w, k) => <React.Fragment key={k}>{k > 0 && gap}{word(w, box.from + k)}</React.Fragment>)}
          </span>
        </span>,
      );
      i = box.to + 1;
    } else {
      parts.push(<React.Fragment key={i}>{word(words[i], i)}</React.Fragment>);
      i++;
    }
    if (i < words.length) parts.push(<React.Fragment key={`g${i}`}>{gap}</React.Fragment>);
  }
  return (
    <div style={{ fontFamily: "Poppins", fontSize: size, fontWeight: weight, color, lineHeight, textAlign: align, width, letterSpacing: "-0.01em", ...style }}>{parts}</div>
  );
};

/** a frosted card that grows out of a thin pill: width first, then height, then its content fades in. cx/cy = centre. */
export const GlassGrow: React.FC<{ cx: number; cy: number; w: number; h: number; at: number; radius?: number; light?: boolean; children?: React.ReactNode }> = ({ cx, cy, w, h, at, radius = 40, light, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const a = spring({ frame: f - at, fps, config: { damping: 16, stiffness: 150 } });
  const b = spring({ frame: f - at - 5, fps, config: { damping: 15, stiffness: 140 } });
  const width = w * (0.3 + 0.7 * a);
  const height = Math.min(26, h) + (h - Math.min(26, h)) * b;
  const content = interpolate(f, [at + 9, at + 17], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: cx - width / 2, top: cy - height / 2, width, height, borderRadius: Math.min(radius, height / 2), overflow: "hidden", ...(light ? lightGlass : glassStyle) }}>
      <div style={{ position: "absolute", left: (width - w) / 2, top: (height - h) / 2, width: w, height: h, opacity: content }}>{children}</div>
    </div>
  );
};

/** an svg path that draws on (needs pathLength-independent dash: we use pathLength=1) */
export const DrawPath: React.FC<{ d: string; p: number; stroke?: string; width?: number; dash?: string; opacity?: number; cap?: "round" | "butt" }> = ({ d, p, stroke = "#fff", width = 8, dash, opacity = 1, cap = "round" }) =>
  dash ? (
    <>
      <defs>
        <mask id={`m${d.length}${Math.round(width)}`} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={6000} height={6000}>
          <path d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth={width + 6} strokeDasharray={`${p} 1`} />
        </mask>
      </defs>
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeDasharray={dash} strokeLinecap={cap} opacity={opacity} mask={`url(#m${d.length}${Math.round(width)})`} />
    </>
  ) : (
    <path d={d} pathLength={1} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap={cap} strokeDasharray={`${p} 1`} opacity={p > 0 ? opacity : 0} />
  );

type P = { x: number; y: number };
/** smooth curve through points (Catmull-Rom → cubic Bézier) */
export const smoothPath = (pts: P[]) => {
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    d += ` C${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
  }
  return d;
};
/** an arc as a polyline path (degrees, 0 = right, clockwise) */
export const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number, n = 32) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
