import { useState } from 'react';
import type { Location } from '@/components/LocationCard';

interface Zone {
  id: string;
  label: string;
  roomNumber?: string;
  clickable: boolean;
  color: string;
  style: { left: string; top: string; width: string; height: string };
}

// Room numbers per floor in zone order: [pos19, pos20, pos21, pos22, pos23]
// pos19 = bottom-left large, pos20 = bottom-middle small, pos21 = bottom-right large
// pos22 = top-right large,   pos23 = top-right small
const FLOOR_ROOMS: Record<string, [string, string, string, string, string]> = {
  'Prízemie':     ['5',  '7',  '8',  '9',  '10'],
  '1. poschodie': ['14', '15', '16', '17', '18'],
  '2. poschodie': ['19', '20', '21', '22', '23'],
  '3. poschodie': ['24', '25', '26', '27', '28'],
};

function buildZones(floor: string): Zone[] {
  const [r19, r20, r21, r22, r23] = FLOOR_ROOMS[floor] ?? ['19', '20', '21', '22', '23'];
  return [
    {
      id: 'wc',
      label: 'WC',
      clickable: false,
      color: 'slate',
      style: { left: '9%', top: '3%', width: '10%', height: '37%' },
    },
    {
      id: 'schodisko',
      label: 'Schodisko',
      clickable: false,
      color: 'slate',
      style: { left: '35%', top: '3%', width: '14%', height: '28%' },
    },
    {
      id: r22,
      label: `Učebňa ${r22}`,
      roomNumber: r22,
      clickable: true,
      color: 'blue',
      style: { left: '55%', top: '3%', width: '25%', height: '39%' },
    },
    {
      id: r23,
      label: `Učebňa ${r23}`,
      roomNumber: r23,
      clickable: true,
      color: 'blue',
      style: { left: '80%', top: '3%', width: '19%', height: '39%' },
    },
    {
      id: 'chodba',
      label: 'Chodba',
      clickable: false,
      color: 'slate',
      style: { left: '9%', top: '43%', width: '90%', height: '14%' },
    },
    {
      id: r19,
      label: `Učebňa ${r19}`,
      roomNumber: r19,
      clickable: true,
      color: 'blue',
      style: { left: '9%', top: '57%', width: '37%', height: '36%' },
    },
    {
      id: r20,
      label: `Učebňa ${r20}`,
      roomNumber: r20,
      clickable: true,
      color: 'blue',
      style: { left: '46%', top: '57%', width: '12%', height: '36%' },
    },
    {
      id: r21,
      label: `Učebňa ${r21}`,
      roomNumber: r21,
      clickable: true,
      color: 'blue',
      style: { left: '58%', top: '57%', width: '41%', height: '36%' },
    },
  ];
}

interface FloorPlanMapProps {
  floor?: string;
  locations?: Location[];
  selectedLocation?: string | null;
  onSelect?: (roomNumber: string) => void;
}

export default function FloorPlanMap({
  floor = '2. poschodie',
  locations = [],
  selectedLocation,
  onSelect = () => {},
}: FloorPlanMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const ZONES = buildZones(floor);

  return (
    <div className="flex items-center justify-center w-full">
      {/* Fixed aspect-ratio container matching the cropped image exactly */}
      <div
        className="relative w-full overflow-hidden rounded-[2.25rem] border border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        style={{ aspectRatio: '2250 / 1382' }}
      >
        {/* Floor plan image — fills container exactly */}
        <img
          src="/floor_2.png"
          alt={`Pôdorys ${floor}`}
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: 'fill' }}
          draggable={false}
        />

        {ZONES.map((zone) => {
          const isSelected = zone.roomNumber === selectedLocation;
          const isHovered = hoveredId === zone.id;

          let bgColor = 'transparent';
          let borderColor = 'transparent';

          if (zone.clickable) {
            if (isSelected) {
              bgColor = 'rgba(37,99,235,0.22)';
              borderColor = 'rgba(37,99,235,0.8)';
            } else if (isHovered) {
              bgColor = 'rgba(37,99,235,0.12)';
              borderColor = 'rgba(37,99,235,0.5)';
            } else {
              bgColor = 'rgba(37,99,235,0.04)';
              borderColor = 'rgba(37,99,235,0.2)';
            }
          }

          return (
            <div
              key={zone.id}
              className="absolute flex flex-col items-center justify-center transition-all duration-150"
              style={{
                ...zone.style,
                cursor: zone.clickable ? 'pointer' : 'default',
                backgroundColor: bgColor,
                border: `2px solid ${borderColor}`,
                borderRadius: '6px',
              }}
              onClick={() => zone.clickable && zone.roomNumber && onSelect(zone.roomNumber)}
              onMouseEnter={() => zone.clickable && setHoveredId(zone.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {zone.clickable ? (
                /* Always-visible classroom label */
                <div className="flex flex-col items-center gap-0.5 select-none pointer-events-none">
                  <span
                    className="font-black leading-none"
                    style={{
                      fontSize: 'clamp(10px, 2vw, 28px)',
                      color: isSelected ? 'rgb(29,78,216)' : 'rgb(30,64,175)',
                      textShadow: '0 1px 3px rgba(255,255,255,0.9)',
                    }}
                  >
                    {zone.roomNumber}
                  </span>
                  <span
                    className="font-semibold leading-none"
                    style={{
                      fontSize: 'clamp(7px, 1.1vw, 14px)',
                      color: isSelected ? 'rgb(29,78,216)' : 'rgb(71,85,105)',
                      textShadow: '0 1px 2px rgba(255,255,255,0.9)',
                    }}
                  >
                    {zone.label}
                  </span>
                </div>
              ) : (
                /* Non-clickable zone subtle label */
                <span
                  className="font-semibold uppercase tracking-widest select-none pointer-events-none"
                  style={{
                    fontSize: 'clamp(6px, 0.8vw, 11px)',
                    color: 'rgba(148,163,184,0.85)',
                  }}
                >
                  {zone.label}
                </span>
              )}
            </div>
          );
        })}

        {/* Floor badge */}
        <div className="absolute left-4 top-4 z-10 rounded-[1.25rem] border border-white/80 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-md">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Podlažie</div>
          <div className="text-lg font-bold text-slate-900 leading-tight">{floor}</div>
        </div>

        {/* Legend */}
        <div className="absolute right-4 top-4 z-10 rounded-[1.25rem] border border-white/80 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="h-3 w-3 rounded-sm border-2 border-blue-400 bg-blue-100" />
            Kliknite pre detail
          </div>
        </div>
      </div>
    </div>
  );
}
