import { useState } from 'react';
import SearchBar from '../SearchBar';

export default function SearchBarExample() {
  const [search, setSearch] = useState('');
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <SearchBar value={search} onChange={setSearch} />
    </div>
  );
}
