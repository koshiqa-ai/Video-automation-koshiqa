import React from "react";
import { SH, SW } from "../screens/ui";

export const BEZEL = 12;
export const PHONE_W = SW + BEZEL * 2;
export const PHONE_H = SH + BEZEL * 2;

/** iPhone-style frame. Children are laid out in 390 × 844 screen space. */
export const Phone: React.FC<{
  scale: number;
  frame: string;
  x: number;
  y: number;
  rotate?: number;
  shadow?: string;
  children: React.ReactNode;
}> = ({ scale, frame, x, y, rotate = 0, shadow = "0 40px 80px rgba(0,0,0,0.28)", children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: PHONE_W,
      height: PHONE_H,
      scale: String(scale),
      rotate: `${rotate}deg`,
      transformOrigin: "top left",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 64,
        background: frame,
        boxShadow: `${shadow}, inset 0 0 0 2px rgba(255,255,255,0.14)`,
      }}
    />
    {/* side buttons */}
    <div style={{ position: "absolute", left: -3, top: 170, width: 4, height: 60, borderRadius: 2, background: frame }} />
    <div style={{ position: "absolute", right: -3, top: 210, width: 4, height: 96, borderRadius: 2, background: frame }} />
    <div
      style={{
        position: "absolute",
        left: BEZEL,
        top: BEZEL,
        width: SW,
        height: SH,
        borderRadius: 52,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {children}
      <div style={{ position: "absolute", left: (SW - 118) / 2, top: 11, width: 118, height: 34, borderRadius: 17, background: "#000" }} />
      <div style={{ position: "absolute", left: (SW - 134) / 2, bottom: 8, width: 134, height: 5, borderRadius: 3, background: "rgba(0,0,0,0.75)" }} />
    </div>
  </div>
);
