import sharp from 'sharp';

const IMG_W = 2250, IMG_H = 1382;
const DARK = 60;

const { data } = await sharp('client/public/floor_2.png')
  .raw().toBuffer({ resolveWithObject: true });

function isDark(x, y) {
  if (x < 0 || x >= IMG_W || y < 0 || y >= IMG_H) return false;
  const i = (y * IMG_W + x) * 4;
  return data[i] < DARK && data[i+1] < DARK && data[i+2] < DARK;
}

// Count dark pixels in a neighbourhood
function darkCount(x, y, rx=3, ry=3) {
  let n = 0;
  for (let dx=-rx; dx<=rx; dx++) for (let dy=-ry; dy<=ry; dy++) if (isDark(x+dx, y+dy)) n++;
  return n;
}

// Find all horizontal wall bands (runs of dark pixels along a row)
function findHWalls(y, minLen=20) {
  const walls = [];
  let start = -1;
  for (let x = 0; x < IMG_W; x++) {
    const dark = darkCount(x, y, 0, 2) >= 2;
    if (dark && start === -1) start = x;
    if (!dark && start !== -1) { if (x - start >= minLen) walls.push({x1:start, x2:x-1}); start = -1; }
  }
  return walls;
}

// Find all vertical wall bands (runs of dark pixels along a column)
function findVWalls(x, minLen=20) {
  const walls = [];
  let start = -1;
  for (let y = 0; y < IMG_H; y++) {
    const dark = darkCount(x, y, 2, 0) >= 2;
    if (dark && start === -1) start = y;
    if (!dark && start !== -1) { if (y - start >= minLen) walls.push({y1:start, y2:y-1}); start = -1; }
  }
  return walls;
}

console.log('=== HORIZONTAL WALLS (scan vertical column at various x) ===');
for (const xScan of [200, 700, 900, 1500, 2000]) {
  const walls = findVWalls(xScan);
  console.log(`\nColumn x=${xScan}:`);
  walls.forEach(w => console.log(`  y=${w.y1}..${w.y2} (${(w.y1/IMG_H*100).toFixed(1)}%..${(w.y2/IMG_H*100).toFixed(1)}%) len=${w.y2-w.y1}`));
}

console.log('\n=== VERTICAL WALLS (scan horizontal rows at various y) ===');
for (const yScan of [200, 400, 500, 700, 900, 1100]) {
  const walls = findHWalls(yScan);
  console.log(`\nRow y=${yScan}:`);
  walls.forEach(w => console.log(`  x=${w.x1}..${w.x2} (${(w.x1/IMG_W*100).toFixed(1)}%..${(w.x2/IMG_W*100).toFixed(1)}%) len=${w.x2-w.x1}`));
}

// ─── Generate annotated preview with grid + precise zone rectangles ─────────
// Measure key wall positions
const topWall    = findHWalls(80).find(w => w.x2-w.x1 > 500)?.x1 ?? 70;
const btmWall    = findHWalls(IMG_H-80).find(w => w.x2-w.x1 > 500)?.x1 ?? 0;

// Find building top: first dense horizontal line spanning most of width
let buildingTop = 0, buildingBottom = 0;
for (let y = 50; y < 300; y++) {
  const ws = findHWalls(y, 400);
  if (ws.length > 0) { buildingTop = y; break; }
}
for (let y = IMG_H-50; y > IMG_H-300; y--) {
  const ws = findHWalls(y, 400);
  if (ws.length > 0) { buildingBottom = y; break; }
}
console.log(`\nBuilding top: y=${buildingTop} (${(buildingTop/IMG_H*100).toFixed(1)}%)`);
console.log(`Building bottom: y=${buildingBottom} (${(buildingBottom/IMG_H*100).toFixed(1)}%)`);

// ─── Draw grid on image for manual inspection ────────────────────────────────
const gridLines = [];
for (let pct = 0; pct <= 100; pct += 5) {
  const x = Math.round(pct/100*IMG_W);
  const y = Math.round(pct/100*IMG_H);
  gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${IMG_H}" stroke="rgba(255,0,0,0.3)" stroke-width="1"/>`);
  gridLines.push(`<line x1="0" y1="${y}" x2="${IMG_W}" y2="${y}" stroke="rgba(255,0,0,0.3)" stroke-width="1"/>`);
  gridLines.push(`<text x="${x+2}" y="20" font-size="20" fill="red" font-family="monospace">${pct}%</text>`);
  gridLines.push(`<text x="2" y="${y+20}" font-size="20" fill="red" font-family="monospace">${pct}%</text>`);
}
// Denser grid every 1% for critical area (25-70% height)
for (let pct = 25; pct <= 70; pct++) {
  const y = Math.round(pct/100*IMG_H);
  gridLines.push(`<line x1="0" y1="${y}" x2="${IMG_W}" y2="${y}" stroke="rgba(0,0,255,0.15)" stroke-width="1"/>`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${IMG_W}" height="${IMG_H}">${gridLines.join('')}</svg>`;

await sharp('client/public/floor_2.png')
  .composite([{ input: Buffer.from(svg), blend: 'over' }])
  .toFile('grid-preview.png');
console.log('\nSaved grid-preview.png');
