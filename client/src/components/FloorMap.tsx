import { ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface FloorMapProps {
  floor: string;
  selectedLocation?: string;
}

export default function FloorMap({ floor, selectedLocation }: FloorMapProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));

  return (
    <div className="relative w-full h-[600px] bg-card rounded-lg border-2 border-border overflow-hidden" data-testid="container-floor-map">
      <div 
        className="absolute inset-0 flex items-center justify-center p-8"
        style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}
      >
        <svg viewBox="0 0 800 600" className="w-full h-full">
          <rect x="50" y="50" width="700" height="500" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
          
          <rect x="100" y="100" width="150" height="120" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          <text x="175" y="165" textAnchor="middle" className="fill-foreground text-sm">Room 201</text>
          
          <rect x="280" y="100" width="150" height="120" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          <text x="355" y="165" textAnchor="middle" className="fill-foreground text-sm">Room 202</text>
          
          <rect x="460" y="100" width="150" height="120" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          <text x="535" y="165" textAnchor="middle" className="fill-foreground text-sm">Room 203</text>
          
          <rect x="100" y="250" width="150" height="120" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          <text x="175" y="315" textAnchor="middle" className="fill-foreground text-sm">Room 204</text>
          
          <rect x="280" y="250" width="150" height="120" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          <text x="355" y="315" textAnchor="middle" className="fill-foreground text-sm">Cafeteria</text>
          
          <rect x="460" y="250" width="150" height="120" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          <text x="535" y="315" textAnchor="middle" className="fill-foreground text-sm">Library</text>
          
          <rect x="100" y="400" width="150" height="120" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          <text x="175" y="465" textAnchor="middle" className="fill-foreground text-sm">Main Office</text>
          
          <circle cx="400" cy="300" r="15" fill="hsl(var(--destructive))" className="animate-pulse" />
          <text x="400" y="345" textAnchor="middle" className="fill-foreground font-bold text-sm">You Are Here</text>
          
          {selectedLocation && (
            <>
              <rect x="280" y="100" width="150" height="120" fill="hsl(var(--primary) / 0.3)" stroke="hsl(var(--primary))" strokeWidth="4" />
              <line x1="400" y1="300" x2="355" y2="160" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="5,5" />
            </>
          )}
        </svg>
      </div>

      <div className="absolute bottom-6 right-6 flex flex-col gap-2" data-testid="container-zoom-controls">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          className="w-16 h-16 shadow-lg"
          data-testid="button-zoom-in"
        >
          <ZoomIn className="h-8 w-8" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          className="w-16 h-16 shadow-lg"
          data-testid="button-zoom-out"
        >
          <ZoomOut className="h-8 w-8" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setZoom(1)}
          className="w-16 h-16 shadow-lg"
          data-testid="button-reset-zoom"
        >
          <Navigation className="h-8 w-8" />
        </Button>
      </div>

      <div className="absolute top-6 left-6 bg-card/95 backdrop-blur px-6 py-3 rounded-lg border-2 border-border shadow-lg">
        <div className="text-xl font-semibold" data-testid="text-current-floor">
          {floor}
        </div>
      </div>
    </div>
  );
}
