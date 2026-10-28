// Minimal stand-in for the subset of the `remotion` API this project uses.
// Only for previews in environments where Remotion can't be installed.
// The real project imports from "remotion" and renders with `npx remotion render`.
import React, { createContext, useContext } from "react";

type Cfg = { fps: number; width: number; height: number; durationInFrames: number; id: string };
const FrameCtx = createContext<number>(0);
const ConfigCtx = createContext<Cfg>({ fps: 30, width: 1080, height: 1920, durationInFrames: 1, id: "" });

export const __FrameProvider = FrameCtx.Provider;
export const __ConfigProvider = ConfigCtx.Provider;

export const useCurrentFrame = () => useContext(FrameCtx);
export const useVideoConfig = () => useContext(ConfigCtx);

export const AbsoluteFill: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ style, children, ...rest }) => (
  <div
    {...rest}
    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", ...style }}
  >
    {children}
  </div>
);

export const Sequence: React.FC<{
  from?: number;
  durationInFrames?: number;
  name?: string;
  layout?: "absolute-fill" | "none";
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ from = 0, durationInFrames = Infinity, layout = "absolute-fill", style, children }) => {
  const parent = useCurrentFrame();
  const local = parent - from;
  if (local < 0 || local >= durationInFrames) return null;
  const inner = <FrameCtx.Provider value={local}>{children}</FrameCtx.Provider>;
  if (layout === "none") return inner;
  return <AbsoluteFill style={style}>{inner}</AbsoluteFill>;
};

type Ext = "extend" | "clamp" | "identity" | "wrap";
export const interpolate = (
  input: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  opts: { easing?: (t: number) => number; extrapolateLeft?: Ext; extrapolateRight?: Ext } = {},
): number => {
  const { easing = (t: number) => t, extrapolateLeft = "extend", extrapolateRight = "extend" } = opts;
  let i = 1;
  while (i < inputRange.length - 1 && input > inputRange[i]) i++;
  const [a, b] = [inputRange[i - 1], inputRange[i]];
  const [c, d] = [outputRange[i - 1], outputRange[i]];
  let x = input;
  if (x < a && extrapolateLeft === "clamp") x = a;
  if (x > b && extrapolateRight === "clamp") x = b;
  if (x < a && extrapolateLeft === "identity") return input;
  if (x > b && extrapolateRight === "identity") return input;
  const t = b === a ? 0 : (x - a) / (b - a);
  return c + (d - c) * easing(t);
};

// Damped harmonic oscillator, same parameters as Remotion's spring()
export const spring = ({
  frame,
  fps,
  config = {},
  from = 0,
  to = 1,
  delay = 0,
  durationInFrames,
}: {
  frame: number;
  fps: number;
  config?: { damping?: number; mass?: number; stiffness?: number; overshootClamping?: boolean };
  from?: number;
  to?: number;
  delay?: number;
  durationInFrames?: number;
}): number => {
  const { damping = 10, mass = 1, stiffness = 100, overshootClamping = false } = config;
  let f = frame - delay;
  if (f <= 0) return from;
  if (durationInFrames) f = (f / durationInFrames) * 1.5 * fps; // approx stretch
  const t = f / fps;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  let x: number;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    x = 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  } else {
    x = 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  }
  if (overshootClamping) x = Math.min(1, x);
  return from + (to - from) * x;
};

const bezier = (x1: number, y1: number, x2: number, y2: number) => (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u;
  let u = t;
  for (let k = 0; k < 8; k++) {
    const dx = sx(u) - t;
    const d = (3 * ax * u + 2 * bx) * u + cx;
    if (Math.abs(dx) < 1e-6 || d === 0) break;
    u -= dx / d;
  }
  return ((ay * u + by) * u + cy) * u;
};

export const Easing = {
  linear: (t: number) => t,
  ease: bezier(0.42, 0, 1, 1),
  quad: (t: number) => t * t,
  cubic: (t: number) => t * t * t,
  sin: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  exp: (t: number) => Math.pow(2, 10 * (t - 1)),
  back: (s = 1.70158) => (t: number) => t * t * ((s + 1) * t - s),
  bezier,
  in: (e: (t: number) => number) => e,
  out: (e: (t: number) => number) => (t: number) => 1 - e(1 - t),
  inOut: (e: (t: number) => number) => (t: number) => (t < 0.5 ? e(t * 2) / 2 : 1 - e((1 - t) * 2) / 2),
};

export const random = (seed: string | number) => {
  let h = 2166136261;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h += h << 13; h ^= h >>> 7; h += h << 3; h ^= h >>> 17; h += h << 5;
  return ((h >>> 0) % 1000000) / 1000000;
};

export const staticFile = (p: string) => `/public/${p.replace(/^\//, "")}`;

export const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => <img {...props} />;

let pending = 0;
(globalThis as any).__pendingRenders = () => pending;
export const delayRender = (_label?: string) => {
  pending++;
  return pending;
};
export const continueRender = (_h: number) => {
  pending--;
};

export const Composition: React.FC<any> = () => null;
export const Folder: React.FC<any> = ({ children }) => <>{children}</>;
export const registerRoot = (_c: React.FC) => {};
