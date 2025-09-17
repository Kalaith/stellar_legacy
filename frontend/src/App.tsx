// App.tsx
import React, { useEffect } from 'react';
import { useGameStore } from './stores/useGameStore';
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';
import Dashboard from './components/game/Dashboard';
import ShipBuilder from './components/game/ShipBuilder';
import CrewQuarters from './components/game/CrewQuarters';
import GalaxyMap from './components/game/galaxymap/GalaxyMap';
import Market from './components/game/market/Market';
import Legacy from './components/game/legacy/Legacy';
import NotificationSystem from './components/ui/NotificationSystem';

const App: React.FC = () => {
  const { currentTab, initializeGame } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'ship-builder':
        return <ShipBuilder />;
      case 'crew-quarters':
        return <CrewQuarters />;
      case 'galaxy-map':
        return <GalaxyMap />;
      case 'market':
        return <Market />;
      case 'legacy':
        return <Legacy />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <TabNavigation />
      <main className="container mx-auto">
        {renderCurrentTab()}
      </main>
      <NotificationSystem />
    </div>
  );
};

export default App;
