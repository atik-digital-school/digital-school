import { ChevronRight, MapPin, DoorOpen, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Location {
  id: string;
  name: string;
  roomNumber: string;
  floor: string;
  type: 'classroom' | 'office' | 'facility' | 'department';
  description?: string;
}

interface LocationCardProps {
  location: Location;
  onClick: () => void;
}

const iconMap = {
  classroom: DoorOpen,
  office: Building2,
  facility: MapPin,
  department: Users,
};

export default function LocationCard({ location, onClick }: LocationCardProps) {
  const Icon = iconMap[location.type];
  
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="w-full h-20 justify-start px-6 border-b hover-elevate active-elevate-2 rounded-none"
      data-testid={`card-location-${location.id}`}
    >
      <Icon className="h-6 w-6 text-primary flex-shrink-0" />
      <div className="flex-1 text-left ml-4">
        <div className="text-xl font-semibold" data-testid={`text-location-name-${location.id}`}>
          {location.name}
        </div>
        <div className="text-lg text-muted-foreground" data-testid={`text-location-room-${location.id}`}>
          Room {location.roomNumber} • {location.floor}
        </div>
      </div>
      <ChevronRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
    </Button>
  );
}
