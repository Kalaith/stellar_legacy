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
import LegacyRelations from './components/game/LegacyRelations';
import CulturalEvolution from './components/game/CulturalEvolution';
import { ChronicleViewer } from './components/chronicle/ChronicleViewer';
import { HeritageSelector } from './components/chronicle/HeritageSelector';
import { TimeController } from './components/pacing/TimeController';
import NotificationSystem from './components/ui/NotificationSystem';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/terminal.css';

const App: React.FC = () => {
  const {
    currentTab,
    initializeGame,
    dynasties,
    dynastyAction,
    legacyRelations,
    playerLegacy,
    playerLegacyAffinity,
    legacyAction,
    culturalEvolution,
    currentGeneration,
    culturalAction,
    initializeDynasties,
    // Chronicle system
    loadChronicle,
    availableHeritageModifiers,
    generateHeritageModifiers,
    selectHeritageModifiers,
    applyHeritageModifiers,
    // Pacing system
    pacingState,
    updatePacingState,
    updatePacingPreferences,
    pauseTime,
    resumeTime,
  } = useGameStore();

  useEffect(() => {
    initializeGame();
    loadChronicle(); // Load chronicle on startup

    // Initialize dynasties if none exist
    if (dynasties.length === 0) {
      initializeDynasties('preservers'); // Default to preservers legacy
    }

    return () => {
      // Cleanup on unmount
      useGameStore.getState().cleanup();
    };
  }, [initializeGame, dynasties.length, initializeDynasties, loadChronicle]);

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
      case 'legacy-relations':
        return (
          <LegacyRelations
            legacyRelations={legacyRelations}
            playerLegacy={playerLegacy}
            playerLegacyAffinity={playerLegacyAffinity}
            onLegacyAction={legacyAction}
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
      case 'chronicle':
        return (
          <div className="space-y-6">
            <ChronicleViewer onHeritageGenerate={generateHeritageModifiers} />
            {availableHeritageModifiers.length > 0 && (
              <HeritageSelector
                availableModifiers={availableHeritageModifiers}
                onSelectionChange={selectHeritageModifiers}
                onApply={applyHeritageModifiers}
              />
            )}
            {pacingState && (
              <TimeController
                pacingState={pacingState}
                onPacingChange={changes => updatePacingState(changes)}
                onPreferencesChange={updatePacingPreferences}
                onEmergencyPause={pauseTime}
                onForceResume={resumeTime}
              />
            )}
          </div>
        );
      default:
        return <TerminalDashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen"
        style={{
          background: 'var(--terminal-bg)',
          color: 'var(--terminal-primary)',
        }}
      >
        <TerminalHeader />
        <TerminalTabNavigation />
        <main className="container mx-auto px-4">{renderCurrentTab()}</main>
        <NotificationSystem />
      </div>
    </ErrorBoundary>
  );
};

export default App;
