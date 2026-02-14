// components/layout/TerminalTabNavigation.tsx
import React, { useMemo, useCallback } from 'react';
import { useTabNavigation } from '../../hooks/useTabNavigation';
import { generateTerminalBorder } from '../../utils/terminalBorders';
import { useGameStore } from '../../stores/useGameStore';
import type { TabIdType } from '../../types/enums';

// Memoized icon mapping to prevent recreation
const tabIcons = {
  dashboard: '⊡', // Console/Dashboard
  'ship-builder': '⚙', // Engineering
  'crew-quarters': '◈', // Crew/Personnel
  'galaxy-map': '※', // Navigation/Map
  market: '⟐', // Commerce
  legacy: '⟡', // Legacy/Records
  'mission-command': '⟐', // Command
  'dynasty-hall': '⬢', // Dynasty
  'legacy-relations': '◎', // Legacy Relations
  'cultural-evolution': '⟡', // Culture
  chronicle: '⟬', // Chronicle/History
} as const;

const TerminalTabNavigation: React.FC = React.memo(() => {
  // Selective subscriptions to prevent unnecessary re-renders
  const currentTab = useGameStore(state => state.currentTab);
  const switchTab = useGameStore(state => state.switchTab);

  const { coreSystemTabs, generationalTabs } = useTabNavigation();

  // Memoized icon getter
  const getTabIcon = useCallback((tabId: TabIdType): string => {
    return tabId in tabIcons ? tabIcons[tabId as keyof typeof tabIcons] : '▫';
  }, []);

  // Memoized tab switch handler
  const handleTabSwitch = useCallback(
    (tabId: TabIdType) => {
      switchTab(tabId);
    },
    [switchTab]
  );

  // Memoized border generation to prevent recreation
  const coreSystemBorder = useMemo(() => generateTerminalBorder('CORE SYSTEMS', 65), []);
  const generationalBorder = useMemo(() => generateTerminalBorder('GENERATIONAL SYSTEMS', 80), []);

  // Memoized style objects
  const navStyles = useMemo(
    () => ({
      navigation: { padding: '0.5rem 1rem', display: 'block' as const },
      container: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start' as const,
      },
      section: { flex: '1', maxWidth: '50%' },
      header: { marginBottom: '0.25rem' },
      tabContainer: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '0.5rem',
        padding: '0.25rem 0.5rem',
      },
      statusContainer: {
        textAlign: 'center' as const,
        marginTop: '0.5rem',
        fontSize: '0.75rem',
      },
    }),
    []
  );

  // Memoized tab button style generator
  const getTabButtonStyle = useCallback(
    (isActive: boolean, hasAlert = false) => ({
      padding: '0.5rem 1rem',
      border: `1px solid ${isActive ? '#FFB000' : hasAlert ? '#FF3300' : '#444444'}`,
      background: isActive
        ? 'rgba(255, 176, 0, 0.1)'
        : hasAlert
          ? 'rgba(255, 51, 0, 0.1)'
          : 'transparent',
      color: isActive ? '#FFB000' : hasAlert ? '#FF3300' : '#AA7700',
      fontSize: '0.85rem',
      fontFamily: 'monospace',
      whiteSpace: 'nowrap' as const,
      flex: 'none',
      display: 'inline-block',
    }),
    []
  );

  return (
    <nav className="terminal-navigation" style={navStyles.navigation}>
      {/* Side-by-Side Vertical Navigation */}
      <div style={navStyles.container}>
        {/* Core Systems - Horizontal Tabs */}
        <div className="terminal-nav-section" style={navStyles.section}>
          <div className="terminal-nav-header" style={navStyles.header}>
            {coreSystemBorder.top}
          </div>
          <div style={navStyles.tabContainer}>
            {coreSystemTabs.map(tab => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`terminal-nav-item ${isActive ? 'active' : ''}`}
                  style={getTabButtonStyle(isActive)}
                >
                  {getTabIcon(tab.id)} {tab.label}
                </button>
              );
            })}
          </div>
          <div className="terminal-nav-footer">{coreSystemBorder.bottom}</div>
        </div>

        {/* Generational Systems - Horizontal Tabs */}
        <div className="terminal-nav-section" style={navStyles.section}>
          <div className="terminal-nav-header" style={navStyles.header}>
            {generationalBorder.top}
          </div>
          <div style={navStyles.tabContainer}>
            {generationalTabs.map(tab => {
              const isActive = currentTab === tab.id;
              const hasAlert = tab.alert;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`terminal-nav-item ${isActive ? 'active' : ''} ${hasAlert ? 'alert' : ''}`}
                  style={getTabButtonStyle(isActive, hasAlert)}
                >
                  {getTabIcon(tab.id)} {tab.label} {hasAlert ? ' [!]' : ''}
                </button>
              );
            })}
          </div>
          <div className="terminal-nav-footer">{generationalBorder.bottom}</div>
        </div>
      </div>

      {/* Compact Command Line Indicator */}
      <div style={navStyles.statusContainer}>
        <div className="terminal-text dim">
          ACTIVE: [{currentTab.toUpperCase().replace('-', '_')}] │ STATUS: READY
        </div>
      </div>
    </nav>
  );
});

TerminalTabNavigation.displayName = 'TerminalTabNavigation';

export default TerminalTabNavigation;
