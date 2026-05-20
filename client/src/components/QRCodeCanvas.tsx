import { useEffect, useRef } from 'react';

export default function QRCodeCanvas({ value, size = 200 }: any) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!ref.current) return;

            const makeQR = () => {
                if (cancelled) return;
                const QRCode = (window as any).QRCode;
                if (!QRCode) return;

                ref.current!.innerHTML = '';

                new QRCode(ref.current, {
                    text: value,
                    width: size,
                    height: size,
                    colorDark: '#1e293b',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.M,
                });
            };

            // уже загружен
            if ((window as any).QRCode) {
                makeQR();
                return;
            }

            // уже есть script
            let script = document.getElementById('qrcode-script') as HTMLScriptElement;

            if (!script) {
                script = document.createElement('script');
                script.id = 'qrcode-script';
                script.src =
                    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
                document.head.appendChild(script);
            }

            script.onload = makeQR;
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [value, size]);

    return <div ref={ref} style={{ width: size, height: size }} />;
}
