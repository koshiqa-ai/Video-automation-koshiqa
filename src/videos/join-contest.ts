// Example help video: "How do I join a contest?" — every slide is a design.md layout code.
import type { HelpVideoSpec } from "./types";

export const JOIN_CONTEST: HelpVideoSpec = {
  id: "HV-JoinContest",
  question: "How do I join a contest?",
  lang: "en",
  steps: ["Open Contests", "Pick a contest", "Tap Join"],
  slides: [
    { code: "F1", pose: "excited", title: "Join a contest", accent: "contest", vo: "Want to walk with your colleagues? Here's how to join a contest." },
    { code: "T1", title: "3 quick steps", accent: "3", peek: { expr: "determined", side: "left" }, vo: "It only takes three quick steps." },
    { code: "T2", step: 0, peek: { expr: "smile", side: "right" }, screen: { comp: "home-tabbar", taps: [{ x: 146, y: 796, at: 1.5 }] }, vo: "First, open the Contests tab at the bottom of the screen." },
    { code: "T2", step: 1, peek: { expr: "thinking", side: "right" }, screen: { comp: "contest-list", taps: [{ x: 195, y: 300, at: 1.4 }] }, vo: "Then pick the contest you want to join." },
    { code: "T2", step: 2, peek: { expr: "happy", side: "left" }, screen: { comp: "contest-detail", detailTaps: [1.6, 999] }, vo: "Tap Join Contest at the bottom." },
    { code: "S2", title: "You're in!", accent: "in!", peek: { expr: "excited", side: "right" }, screen: { comp: "contest-detail", detailTaps: [-10, 1.3] }, anno: { kind: "success", at: 1.7 }, vo: "Confirm your entry, and you're in! Your steps start counting from day one." },
    { code: "F2", pose: "wink", title: "See you there!", accent: "there!", vo: "See you on the leaderboard!" },
  ],
};
