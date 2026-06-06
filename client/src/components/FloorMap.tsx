import { useMemo, useState } from 'react';
import { ZoomIn, ZoomOut, Navigation, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Location } from '@/components/LocationCard';
import { usePdfImage } from '@/hooks/usePdfImage';

interface FloorMapProps {
    floor: string;
    floorPlanUrl?: string | null;
    locations?: Location[];
    selectedLocation?: string | null;
    onSelect?: (roomNumber: string) => void;
}

// Layout constants
const SVG_W = 960;
const SVG_H = 680;

// "You are here" marker — entrance, bottom-center of building
const ENTRANCE_X = SVG_W / 2;
const ENTRANCE_Y = SVG_H - 64;

// Corridor Y-axis (horizontal hallway in middle of building)
const CORRIDOR_Y = SVG_H - 140;

// Room grid layout
const COLS = 3;
const CELL_W = 190;
const CELL_H = 108;
const GAP_X = 28;
const GAP_Y = 32;
const GRID_START_X = (SVG_W - (COLS * CELL_W + (COLS - 1) * GAP_X)) / 2;
const GRID_START_Y = 68;

function getRoomPosition(index: number, total: number) {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const x = GRID_START_X + col * (CELL_W + GAP_X);
    const y = GRID_START_Y + row * (CELL_H + GAP_Y);
    return { x, y, cx: x + CELL_W / 2, cy: y + CELL_H / 2 };
}

function buildRoutePath(targetCx: number, targetCy: number, targetY: number): string {
    // From entrance → up to corridor → across → up to room center
    const roomBottomY = targetY + CELL_H;
    return [
        `M ${ENTRANCE_X} ${ENTRANCE_Y}`,
        `L ${ENTRANCE_X} ${CORRIDOR_Y}`,
        `L ${targetCx} ${CORRIDOR_Y}`,
        `L ${targetCx} ${roomBottomY}`,
    ].join(' ');
}

const TYPE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
    classroom: { fill: 'rgba(239,246,255,0.97)', stroke: 'rgba(147,197,253,0.7)', text: '#1e40af' },
    office:    { fill: 'rgba(240,253,244,0.97)', stroke: 'rgba(134,239,172,0.7)', text: '#166534' },
    facility:  { fill: 'rgba(255,251,235,0.97)', stroke: 'rgba(253,230,138,0.7)', text: '#92400e' },
    department:{ fill: 'rgba(245,243,255,0.97)', stroke: 'rgba(196,181,253,0.7)', text: '#5b21b6' },
};

const TYPE_LABEL: Record<string, string> = {
    classroom:  'Učebňa',
    office:     'Kancelária',
    facility:   'Zariadenie',
    department: 'Oddelenie',
};

export default function FloorMap({
                                     floor,
                                     floorPlanUrl = null,
                                     locations = [],
                                     selectedLocation,
                                     onSelect = () => {},
                                 }: FloorMapProps) {
    const [zoom, setZoom] = useState(1);
    const floorPlanImage = usePdfImage(floorPlanUrl);
    const [panX, setPanX] = useState(0);
    const [panY, setPanY] = useState(0);

    const selectedIndex = locations.findIndex((l) => l.roomNumber === selectedLocation);

    const routeInfo = useMemo(() => {
        if (selectedIndex === -1) return null;
        const pos = getRoomPosition(selectedIndex, locations.length);
        return {
            path: buildRoutePath(pos.cx, pos.cy, pos.y),
            targetCx: pos.cx,
            targetCy: pos.cy,
            targetY: pos.y,
        };
    }, [selectedIndex, locations.length]);

    const handleReset = () => {
        setZoom(1);
        setPanX(0);
        setPanY(0);
    };

    // Total rows needed
    const rows = Math.ceil(locations.length / COLS);
    const gridH = rows * (CELL_H + GAP_Y) - GAP_Y;

    return (
        <div className="relative h-[680px] w-full overflow-hidden rounded-[2.25rem] border border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
             style={{
                 background: 'linear-gradient(160deg, #f0f7ff 0%, #e8f4fd 40%, #f5f3ff 100%)',
             }}
        >
            {/* Floor badge */}
            <div className="absolute left-5 top-5 z-10 rounded-[1.25rem] border border-white/80 bg-white/95 px-5 py-3 shadow-lg backdrop-blur-md">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Podlažie</div>
                <div className="mt-0.5 text-xl font-bold text-slate-900 leading-tight">{floor}</div>
            </div>

            {/* Legend */}
            <div className="absolute right-5 top-5 z-10 rounded-[1.25rem] border border-white/80 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md space-y-2">
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <div className="h-3 w-3 rounded-full bg-blue-500 shadow-sm" />
                    Vybraná miestnosť
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm" />
                    Váš vstup
                </div>
                {routeInfo && (
                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <div className="h-0.5 w-5 rounded-full bg-gradient-to-r from-blue-600 to-sky-400" />
                        Trasa
                    </div>
                )}
            </div>

            {/* Hint */}
            {!routeInfo && (
                <div className="absolute bottom-5 left-5 z-10 max-w-xs rounded-[1.1rem] border border-white/80 bg-white/95 px-4 py-2.5 shadow-md backdrop-blur-md">
                    <div className="flex items-center gap-2 text-sm text-slate-500 leading-snug">
                        <LocateFixed className="h-4 w-4 flex-shrink-0 text-blue-400" />
                        Kliknite na miestnosť pre výber. Trasa sa zobrazí po kliknutí na „Zobraziť trasu".
                    </div>
                </div>
            )}

            {/* Zoom controls */}
            <div className="absolute bottom-5 right-5 z-10 flex flex-col gap-2.5">
                <Button size="icon" variant="secondary"
                        onClick={() => setZoom((z) => Math.min(z + 0.2, 2.4))}
                        className="h-12 w-12 rounded-2xl border border-slate-200 bg-white/95 shadow-lg hover:scale-105 hover:bg-white transition"
                >
                    <ZoomIn className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="secondary"
                        onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
                        className="h-12 w-12 rounded-2xl border border-slate-200 bg-white/95 shadow-lg hover:scale-105 hover:bg-white transition"
                >
                    <ZoomOut className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="secondary"
                        onClick={handleReset}
                        className="h-12 w-12 rounded-2xl border border-slate-200 bg-white/95 shadow-lg hover:scale-105 hover:bg-white transition"
                >
                    <Navigation className="h-5 w-5" />
                </Button>
            </div>

            {/* SVG Map */}
            <div
                className="absolute inset-0 origin-center"
                style={{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`, transition: 'transform 0.3s ease' }}
            >
                <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="h-full w-full" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    <defs>
                        {/* Route gradient */}
                        <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>

                        {/* Selected room glow */}
                        <filter id="roomGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* Route glow */}
                        <filter id="routeGlow" x="-10%" y="-10%" width="120%" height="120%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* Entrance pulse */}
                        <radialGradient id="entranceGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Floor plan background image */}
                    {floorPlanImage && (
                        <image
                            href={floorPlanImage}
                            x={20} y={20}
                            width={SVG_W - 40}
                            height={SVG_H - 40}
                            preserveAspectRatio="xMidYMid meet"
                            opacity={0.4}
                        />
                    )}

                    {/* Building outline */}
                    <rect x={20} y={20} width={SVG_W - 40} height={SVG_H - 40} rx={36}
                          fill={floorPlanImage ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.60)'}
                          stroke="rgba(148,163,184,0.25)" strokeWidth={2}
                    />

                    {/* Corridor strip */}
                    <rect
                        x={48} y={CORRIDOR_Y - 18} width={SVG_W - 96} height={40} rx={20}
                        fill="rgba(226,232,240,0.55)" stroke="rgba(148,163,184,0.15)" strokeWidth={1.5}
                    />
                    <text x={SVG_W / 2} y={CORRIDOR_Y + 6} textAnchor="middle"
                          fill="rgb(148,163,184)" fontSize={11} fontWeight={600} letterSpacing="0.12em"
                    >
                        CHODBA
                    </text>

                    {/* Entrance zone */}
                    <rect x={ENTRANCE_X - 60} y={CORRIDOR_Y + 32} width={120} height={SVG_H - CORRIDOR_Y - 70}
                          rx={18} fill="rgba(241,245,249,0.80)" stroke="rgba(148,163,184,0.2)" strokeWidth={1.5}
                    />
                    <text x={ENTRANCE_X} y={CORRIDOR_Y + 58} textAnchor="middle"
                          fill="rgb(148,163,184)" fontSize={10} fontWeight={600} letterSpacing="0.12em"
                    >
                        VCHOD
                    </text>

                    {/* Empty floor message */}
                    {locations.length === 0 && (
                        <text x={SVG_W / 2} y={SVG_H / 2} textAnchor="middle"
                              fill="rgb(148,163,184)" fontSize={18} fontWeight={600}
                        >
                            Na tomto poschodí nie sú definované miestnosti
                        </text>
                    )}

                    {/* Route path — drawn BELOW rooms */}
                    {routeInfo && (
                        <>
                            {/* Glow effect */}
                            <path d={routeInfo.path} fill="none"
                                  stroke="rgba(56,189,248,0.35)" strokeWidth={18}
                                  strokeLinecap="round" strokeLinejoin="round"
                            />
                            {/* Main route line */}
                            <path d={routeInfo.path} fill="none"
                                  stroke="url(#routeGrad)" strokeWidth={5}
                                  strokeLinecap="round" strokeLinejoin="round"
                                  strokeDasharray="14 10"
                                  filter="url(#routeGlow)"
                            >
                                <animate attributeName="stroke-dashoffset" from="240" to="0" dur="1.2s" fill="freeze" />
                            </path>
                            {/* Solid outline for contrast */}
                            <path d={routeInfo.path} fill="none"
                                  stroke="white" strokeWidth={1.5}
                                  strokeLinecap="round" strokeLinejoin="round"
                                  strokeDasharray="14 10" opacity={0.5}
                            >
                                <animate attributeName="stroke-dashoffset" from="240" to="0" dur="1.2s" fill="freeze" />
                            </path>

                            {/* Direction arrows along the route */}
                            {[0.35, 0.65].map((t, i) => {
                                // Approximate arrow position along the path
                                const ax = ENTRANCE_X + (routeInfo.targetCx - ENTRANCE_X) * Math.min(t * 2, 1);
                                const ay = CORRIDOR_Y;
                                return (
                                    <g key={i} transform={`translate(${ax}, ${ay})`}>
                                        <circle r={7} fill="white" stroke="rgba(37,99,235,0.4)" strokeWidth={1} />
                                        <path d="M -3 -2 L 3 0 L -3 2" fill="none"
                                              stroke="#2563eb" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                                        />
                                    </g>
                                );
                            })}
                        </>
                    )}

                    {/* Rooms */}
                    {locations.map((loc, index) => {
                        const pos = getRoomPosition(index, locations.length);
                        const isSelected = selectedLocation === loc.roomNumber;
                        const colors = TYPE_COLORS[loc.type] || TYPE_COLORS.classroom;
                        const label = TYPE_LABEL[loc.type] || loc.type;

                        return (
                            <g key={loc.id} onClick={() => onSelect(loc.roomNumber)} style={{ cursor: 'pointer' }}>
                                {/* Selection glow */}
                                {isSelected && (
                                    <rect
                                        x={pos.x - 6} y={pos.y - 6}
                                        width={CELL_W + 12} height={CELL_H + 12}
                                        rx={30} fill="rgba(37,99,235,0.12)"
                                    >
                                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                                    </rect>
                                )}

                                {/* Room card */}
                                <rect
                                    x={pos.x} y={pos.y} width={CELL_W} height={CELL_H} rx={22}
                                    fill={isSelected ? 'rgba(219,234,254,0.98)' : colors.fill}
                                    stroke={isSelected ? 'rgb(37,99,235)' : colors.stroke}
                                    strokeWidth={isSelected ? 2.5 : 1.5}
                                />

                                {/* Top accent bar */}
                                <rect
                                    x={pos.x + 18} y={pos.y + 14}
                                    width={CELL_W - 36} height={6} rx={3}
                                    fill={isSelected ? 'rgba(37,99,235,0.25)' : 'rgba(226,232,240,0.8)'}
                                />

                                {/* Room number */}
                                <text
                                    x={pos.cx} y={pos.y + 54}
                                    textAnchor="middle"
                                    fill={isSelected ? 'rgb(30,64,175)' : 'rgb(15,23,42)'}
                                    fontSize={26} fontWeight={800}
                                >
                                    {loc.roomNumber}
                                </text>

                                {/* Room name (truncated) */}
                                <text
                                    x={pos.cx} y={pos.y + 76}
                                    textAnchor="middle"
                                    fill={isSelected ? 'rgb(37,99,235)' : 'rgb(71,85,105)'}
                                    fontSize={11} fontWeight={600}
                                >
                                    {loc.name.length > 18 ? loc.name.slice(0, 16) + '…' : loc.name}
                                </text>

                                {/* Type badge */}
                                <rect
                                    x={pos.cx - 28} y={pos.y + CELL_H - 26}
                                    width={56} height={16} rx={8}
                                    fill={isSelected ? 'rgba(37,99,235,0.12)' : 'rgba(226,232,240,0.6)'}
                                />
                                <text
                                    x={pos.cx} y={pos.y + CELL_H - 14}
                                    textAnchor="middle"
                                    fill={isSelected ? 'rgb(37,99,235)' : 'rgb(148,163,184)'}
                                    fontSize={9} fontWeight={700} letterSpacing="0.06em"
                                >
                                    {label.toUpperCase()}
                                </text>
                            </g>
                        );
                    })}

                    {/* Destination marker on selected room */}
                    {routeInfo && (
                        <g>
                            <circle cx={routeInfo.targetCx} cy={routeInfo.targetY - 20} r={16} fill="rgba(37,99,235,0.15)">
                                <animate attributeName="r" values="14;20;14" dur="1.8s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.8s" repeatCount="indefinite" />
                            </circle>
                            <circle cx={routeInfo.targetCx} cy={routeInfo.targetY - 20} r={9} fill="rgb(37,99,235)" />
                            <path
                                d={`M ${routeInfo.targetCx} ${routeInfo.targetY - 27} L ${routeInfo.targetCx} ${routeInfo.targetY - 13}`}
                                stroke="white" strokeWidth={2} strokeLinecap="round"
                            />
                            <path
                                d={`M ${routeInfo.targetCx - 4} ${routeInfo.targetY - 19} L ${routeInfo.targetCx + 4} ${routeInfo.targetY - 19}`}
                                stroke="white" strokeWidth={2} strokeLinecap="round"
                            />
                        </g>
                    )}

                    {/* "Ste tu" — You Are Here marker */}
                    <g>
                        {/* Pulse rings */}
                        <circle cx={ENTRANCE_X} cy={ENTRANCE_Y} r={28} fill="rgba(239,68,68,0.08)">
                            <animate attributeName="r" values="22;34;22" dur="2.2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0;0.5" dur="2.2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={ENTRANCE_X} cy={ENTRANCE_Y} r={19} fill="rgba(239,68,68,0.14)" />
                        <circle cx={ENTRANCE_X} cy={ENTRANCE_Y} r={12} fill="rgb(239,68,68)" />
                        {/* White dot center */}
                        <circle cx={ENTRANCE_X} cy={ENTRANCE_Y} r={5} fill="white" />

                        {/* Label bubble */}
                        <rect x={ENTRANCE_X - 38} y={ENTRANCE_Y + 18} width={76} height={24} rx={12}
                              fill="white" stroke="rgba(239,68,68,0.25)" strokeWidth={1.5}
                        />
                        <text x={ENTRANCE_X} y={ENTRANCE_Y + 34} textAnchor="middle"
                              fill="rgb(239,68,68)" fontSize={11} fontWeight={800} letterSpacing="0.04em"
                        >
                            STE TU
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
