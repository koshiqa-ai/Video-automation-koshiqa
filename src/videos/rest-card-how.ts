// Video 3 · Walkthrough: "How to use your Rest Card"
// Objective (team, 2026-11-25): a clear step-by-step app walkthrough.
// Script: from the team, voiceover kept word for word, except "Step 5" → "Step 4" (the script had no Step 4; storyboard
// flag, approved with "continue"). "Step 1. Head to Power Cards and select your Rest Card." is split over two screens.
// Screens: IMG_7241 (contest page 0:08, Rest Card top 0:35, Potential impact 0:48, "Applying your card" sheet 1:01),
// Video 2's low-benefit (IMG_7240) and no-benefit (IMG_7239) screens, and Video 1's coded mockups for the Power card and
// the calendar (the recording's calendar has a dark top and every day at 15,000).
// Screenshot coordinates are image px (576 × 1248); mockup coordinates are screen space (390 × 844).
import type { HelpVideoSpec } from "./types";

const shot = (n: string, extra: object = {}) => ({ image: `screens/HV-RestCardHowTo/${n}.png`, w: 576, h: 1248, ...extra });
const DAY22M = { x: 146, y: 416, w: 84, h: 92, r: 12 };

export const REST_CARD_HOW: HelpVideoSpec = {
  id: "HV-RestCardHowTo",
  type: "walkthrough",
  question: "How do I use my Rest Card?",
  lang: "en",
  slides: [
    // Hook: F1 intro, the headline follows the voice; a Day 22 card lifts 4,200 → 10,000 on "boost"
    { code: "F1", pose: "happy", title: "Have a Rest Card?", accent: "Rest Card?",
      intro: {
        steps: [
          { title: "Have a Rest Card?", accent: "Rest Card?" },
          { title: "How to use it", accent: "use it", pose: "smile", atWord: "show you" },
          { title: "Boost your lowest day", accent: "Boost", pose: "excited", atWord: "give your" },
        ],
        lift: { day: 22, base: 4200, target: 10000, atWord: "give your", liftAtWord: "boost" },
      },
      vo: "Hey! Have a Rest Card? Let me show you how to use it and give your lowest-step day a boost!" },

    // Step 1 · Find your card (one sentence, two screens)
    { code: "S2", title: "Open Power cards", accent: "Power cards", peek: { expr: "smile", side: "left" },
      screen: shot("01", { taps: [{ x: 397, y: 1136, atWord: "Power Cards" }] }),
      vo: "Step 1. Head to Power Cards" },
    { code: "S2", title: "Select your Rest Card", accent: "Rest Card", peek: { expr: "happy", side: "right" },
      screen: { comp: "power-card", taps: [{ x: 105, y: 270, atWord: "select" }] },
      vo: "and select your Rest Card." },

    // Step 2 · Check the impact: zoom in on the rows, then spotlight them
    // no peek: after the zoom the spotlit rows span both bottom corners (QA)
    { code: "S2", title: "Check your impact", accent: "impact", screen: shot("03"),
      zoom: { x: 288, y: 880, scale: 1.35, atWord: "potential impact" },
      anno: { kind: "spotlight", target: { x: 288, y: 893, w: 540, h: 376, r: 16 }, atWord: "step count" },
      vo: "Step 2. Check your potential impact. I'll show you how your step count, contest deficit and club placement could change after applying the card." },

    // Step 3 · Apply it (no peek: the button spans both bottom corners)
    { code: "S2", title: "Tap Apply Rest Card", accent: "Apply",
      screen: shot("04", { taps: [{ x: 288, y: 1142, atWord: "Tap Apply" }] }),
      anno: { kind: "ring", target: { x: 429, y: 326, w: 240, h: 134, r: 14 }, atWord: "impact" },
      vo: "Step 3. Happy with the impact? Tap Apply Rest Card." },

    // If the benefit is low / none: Video 2's screens (same frames, copied here)
    { code: "S2", title: "Low benefit? Choose", accent: "Choose", peek: { expr: "thinking", side: "left" }, screen: shot("05"),
      zoom: { x: 288, y: 544, scale: 1.5, atWord: "meaningful" },
      anno: { kind: "ring", target: { x: 288, y: 544, w: 528, h: 138, r: 14 }, atWord: "let you know" },
      vo: "Before applying, I'll check whether this card will make a meaningful difference to your progress. If the benefit is low, I'll let you know, and you can choose whether to apply it or save it for later." },
    { code: "S2", title: "No benefit? Save it", accent: "Save it",
      screen: shot("06", { taps: [{ x: 288, y: 1140, atWord: "save your card" }] }),
      anno: { kind: "ring", target: { x: 288, y: 518, w: 528, h: 86, r: 14 }, atWord: "no benefit" }, // ring, not spotlight: a spotlight would dim the tapped button
      vo: "If there's no benefit, you can save your card for another time." },

    // Step 4 · I'll find the day: S3 close-up on the "Applying your card" sheet
    { code: "S3", title: "Found for you", accent: "for you", peek: { expr: "smile", side: "right" }, screen: shot("07"),
      anno: { kind: "ring", target: { x: 288, y: 955, w: 320, h: 330, r: 30 }, atWord: "lowest eligible" },
      vo: "Step 4. If you proceed, I'll automatically scan your contest history, find your lowest eligible step day and apply the card to it. You don't have to search for or select the day yourself!" },

    // Done: Video 1's calendar mockup, zoom on day 22, ring, then it lifts to 10,000 with confetti
    { code: "S2", title: "Lowest day boosted", accent: "boosted", peek: { expr: "excited", side: "right" },
      screen: { comp: "rest-calendar", props: { liftAtWord: "boost", confetti: true } },
      zoom: { x: 146, y: 416, scale: 1.5, atWord: "lowest day" },
      anno: { kind: "ring", target: DAY22M, atWord: "lowest day" },
      vo: "And that's it! Your lowest day gets a boost, your total contest steps increase and your deficit comes down. Easy, right?" },

    { code: "F2", pose: "excited", title: "Keep building consistency", accent: "consistency",
      vo: "Now get back out there and keep building that consistency. I'll be right here cheering you on!" },
  ],
};
