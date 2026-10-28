// Renders any HelpVideoSpec using the approved layout system (design.md v1.0).
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { GREEN } from "./LayoutDemo";
import { LSSlideView, Settle, ShowCodeTags } from "./LayoutSystem";
import { buildHelpVideo } from "./videos/build";
import type { HelpVideoSpec } from "./videos/types";

export const HelpVideo: React.FC<{ spec: HelpVideoSpec; codeTags?: boolean }> = ({ spec, codeTags = false }) => {
  const { slides, cues, voCues } = buildHelpVideo(spec);
  return (
    <ShowCodeTags.Provider value={codeTags}>
      <AbsoluteFill style={{ background: GREEN.bg }}>
        {slides.map((s, i) => (
          <Sequence key={i} from={s.from} durationInFrames={s.duration} name={`${i + 1} ${s.code}`}>
            <Settle><LSSlideView s={s} /></Settle>
          </Sequence>
        ))}
        {[...voCues, ...cues].map((c, i) => (
          <Sequence key={`a${i}`} from={c.frame} layout="none" name={c.src}>
            <Audio src={staticFile(c.src)} volume={c.volume} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </ShowCodeTags.Provider>
  );
};
