// Video 1 · Explainer: "What is a Rest Card? Why did we build it?" — its benefit, the story behind it, and its limits.
// Script: from the team (2026-11-13), voiceover kept word for word, split per slide.
// Screens: real frames from the team's screen recording (IMG_7237) + their calendar screenshot (day 22 after the card).
// Screenshot coordinates are image px (576 × 1248).
import type { HelpVideoSpec } from "./types";

const shot = (n: string, extra: object = {}) => ({ image: `screens/HV-RestCard/${n}.png`, w: 576, h: 1248, ...extra });
const DAY22 = { x: 219, y: 604, w: 112, h: 118, r: 10 };

export const REST_CARD: HelpVideoSpec = {
  id: "HV-RestCard",
  type: "explainer",
  question: "What is a Rest Card? Why did we build it?",
  lang: "en",
  slides: [
    // 0 · The question (title card; no voiceover in the script, so it holds silently for 3 s)
    { code: "F1", pose: "thinking", title: "What is a Rest\u00a0Card?", accent: "Rest\u00a0Card", minSec: 3 },

    // 1 · The problem
    { code: "S2", title: "Showing up daily", accent: "daily", peek: { expr: "happy", side: "right" }, screen: shot("01"),
      vo: "You're showing up every day, building a habit and making progress." },
    { code: "S2", title: "Not every day's 10K", accent: "10K", peek: { expr: "smile", side: "right" }, screen: shot("02"),
      anno: { kind: "ring", target: DAY22, atWord: "Not every" },
      vo: "But let's be honest. Not every day is going to be a 10,000-step day. And that's okay!" },

    // 2 · The story behind the Rest Card
    { code: "E7", peek: { expr: "happy", side: "left" }, motion: { line1: "Built with feedback", line2: "from members like you" },
      vo: "At Koshiqa, we build our product with feedback from members like you." },
    { code: "S1", peek: { expr: "smile", side: "left" },
      screen: { chat: {
        name: "Torty", subtitle: "Koshiqa team",
        messages: [
          { from: "member", text: "Koshiqa has become my lifelong, sustainable fitness partner 💚", atWord: "lifelong" },
          { from: "member", text: "But on my period days, I don't always want to push myself to 10,000 steps. I'd like to give my body some rest.", atWord: "period" },
          { from: "member", text: "Can we have some rest days in the contest?", atWord: "something simple" },
        ],
        typing: { atWord: "thinking" },
      } },
      vo: "One day, a woman from our community sent us a message that really stayed with us. She said she sees Koshiqa as her lifelong sustainable partner. But during her period days, she sometimes doesn't want to push herself to 10,000 steps. She wants to give her body some rest. And then she asked us something simple: \"Can we have some rest days in the contest?\" That got us thinking." },

    // 3 · Introducing the Rest Card
    { code: "S2", title: "Meet the Rest Card", accent: "Rest Card", peek: { expr: "thinking", side: "left" }, screen: shot("03"),
      anno: { kind: "spotlight", target: { x: 250, y: 433, w: 470, h: 206, r: 28 }, atWord: "Rest Card" },
      vo: "That's one of the reasons we built the Rest Card." },
    { code: "S2", title: "Lifted to 10K", accent: "10K", peek: { expr: "excited", side: "right" }, screen: shot("02", { then: { image: "screens/HV-RestCard/02b.png", atWord: "automatically" } }),
      anno: { kind: "ring", target: DAY22, atWord: "lowest" },
      vo: "It finds your lowest eligible step day in the contest and automatically lifts it to 10,000 steps." },

    // 4 · What's the benefit?
    { code: "C1", title: "Bonus steps", peek: { expr: "happy", side: "left" }, number: { value: 5800, prefix: "+", unit: "steps", label: "4,200 becomes 10,000" },
      vo: "Let's say your lowest day had 4,200 steps. Your Rest Card can add 5,800 steps, bringing that day up to 10,000." },
    { code: "S2", title: "Less deficit", accent: "deficit", peek: { expr: "excited", side: "right" }, screen: shot("05"),
      anno: { kind: "spotlight", target: { x: 288, y: 800, w: 540, h: 360, r: 20 }, atWord: "contest total" },
      vo: "That means more steps in your contest total, a lower deficit and potentially a better club placement!" },

    // 5 · An important thing to remember
    { code: "E7", peek: { expr: "determined", side: "right" }, motion: { line1: "Counts for your contest", line2: "not for your streak" },
      vo: "One important thing to remember: The Rest Card makes your day count as a 10,000-step day for your contest progress. But it doesn't save your daily streak." },
    { code: "C1", title: "Streak minimum", peek: { expr: "thinking", side: "left" }, number: { value: 4000, unit: "steps", label: "actual steps, every day" },
      vo: "You still need at least 4,000 actual steps in a day to maintain your streak." },
    { code: "C3", title: "Streak check", accent: "check", peek: { expr: "worried", side: "left" },
      compare: { left: { title: "3,500 steps", result: "Streak broken. Rest Card can't restore it", atWord: "broken" }, right: { title: "4,200 steps", result: "Streak kept. Lifted to 10K", atWord: "restore" } },
      vo: "If your streak has already broken, the Rest Card won't restore it." },

    // 6 · Closing
    { code: "E14", peek: { expr: "happy", side: "left" }, motion: { title: "Sustainable, not stressful", accent: "not stressful", line: "Push. Rest. Repeat.", filled: 7 },
      vo: "Because we believe fitness should be sustainable, not stressful. Some days you push yourself. Some days you give your body a little rest." },
    { code: "F2", pose: "wink", title: "Every step of the way", accent: "step",
      vo: "And we'll keep building Koshiqa with you, every step of the way." },
  ],
};
