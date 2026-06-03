import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloorSelectorProps {
  floors: string[];
  activeFloor: string;
  onFloorChange: (floor: string) => void;
}

export default function FloorSelector({
                                        floors,
                                        activeFloor,
                                        onFloorChange,
                                      }: FloorSelectorProps) {
  return (
      <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900">Výber podlažia</div>
            <div className="text-sm text-slate-500">Zvoľte poschodie pre zobrazenie mapy</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {floors.map((floor) => {
            const isActive = activeFloor === floor;

            return (
                <Button
                    key={floor}
                    variant="ghost"
                    onClick={() => onFloorChange(floor)}
                    className={[
                      'h-14 min-w-[140px] rounded-2xl px-6 text-base font-semibold transition-all duration-200',
                      isActive
                          ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                          : 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700',
                    ].join(' ')}
                    data-testid={`button-floor-${floor.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {floor}
                </Button>
            );
          })}
        </div>
      </div>
  );
}