import sharp from 'sharp';

const W = 2250, H = 1382;
const { data } = await sharp('client/public/floor_2.png')
  .raw().toBuffer({ resolveWithObject: true });

function val(x, y) {
  if (x<0||x>=W||y<0||y>=H) return 255;
  return data[(y*W+x)*4];
}
function isDark(x, y) { return val(x,y) < 130; }

// Find wall transitions along a column
function colWalls(x, y0=100, y1=H-100) {
  const out = [];
  let in_ = false;
  for (let y=y0; y<=y1; y++) {
    // use 3-px horizontal neighbourhood to avoid noise
    const d = val(x-1,y)<130 || val(x,y)<130 || val(x+1,y)<130;
    if (d && !in_) { out.push({start:y}); in_=true; }
    if (!d && in_) { out[out.length-1].end=y-1; in_=false; }
  }
  return out;
}
// Find wall transitions along a row
function rowWalls(y, x0=100, x1=W-100) {
  const out = [];
  let in_ = false;
  for (let x=x0; x<=x1; x++) {
    const d = val(x,y-1)<130 || val(x,y)<130 || val(x,y+1)<130;
    if (d && !in_) { out.push({start:x}); in_=true; }
    if (!d && in_) { out[out.length-1].end=x-1; in_=false; }
  }
  return out.filter(w => (w.end-w.start) >= 1);
}

// ── Scan r23 area ──────────────────────────────────────────────────────────
console.log('=== r23 area: column x=1900 (horizontal walls) ===');
colWalls(1900, 100, 700).forEach(w =>
  console.log(`  y=${w.start}..${w.end}  (${(w.start/H*100).toFixed(1)}%..${(w.end/H*100).toFixed(1)}%)`));

console.log('\n=== r23 area: column x=2100 (horizontal walls) ===');
colWalls(2100, 100, 700).forEach(w =>
  console.log(`  y=${w.start}..${w.end}  (${(w.start/H*100).toFixed(1)}%..${(w.end/H*100).toFixed(1)}%)`));

console.log('\n=== r23 left/right walls: row y=200 (x=1700..2230) ===');
rowWalls(200, 1700, 2230).forEach(w =>
  console.log(`  x=${w.start}..${w.end}  (${(w.start/W*100).toFixed(1)}%..${(w.end/W*100).toFixed(1)}%)`));

console.log('\n=== r23 bottom wall region: row y=505..540 at x=1900 ===');
for (let y=500; y<=560; y++) {
  const v = val(1900, y);
  if (v < 130) console.log(`  y=${y}  val=${v}  (${(y/H*100).toFixed(1)}%)`);
}

// ── Scan spodné miestnosti (r19/r20/r21) – chodba bottom / room top ────────
console.log('\n=== Bottom rooms top wall: scan y=600..700, column x=700 ===');
for (let y=590; y<=720; y++) {
  const v = val(700, y);
  if (v < 130) console.log(`  y=${y}  val=${v}  (${(y/H*100).toFixed(1)}%)`);
}

console.log('\n=== Bottom rooms top wall: scan y=600..700, column x=1500 ===');
for (let y=590; y<=720; y++) {
  const v = val(1500, y);
  if (v < 130) console.log(`  y=${y}  val=${v}  (${(y/H*100).toFixed(1)}%)`);
}

console.log('\n=== Bottom rooms bottom wall: scan y=1280..1340, column x=700 ===');
for (let y=1280; y<=1340; y++) {
  const v = val(700, y);
  if (v < 130) console.log(`  y=${y}  val=${v}  (${(y/H*100).toFixed(1)}%)`);
}

// ── Generate debug_overlay.png ────────────────────────────────────────────
// Current zones (from FloorPlanMap.tsx)
const zones = [
  { id:'vchod',     l:0,    t:28.0, w:17.0,  h:67.0,  c:[255,140,0,  80], click:false },
  { id:'wc',        l:16.6, t:13.0, w:7.0,   h:24.2,  c:[128,0, 128, 80], click:false },
  { id:'schodisko', l:23.6, t:13.0, w:35.2,  h:24.2,  c:[128,0, 128, 80], click:false },
  { id:'r22/17',    l:58.8, t:13.0, w:18.4,  h:24.2,  c:[0,  0, 200,130], click:true  },
  { id:'r23/18 ⚠', l:77.2, t:13.0, w:20.1,  h:24.2,  c:[255,0, 0,  160], click:true  }, // highlighted in red
  { id:'chodba',    l:16.6, t:37.2, w:80.7,  h:7.5,   c:[128,128,0,  80], click:false },
  { id:'r19/14',    l:16.6, t:44.7, w:31.2,  h:50.5,  c:[0,  180,0,  130], click:true  },
  { id:'r20/15',    l:47.8, t:44.7, w:10.6,  h:50.5,  c:[0,  150,200,130], click:true  },
  { id:'r21/16',    l:58.4, t:44.7, w:38.9,  h:50.5,  c:[150,0, 200,130], click:true  },
];

function px(p, total) { return Math.round(p/100*total); }

const rects = zones.map(z => {
  const x=px(z.l,W), y=px(z.t,H), w=px(z.w,W), h=px(z.h,H);
  const [r,g,b,a]=z.c;
  const sw = z.click ? 5 : 2;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}"
        fill="rgba(${r},${g},${b},${(a/255).toFixed(2)})"
        stroke="rgb(${r},${g},${b})" stroke-width="${sw}"/>
  <text x="${x+5}" y="${y+24}" font-size="22" font-weight="bold" font-family="sans-serif"
        fill="rgb(${r},${g},${b})" paint-order="stroke" stroke="white" stroke-width="4">${z.id}</text>
  <text x="${x+5}" y="${y+46}" font-size="17" font-family="monospace"
        fill="rgb(${r},${g},${b})" paint-order="stroke" stroke="white" stroke-width="3">
    L${z.l} T${z.t} W${z.w} H${z.h}
  </text>`;
}).join('');

// Cyan guide lines for key y levels
const guides = `
  <line x1="0" y1="${px(37.2,H)}" x2="${W}" y2="${px(37.2,H)}" stroke="cyan" stroke-width="2" opacity="0.8"/>
  <line x1="0" y1="${px(44.7,H)}" x2="${W}" y2="${px(44.7,H)}" stroke="cyan" stroke-width="2" opacity="0.8"/>
  <line x1="0" y1="${px(13.0,H)}" x2="${W}" y2="${px(13.0,H)}" stroke="yellow" stroke-width="2" opacity="0.7"/>
  <text x="4" y="${px(13,H)+18}" font-size="20" fill="yellow" font-family="monospace">13%</text>
  <text x="4" y="${px(37.2,H)+18}" font-size="20" fill="cyan" font-family="monospace">37.2%</text>
  <text x="4" y="${px(44.7,H)+18}" font-size="20" fill="cyan" font-family="monospace">44.7%</text>
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${guides}${rects}</svg>`;

await sharp('client/public/floor_2.png')
  .composite([{ input: Buffer.from(svg), blend: 'over' }])
  .toFile('debug_overlay.png');
console.log('\nSaved debug_overlay.png');
