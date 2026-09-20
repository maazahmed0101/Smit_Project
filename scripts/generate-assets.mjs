// Generates the local placeholder artwork used by the app:
//   public/thumbs/thumb-XX.svg   (16 neon-styled video thumbnails)
//   public/avatars/avatar-XX.svg (12 avatar illustrations)
//
// Why this exists: the original Figma raster thumbnails/avatars could not be
// downloaded in the environment where the project was built (no network).
// These are stand-ins that follow the neon/purple look of the Figma imagery.
// Replace files in public/thumbs and public/avatars with the real assets
// (keep the same file names, or update src/data/videos.js + channels.js).
//
// Run: node scripts/generate-assets.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const thumbsDir = join(root, "public", "thumbs");
const avatarsDir = join(root, "public", "avatars");
mkdirSync(thumbsDir, { recursive: true });
mkdirSync(avatarsDir, { recursive: true });

// deterministic PRNG so re-running produces identical files
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const palettes = [
  ["#0b1026", "#ff3d81", "#22d3ee", "#ff9f43"],
  ["#050816", "#7c3aed", "#22d3ee", "#f472b6"],
  ["#12071f", "#f43f5e", "#f59e0b", "#a855f7"],
  ["#03121a", "#06b6d4", "#3b82f6", "#e879f9"],
  ["#160a2a", "#c026d3", "#60a5fa", "#fb7185"],
  ["#021a1a", "#14b8a6", "#38bdf8", "#facc15"],
  ["#1a0b12", "#fb7185", "#f97316", "#8b5cf6"],
  ["#020617", "#2563eb", "#22d3ee", "#a78bfa"],
];
const motifs = ["city", "orb", "grid", "waves"];

function thumb(i) {
  const r = rng(1000 + i * 77);
  const p = palettes[i % palettes.length];
  const motif = motifs[i % motifs.length];
  const W = 640;
  const H = 320;
  let body = "";
  if (motif === "city") {
    const glow = `<circle cx="${W * (0.3 + r() * 0.4)}" cy="${H * 0.55}" r="${110 + r() * 60}" fill="url(#g)"/>`;
    let x = 0;
    let bld = "";
    while (x < W) {
      const w = 24 + r() * 46;
      const h = 60 + r() * 170;
      bld += `<rect x="${x.toFixed(1)}" y="${(H - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="#05060f" opacity="0.92"/>`;
      for (let k = 0; k < 5; k += 1) {
        bld += `<rect x="${(x + 4 + r() * (w - 12)).toFixed(1)}" y="${(H - h + 8 + r() * (h - 20)).toFixed(1)}" width="3" height="5" fill="${p[1 + Math.floor(r() * 3)]}" opacity="0.85"/>`;
      }
      x += w + 2;
    }
    body = glow + bld;
  } else if (motif === "orb") {
    const cx = W * (0.35 + r() * 0.3);
    const cy = H * (0.4 + r() * 0.2);
    body = `<circle cx="${cx}" cy="${cy}" r="150" fill="url(#g)"/>`;
    for (let k = 0; k < 6; k += 1) {
      body += `<circle cx="${cx}" cy="${cy}" r="${30 + k * 22}" fill="none" stroke="${p[1 + (k % 3)]}" stroke-width="${1 + r() * 2}" opacity="${0.75 - k * 0.09}"/>`;
    }
    for (let k = 0; k < 24; k += 1) {
      body += `<circle cx="${(r() * W).toFixed(1)}" cy="${(r() * H).toFixed(1)}" r="${(0.8 + r() * 2).toFixed(1)}" fill="#fff" opacity="${(0.3 + r() * 0.6).toFixed(2)}"/>`;
    }
  } else if (motif === "grid") {
    const hy = H * 0.45;
    body = `<rect x="0" y="${hy}" width="${W}" height="${H - hy}" fill="#05060f" opacity="0.7"/><circle cx="${W / 2}" cy="${hy}" r="90" fill="url(#g)"/>`;
    for (let k = -12; k <= 12; k += 1) {
      body += `<line x1="${W / 2}" y1="${hy}" x2="${W / 2 + k * 90}" y2="${H}" stroke="${p[2]}" stroke-width="1" opacity="0.55"/>`;
    }
    for (let k = 1; k < 8; k += 1) {
      const y = hy + (H - hy) * (k / 8) ** 1.8;
      body += `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="${p[1]}" stroke-width="1" opacity="0.55"/>`;
    }
  } else {
    for (let k = 0; k < 7; k += 1) {
      const y = 40 + k * 38;
      const a = 14 + r() * 26;
      body += `<path d="M0 ${y} C ${W * 0.25} ${y - a}, ${W * 0.5} ${y + a}, ${W * 0.75} ${y - a} S ${W} ${y} ${W} ${y}" fill="none" stroke="${p[1 + (k % 3)]}" stroke-width="${2 + r() * 3}" opacity="${(0.85 - k * 0.07).toFixed(2)}"/>`;
    }
    body += `<circle cx="${W * 0.75}" cy="${H * 0.3}" r="70" fill="url(#g)"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-hidden="true">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="0.55" stop-color="${p[1]}" stop-opacity="0.55"/><stop offset="1" stop-color="${p[2]}" stop-opacity="0.75"/></linearGradient>
<radialGradient id="g"><stop offset="0" stop-color="${p[3]}" stop-opacity="0.95"/><stop offset="1" stop-color="${p[3]}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="${p[0]}"/><rect width="${W}" height="${H}" fill="url(#bg)"/>
${body}
</svg>
`;
}

const skin = ["#f1c9a5", "#d9a37b", "#b97b57", "#8d5a3b", "#f6d5b8", "#c68f66"];
const suits = ["#2b3a67", "#5b7fb5", "#3d3d3d", "#7a4b8f", "#1f6f6b", "#8a3b4e"];
const bgs = ["#e6ecf7", "#ffe4ef", "#e3f6f1", "#efe6ff", "#fff2d9", "#e2f0ff"];

function avatar(i) {
  const r = rng(500 + i * 31);
  const s = skin[i % skin.length];
  const c = suits[(i + 2) % suits.length];
  const b = bgs[i % bgs.length];
  const hair = ["#1c1917", "#3b2417", "#0f0f0f", "#5a3a22"][Math.floor(r() * 4)];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96" role="img" aria-hidden="true">
<rect width="96" height="96" fill="${b}"/>
<path d="M8 96c2-22 18-32 40-32s38 10 40 32z" fill="${c}"/>
<path d="M38 60h20l-4 14H42z" fill="#fff" opacity="0.9"/>
<rect x="41" y="50" width="14" height="14" rx="5" fill="${s}"/>
<ellipse cx="48" cy="38" rx="17" ry="20" fill="${s}"/>
<path d="M31 36c0-14 8-20 17-20s17 6 17 20c-4-7-9-10-17-10s-13 3-17 10z" fill="${hair}"/>
<circle cx="42" cy="40" r="1.8" fill="#1c1917"/><circle cx="54" cy="40" r="1.8" fill="#1c1917"/>
<path d="M42 48c3 3 9 3 12 0" stroke="#7a3b2e" stroke-width="1.8" fill="none" stroke-linecap="round"/>
</svg>
`;
}

for (let i = 1; i <= 16; i += 1) {
  writeFileSync(join(thumbsDir, `thumb-${String(i).padStart(2, "0")}.svg`), thumb(i - 1));
}
for (let i = 1; i <= 12; i += 1) {
  writeFileSync(join(avatarsDir, `avatar-${String(i).padStart(2, "0")}.svg`), avatar(i - 1));
}
console.log("Generated 16 thumbnails and 12 avatars.");
