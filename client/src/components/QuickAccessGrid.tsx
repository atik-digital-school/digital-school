import { Building2, Utensils, BookOpen, Heart, DoorOpen, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickAccessItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface QuickAccessGridProps {
  onSelect: (id: string) => void;
}

const quickAccessItems: QuickAccessItem[] = [
  { id: 'office', label: 'Main Office', icon: <Building2 className="h-12 w-12" /> },
  { id: 'cafeteria', label: 'Cafeteria', icon: <Utensils className="h-12 w-12" /> },
  { id: 'library', label: 'Library', icon: <BookOpen className="h-12 w-12" /> },
  { id: 'nurse', label: 'Nurse', icon: <Heart className="h-12 w-12" /> },
  { id: 'restrooms', label: 'Restrooms', icon: <DoorOpen className="h-12 w-12" /> },
  { id: 'emergency', label: 'Emergency Exit', icon: <MapPin className="h-12 w-12" /> },
];

export default function QuickAccessGrid({ onSelect }: QuickAccessGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {quickAccessItems.map((item) => (
        <Button
          key={item.id}
          variant="outline"
          onClick={() => onSelect(item.id)}
          className="min-h-32 flex-col gap-3 text-xl font-medium hover-elevate active-elevate-2"
          data-testid={`button-quick-${item.id}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Button>
      ))}
    </div>
  );
}
