// components/layout/TerminalTabNavigation.tsx
import React from 'react';
import { useTabNavigation } from '../../hooks/useTabNavigation';
import { generateTerminalBorder } from '../../utils/terminalBorders';

const TerminalTabNavigation: React.FC = React.memo(() => {
  const { currentTab, coreSystemTabs, generationalTabs, handleTabSwitch } = useTabNavigation();

  // Terminal icons for different tab types
  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case 'dashboard': return '⊡';      // Console/Dashboard
      case 'ship-builder': return '⚙';   // Engineering
      case 'crew-quarters': return '◈';  // Crew/Personnel
      case 'galaxy-map': return '※';     // Navigation/Map
      case 'market': return '⟐';        // Commerce
      case 'legacy': return '⟡';        // Legacy/Records
      case 'mission-command': return '⟐'; // Command
      case 'dynasty-hall': return '⬢';   // Dynasty
      case 'legacy-relations': return '◎';  // Legacy Relations
      case 'cultural-evolution': return '⟡'; // Culture
      case 'chronicle': return '⟬';      // Chronicle/History
      default: return '▫';
    }
  };

  return (
    <nav className="terminal-navigation" style={{ padding: '0.5rem 1rem', display: 'block' }}>
      {/* Side-by-Side Vertical Navigation */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

        {/* Core Systems - Horizontal Tabs */}
        <div className="terminal-nav-section" style={{ flex: '1', maxWidth: '50%' }}>
          <div className="terminal-nav-header" style={{ marginBottom: '0.25rem' }}>
            {generateTerminalBorder('CORE SYSTEMS', 65).top}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.25rem 0.5rem' }}>
            {coreSystemTabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`terminal-nav-item ${isActive ? 'active' : ''}`}
                  style={{
                    padding: '0.5rem 1rem',
                    border: `1px solid ${isActive ? '#FFB000' : '#444444'}`,
                    background: isActive ? 'rgba(255, 176, 0, 0.1)' : 'transparent',
                    color: isActive ? '#FFB000' : '#AA7700',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                    flex: 'none',
                    display: 'inline-block'
                  }}
                >
                  {getTabIcon(tab.id)} {tab.label}
                </button>
              );
            })}
          </div>
          <div className="terminal-nav-footer">
            {generateTerminalBorder('CORE SYSTEMS', 65).bottom}
          </div>
        </div>

        {/* Generational Systems - Horizontal Tabs */}
        <div className="terminal-nav-section" style={{ flex: '1', maxWidth: '50%' }}>
          <div className="terminal-nav-header" style={{ marginBottom: '0.25rem' }}>
            {generateTerminalBorder('GENERATIONAL SYSTEMS', 80).top}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.25rem 0.5rem' }}>
            {generationalTabs.map((tab) => {
              const isActive = currentTab === tab.id;
              const hasAlert = tab.alert;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`terminal-nav-item ${isActive ? 'active' : ''} ${hasAlert ? 'alert' : ''}`}
                  style={{
                    padding: '0.5rem 1rem',
                    border: `1px solid ${isActive ? '#FFB000' : hasAlert ? '#FF3300' : '#444444'}`,
                    background: isActive ? 'rgba(255, 176, 0, 0.1)' : hasAlert ? 'rgba(255, 51, 0, 0.1)' : 'transparent',
                    color: isActive ? '#FFB000' : hasAlert ? '#FF3300' : '#AA7700',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                    flex: 'none',
                    display: 'inline-block'
                  }}
                >
                  {getTabIcon(tab.id)} {tab.label} {hasAlert ? ' [!]' : ''}
                </button>
              );
            })}
          </div>
          <div className="terminal-nav-footer">
            {generateTerminalBorder('GENERATIONAL SYSTEMS', 80).bottom}
          </div>
        </div>
      </div>

      {/* Compact Command Line Indicator */}
      <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        <div className="terminal-text dim">
          ACTIVE: [{currentTab.toUpperCase().replace('-', '_')}] │ STATUS: READY
        </div>
      </div>
    </nav>
  );
});

TerminalTabNavigation.displayName = 'TerminalTabNavigation';

export default TerminalTabNavigation;