import { useState } from 'react';
import FloorSelector from '../FloorSelector';

export default function FloorSelectorExample() {
  const [activeFloor, setActiveFloor] = useState('Floor 1');
  const floors = ['Ground Floor', 'Floor 1', 'Floor 2', 'Floor 3'];
  
  return (
    <div className="p-8">
      <FloorSelector 
        floors={floors} 
        activeFloor={activeFloor} 
        onFloorChange={setActiveFloor} 
      />
    </div>
  );
}
