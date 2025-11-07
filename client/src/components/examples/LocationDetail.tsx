import { useState } from 'react';
import LocationDetail from '../LocationDetail';
import { Button } from '@/components/ui/button';

export default function LocationDetailExample() {
  const [open, setOpen] = useState(false);
  
  const location = {
    id: '205',
    name: 'Biology Lab',
    roomNumber: '205',
    floor: 'Floor 2',
    type: 'classroom' as const,
    description: 'Science laboratory equipped for biology experiments and demonstrations',
  };
  
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Location Detail</Button>
      <LocationDetail 
        location={location} 
        open={open} 
        onClose={() => setOpen(false)}
        onShowRoute={() => console.log('Show route clicked')}
      />
    </div>
  );
}
