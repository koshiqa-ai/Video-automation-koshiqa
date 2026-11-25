// Video 5 · Explainer: "What is a Capping Card?"
// Script: from the team (2026-11-25), voiceover kept word for word, split per slide.
// Storyboard: storyboards/HV-CappingCard.html (approved "continue" 2026-11-25: as reviewed, no wording changes,
// no cuts, no section cards).
// Screens: IMG_7406 (Power card 05, Capping Card screen 06, "Select your capping day" sheet 10), prepped by
// scripts/prep-capping-card-screens.py. Light tops, so no mockups; the sheet is an S3 close-up so its dimmed page
// stays out of view. Screenshot coordinates are image px (576 × 1248).
// Voice: Tara, stability 0 (src/data/voices.json), one take for the whole script.
import type { HelpVideoSpec } from "./types";

const shot = (n: string, extra: object = {}) => ({ image: `screens/HV-CappingCard/${n}.png`, w: 576, h: 1248, ...extra });

export const CAPPING_CARD: HelpVideoSpec = {
  id: "HV-CappingCard",
  type: "explainer",
  question: "What is a Capping Card?",
  lang: "en",
  slides: [
    // 0 · Intro: the headline follows the voice; a capped Day 48 (gold, 15,000) lifts to 25,000 on "Capping Card".
    // Day 48 is today (Nov 25) in the recording's calendar; the card has no badge (none seen for capping).
    { code: "F1", pose: "excited", title: "Marathon, trek or pilgrimage?", accent: "pilgrimage?",
      intro: {
        steps: [
          { title: "Marathon, trek or pilgrimage?", accent: "pilgrimage?" },
          { title: "What is a Capping Card?", accent: "Capping Card?", pose: "thinking", atWord: "Today" },
        ],
        lift: { day: 48, base: 15000, target: 25000, atWord: "explain", liftAtWord: "Capping Card", tone: "gold" },
      },
      vo: 'Going for a marathon, a trek or a pilgrimage? Today - I am going to explain you "What is a Capping Card?"' },

    // 1 · Why we built it: the 15K cap, and a big day above it (illustrative week around the cap, in thousands; days just under it, one big day mid-week so the curve stays clear of the "15K cap" label)
    { code: "E5", peek: { expr: "thinking", side: "right" },
      motion: { pill: "Up to 15,000", values: [12.8, 14.6, 13.2, 23.5, 14.2, 13.4, 12.6], goal: 15, goalLabel: "15K cap", axis: "STEPS", bestLabel: "Big day" },
      vo: "Every day, the contest counts up to 15,000 steps. Anything above that doesn't count. Some days, you go big." },
    { code: "E12", peek: { expr: "confused", side: "left" },
      motion: { title: "Members told us", accent: "told us", items: ["I give everything", "Can it all count?"] },
      vo: "Members told us: on those days, I give everything. Can that whole effort count?" },

    // 2 · How it works: the Power card screen, name first, then the Capping card is ringed
    { code: "S2", title: "The Capping Card", accent: "Capping Card", titleFirst: true, peek: { expr: "excited", side: "right" },
      screen: shot("05"),
      anno: { kind: "ring", target: { x: 127, y: 433, w: 214, h: 204, r: 26 }, atWord: "Capping Card" },
      vo: "So we built the Capping Card." },
    // zoom, then circle: 15,000 → 25,000
    { code: "S2", title: "Cap lifts to 25,000", accent: "25,000", peek: { expr: "smile", side: "left" }, screen: shot("06"),
      zoom: { x: 288, y: 415, scale: 1.5, atWord: "15,000" },
      anno: { kind: "ring", target: { x: 430, y: 415, w: 240, h: 158, r: 20 }, atWord: "25,000" },
      vo: "On the day you choose, your daily cap lifts from 15,000 to 25,000 steps." },
    { code: "E7", peek: { expr: "determined", side: "right" },
      motion: { line1: "Extra steps count", line2: "up to your deficit", box: [2, 3], icon: "steps" },
      vo: "And those extra steps count up to your deficit. The steps you're behind." },

    // 3 · How much counts: three deficits (a sum, a roll, a sum), never the same scene twice in a row
    { code: "C5", title: "Up to 20,000", accent: "20,000", peek: { expr: "thinking", side: "left" }, minSec: 10, titleAtWord: "20,000",
      bar: { label: "Deficit 5K", base: 15000, add: 5000, baseLabel: "daily cap", addLabel: "extra counted", atWords: ["Steps are", "counted", "20,000"] },
      vo: "Deficit of 5,000? Steps are counted up to 20,000, nothing more after that." },
    { code: "E10", peek: { expr: "smile", side: "right" },
      motion: { title: "Deficit 7,000?", accent: "7,000?", from: 15, to: 22, fromLabel: "K cap", toLabel: "K counted", footer: "Up to 22,000" },
      vo: "Deficit of 7,000? Up to 22,000." },
    { code: "C5", title: "The full 10,000", accent: "10,000", peek: { expr: "excited", side: "left" }, minSec: 10, titleAtWord: "counts",
      bar: { label: "Deficit 20K", base: 15000, add: 10000, baseLabel: "daily cap", addLabel: "extra counted", atWords: ["The entire", "10,000 extra", "25,000"] },
      vo: "Deficit of 20,000? The entire 10,000 extra, from 15,000 to 25,000, counts." },

    // 4 · When to use it: the day picker (today Nov 25 selected), as an S3 close-up of the sheet
    // no peek: with Torty the phone sits higher and the headline runs into his head
    { code: "S3", title: "Today and future days", accent: "future days", screen: shot("10"),
      anno: { kind: "ring", target: { x: 288, y: 990, w: 510, h: 128, r: 18 }, atWord: "today" },
      vo: "Capping works on today and future days." },
    // reschedule: no screen in the recording, so the date rolls (illustrative dates)
    { code: "E10", peek: { expr: "wink", side: "left" },
      motion: { title: "Race date changed?", accent: "changed?", from: 26, to: 29, fromLabel: "Nov", toLabel: "Nov", footer: "Just move your card" },
      vo: "And it's the only card you can reschedule before the day. Race date changed? Just move your card." },
    { code: "E12", peek: { expr: "determined", side: "right" },
      motion: { title: "No deficit? Save it", accent: "Save it", items: ["Clear your deficit", "Beyond that? Nothing."] },
      vo: "No deficit? Save it. And remember, you only need to do enough to clear your deficit. Steps beyond that won't add anything." },

    // 5 · Close: the tagline, then Torty
    { code: "E7", peek: { expr: "happy", side: "left" },
      motion: { line1: "Big day. Full effort.", line2: "Make it count.", icon: "flame" },
      vo: '"Big day. Full effort. Make it count."' },
    { code: "F2", pose: "wink", title: "Be a true Cheetah", accent: "Cheetah",
      vo: "For the odd days when you are out of the Urban Jungle and become a true Cheetah ;)" },
  ],
};
