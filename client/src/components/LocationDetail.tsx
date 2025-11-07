import { X, MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Location } from './LocationCard';

interface LocationDetailProps {
  location: Location | null;
  open: boolean;
  onClose: () => void;
  onShowRoute: () => void;
}

export default function LocationDetail({ location, open, onClose, onShowRoute }: LocationDetailProps) {
  if (!location) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-location-detail">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold pr-8" data-testid="text-location-detail-name">
            {location.name}
          </DialogTitle>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="absolute right-4 top-4 w-12 h-12"
            data-testid="button-close-detail"
          >
            <X className="h-8 w-8" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          <div className="flex items-start gap-4">
            <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <div className="text-lg font-medium">Poloha</div>
              <div className="text-xl text-muted-foreground">
                Miestnosť {location.roomNumber} • {location.floor}
              </div>
            </div>
          </div>

          {location.description && (
            <div className="flex items-start gap-4">
              <div className="h-6 w-6 flex-shrink-0" />
              <div>
                <div className="text-lg font-medium">Popis</div>
                <div className="text-xl text-muted-foreground">
                  {location.description}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4">
            <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <div className="text-lg font-medium">Otváracie hodiny</div>
              <div className="text-xl text-muted-foreground">
                Pondelok - Piatok: 8:00 - 15:30
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <div className="text-lg font-medium">Kontakt</div>
              <div className="text-xl text-muted-foreground">
                Linka {location.roomNumber}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            onClick={onShowRoute}
            className="flex-1 h-16 text-xl gap-3"
            data-testid="button-show-route"
          >
            <Navigation className="h-6 w-6" />
            Zobraziť trasu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
