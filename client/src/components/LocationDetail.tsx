import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Navigation, QrCode, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Location } from './LocationCard';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import QRCodeCanvas from './QRCodeCanvas';

interface LocationDetailProps {
  location: Location | null;
  open: boolean;
  onClose: () => void;
  onShowRoute: (location: Location) => void;
}

function buildNavigateUrl(location: Location): string {
  const params = new URLSearchParams({
    room: location.roomNumber,
    floor: location.floor,
    name: location.name,
    type: location.type || 'classroom',
  });

  const { hostname, port } = window.location;

  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    const portStr = port ? `:${port}` : '';
    return `http://${hostname}${portStr}/navigate?${params}`;
  }

  const portStr = port ? `:${port}` : ':3000';
  return `http://localhost${portStr}/navigate?${params}`;
}

async function getLocalNetworkUrl(location: Location): Promise<string> {
  const params = new URLSearchParams({
    room: location.roomNumber,
    floor: location.floor,
    name: location.name,
    type: location.type || 'classroom',
  });

  const { hostname, port } = window.location;

  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    const portStr = port ? `:${port}` : '';
    return `http://${hostname}${portStr}/navigate?${params}`;
  }

  try {
    const ip = await getLocalIP();
    if (ip) {
      const portStr = port ? `:${port}` : ':3000';
      return `http://${ip}${portStr}/navigate?${params}`;
    }
  } catch {
    // ignore
  }

  const portStr = port ? `:${port}` : ':3000';
  return `http://localhost${portStr}/navigate?${params}`;
}

function getLocalIP(): Promise<string | null> {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then((offer) => pc.setLocalDescription(offer));
    pc.onicecandidate = (e) => {
      if (!e.candidate) return;
      const match = e.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
      if (match && match[1] && !match[1].startsWith('127.')) {
        pc.close();
        resolve(match[1]);
      }
    };
    // Timeout
    setTimeout(() => {
      pc.close();
      resolve(null);
    }, 1500);
  });
}

export default function LocationDetail({
                                         location,
                                         open,
                                         onClose,
                                         onShowRoute,
                                       }: LocationDetailProps) {
  const [showQR, setShowQR] = useState(false);
  const [navigateUrl, setNavigateUrl] = useState('');

  const handleShowQR = async () => {
    if (!location) return;

    if (!navigateUrl) {
      const url = await getLocalNetworkUrl(location);
      setNavigateUrl(url);
    }

    setShowQR(true);
  };

  useEffect(() => {
    if (!location) return;
    setShowQR(false);
    setNavigateUrl('');
  }, [location]);

  const { data: currentLesson, isLoading: isLoadingLesson } = useQuery({
    queryKey: ['schedule', 'current', location?.roomNumber],
    enabled: !!location?.roomNumber,
    queryFn: async () => {
      const res = await apiRequest(
          'GET',
          `/api/schedule/current?room=${encodeURIComponent(location!.roomNumber)}`
      );

      if (res.status === 404) return null;
      if (!res.ok) return null;

      return res.json();
    },
  });

  // 👇 теперь safe return ПОСЛЕ hooks
  if (!location) return null;

  return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
            className="max-w-4xl rounded-[2rem] border border-white/40 bg-white/95 p-0 shadow-2xl backdrop-blur-xl"
            data-testid="modal-location-detail"
        >
          <div className="overflow-hidden rounded-[2rem]">
            {/* Header */}
            <div className="border-b border-slate-200/80 bg-gradient-to-r from-blue-50 via-white to-slate-50 px-8 py-7">
              <DialogHeader className="space-y-3 text-left">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  Miestnosť {location.roomNumber}
                </div>
                <DialogTitle
                    className="pr-10 text-4xl font-bold tracking-tight text-slate-900"
                    data-testid="text-location-detail-name"
                >
                  {location.name}
                </DialogTitle>
                <DialogDescription className="max-w-2xl text-lg text-slate-600">
                  Detail miestnosti, kontakt a aktuálna výučba.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-6 px-8 py-8">
              {/* Current lesson */}
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <Clock className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-2xl font-semibold text-slate-900">Aktuálna hodina</div>
                    <div className="mt-2">
                      {isLoadingLesson && (
                          <div className="text-xl text-slate-500">Načítava sa rozvrh...</div>
                      )}
                      {!isLoadingLesson && !currentLesson && (
                          <div className="text-xl text-slate-500">Momentálne tu neprebieha žiadna hodina</div>
                      )}
                      {!isLoadingLesson && currentLesson && (
                          <div className="space-y-2 text-lg text-slate-600">
                            <div>Predmet: <span className="font-semibold text-slate-900">{currentLesson.subject}</span></div>
                            <div>Učiteľ: <span className="font-semibold text-slate-900">{currentLesson.teacher || 'Neznámy učiteľ'}</span></div>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location + contact */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-slate-900">Poloha</div>
                      <div className="mt-2 text-xl leading-relaxed text-slate-600">
                        Miestnosť {location.roomNumber} • {location.floor}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                      <Phone className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-slate-900">Kontakt</div>
                      <div className="mt-2 text-xl leading-relaxed text-slate-600">
                        Linka {location.roomNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {location.description && (
                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-2xl font-semibold text-slate-900">Popis</div>
                    <div className="mt-3 text-xl leading-relaxed text-slate-600">{location.description}</div>
                  </div>
              )}

              {/* QR Code panel */}
              {showQR && navigateUrl && (
                  <div className="rounded-[1.75rem] border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-xl font-bold text-slate-900 mb-1">
                          📱 QR kód – navigácia na telefóne
                        </div>
                        <div className="text-sm text-slate-500 max-w-xs leading-relaxed">
                          Naskenujte kód telefónom. Telefón musí byť pripojený na rovnakú WiFi sieť ako tento kiosk.
                        </div>
                      </div>
                      <button
                          onClick={() => setShowQR(false)}
                          className="rounded-xl p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex gap-8 items-start flex-wrap">
                      {/* QR Code */}
                      <div className="rounded-2xl bg-white p-4 shadow-md border border-slate-100 inline-flex flex-col items-center gap-3">
                        <QRCodeCanvas value={navigateUrl} size={180} />
                        <div className="text-xs text-slate-400 font-medium text-center">
                          {location.name} · {location.floor}
                        </div>
                      </div>

                      {/* URL info */}
                      <div className="flex-1 min-w-[200px]">
                        <div className="text-sm font-semibold text-slate-700 mb-2">URL navigácie:</div>
                        <div className="rounded-xl bg-slate-900 text-green-400 text-xs font-mono p-3 break-all leading-relaxed mb-4 select-all">
                          {navigateUrl}
                        </div>
                        <div className="text-sm text-slate-500 space-y-1 leading-relaxed">
                          <div>💡 <strong>Tip:</strong> Ak kód nefunguje, skontrolujte že ste na rovnakej WiFi sieti.</div>
                          <div>🔧 IP adresa sa detekuje automaticky cez WebRTC.</div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-4 pt-2">
                <Button
                    onClick={() => onShowRoute(location)}
                    className="h-16 flex-1 gap-3 rounded-[1.5rem] bg-blue-600 text-xl font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition"
                    data-testid="button-show-route"
                >
                  <Navigation className="h-6 w-6" />
                  Zobraziť trasu
                </Button>

                <Button
                    onClick={handleShowQR}
                    variant="outline"
                    className="h-16 gap-3 rounded-[1.5rem] border-2 border-slate-200 px-6 text-lg font-semibold hover:border-blue-200 hover:bg-blue-50 transition"
                    data-testid="button-show-qr"
                >
                  <QrCode className="h-6 w-6" />
                  QR kód
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}
