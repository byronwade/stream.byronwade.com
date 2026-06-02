// Precompute static per-stream / per-channel Open Graph images as SVG (1200x630).
// Dynamic ImageResponse (next/og) is not reliable with `output: 'export'`, so we
// generate branded static SVGs at build-prep time and reference them via metadata.
//
// Usage: node scripts/generate-og.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data");
const outDir = join(root, "public", "og");
mkdirSync(outDir, { recursive: true });

const streams = JSON.parse(readFileSync(join(dataDir, "streams.json"), "utf8"));
const creators = JSON.parse(readFileSync(join(dataDir, "creators.json"), "utf8"));
const creatorById = new Map(creators.map((c) => [c.id, c]));

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c],
  );
}

function wrap(text, maxChars, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars) {
      if (line) lines.push(line);
      line = w;
      if (lines.length === maxLines - 1) break;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  let result = lines.slice(0, maxLines);
  if (words.join(" ").length > result.join(" ").length) {
    result[result.length - 1] = result[result.length - 1].replace(/[.,]?$/, "…");
  }
  return result;
}

const STATE_LABEL = { live: "● LIVE", ended: "VOD", scheduled: "SCHEDULED", warmup: "● LIVE" };
const STATE_COLOR = { live: "#ff4d6d", ended: "#a7b0c0", scheduled: "#4f8cff", warmup: "#ff4d6d" };

function svg({ eyebrow, eyebrowColor, titleLines, subtitle, footer }) {
  const titleTspans = titleLines
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 86}">${esc(l)}</tspan>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0f1c"/>
      <stop offset="1" stop-color="#05070d"/>
    </linearGradient>
    <radialGradient id="glow" cx="18%" cy="12%" r="60%">
      <stop offset="0" stop-color="#4f8cff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#4f8cff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="88%" cy="92%" r="55%">
      <stop offset="0" stop-color="#8b5cf6" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <rect x="0" y="0" width="1200" height="8" fill="#4f8cff"/>
  <text x="80" y="118" font-family="Geist, Arial, sans-serif" font-size="40" font-weight="800" fill="#f5f7fb">Stream</text>
  <text x="80" y="210" font-family="Geist, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="2" fill="${eyebrowColor}">${esc(eyebrow)}</text>
  <text y="300" font-family="Geist, Arial, sans-serif" font-size="72" font-weight="800" fill="#f5f7fb">${titleTspans}</text>
  <text x="80" y="540" font-family="Geist, Arial, sans-serif" font-size="34" font-weight="600" fill="#a7b0c0">${esc(subtitle)}</text>
  <text x="80" y="588" font-family="Geist, Arial, sans-serif" font-size="22" fill="#7f8aa1">${esc(footer)}</text>
</svg>`;
}

let count = 0;
for (const s of streams) {
  const creator = creatorById.get(s.creatorId);
  const titleLines = wrap(s.title, 24, 3);
  const out = svg({
    eyebrow: STATE_LABEL[s.state] ?? "● LIVE",
    eyebrowColor: STATE_COLOR[s.state] ?? "#ff4d6d",
    titleLines,
    subtitle: creator ? creator.displayName : "Stream",
    footer: "Frontend-only streaming platform concept · stream.byronwade.com",
  });
  writeFileSync(join(outDir, `${s.slug}.svg`), out);
  count++;
}

for (const c of creators) {
  const out = svg({
    eyebrow: "CHANNEL",
    eyebrowColor: "#8b5cf6",
    titleLines: wrap(c.displayName, 22, 2),
    subtitle: `@${c.handle}`,
    footer: "Frontend-only streaming platform concept · stream.byronwade.com",
  });
  writeFileSync(join(outDir, `channel-${c.handle}.svg`), out);
  count++;
}

writeFileSync(
  join(outDir, "default.svg"),
  svg({
    eyebrow: "LIVE PLATFORM CONCEPT",
    eyebrowColor: "#4f8cff",
    titleLines: ["A streaming platform,", "built on the frontend."],
    subtitle: "Discovery · Watch · Clips · Studio",
    footer: "Frontend-only streaming platform concept · stream.byronwade.com",
  }),
);
count++;

console.log(`Generated ${count} OG images in public/og/`);
