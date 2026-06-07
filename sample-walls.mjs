import sharp from 'sharp';

const IMG_W = 2250, IMG_H = 1382;

const { data } = await sharp('client/public/floor_2.png')
  .raw().toBuffer({ resolveWithObject: true });

function val(x, y) {
  const i = (y * IMG_W + x) * 4;
  return data[i]; // grayscale — R channel
}

// Print brightness profile along a column (step=1px, threshold mark)
function profileCol(x, yFrom, yTo, step = 1) {
  console.log(`\n── Column x=${x}, y=${yFrom}..${yTo} ──`);
  let inDark = false;
  for (let y = yFrom; y <= yTo; y += step) {
    const v = val(x, y);
    const dark = v < 130;
    if (dark && !inDark) { console.log(`  WALL START y=${y}  val=${v}`); inDark = true; }
    if (!dark && inDark) { console.log(`  WALL END   y=${y-1}  val=${val(x,y-1)}`); inDark = false; }
  }
}

// Print brightness profile along a row
function profileRow(y, xFrom, xTo, step = 1) {
  console.log(`\n── Row y=${y}, x=${xFrom}..${xTo} ──`);
  let inDark = false;
  for (let x = xFrom; x <= xTo; x += step) {
    const v = val(x, y);
    const dark = v < 130;
    if (dark && !inDark) { console.log(`  WALL START x=${x}  val=${v}  (${(x/IMG_W*100).toFixed(1)}%)`); inDark = true; }
    if (!dark && inDark) { console.log(`  WALL END   x=${x-1}  val=${val(x-1,y)}  (${((x-1)/IMG_W*100).toFixed(1)}%)`); inDark = false; }
  }
}

// ── Horizontal walls: scan down several representative columns ──────────────
// x=1500 is in the open top-right room area — good for finding chodba walls
profileCol(1500, 100, 700);
profileCol(1500, 600, 1382);

// x=400  is in the WC area top / r19 area bottom
profileCol(400, 100, 700);
profileCol(600, 100, 700);   // between WC and schodisko

// ── Vertical walls: scan across at key y levels ──────────────────────────────
// y=300 — middle of top section (WC/schodisko/r22/r23 level)
profileRow(300, 100, IMG_W - 50);

// y=560 — just below chodba (to find chodba bottom)
profileRow(560, 100, IMG_W - 50);
profileRow(600, 100, IMG_W - 50);
profileRow(620, 100, IMG_W - 50);
profileRow(640, 100, IMG_W - 50);

// y=800, y=1000 — inside bottom rooms
profileRow(800, 100, IMG_W - 50);
profileRow(1000, 100, IMG_W - 50);
