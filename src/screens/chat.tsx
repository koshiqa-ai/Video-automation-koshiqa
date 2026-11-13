// Chat-thread mockup (390 × 844 screen space) for story moments that have no real app screen,
// e.g. a member's message to the Koshiqa team. Messages pop in at their `at` (seconds into the slide).
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { ChatScreen } from "../data/layout-system";
import { APP } from "../theme/themes";
import { StatusBar } from "./ui";

const fr = (s: number) => Math.round(s * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BUBBLE_MEMBER = "#DDF5E9";
const BUBBLE_TEAM = "#FFFFFF";

export const ChatView: React.FC<{ chat: ChatScreen["chat"] }> = ({ chat }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = chat.messages.filter((m) => f >= fr(m.at ?? 0));
  const typingOn = chat.typing && f >= fr(chat.typing.at ?? 99);
  // the thread scrolls up when it would overflow (bubbles are measured roughly: 22 px/line, 30 chars/line)
  const h = (t: string) => 30 + 23 * Math.ceil(t.length / 27);
  const total = shown.reduce((a, m) => a + h(m.text) + 12, 0) + (typingOn ? 58 : 0);
  const room = 844 - 150 - 92;
  const scroll = Math.max(0, total - room);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#EEF1F4", fontFamily: "Poppins", overflow: "hidden" }}>
      {/* header */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 128, background: "#fff", boxShadow: "0 1px 0 rgba(15,27,45,0.08)" }}>
        <StatusBar />
        <div style={{ position: "absolute", left: 18, top: 70, fontSize: 26, color: APP.ink, lineHeight: 1 }}>‹</div>
        <div style={{ position: "absolute", left: 46, top: 58, width: 52, height: 52, borderRadius: 26, background: "#D8F2E4", overflow: "hidden" }}>
          <Img src={staticFile(chat.avatar ?? "torty/peek-flat/peek-left-smile.png")} style={{ position: "absolute", left: -6, top: 2, width: 64 }} />
        </div>
        <div style={{ position: "absolute", left: 110, top: 60, fontSize: 18, fontWeight: 700, color: APP.ink }}>{chat.name}</div>
        <div style={{ position: "absolute", left: 110, top: 86, fontSize: 13, color: APP.muted }}>{typingOn ? "typing…" : chat.subtitle ?? "Koshiqa team"}</div>
      </div>
      {/* thread */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, bottom: 92, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, translate: `0px ${-scroll}px`, display: "flex", flexDirection: "column", gap: 12, padding: "0 14px" }}>
          <div style={{ alignSelf: "center", fontSize: 12, color: APP.muted, background: "rgba(255,255,255,0.8)", padding: "4px 12px", borderRadius: 10, marginBottom: 4 }}>Today</div>
          {shown.map((m, i) => {
            const p = spring({ frame: f - fr(m.at ?? 0), fps, config: { damping: 14, stiffness: 180 } });
            const me = m.from === "member";
            return (
              <div key={i} style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: 290, padding: "11px 15px", borderRadius: 20, borderBottomRightRadius: me ? 6 : 20, borderBottomLeftRadius: me ? 20 : 6, background: me ? BUBBLE_MEMBER : BUBBLE_TEAM, color: APP.ink, fontSize: 17, lineHeight: 1.36, boxShadow: "0 2px 6px rgba(15,27,45,0.08)", opacity: p, scale: String(0.85 + 0.15 * p), transformOrigin: me ? "100% 100%" : "0% 100%" }}>
                {m.text}
              </div>
            );
          })}
          {typingOn && (
            <div style={{ alignSelf: "flex-start", padding: "14px 18px", borderRadius: 20, borderBottomLeftRadius: 6, background: BUBBLE_TEAM, display: "flex", gap: 6, boxShadow: "0 2px 6px rgba(15,27,45,0.08)" }}>
              {[0, 1, 2].map((k) => <div key={k} style={{ width: 9, height: 9, borderRadius: 5, background: APP.muted, opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f - k * 4) / 5)) }} />)}
            </div>
          )}
        </div>
      </div>
      {/* composer */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 92, background: "#fff", boxShadow: "0 -1px 0 rgba(15,27,45,0.08)" }}>
        <div style={{ position: "absolute", left: 16, right: 70, top: 14, height: 42, borderRadius: 21, background: "#F1F3F6", color: APP.muted, fontSize: 15, display: "flex", alignItems: "center", paddingLeft: 18 }}>Message</div>
        <div style={{ position: "absolute", right: 16, top: 14, width: 42, height: 42, borderRadius: 21, background: APP.green, opacity: interpolate(f, [0, 10], [0.6, 1], clamp) }} />
      </div>
    </div>
  );
};
