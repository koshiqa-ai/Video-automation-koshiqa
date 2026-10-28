import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, HookScene, OutroScene } from "./components/Scenes";
import { Stage } from "./components/Stage";
import { Caption, Chip, Headline } from "./components/Text";
import type { Faq } from "./data/faqs";
import { audioCues, buildTimeline, type TimedScene } from "./data/timeline";
import { ensureFonts } from "./theme/fonts";
import { THEMES, type Theme } from "./theme/themes";

ensureFonts();

const fit = (text: string, base: number, width: number, k: number) => Math.min(base, Math.floor(width / (text.length * k)));

const StepText: React.FC<{ scene: TimedScene; index: number; total: number; theme: Theme }> = ({ scene, index, total, theme }) => {
  const f = useCurrentFrame();
  const voFrom = scene.voFrom - scene.from;
  const exitAt = scene.duration - 8;
  const label = `Step ${index + 1} of ${total}`;
  const L = theme.layout;
  const bottom = L === "card" || L === "phone-top";
  const center = L === "card" || L === "dual";
  const size =
    L === "card" ? fit(scene.title, 88, 920, 0.6)
    : L === "phone-top" ? fit(scene.title, 96, 920, 0.52)
    : L === "dual" ? fit(scene.title, 84, 940, 0.66)
    : theme.headlineSize;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: bottom ? 1522 : 112,
          display: "flex",
          flexDirection: "column",
          alignItems: center ? "center" : "flex-start",
          gap: bottom ? 20 : 26,
          opacity: f > exitAt + 8 ? 0 : 1,
        }}
      >
        <div style={{ alignSelf: center ? "center" : "flex-start" }}>
          <Chip theme={theme}>{label}</Chip>
        </div>
        <Headline text={scene.title} accent={scene.accent} theme={theme} size={size} align={center ? "center" : "left"} delay={4} exitAt={exitAt} />
        <Caption
          text={scene.vo}
          theme={theme}
          voFrom={voFrom}
          voSec={scene.voSec}
          size={bottom || L === "dual" ? 38 : 42}
          align={center ? "center" : "left"}
          color={theme.subText}
          exitAt={exitAt}
          maxWidth={L === "tilted" ? 860 : 920}
        />
      </div>
    </AbsoluteFill>
  );
};

export const FaqVideo: React.FC<{ faq: Faq }> = ({ faq }) => {
  const theme = THEMES[faq.theme];
  const { scenes } = buildTimeline(faq);
  const steps = scenes.filter((s) => s.kind === "step");
  const outro = scenes.find((s) => s.kind === "outro")!;
  const stageFrom = steps[0].from;
  return (
    <AbsoluteFill style={{ fontFamily: theme.bodyFont }}>
      <Background theme={theme} />
      <Sequence from={stageFrom} durationInFrames={outro.from - stageFrom} name="Phone stage">
        <Stage steps={steps} stageFrom={stageFrom} duration={outro.from - stageFrom} theme={theme} />
      </Sequence>
      {scenes.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={`${s.kind}: ${s.title}`}>
          {s.kind === "hook" && <HookScene scene={s} theme={theme} />}
          {s.kind === "step" && <StepText scene={s} index={steps.indexOf(s)} total={steps.length} theme={theme} />}
          {s.kind === "outro" && <OutroScene scene={s} theme={theme} />}
        </Sequence>
      ))}
      {audioCues(faq).map((c, i) => (
        <Sequence key={`a${i}`} from={c.frame} layout="none" name={c.src}>
          <Audio src={staticFile(c.src)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
