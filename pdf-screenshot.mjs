import puppeteer from 'puppeteer';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

const pdfAbsPath = resolve('./client/public/floor 2.pdf').replace(/\\/g, '/');
const outPath = resolve('./client/public/floor_2.png');

// Embed PDF in plain HTML — no browser chrome, no sidebar, no toolbar
const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1920px; height: 1358px; overflow: hidden; background: white; }
  embed { width: 1920px; height: 1358px; display: block; }
</style>
</head>
<body>
  <embed src="file:///${pdfAbsPath}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit"
         type="application/pdf" width="1920" height="1358">
</body>
</html>`;

// Write temp HTML
writeFileSync('./pdf-temp.html', html);
const htmlUrl = `file:///${resolve('./pdf-temp.html').replace(/\\/g, '/')}`;

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--allow-file-access-from-files'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1358, deviceScaleFactor: 2 });
await page.goto(htmlUrl, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 4000));

// Save raw screenshot for analysis
await page.screenshot({ path: outPath.replace('floor_2.png', 'floor_2_raw.png') });
await browser.close();

console.log('Saved floor_2_raw.png');
