import { useEffect } from 'react';
import schoolBuilding from '@assets/generated_images/Modern_school_building_exterior_bad95cdf.png';
import schoolLogo from '@assets/generated_images/School_logo_icon_4eb4a5ce.png';

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
        <div
            className="absolute inset-0 bg-cover bg-center scale-[1.03]"
            style={{ backgroundImage: `url(${schoolBuilding})` }}
        />

        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/55 to-slate-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.30),_transparent_32%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.10),_transparent_25%)]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-between px-8 py-10 text-center">
          <div />

          <div className="flex flex-col items-center">
            <div className="rounded-[2.25rem] border border-white/20 bg-white/12 p-6 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-4">
                <img
                    src={schoolLogo}
                    alt="School Logo"
                    className="h-40 w-40 object-contain drop-shadow-2xl md:h-48 md:w-48"
                    data-testid="img-school-logo"
                />
              </div>
            </div>

            <div className="mt-10 max-w-5xl space-y-5">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium tracking-wide text-white/85 backdrop-blur-md">
                Interaktívny informačný kiosk
              </div>

              <h1
                  className="text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-7xl"
                  data-testid="text-welcome"
              >
                SPŠ stavebná a geodetická
              </h1>

              <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/80 md:text-3xl">
                Digitálny sprievodca budovou školy
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div
                className="inline-flex animate-pulse items-center rounded-full border border-white/20 bg-white/10 px-7 py-3 text-lg font-medium text-white shadow-xl backdrop-blur-md md:text-2xl"
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