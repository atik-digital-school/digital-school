import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search for rooms, offices, or facilities..." }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-16 pl-16 pr-16 text-2xl rounded-lg border-2"
        data-testid="input-search"
      />
      {value && (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2"
          data-testid="button-clear-search"
        >
          <X className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
