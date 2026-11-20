// Coded mockups of the Rest Card screens (390 × 844), rebuilt from the screen recordings (IMG_7237) in a clean,
// light version: the recordings' dark header and grey bands looked like a black patch in the video (team, 2026-11-20).
// Real app art is reused where it matters: the Rest Card illustration and the palm badge (public/screens/HV-RestCard/art-*).
import React from "react";
import { Img, interpolate, spring, staticFile } from "remotion";
import { APP } from "../theme/themes";
import { StatusBar } from "./ui";
import type { ScreenProps } from "./screens";

const fr = (s: number) => Math.round(s * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ORANGE = "#F07E1B";
const NOTE = "linear-gradient(160deg, #DFFFBE 0%, #C3F58F 55%, #B0EC77 100%)";
const NOTE_GREY = "linear-gradient(160deg, #F2F2F2 0%, #DCDCDC 100%)";
/** illustrative 10K+ days (green = 10,000–14,999 in the app); same numbers as scripts/green-calendar.py */
export const stepsFor = (day: number) => 10000 + Math.floor(((day * 3571 + 977) % 4900) / 10) * 10 + ((day * 7) % 10);
const fmt = (n: number) => n.toLocaleString("en-US");

// grid geometry, shared by both calendar screens (annotation targets: CAL_CELL)
const COLS = [56, 146, 236, 326];
const CELL_W = 74, CELL_H = 82, ROW = 102;
export const CAL_CELL = { w: 84, h: 92, r: 12 };

const Note: React.FC<{ x: number; y: number; day: number; steps: number; grey?: boolean; tilt: number; children?: React.ReactNode }> = ({ x, y, day, steps, grey, tilt, children }) => (
  <div style={{ position: "absolute", left: x - CELL_W / 2, top: y - CELL_H / 2, width: CELL_W, height: CELL_H, rotate: `${tilt}deg` }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "4px 4px 14px 4px", background: grey ? NOTE_GREY : NOTE, boxShadow: "2px 4px 6px rgba(40,60,20,0.18)" }} />
    <div style={{ position: "absolute", left: 11, top: 16, fontFamily: "Poppins", fontWeight: 700, fontSize: 19, lineHeight: 1, color: grey ? "#8A8A8A" : "#4D7324" }}>{day}</div>
    <div style={{ position: "absolute", left: 11, top: 44, fontFamily: "Poppins", fontWeight: 700, fontSize: 14, lineHeight: 1, color: grey ? "#8F8F8F" : "#26620F" }}>{fmt(steps)}</div>
    {children}
  </div>
);

const TabBarRC: React.FC<{ active: number }> = ({ active }) => {
  const tabs = ["Summary", "Calendar", "Challenge", "Power cards"];
  const icons = ["🏅", "📅", "🎯", "🃏"];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: "#fff", boxShadow: "0 -1px 0 rgba(15,27,45,0.08)", display: "flex", justifyContent: "space-around", paddingTop: 10 }}>
      {tabs.map((t, i) => (
        <div key={t} style={{ width: 80, textAlign: "center", fontFamily: "Poppins", fontSize: 11, fontWeight: i === active ? 700 : 500, color: i === active ? APP.ink : APP.muted }}>
          <div style={{ fontSize: 22, lineHeight: "28px", filter: i === active ? "none" : "grayscale(0.4)" }}>{icons[i]}</div>{t}
        </div>
      ))}
    </div>
  );
};

const grid = (first: number, top: number, rows: number, special?: (day: number) => React.ReactNode | null) =>
  Array.from({ length: rows * 4 }, (_, k) => {
    const day = first + k, x = COLS[k % 4], y = top + Math.floor(k / 4) * ROW, tilt = ((day * 37) % 5) - 2;
    return special?.(day) ?? <Note key={day} x={x} y={y} day={day} steps={stepsFor(day)} tilt={tilt} />;
  });

/** the top of the calendar: title, average, days 1–20 */
export const RestCalendarTop: React.FC<ScreenProps> = () => (
  <div style={{ position: "absolute", inset: 0, background: "#FAFBF7" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 250, background: "linear-gradient(180deg, #FFF3E2 0%, #FAFBF7 100%)" }} />
    <StatusBar />
    <div style={{ position: "absolute", left: 20, top: 58, fontSize: 26, color: APP.ink }}>←</div>
    <div style={{ position: "absolute", left: 24, top: 96, fontFamily: "Poppins", fontWeight: 900, fontStyle: "italic", fontSize: 54, lineHeight: 1, color: ORANGE }}>60</div>
    <div style={{ position: "absolute", left: 30, top: 146, fontFamily: "Poppins", fontWeight: 800, fontStyle: "italic", fontSize: 18, color: ORANGE }}>Days</div>
    <div style={{ position: "absolute", left: 112, top: 104, fontFamily: "Poppins", fontWeight: 800, fontStyle: "italic", fontSize: 21, lineHeight: 1.15, color: ORANGE, letterSpacing: 0.5 }}>CONSISTENCY<br />CALENDAR</div>
    <div style={{ position: "absolute", left: 16, right: 16, top: 190, height: 70, borderRadius: 18, background: "#fff", boxShadow: "0 4px 14px rgba(15,27,45,0.07)" }}>
      <div style={{ position: "absolute", left: 18, top: 16, fontFamily: "Poppins", fontWeight: 800, fontSize: 28, color: APP.ink }}>
        12,347 <span style={{ fontSize: 15, fontWeight: 600, color: APP.muted }}>avg</span>
      </div>
    </div>
    {grid(1, 320, 5)}
    <TabBarRC active={1} />
  </div>
);

/** the calendar scrolled to days 9–36; day 22 is the low day (4,200, grey). props.liftAt (s): it becomes a green
 *  10,000 note with the Rest Card palm badge, with a small pop */
export const RestCalendar: React.FC<ScreenProps & { liftAt?: number }> = ({ f, liftAt }) => {
  const lifted = liftAt !== undefined && f >= fr(liftAt);
  const p = liftAt === undefined ? 0 : spring({ frame: f - fr(liftAt), fps: 30, config: { damping: 11, stiffness: 160 } });
  return (
    <div style={{ position: "absolute", inset: 0, background: "#FAFBF7" }}>
      <StatusBar />
      {grid(9, 110, 7, (day) => {
        if (day !== 22) return null;
        const x = COLS[1], y = 110 + 3 * ROW;
        return (
          <React.Fragment key={22}>
            <div style={{ opacity: lifted ? interpolate(f, [fr(liftAt!), fr(liftAt!) + 8], [1, 0], clamp) : 1 }}><Note x={x} y={y} day={22} steps={4200} grey tilt={-1} /></div>
            {lifted && (
              <div style={{ scale: String(0.7 + 0.3 * p), opacity: Math.min(1, p * 1.5), transformOrigin: `${x}px ${y}px`, position: "absolute", inset: 0 }}>
                <Note x={x} y={y} day={22} steps={10000} tilt={-1}>
                  <Img src={staticFile("screens/HV-RestCard/art-palm-badge.png")} style={{ position: "absolute", right: -14, top: -16, width: 36, height: 36 }} />
                </Note>
              </div>
            )}
          </React.Fragment>
        );
      })}
      <TabBarRC active={1} />
    </div>
  );
};
export const CAL_DAY22 = { x: COLS[1], y: 110 + 3 * ROW };

/** Power card: the member's Rest Cards (real card art) and the "earn more" panel, light */
export const PowerCard: React.FC<ScreenProps> = () => (
  <div style={{ position: "absolute", inset: 0, background: "#FAFBF7" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 300, background: "linear-gradient(180deg, #F3F8EC 0%, #FAFBF7 100%)" }} />
    <StatusBar />
    <div style={{ position: "absolute", left: 20, top: 58, fontSize: 26, color: APP.ink }}>←</div>
    <div style={{ position: "absolute", left: 24, top: 98, fontFamily: "Poppins", fontWeight: 700, fontSize: 32, color: APP.ink }}>Power card</div>
    <div style={{ position: "absolute", left: 24, top: 162, fontFamily: "Poppins", fontWeight: 600, fontSize: 15, color: APP.muted }}>Rest cards</div>
    {[24, 204].map((x) => <Img key={x} src={staticFile("screens/HV-RestCard/art-rest-card.png")} style={{ position: "absolute", left: x, top: 192, width: 162, height: 155, filter: "drop-shadow(0 6px 10px rgba(40,60,20,0.15))" }} />)}
    <div style={{ position: "absolute", left: 16, right: 16, top: 392, height: 190, borderRadius: 22, background: "#E8F6EE" }}>
      <div style={{ position: "absolute", left: 20, top: 22, fontFamily: "Poppins", fontWeight: 700, fontSize: 20, color: "#0E6B4A" }}>Earn more cards</div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 56, fontFamily: "Poppins", fontSize: 14, lineHeight: 1.4, color: APP.muted }}>Take on Power Challenges to boost your card collection</div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 120, height: 46, borderRadius: 23, background: "#0E9F6E", color: "#fff", fontFamily: "Poppins", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>Explore challenges</div>
    </div>
    <TabBarRC active={3} />
  </div>
);
export const POWER_CARDS = { x: 195, y: 270, w: 372, h: 175, r: 22 };
