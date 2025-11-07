import { Button } from '@/components/ui/button';

interface FloorSelectorProps {
  floors: string[];
  activeFloor: string;
  onFloorChange: (floor: string) => void;
}

export default function FloorSelector({ floors, activeFloor, onFloorChange }: FloorSelectorProps) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {floors.map((floor) => (
        <Button
          key={floor}
          variant={activeFloor === floor ? 'default' : 'outline'}
          onClick={() => onFloorChange(floor)}
          className="h-14 min-w-24 text-xl font-medium"
          data-testid={`button-floor-${floor.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {floor}
        </Button>
      ))}
    </div>
  );
}
