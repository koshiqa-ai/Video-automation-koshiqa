// Screens for the Hindi FAQ "Steps stuck at zero" (Koshiqa ↔ Google Fit sync).
// Phone UI stays in English (as on most users' phones); captions carry the Hindi.
// Every screen gets the scene-local frame `f` and its gesture frames `taps` (in order).
import React from "react";
import { interpolate } from "remotion";
import { APP } from "../theme/themes";
import { Abs, Avatar, Button, Card, Icon, Logo, Screen, StatusBar, SW, Toast, fmt, press, prog } from "./ui";
import { Home } from "./screens";
import type { ScreenProps } from "./screens";
import { APPS, COLX, ICON, ROWY, iconCenter, type AppId } from "./coords-hi";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GMAIL = "aarav.mehta@gmail.com";
const OUTLOOK = "aarav.m@outlook.com";

// ───────────── Shared pieces ─────────────

/** Generic fitness app glyph standing in for Google Fit (not the real logo) */
const FitGlyph: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,.18)" }}>
    <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 24 24">
      <path d="M12 21s-7.5-4.6-9.3-9.5C1.4 8 3.6 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.5 4.3 7C19.5 16.4 12 21 12 21z" fill="none" stroke="#1A73E8" strokeWidth="3" strokeLinejoin="round" />
      <path d="M12 21s-7.5-4.6-9.3-9.5" fill="none" stroke="#EA4335" strokeWidth="3" strokeLinecap="round" />
      <path d="M21.3 11.5C19.5 16.4 12 21 12 21" fill="none" stroke="#34A853" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);


const Emoji: React.FC<{ e: string; size: number }> = ({ e, size }) => (
  <span style={{ fontSize: size, lineHeight: 1, fontFamily: "'Noto Color Emoji', sans-serif" }}>{e}</span>
);

const AppIcon: React.FC<{ id: AppId; size?: number }> = ({ id, size = ICON }) => {
  if (id === "koshiqa") return <Logo size={size} radius={size * 0.28} />;
  if (id === "fit") return <FitGlyph size={size} />;
  const a = APPS.find((x) => x.id === id)!;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: a.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Emoji e={a.glyph!} size={size * 0.5} />
    </div>
  );
};

/** Android-style launcher. `hold` = long-pressed app; menu opens; tapping Uninstall removes it. */
const Launcher: React.FC<{ f: number; target: AppId; holdAt?: number; uninstallAt?: number }> = ({ f, target, holdAt = 99999, uninstallAt = 99999 }) => {
  const menu = prog(f, holdAt + 10, 8) * (1 - prog(f, uninstallAt + 3, 5));
  const gone = prog(f, uninstallAt + 4, 10);
  const c = iconCenter(target);
  const holdScale = interpolate(f, [holdAt, holdAt + 10, uninstallAt, uninstallAt + 1], [1, 1.12, 1.12, 1], clamp);
  return (
    <Screen bg="linear-gradient(180deg,#123A6B 0%,#2B6CB0 45%,#8EC5F0 100%)" style={{ color: "#fff" }}>
      <StatusBar light />
      <Abs x={0} y={110} w={SW} style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 300, letterSpacing: "-0.02em" }}>9:41</div>
        <div style={{ fontSize: 15, opacity: 0.85, marginTop: 2 }}>Friday, 23 October</div>
      </Abs>
      <Abs x={24} y={270} w={342} h={52} style={{ background: "rgba(255,255,255,0.92)", borderRadius: 26, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", boxSizing: "border-box", color: APP.muted, fontSize: 15 }}>
        <Icon name="distance" size={18} color={APP.muted} /> Search apps
      </Abs>
      {APPS.map((a) => {
        const isT = a.id === target;
        const s = isT ? holdScale * (1 - gone) : 1;
        return (
          <Abs key={a.id} x={COLX[a.col] - 44} y={ROWY[a.row]} w={88} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, opacity: isT ? 1 - gone : menu > 0 ? 0.55 : 1 }}>
            <div style={{ scale: String(s) }}><AppIcon id={a.id} /></div>
            <span style={{ fontSize: 13, fontWeight: 500, textShadow: "0 1px 3px rgba(0,0,0,.35)" }}>{a.label}</span>
          </Abs>
        );
      })}
      {menu > 0 && (
        <Abs x={c.x - 95} y={c.y + 56} w={190} h={96} style={{ background: "#fff", borderRadius: 18, color: APP.ink, boxShadow: "0 12px 30px rgba(0,0,0,.3)", opacity: menu, scale: String(0.9 + 0.1 * menu), transformOrigin: "top center", overflow: "hidden" }}>
          <div style={{ height: 48, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", fontSize: 15.5, fontWeight: 500, borderBottom: `1px solid ${APP.line}` }}>
            <Icon name="check-circle" size={20} color={APP.muted} /> App info
          </div>
          <div style={{ height: 48, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", fontSize: 15.5, fontWeight: 600, color: "#D93025", background: f >= uninstallAt - 2 ? "#FCE8E6" : "transparent" }}>
            <Icon name="box" size={20} color="#D93025" /> Uninstall
          </div>
        </Abs>
      )}
      <Abs x={30} y={730} w={330} h={70} style={{ background: "rgba(255,255,255,0.22)", borderRadius: 30, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {["📞", "🌐", "🛍️", "🎵"].map((e) => (
          <div key={e} style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}><Emoji e={e} size={26} /></div>
        ))}
      </Abs>
      <Toast p={prog(f, uninstallAt + 10, 8) * (1 - prog(f, uninstallAt + 40, 8))} text={`${target === "fit" ? "Fit" : "Koshiqa"} uninstalled`} y={650} />
    </Screen>
  );
};

/** Generic app-store install page */
const StorePage: React.FC<{ f: number; app: "fit" | "koshiqa"; installAt: number }> = ({ f, app, installAt }) => {
  const dl = interpolate(f, [installAt + 4, installAt + 34], [0, 1], clamp);
  const done = f > installAt + 36;
  const name = app === "fit" ? "Google Fit: Activity Tracking" : "Koshiqa: Walk. Win. Grow.";
  return (
    <Screen bg="#fff">
      <StatusBar />
      <Abs x={20} y={58} w={350} h={44} style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Icon name="back" size={24} />
        <div style={{ flex: 1, height: 42, borderRadius: 21, background: APP.bg, display: "flex", alignItems: "center", padding: "0 16px", color: APP.muted, fontSize: 15 }}>{app === "fit" ? "google fit" : "koshiqa"}</div>
      </Abs>
      <Abs x={24} y={128} w={342} style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <AppIcon id={app} size={76} />
        <div>
          <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.2 }}>{name}</div>
          <div style={{ fontSize: 13.5, color: APP.green, fontWeight: 600, marginTop: 4 }}>{app === "fit" ? "Google LLC" : "Koshiqa"}</div>
        </div>
      </Abs>
      <Abs x={24} y={226} w={342} style={{ display: "flex", justifyContent: "space-around", fontSize: 13, color: APP.muted, textAlign: "center" }}>
        <div><b style={{ color: APP.ink, fontSize: 15 }}>4.6 ★</b><br />Reviews</div>
        <div><b style={{ color: APP.ink, fontSize: 15 }}>{app === "fit" ? "100M+" : "100K+"}</b><br />Downloads</div>
        <div><b style={{ color: APP.ink, fontSize: 15 }}>Everyone</b><br />Rated</div>
      </Abs>
      {dl > 0 && !done ? (
        <Abs x={24} y={300} w={342} h={48} style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <div style={{ fontSize: 13.5, color: APP.muted }}>{Math.round(dl * 100)}% · Installing…</div>
          <div style={{ height: 6, borderRadius: 3, background: APP.line }}><div style={{ height: 6, width: `${dl * 100}%`, borderRadius: 3, background: APP.green }} /></div>
        </Abs>
      ) : (
        <Button x={24} y={300} w={342} h={48} label={done ? "Open" : "Install"} bg={APP.green} scale={press(f, installAt)} />
      )}
      <Abs x={24} y={380} w={342} h={360} style={{ display: "flex", gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, borderRadius: 14, background: i === 1 ? "#E8F1FC" : "#F1F3F4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, border: `8px solid ${i === 1 ? APP.blue : "#C9D3DE"}` }} />
          </div>
        ))}
      </Abs>
    </Screen>
  );
};

/** Android-style physical-activity permission prompt over an app */
const PermissionDialog: React.FC<{ f: number; app: string; showAt: number; allowAt: number; icon: React.ReactNode }> = ({ f, app, showAt, allowAt, icon }) => {
  const p = prog(f, showAt, 8) * (1 - prog(f, allowAt + 4, 6));
  if (p <= 0) return null;
  return (
    <>
      <Abs y={0} w={SW} h={844} style={{ background: `rgba(0,0,0,${0.5 * p})` }} />
      <Abs x={28} y={262} w={334} h={340} style={{ background: "#F3F6FC", borderRadius: 28, opacity: p, scale: String(0.94 + 0.06 * p), padding: "26px 24px", boxSizing: "border-box", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>{icon}</div>
        <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.35, marginTop: 16 }}>
          Allow <b>{app}</b> to access your physical activity?
        </div>
        <div style={{ fontSize: 13, color: APP.muted, marginTop: 8 }}>Needed for Activity Tracking (steps)</div>
      </Abs>
      <Button x={48} y={496} w={294} h={48} label="Allow" scale={press(f, allowAt)} opacity={p} />
      <Abs x={48} y={552} w={294} h={40} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: APP.blue, fontWeight: 600, fontSize: 15.5, opacity: p }}>Don't allow</Abs>
    </>
  );
};

/** Account chooser bottom sheet */
const AccountSheet: React.FC<{ f: number; showAt: number; pickAt: number; title: string }> = ({ f, showAt, pickAt, title }) => {
  const p = prog(f, showAt, 10) * (1 - prog(f, pickAt + 8, 8));
  if (p <= 0) return null;
  const rows: [string, string, string, string][] = [
    [GMAIL, "Aarav Mehta", "AM", "#FFB38A"],
    [OUTLOOK, "Aarav M", "AM", "#9AD0FF"],
  ];
  return (
    <>
      <Abs y={0} w={SW} h={844} style={{ background: `rgba(10,20,35,${0.45 * p})` }} />
      <Abs y={844 - 372 * p} w={SW} h={372} style={{ background: "#fff", borderRadius: "26px 26px 0 0" }}>
        <div style={{ width: 44, height: 5, borderRadius: 3, background: "#D5DAE1", margin: "10px auto 0" }} />
        <div style={{ padding: "16px 22px 6px", fontSize: 20, fontWeight: 700 }}>Choose an account</div>
        <div style={{ padding: "0 22px 12px", fontSize: 14, color: APP.muted }}>{title}</div>
        {rows.map(([mail, name, ini, col], i) => (
          <div key={mail} style={{ height: 70, display: "flex", alignItems: "center", gap: 14, padding: "0 22px", borderTop: `1px solid ${APP.line}`, background: i === 0 && f >= pickAt - 2 ? APP.blueSoft : "transparent", scale: String(i === 0 ? press(f, pickAt) : 1) }}>
            <Avatar size={40} initials={ini} color={col} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15.5 }}>{name}</div>
              <div style={{ fontSize: 13.5, color: APP.muted }}>{mail}</div>
            </div>
            {i === 0 && f >= pickAt && <Icon name="check-circle" size={22} color={APP.green} />}
          </div>
        ))}
      </Abs>
    </>
  );
};

/** Google-Fit-like home (generic styling, not Google's UI) */
const FitHome: React.FC<{ f: number; steps: number; avatarScale?: number }> = ({ steps, avatarScale = 1 }) => {
  const r1 = 108, r2 = 86;
  const c1 = 2 * Math.PI * r1, c2 = 2 * Math.PI * r2;
  const p = Math.min(1, steps / 10000);
  return (
    <Screen bg="#fff">
      <StatusBar />
      <Abs x={22} y={62} style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <FitGlyph size={34} />
        <span style={{ fontSize: 22, fontWeight: 600 }}>Fit</span>
      </Abs>
      <Abs x={326} y={60} style={{ scale: String(avatarScale) }}><Avatar size={40} /></Abs>
      <Abs x={0} y={120} w={SW} style={{ display: "flex", justifyContent: "center" }}>
        <svg width="260" height="260" viewBox="0 0 260 260">
          <circle cx="130" cy="130" r={r1} stroke="#E6F4EA" strokeWidth="16" fill="none" />
          <circle cx="130" cy="130" r={r1} stroke="#34A853" strokeWidth="16" fill="none" strokeLinecap="round" strokeDasharray={`${c1 * Math.min(1, p * 0.8)} ${c1}`} transform="rotate(-90 130 130)" />
          <circle cx="130" cy="130" r={r2} stroke="#E8F0FE" strokeWidth="16" fill="none" />
          <circle cx="130" cy="130" r={r2} stroke="#1A73E8" strokeWidth="16" fill="none" strokeLinecap="round" strokeDasharray={`${c2 * p} ${c2}`} transform="rotate(-90 130 130)" />
        </svg>
      </Abs>
      <Abs x={0} y={208} w={SW} style={{ textAlign: "center" }}>
        <div style={{ fontSize: 38, fontWeight: 700, color: "#1A73E8" }}>{fmt(steps)}</div>
        <div style={{ fontSize: 14, color: APP.muted, fontWeight: 500 }}>Steps today</div>
      </Abs>
      <Abs x={0} y={396} w={SW} style={{ display: "flex", justifyContent: "space-around", fontSize: 13.5, color: APP.muted, textAlign: "center" }}>
        <div><b style={{ color: APP.ink, fontSize: 18 }}>{Math.round(steps * 0.038)}</b><br />Cal</div>
        <div><b style={{ color: APP.ink, fontSize: 18 }}>{(steps * 0.00074).toFixed(1)}</b><br />km</div>
        <div><b style={{ color: APP.ink, fontSize: 18 }}>{Math.round(steps / 110)}</b><br />Move min</div>
      </Abs>
      <Card x={16} y={480} w={358} h={130} style={{ background: "#F8FAFD", boxShadow: "none", border: `1px solid ${APP.line}`, padding: 18, boxSizing: "border-box" }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>Your weekly goal</div>
        <div style={{ display: "flex", gap: 10, marginTop: 16, alignItems: "flex-end", height: 56 }}>
          {[0.5, 0.8, 0.4, 0.9, 0.7, 0.6, p].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${Math.max(8, h * 100)}%`, borderRadius: 6, background: i === 6 ? "#1A73E8" : "#C6DAFC" }} />
          ))}
        </div>
      </Card>
    </Screen>
  );
};

const AccountCard: React.FC<{ f: number; showAt: number; emailAt: number }> = ({ f, showAt, emailAt }) => {
  const p = prog(f, showAt, 10);
  if (p <= 0) return null;
  const hl = prog(f, emailAt, 6);
  const pulse = 1 + 0.03 * Math.sin(Math.max(0, f - emailAt) / 3) * (f > emailAt ? 1 : 0);
  return (
    <>
      <Abs y={0} w={SW} h={844} style={{ background: `rgba(10,20,35,${0.35 * p})` }} />
      <Abs x={16} y={104 + (1 - p) * -30} w={358} h={290} style={{ background: "#fff", borderRadius: 26, opacity: p, boxShadow: "0 18px 40px rgba(0,0,0,.25)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}><Avatar size={72} /></div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 12 }}>Aarav Mehta</div>
        <div style={{ margin: "16px 20px 0", height: 54, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 16.5, fontWeight: 600, background: `rgba(26,115,232,${0.1 * hl})`, border: `2px solid rgba(26,115,232,${hl})`, scale: String(pulse), color: hl > 0.5 ? "#1A73E8" : APP.ink }}>
          <Icon name="mail" size={20} color={hl > 0.5 ? "#1A73E8" : APP.muted} /> {GMAIL}
        </div>
        <div style={{ fontSize: 13, color: APP.muted, marginTop: 14 }}>Signed in to Fit with this account</div>
      </Abs>
    </>
  );
};

// ───────────── Scene screens ─────────────

/** Step 1 — open Google Fit, see if steps show */
const FitCheck: React.FC<ScreenProps> = ({ f, taps }) => {
  const open = prog(f, taps[0] + 4, 10);
  const steps = interpolate(f, [taps[0] + 14, taps[0] + 44], [0, 6240], clamp);
  return (
    <>
      <Launcher f={f} target="fit" />
      {open > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: open, scale: String(0.85 + 0.15 * open), transformOrigin: `${iconCenter("fit").x}px ${iconCenter("fit").y}px` }}>
          <FitHome f={f} steps={steps} />
        </div>
      )}
    </>
  );
};

/** Method 1 · Step 2 — find which email Google Fit uses */
const FitEmail: React.FC<ScreenProps> = ({ f, taps }) => (
  <>
    <FitHome f={f} steps={6240} avatarScale={press(f, taps[0])} />
    <AccountCard f={f} showAt={taps[0] + 4} emailAt={taps[1]} />
  </>
);

/** Method 1 · Step 3 — Koshiqa must use the same email; Change → pick it */
const KoshiqaEmail: React.FC<ScreenProps> = ({ f, taps }) => {
  const [changeAt, pickAt] = taps;
  const fixed = f >= pickAt + 8;
  const ok = prog(f, pickAt + 8, 10);
  const mail = fixed ? GMAIL : OUTLOOK;
  const warnPulse = fixed ? 0 : 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <Screen>
      <StatusBar />
      <Abs x={20} y={58} w={350} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon name="back" size={24} />
        <span style={{ fontSize: 21, fontWeight: 700 }}>Connected apps</span>
      </Abs>
      <Abs x={24} y={108} w={342} style={{ fontSize: 14, color: APP.muted, lineHeight: 1.45 }}>Koshiqa reads your steps from Google Fit. Both must use the same account.</Abs>
      <Card y={172} h={196} style={{ padding: 18, boxSizing: "border-box", border: `2px solid ${fixed ? APP.green : `rgba(242,95,107,${0.4 + 0.6 * warnPulse})`}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <FitGlyph size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16.5 }}>Google Fit</div>
            <div style={{ fontSize: 13, color: APP.muted }}>Steps source</div>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 12.5, color: APP.muted, fontWeight: 600, letterSpacing: ".04em" }}>SIGNED IN AS</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
          <span style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>{mail}</span>
          <span style={{ color: APP.blue, fontWeight: 700, fontSize: 15, padding: "6px 4px", scale: String(press(f, changeAt)), display: "inline-block" }}>Change</span>
        </div>
        <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, padding: "6px 10px", borderRadius: 12, background: fixed ? "#E3F8EF" : "#FDECEE", color: fixed ? APP.green : APP.coral }}>
          <Icon name={fixed ? "check" : "bell"} size={15} color={fixed ? APP.green : APP.coral} stroke={2.6} />
          {fixed ? "Matches your Google Fit account" : "Doesn't match Google Fit"}
        </div>
      </Card>
      <Card y={388} h={80} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 18px", boxSizing: "border-box" }}>
        <Icon name="steps" size={26} color={APP.blue} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15.5 }}>Today's steps</div>
          <div style={{ fontSize: 13, color: APP.muted }}>{fixed ? "Synced just now" : "Not syncing"}</div>
        </div>
        <span style={{ fontWeight: 800, fontSize: 20, color: fixed ? APP.ink : APP.coral }}>{fmt(interpolate(ok, [0, 1], [0, 6240]))}</span>
      </Card>
      <AccountSheet f={f} showAt={changeAt + 4} pickAt={pickAt} title="to connect Google Fit to Koshiqa" />
      <Toast p={prog(f, pickAt + 14, 8)} text="Email ID matched — steps syncing" y={600} />
    </Screen>
  );
};

/** Method 1 · Step 4 — reinstall Koshiqa, same account, allow Activity Tracking */
const ReinstallKoshiqa: React.FC<ScreenProps> = ({ f, taps }) => {
  const [holdAt, uninstallAt, installAt, pickAt, allowAt] = taps;
  const storeIn = prog(f, uninstallAt + 26, 10);
  const appIn = prog(f, installAt + 40, 10);
  return (
    <>
      <Launcher f={f} target="koshiqa" holdAt={holdAt} uninstallAt={uninstallAt} />
      {storeIn > 0 && <div style={{ position: "absolute", inset: 0, translate: `${(1 - storeIn) * SW}px 0px` }}><StorePage f={f} app="koshiqa" installAt={installAt} /></div>}
      {appIn > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: appIn }}>
          {f < allowAt + 8 ? <KoshiqaSplash /> : <Home steps={interpolate(f, [allowAt + 10, allowAt + 40], [0, 6240], clamp)} synced={prog(f, allowAt + 40, 8)} />}
          <AccountSheet f={f} showAt={installAt + 50} pickAt={pickAt} title="Use the same account as Google Fit" />
          <PermissionDialog f={f} app="Koshiqa" showAt={pickAt + 16} allowAt={allowAt} icon={<Logo size={52} />} />
        </div>
      )}
    </>
  );
};

const KoshiqaSplash: React.FC = () => (
  <Screen bg="linear-gradient(170deg,#0A6AD8 0%,#075DC2 50%,#043F8C 100%)" style={{ color: "#fff" }}>
    <StatusBar light />
    <Abs x={0} y={190} w={SW} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <Logo size={96} radius={28} />
      <div style={{ fontSize: 34, fontWeight: 800 }}>Koshiqa</div>
      <div style={{ fontSize: 15, opacity: 0.85 }}>Walk. Win. Grow.</div>
    </Abs>
  </Screen>
);

/** Method 2 — reinstall Google Fit, allow Activity Tracking */
const ReinstallFit: React.FC<ScreenProps> = ({ f, taps }) => {
  const [holdAt, uninstallAt, installAt, allowAt] = taps;
  const storeIn = prog(f, uninstallAt + 26, 10);
  const appIn = prog(f, installAt + 40, 10);
  const steps = interpolate(f, [allowAt + 10, allowAt + 46], [0, 6240], clamp);
  return (
    <>
      <Launcher f={f} target="fit" holdAt={holdAt} uninstallAt={uninstallAt} />
      {storeIn > 0 && <div style={{ position: "absolute", inset: 0, translate: `${(1 - storeIn) * SW}px 0px` }}><StorePage f={f} app="fit" installAt={installAt} /></div>}
      {appIn > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: appIn }}>
          <FitHome f={f} steps={steps} />
          <PermissionDialog f={f} app="Fit" showAt={installAt + 54} allowAt={allowAt} icon={<FitGlyph size={52} />} />
          <Toast p={prog(f, allowAt + 12, 8)} text="Activity Tracking allowed" y={640} />
        </div>
      )}
    </>
  );
};


export const HI_SCREENS: Record<string, React.FC<ScreenProps>> = {
  "hi-fit-check": FitCheck,
  "hi-fit-email": FitEmail,
  "hi-koshiqa-email": KoshiqaEmail,
  "hi-reinstall-koshiqa": ReinstallKoshiqa,
  "hi-reinstall-fit": ReinstallFit,
};

