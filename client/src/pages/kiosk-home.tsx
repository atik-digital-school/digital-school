import { useState, useEffect, useCallback } from 'react';
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

const floors = ['Prízemie', '1. poschodie', '2. poschodie', '3. poschodie'];

const mockLocations: Location[] = [
  { id: '101', name: 'Riaditeľstvo', roomNumber: '101', floor: 'Prízemie', type: 'office', description: 'Školská administratíva a recepcia' },
  { id: '102', name: 'Informačné centrum', roomNumber: '102', floor: 'Prízemie', type: 'facility', description: 'Informácie pre študentov' },
  { id: '103', name: 'Sekretariát', roomNumber: '103', floor: 'Prízemie', type: 'office', description: 'Administratívne služby' },
  { id: '201', name: 'Stavebná geodézia', roomNumber: '201', floor: '1. poschodie', type: 'department', description: 'Oddelenie stavebnej geodézie' },
  { id: '202', name: 'Pozemné staviteľstvo', roomNumber: '202', floor: '1. poschodie', type: 'department', description: 'Oddelenie pozemného staviteľstva' },
  { id: '203', name: 'Laboratórium A', roomNumber: '203', floor: '1. poschodie', type: 'classroom', description: 'Odborné laboratórium' },
  { id: '204', name: 'Počítačová učebňa', roomNumber: '204', floor: '1. poschodie', type: 'classroom', description: 'Výpočtová technika' },
  { id: '301', name: 'Kreslica 1', roomNumber: '301', floor: '2. poschodie', type: 'classroom', description: 'Učebňa technického kreslenia' },
  { id: '302', name: 'Kreslica 2', roomNumber: '302', floor: '2. poschodie', type: 'classroom', description: 'Učebňa technického kreslenia' },
  { id: '303', name: 'Laboratórium B', roomNumber: '303', floor: '2. poschodie', type: 'classroom', description: 'Odborné laboratórium' },
  { id: '401', name: 'Telocvičňa', roomNumber: '401', floor: '3. poschodie', type: 'facility', description: 'Športové zariadenie' },
  { id: '402', name: 'Aula', roomNumber: '402', floor: '3. poschodie', type: 'facility', description: 'Spoločenská miestnosť' },
];

export default function KioskHome() {
  const [isIdle, setIsIdle] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFloor, setActiveFloor] = useState('1. poschodie');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

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

  const filteredLocations = mockLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.roomNumber.includes(searchQuery) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickAccess = (id: string) => {
    const location = mockLocations.find(loc => 
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

          {!searchQuery && !showRoute && (
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

          {!searchQuery && !showRoute && (
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
