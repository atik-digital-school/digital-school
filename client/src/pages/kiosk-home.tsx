import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
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

  // TODO: Remove mock data when database is fixed
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

  const locations = mockLocations;
  const isLoadingLocations = false;
  const floors = ['Prízemie', '1. poschodie', '2. poschodie', '3. poschodie', '4. poschodie'];

  const resetKiosk = useCallback(() => {
    setSearchQuery('');
    setActiveFloor('1. poschodie');
    setSelectedLocation(null);
    setShowRoute(false);
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

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.roomNumber.includes(searchQuery) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickAccess = (id: string) => {
    const location = locations.find(loc => 
      loc.name.toLowerCase().includes(id) || 
      loc.type.toLowerCase().includes(id)
    );
    if (location) {
      setSelectedLocation(location);
    }
    updateActivity();
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    updateActivity();
  };

  const handleShowRoute = () => {
    setShowRoute(true);
    setSelectedLocation(null);
    updateActivity();
  };

  if (isIdle) {
    return <IdleScreen onActivate={handleActivate} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b-2 border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={schoolLogo} alt="School Logo" className="w-16 h-16 object-contain" data-testid="img-header-logo" />
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-header-title">SPŠ stavebná a geodetická</h1>
            <p className="text-lg text-muted-foreground">Navigácia v budove školy</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-semibold" data-testid="text-current-time">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-lg text-muted-foreground">
              {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={resetKiosk}
            className="w-16 h-16"
            data-testid="button-start-over"
          >
            <RotateCcw className="h-8 w-8" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8 space-y-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {isLoadingLocations && (
            <div className="text-center py-12">
              <div className="text-2xl text-muted-foreground">Načítava sa...</div>
            </div>
          )}

          {!searchQuery && !showRoute && !isLoadingLocations && (
            <>
              <section>
                <h2 className="text-3xl font-semibold mb-6" data-testid="text-quick-access-title">
                  Rýchly prístup
                </h2>
                <QuickAccessGrid onSelect={handleQuickAccess} />
              </section>

              <section>
                <h2 className="text-3xl font-semibold mb-6" data-testid="text-browse-title">
                  Prehľad podľa poschodia
                </h2>
                <FloorSelector 
                  floors={floors} 
                  activeFloor={activeFloor} 
                  onFloorChange={setActiveFloor} 
                />
              </section>
            </>
          )}

          {searchQuery && (
            <section>
              <h2 className="text-3xl font-semibold mb-6" data-testid="text-search-results-title">
                Výsledky vyhľadávania ({filteredLocations.length})
              </h2>
              <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      onClick={() => handleLocationClick(location)}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center text-2xl text-muted-foreground" data-testid="text-no-results">
                    Nenašli sa žiadne výsledky
                  </div>
                )}
              </div>
            </section>
          )}

          {showRoute && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold" data-testid="text-route-title">
                  Trasa k cieľu
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setShowRoute(false)}
                  className="h-14 px-6 text-xl"
                  data-testid="button-close-route"
                >
                  Zavrieť mapu
                </Button>
              </div>
              <FloorMap floor={activeFloor} selectedLocation="202" />
            </section>
          )}

          {!searchQuery && !showRoute && !isLoadingLocations && (
            <section>
              <h2 className="text-3xl font-semibold mb-6" data-testid="text-floor-map-title">
                Mapa - {activeFloor}
              </h2>
              <FloorMap floor={activeFloor} />
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
