// A help video = an ordered list of slides, each one a layout code from design.md.
// Pure data (no React) so Node scripts can read it too.
import type { AnnoKind, FlatPose, PeekExpr, PeekSide, Screen } from "../data/layout-system";
import type { MotionCode, MotionContent } from "../explainer/motion-data";

/** a coded mockup (`{ comp }`, see SCREENS.md) or a real screenshot (`{ image, w, h }`, taps in image px) */
export type { Screen };
export type LayoutCode =
  | "S1" | "S2" | "S3" | "S4" | "F1" | "F2" | "P1" | "P2" | "T1" | "T2" // all video types
  | "Q" | "A" // FAQ: question card, answer card (an answer with a screen uses S2)
  | "C1" | "C2" | "C3" | "C4" // explainer: big number, trio, compare, flow
  | MotionCode; // explainer motion scenes E1–E14 (design.md §11, src/explainer/motion-data.ts)

export type VideoSlide = {
  /** layout from design.md §3 */
  code: LayoutCode;
  /** the voiceover line for this slide (one or two sentences) */
  vo?: string;
  /** minimum length in seconds; the slide also grows to fit its voiceover */
  minSec?: number;
  /** headline (S2–S4), full-Torty text (F1/F2) or list heading (P1/P2/T1) */
  title?: string;
  accent?: string;
  /** corner peek; required on P/T slides, optional on S slides, not allowed on F slides */
  peek?: { expr: PeekExpr; side: PeekSide };
  /** F1/F2 only */
  pose?: FlatPose;
  /** S1–S4, T2: a mockup `{ comp, taps }` or a screenshot `{ image: "screens/<id>/NN.png", w, h, taps }` (image px) */
  screen?: Screen;
  /** one annotation per slide (K1–K3 come from `screen.taps`; these are K4–K8). On screenshots, target is in image px. */
  anno?: { kind: Exclude<AnnoKind, "tap" | "hold" | "swipe">; target?: { x: number; y: number; w: number; h: number; r?: number }; label?: string; at?: number; /** show it when this word is spoken */ atWord?: string };
  /** P1/P2/T1: the points; `times` default to 0.6 s apart from 0.6 s */
  items?: { text: string; icon?: string; image?: string; atWord?: string }[];
  times?: number[];
  /** T2: which step is current (0-based); labels come from the video's `steps` */
  step?: number;
  /** A: the supporting line under the verdict (`title`), up to 12 words */
  sub?: string;
  /** C1: the number; `title` becomes the small eyebrow above it */
  number?: { value: number; decimals?: number; prefix?: string; unit?: string; label: string };
  /** C2 (3 things) / C4 (3 stages): `items` with `icon` or `image`; `atWord` syncs each one to the voiceover */
  /** E1–E14: the scene's content (see MotionContent); anything left out uses the reel's example. E9/E13 also use `screen`. */
  motion?: { [K in MotionCode]: Partial<MotionContent[K]> }[MotionCode];
  /** C3: wrong way (left) vs right way (right); each card appears at its atWord */
  compare?: { left: { title: string; result: string; atWord?: string }; right: { title: string; result: string; atWord?: string } };
};

export type VideoType = "walkthrough" | "faq" | "explainer";

export type HelpVideoSpec = {
  /** walkthrough (default): how to do a task · faq: 5–6 quick Q&As · explainer: what a feature is and why it matters */
  type?: VideoType;
  /** composition id, e.g. "HV-JoinContest" */
  id: string;
  /** the question the video answers */
  question: string;
  lang: "en" | "hi";
  /** step labels shared by T1 and every T2 (2–3 words each) */
  steps?: string[];
  slides: VideoSlide[];
  /** background music under the whole video (design.md §8); default the house bed, null = none */
  music?: string | null;
};
