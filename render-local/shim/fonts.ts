// Stand-in for @remotion/fonts
export const loadFont = async (o: { family: string; url: string; weight?: string; style?: string }) => {
  const ff = new FontFace(o.family, `url(${o.url})`, { weight: o.weight ?? "400", style: o.style ?? "normal" });
  await ff.load();
  (document as any).fonts.add(ff);
};
