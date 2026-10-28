import React from "react";
import { Composition, Folder } from "remotion";
import { FaqVideo } from "./FaqVideo";
import { FaqVideoHindi } from "./FaqVideoHindi";
import { TortyShowcase } from "./TortyShowcase";
import { LayoutDemo } from "./LayoutDemo";
import { LayoutCatalogue } from "./LayoutCatalogue";
import { ExplainerDemo } from "./ExplainerDemo";
import { AnnotationKit, LayoutCatalogueV3 } from "./LayoutsV3";
import { PointerLayouts } from "./PointerLayouts";
import { LayoutSystem } from "./LayoutSystem";
import { HelpVideo } from "./HelpVideo";
import { VIDEOS } from "./videos";
import { buildHelpVideo } from "./videos/build";
import { lsDuration } from "./data/layout-system";
import { pointerDuration } from "./data/pointer-layouts";
import { kitDuration, v3Duration } from "./data/layouts-v3";
import { buildSaasTimeline, SAAS, SFX_PACKS } from "./data/faq-saas";
import { catalogueDuration } from "./data/layout-catalogue";
import { buildLayoutTimeline, LAYOUT_DEMO } from "./data/faq-layouts";
import { buildHindiTimeline, HI_ID } from "./data/faq-hi";
import { FAQS } from "./data/faqs";
import { FPS, HEIGHT, WIDTH, buildTimeline } from "./data/timeline";

export const RemotionRoot: React.FC = () => (
  <Folder name="FAQ-style-v1">
    {FAQS.map((faq) => (
      <Composition
        key={faq.id}
        id={faq.id}
        component={FaqVideo}
        defaultProps={{ faq }}
        durationInFrames={buildTimeline(faq).durationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
    <Composition
      id={HI_ID}
      component={FaqVideoHindi}
      durationInFrames={buildHindiTimeline().durationInFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition id={LAYOUT_DEMO.id} component={LayoutDemo} durationInFrames={buildLayoutTimeline().durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
    {SFX_PACKS.map((p) => (
      <Composition key={p} id={`${SAAS.id}-${p}`} component={ExplainerDemo} defaultProps={{ sfx: p }} durationInFrames={buildSaasTimeline().durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
    ))}
    <Composition id="LayoutCatalogue" component={LayoutCatalogue} durationInFrames={catalogueDuration()} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="LayoutCatalogueV3" component={LayoutCatalogueV3} durationInFrames={v3Duration()} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Folder name="HelpVideos">
      {VIDEOS.map((v) => (
        <Composition key={v.id} id={v.id} component={HelpVideo} defaultProps={{ spec: v, codeTags: false }} durationInFrames={buildHelpVideo(v).durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </Folder>
    <Composition id="LayoutSystem" component={LayoutSystem} durationInFrames={lsDuration()} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="PointerLayouts" component={PointerLayouts} durationInFrames={pointerDuration()} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="AnnotationKit" component={AnnotationKit} durationInFrames={kitDuration()} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="TortyShowcase" component={TortyShowcase} durationInFrames={180} fps={FPS} width={WIDTH} height={HEIGHT} />
  </Folder>
);
