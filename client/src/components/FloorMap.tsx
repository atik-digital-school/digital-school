import { useState } from 'react';
import { ZoomIn, ZoomOut, Navigation, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Location } from '@/components/LocationCard';

interface FloorMapProps {
    floor: string;
    locations?: Location[];
    selectedLocation?: string | null;
    onSelect?: (roomNumber: string) => void;
}

export default function FloorMap({
                                     floor,
                                     locations = [],
                                     selectedLocation,
                                     onSelect = () => {},
                                 }: FloorMapProps) {
    const [zoom, setZoom] = useState(1);

    const cols = 3;
    const cellWidth = 180;
    const cellHeight = 120;
    const gapX = 25;
    const gapY = 25;
    const startX = 80;
    const startY = 90;

    const youX = 400;
    const youY = 520;

    const selectedIndex = locations.findIndex((l) => l.roomNumber === selectedLocation);

    return (
        <div className="relative h-[650px] w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_30%)]" />

            <div className="absolute left-6 top-6 z-10 rounded-[1.5rem] border border-white/70 bg-white/90 px-5 py-4 shadow-lg backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Podlažie</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">{floor}</div>
            </div>

            <div className="absolute bottom-6 left-6 z-10 max-w-sm rounded-[1.25rem] border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm leading-relaxed text-slate-600">
                    <LocateFixed className="h-4 w-4 flex-shrink-0 text-red-500" />
                    Červený bod označuje vašu aktuálnu polohu.
                </div>
            </div>

            <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-3">
                <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
                    className="h-14 w-14 rounded-2xl border border-slate-200 bg-white/95 shadow-lg transition hover:scale-105 hover:bg-white"
                >
                    <ZoomIn className="h-6 w-6" />
                </Button>

                <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
                    className="h-14 w-14 rounded-2xl border border-slate-200 bg-white/95 shadow-lg transition hover:scale-105 hover:bg-white"
                >
                    <ZoomOut className="h-6 w-6" />
                </Button>

                <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setZoom(1)}
                    className="h-14 w-14 rounded-2xl border border-slate-200 bg-white/95 shadow-lg transition hover:scale-105 hover:bg-white"
                >
                    <Navigation className="h-6 w-6" />
                </Button>
            </div>

            <div
                className="absolute inset-0 origin-center"
                style={{
                    transform: `scale(${zoom})`,
                    transition: 'transform 0.3s ease',
                }}
            >
                <svg viewBox="0 0 800 650" className="h-full w-full">
                    <rect
                        x={50}
                        y={50}
                        width={700}
                        height={520}
                        rx={32}
                        fill="rgba(255,255,255,0.78)"
                        stroke="rgba(148,163,184,0.32)"
                        strokeWidth={2}
                    />

                    <rect
                        x={70}
                        y={70}
                        width={660}
                        height={480}
                        rx={24}
                        fill="rgba(241,245,249,0.85)"
                        stroke="rgba(148,163,184,0.18)"
                        strokeWidth={1.5}
                    />

                    {locations.length === 0 && (
                        <text
                            x={400}
                            y={320}
                            textAnchor="middle"
                            fill="rgb(100 116 139)"
                            fontSize="20"
                            fontWeight="600"
                        >
                            Na tomto poschodí nie sú definované miestnosti
                        </text>
                    )}

                    {selectedIndex !== -1 && (() => {
                        const row = Math.floor(selectedIndex / cols);
                        const col = selectedIndex % cols;

                        const x = startX + col * (cellWidth + gapX) + cellWidth / 2;
                        const y = startY + row * (cellHeight + gapY) + cellHeight / 2;

                        return (
                            <line
                                x1={youX}
                                y1={youY}
                                x2={x}
                                y2={y}
                                stroke="rgb(37 99 235)"
                                strokeWidth={5}
                                strokeDasharray="10,8"
                                strokeLinecap="round"
                            />
                        );
                    })()}

                    {locations.map((loc, index) => {
                        const row = Math.floor(index / cols);
                        const col = index % cols;

                        const x = startX + col * (cellWidth + gapX);
                        const y = startY + row * (cellHeight + gapY);

                        const isSelected = selectedLocation === loc.roomNumber;

                        return (
                            <g
                                key={loc.id}
                                onClick={() => onSelect(loc.roomNumber)}
                                style={{ cursor: 'pointer' }}
                            >
                                <rect
                                    x={x}
                                    y={y}
                                    width={cellWidth}
                                    height={cellHeight}
                                    rx={22}
                                    fill={isSelected ? 'rgba(59,130,246,0.16)' : 'rgba(255,255,255,0.96)'}
                                    stroke={isSelected ? 'rgb(37 99 235)' : 'rgba(148,163,184,0.55)'}
                                    strokeWidth={isSelected ? 4 : 2}
                                />

                                <rect
                                    x={x + 10}
                                    y={y + 10}
                                    width={cellWidth - 20}
                                    height={34}
                                    rx={12}
                                    fill={isSelected ? 'rgba(37,99,235,0.12)' : 'rgba(241,245,249,0.95)'}
                                />

                                <text
                                    x={x + cellWidth / 2}
                                    y={y + 30}
                                    textAnchor="middle"
                                    fill="rgb(15 23 42)"
                                    fontSize="16"
                                    fontWeight="700"
                                    dominantBaseline="middle"
                                >
                                    {loc.name}
                                </text>

                                <text
                                    x={x + cellWidth / 2}
                                    y={y + 72}
                                    textAnchor="middle"
                                    fill="rgb(71 85 105)"
                                    fontSize="14"
                                    fontWeight="500"
                                    dominantBaseline="middle"
                                >
                                    Miestnosť {loc.roomNumber}
                                </text>

                                <text
                                    x={x + cellWidth / 2}
                                    y={y + 96}
                                    textAnchor="middle"
                                    fill="rgb(100 116 139)"
                                    fontSize="12"
                                    dominantBaseline="middle"
                                >
                                    {loc.type}
                                </text>
                            </g>
                        );
                    })}

                    <circle cx={youX} cy={youY} r={30} fill="rgba(239,68,68,0.14)" />
                    <circle cx={youX} cy={youY} r={18} fill="rgba(239,68,68,0.22)" />
                    <circle cx={youX} cy={youY} r={11} fill="rgb(239 68 68)" />

                    <rect
                        x={youX - 48}
                        y={youY + 24}
                        width={96}
                        height={30}
                        rx={15}
                        fill="rgba(255,255,255,0.96)"
                        stroke="rgba(239,68,68,0.28)"
                        strokeWidth={1.5}
                    />
                    <text
                        x={youX}
                        y={youY + 43}
                        textAnchor="middle"
                        fill="rgb(15 23 42)"
                        fontSize="14"
                        fontWeight="700"
                    >
                        Ste tu
                    </text>
                </svg>
            </div>
        </div>
    );
}