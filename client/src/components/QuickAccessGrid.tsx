import { Building2, DoorOpen, MapPin, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickAccessItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface QuickAccessGridProps {
  onSelect: (id: string) => void;
}

const quickAccessItems: QuickAccessItem[] = [
  {
    id: 'office',
    label: 'Riaditeľstvo',
    description: 'Administratíva a vedenie školy',
    icon: <Building2 className="h-10 w-10" />,
  },
  {
    id: 'classroom',
    label: 'Učebne',
    description: 'Zobrazí sa zoznam všetkých učební',
    icon: <GraduationCap className="h-10 w-10" />,
  },
  {
    id: 'restrooms',
    label: 'WC',
    description: 'Rýchly prístup k sociálnym zariadeniam',
    icon: <DoorOpen className="h-10 w-10" />,
  },
  {
    id: 'emergency',
    label: 'Núdzový východ',
    description: 'Dôležité orientačné body v budove',
    icon: <MapPin className="h-10 w-10" />,
  },
];

export default function QuickAccessGrid({ onSelect }: QuickAccessGridProps) {
  return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {quickAccessItems.map((item) => (
            <Button
                key={item.id}
                variant="outline"
                onClick={() => onSelect(item.id)}
                className="group relative h-auto min-h-[156px] justify-start overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 px-6 py-6 text-left shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_38px_rgba(37,99,235,0.12)]"
                data-testid={`button-quick-${item.id}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.08),_transparent_28%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex w-full items-start gap-5">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-100 to-cyan-50 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white">
                  {item.icon}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="text-2xl font-semibold text-slate-900">
                    {item.label}
                  </div>
                  <p className="text-base leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </Button>
        ))}
      </div>
  );
}