// Explainer demo: how steps get from your phone into Koshiqa. Facts from the approved
// "How to Start Steps" storyboard. Concept scenes (C1–C4) and motion scenes (E1–E14) for the why,
// one real screen for the how.
import type { HelpVideoSpec } from "./types";

export const HOW_STEPS_SYNC: HelpVideoSpec = {
  id: "HV-HowStepsSync",
  type: "explainer",
  question: "How do my steps get into Koshiqa?",
  lang: "en",
  slides: [
    { code: "F1", pose: "thinking", title: "Where do steps come from?", accent: "steps", vo: "Ever wondered how your steps get into Koshiqa?" },
    {
      code: "C4", title: "How it flows", accent: "flows", peek: { expr: "smile", side: "right" },
      items: [
        { text: "Your phone counts", icon: "phone", atWord: "phone" },
        { text: "Google Fit stores", icon: "heart", atWord: "Google Fit" },
        { text: "Koshiqa shows", image: "brand/logo-app.jpg", atWord: "Koshiqa picks" },
      ],
      vo: "Your phone counts every step. Google Fit stores them. And Koshiqa picks them up for your contests.",
    },
    {
      code: "E12", peek: { expr: "determined", side: "right" },
      motion: { title: "Three must-haves", accent: "must-haves", items: ["Activity tracking on", "Same Google account", "Phone with you"] },
      vo: "For this to work, you need three things: activity tracking on, the same Google account, and your phone with you.",
    },
    {
      code: "C3", title: "Accounts must match", accent: "match", peek: { expr: "worried", side: "left" },
      compare: { left: { title: "Different accounts", result: "Koshiqa won't see steps", atWord: "don't match" }, right: { title: "Same account", result: "Steps sync", atWord: "Same account" } },
      vo: "If the accounts don't match, Google Fit shows your steps, but Koshiqa won't. Same account, and everything syncs.",
    },
    {
      code: "S2", title: "Pick the same one", accent: "same", peek: { expr: "worried", side: "right" },
      screen: { image: "screens/HV-StartSteps/14.png", w: 576, h: 1296, taps: [{ x: 288, y: 384, atWord: "choose" }] },
      vo: "So when Koshiqa asks, choose the same account you used in Google Fit.",
    },
    {
      code: "E9", screen: { image: "screens/HV-StartSteps/16.png", w: 576, h: 1296 },
      motion: { caption: "Your connected account" },
      vo: "You can always see which account is connected, right on your home screen.",
    },
    { code: "C1", title: "One-time setup", number: { value: 2, unit: "min", label: "or less, and only once" }, peek: { expr: "happy", side: "right" }, vo: "Setup takes less than two minutes, and you only do it once." },
    {
      code: "E7", peek: { expr: "wink", side: "left" },
      motion: { line1: "After that, just walk.", line2: "Koshiqa does the rest" },
      vo: "After that, just keep walking. Koshiqa does the rest.",
    },
  ],
};
