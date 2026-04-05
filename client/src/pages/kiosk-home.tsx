import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles, Building2, Map as MapIcon } from 'lucide-react';
import IdleScreen from '@/components/IdleScreen';
import SearchBar from '@/components/SearchBar';
import QuickAccessGrid from '@/components/QuickAccessGrid';
import FloorSelector from '@/components/FloorSelector';
import LocationCard, { type Location } from '@/components/LocationCard';
import FloorMap from '@/components/FloorMap';
import LocationDetail from '@/components/LocationDetail';
import schoolLogo from '@assets/generated_images/School_logo_icon_4eb4a5ce.png';

const IDLE_TIMEOUT = 60000;

export default function KioskHome() {
  const [isIdle, setIsIdle] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFloor, setActiveFloor] = useState('1. poschodie');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [routeLocation, setRouteLocation] = useState<Location | null>(null);
  const [quickAccessFilter, setQuickAccessFilter] = useState<string | null>(null);

  const mockLocations: Location[] = [
    { id: '5', name: 'Učebňa 5', roomNumber: '5', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
    { id: '6', name: 'Učebňa 6', roomNumber: '6', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
    { id: '7', name: 'Učebňa 7', roomNumber: '7', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
    { id: '8', name: 'Učebňa 8', roomNumber: '8', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
    { id: '9', name: 'Učebňa 9', roomNumber: '9', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
    { id: '10', name: 'Učebňa 10', roomNumber: '10', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
    { id: '11', name: 'Učebňa 11', roomNumber: '11', floor: '1. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '12', name: 'Učebňa 12', roomNumber: '12', floor: '1. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '13', name: 'Učebňa 13', roomNumber: '13', floor: '1. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '14', name: 'Učebňa 14', roomNumber: '14', floor: '1. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '15', name: 'Učebňa 15', roomNumber: '15', floor: '1. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '16', name: 'Učebňa 16', roomNumber: '16', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '17', name: 'Učebňa 17', roomNumber: '17', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '18', name: 'Učebňa 18', roomNumber: '18', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '19', name: 'Učebňa 19', roomNumber: '19', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '20', name: 'Učebňa 20', roomNumber: '20', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '21', name: 'Učebňa 21', roomNumber: '21', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '22', name: 'Učebňa 22', roomNumber: '22', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '23', name: 'Učebňa 23', roomNumber: '23', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '24', name: 'Učebňa 24', roomNumber: '24', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '25', name: 'Učebňa 25', roomNumber: '25', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '26', name: 'Učebňa 26', roomNumber: '26', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '27', name: 'Učebňa 27', roomNumber: '27', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '28', name: 'Učebňa 28', roomNumber: '28', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '29', name: 'Učebňa 29', roomNumber: '29', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '30', name: 'Učebňa 30', roomNumber: '30', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
    { id: '401', name: 'Riaditeľstvo', roomNumber: '401', floor: '4. poschodie', type: 'office', description: 'Školská administratíva a vedenie školy' },
    { id: '402', name: 'Sekretariát', roomNumber: '402', floor: '4. poschodie', type: 'office', description: 'Administratívne služby' },
    { id: '403', name: 'Zborovňa', roomNumber: '403', floor: '4. poschodie', type: 'office', description: 'Miestnosť pre učiteľov' },
  ];

  const {
    data: locations = mockLocations,
    isLoading: isLoadingLocations,
  } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/locations');
      return res.json();
    },
  });

  const floors = ['Prízemie', '1. poschodie', '2. poschodie', '3. poschodie', '4. poschodie'];

  const resetKiosk = useCallback(() => {
    setSearchQuery('');
    setActiveFloor('1. poschodie');
    setSelectedLocation(null);
    setRouteLocation(null);
    setShowRoute(false);
    setQuickAccessFilter(null);
    setIsIdle(true);
  }, []);

  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    if (isIdle) return;

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > IDLE_TIMEOUT) {
        resetKiosk();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isIdle, lastActivity, resetKiosk]);

  useEffect(() => {
    if (!isIdle) {
      const handleActivity = () => updateActivity();

      window.addEventListener('click', handleActivity);
      window.addEventListener('touchstart', handleActivity);
      window.addEventListener('keypress', handleActivity);

      return () => {
        window.removeEventListener('click', handleActivity);
        window.removeEventListener('touchstart', handleActivity);
        window.removeEventListener('keypress', handleActivity);
      };
    }
  }, [isIdle, updateActivity]);

  const handleActivate = () => {
    setIsIdle(false);
    updateActivity();
  };

  const filteredLocations = locations.filter((location) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return true;

    return (
        location.name.toLowerCase().includes(query) ||
        location.roomNumber.toLowerCase().includes(query) ||
        location.type.toLowerCase().includes(query) ||
        location.floor.toLowerCase().includes(query) ||
        (location.description ?? '').toLowerCase().includes(query)
    );
  });

  const classroomLocations = [...locations]
      .filter((location) => location.type === 'classroom')
      .sort((a, b) => Number(a.roomNumber) - Number(b.roomNumber));

  const handleQuickAccess = (id: string) => {
    setSelectedLocation(null);
    setRouteLocation(null);
    setShowRoute(false);

    if (id === 'classroom') {
      setQuickAccessFilter('classroom');
      setSearchQuery('');
      setActiveFloor('Prízemie');
      updateActivity();
      return;
    }

    setQuickAccessFilter(null);

    const location = locations.find(
        (loc) =>
            loc.name.toLowerCase().includes(id.toLowerCase()) ||
            loc.type.toLowerCase().includes(id.toLowerCase()),
    );

    if (location) {
      setSelectedLocation(location);
      setActiveFloor(location.floor);
    }

    updateActivity();
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setActiveFloor(location.floor);
    updateActivity();
  };

  const handleShowRoute = (location: Location) => {
    setRouteLocation(location);
    setActiveFloor(location.floor);
    setShowRoute(true);
    setSelectedLocation(null);
    updateActivity();
  };

  if (isIdle) {
    return <IdleScreen onActivate={handleActivate} />;
  }

  const locationsOnActiveFloor = locations.filter((loc) => loc.floor === activeFloor);
  const showingSearchResults = searchQuery.trim().length > 0;
  const showingClassroomList =
      quickAccessFilter === 'classroom' && !showingSearchResults && !showRoute;

  return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.10),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.08),_transparent_22%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,250,252,0.96))]" />

        <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 px-8 py-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-3 shadow-lg">
                <img
                    src={schoolLogo}
                    alt="School Logo"
                    className="h-16 w-16 object-contain"
                    data-testid="img-header-logo"
                />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  <Sparkles className="h-4 w-4" />
                  Interaktívny informačný kiosk
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900" data-testid="text-header-title">
                  SPŠ stavebná a geodetická
                </h1>

                <p className="text-lg text-slate-500">Navigácia v budove školy</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-[1.5rem] border border-white/70 bg-white/85 px-5 py-3 text-right shadow-lg">
                <div className="text-2xl font-semibold leading-none text-slate-900" data-testid="text-current-time">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="mt-2 text-base text-slate-500">
                  {new Date().toLocaleDateString([], {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>

              <Button
                  size="icon"
                  variant="outline"
                  onClick={resetKiosk}
                  className="h-16 w-16 rounded-[1.5rem] border-white/70 bg-white/85 shadow-lg hover:bg-white"
                  data-testid="button-start-over"
              >
                <RotateCcw className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl space-y-8 p-8">
            <SearchBar
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value);
                  if (value.trim()) {
                    setQuickAccessFilter(null);
                    setShowRoute(false);
                  }
                }}
            />

            {isLoadingLocations && (
                <div className="rounded-[2rem] border border-white/70 bg-white/80 py-16 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
                  <div className="text-2xl text-slate-500">Načítava sa...</div>
                </div>
            )}

            {!searchQuery && !showRoute && !isLoadingLocations && (
                <>
                  <section className="rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                    <h2 className="mb-2 text-3xl font-semibold text-slate-900" data-testid="text-quick-access-title">
                      Rýchly prístup
                    </h2>
                    <p className="mb-6 text-lg text-slate-500">
                      Vyberte si najčastejšie hľadané miesta jedným dotykom.
                    </p>
                    <QuickAccessGrid onSelect={handleQuickAccess} />
                  </section>

                  {!showingClassroomList && (
                      <section className="rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                        <h2 className="mb-2 text-3xl font-semibold text-slate-900" data-testid="text-browse-title">
                          Prehľad podľa poschodia
                        </h2>
                        <p className="mb-6 text-lg text-slate-500">
                          Zobrazte mapu konkrétneho podlažia a kliknite na miestnosť.
                        </p>
                        <FloorSelector
                            floors={floors}
                            activeFloor={activeFloor}
                            onFloorChange={(floor) => {
                              setQuickAccessFilter(null);
                              setActiveFloor(floor);
                            }}
                        />
                      </section>
                  )}
                </>
            )}

            {showingSearchResults && (
                <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                  <h2 className="mb-2 text-3xl font-semibold text-slate-900" data-testid="text-search-results-title">
                    Výsledky vyhľadávania ({filteredLocations.length})
                  </h2>
                  <p className="mb-6 text-lg text-slate-500">
                    Vyberte miestnosť zo zoznamu pre zobrazenie detailu.
                  </p>

                  <div className="space-y-3">
                    {filteredLocations.length > 0 ? (
                        filteredLocations.map((location) => (
                            <LocationCard
                                key={location.id}
                                location={location}
                                onClick={() => handleLocationClick(location)}
                            />
                        ))
                    ) : (
                        <div
                            className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 p-12 text-center text-2xl text-slate-500"
                            data-testid="text-no-results"
                        >
                          Nenašli sa žiadne výsledky
                        </div>
                    )}
                  </div>
                </section>
            )}

            {showingClassroomList && (
                <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-3xl font-semibold text-slate-900" data-testid="text-classroom-list-title">
                        Zoznam všetkých učební
                      </h2>
                      <p className="mt-2 text-lg text-slate-500">
                        Po kliknutí na učebňu sa zobrazí detail a môžete spustiť navigáciu.
                      </p>
                    </div>

                    <Button
                        variant="outline"
                        className="h-12 rounded-2xl border-slate-200 bg-white px-5 text-base shadow-sm"
                        onClick={() => setQuickAccessFilter(null)}
                        data-testid="button-close-classroom-list"
                    >
                      Zobraziť poschodia
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {classroomLocations.map((location) => (
                        <LocationCard
                            key={location.id}
                            location={location}
                            onClick={() => handleLocationClick(location)}
                        />
                    ))}
                  </div>
                </section>
            )}

            {showRoute && routeLocation && (
                <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <MapIcon className="h-7 w-7 text-blue-600" />
                      <h2 className="text-3xl font-semibold text-slate-900" data-testid="text-route-title">
                        Trasa k cieľu
                      </h2>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => {
                          setShowRoute(false);
                          setRouteLocation(null);
                        }}
                        className="h-14 rounded-2xl border-slate-200 bg-white px-6 text-xl shadow-sm"
                        data-testid="button-close-route"
                    >
                      Zavrieť mapu
                    </Button>
                  </div>

                  <FloorMap
                      floor={routeLocation.floor}
                      locations={locations.filter((loc) => loc.floor === routeLocation.floor)}
                      selectedLocation={routeLocation.roomNumber}
                      onSelect={(roomNumber) => {
                        const loc = locations.find((l) => l.roomNumber === roomNumber);
                        if (loc) {
                          setSelectedLocation(loc);
                        }
                      }}
                  />
                </section>
            )}

            {!searchQuery && !showRoute && !isLoadingLocations && !showingClassroomList && (
                <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                  <div className="mb-6 flex items-center gap-3">
                    <Building2 className="h-7 w-7 text-blue-600" />
                    <h2 className="text-3xl font-semibold text-slate-900" data-testid="text-floor-map-title">
                      Mapa - {activeFloor}
                    </h2>
                  </div>

                  <FloorMap
                      floor={activeFloor}
                      locations={locationsOnActiveFloor}
                      selectedLocation={selectedLocation?.roomNumber ?? null}
                      onSelect={(roomNumber) => {
                        const loc = locations.find((l) => l.roomNumber === roomNumber);
                        if (loc) {
                          setSelectedLocation(loc);
                        }
                      }}
                  />
                </section>
            )}
          </div>
        </main>

        <LocationDetail
            location={selectedLocation}
            open={!!selectedLocation}
            onClose={() => setSelectedLocation(null)}
            onShowRoute={handleShowRoute}
        />
      </div>
  );
}