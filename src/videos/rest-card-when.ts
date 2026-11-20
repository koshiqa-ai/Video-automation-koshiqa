// Video 2 · Explainer: "When should you use your Rest Card?"
// Objective (team, 2026-11-17): explain when to use the card, when to save it, and clarify the current
// limitations around planning rest days.
// Script: from the team, voiceover kept word for word, split per slide.
// Screens: IMG_7239 (no benefit: lowest day already 11,000), IMG_7240 (small benefit: 8,500 → +1,500), and
// Video 1's calendar / impact screens for the 4,200 example (IMG_7237). Prep: scripts/prep-rest-card-when-screens.py.
// Screenshot coordinates are image px (576 × 1248).
import type { HelpVideoSpec } from "./types";

const v1 = (n: string, extra: object = {}) => ({ image: `screens/HV-RestCard/${n}.png`, w: 576, h: 1248, ...extra });
const shot = (n: string, extra: object = {}) => ({ image: `screens/HV-RestCardWhen/${n}.png`, w: 576, h: 1248, ...extra });
// the calendar is the coded mockup from Video 1 (src/screens/rest-card-screens.tsx, 390 × 844 screen space):
// the recording's dark top looked like a black patch (team, 2026-11-20)
const DAY22M = { x: 146, y: 416, w: 84, h: 92, r: 12 };

export const REST_CARD_WHEN: HelpVideoSpec = {
  id: "HV-RestCardWhen",
  type: "explainer",
  question: "When should you use your Rest Card?",
  lang: "en",
  slides: [
    // 1 · Hook
    { code: "F1", pose: "thinking", title: "Use it or save it?", accent: "save it?",
      vo: "Have a Rest Card in your account? Before you use it, here's when you should apply it and when you should save it for later." },

    // 2 · When to use it
    { code: "P2", title: "Use it when", accent: "Use it", peek: { expr: "happy", side: "right" },
      items: [
        { text: "A low-step day", icon: "steps", atWord: "low-step day" },
        { text: "A deficit to clear", icon: "trophy", atWord: "contest deficit" },
      ],
      vo: "Use your Rest Card when you've had a low-step day and still have a contest deficit to clear." },
    { code: "S2", title: "4,200 becomes 10,000", accent: "10,000", peek: { expr: "smile", side: "right" },
      screen: { comp: "rest-calendar", props: { liftAtWord: "bringing it", confetti: true } },
      anno: { kind: "ring", target: DAY22M, atWord: "lowest eligible" },
      vo: "For example, if your lowest eligible day has 4,200 steps, your Rest Card can add 5,800 steps, bringing it to 10,000." },
    { code: "S2", title: "Smaller deficit", accent: "deficit", peek: { expr: "excited", side: "left" }, screen: v1("05"),
      anno: { kind: "spotlight", target: { x: 288, y: 850, w: 530, h: 74, r: 14 }, atWord: "reduce" },
      vo: "This can help you reduce your overall contest deficit." },

    // 3 · When to save it
    { code: "S2", title: "Save it for later", accent: "later", peek: { expr: "wink", side: "right" },
      screen: shot("05", { taps: [{ x: 288, y: 1140, atWord: "Save it for later" }] }),
      anno: { kind: "spotlight", target: { x: 288, y: 518, w: 528, h: 86, r: 14 }, atWord: "no eligible" },
      vo: "If there's no eligible low-step day that can benefit from the card, or you've already cleared your contest deficit, there's no reason to use it. Save it for later!" },
    { code: "S2", title: "Small gain? Decide", accent: "Decide", peek: { expr: "thinking", side: "left" },
      screen: shot("06"),
      anno: { kind: "spotlight", target: { x: 288, y: 544, w: 528, h: 138, r: 14 }, atWord: "very small" },
      vo: "And if the benefit is very small, take a moment to decide whether you want to apply it or save it for another time." },

    // 4 · The limitation: no planning ahead (yet)
    { code: "C3", title: "Plan ahead? Soon", accent: "Soon",
      compare: {
        left: { title: "Future days", result: "Can't plan rest days ahead. Coming soon", atWord: "cannot" },
        right: { title: "Past days", result: "Apply anytime to eligible low-step days", atWord: "anytime" },
      },
      vo: "One more thing! For now, you cannot schedule or plan your rest days in advance. We're working on bringing that soon. But you can apply your Rest Card anytime to any of your previous eligible low-step days." },

    // 5 · Takeaway
    { code: "S2", title: "Check the impact", accent: "impact", peek: { expr: "smile", side: "right" }, screen: shot("08"),
      anno: { kind: "spotlight", target: { x: 288, y: 545, w: 548, h: 500, r: 18 }, atWord: "potential impact" },
      vo: "My suggestion? Always check your potential impact before applying." },
    { code: "F2", pose: "wink", title: "Make it count", accent: "count",
      vo: "Use your card when it can make a real difference!" },
  ],
};
