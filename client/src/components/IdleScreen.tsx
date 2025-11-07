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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
      data-testid="screen-idle"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${schoolBuilding})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative z-10 flex flex-col items-center gap-12 px-8">
        <img 
          src={schoolLogo} 
          alt="School Logo" 
          className="w-64 h-64 object-contain drop-shadow-2xl"
          data-testid="img-school-logo"
        />
        
        <div className="text-center space-y-6">
          <h1 className="text-7xl font-bold text-white drop-shadow-lg" data-testid="text-welcome">
            SPŠ stavebná a geodetická
          </h1>
          <p className="text-5xl text-white/90 animate-pulse" data-testid="text-tap-prompt">
            Kliknite kdekoľvek pre začatie
          </p>
        </div>
      </div>
    </div>
  );
}
