// Mock Koshiqa screens used inside the phone frames.
// Each screen receives the scene-local frame `f` and the frames of its gestures `taps`.
// Element positions line up with the gesture coordinates in data/faqs.ts.
import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { APP } from "../theme/themes";
import {
  Abs, Avatar, Button, Card, Coin, Header, Icon, KoinChip, Logo, Radio, Screen, Spinner, StatusBar,
  StepRing, SW, TabBar, Toast, Toggle, fmt, press, prog, font,
} from "./ui";

export type ScreenProps = { f: number; taps: number[] };

/** Slides a follow-up screen in from the right once `at` is reached */
const SlideIn: React.FC<{ f: number; at: number; children: React.ReactNode }> = ({ f, at, children }) => {
  const p = prog(f, at, 12);
  if (p <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, translate: `${(1 - p) * SW}px 0px`, boxShadow: "-12px 0 30px rgba(0,0,0,.12)" }}>{children}</div>;
};

const Emoji: React.FC<{ e: string; size: number }> = ({ e, size }) => (
  <span style={{ fontSize: size, lineHeight: 1, fontFamily: "'Noto Color Emoji', 'Apple Color Emoji', sans-serif" }}>{e}</span>
);

// ───────────────────────── Home ─────────────────────────
export const Home: React.FC<{ steps: number; chipScale?: number; offset?: number; tab?: boolean; synced?: number; extra?: React.ReactNode }> = ({
  steps, chipScale = 1, offset = 0, tab = true, synced = 0, extra,
}) => (
  <Screen>
    <StatusBar />
    {extra}
    <div style={{ position: "absolute", inset: 0, translate: `0px ${offset}px` }}>
      <Abs x={20} y={62} style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Avatar />
        <div>
          <div style={{ fontSize: 12.5, color: APP.muted }}>Good morning,</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Aarav 👋</div>
        </div>
      </Abs>
      <Abs x={268} y={65} w={100} style={{ display: "flex", justifyContent: "center" }}>
        <KoinChip value="2,450" scale={chipScale} />
      </Abs>
      <Card y={124} h={340}>
        <Abs x={20} y={18} style={{ fontSize: 15, fontWeight: 700 }}>Today's steps</Abs>
        <Abs x={226} y={14} style={{ opacity: synced, display: "flex", alignItems: "center", gap: 5, background: "#E3F8EF", color: APP.green, fontSize: 12, fontWeight: 700, padding: "5px 10px", borderRadius: 20 }}>
          <Icon name="check" size={14} color={APP.green} stroke={3} /> Synced now
        </Abs>
        <Abs x={69} y={56}>
          <StepRing value={steps} goal={10000} size={220} />
        </Abs>
        <Abs x={69} y={56} w={220} h={220} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Icon name="steps" size={26} color={APP.blue} />
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em" }}>{fmt(steps)}</div>
          <div style={{ fontSize: 13, color: APP.muted }}>of 10,000 steps</div>
        </Abs>
        <Abs x={20} y={296} w={318} style={{ display: "flex", justifyContent: "space-around", fontSize: 13.5, color: APP.muted, fontWeight: 600 }}>
          <span>📍 {(steps * 0.00074).toFixed(1)} km</span>
          <span>🔥 {Math.round(steps * 0.038)} kcal</span>
          <span>⏱ {Math.round(steps / 110)} min</span>
        </Abs>
      </Card>
      <Card y={480} h={80} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 16px", boxSizing: "border-box" }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: "#FFF1E6", display: "flex", alignItems: "center", justifyContent: "center" }}><Emoji e="🏅" size={26} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15.5 }}>Diwali Dash 10K</div>
          <div style={{ fontSize: 13, color: APP.muted }}>Rank #12 · 6 days left</div>
        </div>
        <Icon name="chevron" color={APP.muted} />
      </Card>
      <Card y={576} h={80} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 16px", boxSizing: "border-box" }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: "#E6F7EE", display: "flex", alignItems: "center", justifyContent: "center" }}><Emoji e="🌳" size={26} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15.5 }}>3 trees planted</div>
          <div style={{ fontSize: 13, color: APP.muted }}>In your name, across India</div>
        </div>
        <Icon name="chevron" color={APP.muted} />
      </Card>
    </div>
    {tab && <TabBar active={0} />}
  </Screen>
);

// ───────────────────────── FAQ 1 ─────────────────────────
const HealthPermissions: React.FC<ScreenProps> = ({ f, taps }) => {
  const on = prog(f, taps[0] + 1, 6);
  const rows: [string, string, number][] = [
    ["steps", "Steps", on],
    ["distance", "Distance", 0],
    ["flame", "Active calories", 0],
    ["stairs", "Floors climbed", 0],
  ];
  return (
    <Screen bg="#fff">
      <StatusBar />
      <Header title="App permissions" />
      <Abs x={20} y={112} w={350} h={72} style={{ display: "flex", alignItems: "center", gap: 14, background: APP.bg, borderRadius: 18, padding: "0 14px", boxSizing: "border-box" }}>
        <Logo size={44} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Koshiqa</div>
          <div style={{ fontSize: 13, color: APP.muted }}>Health Connect access</div>
        </div>
      </Abs>
      <Abs x={24} y={222} style={{ fontSize: 12, fontWeight: 700, color: APP.muted, letterSpacing: ".08em" }}>ALLOW KOSHIQA TO READ</Abs>
      {rows.map(([icon, label, v], i) => (
        <Abs key={label} x={0} y={284 + i * 68} w={SW} h={68} style={{ display: "flex", alignItems: "center", padding: "0 24px", gap: 14, boxSizing: "border-box", borderBottom: `1px solid ${APP.line}`, background: i === 0 ? `rgba(7,93,194,${0.06 * on})` : "transparent" }}>
          <Icon name={icon} color={APP.blue} />
          <span style={{ flex: 1, fontSize: 16.5, fontWeight: 500 }}>{label}</span>
          <div style={{ scale: String(i === 0 ? press(f, taps[0]) : 1) }}><Toggle on={v} /></div>
        </Abs>
      ))}
      <Toast p={prog(f, taps[0] + 10, 10)} text="Koshiqa can now read your steps" y={584} />
    </Screen>
  );
};

const Battery: React.FC<ScreenProps> = ({ f, taps }) => {
  const sel = prog(f, taps[0] + 1, 6);
  const opts: [string, string, number][] = [
    ["Unrestricted", "Syncs in the background, no limits", sel],
    ["Optimised", "Default · may pause background sync", 1 - sel],
    ["Restricted", "Background sync is off", 0],
  ];
  return (
    <Screen bg="#fff">
      <StatusBar />
      <Header title="App battery usage" />
      <Abs x={20} y={112} w={350} h={72} style={{ display: "flex", alignItems: "center", gap: 14, background: APP.bg, borderRadius: 18, padding: "0 14px", boxSizing: "border-box" }}>
        <Logo size={44} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Koshiqa</div>
          <div style={{ fontSize: 13, color: APP.muted }}>3% use since last full charge</div>
        </div>
      </Abs>
      <Abs x={24} y={212} style={{ fontSize: 12, fontWeight: 700, color: APP.muted, letterSpacing: ".08em" }}>MANAGE BATTERY USAGE</Abs>
      {opts.map(([t, d, v], i) => (
        <Abs key={t} x={12} y={242 + i * 88} w={366} h={84} style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 16px", boxSizing: "border-box", borderRadius: 16, background: i === 0 ? `rgba(7,93,194,${0.07 * sel})` : "transparent", scale: String(i === 0 ? press(f, taps[0]) : 1) }}>
          <Radio on={v} />
          <div>
            <div style={{ fontSize: 16.5, fontWeight: 600 }}>{t}</div>
            <div style={{ fontSize: 13, color: APP.muted, marginTop: 2 }}>{d}</div>
          </div>
        </Abs>
      ))}
      <Abs x={24} y={520} w={342} style={{ display: "flex", gap: 10, fontSize: 13.5, color: APP.muted, lineHeight: 1.45 }}>
        <Icon name="battery" color={APP.muted} />
        <span>Battery saver can stop step syncing when the app is closed.</span>
      </Abs>
      <Toast p={prog(f, taps[0] + 10, 10)} text="Koshiqa will sync in the background" y={590} />
    </Screen>
  );
};

const HomeSync: React.FC<ScreenProps> = ({ f, taps }) => {
  const g = taps[0];
  const pull = interpolate(f, [g, g + 16, g + 40, g + 50], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const steps = interpolate(f, [g + 44, g + 74], [1204, 8432], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Home
      steps={steps}
      offset={pull * 74}
      tab={false}
      synced={prog(f, g + 70, 8)}
      extra={
        <Abs x={176} y={58 + pull * 14} style={{ opacity: pull, width: 38, height: 38, borderRadius: 19, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spinner f={f} size={24} />
        </Abs>
      }
    />
  );
};

// ───────────────────────── FAQ 2 ─────────────────────────
const ContestCard: React.FC<{ y: number; title: string; meta: string; sub: string; grad: string; emoji: string; scale?: number }> = ({ y, title, meta, sub, grad, emoji, scale = 1 }) => (
  <Card y={y} h={248} style={{ scale: String(scale) }}>
    <div style={{ height: 136, background: grad, position: "relative", padding: 18, boxSizing: "border-box", color: "#fff" }}>
      <div style={{ fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,.25)", display: "inline-block", padding: "4px 10px", borderRadius: 12 }}>OPEN · FREE</div>
      <div style={{ fontSize: 23, fontWeight: 800, marginTop: 22, letterSpacing: "-0.01em" }}>{title}</div>
      <div style={{ position: "absolute", right: 16, top: 26 }}><Emoji e={emoji} size={64} /></div>
    </div>
    <div style={{ padding: "14px 18px", display: "flex", alignItems: "center" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{meta}</div>
        <div style={{ fontSize: 13, color: APP.muted, marginTop: 4 }}>{sub}</div>
      </div>
      <div style={{ background: APP.blueSoft, color: APP.blue, fontWeight: 700, fontSize: 14, padding: "9px 16px", borderRadius: 20 }}>View</div>
    </div>
  </Card>
);

const ContestList: React.FC<{ scale0?: number }> = ({ scale0 = 1 }) => (
  <Screen>
    <StatusBar />
    <Header title="Contests" back={false} />
    <Abs x={16} y={106} w={358} h={42} style={{ background: "#E9EDF3", borderRadius: 21, display: "flex", padding: 4, boxSizing: "border-box", fontSize: 14, fontWeight: 600 }}>
      {["Open", "Joined", "Past"].map((t, i) => (
        <div key={t} style={{ flex: 1, borderRadius: 17, display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? "#fff" : "transparent", color: i === 0 ? APP.ink : APP.muted }}>{t}</div>
      ))}
    </Abs>
    <ContestCard y={176} title="Diwali Dash 10K" meta="10,000 steps/day · 21 days" sub="Starts 1 Nov · 2,340 joined" grad="linear-gradient(120deg,#FF8A3D,#FF5E7E)" emoji="🪔" scale={scale0} />
    <ContestCard y={440} title="Monsoon Miles" meta="8,000 steps/day · 14 days" sub="Starts 10 Nov · 980 joined" grad="linear-gradient(120deg,#0A8FD6,#22C3A6)" emoji="🌧️" />
    <TabBar active={1} />
  </Screen>
);

const DetailInfo: React.FC = () => (
  <>
    {[
      ["🎯", "Daily goal", "10,000 steps"],
      ["📅", "Duration", "21 days · 1 – 21 Nov"],
      ["🏆", "You win", "Medal · Tree · 500 koins"],
    ].map(([e, k, v], i) => (
      <Abs key={k} x={20} y={326 + i * 74} w={350} h={60} style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: APP.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Emoji e={e} size={24} /></div>
        <div>
          <div style={{ fontSize: 13, color: APP.muted }}>{k}</div>
          <div style={{ fontSize: 16.5, fontWeight: 700 }}>{v}</div>
        </div>
      </Abs>
    ))}
    <Abs x={20} y={560} w={350} h={110} style={{ background: APP.bg, borderRadius: 18, padding: 16, boxSizing: "border-box" }}>
      <div style={{ fontSize: 13, color: APP.muted, fontWeight: 600 }}>WHO'S IN</div>
      <div style={{ display: "flex", marginTop: 12, alignItems: "center" }}>
        {["#FFB38A", "#9AD0FF", "#B9F0C9", "#FFD86B", "#D7C2FF"].map((c, i) => (
          <div key={c} style={{ marginLeft: i ? -10 : 0, border: "3px solid #F5F7FA", borderRadius: 30 }}><Avatar size={40} color={c} initials={["RS", "AK", "PM", "NJ", "SV"][i]} /></div>
        ))}
        <span style={{ marginLeft: 12, fontWeight: 700, fontSize: 14 }}>+2,335 colleagues</span>
      </div>
    </Abs>
  </>
);

const ContestDetail: React.FC<ScreenProps & { idle?: boolean }> = ({ f, taps, idle }) => {
  const [t1, t2] = idle ? [9999, 9999] : taps;
  const sheet = prog(f, t1 + 2, 12);
  const done = prog(f, t2 + 6, 12);
  return (
    <Screen bg="#fff">
      <Abs y={0} w={SW} h={300} style={{ background: "linear-gradient(135deg,#FF8A3D,#FF5E7E)" }} />
      <StatusBar light />
      <Abs x={20} y={58}><Icon name="back" color="#fff" size={26} /></Abs>
      <Abs x={0} y={96} w={SW} style={{ display: "flex", justifyContent: "center" }}><Emoji e="🪔" size={84} /></Abs>
      <Abs x={20} y={208} w={350} style={{ color: "#fff" }}>
        <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.01em" }}>Diwali Dash 10K</div>
        <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>Hosted by Koshiqa · 2,340 joined</div>
      </Abs>
      <DetailInfo />
      <Button y={744} label="Join Contest" scale={press(f, t1)} />
      {sheet > 0 && (
        <>
          <Abs y={0} w={SW} h={844} style={{ background: `rgba(10,20,35,${0.45 * sheet})` }} />
          <Abs y={844 - 352 * sheet} w={SW} h={352} style={{ background: "#fff", borderRadius: "26px 26px 0 0" }}>
            <div style={{ width: 44, height: 5, borderRadius: 3, background: "#D5DAE1", margin: "10px auto 0" }} />
            <div style={{ padding: "18px 22px 0", fontSize: 21, fontWeight: 800 }}>Confirm your entry</div>
            {[["Contest", "Diwali Dash 10K"], ["Entry fee", "Free"], ["Steps from", "Health Connect"]].map(([k, v], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0 22px", marginTop: i ? 12 : 18, fontSize: 15 }}>
                <span style={{ color: APP.muted }}>{k}</span>
                <span style={{ fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </Abs>
          <Button y={744} label="Confirm & Join" bg={APP.green} scale={press(f, t2)} />
        </>
      )}
      {done > 0 && (
        <Abs y={0} w={SW} h={844} style={{ background: "#fff", opacity: done, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 230 }}>
          <div style={{ width: 112, height: 112, borderRadius: 56, background: APP.green, display: "flex", alignItems: "center", justifyContent: "center", scale: String(0.6 + 0.4 * done) }}>
            <Icon name="check" size={64} color="#fff" stroke={3.2} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 28 }}>You're in! 🎉</div>
          <div style={{ fontSize: 15.5, color: APP.muted, marginTop: 8 }}>Diwali Dash 10K starts 1 Nov</div>
          <div style={{ marginTop: 30, background: APP.blueSoft, color: APP.blue, fontWeight: 700, padding: "14px 22px", borderRadius: 16, fontSize: 15 }}>Day 1 of 21 · Keep walking!</div>
        </Abs>
      )}
    </Screen>
  );
};

const HomeTabbar: React.FC<ScreenProps> = ({ f, taps }) => (
  <>
    <Home steps={6120} />
    <SlideIn f={f} at={taps[0] + 4}><ContestList /></SlideIn>
  </>
);

const ContestListScreen: React.FC<ScreenProps> = ({ f, taps }) => (
  <>
    <ContestList scale0={press(f, taps[0])} />
    <SlideIn f={f} at={taps[0] + 6}><ContestDetail f={0} taps={[]} idle /></SlideIn>
  </>
);

// ───────────────────────── FAQ 3 ─────────────────────────
const LAV = "#F3F1FF";

const CorpLogin: React.FC<ScreenProps & { idle?: boolean }> = ({ f, taps, idle }) => {
  const [t1, t2] = idle ? [9999, 9999] : taps;
  const email = "aarav.mehta@acme.com";
  const typed = Math.floor(interpolate(f, [t1 + 10, t1 + 58], [0, email.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const focused = f >= t1;
  const ready = typed === email.length;
  return (
    <Screen bg={LAV}>
      <StatusBar />
      <Abs x={20} y={58}><Icon name="back" size={26} /></Abs>
      <Abs x={24} y={100} style={{ fontSize: 31, fontWeight: 800, letterSpacing: "-0.02em" }}>Welcome!</Abs>
      <Abs x={24} y={148} w={330} style={{ fontSize: 15.5, color: APP.muted, lineHeight: 1.4 }}>Enter your corporate email or employee ID</Abs>
      <Abs x={24} y={222} w={342} h={56} style={{ background: "#fff", borderRadius: 14, border: `2px solid ${focused ? "#6C4DF6" : "#DCD8F0"}`, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 10, padding: "0 14px" }}>
        <Icon name="mail" color={focused ? "#6C4DF6" : "#9A96B5"} />
        {typed > 0 ? (
          <span style={{ fontSize: 16, fontWeight: 500 }}>{email.slice(0, typed)}</span>
        ) : (
          <span style={{ fontSize: 16, color: "#9A96B5" }}>Email / Employee ID</span>
        )}
        {focused && !ready && Math.floor(f / 8) % 2 === 0 && <span style={{ width: 2, height: 22, background: "#6C4DF6", marginLeft: -8 }} />}
      </Abs>
      <Abs x={262} y={310} w={112} h={48} style={{ background: APP.coral, borderRadius: 24, color: "#fff", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", opacity: ready ? 1 : 0.45, scale: String(press(f, t2)) }}>
        {f > t2 + 4 ? <Spinner f={f} size={22} color="#fff" /> : "Next"}
      </Abs>
      <Abs x={24} y={384} w={342} style={{ display: "flex", gap: 8, fontSize: 13.5, color: APP.muted, lineHeight: 1.45 }}>
        <Icon name="lock" size={18} color={APP.muted} />
        <span>We'll send a one-time password to your work email.</span>
      </Abs>
    </Screen>
  );
};

const Welcome: React.FC<ScreenProps> = ({ f, taps }) => (
  <>
    <Screen bg="linear-gradient(170deg,#0A6AD8 0%,#075DC2 50%,#043F8C 100%)" style={{ color: "#fff" }}>
      <StatusBar light />
      <Abs x={-80} y={-60} w={300} h={300} style={{ borderRadius: 150, background: "rgba(255,255,255,.07)" }} />
      <Abs x={240} y={360} w={240} h={240} style={{ borderRadius: 120, background: "rgba(255,255,255,.06)" }} />
      <Abs x={0} y={150} w={SW} style={{ display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("brand/logo-mark-white.png")} style={{ width: 104 }} />
      </Abs>
      <Abs x={0} y={292} w={SW} style={{ textAlign: "center", fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em" }}>Koshiqa</Abs>
      <Abs x={0} y={346} w={SW} style={{ textAlign: "center", fontSize: 16, opacity: 0.85 }}>Walk. Win. Grow.</Abs>
      <Button y={520} label="Continue with phone" outline color="#fff" icon="phone" />
      <Button y={578} label="Continue with work account" bg="#fff" color={APP.blue} icon="briefcase" scale={press(f, taps[0])} />
    </Screen>
    <SlideIn f={f} at={taps[0] + 6}><CorpLogin f={0} taps={[]} idle /></SlideIn>
  </>
);

const Otp: React.FC<ScreenProps> = ({ f, taps }) => {
  const code = "482915";
  const n = Math.floor(interpolate(f, [22, 64], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const done = prog(f, taps[0] + 6, 12);
  return (
    <Screen bg={LAV}>
      <StatusBar />
      <Abs x={20} y={58}><Icon name="back" size={26} /></Abs>
      <Abs x={24} y={100} style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.02em" }}>Check your work email</Abs>
      <Abs x={24} y={144} w={330} style={{ fontSize: 15, color: APP.muted, lineHeight: 1.4 }}>Enter the 6-digit code sent to a••••@acme.com</Abs>
      {code.split("").map((c, i) => (
        <Abs key={i} x={32 + i * 56} y={214} w={46} h={58} style={{ background: "#fff", borderRadius: 12, border: `2px solid ${i === n ? "#6C4DF6" : i < n ? "#BDB2FA" : "#DCD8F0"}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>
          {i < n ? c : ""}
        </Abs>
      ))}
      <Abs x={24} y={296} style={{ fontSize: 14, color: APP.muted }}>Resend code in <b style={{ color: APP.ink }}>0:24</b></Abs>
      <Button x={16} y={424} label="Verify" bg="#6C4DF6" opacity={n === 6 ? 1 : 0.45} scale={press(f, taps[0])} />
      {done > 0 && (
        <Abs y={0} w={SW} h={844} style={{ background: "#fff", opacity: done, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 180 }}>
          <div style={{ width: 108, height: 108, borderRadius: 54, background: APP.green, display: "flex", alignItems: "center", justifyContent: "center", scale: String(0.6 + 0.4 * done) }}>
            <Icon name="check" size={60} color="#fff" stroke={3.2} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 26 }}>Verified!</div>
          <div style={{ fontSize: 15, color: APP.muted, marginTop: 8 }}>Welcome to Koshiqa for ACME Corp</div>
          <div style={{ marginTop: 26, display: "flex", gap: 10, alignItems: "center", background: APP.blueSoft, color: APP.blue, fontWeight: 700, padding: "12px 18px", borderRadius: 14, fontSize: 14.5 }}>
            <Icon name="trophy" size={20} color={APP.blue} /> 3 company challenges live
          </div>
        </Abs>
      )}
    </Screen>
  );
};

// ───────────────────────── FAQ 4 (dual phones) ─────────────────────────
const Wallet: React.FC<{ balance?: number }> = ({ balance = 2450 }) => (
  <Screen>
    <Abs y={0} w={SW} h={330} style={{ background: "linear-gradient(160deg,#0A6AD8,#04408E)" }} />
    <StatusBar light />
    <Header title="My koins" color="#fff" />
    <Abs x={0} y={128} w={SW} style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
      <Coin size={64} />
      <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 8 }}>{fmt(balance)}</div>
      <div style={{ fontSize: 13, background: "rgba(255,255,255,.18)", padding: "5px 12px", borderRadius: 14, marginTop: 6, fontWeight: 600 }}>+120 earned today</div>
    </Abs>
    <Abs x={20} y={352} style={{ fontSize: 13, color: APP.muted, fontWeight: 700, letterSpacing: ".06em" }}>RECENT</Abs>
    {[["🎯", "Daily goal reached", "+50"], ["🏅", "Contest bonus", "+500"], ["🌳", "Planted a tree", "−300"], ["👟", "Weekly streak", "+70"]].map(([e, t, v], i) => (
      <Abs key={t} x={16} y={382 + i * 70} w={358} h={60} style={{ background: "#fff", borderRadius: 16, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", boxSizing: "border-box" }}>
        <Emoji e={e} size={24} />
        <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{t}</span>
        <span style={{ fontWeight: 800, color: v.startsWith("+") ? APP.green : APP.coral }}>{v}</span>
      </Abs>
    ))}
    <Button y={744} label="Open rewards store" icon="gift" />
  </Screen>
);

const REWARDS: [string, string, string, string][] = [
  ["🛍️", "₹100 Amazon Pay", "1,000", "#FFE9D6"],
  ["🌳", "Plant a tree", "300", "#E2F6EA"],
  ["⌚", "20% off fitness band", "1,500", "#E5EEFF"],
  ["🍔", "₹50 Swiggy", "600", "#FFE3E3"],
  ["🧘", "Yoga class pass", "800", "#F1E8FF"],
  ["☕", "Coffee on us", "400", "#FFF3D1"],
];

const Store: React.FC<{ scale0?: number }> = ({ scale0 = 1 }) => (
  <Screen>
    <StatusBar />
    <Header title="Rewards store" back={false} />
    <Abs x={20} y={108}><KoinChip value="2,450 available" /></Abs>
    <Abs x={20} y={160} style={{ display: "flex", gap: 8 }}>
      {["All", "Vouchers", "Fitness", "Green"].map((t, i) => (
        <div key={t} style={{ padding: "8px 14px", borderRadius: 18, fontSize: 13.5, fontWeight: 600, background: i === 0 ? APP.ink : "#fff", color: i === 0 ? "#fff" : APP.ink }}>{t}</div>
      ))}
    </Abs>
    {REWARDS.map(([e, t, c, bg], i) => (
      <Abs key={t} x={24 + (i % 2) * 182} y={230 + Math.floor(i / 2) * 214} w={160} h={200} style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 10px rgba(15,27,45,.06)", scale: String(i === 0 ? scale0 : 1) }}>
        <div style={{ height: 108, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Emoji e={e} size={52} /></div>
        <div style={{ padding: "10px 12px" }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.25, height: 38 }}>{t}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, fontWeight: 800, fontSize: 14, color: "#7A5200" }}><Coin size={18} />{c}</div>
        </div>
      </Abs>
    ))}
  </Screen>
);

const RewardDetail: React.FC<{ scale?: number; loading?: number; f?: number }> = ({ scale = 1, loading = 0, f = 0 }) => (
  <Screen bg="#fff">
    <Abs y={0} w={SW} h={320} style={{ background: "#FFE9D6", display: "flex", alignItems: "center", justifyContent: "center" }}><Emoji e="🛍️" size={120} /></Abs>
    <StatusBar />
    <Abs x={20} y={58}><Icon name="back" size={26} /></Abs>
    <Abs x={20} y={340} w={350} style={{ fontSize: 23, fontWeight: 800 }}>₹100 Amazon Pay voucher</Abs>
    <Abs x={20} y={380} style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 800, color: "#7A5200" }}><Coin size={22} /> 1,000 koins</Abs>
    <Abs x={20} y={428} w={350} style={{ fontSize: 14.5, color: APP.muted, lineHeight: 1.5 }}>Use it on anything at Amazon. Your code arrives instantly and stays in My Rewards.</Abs>
    {["Valid for 12 months", "One code per redemption", "No minimum order"].map((t, i) => (
      <Abs key={t} x={20} y={530 + i * 38} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14.5, fontWeight: 500 }}>
        <Icon name="check-circle" size={20} color={APP.green} />{t}
      </Abs>
    ))}
    <Abs x={16} y={744} w={358} h={56} style={{ background: APP.blue, borderRadius: 28, color: "#fff", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, scale: String(scale) }}>
      {loading > 0 ? <Spinner f={f} size={22} color="#fff" /> : <>Redeem for <Coin size={20} /> 1,000</>}
    </Abs>
  </Screen>
);

const Redeemed: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const bal = interpolate(f, [start + 10, start + 40], [2450, 1450], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Screen bg="#fff">
      <StatusBar />
      <Abs x={0} y={120} w={SW} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 100, height: 100, borderRadius: 50, background: APP.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="check" size={58} color="#fff" stroke={3.2} />
        </div>
        <div style={{ fontSize: 29, fontWeight: 800, marginTop: 22 }}>Redeemed!</div>
        <div style={{ fontSize: 15, color: APP.muted, marginTop: 6 }}>Your ₹100 Amazon Pay code</div>
      </Abs>
      <Abs x={36} y={330} w={318} h={70} style={{ border: "2px dashed #B9C3D1", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", boxSizing: "border-box", fontWeight: 800, fontSize: 21, letterSpacing: ".06em" }}>
        KSQ-7H2P-91 <Icon name="copy" color={APP.blue} />
      </Abs>
      <Abs x={36} y={430} w={318} h={86} style={{ background: APP.bg, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", boxSizing: "border-box" }}>
        <span style={{ color: APP.muted, fontWeight: 600 }}>New balance</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 24 }}><Coin size={26} />{fmt(bal)}</span>
      </Abs>
      <Button y={744} label="View in My Rewards" />
    </Screen>
  );
};

const Koins1: React.FC<ScreenProps> = ({ f, taps }) => <Home steps={7340} chipScale={interpolate(press(f, taps[0]), [0.95, 1], [0.9, 1])} />;
const Koins2: React.FC<ScreenProps> = ({ f, taps }) => <Store scale0={press(f, taps[0])} />;
const Koins3: React.FC<ScreenProps> = ({ f, taps }) => <RewardDetail scale={press(f, taps[0])} loading={f > taps[0] + 4 ? 1 : 0} f={f} />;

// Right-hand "result" phone for the dual layout
const Koins1R: React.FC<ScreenProps> = () => <Wallet />;
const Koins2R: React.FC<ScreenProps> = () => <RewardDetail />;
const Koins3R: React.FC<ScreenProps> = ({ f, taps }) => <Redeemed f={f} start={taps[0] + 8} />;

// ───────────────────────── FAQ 5 ─────────────────────────
const ContestDone: React.FC = () => (
  <Screen bg="#fff">
    <Abs y={0} w={SW} h={290} style={{ background: "linear-gradient(140deg,#0A8FD6,#22C3A6)" }} />
    <StatusBar light />
    <Abs x={20} y={58}><Icon name="back" color="#fff" size={26} /></Abs>
    <Abs x={0} y={96} w={SW} style={{ display: "flex", justifyContent: "center" }}><Emoji e="🏅" size={84} /></Abs>
    <Abs x={20} y={200} w={350} style={{ color: "#fff" }}>
      <div style={{ fontSize: 26, fontWeight: 800 }}>Monsoon Miles 10K</div>
      <div style={{ fontSize: 14, opacity: 0.92, marginTop: 4 }}>You finished · 21 of 21 days 🎉</div>
    </Abs>
    {[["🏅", "Finisher medal", "Preparing to ship"], ["🌳", "Tree planted", "In your name"], ["🪙", "500 koins", "Added to wallet"]].map(([e, t, s], i) => (
      <Abs key={t} x={20} y={318 + i * 76} w={350} h={64} style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: APP.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Emoji e={e} size={26} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{t}</div>
          <div style={{ fontSize: 13, color: APP.muted }}>{s}</div>
        </div>
        <Icon name="chevron" color={APP.muted} />
      </Abs>
    ))}
  </Screen>
);

const MyContests: React.FC<ScreenProps> = ({ f, taps }) => {
  const cards: [string, string, string, string, string][] = [
    ["🏅", "Monsoon Miles 10K", "Completed · 21/21 days", "Medal: preparing to ship", "#FFF1E0"],
    ["🥈", "Summer Stride 8K", "Completed · 14/14 days", "Medal delivered", "#E3F8EF"],
    ["🎖️", "Republic Run 5K", "Completed · 10/10 days", "Medal delivered", "#E3F8EF"],
  ];
  return (
    <>
      <Screen>
        <StatusBar />
        <Header title="My Contests" back={false} />
        <Abs x={16} y={106} w={358} h={42} style={{ background: "#E9EDF3", borderRadius: 21, display: "flex", padding: 4, boxSizing: "border-box", fontSize: 14, fontWeight: 600 }}>
          {["Active", "Completed"].map((t, i) => (
            <div key={t} style={{ flex: 1, borderRadius: 17, display: "flex", alignItems: "center", justifyContent: "center", background: i === 1 ? "#fff" : "transparent", color: i === 1 ? APP.ink : APP.muted }}>{t}</div>
          ))}
        </Abs>
        {cards.map(([e, t, s, pill, pillBg], i) => (
          <Card key={t} y={180 + i * 166} h={150} style={{ padding: 16, boxSizing: "border-box", scale: String(i === 0 ? press(f, taps[0]) : 1) }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: APP.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Emoji e={e} size={32} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{t}</div>
                <div style={{ fontSize: 13, color: APP.muted, marginTop: 3 }}>{s}</div>
              </div>
              <Icon name="chevron" color={APP.muted} />
            </div>
            <div style={{ marginTop: 16, display: "inline-flex", gap: 6, alignItems: "center", background: pillBg, color: i === 0 ? "#B05A00" : APP.green, fontSize: 13, fontWeight: 700, padding: "7px 12px", borderRadius: 14 }}>
              <Icon name={i === 0 ? "box" : "check"} size={16} color={i === 0 ? "#B05A00" : APP.green} stroke={2.4} />{pill}
            </div>
          </Card>
        ))}
        <TabBar active={1} />
      </Screen>
      <SlideIn f={f} at={taps[0] + 6}><ContestDone /></SlideIn>
    </>
  );
};

const Address: React.FC<ScreenProps> = ({ f, taps }) => {
  const [t1, t2] = taps;
  const edit = prog(f, t1 + 2, 10);
  const area = "Sector 71, Mohali";
  const typed = Math.floor(interpolate(f, [t1 + 14, t1 + 44], [0, area.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const fields: [string, string][] = [
    ["Flat / House", "Flat 12B, Green Park Apts"],
    ["Area & city", typed ? area.slice(0, typed) : "Sector 70, Mohali"],
    ["PIN code", "160071"],
  ];
  return (
    <Screen>
      <StatusBar />
      <Header title="Delivery address" />
      <Abs x={24} y={104} style={{ fontSize: 14.5, color: APP.muted }}>Your medal will be shipped here</Abs>
      <Card y={190} h={300} style={{ padding: 18, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 16.5 }}>
          <Icon name="pin" color={APP.blue} /> Aarav Mehta
        </div>
        <div style={{ position: "absolute", left: 18, right: 18, top: 62, opacity: 1 - edit, fontSize: 15, lineHeight: 1.6, color: "#3A4655" }}>
          Flat 12B, Green Park Apts<br />Sector 70, Mohali<br />Punjab 160071<br />+91 98••• ••210
        </div>
        <div style={{ position: "absolute", left: 18, right: 18, top: 58, opacity: edit }}>
          {fields.map(([k, v], i) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: APP.muted, fontWeight: 600, marginBottom: 4 }}>{k}</div>
              <div style={{ height: 42, borderRadius: 10, border: `1.5px solid ${i === 1 ? APP.blue : APP.line}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
      <Abs x={300} y={236} w={60} h={28} style={{ display: "flex", alignItems: "center", gap: 4, color: APP.blue, fontWeight: 700, fontSize: 15, opacity: 1 - edit, scale: String(press(f, t1)) }}>
        <Icon name="edit" size={16} color={APP.blue} />Edit
      </Abs>
      <Button y={532} label="Save address" opacity={0.45 + 0.55 * edit} scale={press(f, t2)} />
      <Toast p={prog(f, t2 + 6, 10)} text="Address saved for your medal" y={612} />
    </Screen>
  );
};

const Track: React.FC<ScreenProps> = ({ f, taps }) => {
  const show = prog(f, taps[0] + 4, 10);
  const fill = interpolate(f, [taps[0] + 10, taps[0] + 50], [0, 3.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const steps: [string, string][] = [
    ["Ordered", "Contest completed · 22 Oct"],
    ["Packed", "Koshiqa warehouse"],
    ["Shipped", "In transit to Mohali hub"],
    ["Out for delivery", "Expected in 2–3 days"],
    ["Delivered", ""],
  ];
  return (
    <Screen>
      <StatusBar />
      <Header title="Your medal" />
      <Card y={104} h={96} style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 16px", boxSizing: "border-box" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "#FFF1E0", display: "flex", alignItems: "center", justifyContent: "center" }}><Emoji e="🏅" size={38} /></div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16.5 }}>Monsoon Miles finisher</div>
          <div style={{ fontSize: 13, color: APP.muted, marginTop: 2 }}>Order #KQ-48213</div>
        </div>
      </Card>
      <Button y={212} h={48} label="Track Medal" icon="truck" scale={press(f, taps[0])} />
      <div style={{ position: "absolute", inset: 0, opacity: show, translate: `0px ${(1 - show) * 20}px` }}>
        <Abs x={39} y={300} w={4} h={4 * 72} style={{ background: APP.line, borderRadius: 2 }} />
        <Abs x={39} y={300} w={4} h={Math.min(fill, 3) * 72} style={{ background: APP.green, borderRadius: 2 }} />
        {steps.map(([t, s], i) => {
          const done = fill >= i;
          const active = i === 3 && fill >= 3;
          return (
            <Abs key={t} x={24} y={288 + i * 72} w={340} h={60} style={{ display: "flex", gap: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 17, flexShrink: 0, background: done ? (active ? APP.blue : APP.green) : "#fff", border: done ? "none" : `2px solid ${APP.line}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: active ? `0 0 0 ${6 + 4 * Math.sin(f / 5)}px rgba(7,93,194,.18)` : "none" }}>
                {done && <Icon name={active ? "truck" : "check"} size={18} color="#fff" stroke={2.6} />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: done ? APP.ink : APP.muted }}>{t}</div>
                <div style={{ fontSize: 13, color: APP.muted, marginTop: 2 }}>{s}</div>
              </div>
            </Abs>
          );
        })}
      </div>
    </Screen>
  );
};

export const SCREENS: Record<string, React.FC<ScreenProps>> = {
  "health-permissions": HealthPermissions,
  battery: Battery,
  "home-sync": HomeSync,
  "home-tabbar": HomeTabbar,
  "contest-list": ContestListScreen,
  "contest-detail": ContestDetail,
  welcome: Welcome,
  "corp-login": CorpLogin,
  otp: Otp,
  "koins-1": Koins1,
  "koins-2": Koins2,
  "koins-3": Koins3,
  "koins-redeemed": Koins3R,
  "my-contests": MyContests,
  address: Address,
  track: Track,
};

/** Result phone for the dual layout (revealed after the first tap) */
export const RESULT_SCREENS: Record<string, React.FC<ScreenProps>> = {
  "koins-1": Koins1R,
  "koins-2": Koins2R,
  "koins-3": Koins3R,
};

export { font };
