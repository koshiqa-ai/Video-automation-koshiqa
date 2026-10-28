// Demo help video: "How do I redeem my koins?" — built from design.md with the coded koins mockups
// (no screen recording yet; design.md §3 allows mockups for demos). Mockup taps are in phone-screen
// coords (390 × 844, see SCREENS.md); `atWord` makes each tap land as that word is spoken.
import type { HelpVideoSpec } from "./types";

export const REDEEM_KOINS: HelpVideoSpec = {
  id: "HV-RedeemKoins",
  question: "How do I redeem my koins?",
  lang: "en",
  steps: ["Tap your koins", "Pick a reward", "Tap Redeem"],
  slides: [
    { code: "F1", pose: "excited", title: "Spend your koins", accent: "koins", vo: "Got koins piling up? Here's how to turn them into real rewards." },
    { code: "T1", title: "3 quick steps", accent: "3", peek: { expr: "determined", side: "left" }, vo: "It only takes three quick steps." },
    // koin chip is top-right, nothing tapped near the bottom corners
    { code: "T2", step: 0, peek: { expr: "smile", side: "left" }, screen: { comp: "koins-1", taps: [{ x: 318, y: 82, at: 1.5, atWord: "koin balance" }] }, vo: "First, tap your koin balance at the top of the home screen." },
    // first reward card is top-left → Torty peeks from the right
    { code: "T2", step: 1, peek: { expr: "thinking", side: "right" }, screen: { comp: "koins-2", taps: [{ x: 104, y: 330, at: 1.5, atWord: "pick" }] }, vo: "Then browse the rewards store and pick something you like." },
    // Redeem is a full-width button at the bottom: it spans both corners, so no peek (design.md §4)
    { code: "T2", step: 2, screen: { comp: "koins-3", taps: [{ x: 195, y: 772, at: 1.8, atWord: "Redeem" }] }, vo: "Check how many koins it costs, then tap Redeem." },
    { code: "S2", title: "Code unlocked", accent: "unlocked", peek: { expr: "excited", side: "right" }, screen: { comp: "koins-redeemed" }, anno: { kind: "success", atWord: "Done" }, vo: "Done! Your code shows up instantly, and your balance updates." },
    { code: "P2", title: "Good to know", accent: "know", peek: { expr: "wink", side: "right" }, times: [0.5, 2.9, 5.4], items: [{ text: "Copy your code", icon: "copy" }, { text: "Saved in Rewards", icon: "gift" }, { text: "Keep earning koins", icon: "steps" }], vo: "Copy your code to use it. It's always saved in My Rewards. And every walk earns you more koins." },
    { code: "F2", pose: "wink", title: "Happy shopping!", accent: "shopping!", vo: "Happy shopping, and keep walking!" },
  ],
};
