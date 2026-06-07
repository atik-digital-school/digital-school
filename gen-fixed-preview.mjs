import sharp from 'sharp';

const W = 2250, H = 1382;

const zones = [
  { id:'vchod',     l:0,    t:28.0, w:17.0,  h:67.0,  c:[255,140,0,  80], click:false },
  { id:'wc',        l:16.6, t:13.0, w:7.0,   h:24.2,  c:[128,0, 128, 80], click:false },
  { id:'schodisko', l:23.6, t:13.0, w:35.2,  h:24.2,  c:[128,0, 128, 80], click:false },
  { id:'r22/17',    l:58.8, t:13.0, w:18.4,  h:24.2,  c:[0,  0, 200,130], click:true  },
  { id:'r23/18',    l:78.9, t:13.0, w:18.4,  h:24.2,  c:[0,  180,0,  160], click:true  },
  { id:'chodba',    l:16.6, t:37.2, w:80.7,  h:7.5,   c:[128,128,0,  80], click:false },
  { id:'r19/14',    l:16.6, t:48.8, w:31.2,  h:43.0,  c:[220,0,  0,  130], click:true  },
  { id:'r20/15',    l:47.8, t:48.8, w:10.6,  h:43.0,  c:[0,  150,200,130], click:true  },
  { id:'r21/16',    l:58.4, t:48.8, w:38.9,  h:43.0,  c:[150,0, 200,130], click:true  },
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
  <text x="${x+5}" y="${y+22}" font-size="20" font-weight="bold" font-family="sans-serif"
        fill="rgb(${r},${g},${b})" paint-order="stroke" stroke="white" stroke-width="4">${z.id}</text>`;
}).join('');

const guides = `
  <line x1="0" y1="${px(13.0,H)}"  x2="${W}" y2="${px(13.0,H)}"  stroke="yellow" stroke-width="2" opacity="0.7"/>
  <line x1="0" y1="${px(37.2,H)}"  x2="${W}" y2="${px(37.2,H)}"  stroke="cyan"   stroke-width="2" opacity="0.8"/>
  <line x1="0" y1="${px(48.8,H)}"  x2="${W}" y2="${px(48.8,H)}"  stroke="lime"   stroke-width="2" opacity="0.7"/>
  <line x1="0" y1="${px(91.8,H)}"  x2="${W}" y2="${px(91.8,H)}"  stroke="red"    stroke-width="2" stroke-dasharray="8 4" opacity="0.7"/>
  <text x="4" y="${px(91.8,H)-4}"  font-size="18" fill="red"    font-family="monospace">91.8% bottom (43.0% height)</text>
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${guides}${rects}</svg>`;
await sharp('client/public/floor_2.png')
  .composite([{ input: Buffer.from(svg), blend: 'over' }])
  .toFile('debug_overlay.png');
console.log('Saved debug_overlay.png  (height 46.4% → 43.0%)');
