// Generates one short, distinct demo clip per video (public/media/<id>.webm + .mp4)
// so every video page really plays something different (title + running timer on a moving gradient).
// Requires ffmpeg (with libvpx-vp9, libx264, drawtext). Optional: the generated files are committed.
// Usage: node scripts/generate-videos.mjs [--font /path/to/font.ttf]
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { videos } from "../src/data/videos.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "media");
mkdirSync(out, { recursive: true });

const fontArg = process.argv.indexOf("--font");
const fonts = [
  fontArg > -1 ? process.argv[fontArg + 1] : null,
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
  "C:/Windows/Fonts/arialbd.ttf",
].filter(Boolean);
const font = fonts.find((f) => existsSync(f));
if (!font) throw new Error("No font found. Pass --font /path/to/font.ttf");

const palettes = [
  ["0x1b0b3a", "0xff3d81", "0x22d3ee", "0xffb347"],
  ["0x050816", "0x7c3aed", "0x22d3ee", "0xf472b6"],
  ["0x12071f", "0xf43f5e", "0xf59e0b", "0xa855f7"],
  ["0x03121a", "0x06b6d4", "0x3b82f6", "0xe879f9"],
  ["0x160a2a", "0xc026d3", "0x60a5fa", "0xfb7185"],
  ["0x021a1a", "0x14b8a6", "0x38bdf8", "0xfacc15"],
];

const wrap = (text, max = 26) => {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) {
      lines.push(cur.trim());
      cur = w;
    } else cur = `${cur} ${w}`;
  }
  lines.push(cur.trim());
  return lines.slice(0, 3).join("\n");
};

const DURATION = 8;
videos.forEach((v, i) => {
  const p = palettes[i % palettes.length];
  const textFile = join(out, `.${v.id}.txt`);
  writeFileSync(textFile, wrap(v.title.replace(/[|]/g, "-")));
  const esc = (s) => s.replace(/\\/g, "/").replace(/:/g, "\\:");
  const vf =
    `drawtext=fontfile='${esc(font)}':textfile='${esc(textFile)}':fontcolor=white:fontsize=30:line_spacing=8:x=(w-text_w)/2:y=(h-text_h)/2-14:box=1:boxcolor=black@0.35:boxborderw=14,` +
    `drawtext=fontfile='${esc(font)}':text='%{pts\\:hms}':fontcolor=white:fontsize=22:x=(w-text_w)/2:y=h-100`;
  const common = [
    "-hide_banner", "-loglevel", "error", "-y",
    "-f", "lavfi", "-i", `gradients=s=640x360:d=${DURATION}:r=24:speed=0.04:type=spiral:c0=${p[0]}:c1=${p[1]}:c2=${p[2]}:c3=${p[3]}:nb_colors=4`,
    "-f", "lavfi", "-i", `sine=frequency=${180 + (i % 8) * 30}:duration=${DURATION}`,
    "-filter_complex", `[0:v]${vf}[v];[1:a]volume=0.04,tremolo=f=0.5:d=0.6[a]`,
    "-map", "[v]", "-map", "[a]",
  ];
  execFileSync("ffmpeg", [...common, "-c:v", "libvpx-vp9", "-b:v", "180k", "-crf", "42", "-deadline", "good", "-cpu-used", "5", "-c:a", "libopus", "-b:a", "24k", join(out, `${v.id}.webm`)]);
  execFileSync("ffmpeg", [...common, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-crf", "32", "-c:a", "aac", "-b:a", "32k", "-movflags", "+faststart", join(out, `${v.id}.mp4`)]);
  console.log(`clip ${i + 1}/${videos.length}: ${v.id}`);
});
console.log("done");
