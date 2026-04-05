import { ChevronRight, MapPin, DoorOpen, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Location = {
  id: string;
  name: string;
  roomNumber: string;
  floor: string;
  type: string;
  description?: string | null;
  x?: number | null;
  y?: number | null;
  width?: number | null;
  height?: number | null;
};

interface LocationCardProps {
  location: Location;
  onClick: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  classroom: DoorOpen,
  office: Building2,
  facility: MapPin,
  department: Users,
};

export default function LocationCard({ location, onClick }: LocationCardProps) {
  const Icon = iconMap[location.type] || DoorOpen;

  return (
      <Button
          variant="ghost"
          onClick={onClick}
          className="group h-auto w-full justify-start overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/92 px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-[0_16px_32px_rgba(37,99,235,0.12)]"
          data-testid={`card-location-${location.id}`}
      >
        <div className="flex w-full items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-blue-100 to-cyan-50 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white">
            <Icon className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1 text-left">
            <div
                className="truncate text-xl font-semibold text-slate-900"
                data-testid={`text-location-name-${location.id}`}
            >
              {location.name}
            </div>

            <div
                className="mt-1 text-base text-slate-500"
                data-testid={`text-location-room-${location.id}`}
            >
              Miestnosť {location.roomNumber} • {location.floor}
            </div>
          </div>

          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </Button>
  );
}