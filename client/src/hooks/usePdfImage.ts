import { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export function usePdfImage(url: string | null, scale = 2): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    (async () => {
      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport }).promise;
      if (!cancelled) setDataUrl(canvas.toDataURL('image/png'));
    })();

    return () => { cancelled = true; };
  }, [url, scale]);

  return dataUrl;
}
