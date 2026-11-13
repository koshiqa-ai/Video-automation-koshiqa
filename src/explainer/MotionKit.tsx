// Explainer motion kit (draft for review): 14 animations read from the reference video, rebuilt for Koshiqa.
// Each scene is self-contained and lasts `sec`; the reel plays them in order with Soft UI sounds.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, GREEN } from "../LayoutDemo";
import { CentredHeadline, LSSlideView, Settle, ShowCodeTags, TortyPeek } from "../LayoutSystem";
import type { LSSlide } from "../data/layout-system";
import { Coin, Icon } from "../screens/ui";
import { motionCues, motionDuration, motionTimeline } from "./motion-data";
import { arcPath, clamp, DrawPath, EASE, GlassGrow, glassStyle, lightGlass, pop, prog, smoothPath, Words } from "./motion";

const CORAL = "#FF7A6B";
const GOLD = "#FFC93C";
const SHOT16 = { image: "screens/HV-StartSteps/16.png", w: 576, h: 1296 };

// ───────── E1 · progress ring ─────────
const RingStat: React.FC = () => {
  const f = useCurrentFrame();
  const p = 0.95 * prog(f, 14, 80, Easing.bezier(0.22, 1, 0.36, 1));
  const s = pop(f, 4, 30, 14, 140);
  const r = 250, c = 2 * Math.PI * r;
  return (
    <AbsoluteFill>
      <CentredHeadline title="Almost there!" accent="there!" top={300} size={104} />
      <div style={{ position: "absolute", left: 540 - 330, top: 880 - 330, width: 660, height: 660, scale: String(s) }}>
        <svg width={660} height={660} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <circle cx={330} cy={330} r={r} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)" strokeWidth={56} />
          <circle cx={330} cy={330} r={r} fill="none" stroke={GREEN.mint} strokeWidth={56} strokeLinecap="round" strokeDasharray={`${c * p} ${c}`} transform="rotate(-90 330 330)" style={{ filter: "drop-shadow(0 0 22px rgba(194,238,225,0.85))" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 170, color: "#fff", letterSpacing: "-0.03em" }}>{Math.round(p * 100)}%</div>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1270 }}><Words text="of today's 10K goal" at={60} size={64} /></div>
      <TortyPeek expr="happy" side="right" />
    </AbsoluteFill>
  );
};

// ───────── E2 · dots regroup into a cycle ─────────
const CYCLE = [
  { x: 540, y: 760, label: "Walk", color: GREEN.mint, a: -90 },
  { x: 780, y: 1176, label: "Earn", color: GOLD, a: 30 },
  { x: 300, y: 1176, label: "Redeem", color: "#fff", a: 150 },
];
const CycleScene: React.FC = () => {
  const f = useCurrentFrame();
  const group = [0, 1, 0, 2, 1, 0, 2, 1, 2];
  const offs = [{ x: -42, y: -26 }, { x: 44, y: -34 }, { x: 4, y: 42 }];
  const seen = [0, 0, 0];
  const move = prog(f, 42, 72, Easing.bezier(0.65, 0, 0.35, 1));
  const labelP = prog(f, 112, 124);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, right: 80, top: 300 }}><Words text="Walk. Earn. Redeem." at={2} size={96} /></div>
      {CYCLE.map((b, i) => {
        const s = pop(f, 56 + i * 4, 30, 14, 150);
        return (
          <div key={i} style={{ position: "absolute", left: b.x - 150, top: b.y - 150, width: 300, height: 300, borderRadius: 150, ...glassStyle, scale: String(s), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 56, color: "#fff", opacity: labelP, translate: `0px ${(1 - labelP) * 16}px`, position: "relative", zIndex: 2 }}>{b.label}</div>
          </div>
        );
      })}
      {group.map((g, i) => {
        const k = seen[g]++;
        const rowX = 220 + i * 80, rowY = 960;
        const tx = CYCLE[g].x + offs[k].x, ty = CYCLE[g].y + offs[k].y;
        const s = pop(f, 6 + i * 2, 30, 11, 200);
        return <div key={i} style={{ position: "absolute", left: rowX + (tx - rowX) * move - 26, top: rowY + (ty - rowY) * move - 26, width: 52, height: 52, borderRadius: 26, background: CYCLE[g].color, scale: String(s), opacity: 1 - 0.65 * labelP, filter: `blur(${labelP * 4}px)` }} />;
      })}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {CYCLE.map((b, i) => {
          const a0 = b.a + 40, a1 = CYCLE[(i + 1) % 3].a + (i === 2 ? 360 : 0) - 40;
          const p = prog(f, 78 + i * 10, 96 + i * 10);
          const end = ((a1 * Math.PI) / 180), R = 300, cx = 540, cy = 1037;
          const ex = cx + R * Math.cos(end), ey = cy + R * Math.sin(end);
          const tan = end + Math.PI / 2;
          const head = (d: number) => `${ex + 26 * Math.cos(tan + Math.PI + d)},${ey + 26 * Math.sin(tan + Math.PI + d)}`;
          return (
            <g key={i}>
              <DrawPath d={arcPath(cx, cy, R, a0, a1)} p={p} stroke={GREEN.ink} width={9} />
              {p > 0.97 && <path d={`M${head(0.55)} L${ex},${ey} L${head(-0.55)}`} fill="none" stroke={GREEN.ink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ───────── E3 · section navigator ─────────
const Navigator: React.FC = () => {
  const f = useCurrentFrame();
  const s = pop(f, 2, 30, 15, 130);
  const turn = prog(f, 16, 28);
  const dots = [{ x: 0, y: -70 }, { x: -68, y: 50 }, { x: 68, y: 50 }];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: 40, letterSpacing: "0.16em", color: GREEN.mint, opacity: prog(f, 4, 14) }}>PART 1 OF 3</div>
      <div style={{ position: "absolute", left: 540 - 200, top: 760 - 200, width: 400, height: 400, borderRadius: 200, ...glassStyle, scale: String(s) }} />
      {dots.map((d, i) => {
        const cur = i === 0;
        const size = cur ? 56 + 40 * turn : 56;
        return (
          <div key={i} style={{ position: "absolute", left: 540 + d.x - size / 2, top: 760 + d.y - size / 2, width: size, height: size, borderRadius: size / 2, boxSizing: "border-box", scale: String(pop(f, 6 + i * 3)),
            background: cur ? "#fff" : `rgba(194,238,225,${1 - turn})`, border: cur ? "none" : `${5 * turn}px solid rgba(255,255,255,0.7)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 52, color: GREEN.bg, boxShadow: cur ? `0 0 0 ${12 * turn}px rgba(194,238,225,0.3)` : "none" }}>
            {cur && turn > 0.6 ? "1" : ""}
          </div>
        );
      })}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <DrawPath d="M540,962 L540,1060" p={prog(f, 28, 40)} stroke="rgba(255,255,255,0.8)" width={5} />
      </svg>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1090 }}><Words text="Earn koins" at={38} size={112} weight={800} /></div>
      <TortyPeek expr="smile" side="left" />
    </AbsoluteFill>
  );
};

// ───────── E4 · staircase ─────────
const Stairs: React.FC = () => {
  const f = useCurrentFrame();
  const W = 280, H = 70, dx = 60, dy = -36;
  const lit = [prog(f, 70, 80), prog(f, 122, 132)];
  const steps = [0, 1, 2, 3, 4];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, right: 80, top: 420 }}>
        {f < 108 ? <Words text="Take the first step" at={58} size={96} /> : <Words text="Then the next one" at={110} size={96} />}
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[...steps].reverse().map((i) => {
          const p = prog(f, 6 + i * 6, 30 + i * 6, Easing.bezier(0.2, 0.9, 0.3, 1));
          const x = 120 + i * 140 + (1 - p) * 300, y = 1330 - i * 120 - (1 - p) * 180;
          const l = lit[i] ?? 0;
          const mix = (a: number[], b: number[]) => `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * l)).join(",")})`;
          return (
            <g key={i} opacity={p}>
              <polygon points={`${x},${y} ${x + W},${y} ${x + W + dx},${y + dy} ${x + dx},${y + dy}`} fill={mix([246, 250, 249], [168, 246, 222])} />
              <polygon points={`${x},${y} ${x + W},${y} ${x + W},${y + H} ${x},${y + H}`} fill={mix([214, 226, 222], [62, 217, 176])} />
              <polygon points={`${x + W},${y} ${x + W + dx},${y + dy} ${x + W + dx},${y + dy + H} ${x + W},${y + H}`} fill={mix([178, 194, 189], [32, 170, 136])} />
            </g>
          );
        })}
      </svg>
      <TortyPeek expr="determined" side="right" />
    </AbsoluteFill>
  );
};

// ───────── E5 · line chart with goal line + area fills ─────────
const GoalChart: React.FC = () => {
  const f = useCurrentFrame();
  const X0 = 170, X1 = 950, Y0 = 1330, Y1 = 700, MAX = 14;
  const data = [6.2, 8.4, 11.2, 9.1, 12.6, 7.4, 10.8];
  const pts = data.map((v, i) => ({ x: X0 + 40 + (i * (X1 - X0 - 80)) / 6, y: Y0 - (v / MAX) * (Y0 - Y1) }));
  const goalY = Y0 - (10 / MAX) * (Y0 - Y1);
  const curve = smoothPath(pts);
  const area = `${curve} L${pts[6].x},${goalY} L${pts[0].x},${goalY} Z`;
  const fill = prog(f, 86, 104);
  const best = pts[4];
  return (
    <AbsoluteFill>
      <GlassGrow cx={540} cy={480} w={460} h={110} at={2} light radius={55}>
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: 52, color: GREEN.ink }}>Your week</div>
      </GlassGrow>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="above"><rect x={0} y={0} width={1080} height={goalY} /></clipPath>
          <clipPath id="below"><rect x={0} y={goalY} width={1080} height={1920} /></clipPath>
          <linearGradient id="gUp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={GREEN.mint} stopOpacity={0.95} /><stop offset="1" stopColor={GREEN.mint} stopOpacity={0.15} /></linearGradient>
          <linearGradient id="gDown" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={CORAL} stopOpacity={0.95} /><stop offset="1" stopColor={CORAL} stopOpacity={0.2} /></linearGradient>
        </defs>
        <DrawPath d={`M${X0},${Y0} L${X0},${Y1 - 40}`} p={prog(f, 8, 22)} stroke="rgba(255,255,255,0.85)" width={5} />
        <DrawPath d={`M${X0},${Y0} L${X1},${Y0}`} p={prog(f, 12, 28)} stroke="rgba(255,255,255,0.85)" width={5} />
        <path d={area} fill="url(#gUp)" clipPath="url(#above)" opacity={fill} />
        <path d={area} fill="url(#gDown)" clipPath="url(#below)" opacity={fill} />
        <DrawPath d={`M${X0},${goalY} L${X1},${goalY}`} p={prog(f, 62, 80)} stroke="#fff" width={5} dash="18 14" />
        <DrawPath d={curve} p={prog(f, 26, 66, Easing.bezier(0.45, 0, 0.25, 1))} stroke="#fff" width={8} />
        {f > 104 && <circle cx={best.x} cy={best.y} r={14 + 3 * Math.sin((f - 104) / 4)} fill="#fff" />}
      </svg>
      <div style={{ position: "absolute", left: X0 - 128, top: (Y0 + Y1) / 2 - 24, width: 200, rotate: "-90deg", textAlign: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: 34, letterSpacing: "0.12em", color: "rgba(255,255,255,0.8)", opacity: prog(f, 20, 30) }}>STEPS</div>
      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
        <div key={i} style={{ position: "absolute", left: pts[i].x - 30, width: 60, top: Y0 + 20, textAlign: "center", fontFamily: "Poppins", fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,0.75)", opacity: prog(f, 28 + i * 3, 36 + i * 3) }}>{d}</div>
      ))}
      <div style={{ position: "absolute", left: X1 - 210, top: goalY - 66, width: 210, textAlign: "right", fontFamily: "Poppins", fontWeight: 700, fontSize: 34, color: "#fff", opacity: prog(f, 74, 84) }}>10K goal</div>
      <div style={{ position: "absolute", left: best.x - 120, top: best.y - 110, width: 240, scale: String(pop(f, 104)), transformOrigin: "50% 100%" }}>
        <div style={{ ...lightGlass, borderRadius: 30, padding: "12px 0", textAlign: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: 36, color: GREEN.deep }}>Best day!</div>
      </div>
      <TortyPeek expr="excited" side="left" />
    </AbsoluteFill>
  );
};

// ───────── E6 · bracket tree ─────────
const Bracket: React.FC = () => {
  const f = useCurrentFrame();
  const items = [{ t: "Walk daily", y: 860, at: 40 }, { t: "Join contests", y: 1040, at: 60 }, { t: "Hit your goal", y: 1220, at: 80 }];
  const BX = 250;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, right: 80, top: 520 }}><Words text="3 ways to earn koins" at={2} size={80} weight={800} /></div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <DrawPath d={`M540,660 L540,720 L${BX},720 L${BX},${items[2].y}`} p={prog(f, 16, 40)} stroke="rgba(255,255,255,0.85)" width={5} cap="butt" />
        {items.map((it, i) => <DrawPath key={i} d={`M${BX},${it.y} L${BX + 50},${it.y}`} p={prog(f, it.at - 6, it.at)} stroke="rgba(255,255,255,0.85)" width={5} cap="butt" />)}
      </svg>
      {items.map((it, i) => {
        const p = prog(f, it.at, it.at + 10);
        return (
          <div key={i} style={{ position: "absolute", left: BX + 66, top: it.y - 56, height: 112, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", inset: 0, right: -30, background: "rgba(194,238,225,0.28)", border: "2px solid rgba(194,238,225,0.6)", borderRadius: 24, scale: `${p} 1`, transformOrigin: "left center" }} />
            <div style={{ position: "relative", padding: "0 30px" }}><Words text={it.t} at={it.at + 4} size={66} align="left" /></div>
          </div>
        );
      })}
      <TortyPeek expr="happy" side="right" />
    </AbsoluteFill>
  );
};

// ───────── E7 · statement with highlight box ─────────
const Statement: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: 80, right: 80, top: 760 }}>
      <Words text="Every step you walk" at={4} size={88} weight={800} />
      <div style={{ height: 24 }} />
      <Words text="counts for your team" at={22} size={88} weight={800} box={{ from: 0, to: 3, at: 52 }} />
    </div>
    <TortyPeek expr="smile" side="left" />
  </AbsoluteFill>
);

// ───────── E8 · clock + filling bar ─────────
const ClockBar: React.FC = () => {
  const f = useCurrentFrame();
  const t = prog(f, 26, 120, Easing.bezier(0.45, 0, 0.55, 1));
  const hour = 8 + Math.floor(t * 12);
  const label = `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? "PM" : "AM"}`;
  const segs = 20, lit = Math.round(t * segs);
  return (
    <AbsoluteFill>
      <CentredHeadline title="Syncs all day" accent="all day" top={300} size={104} />
      <GlassGrow cx={540} cy={1010} w={680} h={760} at={8} radius={56}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: 46, color: "#fff" }}>{label}</div>
        <div style={{ position: "absolute", left: 340 - 160, top: 130, width: 320, height: 320, borderRadius: 160, background: "radial-gradient(circle at 40% 35%, #fff, #DCEFEA)", boxShadow: "0 16px 40px rgba(0,40,28,0.3)" }}>
          {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 158, top: 14, width: 4, height: 18, background: "rgba(11,43,34,0.35)", rotate: `${i * 30}deg`, transformOrigin: "2px 146px" }} />)}
          <div style={{ position: "absolute", left: 154, top: 70, width: 12, height: 96, borderRadius: 6, background: GREEN.ink, rotate: `${(8 + t * 12) * 30}deg`, transformOrigin: "6px 90px" }} />
          <div style={{ position: "absolute", left: 156, top: 36, width: 8, height: 130, borderRadius: 4, background: GREEN.bg, rotate: `${t * 12 * 360}deg`, transformOrigin: "4px 124px" }} />
          <div style={{ position: "absolute", left: 148, top: 148, width: 24, height: 24, borderRadius: 12, background: GREEN.ink }} />
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 520, display: "flex", justifyContent: "space-between", fontFamily: "Poppins", fontWeight: 700, fontSize: 40, color: "#fff" }}>
          <span>Steps synced</span><span>{Math.round(t * 100)}%</span>
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 600, height: 70, display: "flex", gap: 6 }}>
          {Array.from({ length: segs }, (_, i) => <div key={i} style={{ flex: 1, borderRadius: 4, background: i < lit ? GREEN.mint : "rgba(255,255,255,0.22)" }} />)}
        </div>
      </GlassGrow>
      <TortyPeek expr="wink" side="right" />
    </AbsoluteFill>
  );
};

// ───────── E9 · glass caption pill over a screen ─────────
const phoneSlide = (sec: number): LSSlide & { duration: number } => ({ code: "", row: 0, name: "", kind: "phone", layout: "S1", screen: SHOT16, sec, duration: Math.round(sec * 30) });
const CaptionPill: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ShowCodeTags.Provider value={false}><LSSlideView s={phoneSlide(4.6)} /></ShowCodeTags.Provider>
      <AbsoluteFill style={{ background: `rgba(0,40,28,${0.25 * prog(f, 26, 36)})` }} />
      <GlassGrow cx={540} cy={1480} w={820} h={130} at={30} light radius={65}>
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Words text="Your connected account" at={40} size={54} color={GREEN.ink} /></div>
      </GlassGrow>
    </AbsoluteFill>
  );
};

// ───────── E10 · number cards, dashed link, rolling digits ─────────
const Roll: React.FC<{ value: number; size: number }> = ({ value, size }) => {
  const h = size * 1.1;
  const col = (v: number, key: string) => (
    <div key={key} style={{ height: h, overflow: "hidden" }}>
      <div style={{ translate: `0px ${-v * h}px` }}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => <div key={i} style={{ height: h, lineHeight: `${h}px` }}>{d}</div>)}</div>
    </div>
  );
  const ones = value % 10, tens = Math.floor(value / 10) + Math.max(0, ones - 9);
  return <div style={{ display: "flex", fontFamily: "Poppins", fontWeight: 800, fontSize: size, color: "#fff" }}>{value >= 9 && col(tens, "t")}{col(ones, "o")}</div>;
};
const NumberCards: React.FC = () => {
  const f = useCurrentFrame();
  const v = interpolate(f, [62, 104], [1, 30], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const card = (cx: number, at: number, num: React.ReactNode, label: string) => (
    <GlassGrow cx={cx} cy={900} w={330} h={360} at={at} radius={48}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        {num}
        <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 40, color: "rgba(255,255,255,0.85)" }}>{label}</div>
      </div>
    </GlassGrow>
  );
  return (
    <AbsoluteFill>
      <CentredHeadline title="Build your streak" accent="streak" top={300} size={104} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <DrawPath d="M375,900 L705,900" p={prog(f, 36, 56)} stroke="#fff" width={6} dash="16 14" />
      </svg>
      {card(210, 10, <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 150, color: "#fff", lineHeight: 1.1 }}>1</div>, "Day")}
      {card(870, 52, <Roll value={v} size={150} />, "Days")}
      <div style={{ position: "absolute", left: 80, right: 80, top: 1200 }}><Words text="Keep the chain going" at={100} size={64} /></div>
      <TortyPeek expr="excited" side="left" />
    </AbsoluteFill>
  );
};

// ───────── E11 · icon tiles ─────────
const IconTiles: React.FC = () => {
  const f = useCurrentFrame();
  const tiles = [{ icon: "steps", t: "Walk" }, { icon: "refresh", t: "Sync" }, { icon: "coin", t: "Earn" }, { icon: "gift", t: "Redeem" }];
  return (
    <AbsoluteFill>
      <CentredHeadline title="How it works" accent="works" top={300} size={104} />
      {tiles.map((x, i) => {
        const at = 24 + i * 18, cx = 165 + i * 250;
        return (
          <React.Fragment key={i}>
            <GlassGrow cx={cx} cy={860} w={200} h={200} at={at} radius={52}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {x.icon === "coin" ? <Coin size={96} /> : <Icon name={x.icon} size={96} color="#fff" stroke={2} />}
              </div>
            </GlassGrow>
            <div style={{ position: "absolute", left: cx - 120, width: 240, top: 990, textAlign: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: 46, color: "#fff", opacity: prog(f, at + 10, at + 18), translate: `0px ${(1 - prog(f, at + 10, at + 18)) * 16}px` }}>{x.t}</div>
          </React.Fragment>
        );
      })}
      <TortyPeek expr="smile" side="right" />
    </AbsoluteFill>
  );
};

// ───────── E12 · bullet list with connector ─────────
const BulletLine: React.FC = () => {
  const f = useCurrentFrame();
  const items = [{ t: "Did my steps sync?", at: 20 }, { t: "Is tracking on?", at: 46 }, { t: "Same Google account?", at: 72 }];
  const X = 170, Y0 = 760, GAP = 190;
  return (
    <AbsoluteFill>
      <CentredHeadline title="Quick check" accent="check" top={300} size={104} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {items.slice(1).map((it, i) => <DrawPath key={i} d={`M${X},${Y0 + i * GAP + 24} L${X},${Y0 + (i + 1) * GAP - 24}`} p={prog(f, it.at - 10, it.at)} stroke="rgba(255,255,255,0.6)" width={5} />)}
      </svg>
      {items.map((it, i) => {
        const s = pop(f, it.at);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: X - 18, top: Y0 + i * GAP - 18, width: 36, height: 36, borderRadius: 18, border: "6px solid #fff", boxSizing: "border-box", background: f > it.at + 6 ? GREEN.mint : "transparent", scale: String(s) }} />
            <div style={{ position: "absolute", left: X + 50, top: Y0 + i * GAP - 46 }}><Words text={it.t} at={it.at + 2} size={66} align="left" /></div>
          </React.Fragment>
        );
      })}
      <TortyPeek expr="thinking" side="right" />
    </AbsoluteFill>
  );
};

// ───────── E13 · floating glass widgets around the phone ─────────
const FloatingCards: React.FC = () => {
  const f = useCurrentFrame();
  const cards = [
    { cx: 300, cy: 420, w: 420, h: 130, at: 24, icon: <Coin size={58} />, t: "+500 koins" },
    { cx: 780, cy: 860, w: 440, h: 130, at: 40, icon: <Icon name="check-circle" size={58} color={GREEN.mint} stroke={2.4} />, t: "Steps synced" },
    { cx: 300, cy: 1340, w: 440, h: 130, at: 56, icon: <Icon name="trophy" size={58} color={GOLD} stroke={2.2} />, t: "New contest" },
  ];
  return (
    <AbsoluteFill>
      <ShowCodeTags.Provider value={false}><LSSlideView s={phoneSlide(4.6)} /></ShowCodeTags.Provider>
      {cards.map((c, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, translate: `0px ${Math.sin((f + i * 20) / 18) * 10}px` }}>
          <GlassGrow cx={c.cx} cy={c.cy} w={c.w} h={c.h} at={c.at} radius={40}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 20, padding: "0 32px", background: "rgba(0,60,42,0.35)" }}>
              {c.icon}
              <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 42, color: "#fff", whiteSpace: "nowrap" }}>{c.t}</span>
            </div>
          </GlassGrow>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ───────── E14 · underline → humps → streak ─────────
const Humps: React.FC = () => {
  const f = useCurrentFrame();
  const X0 = 150, X1 = 930, Y = 1080, n = 7, w = (X1 - X0) / n;
  const grow = (i: number) => prog(f, 34 + i * 3, 46 + i * 3);
  const fill = (i: number) => prog(f, 66 + i * 7, 74 + i * 7);
  return (
    <AbsoluteFill>
      <CentredHeadline title="7 days in a row" accent="7 days" top={300} size={104} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 840 }}><Words text="One walk at a time" at={4} size={72} /></div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <DrawPath d={`M${X0},${Y} L${X1},${Y}`} p={prog(f, 10, 28)} stroke="rgba(255,255,255,0.7)" width={5} />
        {Array.from({ length: n }, (_, i) => {
          const g = grow(i), r = w / 2, cx = X0 + r + i * w, hh = r * g;
          const d = `M${cx - r},${Y} A${r},${hh || 0.01} 0 0 1 ${cx + r},${Y}`;
          return (
            <g key={i}>
              <path d={`${d} Z`} fill={GREEN.mint} opacity={0.9 * fill(i)} />
              <path d={d} fill="none" stroke="#fff" strokeWidth={5} opacity={g > 0 ? 1 : 0} />
            </g>
          );
        })}
      </svg>
      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
        <div key={i} style={{ position: "absolute", left: X0 + i * w, width: w, top: Y + 24, textAlign: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: 38, color: fill(i) > 0.5 ? GREEN.mint : "rgba(255,255,255,0.6)" }}>{d}</div>
      ))}
      <TortyPeek expr="happy" side="left" />
    </AbsoluteFill>
  );
};

// ───────── reel ─────────
const SCENE_VIEWS: Record<string, React.FC> = { E1: RingStat, E2: CycleScene, E3: Navigator, E4: Stairs, E5: GoalChart, E6: Bracket, E7: Statement, E8: ClockBar, E9: CaptionPill, E10: NumberCards, E11: IconTiles, E12: BulletLine, E13: FloatingCards, E14: Humps };

const Label: React.FC<{ code: string; name: string }> = ({ code, name }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", gap: 14, padding: "10px 26px", borderRadius: 30, background: "rgba(0,0,0,0.22)", fontFamily: "Poppins", fontSize: 30, fontWeight: 600, color: "#fff" }}>
      <span style={{ color: GREEN.mint, fontWeight: 800 }}>{code}</span>{name}
    </div>
  </div>
);

export { motionDuration };
export const ExplainerMotionKit: React.FC = () => (
  <AbsoluteFill style={{ background: GREEN.bg }}>
    {motionTimeline().map((s) => (
      <Sequence key={s.code} from={s.from} durationInFrames={s.duration} name={`${s.code} ${s.name}`}>
        <Settle>
          <AbsoluteFill><Backdrop />{React.createElement(SCENE_VIEWS[s.code])}<Label code={s.code} name={s.name} /></AbsoluteFill>
        </Settle>
      </Sequence>
    ))}
    {motionCues().map((c, i) => (
      <Sequence key={`a${i}`} from={c.frame} layout="none"><Audio src={staticFile(c.src)} volume={c.volume} /></Sequence>
    ))}
  </AbsoluteFill>
);
