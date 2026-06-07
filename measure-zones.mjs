import sharp from 'sharp';
import { readFileSync } from 'fs';

const IMG_W = 2250;
const IMG_H = 1382;

// Current zones from FloorPlanMap.tsx (percentages → pixels)
const zones = [
  { id: 'vchod',     left: 0,   top: 3,  width: 9,   height: 94, color: [255,165,0,120] },
  { id: 'wc',        left: 9,   top: 3,  width: 10,  height: 37, color: [128,0,128,120] },
  { id: 'schodisko', left: 35,  top: 3,  width: 14,  height: 28, color: [128,0,128,120] },
  { id: 'r22',       left: 55,  top: 3,  width: 25,  height: 39, color: [0,0,255,120]   },
  { id: 'r23',       left: 80,  top: 3,  width: 19,  height: 39, color: [0,128,0,120]   },
  { id: 'chodba',    left: 9,   top: 43, width: 90,  height: 14, color: [128,128,0,120] },
  { id: 'r19',       left: 9,   top: 57, width: 37,  height: 36, color: [255,0,0,120]   },
  { id: 'r20',       left: 46,  top: 57, width: 12,  height: 36, color: [0,200,200,120] },
  { id: 'r21',       left: 58,  top: 57, width: 41,  height: 36, color: [200,0,200,120] },
];

function pct(pct, total) { return Math.round(pct / 100 * total); }

function toSvgRect({ id, left, top, width, height, color }) {
  const x = pct(left, IMG_W);
  const y = pct(top, IMG_H);
  const w = pct(width, IMG_W);
  const h = pct(height, IMG_H);
  const [r,g,b,a] = color;
  const fill = `rgba(${r},${g},${b},${a/255})`;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}"
          fill="${fill}" stroke="rgba(${r},${g},${b},1)" stroke-width="3"/>
    <text x="${x+8}" y="${y+24}" font-size="28" fill="rgba(${r},${g},${b},1)"
          font-family="sans-serif" font-weight="bold">${id}</text>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${IMG_W}" height="${IMG_H}">
  ${zones.map(toSvgRect).join('\n')}
</svg>`;

const input = readFileSync('client/public/floor_2.png');

await sharp(input)
  .composite([{ input: Buffer.from(svg), blend: 'over' }])
  .toFile('zone-preview.png');

console.log('Saved zone-preview.png');
console.log('\nPixel coordinates of current zones:');
zones.forEach(z => {
  const x = pct(z.left, IMG_W);
  const y = pct(z.top, IMG_H);
  const w = pct(z.width, IMG_W);
  const h = pct(z.height, IMG_H);
  console.log(`${z.id.padEnd(12)}: x=${x} y=${y} w=${w} h=${h}  →  right=${x+w} bottom=${y+h}`);
});
