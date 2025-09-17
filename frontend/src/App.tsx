// App.tsx
import React, { useEffect } from 'react';
import { useGameStore } from './stores/useGameStore';
import TerminalHeader from './components/layout/TerminalHeader';
import TerminalTabNavigation from './components/layout/TerminalTabNavigation';
import TerminalDashboard from './components/game/TerminalDashboard';
import ShipBuilder from './components/game/ShipBuilder';
import CrewQuarters from './components/game/CrewQuarters';
import GalaxyMap from './components/game/galaxymap/GalaxyMap';
import Market from './components/game/market/Market';
import Legacy from './components/game/legacy/Legacy';
import { MissionCommandCenter } from './components/game/missions/MissionCommandCenter';
import NotificationSystem from './components/ui/NotificationSystem';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/terminal.css';

const App: React.FC = () => {
  const { currentTab, initializeGame } = useGameStore();

  useEffect(() => {
    initializeGame();
    
    return () => {
      // Cleanup on unmount
      useGameStore.getState().cleanup();
    };
  }, [initializeGame]);

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <TerminalDashboard />;
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
      case 'mission-command':
        return <MissionCommandCenter />;
      case 'dynasty-hall':
        return <div className="terminal-content"><h2 className="terminal-h2">Dynasty Hall - Coming Soon</h2></div>;
      case 'sect-relations':
        return <div className="terminal-content"><h2 className="terminal-h2">Sect Relations - Coming Soon</h2></div>;
      case 'cultural-evolution':
        return <div className="terminal-content"><h2 className="terminal-h2">Cultural Evolution - Coming Soon</h2></div>;
      default:
        return <TerminalDashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ background: 'var(--terminal-bg)', color: 'var(--terminal-primary)' }}>
        <TerminalHeader />
        <TerminalTabNavigation />
        <main className="container mx-auto px-4">
          {renderCurrentTab()}
        </main>
        <NotificationSystem />
      </div>
    </ErrorBoundary>
  );
};

export default App;
