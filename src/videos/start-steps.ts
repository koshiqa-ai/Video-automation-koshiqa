// "How to Start Steps": built from storyboards/HV-StartSteps.json (approved script, real screenshots).
// Screenshot taps and annotation targets are in image pixels (576 × 1296).
import type { HelpVideoSpec } from "./types";

const shot = (n: number, taps?: { x: number; y: number; atWord: string }[]) => ({ image: `screens/HV-StartSteps/${String(n).padStart(2, "0")}.png`, w: 576, h: 1296, taps });

export const START_STEPS: HelpVideoSpec = {
  id: "HV-StartSteps",
  question: "How do I start counting my steps?",
  lang: "en",
  slides: [
    { code: "F1", pose: "happy", title: "Connect Google Fit", accent: "Google Fit", vo: "Getting your steps on Koshiqa is simple. It takes less than two minutes. Just one time setup." },
    // Kick off
    { code: "S2", title: "Tap Start My Steps", accent: "Start", peek: { expr: "smile", side: "right" }, screen: shot(1, [{ x: 282, y: 989, atWord: "Start My Steps" }]), vo: "Just open Koshiqa and tap “Start My Steps.”" },
    { code: "S2", title: "Four things to set", accent: "Four", peek: { expr: "thinking", side: "right" }, screen: shot(2), anno: { kind: "spotlight", target: { x: 288, y: 665, w: 520, h: 120, r: 16 }, atWord: "Four" }, vo: "Here's what Google Fit will ask you for. Four quick things that you should know." },
    // Get Fit
    { code: "S2", title: "Download Google Fit", accent: "Download", peek: { expr: "happy", side: "left" }, screen: shot(3, [{ x: 256, y: 698, atWord: "Download" }]), vo: "First, Koshiqa will take you to the Play Store. Download Google Fit and open it." },
    { code: "S2", title: "Then Open", accent: "Open", peek: { expr: "wink", side: "right" }, screen: shot(4, [{ x: 416, y: 416, atWord: "open it" }]), vo: "If you already have Google Fit, it's even easier: just open it and skip ahead to connecting Koshiqa." },
    // Sign in
    { code: "S2", title: "Tap Continue", accent: "Continue", peek: { expr: "idle", side: "left" }, screen: shot(5, [{ x: 288, y: 1120, atWord: "email" }]), vo: "Just like every app, it needs an account. Google Fit would need an email id to save your steps." },
    { code: "S2", title: "Remember this one", accent: "Remember", peek: { expr: "thinking", side: "right" }, screen: shot(6, [{ x: 288, y: 410, atWord: "Choose" }]), vo: "Choose the account you want to use for your steps - and remember this account. You'll need to select the same account when you come back to Koshiqa in the end." },
    // Your profile
    { code: "S2", title: "Keep going", accent: "going", peek: { expr: "smile", side: "left" }, screen: shot(7, [{ x: 288, y: 1120, atWord: "then" }]), vo: "A quick intro, then the part that matters." },
    { code: "S2", title: "Fill all 4 fields", accent: "4 fields", peek: { expr: "happy", side: "left" }, screen: shot(8, [{ x: 474, y: 1216, atWord: "calories" }]), vo: "Gender, birthday, weight, height. Google Fit uses these to turn your movement into real distance and calories." },
    // Let it track
    { code: "S2", title: "Tap Turn on", accent: "Turn on", peek: { expr: "worried", side: "left" }, screen: shot(9, [{ x: 470, y: 1216, atWord: "turn on" }]), vo: "Next, turn on Activity Tracking. This is important - it allows Google Fit to count your steps while you carry your phone with you. If this is not on, Google Fit won't be able to count your steps during your walk or runs." },
    { code: "S2", title: "Tap Allow", accent: "Allow", peek: { expr: "excited", side: "right" }, screen: shot(10, [{ x: 288, y: 733, atWord: "Allow" }]), vo: "Allow the permission, and you're done with Google Fit." },
    // Back to Koshiqa  (beat #11 was cut in the storyboard)
    { code: "S2", title: "Connect Google fit", accent: "Connect", peek: { expr: "determined", side: "left" }, screen: shot(12, [{ x: 288, y: 1194, atWord: "tap" }]), vo: "Now come back to Koshiqa and tap “Connect Google Fit.”" },
    // Hand over access
    { code: "S2", title: "Tap Allow", accent: "Allow", peek: { expr: "happy", side: "right" }, screen: shot(13, [{ x: 288, y: 733, atWord: "Allow it" }]), vo: "Same permission, this time for Koshiqa. Allow it." },
    { code: "S2", title: "The same account", accent: "same", peek: { expr: "worried", side: "right" }, screen: shot(14, [{ x: 288, y: 384, atWord: "choose" }]), vo: "And remember — choose the same Google account you selected in Google Fit. This gets your data from Google Fit to Koshiqa. If the email Id doesn't match, your Google Fit will show steps but Koshiqa won't." },
    // Confirm
    { code: "S2", title: "Tap Okay", accent: "Okay", peek: { expr: "excited", side: "left" }, screen: shot(15, [{ x: 288, y: 1194, atWord: "it" }]), vo: "That's it." },
    { code: "S2", title: "Steps syncing", accent: "syncing", // no peek: the highlighted row spans both bottom corners
      screen: shot(16), anno: { kind: "ring", target: { x: 293, y: 1066, w: 520, h: 110, r: 24 }, atWord: "right here" }, vo: "Your steps will now start coming into Koshiqa. And if you ever want to check or change the connected account, you can see it right here and in your account settings." },
    { code: "F2", pose: "wink", title: "You're all set", accent: "all set", vo: "Now just keep your phone with you. Koshiqa will take care of the rest." },
  ],
};
