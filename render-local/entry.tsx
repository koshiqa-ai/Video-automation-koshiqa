// Local preview harness: mounts a composition and exposes setFrame(n) for the renderer.
import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { __ConfigProvider, __FrameProvider } from "remotion";
import { FaqVideo } from "../src/FaqVideo";
import { FaqVideoHindi } from "../src/FaqVideoHindi";
import { TortyShowcase } from "../src/TortyShowcase";
import { LayoutDemo } from "../src/LayoutDemo";
import { LayoutCatalogue } from "../src/LayoutCatalogue";
import { ExplainerDemo } from "../src/ExplainerDemo";
import { AnnotationKit, LayoutCatalogueV3 } from "../src/LayoutsV3";
import { PointerLayouts } from "../src/PointerLayouts";
import { LayoutSystem } from "../src/LayoutSystem";
import { HelpVideo } from "../src/HelpVideo";
import { findVideo } from "../src/videos";
import { buildHelpVideo } from "../src/videos/build";
import { lsDuration } from "../src/data/layout-system";
import { pointerDuration } from "../src/data/pointer-layouts";
import { kitDuration, v3Duration } from "../src/data/layouts-v3";
import { buildSaasTimeline, SAAS } from "../src/data/faq-saas";
import { catalogueDuration } from "../src/data/layout-catalogue";
import { buildLayoutTimeline, LAYOUT_DEMO } from "../src/data/faq-layouts";
import { buildHindiTimeline, HI_ID } from "../src/data/faq-hi";
import { FAQS } from "../src/data/faqs";
import { buildTimeline, FPS, HEIGHT, WIDTH } from "../src/data/timeline";

const id = new URLSearchParams(location.search).get("id")!;
const isHi = id === HI_ID;
const isSheet = id === "TortyShowcase";
const isLayout = id === LAYOUT_DEMO.id;
const isCat = id === "LayoutCatalogue";
const isSaas = id === SAAS.id;
const isV3 = id === "LayoutCatalogueV3";
const isKit = id === "AnnotationKit";
const isPtr = id === "PointerLayouts";
const isLS = id === "LayoutSystem";
const hv = findVideo(id);
const faq = FAQS.find((f) => f.id === id)!;
const durationInFrames = hv ? buildHelpVideo(hv).durationInFrames : isLS ? lsDuration() : isPtr ? pointerDuration() : isV3 ? v3Duration() : isKit ? kitDuration() : isSaas ? buildSaasTimeline().durationInFrames : isCat ? catalogueDuration() : isLayout ? buildLayoutTimeline().durationInFrames : isSheet ? 180 : isHi ? buildHindiTimeline().durationInFrames : buildTimeline(faq).durationInFrames;
const root = createRoot(document.getElementById("root")!);

const App: React.FC<{ frame: number }> = ({ frame }) => (
  <__ConfigProvider value={{ fps: FPS, width: WIDTH, height: HEIGHT, durationInFrames, id }}>
    <__FrameProvider value={frame}>
      {hv ? <HelpVideo spec={hv} codeTags={new URLSearchParams(location.search).get("tags") === "1"} /> : isLS ? <LayoutSystem /> : isPtr ? <PointerLayouts /> : isV3 ? <LayoutCatalogueV3 /> : isKit ? <AnnotationKit /> : isSaas ? <ExplainerDemo /> : isCat ? <LayoutCatalogue /> : isLayout ? <LayoutDemo /> : isSheet ? <TortyShowcase /> : isHi ? <FaqVideoHindi /> : <FaqVideo faq={faq} />}
    </__FrameProvider>
  </__ConfigProvider>
);

const imagesReady = () =>
  Promise.all(
    Array.from(document.images).map((img) =>
      img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = () => r(null); }),
    ),
  );

(window as any).__duration = durationInFrames;
(window as any).setFrame = async (n: number) => {
  flushSync(() => root.render(<App frame={n} />));
  await (document as any).fonts.ready;
  await imagesReady();
  while ((globalThis as any).__pendingRenders() > 0) await new Promise((r) => setTimeout(r, 20));
  return true;
};
