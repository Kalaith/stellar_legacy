// components/layout/TerminalTabNavigation.tsx
import React, { useMemo, useCallback } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useGenerationalMissionStore } from '../../stores/useGenerationalMissionStore';
import type { TabIdType } from '../../types/enums';

const TerminalTabNavigation: React.FC = React.memo(() => {
  const { currentTab, switchTab } = useGameStore();
  const { activeMissions } = useGenerationalMissionStore();

  const tabs = useMemo(() => [
    { id: 'dashboard' as TabIdType, label: 'DASHBOARD', category: 'CORE' },
    { id: 'ship-builder' as TabIdType, label: 'SHIP BUILDER', category: 'CORE' },
    { id: 'crew-quarters' as TabIdType, label: 'CREW QUARTERS', category: 'CORE' },
    { id: 'galaxy-map' as TabIdType, label: 'GALAXY MAP', category: 'CORE' },
    { id: 'market' as TabIdType, label: 'MARKET', category: 'CORE' },
    { id: 'legacy' as TabIdType, label: 'LEGACY', category: 'CORE' },
    { id: 'mission-command' as TabIdType, label: 'MISSION COMMAND', category: 'GENERATIONAL', alert: activeMissions.length > 0 },
    { id: 'dynasty-hall' as TabIdType, label: 'DYNASTY HALL', category: 'GENERATIONAL' },
    { id: 'sect-relations' as TabIdType, label: 'SECT RELATIONS', category: 'GENERATIONAL' },
    { id: 'cultural-evolution' as TabIdType, label: 'CULTURAL EVOLUTION', category: 'GENERATIONAL' }
  ], [activeMissions.length]);

  const handleTabSwitch = useCallback((tabId: TabIdType) => {
    switchTab(tabId);
  }, [switchTab]);

  const coreTabsWidth = 50;
  const genTabsWidth = 60;

  return (
    <nav className="terminal-navigation">
      {/* Core Systems Section */}
      <div className="terminal-nav-section">
        <div className="terminal-nav-header">
          ┌─[CORE SYSTEMS]{"─".repeat(coreTabsWidth - 15)}┐
        </div>
        <div className="terminal-nav-content">
          <div className="terminal-nav-grid">
            {tabs.filter(tab => tab.category === 'CORE').map((tab, index) => {
              const isActive = currentTab === tab.id;
              const tabDisplay = tab.label.padEnd(15);

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`terminal-nav-item ${
                    isActive ? 'active' : 'inactive'
                  }`}
                >
                  │ {isActive ? '►' : ' '} {tabDisplay} │
                </button>
              );
            })}
          </div>
        </div>
        <div className="terminal-nav-footer">
          └{"─".repeat(coreTabsWidth)}┘
        </div>
      </div>

      {/* Generational Systems Section */}
      <div className="terminal-nav-section">
        <div className="terminal-nav-header">
          ┌─[GENERATIONAL SYSTEMS]{"─".repeat(genTabsWidth - 23)}┐
        </div>
        <div className="terminal-nav-content">
          <div className="terminal-nav-grid">
            {tabs.filter(tab => tab.category === 'GENERATIONAL').map((tab, index) => {
              const isActive = currentTab === tab.id;
              const hasAlert = tab.alert;
              const tabDisplay = tab.label.padEnd(20);

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`terminal-nav-item ${
                    isActive ? 'active' : 'inactive'
                  } ${
                    hasAlert ? 'alert' : ''
                  }`}
                >
                  │ {isActive ? '►' : ' '} {tabDisplay} {hasAlert ? '[!]' : '   '} │
                </button>
              );
            })}
          </div>
        </div>
        <div className="terminal-nav-footer">
          └{"─".repeat(genTabsWidth)}┘
        </div>
      </div>

      {/* Command Line Indicator */}
      <div className="terminal-command-line">
        <div className="terminal-text dim">
          CURRENT SYSTEM: [{currentTab.toUpperCase().replace('-', '_')}] │ AWAITING COMMANDS...
        </div>
      </div>
    </nav>
  );
});

TerminalTabNavigation.displayName = 'TerminalTabNavigation';

export default TerminalTabNavigation;