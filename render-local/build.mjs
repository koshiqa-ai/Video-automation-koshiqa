const { build } = await import(process.env.ESBUILD_PATH ?? "esbuild");
import { fileURLToPath } from "node:url";
import path from "node:path";
const here = path.dirname(fileURLToPath(import.meta.url));
await build({
  entryPoints: [path.join(here, "entry.tsx")],
  bundle: true,
  outfile: path.join(here, "dist/bundle.js"),
  format: "iife",
  jsx: "automatic",
  loader: { ".json": "json" },
  alias: {
    remotion: path.join(here, "shim/remotion.tsx"),
    "@remotion/media": path.join(here, "shim/media.tsx"),
    "@remotion/fonts": path.join(here, "shim/fonts.ts"),
  },
  nodePaths: [process.env.GLOBAL_NODE_MODULES],
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});
console.log("bundled");
