/**
 * Pixel measurements from floor_2.png (2250×1382):
 *
 * Building inner bounds:
 *   top    y=179  → 13.0%
 *   bottom y=1316 → 95.2%
 *   left   x=374  → 16.6%
 *   right  x=2190 → 97.3%
 *
 * Horizontal dividers (chodba):
 *   chodba top    y=514  → 37.2%   (confirmed at x=1500)
 *   chodba bottom y=618  → 44.7%   (confirmed at x=400)
 *
 * Vertical dividers – top section (y=300 scan):
 *   WC right wall         x≈531    → 23.6%
 *   Schodisko left        x≈629    → 28.0%
 *   Schodisko right / r22 left wall x≈1322 → 58.8%
 *   r22 / r23 divider     x≈1737   → 77.2%
 *   r23 right = building right      → 97.3%
 *
 * Vertical dividers – bottom section (y=800/1000 scan):
 *   r19 / r20 divider     x≈1076   → 47.8%
 *   r20 / r21 divider     x≈1313   → 58.4%
 */

import sharp from 'sharp';

const W = 2250, H = 1382;

// Corrected zones
const zones = [
  { id: 'vchod',     left: 0,    top: 28.0, width: 17.0,  height: 67.2, clickable: false, color: [255,140,0,  100] },
  { id: 'wc',        left: 16.6, top: 13.0, width: 7.0,   height: 24.2, clickable: false, color: [160,0, 160, 100] },
  { id: 'schodisko', left: 23.6, top: 13.0, width: 35.2,  height: 24.2, clickable: false, color: [160,0, 160, 100] },
  { id: 'r22',       left: 58.8, top: 13.0, width: 18.4,  height: 24.2, clickable: true,  color: [0,  0,  220, 140] },
  { id: 'r23',       left: 77.2, top: 13.0, width: 20.1,  height: 24.2, clickable: true,  color: [0,  150,0,  140] },
  { id: 'chodba',    left: 16.6, top: 37.2, width: 80.7,  height: 7.5,  clickable: false, color: [128,128,0,  100] },
  { id: 'r19',       left: 16.6, top: 44.7, width: 31.2,  height: 50.5, clickable: true,  color: [220,0,  0,  140] },
  { id: 'r20',       left: 47.8, top: 44.7, width: 10.6,  height: 50.5, clickable: true,  color: [0,  180,180,140] },
  { id: 'r21',       left: 58.4, top: 44.7, width: 38.9,  height: 50.5, clickable: true,  color: [180,0,  180,140] },
];

function px(pct, total) { return Math.round(pct / 100 * total); }

const rects = zones.map(z => {
  const x = px(z.left, W), y = px(z.top, H);
  const w = px(z.width, W), h = px(z.height, H);
  const [r,g,b,a] = z.color;
  const fill  = `rgba(${r},${g},${b},${(a/255).toFixed(2)})`;
  const stroke= `rgb(${r},${g},${b})`;
  const sw    = z.clickable ? 5 : 3;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}"
        fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
  <text x="${x+6}" y="${y+28}" font-size="26" font-weight="bold"
        font-family="sans-serif" fill="${stroke}"
        paint-order="stroke" stroke="white" stroke-width="4">${z.id}</text>
  <text x="${x+6}" y="${y+56}" font-size="20"
        font-family="monospace" fill="${stroke}"
        paint-order="stroke" stroke="white" stroke-width="3">
    L${z.left.toFixed(1)} T${z.top.toFixed(1)} W${z.width.toFixed(1)} H${z.height.toFixed(1)}
  </text>`;
}).join('');

// Measurement guide lines
const guide = `
  <!-- Building inner boundary -->
  <rect x="${px(16.6,W)}" y="${px(13.0,H)}" width="${px(80.7,W)}" height="${px(82.2,H)}"
        fill="none" stroke="red" stroke-width="3" stroke-dasharray="12 6" opacity="0.6"/>
  <!-- Chodba lines -->
  <line x1="0" y1="${px(37.2,H)}" x2="${W}" y2="${px(37.2,H)}"
        stroke="cyan" stroke-width="2" opacity="0.7"/>
  <line x1="0" y1="${px(44.7,H)}" x2="${W}" y2="${px(44.7,H)}"
        stroke="cyan" stroke-width="2" opacity="0.7"/>
  <text x="10" y="${px(37.2,H)-4}" font-size="22" fill="cyan" font-family="monospace">37.2%</text>
  <text x="10" y="${px(44.7,H)-4}" font-size="22" fill="cyan" font-family="monospace">44.7%</text>
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${guide}${rects}</svg>`;

await sharp('client/public/floor_2.png')
  .composite([{ input: Buffer.from(svg), blend: 'over' }])
  .toFile('corrected-preview.png');

console.log('Saved corrected-preview.png');
console.log('\n=== CORRECTED ZONE SUMMARY ===');
zones.forEach(z => {
  const x = px(z.left, W), y = px(z.top, H), w = px(z.width, W), h = px(z.height, H);
  console.log(`${z.id.padEnd(12)}: x=${x}..${x+w} (${z.left}%..${(z.left+z.width).toFixed(1)}%)   y=${y}..${y+h} (${z.top}%..${(z.top+z.height).toFixed(1)}%)`);
});
