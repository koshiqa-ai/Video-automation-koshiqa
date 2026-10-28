// A help video = an ordered list of slides, each one a layout code from design.md.
// Pure data (no React) so Node scripts can read it too.
import type { AnnoKind, FlatPose, PeekExpr, PeekSide } from "../data/layout-system";
import type { TimedLayoutScene } from "../data/faq-layouts";

export type Screen = NonNullable<TimedLayoutScene["screen"]>;
export type LayoutCode = "S1" | "S2" | "S3" | "S4" | "F1" | "F2" | "P1" | "P2" | "T1" | "T2";

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
  /** S1–S4, T2 */
  screen?: Screen;
  /** one annotation per slide (K1–K3 come from `screen.taps`; these are K4–K8) */
  anno?: { kind: Exclude<AnnoKind, "tap" | "hold" | "swipe">; target?: { x: number; y: number; w: number; h: number; r?: number }; label?: string; at?: number };
  /** P1/P2/T1: the points; `times` default to 0.6 s apart from 0.6 s */
  items?: { text: string; icon?: string }[];
  times?: number[];
  /** T2: which step is current (0-based); labels come from the video's `steps` */
  step?: number;
};

export type HelpVideoSpec = {
  /** composition id, e.g. "HV-JoinContest" */
  id: string;
  /** the question the video answers */
  question: string;
  lang: "en" | "hi";
  /** step labels shared by T1 and every T2 (2–3 words each) */
  steps?: string[];
  slides: VideoSlide[];
};
