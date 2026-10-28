import { loadFont } from "@remotion/fonts";
import { continueRender, delayRender, staticFile } from "remotion";

// Local font files in public/fonts (Inter, Inter Display, Poppins: OFL; TeX Gyre Adventor: GUST licence).
const FILES: { family: string; file: string; weight: string; style?: string }[] = [
  { family: "Inter", file: "Inter-Regular.otf", weight: "400" },
  { family: "Inter", file: "Inter-Medium.otf", weight: "500" },
  { family: "Inter", file: "Inter-SemiBold.otf", weight: "600" },
  { family: "Inter", file: "Inter-Bold.otf", weight: "700" },
  { family: "Inter", file: "Inter-ExtraBold.otf", weight: "800" },
  { family: "InterDisplay", file: "InterDisplay-ExtraBold.otf", weight: "800" },
  { family: "InterDisplay", file: "InterDisplay-Black.otf", weight: "900" },
  { family: "Poppins", file: "Poppins-Regular.ttf", weight: "400" },
  { family: "Poppins", file: "Poppins-Medium.ttf", weight: "500" },
  { family: "Poppins", file: "Poppins-Bold.ttf", weight: "700" },
  { family: "Adventor", file: "texgyreadventor-bold.otf", weight: "700" },
  { family: "Lora", file: "Lora-Italic-Variable.ttf", weight: "400 700", style: "italic" },
];

let started = false;
export const ensureFonts = () => {
  if (started) return;
  started = true;
  const handle = delayRender("Loading fonts");
  Promise.all(
    FILES.map((f) =>
      loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style ?? "normal" }),
    ),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
