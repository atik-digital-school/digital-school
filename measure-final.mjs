import sharp from 'sharp';

const IMG_W = 2250, IMG_H = 1382;
const DARK = 110; // walls are gray ~52-90

const { data } = await sharp('client/public/floor_2.png')
  .raw().toBuffer({ resolveWithObject: true });

function isDark(x, y) {
  if (x < 0 || x >= IMG_W || y < 0 || y >= IMG_H) return false;
  const i = (y * IMG_W + x) * 4;
  return data[i] < DARK;
}

function darkBand(x, y, rx, ry) {
  let n = 0, total = 0;
  for (let dx = -rx; dx <= rx; dx++)
    for (let dy = -ry; dy <= ry; dy++) { if (isDark(x+dx, y+dy)) n++; total++; }
  return n / total;
}

// Scan a horizontal row for vertical wall positions
function scanRowForVWalls(y, minLen = 8) {
  const walls = [];
  let start = -1;
  for (let x = 0; x < IMG_W; x++) {
    const d = darkBand(x, y, 0, 3) > 0.4;
    if (d && start === -1) start = x;
    if (!d && start !== -1) {
      if (x - start >= minLen) walls.push({ x1: start, x2: x - 1, cx: Math.round((start + x) / 2) });
      start = -1;
    }
  }
  return walls;
}

// Scan a vertical column for horizontal wall positions
function scanColForHWalls(x, minLen = 8) {
  const walls = [];
  let start = -1;
  for (let y = 0; y < IMG_H; y++) {
    const d = darkBand(x, y, 3, 0) > 0.4;
    if (d && start === -1) start = y;
    if (!d && start !== -1) {
      if (y - start >= minLen) walls.push({ y1: start, y2: y - 1, cy: Math.round((start + y) / 2) });
      start = -1;
    }
  }
  return walls;
}

function pct(v, total) { return (v / total * 100).toFixed(1) + '%'; }

// ── 1. Building outer boundary ──────────────────────────────────────────────
const topWalls = scanColForHWalls(1000, 30);
const btmWalls = scanColForHWalls(1000, 30);
const topWall = topWalls[0];
const btmWall = topWalls[topWalls.length - 1];
console.log('=== BUILDING OUTER BOUNDS (column x=1000) ===');
topWalls.slice(0,2).forEach(w => console.log(`  y=${w.y1}..${w.y2} (${pct(w.y1,IMG_H)}..${pct(w.y2,IMG_H)})`));
topWalls.slice(-2).forEach(w => console.log(`  y=${w.y1}..${w.y2} (${pct(w.y1,IMG_H)}..${pct(w.y2,IMG_H)})`));

// ── 2. Horizontal walls (chodba top/bottom) at x=900 ────────────────────────
console.log('\n=== HORIZONTAL WALLS at x=900 ===');
scanColForHWalls(900).forEach(w =>
  console.log(`  y=${w.y1}..${w.y2} (${pct(w.y1,IMG_H)}..${pct(w.y2,IMG_H)}) len=${w.y2-w.y1}`));

// At x=1500 (in r22 area)
console.log('\n=== HORIZONTAL WALLS at x=1500 ===');
scanColForHWalls(1500).forEach(w =>
  console.log(`  y=${w.y1}..${w.y2} (${pct(w.y1,IMG_H)}..${pct(w.y2,IMG_H)}) len=${w.y2-w.y1}`));

// ── 3. Vertical walls in top section (y=250) ─────────────────────────────────
console.log('\n=== VERTICAL WALLS at y=250 (top section) ===');
scanRowForVWalls(250, 15).forEach(w =>
  console.log(`  x=${w.x1}..${w.x2} cx=${w.cx} (${pct(w.cx,IMG_W)}) len=${w.x2-w.x1}`));

// ── 4. Vertical walls in bottom section (y=950, y=1100) ──────────────────────
for (const y of [800, 950, 1050, 1150]) {
  console.log(`\n=== VERTICAL WALLS at y=${y} (bottom section) ===`);
  scanRowForVWalls(y, 15).forEach(w =>
    console.log(`  x=${w.x1}..${w.x2} cx=${w.cx} (${pct(w.cx,IMG_W)}) len=${w.x2-w.x1}`));
}

// ── 5. Generate annotated PNG with measured positions ────────────────────────
// Collect key measurements for the SVG
const hwalls900 = scanColForHWalls(900);
const hwalls1500 = scanColForHWalls(1500);
const vwalls250 = scanRowForVWalls(250, 15);
const vwalls950 = scanRowForVWalls(950, 15);

// Annotate measured walls on the image
const lines = [];
// Draw measured horizontal walls (column 900) as cyan lines
hwalls900.forEach(w => {
  lines.push(`<line x1="0" y1="${w.cy}" x2="${IMG_W}" y2="${w.cy}" stroke="cyan" stroke-width="3" opacity="0.8"/>`);
  lines.push(`<text x="10" y="${w.cy-4}" font-size="22" fill="cyan" font-family="monospace">y=${w.cy} (${pct(w.cy,IMG_H)})</text>`);
});
// Draw vertical walls from y=250 as yellow lines
vwalls250.forEach(w => {
  lines.push(`<line x1="${w.cx}" y1="0" x2="${w.cx}" y2="${IMG_H}" stroke="yellow" stroke-width="2" opacity="0.8"/>`);
  lines.push(`<text x="${w.cx+2}" y="60" font-size="20" fill="yellow" font-family="monospace">${w.cx}</text>`);
});
// Draw vertical walls from y=950 as lime lines
vwalls950.forEach(w => {
  lines.push(`<line x1="${w.cx}" y1="0" x2="${w.cx}" y2="${IMG_H}" stroke="lime" stroke-width="2" opacity="0.6" stroke-dasharray="8 4"/>`);
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${IMG_W}" height="${IMG_H}">${lines.join('')}</svg>`;
await sharp('client/public/floor_2.png')
  .composite([{ input: Buffer.from(svg), blend: 'over' }])
  .toFile('walls-measured.png');
console.log('\nSaved walls-measured.png');

// ── 6. Print final summary for zone calculation ───────────────────────────────
console.log('\n=== SUMMARY FOR ZONE CALCULATION ===');
console.log(`Image: ${IMG_W} x ${IMG_H}`);
console.log(`\nHorizontal walls at x=900 (chodba):`)
hwalls900.forEach(w => console.log(`  y=${w.y1}..${w.y2}  mid=${w.cy}  pct=${pct(w.cy,IMG_H)}`));
console.log(`\nVertical walls at y=250 (cx positions):`)
vwalls250.forEach(w => console.log(`  x=${w.x1}..${w.x2}  mid=${w.cx}  pct=${pct(w.cx,IMG_W)}`));
console.log(`\nVertical walls at y=950 (cx positions):`)
vwalls950.forEach(w => console.log(`  x=${w.x1}..${w.x2}  mid=${w.cx}  pct=${pct(w.cx,IMG_W)}`));
