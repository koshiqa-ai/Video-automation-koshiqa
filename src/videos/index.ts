// Registry of help videos. Add one import + one entry per video; Root.tsx registers them all.
import { JOIN_CONTEST } from "./join-contest";
import { START_STEPS } from "./start-steps";
import { STEPS_FAQ } from "./steps-faq";
import { HOW_STEPS_SYNC } from "./how-steps-sync";
import { REST_CARD } from "./rest-card";
import { REST_CARD_HI } from "./rest-card-hi";
import { REST_CARD_WHEN } from "./rest-card-when";
import { REST_CARD_HOW } from "./rest-card-how";
import { BOOSTER_CARD } from "./booster-card";
import { VOICE_SAMPLES } from "./voice-sample";
import type { HelpVideoSpec } from "./types";

export const VIDEOS: HelpVideoSpec[] = [JOIN_CONTEST, START_STEPS, STEPS_FAQ, HOW_STEPS_SYNC, REST_CARD, REST_CARD_HI, REST_CARD_WHEN, REST_CARD_HOW, BOOSTER_CARD, ...VOICE_SAMPLES];
export const findVideo = (id: string) => VIDEOS.find((v) => v.id === id);
