// Torty from the designers' cutout PNGs (public/torty/cutouts, see src/torty/cutouts.json).
// Every pose is anchored at his feet so swapping poses never makes him jump.
// The art is flat images (no mouth/eye layers), so "talking" is a subtle
// voice-driven squash-and-bounce, and pose changes get a small pop.
import React from "react";
import { Img, spring, staticFile, useVideoConfig } from "remotion";
import CUTOUTS from "./cutouts.json";

export type TortyPose = keyof typeof CUTOUTS;
export type TortyGesture = "point" | "thumbs" | "wave";

export type TortyCutoutProps = {
  pose: TortyPose;
  /** height of the figure (head/raised hand to feet) in px */
  height: number;
  /** 0..1 voice loudness → talk bounce */
  talk?: number;
  /** frames since this pose started → pop-in */
  since?: number;
  /** rotate about the feet (deg) — e.g. waving sway */
  sway?: number;
  style?: React.CSSProperties;
};

export const TortyCutout: React.FC<TortyCutoutProps> = ({ pose, height, talk = 0, since, sway = 0, style }) => {
  const { fps } = useVideoConfig();
  const c = CUTOUTS[pose];
  const k = height / (c.bottom - c.top);
  const w = height * 0.62;
  const pop = since === undefined ? 1 : spring({ frame: since, fps, config: { damping: 11, stiffness: 170 } });
  const t = Math.max(0, Math.min(1, talk));
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height,
        scale: `${(0.9 + 0.1 * pop) * (1 - 0.012 * t)} ${(0.9 + 0.1 * pop) * (1 + 0.03 * t)}`,
        rotate: `${sway}deg`,
        transformOrigin: "50% 100%",
        ...style,
      }}
    >
      <Img
        src={staticFile(c.file)}
        style={{
          position: "absolute",
          left: w / 2 - c.feetX * k,
          top: -c.top * k,
          width: c.w * k,
          height: c.h * k,
          maxWidth: "none",
        }}
      />
    </div>
  );
};

/** mood (+ optional gesture) → cutout pose */
export const poseFor = (mood: "sad" | "surprised" | "happy" | "happy2", gesture?: TortyGesture): TortyPose => {
  if (gesture === "wave") return "wave";
  if (gesture === "thumbs") return "thumbs-up";
  if (gesture === "point") return mood === "happy" || mood === "happy2" ? "point-happy" : "point-curious";
  return ({ sad: "worried", surprised: "curious", happy: "happy", happy2: "celebrate" } as const)[mood];
};
