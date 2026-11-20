// Simple flat illustrations for story moments (1080 × 1920 video space). Drawn in code, in the house palette, so they
// can be replaced by designer art later without touching the specs.
//   woman-typing: a member (no name, no likeness) typing a message on her phone; the opening of the chat story
//   (Video 1, team review 2026-11-20: "show a woman with a phone in hand, typing a message").
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SKIN = "#C98E68", SKIN_D = "#B27752", HAIR = "#2A1D19", HAIR_L = "#3B2A24";
const TOP = "#F29072", TOP_D = "#DB7558", BEZEL = "#1E2A36", MINT = "#C2EEE1", DEEP = "#0B4F3C";

export const WomanTyping: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 110 } });
  const breathe = Math.sin(f / 22) * 4;
  const nod = Math.sin(f / 30) * 1.2;
  const tapL = Math.max(0, Math.sin(f / 2.6)) * 7, tapR = Math.max(0, Math.sin(f / 2.6 + 1.9)) * 7;
  const bubble = spring({ frame: f - 14, fps, config: { damping: 11, stiffness: 160 } });
  const heart = interpolate(f, [40, 90], [0, 1], clamp);
  // the message on her screen grows a line at a time
  const lines = Math.min(4, Math.floor(f / 18));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: enter, translate: `0px ${(1 - enter) * 80}px` }}>
      {/* soft glow behind her */}
      <div style={{ position: "absolute", left: 90, top: 520, width: 900, height: 900, borderRadius: 450, background: "radial-gradient(circle, rgba(194,238,225,0.42), transparent 68%)" }} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(0 ${breathe})`}>
          {/* long hair, behind */}
          <path d="M378,860 C360,700 450,610 545,612 C650,614 728,700 712,880 C705,1000 735,1120 760,1230 L330,1230 C352,1110 386,990 378,860 Z" fill={HAIR} />
          {/* body (kurta) */}
          <path d="M300,1320 C305,1215 390,1170 470,1158 L610,1158 C690,1170 775,1215 780,1320 L815,1920 L265,1920 Z" fill={TOP} />
          <path d="M478,1158 L540,1250 L602,1158 Z" fill={TOP_D} />
          {/* neck */}
          <path d="M500,1040 L580,1040 L585,1165 C560,1190 520,1190 495,1165 Z" fill={SKIN_D} />
          {/* head */}
          <g transform={`rotate(${nod} 540 1000)`}>
            <ellipse cx={540} cy={880} rx={142} ry={168} fill={SKIN} />
            <ellipse cx={400} cy={900} rx={20} ry={34} fill={SKIN_D} />
            <ellipse cx={680} cy={900} rx={20} ry={34} fill={SKIN_D} />
            {/* fringe with a side part */}
            <path d="M396,860 C392,730 470,690 548,692 C640,694 700,750 690,860 C660,790 610,760 560,752 C520,790 460,830 396,860 Z" fill={HAIR_L} />
            {/* eyes looking down at the phone, brows, a small smile */}
            <path d="M470,905 Q490,920 512,905" stroke={HAIR} strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d="M568,905 Q590,920 610,905" stroke={HAIR} strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d="M466,868 Q490,858 514,866" stroke={HAIR} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M566,866 Q590,858 614,868" stroke={HAIR} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M518,985 Q540,1000 562,985" stroke="#9A5A3E" strokeWidth={6} fill="none" strokeLinecap="round" />
            <ellipse cx={470} cy={955} rx={22} ry={12} fill="#E08B78" opacity={0.45} />
            <ellipse cx={610} cy={955} rx={22} ry={12} fill="#E08B78" opacity={0.45} />
          </g>
          {/* arms: sleeves down, forearms up to the phone */}
          <path d="M330,1260 C290,1380 300,1500 380,1560 L455,1505 C400,1460 395,1380 410,1300 Z" fill={TOP_D} />
          <path d="M750,1260 C790,1380 780,1500 700,1560 L625,1505 C680,1460 685,1380 670,1300 Z" fill={TOP_D} />
          <path d="M385,1555 C420,1520 450,1470 470,1430 L505,1450 C490,1500 460,1560 430,1590 Z" fill={SKIN} />
          <path d="M695,1555 C660,1520 630,1470 610,1430 L575,1450 C590,1500 620,1560 650,1590 Z" fill={SKIN} />
          {/* phone, screen towards us */}
          <g transform="rotate(-4 540 1330)">
            <rect x={432} y={1150} width={216} height={410} rx={34} fill={BEZEL} />
            <rect x={444} y={1162} width={192} height={386} rx={26} fill="#FAFBF7" />
            <rect x={444} y={1162} width={192} height={52} rx={26} fill={DEEP} />
            <rect x={444} y={1190} width={192} height={24} fill={DEEP} />
            <circle cx={470} cy={1188} r={12} fill={MINT} />
            <rect x={490} y={1182} width={70} height={11} rx={5} fill="rgba(255,255,255,0.8)" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={462} y={1240 + i * 30} width={i === 3 ? 90 : 150 - (i % 2) * 30} height={16} rx={8} fill={i < lines ? "#DDE7E1" : "transparent"} />
            ))}
            {/* the reply box she's typing in */}
            <rect x={456} y={1490} width={168} height={40} rx={20} fill="#EEF2EF" />
            <rect x={470} y={1504} width={20 + ((f * 3) % 90)} height={12} rx={6} fill="#B8C7BF" />
          </g>
          {/* hands holding the phone, thumbs tapping */}
          <ellipse cx={440} cy={1440} rx={42} ry={70} fill={SKIN} transform="rotate(-12 440 1440)" />
          <ellipse cx={640} cy={1440} rx={42} ry={70} fill={SKIN} transform="rotate(12 640 1440)" />
          <rect x={470} y={1418 - tapL} width={64} height={30} rx={15} fill={SKIN_D} transform={`rotate(-28 500 ${1430 - tapL})`} />
          <rect x={546} y={1418 - tapR} width={64} height={30} rx={15} fill={SKIN_D} transform={`rotate(28 580 ${1430 - tapR})`} />
        </g>
        {/* typing bubble */}
        <g transform={`translate(800 600) scale(${bubble}) translate(-800 -600)`}>
          <rect x={690} y={540} width={240} height={120} rx={60} fill="#fff" />
          <path d="M720,640 L700,700 L770,650 Z" fill="#fff" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={760 + i * 50} cy={600 - Math.max(0, Math.sin(f / 4 - i * 0.9)) * 14} r={14} fill={DEEP} opacity={0.5 + 0.5 * Math.max(0, Math.sin(f / 4 - i * 0.9))} />
          ))}
        </g>
        {/* a small heart drifting up */}
        <g opacity={heart * (1 - Math.max(0, heart - 0.8) * 5)} transform={`translate(${300} ${700 - heart * 120})`}>
          <path d="M0,18 C-30,-12 -12,-38 0,-18 C12,-38 30,-12 0,18 Z" fill={MINT} transform="scale(1.6)" />
        </g>
      </svg>
    </div>
  );
};
