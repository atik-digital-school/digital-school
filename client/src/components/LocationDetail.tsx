import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
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

interface LocationDetailProps {
  location: Location | null;
  open: boolean;
  onClose: () => void;
  onShowRoute: (location: Location) => void;
}

export default function LocationDetail({
                                         location,
                                         open,
                                         onClose,
                                         onShowRoute,
                                       }: LocationDetailProps) {
  if (!location) return null;

  const { data: currentLesson, isLoading: isLoadingLesson } = useQuery<
      { subject: string; teacher: string } | null
  >({
    queryKey: ['schedule', 'current', location.roomNumber],
    enabled: !!location,
    queryFn: async () => {
      try {
        const res = await apiRequest(
            'GET',
            `/api/schedule/current?room=${encodeURIComponent(location.roomNumber)}`
        );

        if (res.status === 404) {
          return null;
        }

        if (!res.ok) {
          console.error(
              'Failed to fetch current lesson',
              res.status,
              await res.text().catch(() => '')
          );
          return null;
        }

        return res.json();
      } catch (e) {
        console.error('Error fetching current lesson', e);
        return null;
      }
    },
  });

  return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
            className="max-w-4xl rounded-[2rem] border border-white/40 bg-white/95 p-0 shadow-2xl backdrop-blur-xl"
            data-testid="modal-location-detail"
        >
          <div className="overflow-hidden rounded-[2rem]">
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
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <Clock className="h-7 w-7" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-2xl font-semibold text-slate-900">
                      Aktuálna hodina
                    </div>

                    <div className="mt-2">
                      {isLoadingLesson && (
                          <div className="text-xl text-slate-500">
                            Načítava sa rozvrh...
                          </div>
                      )}

                      {!isLoadingLesson && !currentLesson && (
                          <div className="text-xl text-slate-500">
                            Momentálne tu neprebieha žiadna hodina
                          </div>
                      )}

                      {!isLoadingLesson && currentLesson && (
                          <div className="space-y-2 text-lg text-slate-600">
                            <div>
                              Predmet:{' '}
                              <span className="font-semibold text-slate-900">
                            {currentLesson.subject}
                          </span>
                            </div>
                            <div>
                              Učiteľ:{' '}
                              <span className="font-semibold text-slate-900">
                            {currentLesson.teacher || 'Neznámy učiteľ'}
                          </span>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                      <MapPin className="h-7 w-7" />
                    </div>

                    <div>
                      <div className="text-2xl font-semibold text-slate-900">
                        Poloha
                      </div>
                      <div className="mt-2 text-xl leading-relaxed text-slate-600">
                        Miestnosť {location.roomNumber} • {location.floor}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                      <Phone className="h-7 w-7" />
                    </div>

                    <div>
                      <div className="text-2xl font-semibold text-slate-900">
                        Kontakt
                      </div>
                      <div className="mt-2 text-xl leading-relaxed text-slate-600">
                        Linka {location.roomNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {location.description && (
                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-2xl font-semibold text-slate-900">Popis</div>
                    <div className="mt-3 text-xl leading-relaxed text-slate-600">
                      {location.description}
                    </div>
                  </div>
              )}

              <div className="pt-2">
                <Button
                    onClick={() => onShowRoute(location)}
                    className="h-16 w-full gap-3 rounded-[1.5rem] bg-blue-600 text-xl font-semibold shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
                    data-testid="button-show-route"
                >
                  <Navigation className="h-6 w-6" />
                  Zobraziť trasu
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}