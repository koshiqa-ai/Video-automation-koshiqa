// Registry of help videos. Add one import + one entry per video; Root.tsx registers them all.
import { JOIN_CONTEST } from "./join-contest";
import { START_STEPS } from "./start-steps";
import { STEPS_FAQ } from "./steps-faq";
import { HOW_STEPS_SYNC } from "./how-steps-sync";
import type { HelpVideoSpec } from "./types";

export const VIDEOS: HelpVideoSpec[] = [JOIN_CONTEST, START_STEPS, STEPS_FAQ, HOW_STEPS_SYNC];
export const findVideo = (id: string) => VIDEOS.find((v) => v.id === id);
