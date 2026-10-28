// Registry of help videos. Add one import + one entry per video; Root.tsx registers them all.
import { JOIN_CONTEST } from "./join-contest";
import type { HelpVideoSpec } from "./types";

export const VIDEOS: HelpVideoSpec[] = [JOIN_CONTEST];
export const findVideo = (id: string) => VIDEOS.find((v) => v.id === id);
