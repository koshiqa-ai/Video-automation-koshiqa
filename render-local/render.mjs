// Local preview renderer: Chromium screenshots per frame → ffmpeg.
//   node render.mjs <CompositionId> [--stills 0,90,200] [--outdir ../out]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_PATH ?? "playwright");
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const args = process.argv.slice(2);
const id = args[0];
const stillsArg = args.includes("--stills") ? args[args.indexOf("--stills") + 1] : null;
const outdir = path.resolve(args.includes("--outdir") ? args[args.indexOf("--outdir") + 1] : path.join(root, "out"));
fs.mkdirSync(outdir, { recursive: true });

const types = { ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".otf": "font/otf", ".ttf": "font/ttf", ".wav": "audio/wav" };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(p)] ?? "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;

const browser = await chromium.launch({ args: ["--font-render-hinting=none", "--disable-lcd-text"] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("pageerror", e.message));
page.on("console", (m) => m.type() === "error" && console.error("console", m.text()));
await page.goto(`http://127.0.0.1:${port}/render-local/index.html?id=${encodeURIComponent(id)}`);
await page.waitForFunction(() => typeof window.setFrame === "function");
const duration = await page.evaluate(() => window.__duration);
await page.evaluate(() => window.setFrame(0));
await page.waitForTimeout(400);

const shot = async (n, type = "jpeg") => {
  await page.evaluate((f) => window.setFrame(f), n);
  return page.screenshot({ type, quality: type === "jpeg" ? 93 : undefined, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
};

if (stillsArg) {
  for (const n of stillsArg.split(",").map(Number)) {
    fs.writeFileSync(path.join(outdir, `${id}-f${n}.png`), await shot(n, "png"));
  }
  console.log("stills done", stillsArg);
} else {
  const silent = path.join(outdir, `${id}.silent.mp4`);
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-movflags", "+faststart", silent], { stdio: ["pipe", "inherit", "inherit"] });
  const t0 = Date.now();
  for (let n = 0; n < duration; n++) {
    const buf = await shot(n);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (n % 150 === 0) console.log(`${id} frame ${n}/${duration} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  console.log("video done", silent, duration, "frames");
}
await browser.close();
server.close();
