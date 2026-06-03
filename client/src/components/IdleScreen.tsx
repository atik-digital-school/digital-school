import { useEffect } from 'react';
import schoolBuilding from '@assets/generated_images/school.png';
import schoolLogo from '@assets/generated_images/school-logo.png';

interface IdleScreenProps {
  onActivate: () => void;
}

export default function IdleScreen({ onActivate }: IdleScreenProps) {
  useEffect(() => {
    const handleInteraction = () => {
      onActivate();
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [onActivate]);

  return (
      <div
          className="fixed inset-0 z-50 cursor-pointer overflow-hidden"
          data-testid="screen-idle"
      >
        {/* Background image */}
        <div
            className="absolute inset-0 bg-cover bg-center scale-[1.03]"
            style={{ backgroundImage: `url(${schoolBuilding})` }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950/85" />

        {/* Decorative lights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.25),_transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_25%)]" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-between px-8 py-10 text-center">
          <div />

          {/* Center content */}
          <div className="flex flex-col items-center">
            {/* Logo section */}
            {/* Logo pill */}
            <div className="flex items-center gap-3.5 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 border border-white/30">
                <img
                    src={schoolLogo}
                    alt="School Logo"
                    className="h-7 w-7 object-contain"
                    data-testid="img-school-logo"
                />
              </div>
              <div className="flex flex-col">
    <span className="text-[10px] uppercase tracking-widest text-white/50">
      SPŠ stavebná a geodetická
    </span>
              </div>
            </div>

            {/* Text section */}
            <div className="mt-12 max-w-5xl space-y-6">
              <div
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium tracking-wide text-white/85 backdrop-blur-md">
                Interaktívny informačný kiosk
              </div>

              <h1
                  className="text-5xl font-extrabold tracking-tight text-white drop-shadow-2xl md:text-7xl"
                  data-testid="text-welcome"
              >
                SPŠ stavebná a geodetická
              </h1>

              <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/70 md:text-3xl">
                Digitálny sprievodca budovou školy
              </p>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col items-center gap-4">
            <div
                className="inline-flex animate-pulse items-center rounded-full border border-white/20 bg-white/10 px-7 py-3 text-lg font-medium text-white shadow-2xl backdrop-blur-md md:text-2xl"
                data-testid="text-tap-prompt"
            >
              Kliknite kdekoľvek pre začatie
            </div>

            <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/65 backdrop-blur-sm">
              Dotyková navigácia pre návštevníkov školy
            </div>
          </div>
        </div>
      </div>
  );
}