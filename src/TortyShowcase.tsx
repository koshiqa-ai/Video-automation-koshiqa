// Review sheet for Torty: every cutout pose, with talk bounce and pop-in.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ensureFonts } from "./theme/fonts";
import { TortyCutout, type TortyPose } from "./torty/TortyCutout";

ensureFonts();

const CELLS: { pose: TortyPose; label: string; sub: string }[] = [
  { pose: "worried", label: "Worried", sub: "problem / warning" },
  { pose: "curious", label: "Curious", sub: "question / default" },
  { pose: "happy", label: "Happy", sub: "it worked" },
  { pose: "celebrate", label: "Celebrate", sub: "goal / reward" },
  { pose: "point-curious", label: "Point", sub: "explaining a tap" },
  { pose: "point-happy", label: "Point · happy", sub: "here it is!" },
  { pose: "thumbs-up", label: "Thumbs-up", sub: "after a fix" },
  { pose: "wave", label: "Wave", sub: "outro" },
];

// Fake speech rhythm for the sheet (syllable-ish beats with pauses)
const speech = (f: number, seed: number) => {
  if ((f + seed * 7) % 90 > 70) return 0;
  return Math.max(0, Math.sin((f + seed) / 2.3) * 0.6 + Math.sin((f + seed) / 5.1) * 0.4);
};

export const TortyShowcase: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#13BFE6 0%,#6FDBF2 50%,#EAFBFF 100%)", fontFamily: "Poppins" }}>
      <div style={{ position: "absolute", left: 80, top: 70, fontSize: 64, fontWeight: 700, color: "#062A5C" }}>Torty poses</div>
      <div style={{ position: "absolute", left: 80, top: 160, fontSize: 30, fontWeight: 500, color: "rgba(6,42,92,0.7)" }}>Designers' cutouts · talk bounce · pop on pose change</div>
      {CELLS.map((c, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        return (
          <div key={c.pose} style={{ position: "absolute", left: 60 + col * 490, top: 240 + row * 410, width: 470, height: 390, borderRadius: 36, background: "rgba(255,255,255,0.55)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 22, display: "flex", justifyContent: "center" }}>
              <TortyCutout pose={c.pose} height={290} talk={speech(f, i * 11)} since={(f + i * 9) % 60} sway={c.pose === "wave" ? 3 * Math.sin(f / 5) : 0} />
            </div>
            <div style={{ position: "absolute", left: 24, bottom: 16, fontSize: 30, fontWeight: 700, color: "#062A5C", lineHeight: 1.1 }}>
              {c.label}
              <div style={{ fontSize: 20, fontWeight: 500, color: "rgba(6,42,92,0.6)" }}>{c.sub}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
