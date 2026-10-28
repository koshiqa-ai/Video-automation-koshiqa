import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme/themes";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Headline with per-word spring rise and an accented word. */
export const Headline: React.FC<{
  text: string;
  accent?: string;
  theme: Theme;
  size?: number;
  align?: "left" | "center";
  delay?: number;
  exitAt?: number;
  maxWidth?: number;
  color?: string;
}> = ({ text, accent, theme, size = theme.headlineSize, align = "left", delay = 0, exitAt, maxWidth = 920, color = theme.text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  const accentWords = (accent ?? "").split(" ").filter(Boolean);
  const exit = exitAt === undefined ? 0 : interpolate(f, [exitAt, exitAt + 8], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <div
      style={{
        fontFamily: theme.headlineFont,
        fontWeight: theme.headlineWeight,
        fontSize: size,
        lineHeight: theme.headlineLineHeight ?? 1.02,
        letterSpacing: theme.letterSpacing,
        textTransform: theme.headlineCase,
        color,
        textAlign: align,
        maxWidth,
        opacity: 1 - exit,
        translate: `0px ${-40 * exit}px`,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: f, fps, delay: delay + i * 3, config: { damping: 16, stiffness: 140 } });
        const isAccent = accentWords.includes(w);
        const hl = theme.accentBg !== "none" && isAccent;
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre" }}>
            <span
              style={{
                display: "inline-block",
                translate: `0px ${(1 - p) * size * 0.7}px`,
                opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
                color: isAccent ? theme.accent : undefined,
                background: hl ? theme.accentBg : undefined,
                padding: hl ? "0 0.12em" : undefined,
                borderRadius: hl ? "0.14em" : undefined,
                rotate: hl ? "-2deg" : undefined,
              }}
            >
              {w}
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};

/** Spoken caption: words light up as the voiceover reaches them. */
export const Caption: React.FC<{
  text: string;
  theme: Theme;
  /** local frame the voice starts */
  voFrom: number;
  voSec: number;
  size?: number;
  align?: "left" | "center";
  maxWidth?: number;
  exitAt?: number;
  color?: string;
}> = ({ text, theme, voFrom, voSec, size = 44, align = "left", maxWidth = 920, exitAt, color = theme.text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  const total = words.reduce((a, w) => a + w.length + 1, 0);
  const appear = interpolate(f, [voFrom - 8, voFrom + 2], [0, 1], clamp);
  const exit = exitAt === undefined ? 0 : interpolate(f, [exitAt, exitAt + 8], [0, 1], clamp);
  let acc = 0;
  return (
    <div
      style={{
        fontFamily: theme.bodyFont,
        fontWeight: theme.captionWeight ?? 600,
        fontSize: size,
        lineHeight: theme.captionLineHeight ?? 1.3,
        textAlign: align,
        maxWidth,
        color,
        opacity: appear * (1 - exit),
        translate: `0px ${(1 - appear) * 16}px`,
      }}
    >
      {words.map((w, i) => {
        const start = voFrom + (acc / total) * voSec * fps * 0.96;
        acc += w.length + 1;
        const lit = interpolate(f, [start - 2, start + 3], [0, 1], clamp);
        return (
          <span key={i} style={{ opacity: 0.32 + 0.68 * lit }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};

export const Chip: React.FC<{ theme: Theme; children: React.ReactNode; delay?: number }> = ({ theme, children, delay = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, delay, config: { damping: 14 } });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        alignSelf: "flex-start",
        padding: "12px 26px",
        borderRadius: 40,
        background: theme.chip.bg,
        color: theme.chip.fg,
        fontFamily: theme.bodyFont,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        scale: String(0.6 + 0.4 * p),
        opacity: p,
        transformOrigin: "left center",
      }}
    >
      {children}
    </div>
  );
};
