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
import DynastyHall from './components/game/DynastyHall';
import SectRelations from './components/game/SectRelations';
import CulturalEvolution from './components/game/CulturalEvolution';
import NotificationSystem from './components/ui/NotificationSystem';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/terminal.css';

const App: React.FC = () => {
  const {
    currentTab,
    initializeGame,
    dynasties,
    dynastyAction,
    sectRelations,
    playerSect,
    playerSectAffinity,
    sectAction,
    culturalEvolution,
    currentGeneration,
    culturalAction,
    initializeDynasties
  } = useGameStore();

  useEffect(() => {
    initializeGame();

    // Initialize dynasties if none exist
    if (dynasties.length === 0) {
      initializeDynasties('preservers'); // Default to preservers sect
    }

    return () => {
      // Cleanup on unmount
      useGameStore.getState().cleanup();
    };
  }, [initializeGame, dynasties.length, initializeDynasties]);

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
        return <DynastyHall dynasties={dynasties} onDynastyAction={dynastyAction} />;
      case 'sect-relations':
        return (
          <SectRelations
            sectRelations={sectRelations}
            playerSect={playerSect}
            playerSectAffinity={playerSectAffinity}
            onSectAction={sectAction}
          />
        );
      case 'cultural-evolution':
        return (
          <CulturalEvolution
            culturalEvolution={culturalEvolution}
            currentGeneration={currentGeneration}
            onCulturalAction={culturalAction}
          />
        );
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
