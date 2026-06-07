import sharp from 'sharp';
import { readFileSync } from 'fs';

const IMG_W = 2250;
const IMG_H = 1382;
const DARK = 80; // pixel value threshold — below this = wall

const { data } = await sharp('client/public/floor_2.png')
  .raw()
  .toBuffer({ resolveWithObject: true });

// data is RGBA, 4 bytes per pixel
function isDark(x, y) {
  const idx = (y * IMG_W + x) * 4;
  const r = data[idx], g = data[idx+1], b = data[idx+2];
  return r < DARK && g < DARK && b < DARK;
}

// Scan a horizontal line — find first/last dark pixel
function scanH(y, xFrom = 0, xTo = IMG_W) {
  let first = -1, last = -1;
  for (let x = xFrom; x < xTo; x++) {
    if (isDark(x, y)) { if (first === -1) first = x; last = x; }
  }
  return { first, last };
}

// Scan a vertical line — find first/last dark pixel
function scanV(x, yFrom = 0, yTo = IMG_H) {
  let first = -1, last = -1;
  for (let y = yFrom; y < yTo; y++) {
    if (isDark(x, y)) { if (first === -1) first = y; last = y; }
  }
  return { first, last };
}

// Find the outermost building boundary
const topBoundary    = scanH(80);
const bottomBoundary = scanH(IMG_H - 80);

console.log('=== BOUNDARY SCAN ===');
// Find top wall (scan downward at center x)
for (let y = 0; y < 200; y++) {
  const s = scanH(y, 500, 1800);
  if (s.first !== -1) { console.log(`Top wall first dark row: y=${y}`); break; }
}
// Find bottom wall
for (let y = IMG_H - 1; y > IMG_H - 200; y--) {
  const s = scanH(y, 500, 1800);
  if (s.first !== -1) { console.log(`Bottom wall last dark row: y=${y}`); break; }
}
// Find left wall (main building, scan from right of entrance)
for (let x = 50; x < 300; x++) {
  const s = scanV(x, 50, 400);
  if (s.first !== -1) { console.log(`Left wall (top section) first dark col: x=${x}`); break; }
}
// Find right wall
for (let x = IMG_W - 1; x > IMG_W - 200; x--) {
  const s = scanV(x, 100, 1300);
  if (s.first !== -1) { console.log(`Right wall first dark col: x=${x}`); break; }
}

console.log('\n=== HORIZONTAL CORRIDOR (scan vertical columns for wall gap) ===');
// The chodba is a horizontal corridor. Scan vertical column at x=900 (middle)
// to find where there are horizontal walls (dense dark pixels in a row)
console.log('Scanning x=900 for horizontal walls (wall density):');
let inWall = false;
for (let y = 200; y < 900; y++) {
  // count dark pixels in a 5-pixel wide band
  let count = 0;
  for (let dx = -2; dx <= 2; dx++) {
    if (isDark(900 + dx, y)) count++;
  }
  if (count >= 3 && !inWall) { console.log(`  Wall starts at y=${y}`); inWall = true; }
  if (count < 2 && inWall)   { console.log(`  Wall ends   at y=${y}`); inWall = false; }
}

console.log('\n=== TOP SECTION VERTICAL WALLS (scan y=200, top section) ===');
// Scan horizontally at y=200 (middle of top section) to find vertical walls
inWall = false;
for (let x = 50; x < IMG_W - 50; x++) {
  // count dark pixels in 5-pixel tall band
  let count = 0;
  for (let dy = -2; dy <= 2; dy++) {
    if (isDark(x, 200 + dy)) count++;
  }
  if (count >= 3 && !inWall) { console.log(`  Wall starts at x=${x}  (${(x/IMG_W*100).toFixed(1)}%)`); inWall = true; }
  if (count < 2 && inWall)   { console.log(`  Wall ends   at x=${x}  (${(x/IMG_W*100).toFixed(1)}%)`); inWall = false; }
}

console.log('\n=== BOTTOM SECTION VERTICAL WALLS (scan y=900) ===');
inWall = false;
for (let x = 50; x < IMG_W - 50; x++) {
  let count = 0;
  for (let dy = -2; dy <= 2; dy++) {
    if (isDark(x, 900 + dy)) count++;
  }
  if (count >= 3 && !inWall) { console.log(`  Wall starts at x=${x}  (${(x/IMG_W*100).toFixed(1)}%)`); inWall = true; }
  if (count < 2 && inWall)   { console.log(`  Wall ends   at x=${x}  (${(x/IMG_W*100).toFixed(1)}%)`); inWall = false; }
}

console.log('\n=== ROOM BOUNDARY SEARCH ===');
// For each room, scan at its approximate center to find bounding walls

// Top-right rooms: scan at y=200
// r22 left boundary — scan from x=1000 leftward
console.log('\nTop-right rooms at y=200:');
for (let x = IMG_W - 100; x > 900; x--) {
  let count = 0;
  for (let dy = -3; dy <= 3; dy++) if (isDark(x, 200 + dy)) count++;
  if (count >= 4) { console.log(`  Right-section left bound: x=${x} (${(x/IMG_W*100).toFixed(1)}%)`); break; }
}
// Divider between r22 and r23
console.log('  Searching for r22/r23 divider wall (scan y=200 from right):');
let walls22_23 = [];
inWall = false;
for (let x = IMG_W - 50; x > 1000; x--) {
  let count = 0;
  for (let dy = -3; dy <= 3; dy++) if (isDark(x, 200 + dy)) count++;
  if (count >= 4 && !inWall) { walls22_23.push({type:'end', x}); inWall = true; }
  if (count < 3 && inWall) { walls22_23.push({type:'start', x}); inWall = false; }
}
walls22_23.slice(0, 8).forEach(w => console.log(`    ${w.type} x=${w.x} (${(w.x/IMG_W*100).toFixed(1)}%)`));

// Bottom rooms: find vertical dividers at y=900
console.log('\nBottom room dividers at y=900:');
let wallsBottom = [];
inWall = false;
for (let x = 100; x < IMG_W - 50; x++) {
  let count = 0;
  for (let dy = -3; dy <= 3; dy++) if (isDark(x, 900 + dy)) count++;
  if (count >= 4 && !inWall) { wallsBottom.push({type:'start', x}); inWall = true; }
  if (count < 3 && inWall) { wallsBottom.push({type:'end', x}); inWall = false; }
}
wallsBottom.forEach(w => console.log(`  ${w.type} x=${w.x} (${(w.x/IMG_W*100).toFixed(1)}%)`));
