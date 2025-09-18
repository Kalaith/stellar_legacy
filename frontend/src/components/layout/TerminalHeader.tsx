// components/layout/TerminalHeader.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { TerminalText } from '../ui/TerminalWindow';

const TerminalHeader: React.FC = () => {
  const { resources, ship, legacy } = useGameStore();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    // Round to 2 decimal places to avoid floating point precision errors
    return Number(num.toFixed(2)).toString();
  };

  const getStatusColor = (value: number, threshold: number) => {
    if (value < threshold * 0.3) return 'error';
    if (value < threshold * 0.6) return 'warning';
    return 'success';
  };

  return (
    <header className="terminal-header-main" style={{ padding: '0.5rem 1rem' }}>
      {/* Compact Title */}
      <div className="terminal-text bright" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        STELLAR LEGACY COMMAND INTERFACE
      </div>

      {/* Compact Status Display */}
      <div className="terminal-status-bar" style={{ marginBottom: '0.25rem' }}>
        <div className="terminal-status-section" style={{ marginBottom: '0.25rem' }}>
          ┌─[SYSTEM STATUS]─────────────────────────────────────────────────────────────┐
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0' }}>
          <div className="terminal-status-item">
            │ VESSEL: {ship.name.toUpperCase()} │ HULL: {ship.hull.toUpperCase()} │ LEGACY: {legacy.familyName.toUpperCase()} GEN-{legacy.generation.toString().padStart(2, '0')} │
          </div>
        </div>
        <div className="terminal-status-section" style={{ margin: '0.25rem 0' }}>
          ├─[RESOURCE MANIFEST]───────────────────────────────────────────────────────┤
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0' }}>
          <div className="terminal-resource-item">
            │ CREDITS: <TerminalText variant={getStatusColor(resources.credits, 5000)}>{formatNumber(resources.credits)}</TerminalText> │
            ENERGY: <TerminalText variant={getStatusColor(resources.energy, 1000)}>{formatNumber(resources.energy)}</TerminalText> │
            MINERAL: <TerminalText variant={getStatusColor(resources.minerals, 500)}>{formatNumber(resources.minerals)}</TerminalText> │
            FOOD: <TerminalText variant={getStatusColor(resources.food, 800)}>{formatNumber(resources.food)}</TerminalText> │
            INFLUENCE: <TerminalText variant={getStatusColor(resources.influence, 200)}>{formatNumber(resources.influence)}</TerminalText> │
          </div>
        </div>
        <div className="terminal-status-section" style={{ marginTop: '0.25rem' }}>
          └─────────────────────────────────────────────────────────────────────────────┘
        </div>
      </div>

      {/* Compact System Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginTop: '0.25rem' }}>
        <div className="terminal-text dim">
          STARDATE: {new Date().toISOString().split('T')[0].replace(/-/g, '.')}
        </div>
        <div className="terminal-text dim">
          COORD: [CLASSIFIED]
        </div>
        <div className="terminal-text success">
          STATUS: OPERATIONAL
        </div>
      </div>
    </header>
  );
};

export default TerminalHeader;