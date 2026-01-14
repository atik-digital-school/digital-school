import { useState } from "react";
import { ZoomIn, ZoomOut, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Location } from "@/components/LocationCard";

interface FloorMapProps {
    floor: string;
    locations: Location[];
    selectedLocation?: string | null;
    onSelect: (roomNumber: string) => void;
}

export default function FloorMap({
                                     floor,
                                     locations,
                                     selectedLocation,
                                     onSelect,
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

    return (
        <div className="relative w-full h-[600px] bg-card rounded-lg border-2 border-border overflow-hidden">
            <div
                className="absolute inset-0"
                style={{ transform: `scale(${zoom})`, transition: "transform 0.3s ease" }}
            >
                <svg viewBox="0 0 800 600" className="w-full h-full">
                    {/* фон этажа */}
                    <rect
                        x={50}
                        y={50}
                        width={700}
                        height={500}
                        fill="hsl(var(--muted))"
                        stroke="hsl(var(--border))"
                        strokeWidth={2}
                    />

                    {locations.length === 0 && (
                        <text
                            x={400}
                            y={300}
                            textAnchor="middle"
                            className="fill-foreground text-xl"
                        >
                            Na tomto poschodí nie sú definované miestnosti
                        </text>
                    )}

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
                                className="cursor-pointer hover:opacity-80"
                            >
                                <rect
                                    x={x}
                                    y={y}
                                    width={cellWidth}
                                    height={cellHeight}
                                    fill={
                                        isSelected
                                            ? "hsl(var(--primary) / 0.3)"
                                            : "hsl(var(--card))"
                                    }
                                    stroke={
                                        isSelected
                                            ? "hsl(var(--primary))"
                                            : "hsl(var(--border))"
                                    }
                                    strokeWidth={isSelected ? 4 : 2}
                                    rx={12}
                                />
                                <text
                                    x={x + cellWidth / 2}
                                    y={y + cellHeight / 2}
                                    textAnchor="middle"
                                    className="fill-foreground text-sm select-none"
                                    dominantBaseline="middle"
                                >
                                    {loc.name}
                                </text>
                            </g>
                        );
                    })}

                    <circle
                        cx={youX}
                        cy={youY}
                        r={14}
                        fill="hsl(var(--destructive))"
                        className="animate-pulse"
                    />
                    <text
                        x={youX}
                        y={youY + 30}
                        textAnchor="middle"
                        className="fill-foreground font-bold text-sm"
                    >
                        Ste tu
                    </text>

                    {selectedLocation && (() => {
                        const index = locations.findIndex(
                            (l) => l.roomNumber === selectedLocation
                        );
                        if (index === -1) return null;

                        const row = Math.floor(index / cols);
                        const col = index % cols;

                        const x = startX + col * (cellWidth + gapX) + cellWidth / 2;
                        const y = startY + row * (cellHeight + gapY) + cellHeight / 2;

                        return (
                            <line
                                x1={youX}
                                y1={youY}
                                x2={x}
                                y2={y}
                                stroke="hsl(var(--primary))"
                                strokeWidth={3}
                                strokeDasharray="6,4"
                            />
                        );
                    })()}
                </svg>
            </div>

            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
                >
                    <ZoomIn className="h-8 w-8" />
                </Button>

                <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
                >
                    <ZoomOut className="h-8 w-8" />
                </Button>

                <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setZoom(1)}
                >
                    <Navigation className="h-8 w-8" />
                </Button>
            </div>

            <div className="absolute top-6 left-6 bg-card/90 px-6 py-3 rounded-lg border-2 border-border shadow-lg">
                <div className="text-xl font-semibold">{floor}</div>
            </div>
        </div>
    );
}
