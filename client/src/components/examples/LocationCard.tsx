import LocationCard from '../LocationCard';

export default function LocationCardExample() {
  const location = {
    id: '101',
    name: 'Biology Lab',
    roomNumber: '205',
    floor: 'Floor 2',
    type: 'classroom' as const,
    description: 'Science laboratory for biology classes',
  };
  
  return (
    <div className="max-w-2xl">
      <LocationCard location={location} onClick={() => console.log('Location clicked')} />
    </div>
  );
}
