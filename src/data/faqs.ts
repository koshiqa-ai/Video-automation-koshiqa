// FAQ scripts for the Visual Style v1 exploration.
// Each FAQ = hook (question) → 3 steps on a phone mockup → outro.
// Tap coordinates are in phone-screen logical pixels (390 × 844).
// `at` is seconds from the start of the scene.
// NOTE: flows and copy are placeholders until the real app recordings
// and Mrinal's scripts replace them.

import type { ThemeKey } from "../theme/themes";

export type TortyMood = "sad" | "surprised" | "happy" | "happy2";

export type Gesture = {
  x: number;
  y: number;
  at: number;
  kind?: "tap" | "swipe-down" | "hold";
};

export type Scene = {
  id: string;
  kind: "hook" | "step" | "outro";
  /** Spoken line (placeholder TTS) and the base for the caption */
  vo: string;
  /** Short on-screen headline */
  title: string;
  /** Word in the title to accent with the theme highlight */
  accent?: string;
  screen?: string;
  gestures?: Gesture[];
  torty?: TortyMood;
  minSec?: number;
};

export type Faq = {
  id: string;
  question: string;
  theme: ThemeKey;
  scenes: Scene[];
};

export const FAQS: Faq[] = [
  {
    id: "FAQ1-StepsNotSyncing",
    question: "Why aren't my steps syncing?",
    theme: "volt",
    scenes: [
      {
        id: "hook",
        kind: "hook",
        vo: "Walked all day, but your steps aren't showing up on Koshiqa? Let's fix that.",
        title: "Why aren't my steps syncing?",
        accent: "steps",
        torty: "sad",
      },
      {
        id: "s1",
        kind: "step",
        vo: "First, open Health Connect, and allow Koshiqa to read your steps.",
        title: "Allow step access",
        accent: "step",
        screen: "health-permissions",
        gestures: [{ x: 336, y: 318, at: 2.4 }],
      },
      {
        id: "s2",
        kind: "step",
        vo: "Next, set Koshiqa's battery usage to unrestricted, so it keeps syncing in the background.",
        title: "Turn off battery saver",
        accent: "battery",
        screen: "battery",
        gestures: [{ x: 190, y: 286, at: 2.6 }],
      },
      {
        id: "s3",
        kind: "step",
        vo: "Now open Koshiqa, and pull down on the home screen to refresh.",
        title: "Pull down to refresh",
        accent: "refresh",
        screen: "home-sync",
        gestures: [{ x: 195, y: 210, at: 2.0, kind: "swipe-down" }],
      },
      {
        id: "outro",
        kind: "outro",
        vo: "And there they are. Every single step, counted!",
        title: "Every step, counted!",
        accent: "counted!",
        torty: "happy",
      },
    ],
  },
  {
    id: "FAQ2-JoinContest",
    question: "How do I join a contest?",
    theme: "blush",
    scenes: [
      {
        id: "hook",
        kind: "hook",
        vo: "Want to join a Koshiqa step contest, but not sure where to start?",
        title: "How do I join a contest?",
        accent: "contest?",
        torty: "surprised",
      },
      {
        id: "s1",
        kind: "step",
        vo: "Tap the Contests tab at the bottom of your home screen.",
        title: "Open Contests",
        accent: "Contests",
        screen: "home-tabbar",
        gestures: [{ x: 146, y: 796, at: 2.2 }],
      },
      {
        id: "s2",
        kind: "step",
        vo: "Pick a contest you like, and check its step goal and dates.",
        title: "Pick a contest",
        accent: "contest",
        screen: "contest-list",
        gestures: [{ x: 195, y: 300, at: 2.4 }],
      },
      {
        id: "s3",
        kind: "step",
        vo: "Tap Join Contest, then confirm. That's it, you're in!",
        title: "Tap Join & confirm",
        accent: "Join",
        screen: "contest-detail",
        gestures: [
          { x: 195, y: 772, at: 1.4 },
          { x: 195, y: 772, at: 2.8 },
        ],
      },
      {
        id: "outro",
        kind: "outro",
        vo: "Hit the goal, and earn a medal, a tree, and Koshiqa koins!",
        title: "Walk. Win. Grow.",
        accent: "Win.",
        torty: "happy2",
      },
    ],
  },
  {
    id: "FAQ3-CorporateLogin",
    question: "How do I log in with my work account?",
    theme: "aurora",
    scenes: [
      {
        id: "hook",
        kind: "hook",
        vo: "Your company is on Koshiqa. So, how do you log in?",
        title: "How do I log in with my work account?",
        accent: "work",
        torty: "surprised",
      },
      {
        id: "s1",
        kind: "step",
        vo: "Open the app, and tap Continue with work account.",
        title: "Choose work account",
        accent: "work",
        screen: "welcome",
        gestures: [{ x: 195, y: 606, at: 2.2 }],
      },
      {
        id: "s2",
        kind: "step",
        vo: "Enter your official email ID, or your employee ID, and tap Next.",
        title: "Enter email or employee ID",
        accent: "employee ID",
        screen: "corp-login",
        gestures: [
          { x: 190, y: 250, at: 0.9 },
          { x: 318, y: 334, at: 3.6 },
        ],
        minSec: 5.6,
      },
      {
        id: "s3",
        kind: "step",
        vo: "Type the OTP sent to your work email, and tap Verify.",
        title: "Verify with OTP",
        accent: "OTP",
        screen: "otp",
        gestures: [{ x: 195, y: 452, at: 3.0 }],
      },
      {
        id: "outro",
        kind: "outro",
        vo: "You're in! Your company's challenges are waiting.",
        title: "You're in!",
        accent: "in!",
        torty: "happy",
      },
    ],
  },
  {
    id: "FAQ4-RedeemKoins",
    question: "How do I redeem my Koshiqa koins?",
    theme: "mint",
    scenes: [
      {
        id: "hook",
        kind: "hook",
        vo: "Earned a pile of Koshiqa koins? Here's how to spend them.",
        title: "How do I redeem my koins?",
        accent: "koins?",
        torty: "surprised",
      },
      {
        id: "s1",
        kind: "step",
        vo: "Tap your koin balance at the top of the home screen.",
        title: "Tap your balance",
        accent: "balance",
        screen: "koins-1",
        gestures: [{ x: 318, y: 82, at: 2.0 }],
      },
      {
        id: "s2",
        kind: "step",
        vo: "Browse the rewards store, and pick something you love.",
        title: "Pick a reward",
        accent: "reward",
        screen: "koins-2",
        gestures: [{ x: 104, y: 330, at: 2.2 }],
      },
      {
        id: "s3",
        kind: "step",
        vo: "Tap Redeem. Your koins are used instantly, and your code is ready.",
        title: "Redeem instantly",
        accent: "instantly",
        screen: "koins-3",
        gestures: [{ x: 195, y: 772, at: 1.8 }],
      },
      {
        id: "outro",
        kind: "outro",
        vo: "Find your code anytime under My Rewards. Enjoy!",
        title: "Enjoy your reward!",
        accent: "reward!",
        torty: "happy2",
      },
    ],
  },
  {
    id: "FAQ5-MedalDelivery",
    question: "When will my medal arrive?",
    theme: "sky",
    scenes: [
      {
        id: "hook",
        kind: "hook",
        vo: "Finished a contest, and still waiting for your medal?",
        title: "When will my medal arrive?",
        accent: "medal",
        torty: "sad",
      },
      {
        id: "s1",
        kind: "step",
        vo: "Go to My Contests, and open the contest you completed.",
        title: "Open your contest",
        accent: "contest",
        screen: "my-contests",
        gestures: [{ x: 195, y: 262, at: 2.2 }],
      },
      {
        id: "s2",
        kind: "step",
        vo: "Check that your delivery address is correct. Tap Edit to update it.",
        title: "Confirm your address",
        accent: "address",
        screen: "address",
        gestures: [
          { x: 330, y: 250, at: 1.8 },
          { x: 195, y: 560, at: 3.6 },
        ],
      },
      {
        id: "s3",
        kind: "step",
        vo: "Then tap Track Medal to see exactly where it is.",
        title: "Track your medal",
        accent: "Track",
        screen: "track",
        gestures: [{ x: 195, y: 236, at: 1.6 }],
      },
      {
        id: "outro",
        kind: "outro",
        vo: "Your medal is on its way. And a tree has been planted in your name!",
        title: "On its way!",
        accent: "way!",
        torty: "happy",
      },
    ],
  },
];
