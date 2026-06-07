import { createCanvas, loadImage } from 'canvas';
import { writeFileSync } from 'fs';

// Load the white-page-only crop (2261x1600)
const img = await loadImage('./client/public/floor_2_raw.png');

// The white page sits at x=789, y=0 inside the 3840x2716 raw screenshot.
// Within that page the building drawing occupies:
//   x: 789+20=809  →  789+2210=2999   (width  ~2190)
//   y: 0+78        →  0+1400=1400     (height ~1322)
// Add 30px padding each side.
const sx = 789 + 20  - 30;   // 779
const sy = 0  + 78   - 30;   //  48
const sw = 2190 + 60;         // 2250
const sh = 1322 + 60;         // 1382

const out = createCanvas(sw, sh);
const ctx = out.getContext('2d');
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, sw, sh);
ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

writeFileSync('./client/public/floor_2.png', out.toBuffer('image/png'));
console.log(`Saved floor_2.png (${sw}x${sh})`);
