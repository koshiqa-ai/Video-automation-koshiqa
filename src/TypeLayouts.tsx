// Layouts for the two other video types (design.md §3, "FAQ" and "Explainer"):
//   FAQ        Q  question card · A  answer card (verdict + line + full Torty) · answers with a screen use S2
//   Explainer  C1 big number · C2 trio · C3 compare (wrong way / right way) · C4 flow (how it moves)
// Everything is centred, uses the same green, type and Torty rules as the walkthrough layouts.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LS, type LSSlide } from "./data/layout-system";
import { Backdrop, GREEN, theme } from "./LayoutDemo";
import { Headline } from "./components/Text";
import { CentredHeadline, LSSlideView, TortyFlat, TortyPeek } from "./LayoutSystem";
import { Icon } from "./screens/ui";
import { MotionScene } from "./explainer/MotionKit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fr = (s: number) => Math.round(s * 30);
type S = LSSlide & { duration: number };

const usePop = (at: number, cfg = { damping: 11, stiffness: 170 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f < fr(at) ? 0 : spring({ frame: f - fr(at), fps, config: cfg });
};
const Line: React.FC<{ text: string; top: number; size: number; color?: string; weight?: number; at?: number; width?: number }> = ({ text, top, size, color = "#fff", weight = 600, at = 0.2, width = 900 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [fr(at), fr(at) + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: (1080 - width) / 2, width, top, textAlign: "center", fontFamily: "Poppins", fontWeight: weight, fontSize: size, lineHeight: 1.22, color, opacity: o, translate: `0px ${(1 - o) * 24}px` }}>{text}</div>
  );
};
const SubLine: React.FC<{ text: string; size: number; at?: number }> = ({ text, size, at = 0.35 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [fr(at), fr(at) + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ width: 900, textAlign: "center", fontFamily: "Poppins", fontWeight: 600, fontSize: size, lineHeight: 1.22, color: "#fff", opacity: o, translate: `0px ${(1 - o) * 24}px` }}>{text}</div>;
};
const Glow: React.FC<{ cy: number; r?: number }> = ({ cy, r = 450 }) => (
  <div style={{ position: "absolute", left: 540 - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: r, background: "radial-gradient(circle, rgba(194,238,225,0.36), transparent 68%)" }} />
);

// ───────── FAQ: question card ─────────
const QuestionSlide: React.FC<{ s: S }> = ({ s }) => {
  const f = useCurrentFrame();
  const Q = LS.question;
  const p = usePop(0.1, { damping: 10, stiffness: 150 });
  const q = s.q ?? { n: 1, total: 1 };
  const dotsW = (q.total - 1) * Q.dotsGap;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Glow cy={Q.badgeTop + Q.badge / 2} r={360} />
      <div style={{ position: "absolute", left: 540 - Q.badge / 2, top: Q.badgeTop, width: Q.badge, height: Q.badge, borderRadius: Q.badge / 2, background: GREEN.mint, color: GREEN.deep, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 116, scale: String(p), rotate: `${(1 - p) * -12}deg`, boxShadow: "0 18px 40px rgba(0,50,35,0.3)" }}>
        Q{q.n}
      </div>
      <CentredHeadline title={s.title ?? ""} accent={s.accent} top={Q.textTop} size={Q.textSize} />
      {/* progress: one dot per question */}
      <div style={{ position: "absolute", left: 540 - dotsW / 2 - 12, top: Q.dotsTop, width: dotsW + 24, height: 24 }}>
        {Array.from({ length: q.total }, (_, i) => {
          const cur = i === q.n - 1;
          const done = i < q.n - 1;
          return <div key={i} style={{ position: "absolute", left: i * Q.dotsGap + (cur ? -4 : 0), top: cur ? -4 : 0, width: cur ? 32 : 24, height: cur ? 32 : 24, borderRadius: 16, background: cur ? "#fff" : done ? GREEN.mint : "transparent", border: cur || done ? "none" : "3px solid rgba(255,255,255,0.5)", boxSizing: "border-box", opacity: interpolate(f, [4, 12], [0, 1], clamp) }} />;
        })}
      </div>
      {s.peek && <TortyPeek expr={s.peek.expr} side={s.peek.side} />}
    </AbsoluteFill>
  );
};

// ───────── FAQ: answer card (no screen needed) ─────────
const AnswerSlide: React.FC<{ s: S }> = ({ s }) => {
  const f = useCurrentFrame();
  const A = LS.answer;
  const a = s.answer!;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Glow cy={A.tortyTop + A.tortyHeight / 2} />
      {/* verdict: one line, shrinks to fit; the supporting line stacks under it */}
      <div style={{ position: "absolute", left: 60, right: 60, top: A.verdictTop, display: "flex", flexDirection: "column", alignItems: "center", gap: A.subGap }}>
        <Headline text={s.title ?? ""} accent={s.accent} theme={theme} size={Math.min(A.verdictSize, Math.floor(960 / (0.6 * Math.max(1, (s.title ?? "").length))))} align="center" delay={3} maxWidth={960} />
        <SubLine text={a.sub} size={A.subSize} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: A.tortyTop, display: "flex", justifyContent: "center", translate: `0px ${Math.sin(f / 10) * 6}px` }}>
        <TortyFlat pose={a.pose} height={A.tortyHeight} since={f - 4} />
      </div>
    </AbsoluteFill>
  );
};

// ───────── Explainer: C1 big number ─────────
const NumberSlide: React.FC<{ s: S }> = ({ s }) => {
  const f = useCurrentFrame();
  const N = LS.cNumber;
  const n = s.number!;
  const t = interpolate(f, [fr(0.3), fr(1.3)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const dec = n.decimals ?? 0;
  const v = (n.value * t).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  // fit the number + unit to the frame width (720 px for the value at 320 px tall ≈ 4 digits)
  const full = `${n.prefix ?? ""}${n.value.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
  const unitW = n.unit ? n.unit.length * 0.62 * N.unitSize + 18 : 0;
  const vSize = Math.min(N.valueSize, Math.floor((940 - unitW) / (0.6 * full.length)));
  const land = usePop(1.3, { damping: 9, stiffness: 200 });
  return (
    <AbsoluteFill>
      <Backdrop />
      <Glow cy={N.valueTop + 170} />
      {s.title && <Line text={s.title.toUpperCase()} top={N.eyebrowTop} size={38} color={GREEN.mint} weight={700} at={0.05} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: N.valueTop, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18, fontFamily: "Poppins", fontWeight: 800, color: "#fff", scale: String(1 + 0.06 * land * (1 - land)) }}>
        <span style={{ fontSize: vSize, lineHeight: 1, letterSpacing: "-0.03em" }}>{n.prefix}{v}</span>
        {n.unit && <span style={{ fontSize: N.unitSize, color: GREEN.mint }}>{n.unit}</span>}
      </div>
      <Line text={n.label} top={N.labelTop} size={N.labelSize} at={1.0} />
      {s.peek && <TortyPeek expr={s.peek.expr} side={s.peek.side} />}
    </AbsoluteFill>
  );
};

// a round node: line icon on cream, or an image (e.g. the Koshiqa app icon)
const Node: React.FC<{ icon?: string; image?: string; size: number; p: number; dim?: boolean; color?: string }> = ({ icon, image, size, p, dim, color }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: dim ? "transparent" : GREEN.cream, border: dim ? "5px solid rgba(255,255,255,0.45)" : "none", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", scale: String(p), boxShadow: dim ? "none" : "0 16px 36px rgba(0,50,35,0.3)" }}>
    {image ? <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: dim ? 0.4 : 1 }} />
      : <Icon name={icon ?? "check"} size={size * 0.46} color={dim ? "rgba(255,255,255,0.6)" : color ?? GREEN.bg} stroke={2.1} />}
  </div>
);

// ───────── Explainer: C2 trio (three things side by side) ─────────
const TrioSlide: React.FC<{ s: S }> = ({ s }) => {
  const T = LS.cTrio;
  const nodes = s.nodes ?? [];
  const times = s.nodeTimes ?? nodes.map((_, i) => 0.6 + 0.6 * i);
  return (
    <AbsoluteFill>
      <Backdrop />
      <CentredHeadline title={s.title ?? ""} accent={s.accent} top={LS.concept.headingTop} size={LS.concept.headingSize} />
      {nodes.slice(0, 3).map((n, i) => <TrioItem key={i} n={n} x={T.xs[i]} at={times[i]} />)}
      {s.peek && <TortyPeek expr={s.peek.expr} side={s.peek.side} />}
    </AbsoluteFill>
  );
};
const TrioItem: React.FC<{ n: NonNullable<LSSlide["nodes"]>[number]; x: number; at: number }> = ({ n, x, at }) => {
  const T = LS.cTrio;
  const p = usePop(at);
  return (
    <>
      <div style={{ position: "absolute", left: x - T.circle / 2, top: T.top }}><Node icon={n.icon} image={n.image} size={T.circle} p={p} /></div>
      <div style={{ position: "absolute", left: x - 160, width: 320, top: T.top + T.circle + 34, textAlign: "center", fontFamily: "Poppins", fontWeight: 600, fontSize: T.labelSize, lineHeight: 1.2, color: "#fff", opacity: p, translate: `0px ${(1 - p) * 20}px` }}>{n.text}</div>
    </>
  );
};

// ───────── Explainer: C3 compare (wrong way vs right way) ─────────
const CompareSlide: React.FC<{ s: S }> = ({ s }) => {
  const C = LS.cCompare;
  const c = s.compare!;
  const pl = usePop(c.times[0]);
  const pr = usePop(c.times[1], { damping: 10, stiffness: 160 });
  const x0 = 540 - C.w - C.gap / 2;
  const card = (side: "left" | "right", p: number) => {
    const good = side === "right";
    const d = good ? c.right : c.left;
    return (
      <div style={{ position: "absolute", left: good ? 540 + C.gap / 2 : x0, top: C.top, width: C.w, height: C.h, borderRadius: 40, background: good ? GREEN.cream : "rgba(0,40,28,0.35)", border: good ? "none" : "3px solid rgba(255,255,255,0.18)", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 30px 0", opacity: p, scale: String((good ? 0.92 : 0.96) + (good ? 0.08 : 0.04) * p), boxShadow: good ? "0 24px 50px rgba(0,50,35,0.35)" : "none" }}>
        <div style={{ width: 150, height: 150, borderRadius: 75, background: good ? GREEN.bg : "#F25F6B", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={good ? "check" : "x"} size={84} color="#fff" stroke={3} />
        </div>
        <div style={{ marginTop: 50, textAlign: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: 52, lineHeight: 1.15, color: good ? GREEN.ink : "#fff" }}>{d.title}</div>
        <div style={{ marginTop: 28, textAlign: "center", fontFamily: "Poppins", fontWeight: 500, fontSize: 40, lineHeight: 1.25, color: good ? GREEN.deep : "rgba(255,255,255,0.75)" }}>{d.result}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Backdrop />
      <CentredHeadline title={s.title ?? ""} accent={s.accent} top={LS.concept.headingTop} size={LS.concept.headingSize} />
      {card("left", pl)}
      {card("right", pr)}
      {s.peek && <TortyPeek expr={s.peek.expr} side={s.peek.side} />}
    </AbsoluteFill>
  );
};

// ───────── Explainer: C4 flow (how something moves from A to B to C) ─────────
const FlowSlide: React.FC<{ s: S }> = ({ s }) => {
  const f = useCurrentFrame();
  const F = LS.cFlow;
  const nodes = (s.nodes ?? []).slice(0, 3);
  const times = s.nodeTimes ?? nodes.map((_, i) => 0.6 + 1.0 * i);
  const r = F.node / 2;
  return (
    <AbsoluteFill>
      <Backdrop />
      <CentredHeadline title={s.title ?? ""} accent={s.accent} top={LS.concept.headingTop - 60} size={LS.concept.headingSize} />
      {/* connectors: a track, filled as the flow reaches the next node, with a dot travelling along it */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {nodes.slice(0, -1).map((_, i) => {
          const y1 = F.ys[i] + F.node + 92, y2 = F.ys[i + 1] - 18;
          const k = interpolate(f, [fr(times[i]) + 6, fr(times[i + 1])], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          return (
            <g key={i}>
              <line x1={540} y1={y1} x2={540} y2={y2} stroke="rgba(255,255,255,0.28)" strokeWidth={8} strokeLinecap="round" strokeDasharray="2 18" />
              <line x1={540} y1={y1} x2={540} y2={y1 + (y2 - y1) * k} stroke={GREEN.mint} strokeWidth={8} strokeLinecap="round" />
              {k > 0 && k < 1 && <circle cx={540} cy={y1 + (y2 - y1) * k} r={16} fill="#fff" />}
            </g>
          );
        })}
      </svg>
      {nodes.map((n, i) => {
        const p = usePopSafe(f, times[i]);
        const on = f >= fr(times[i]);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 540 - r, top: F.ys[i] }}><Node icon={n.icon} image={n.image} size={F.node} p={on ? 0.85 + 0.15 * p : 1} dim={!on} /></div>
            <div style={{ position: "absolute", left: 140, width: 800, top: F.ys[i] + F.node + 14, textAlign: "center", fontFamily: "Poppins", fontWeight: on ? 700 : 500, fontSize: F.labelSize, color: on ? "#fff" : "rgba(255,255,255,0.5)" }}>{n.text}</div>
          </React.Fragment>
        );
      })}
      {s.peek && <TortyPeek expr={s.peek.expr} side={s.peek.side} />}
    </AbsoluteFill>
  );
};
// spring without hooks-in-loop issues (springs are pure functions of the frame)
const usePopSafe = (f: number, at: number) => (f < fr(at) ? 0 : spring({ frame: f - fr(at), fps: 30, config: { damping: 11, stiffness: 170 } }));

/** renders any slide: the walkthrough layouts plus the FAQ and explainer ones */
export const AnySlideView: React.FC<{ s: S }> = ({ s }) => {
  switch (s.kind) {
    case "question": return <QuestionSlide s={s} />;
    case "answer": return <AnswerSlide s={s} />;
    case "c-number": return <NumberSlide s={s} />;
    case "c-trio": return <TrioSlide s={s} />;
    case "c-compare": return <CompareSlide s={s} />;
    case "c-flow": return <FlowSlide s={s} />;
    case "motion": return <MotionScene code={s.motion!.code} m={s.motion!.m} peek={s.peek} screen={s.screen} />;
    default: return <LSSlideView s={s} />;
  }
};
