import { Search, X } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({
                                      value,
                                      onChange,
                                      placeholder = 'Vyhľadajte miestnosti, kancelárie alebo zariadenia...',
                                  }: SearchBarProps) {
    return (
        <div
            className="relative w-full rounded-[1.75rem] border border-slate-200 bg-white/90 p-2 shadow-lg backdrop-blur-xl"
            data-testid="search-bar"
        >
            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.08),_transparent_30%)]" />

            <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Search className="h-4 w-4" />
                </div>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="h-12 w-full rounded-xl border border-slate-200/80 bg-white pl-14 pr-14 text-lg text-slate-800 shadow-inner outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    data-testid="input-search"
                />

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                        data-testid="button-clear-search"
                        aria-label="Vymazať vyhľadávanie"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}