// Video 1 · Explainer: "What is a Rest Card? Why did we build it?"
// v2 (review 2026-11-18, Swati + Mrinal): only why you need it (a missed day) → why we built it (the story) → what it
// does (lifts a day to 10K). The how-to-apply / do's & don'ts part (deficit, club, contest vs streak, streak minimum,
// streak broken) moved out: kept below as MOVED_TO_DOS_AND_DONTS for that video.
// Script: from the team (2026-11-13), voiceover kept word for word, except the opener (new, to voice the title)
// and slide 4 ("Koshiqa is built with feedback…", Mrinal's wording).
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
    // 0 · The question, voiced, and what the viewer will learn (review: "the opening can be more punchy")
    { code: "F1", pose: "thinking", title: "What is a Rest\u00a0Card?", accent: "Rest\u00a0Card",
      vo: "What is a Rest Card, and why did we build it? Here's how it can turn your lowest day into a 10,000-step day." },

    // 1 · Why you need it: not every day is a 10K day (calendar: realistic green 10K+ days, scripts/green-calendar.py)
    { code: "S2", title: "Showing up every day", accent: "every day", peek: { expr: "happy", side: "right" }, screen: shot("01"),
      vo: "You're showing up every day, building a habit and making progress." },
    { code: "S2", title: "Not every day's 10K", accent: "10K", peek: { expr: "smile", side: "right" }, screen: shot("02"),
      zoom: { x: 219, y: 604, scale: 1.6, atWord: "honest" },
      anno: { kind: "ring", target: DAY22, atWord: "Not every" },
      vo: "But let's be honest. Not every day is going to be a 10,000-step day. And that's okay!" },

    // 2 · Why we built it: the story
    { code: "E7", peek: { expr: "smile", side: "right" }, motion: { line1: "Built with feedback", line2: "from members like you", box: [1, 3], icon: "heart" },
      vo: "Koshiqa is built with feedback from members like you." },
    // messages land a sentence ahead of the voice so there's time to read them; the heart reply holds ~2 s
    { code: "S1", peek: { expr: "smile", side: "left" }, minSec: 22.4,
      screen: { chat: {
        name: "Koshiqa member", subtitle: "Community",
        messages: [
          { from: "member", text: "Koshiqa has become my lifelong, sustainable fitness partner 💚", at: 0.5 },
          { from: "member", text: "But on my period days, I don't always want to push myself to 10,000 steps. I'd like to give my body some rest.", atWord: "lifelong" },
          { from: "member", text: "Can we have some rest days in the contest?", atWord: "She wants to give" },
          { from: "koshiqa", text: "💚", atWord: "That got" },
        ],
        typing: { atWord: "simple", from: "koshiqa" },
      } },
      vo: "One day, a woman from our community sent us a message that really stayed with us. She said she sees Koshiqa as her lifelong sustainable partner. But during her period days, she sometimes doesn't want to push herself to 10,000 steps. She wants to give her body some rest. And then she asked us something simple: \"Can we have some rest days in the contest?\" That got us thinking." },

    // 3 · What it does
    // the name first, alone; then the phone (review: "keep one dominant focal point")
    { code: "S2", title: "We built the Rest Card", accent: "Rest Card", titleFirst: true, minSec: 5, peek: { expr: "thinking", side: "left" }, screen: shot("03"),
      anno: { kind: "spotlight", target: { x: 250, y: 433, w: 470, h: 206, r: 28 }, atWord: "Rest Card" },
      vo: "That's one of the reasons we built the Rest Card." },
    { code: "S2", title: "Lifts it to 10,000", accent: "10,000", peek: { expr: "excited", side: "right" },
      screen: shot("02", { then: { image: "screens/HV-RestCard/02b.png", atWord: "automatically", confetti: true } }),
      anno: { kind: "ring", target: DAY22, atWord: "lowest" },
      vo: "It finds your lowest eligible step day in the contest and automatically lifts it to 10,000 steps." },
    // 4,200 actual + 5,800 bonus = 10,000, built up as one bar and held on screen (review: Mrinal + Swati)
    { code: "C5", title: "Adds 5,800 steps", accent: "5,800", peek: { expr: "happy", side: "right" }, minSec: 10,
      bar: { label: "Day 22", base: 4200, add: 5800, baseLabel: "actual steps", addLabel: "Rest Card bonus", atWords: ["4,200", "add 5,800", "bringing"] },
      vo: "Let's say your lowest day had 4,200 steps. Your Rest Card can add 5,800 steps, bringing that day up to 10,000." },

    // 4 · Closing
    { code: "E14", peek: { expr: "happy", side: "left" },
      motion: { title: "Sustainable, not stressful", lines: ["Sustainable,", "not stressful"], linesAtWords: ["sustainable", "not stressful"], accent: "not stressful", line: "",
        heights: [1.35, 0.5, 1.15, 0.4, 1.0, 1.4, 0.6], filled: 7 },
      vo: "Because we believe fitness should be sustainable, not stressful. Some days you push yourself. Some days you give your body a little rest." },
    { code: "F2", pose: "wink", title: "Every step of\u00a0the\u00a0way", accent: "step",
      vo: "And we'll keep building Koshiqa with you, every step of the way." },
  ],
};

/** v1 slides moved out of Video 1 (review 2026-11-18) for the how-to-apply / do's & don'ts video, with the review
 *  notes for them: caption = voiceover ("Less deficit" unclear), animated streak (fire) icons, fill the empty space,
 *  a streak-broken icon, Torty "please be careful" expressions. Not a registered video. */
export const MOVED_TO_DOS_AND_DONTS: HelpVideoSpec["slides"] = [
  { code: "S2", title: "Less deficit", accent: "deficit", peek: { expr: "excited", side: "right" }, screen: shot("05"),
    anno: { kind: "spotlight", target: { x: 288, y: 800, w: 540, h: 360, r: 20 }, atWord: "contest total" },
    vo: "That means more steps in your contest total, a lower deficit and potentially a better club placement!" },
  { code: "E7", peek: { expr: "determined", side: "right" }, motion: { line1: "Counts for your contest", line2: "not for your streak" },
    vo: "One important thing to remember: The Rest Card makes your day count as a 10,000-step day for your contest progress. But it doesn't save your daily streak." },
  { code: "C1", title: "Streak minimum", peek: { expr: "thinking", side: "left" }, number: { value: 4000, unit: "steps", label: "actual steps, every day" },
    vo: "You still need at least 4,000 actual steps in a day to maintain your streak." },
  { code: "C3", title: "Streak check", accent: "check", peek: { expr: "worried", side: "left" },
    compare: { left: { title: "3,500 steps", result: "Streak broken. Rest Card can't restore it", atWord: "broken" }, right: { title: "4,200 steps", result: "Streak kept. Lifted to 10K", atWord: "restore" } },
    vo: "If your streak has already broken, the Rest Card won't restore it." },
];
