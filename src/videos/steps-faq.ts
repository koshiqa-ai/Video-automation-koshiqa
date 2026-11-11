// FAQ demo: five quick questions about step sync. Every answer comes from the approved
// "How to Start Steps" storyboard (storyboards/HV-StartSteps.json); screens reuse its screenshots.
import type { HelpVideoSpec } from "./types";

const shot = (n: number, taps?: { x: number; y: number; atWord: string }[]) => ({ image: `screens/HV-StartSteps/${String(n).padStart(2, "0")}.png`, w: 576, h: 1296, taps });

export const STEPS_FAQ: HelpVideoSpec = {
  id: "HV-StepsFAQ",
  type: "faq",
  question: "Quick answers about step sync",
  lang: "en",
  slides: [
    { code: "F1", pose: "thinking", title: "Step sync questions?", accent: "questions?", vo: "Got questions about step sync? Here are five quick answers." },

    { code: "Q", title: "How long does setup take?", accent: "setup", peek: { expr: "thinking", side: "left" }, vo: "How long does setup take?" },
    { code: "A", title: "Under 2 minutes", accent: "2 minutes", sub: "And you only do it once.", pose: "happy", vo: "Less than two minutes. And it's a one-time setup." },

    { code: "Q", title: "Which Google account do I pick?", accent: "account", peek: { expr: "confused", side: "right" }, vo: "Which Google account should I pick?" },
    { code: "A", title: "The same one", accent: "same", sub: "Use one account in Google Fit and in Koshiqa.", pose: "determined", vo: "The same one in Google Fit and in Koshiqa. If they don't match, Google Fit shows your steps, but Koshiqa won't." },

    { code: "Q", title: "Why aren't my steps counting?", accent: "counting?", peek: { expr: "worried", side: "left" }, vo: "Why aren't my steps counting?" },
    { code: "S2", title: "Turn on tracking", accent: "tracking", peek: { expr: "worried", side: "left" }, screen: shot(9, [{ x: 470, y: 1216, atWord: "on in" }]), vo: "Check that Activity Tracking is on in Google Fit. Without it, your walks aren't counted." },

    { code: "Q", title: "Where's my connected account?", accent: "account?", peek: { expr: "thinking", side: "right" }, vo: "Where can I see which account is connected?" },
    { code: "S2", title: "Right on Home", accent: "Home", screen: shot(16), anno: { kind: "ring", target: { x: 293, y: 1066, w: 520, h: 110, r: 24 }, atWord: "home screen" }, vo: "Right on your home screen. You can change it there, or in your account settings." },

    { code: "Q", title: "Do I open Google Fit daily?", accent: "daily?", peek: { expr: "surprised", side: "left" }, vo: "Do I need to open Google Fit every day?" },
    { code: "A", title: "Nope!", accent: "Nope!", sub: "Keep your phone with you. Steps sync on their own.", pose: "wink", vo: "Nope. Just keep your phone with you, and Koshiqa takes care of the rest." },

    { code: "F2", pose: "excited", title: "Happy walking!", accent: "walking!", vo: "That's it. Happy walking!" },
  ],
};
