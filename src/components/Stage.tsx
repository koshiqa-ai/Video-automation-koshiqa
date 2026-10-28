// The phone stage that stays on screen across all step scenes.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimedScene } from "../data/timeline";
import { RESULT_SCREENS, SCREENS as BASE_SCREENS } from "../screens/screens";
import { HI_SCREENS } from "../screens/screens-hi";

const SCREENS = { ...BASE_SCREENS, ...HI_SCREENS };
import { Screen } from "../screens/ui";
import type { Theme } from "../theme/themes";
import { Phone, PHONE_H, PHONE_W } from "./Phone";
import { Torty, type TortyRig } from "./Scenes";
import { TapCursor } from "./TapCursor";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Geo = { scale: number; x: number; y: number; rotate?: number };
export const GEOMETRY: Record<Theme["layout"], Geo[]> = {
  "phone-bottom": [{ scale: 1.78, x: (1080 - PHONE_W * 1.78) / 2, y: 700 }],
  card: [{ scale: 1.5, x: (1080 - PHONE_W * 1.5) / 2, y: 136 }],
  tilted: [{ scale: 1.62, x: 190, y: 760, rotate: -7 }],
  dual: [
    { scale: 1.08, x: 72, y: 660 },
    { scale: 1.08, x: 1080 - 72 - PHONE_W * 1.08, y: 660 },
  ],
  "phone-top": [{ scale: 1.6, x: (1080 - PHONE_W * 1.6) / 2, y: 96 }],
};

/** Which step is on screen and its local frame; previous step frozen underneath for the crossfade. */
const useStepState = (steps: TimedScene[], stageFrom: number) => {
  const sf = useCurrentFrame();
  const abs = sf + stageFrom;
  let k = 0;
  for (let i = 0; i < steps.length; i++) if (abs >= steps[i].from) k = i;
  const f = abs - steps[k].from;
  return { k, f, step: steps[k], prev: k > 0 ? steps[k - 1] : undefined };
};

const StepScreen: React.FC<{ step: TimedScene; f: number; result?: boolean }> = ({ step, f, result }) => {
  const Comp = (result ? RESULT_SCREENS : SCREENS)[step.screen ?? ""];
  if (!Comp) return null;
  return <Comp f={f} taps={step.gesturesTimed.map((g) => g.frame)} />;
};

const Swap: React.FC<{ steps: TimedScene[]; stageFrom: number; result?: boolean; cursor?: Theme["cursor"] }> = ({ steps, stageFrom, result, cursor }) => {
  const { f, step, prev } = useStepState(steps, stageFrom);
  const p = prev ? interpolate(f, [0, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) : 1;
  const g0 = step.gesturesTimed[0]?.frame ?? 0;
  const reveal = result ? interpolate(f, [g0 + 6, g0 + 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) : 1;
  const under = result ? (prev ? <StepScreen step={prev} f={prev.duration - 1} result /> : <Placeholder />) : prev && p < 1 ? <StepScreen step={prev} f={prev.duration - 1} /> : null;
  return (
    <>
      {result ? under : p < 1 && under}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: result ? 1 : p,
          translate: result ? undefined : `${(1 - p) * 60}px 0px`,
          clipPath: result ? `inset(${(1 - reveal) * 100}% 0 0 0)` : undefined,
        }}
      >
        <StepScreen step={step} f={f} result={result} />
      </div>
      {cursor && <TapCursor f={f} gestures={step.gesturesTimed} fill={cursor.fill} stroke={cursor.stroke} ripple={cursor.ripple} />}
    </>
  );
};

const Placeholder: React.FC = () => (
  <Screen bg="linear-gradient(180deg,#EEF3F9,#DCE6F2)">
    <div style={{ position: "absolute", left: 95, top: 322, width: 200, height: 200, borderRadius: 100, border: "4px dashed #A9B8CB" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontSize: 18, fontWeight: 700, color: "#7D8DA3" }}>Result appears here</div>
  </Screen>
);

export type PeekState = { mood: "sad" | "surprised" | "happy" | "happy2"; bubble?: string; bubbleFrom?: number; lean?: number; rig?: TortyRig };

export const Stage: React.FC<{
  steps: TimedScene[];
  stageFrom: number;
  duration: number;
  theme: Theme;
  /** Override the default phone geometry for this video */
  geometry?: Geo[];
  /** Script Torty's mood / speech bubble by absolute frame */
  peek?: (absFrame: number) => PeekState;
  /** Torty stands in FRONT of the phone, beside it (needed when he gestures at the screen) */
  presenter?: { x: number; y: number; height: number };
}> = ({ steps, stageFrom, duration, theme, geometry, peek, presenter }) => {
  const sf = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: sf, fps, config: { damping: 16, stiffness: 90 } });
  const exit = interpolate(sf, [duration - 12, duration], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const dy = (1 - enter) * 1300 + exit * 1500;
  const geo = geometry ?? GEOMETRY[theme.layout];
  const { k, f } = useStepState(steps, stageFrom);
  const lastStep = steps[steps.length - 1];
  const happy = k === steps.length - 1 && f >= (lastStep.gesturesTimed[0]?.frame ?? 0) + 6;
  const ps: PeekState = peek ? peek(sf + stageFrom) : { mood: happy ? "happy" : "surprised" };

  // Peeking Torty from behind the phone edge
  const peekIn = spring({ frame: sf, fps, delay: 22, config: { damping: 12 } });
  const peekGeo = theme.layout === "phone-top" ? { x: 770, y: 1000, r: 14 } : { x: 800, y: 1330, r: 12 };
  const peekBox: React.CSSProperties = { position: "absolute", left: peekGeo.x + (1 - peekIn) * 260 - (ps.lean ?? 0) * 70, top: peekGeo.y + Math.sin(sf / 10) * 6, rotate: `${peekGeo.r - (ps.lean ?? 0) * 6}deg` };

  return (
    <AbsoluteFill style={{ translate: `0px ${dy}px` }}>
      {theme.layout === "card" && (
        <div style={{ position: "absolute", left: 60, top: 90, width: 960, height: 1394, borderRadius: 72, background: "#FFFFFF", boxShadow: "0 40px 80px rgba(120,40,40,0.18)" }}>
          <div style={{ position: "absolute", left: 140, top: 260, width: 680, height: 680, borderRadius: 340, background: "radial-gradient(circle, #FDE3DD, transparent 70%)" }} />
        </div>
      )}
      {theme.layout === "tilted" && <Orbs />}
      {theme.peek && !presenter && (
        <div style={peekBox}>
          <Torty mood={ps.mood} height={430} rig={ps.rig} />
        </div>
      )}
      {theme.peek && !presenter && ps.bubble && <SpeechBubble text={ps.bubble} theme={theme} age={sf + stageFrom - (ps.bubbleFrom ?? 0)} x={peekGeo.x - 360} y={peekGeo.y - 170} />}
      <Phone {...geo[0]} frame={theme.phoneFrame}>
        <Swap steps={steps} stageFrom={stageFrom} cursor={theme.cursor} />
      </Phone>
      {theme.peek && presenter && (
        <>
          <div
            style={{
              position: "absolute",
              left: presenter.x + (1 - peekIn) * 360,
              top: presenter.y + Math.sin(sf / 10) * 5,
              rotate: `${2 - (ps.lean ?? 0) * 5}deg`,
              transformOrigin: "50% 100%",
              filter: "drop-shadow(0 18px 24px rgba(6,42,92,0.22))",
            }}
          >
            <Torty mood={ps.mood} height={presenter.height} rig={ps.rig} />
          </div>
          {ps.bubble && (
            <SpeechBubble text={ps.bubble} theme={theme} age={sf + stageFrom - (ps.bubbleFrom ?? 0)} x={presenter.x - 100} y={presenter.y - 190} maxWidth={300} tailRight={150} />
          )}
        </>
      )}
      {theme.layout === "dual" && (
        <>
          <Phone {...geo[1]} frame={theme.phoneFrame}>
            <Swap steps={steps} stageFrom={stageFrom} result />
          </Phone>
          <DualLabels theme={theme} f={f} g0={steps[k].gesturesTimed[0]?.frame ?? 0} />
        </>
      )}
    </AbsoluteFill>
  );
};

const DualLabels: React.FC<{ theme: Theme; f: number; g0: number }> = ({ theme, f, g0 }) => {
  const pulse = interpolate(f, [g0 + 4, g0 + 10, g0 + 22], [1, 1.25, 1], clamp);
  const y = 660 + PHONE_H * 1.08 + 34;
  const label = (text: string, n: string, x: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: PHONE_W * 1.08, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: theme.headlineFont, fontWeight: 700, fontSize: 32, color: theme.text, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        <span style={{ width: 46, height: 46, borderRadius: 23, background: theme.accent, color: "#06231C", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{n}</span>
        {text}
      </div>
    </div>
  );
  return (
    <>
      {label("You tap", "1", 72)}
      {label("You get", "2", 1080 - 72 - PHONE_W * 1.08)}
      <div style={{ position: "absolute", left: 540 - 40, top: 660 + (PHONE_H * 1.08) / 2 - 40, width: 80, height: 80, borderRadius: 40, background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", scale: String(pulse), boxShadow: "0 10px 30px rgba(45,225,180,0.45)" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#06231C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </div>
    </>
  );
};

const SpeechBubble: React.FC<{ text: string; theme: Theme; x: number; y: number; age: number; maxWidth?: number; tailRight?: number }> = ({ text, theme, x, y, age, maxWidth = 520, tailRight = 60 }) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame: age, fps, config: { damping: 11, stiffness: 140 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 5,
        padding: "22px 30px",
        maxWidth,
        borderRadius: 34,
        background: "#FFFFFF",
        color: theme.text,
        fontFamily: theme.headlineFont,
        fontWeight: 700,
        fontSize: 40,
        lineHeight: theme.headlineLineHeight ?? 1.1,
        boxShadow: "0 20px 50px rgba(6,42,92,0.25)",
        scale: String(p),
        opacity: Math.min(1, p * 2),
        transformOrigin: "right bottom",
      }}
    >
      {text}
      <div style={{ position: "absolute", right: tailRight, bottom: -22, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: "26px solid #FFFFFF" }} />
    </div>
  );
};

/** Glossy floating orbs for the Aurora (purple fintech) direction */
const Orbs: React.FC = () => {
  const f = useCurrentFrame();
  const orbs = [
    { x: 40, y: 760, s: 150, c: "#FF8BE0", d: 0 },
    { x: 860, y: 900, s: 110, c: "#D8FF5C", d: 2 },
    { x: 900, y: 1540, s: 170, c: "#6BE4FF", d: 4 },
    { x: 70, y: 1450, s: 90, c: "#FFFFFF", d: 1 },
  ];
  return (
    <>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: o.x,
            top: o.y + Math.sin(f / 16 + o.d) * 22,
            width: o.s,
            height: o.s,
            borderRadius: o.s / 2,
            background: `radial-gradient(circle at 32% 28%, #FFFFFF 0%, ${o.c} 34%, rgba(40,10,120,0.9) 100%)`,
            boxShadow: `0 20px 50px rgba(20,0,80,0.4)`,
          }}
        />
      ))}
    </>
  );
};
