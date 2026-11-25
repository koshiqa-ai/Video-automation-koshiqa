// Video 4 · Explainer: "What if your best day counted twice?" (the Booster Card)
// Script: from the team (2026-11-25), voiceover kept word for word, split per slide.
// Storyboard: storyboards/HV-BoosterCard.html (approved "as is" 2026-11-25: no section cards, no cuts).
// Screens: IMG_7404 (Power card 05, Booster Card screen 06) and IMG_7406 (Capping Card screen 11), all with light
// tops, so no mockups. Screenshot coordinates are image px (576 × 1248).
// Voice: Tara, stability 0 (src/data/voices.json), one take for the whole script.
import type { HelpVideoSpec } from "./types";

const shot = (n: string, extra: object = {}) => ({ image: `screens/HV-BoosterCard/${n}.png`, w: 576, h: 1248, ...extra });

export const BOOSTER_CARD: HelpVideoSpec = {
  id: "HV-BoosterCard",
  type: "explainer",
  question: "What if your best day counted twice?",
  lang: "en",
  slides: [
    // 0 · Intro: the headline follows the voice; Day 40 (gold = capped at 15,000) doubles to 30,000 and gets the
    // Booster's rocket badge, as in the app's calendar after the card is applied (IMG_7404, 0:47)
    { code: "F1", pose: "thinking", title: "Best day, counted twice?", accent: "twice?",
      intro: {
        steps: [
          { title: "Best day, counted twice?", accent: "twice?" },
          { title: "The Booster Card", accent: "Booster Card", pose: "excited", atWord: "That's" },
        ],
        lift: { day: 40, base: 15000, target: 30000, atWord: "best day", liftAtWord: "twice", tone: "gold", badge: "screens/HV-BoosterCard/art-rocket-badge.png" },
      },
      vo: "What if your best day counted twice? That's the Booster Card." },

    // 1 · Why we built it: a habit you can sustain (E14, gently varied week)
    { code: "E14", peek: { expr: "smile", side: "left" },
      motion: { title: "A habit, no pressure", accent: "no pressure", line: "", lines: ["A habit,", "no pressure"], linesAtWords: ["habit", "no pressure"],
        heights: [0.95, 1.1, 0.85, 1.05, 0.9, 1.15, 1.0], filled: 7 },
      vo: "Koshiqa is about building a habit of movement. One you can sustain, with no pressure." },
    // the desk-worker week: low weekdays, big weekend (illustrative values, in thousands)
    { code: "E5", peek: { expr: "thinking", side: "right" },
      motion: { pill: "At a desk", values: [4.6, 5.2, 3.9, 4.8, 5.4, 16.2, 13.1], goal: 10, goalLabel: "10K goal", axis: "STEPS", bestLabel: "Weekend run" },
      vo: "But everyone's routine is different. Some members are active all week, moving around at work. Others are stuck at a desk on weekdays, and find their weekends for a morning run or a workout." },
    { code: "E12", peek: { expr: "confused", side: "left" },
      motion: { title: "Members asked", accent: "asked", items: ["Use our best days?", "Weekend covers weekdays?"] },
      vo: "So members asked us: can we make the best use of our best days? Can my weekend cover for my weekdays?" },

    // 2 · How it works: the Power card screen, name first, then the card is ringed and tapped
    { code: "S2", title: "The Booster Card", accent: "Booster Card", titleFirst: true, peek: { expr: "excited", side: "right" },
      screen: shot("05", { taps: [{ x: 127, y: 738, atWord: "Pick" }] }),
      anno: { kind: "ring", target: { x: 127, y: 738, w: 214, h: 198, r: 26 }, atWord: "apply" },
      vo: "So we built the Booster Card. You can apply it on any past day. Pick your best one." },
    // zoom, then circle: 15,000 → 30,000
    { code: "S2", title: "Doubles counted steps", accent: "Doubles", peek: { expr: "smile", side: "left" }, screen: shot("06"),
      zoom: { x: 288, y: 415, scale: 1.5, atWord: "15,000" },
      anno: { kind: "ring", target: { x: 430, y: 415, w: 240, h: 158, r: 20 }, atWord: "doubles" },
      vo: "The contest counts up to 15,000 steps a day. Booster doubles those counted steps." },
    // a sum (counted + boost = total): the C5 bar, held ~10 s; the headline lands with the total
    { code: "C5", title: "Adds 15,000 steps", accent: "15,000", peek: { expr: "excited", side: "right" }, minSec: 10, titleAtWord: "another",
      bar: { label: "Did 18,000", base: 15000, add: 15000, baseLabel: "counted steps", addLabel: "Booster bonus", atWords: ["15,000 count", "Booster adds", "another"] },
      vo: "Did 18,000 steps? 15,000 count, and Booster adds another 15,000." },
    { code: "E12", peek: { expr: "determined", side: "left" },
      motion: { title: "Only your deficit", accent: "deficit", items: ["Deficit: 10,000", "Booster adds 10,000"] },
      vo: "But it only covers what you're behind. If your deficit is 10,000 steps, Booster adds 10,000 steps." },

    // 3 · When to save it
    { code: "C3", title: "Save it till it counts", accent: "counts", peek: { expr: "wink", side: "left" },
      compare: {
        left: { title: "No or small deficit", result: "Save your Booster", atWord: "No deficit" },
        right: { title: "15,000+ steps day", result: "Full boost", atWord: "Any day" },
      },
      vo: "No deficit, or a very small one? Save your Booster for when it counts. Any day with 15,000 steps or more gives you the full boost." },
    { code: "S2", title: "Days ahead? Capping", accent: "Capping", peek: { expr: "thinking", side: "right" }, screen: shot("11"),
      zoom: { x: 288, y: 330, scale: 1.4, atWord: "past" },
      anno: { kind: "ring", target: { x: 267, y: 245, w: 520, h: 84, r: 14 }, atWord: "days ahead" },
      vo: "And it's for past days only. For days ahead, there's Capping." },

    // 4 · Close: big days and normal days (tall humps on "park", low ones on "normal"), then the takeaway
    { code: "E14", peek: { expr: "happy", side: "left" },
      motion: { title: "Out of the park", accent: "park", line: "", lines: ["Some days:", "out of the park"], linesAtWords: ["Some days", "out of the park"],
        heights: [0.6, 0.7, 1.4, 0.55, 0.65, 1.35, 0.6], filled: 7, growAtWords: ["park", "normal"] },
      vo: "Some days you hit it out of the park, while others are normal." },
    { code: "F2", pose: "wink", title: "Best use of best days", accent: "best days",
      vo: "Make the best use of your best days with booster cards." },
  ],
};
