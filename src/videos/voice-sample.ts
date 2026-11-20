// Voice comparison (2026-11-17): the same two Video 1 slides ("Built with feedback" + the start of the member's
// message) voiced by three ElevenLabs voices the team sent as samples. Option 1 Mona, 2 Riya Rao, 3 Tara.
// Audio: public/vo/HV-VoiceSample-N/01–02.wav (each sample split at its pause, levelled to −16 LUFS).
// Joined with 2 s "Option N" cards by scripts/voice-sample-reel.sh → out/voice-sample.mp4.
import type { HelpVideoSpec, VideoSlide } from "./types";
import { REST_CARD } from "./rest-card";

// found by kind, not position (Video 1 gained section cards on 2026-11-20)
const feedback = REST_CARD.slides.find((s) => s.code === "E7")!;
const chat = REST_CARD.slides.find((s) => !!s.screen && "chat" in s.screen)!;
const chatScreen = chat.screen as { chat: { messages: { from: "member" | "koshiqa"; text: string }[] } & Record<string, unknown> };

const slides = (built: string): VideoSlide[] => [
  { ...feedback, vo: `At Koshiqa, we ${built} our product with feedback from members like you.` },
  { ...chat, minSec: undefined,
    screen: { chat: { ...chatScreen.chat, messages: [{ ...chatScreen.chat.messages[0], atWord: "sent us a message" }], typing: undefined } } as VideoSlide["screen"],
    vo: "One day, a woman from our community sent us a message that really stayed with us." },
];

const sample = (n: number, built = "build"): HelpVideoSpec => ({ id: `HV-VoiceSample-${n}`, type: "explainer", question: `Voice option ${n}`, lang: "en", slides: slides(built) });

// Riya Rao's take says "built"; the line text only drives word timing
export const VOICE_SAMPLES = [sample(1), sample(2, "built"), sample(3)];
