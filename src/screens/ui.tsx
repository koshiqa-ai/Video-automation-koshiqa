// Tiny UI kit for the Koshiqa app mockups (390 × 844 logical px).
import React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";
import { APP } from "../theme/themes";

export const SW = 390;
export const SH = 844;

export const prog = (f: number, start: number, dur: number, ease = Easing.out(Easing.cubic)) =>
  interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/** Press feedback on the tapped element: 1 → 0.95 → 1 */
export const press = (f: number, tap?: number) =>
  tap === undefined
    ? 1
    : interpolate(f, [tap - 3, tap, tap + 7], [1, 0.95, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const font = "Inter, sans-serif";

export const Screen: React.FC<{ bg?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  bg = APP.bg,
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      width: SW,
      height: SH,
      background: bg,
      fontFamily: font,
      color: APP.ink,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Abs: React.FC<{ x?: number; y: number; w?: number; h?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  x = 0,
  y,
  w,
  h,
  style,
  children,
}) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>;

export const StatusBar: React.FC<{ light?: boolean }> = ({ light }) => {
  const c = light ? "#fff" : APP.ink;
  return (
    <Abs y={0} w={SW} h={47} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 30px 0 36px", boxSizing: "border-box", color: c, fontWeight: 600, fontSize: 15 }}>
      <span>9:41</span>
      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="18" height="11" viewBox="0 0 18 11"><g fill={c}>{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 5} y={8 - i * 2.6} width="3.2" height={3 + i * 2.6} rx="1" />)}</g></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 10.5 5.6 8a3.4 3.4 0 0 1 4.8 0L8 10.5Zm-4.3-4.3L2.3 4.8a8 8 0 0 1 11.4 0l-1.4 1.4a6 6 0 0 0-8.6 0Z" fill={c} /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3.2" stroke={c} fill="none" opacity=".5" /><rect x="2.2" y="2.2" width="16" height="7.6" rx="1.8" fill={c} /><rect x="23.6" y="4" width="1.6" height="4" rx=".8" fill={c} opacity=".5" /></svg>
      </span>
    </Abs>
  );
};

export const Header: React.FC<{ title: string; y?: number; back?: boolean; color?: string }> = ({ title, y = 58, back = true, color = APP.ink }) => (
  <Abs x={20} y={y} w={350} h={40} style={{ display: "flex", alignItems: "center", gap: 12, color }}>
    {back && <Icon name="back" size={24} color={color} />}
    <span style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.01em" }}>{title}</span>
  </Abs>
);

export const Card: React.FC<{ x?: number; y: number; w?: number; h: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  x = 16,
  y,
  w = 358,
  h,
  style,
  children,
}) => (
  <Abs x={x} y={y} w={w} h={h} style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 10px rgba(15,27,45,0.06)", overflow: "hidden", ...style }}>
    {children}
  </Abs>
);

export const Button: React.FC<{
  x?: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  bg?: string;
  color?: string;
  scale?: number;
  outline?: boolean;
  icon?: string;
  opacity?: number;
}> = ({ x = 16, y, w = 358, h = 56, label, bg = APP.blue, color = "#fff", scale = 1, outline, icon, opacity = 1 }) => (
  <Abs
    x={x}
    y={y}
    w={w}
    h={h}
    style={{
      background: outline ? "transparent" : bg,
      border: outline ? `1.5px solid ${color}` : "none",
      boxSizing: "border-box",
      borderRadius: h / 2,
      color,
      fontWeight: 700,
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      scale: String(scale),
      opacity,
    }}
  >
    {icon && <Icon name={icon} size={20} color={color} />}
    {label}
  </Abs>
);

export const Toggle: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ width: 52, height: 30, borderRadius: 15, background: interpolateColor(on, "#C9CFD8", APP.blue), position: "relative" }}>
    <div style={{ position: "absolute", top: 3, left: 3 + on * 22, width: 24, height: 24, borderRadius: 12, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.25)" }} />
  </div>
);

export const Radio: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ width: 24, height: 24, borderRadius: 12, border: `2px solid ${on > 0.5 ? APP.blue : "#9AA4B2"}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 12 * on, height: 12 * on, borderRadius: 6, background: APP.blue }} />
  </div>
);

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const interpolateColor = (t: number, a: string, b: string) => {
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  const m = (p: number, q: number) => Math.round(p + (q - p) * Math.max(0, Math.min(1, t)));
  return `rgb(${m(r1, r2)},${m(g1, g2)},${m(b1, b2)})`;
};

export const Logo: React.FC<{ size: number; radius?: number }> = ({ size, radius = size * 0.24 }) => (
  <Img src={staticFile("brand/logo-app.jpg")} style={{ width: size, height: size, borderRadius: radius, display: "block" }} />
);

export const KoinChip: React.FC<{ value: string; scale?: number; dark?: boolean }> = ({ value, scale = 1, dark }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "0 12px 0 6px",
      height: 34,
      borderRadius: 17,
      background: dark ? "rgba(255,255,255,0.16)" : "#FFF4D6",
      color: dark ? "#fff" : "#7A5200",
      fontWeight: 700,
      fontSize: 15,
      scale: String(scale),
    }}
  >
    <Coin size={24} />
    {value}
  </div>
);

export const Coin: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: "radial-gradient(circle at 35% 30%, #FFE58A, #F5B300 60%, #C98A00)",
      border: `${Math.max(1, size * 0.06)}px solid #E3A100`,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#8A5A00",
      fontWeight: 800,
      fontSize: size * 0.5,
      fontFamily: font,
    }}
  >
    K
  </div>
);

export const Avatar: React.FC<{ size?: number; initials?: string; color?: string }> = ({ size = 40, initials = "AM", color = "#FFB38A" }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: color, color: "#5A2A10", fontWeight: 700, fontSize: size * 0.38, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {initials}
  </div>
);

export const Spinner: React.FC<{ f: number; size?: number; color?: string }> = ({ f, size = 26, color = APP.blue }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" style={{ rotate: `${f * 14}deg` }}>
    <circle cx="13" cy="13" r="10" stroke={color} strokeOpacity=".2" strokeWidth="3" fill="none" />
    <path d="M13 3a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

export const Toast: React.FC<{ p: number; text: string; y?: number; color?: string }> = ({ p, text, y = 600, color = APP.ink }) => (
  <Abs
    x={24}
    y={y + (1 - p) * 30}
    w={342}
    h={52}
    style={{ opacity: p, background: color, color: "#fff", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", boxSizing: "border-box", fontSize: 14.5, fontWeight: 600 }}
  >
    <Icon name="check-circle" size={22} color="#5BE3A7" />
    {text}
  </Abs>
);

const PATHS: Record<string, string> = {
  back: "M15 5l-7 7 7 7",
  chevron: "M9 6l6 6-6 6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  home: "M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z",
  trophy: "M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5v1.5A3.5 3.5 0 0 0 8 11M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11M12 13v4M8.5 20h7M10 17h4v3h-4z",
  gift: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7c1.5-3 5-3.5 5-1.5S14 7 12 7",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  briefcase: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  steps: "M8 3c2 0 2.6 2.5 2.4 5-.2 2.2-1.6 3.6-3.4 3.6S4.6 9.7 5 7.4C5.3 5 6 3 8 3zM5.6 13.5h4.2l-.4 2.6a2.1 2.1 0 0 1-4 0zM16 7c2 0 2.6 2.5 2.4 5-.2 2.2-1.6 3.6-3.4 3.6s-2.4-1.9-2-4.2C13.3 9 14 7 16 7zM13.6 17.5h4.2l-.4 2.6a2.1 2.1 0 0 1-4 0z",
  distance: "M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  flame: "M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5.5 1-8.5z",
  stairs: "M4 19h4v-4h4v-4h4V7h4",
  battery: "M3 8h15v8H3zM20 10.5v3M5.5 10.5h6v3h-6z",
  "check-circle": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12.5l2.7 2.7L16 9.8",
  pin: "M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  box: "M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8",
  edit: "M5 19h4L19 9l-4-4L5 15zM13.5 6.5l4 4",
  copy: "M8 8h11v11H8zM5 16V5h11",
  lock: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  phone: "M8 3h8v18H8zM11 18h2",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0",
};

export const Icon: React.FC<{ name: string; size?: number; color?: string; stroke?: number }> = ({ name, size = 22, color = APP.ink, stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={PATHS[name] ?? ""} />
  </svg>
);

export const TabBar: React.FC<{ active: number; light?: boolean }> = ({ active }) => {
  const tabs = [
    ["home", "Home"],
    ["trophy", "Contests"],
    ["gift", "Rewards"],
    ["user", "Profile"],
  ];
  return (
    <Abs y={760} w={SW} h={84} style={{ background: "#fff", borderTop: `1px solid ${APP.line}`, display: "flex" }}>
      {tabs.map(([icon, label], i) => {
        const c = interpolateColor(i === Math.round(active) ? 1 : 0, "#8A94A3", APP.blue);
        return (
          <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 4, color: c, fontSize: 11.5, fontWeight: 600 }}>
            <Icon name={icon} size={24} color={c} />
            {label}
          </div>
        );
      })}
    </Abs>
  );
};

export const StepRing: React.FC<{ value: number; goal: number; size: number }> = ({ value, goal, size }) => {
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, value / goal);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={APP.blueSoft} strokeWidth="18" fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={APP.blue}
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${c * p} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};
