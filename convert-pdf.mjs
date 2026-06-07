import { createCanvas } from 'canvas';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { writeFileSync } from 'fs';

import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { resolve } from 'path';

const workerPath = resolve('./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).toString();

import { readFileSync } from 'fs';
const data = new Uint8Array(readFileSync('./client/public/floor 2.pdf'));
const pdf = await getDocument({ data }).promise;
const page = await pdf.getPage(1);
const viewport = page.getViewport({ scale: 3 });

const canvas = createCanvas(viewport.width, viewport.height);
const ctx = canvas.getContext('2d');

// Fill background so transparent/white lines become visible
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, viewport.width, viewport.height);

await page.render({
  canvasContext: ctx,
  viewport,
  canvasFactory: {
    create: (w, h) => {
      const c = createCanvas(w, h);
      return { canvas: c, context: c.getContext('2d') };
    },
    reset: (obj, w, h) => {
      obj.canvas.width = w;
      obj.canvas.height = h;
    },
    destroy: () => {},
  },
}).promise;

const buf = canvas.toBuffer('image/png');
writeFileSync('./client/public/floor_2.png', buf);
console.log(`Saved floor_2.png  (${viewport.width}x${viewport.height})`);
